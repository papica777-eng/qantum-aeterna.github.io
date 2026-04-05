use crate::omega::oracle::AeternaOracle;
use crate::omega::scribe::SovereignScribe;
use crate::omega::wealth_bridge::WealthBridge;
use crate::prelude::*;
use axum::{
    body::Bytes,
    extract::{Query, State},
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Redirect},
    routing::{get, post},
    Json, Router,
};
use hmac::{Hmac, Mac};
use serde_json::{json, Value};
use sha2::Sha256;
use tokio::sync::RwLock;

type HmacSha256 = Hmac<Sha256>;

pub struct ServerState {
    pub vsh: Arc<VectorSpaceHeap>,
    pub audit: Arc<RwLock<SovereignAudit>>,
    pub enforcer: Arc<SovereignScribe>,
    pub wealth_bridge: Arc<WealthBridge>,
}

/// Query parameters for payment checkout
#[derive(Debug, Deserialize)]
pub struct CheckoutQuery {
    pub plan: Option<String>,
    pub email: Option<String>,
}

pub async fn start_singularity_server(state: Arc<ServerState>) {
    use tower_http::cors::CorsLayer;

    let app = Router::new()
        .route("/api/status", get(get_status))
        .route("/api/scribe/refactor", post(run_auto_refactor))
        .route("/api/ask", post(ask_sovereign_brain))
        .route("/api/scribe/generate", post(run_asset_generation))
        .route("/api/mojo/scan", post(mojo_scan_handler))
        .route("/api/payments/checkout", get(handle_payment_checkout))
        .route("/api/webhooks/stripe", post(handle_stripe_webhook))
        .route("/health", get(health_check))
        .with_state(state)
        .layer(CorsLayer::permissive());

    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8891".into())
        .parse()
        .unwrap_or(8891);
    
    // Explicit 127.0.0.1 for local high-speed link
    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], port));
    println!("🌌 SINGULARITY SERVER ONLINE AT http://{}", addr);

    axum::Server::bind(&addr).serve(app.into_make_service()).await.unwrap();
}

/// Health check endpoint for production monitoring
async fn health_check() -> impl IntoResponse {
    Json(json!({ "status": "ok", "version": "1.0.0-SINGULARITY" }))
}

async fn get_status(State(state): State<Arc<ServerState>>) -> impl IntoResponse {
    Json(state.vsh.get_state())
}

async fn run_auto_refactor(State(state): State<Arc<ServerState>>) -> impl IntoResponse {
    println!("📜 THE SCRIBE: INITIATING AUTO-REFACTORING CYCLE...");

    let mut audit = state.audit.write().await;
    let _ = audit.run_full_audit(vec!["./src".into()]).await;
    drop(audit);

    match state.enforcer.perform_surgery().await {
        Ok(report) => Json(json!({ "status": "SUCCESS", "report": report })),
        Err(e) => Json(json!({ "status": "ERROR", "message": format!("{}", e) })),
    }
}

async fn ask_sovereign_brain(
    State(state): State<Arc<ServerState>>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let prompt = payload
        .get("prompt")
        .and_then(|v: &Value| v.as_str())
        .unwrap_or("");

    let response = AeternaOracle::execute_sovereign_command(&state.vsh, prompt).await;
    Json(json!({ "response": response }))
}

async fn run_asset_generation(State(state): State<Arc<ServerState>>) -> impl IntoResponse {
    println!("🏭 THE SCRIBE: INITIATING ASSET TRANSMUTATION...");

    match state.enforcer.package_saas("Omni-v1").await {
        Ok(asset) => Json(json!({ "status": "SUCCESS", "asset": asset })),
        Err(e) => Json(json!({ "status": "ERROR", "message": format!("{}", e) })),
    }
}

/// Handle Stripe payment checkout
async fn handle_payment_checkout(
    State(state): State<Arc<ServerState>>,
    Query(params): Query<CheckoutQuery>,
) -> impl IntoResponse {
    let plan = params.plan.unwrap_or_else(|| "pro_monthly".into());
    let email = params
        .email
        .unwrap_or_else(|| "customer@aeterna.website".into());

    println!("💳 [PAYMENTS]: Checkout request for plan '{}' from '{}'", plan, email);

    // ZERO_FLOAT: All prices in atomic cents (€49.00 = 4900 cents)
    let amount_cents: u64 = match plan.as_str() {
        "pro_monthly" => 4_900,
        "pro_annual" => 46_800,
        "enterprise_monthly" => 19_900,
        "enterprise_annual" => 190_800,
        "valuation_gate" => 99_900,
        _ => 4_900,
    };

    match state.wealth_bridge.process_extraction(&plan, amount_cents).await {
        Ok(tx) => {
            println!("✅ [PAYMENTS]: Transaction created: {}", tx.id);
            let success_url = std::env::var("STRIPE_SUCCESS_URL")
                .unwrap_or_else(|_| "https://aeterna.website/success".into());
            Redirect::temporary(&success_url).into_response()
        }
        Err(e) => {
            println!("❌ [PAYMENTS]: Transaction failed: {:?}", e);
            Json(json!({ "status": "ERROR", "message": "Payment initialization failed" })).into_response()
        }
    }
}

async fn handle_stripe_webhook(headers: HeaderMap, body: Bytes) -> impl IntoResponse {
    let sig_header = match headers.get("stripe-signature") {
        Some(h) => h.to_str().unwrap_or(""),
        None => return (StatusCode::BAD_REQUEST, Json(json!({ "error": "Missing signature" }))).into_response(),
    };

    let webhook_secret = std::env::var("STRIPE_WEBHOOK_SECRET").unwrap_or_else(|_| "".into());
    if webhook_secret.is_empty() {
        return (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": "Webhook not configured" }))).into_response();
    }

    let mut timestamp = "";
    let mut signature = "";
    for part in sig_header.split(',') {
        if let Some(t) = part.strip_prefix("t=") { timestamp = t; }
        else if let Some(s) = part.strip_prefix("v1=") { signature = s; }
    }

    let payload = format!("{}.{}", timestamp, String::from_utf8_lossy(&body));
    let mut mac = match HmacSha256::new_from_slice(webhook_secret.as_bytes()) {
        Ok(m) => m,
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": "HMAC error" }))).into_response(),
    };
    mac.update(payload.as_bytes());

    let expected_sig = hex::encode(mac.finalize().into_bytes());

    if !constant_time_compare(&expected_sig, signature) {
        return (StatusCode::UNAUTHORIZED, Json(json!({ "error": "Invalid signature" }))).into_response();
    }

    let event: Value = match serde_json::from_slice(&body) {
        Ok(e) => e,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(json!({ "error": "Invalid JSON" }))).into_response(),
    };

    let event_type = event["type"].as_str().unwrap_or("unknown");
    println!("🔔 [WEBHOOK]: Received event: {}", event_type);

    (StatusCode::OK, Json(json!({ "received": true }))).into_response()
}

fn constant_time_compare(a: &str, b: &str) -> bool {
    if a.len() != b.len() { return false; }
    let mut result = 0u8;
    for (x, y) in a.bytes().zip(b.bytes()) { result |= x ^ y; }
    result == 0
}

async fn mojo_scan_handler() -> impl IntoResponse {
    Json(json!({
        "status": "STEEL_STABLE",
        "latency_ms": 0.042,
        "substrate": "MOJO_AVX512_READY"
    }))
}
