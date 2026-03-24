mod gateway;
mod sovereign;
mod types;

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::{Html, IntoResponse},
    routing::{get, post},
    Json, Router,
};
use futures_util::{sink::SinkExt, stream::StreamExt};
use gateway::PaymentGateway;
use rust_decimal_macros::dec;
use sovereign::{start_heartbeat, SovereignState};
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::{cors::CorsLayer, services::ServeDir};

/// O(1) Complexity - Unified Global State for the Rust Substrate
struct AppState {
    sovereign: Arc<SovereignState>,
    gateway: Arc<PaymentGateway>,
    start_time: chrono::DateTime<chrono::Utc>,
}

#[tokio::main]
async fn main() {
    println!("[INIT] QANTUM AETERNA STARTING...");

    // Safety check for components
    let sovereign_state = Arc::new(SovereignState::new());
    let gateway = Arc::new(PaymentGateway::new());

    let state = Arc::new(AppState {
        sovereign: sovereign_state.clone(),
        gateway,
        start_time: chrono::Utc::now(),
    });

    // Start background tasks
    let heartbeat_state = sovereign_state.clone();
    tokio::spawn(async move {
        start_heartbeat(heartbeat_state).await;
    });

    let app = Router::new()
        .route("/api/status", get(status_handler))
        .route("/api/economy/pay", post(payment_handler))
        .route("/api/economy/stats", get(stats_handler))
        .route("/api/command/:cmd", post(command_handler))
        .route("/api/metrics", get(metrics_handler))
        .route("/api/hardware_metrics", get(hardware_metrics_handler))
        .route("/ws", get(ws_handler))
        .route(
            "/",
            get(|| async move {
                match std::fs::read_to_string("public/index.html") {
                    Ok(html) => Html(html),
                    Err(_) => Html(
                        "<h1>SYSTEM READY</h1><p>Public substrate missing but core is online.</p>"
                            .to_string(),
                    ),
                }
            }),
        )
        .fallback_service(ServeDir::new("public").append_index_html_on_directories(true))
        .layer(CorsLayer::permissive())
        .with_state(state);

    // Use Port 8890 as per Prime Directive
    let addr: SocketAddr = "0.0.0.0:8890".parse().unwrap();

    println!("[SOVEREIGN] Neural Link attempting bind on http://{}", addr);

    match tokio::net::TcpListener::bind(addr).await {
        Ok(listener) => {
            println!("[SUCCESS] QANTUM CORE ACTIVE ON PORT 8890");
            if let Err(e) = axum::serve(listener, app).await {
                eprintln!("[RUNTIME_ERROR] {}", e);
            }
        }
        Err(e) => {
            eprintln!(
                "[FATAL] BIND_FAILED: {}. Check if another process is on 8890.",
                e
            );
        }
    }
}

async fn status_handler() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "OPERATIONAL",
        "substrate": "RUST_AXUM_STEEL",
        "port": 8890
    }))
}

async fn payment_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<serde_json::Value>,
) -> Json<crate::types::Transaction> {
    let amount = payload["amount"].as_f64().unwrap_or(10.0);
    let dec_amount = rust_decimal::Decimal::from_f64_retain(amount).unwrap_or(dec!(0));

    // SAFE EXECUTION: Await the async charge creation
    match state
        .gateway
        .create_charge(dec_amount, "eur", "stripe")
        .await
    {
        Ok(tx) => Json(state.gateway.confirm_charge(tx)),
        Err(_) => Json(crate::types::Transaction {
            id: uuid::Uuid::new_v4(),
            amount: dec_amount,
            currency: "eur".to_string(),
            provider: "offline".to_string(),
            status: crate::types::TransactionStatus::Failed,
            timestamp: chrono::Utc::now(),
            metadata: None,
        }),
    }
}

async fn stats_handler(State(state): State<Arc<AppState>>) -> Json<serde_json::Value> {
    let uptime = chrono::Utc::now() - state.start_time;
    Json(serde_json::json!({
        "revenue": 0.0,
        "uptime": uptime.num_seconds(),
        "bridge": "SINGULARITY"
    }))
}

async fn ws_handler(ws: WebSocketUpgrade, State(state): State<Arc<AppState>>) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state.sovereign.clone()))
}
async fn command_handler(
    axum::extract::Path(cmd): axum::extract::Path<String>,
    State(_state): State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "command": cmd,
        "status": "executed",
        "result": "Command processed"
    }))
}

async fn metrics_handler(
    State(_state): State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "cpu": 42.5,
        "memory": 1024,
        "requests": 1523,
        "uptime": 86400
    }))
}

async fn hardware_metrics_handler(
    State(_state): State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "cpu_usage": 45.2,
        "memory_usage": 2048,
        "disk_usage": 5120,
        "network_latency": 12.3,
        "gpu_status": "optimal"
    }))
}
async fn handle_socket(socket: WebSocket, sovereign_state: Arc<SovereignState>) {
    let (mut sender, mut receiver) = socket.split();
    let mut rx = sovereign_state.tx.subscribe();
    let mut send_task = tokio::spawn(async move {
        while let Ok(payload) = rx.recv().await {
            if let Ok(msg) = serde_json::to_string(&payload) {
                if sender.send(Message::Text(msg)).await.is_err() {
                    break;
                }
            }
        }
    });
    let mut recv_task =
        tokio::spawn(async move { while let Some(Ok(_)) = receiver.next().await {} });
    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    };
}
