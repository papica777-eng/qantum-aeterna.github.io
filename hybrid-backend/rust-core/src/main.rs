//! AETERNA HYBRID RUST CORE
//! Ultra-fast API layer that proxies AI calls to Python

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, sync::Arc};
use tower_http::cors::CorsLayer;

#[derive(Clone)]
struct AppState {
    python_ai_url: String,
    client: reqwest::Client,
    start_time: std::time::Instant,
}

#[derive(Deserialize)]
struct CommandRequest {
    input: Option<String>,
}

#[derive(Serialize)]
struct CommandResponse {
    command: String,
    status: String,
    result: String,
}

#[derive(Serialize, Deserialize)]
struct ChatRequest {
    message: String,
}

#[tokio::main]
async fn main() {
    println!("
╔═══════════════════════════════════════════════════════════════╗
║  🚀 AETERNA HYBRID v2.0 - RUST + PYTHON MEGA ENGINE          ║
║  ⚡ Rust: Speed | 🧠 Python: AI                               ║
╚═══════════════════════════════════════════════════════════════╝
");

    let python_url = std::env::var("PYTHON_AI_URL")
        .unwrap_or_else(|_| "http://127.0.0.1:8891".to_string());

    let state = Arc::new(AppState {
        python_ai_url: python_url.clone(),
        client: reqwest::Client::new(),
        start_time: std::time::Instant::now(),
    });

    let app = Router::new()
        .route("/api/status", get(status_handler))
        .route("/api/command/:cmd", post(command_handler))
        .route("/api/metrics", get(metrics_handler))
        .route("/health", get(health_handler))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8890".to_string())
        .parse()
        .unwrap_or(8890);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("[RUST] Binding to http://{}", addr);
    println!("[RUST] Python AI at: {}", python_url);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("[SUCCESS] HYBRID ENGINE ONLINE");
    
    axum::serve(listener, app).await.unwrap();
}

async fn status_handler() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "OPERATIONAL",
        "engine": "RUST_PYTHON_HYBRID",
        "version": "2.0.0"
    }))
}

async fn health_handler() -> &'static str {
    "OK"
}

async fn metrics_handler(State(state): State<Arc<AppState>>) -> Json<serde_json::Value> {
    let uptime = state.start_time.elapsed().as_secs();
    Json(serde_json::json!({
        "uptime_seconds": uptime,
        "engine": "hybrid",
        "rust_status": "active",
        "python_status": "active"
    }))
}

async fn command_handler(
    Path(cmd): Path<String>,
    State(state): State<Arc<AppState>>,
    body: Option<Json<CommandRequest>>,
) -> impl IntoResponse {
    let input = body
        .and_then(|b| b.input.clone())
        .unwrap_or_else(|| cmd.clone());

    // Proxy to Python AI
    let ai_response = state.client
        .post(format!("{}/chat", state.python_ai_url))
        .json(&ChatRequest { message: input.clone() })
        .send()
        .await;

    match ai_response {
        Ok(resp) => {
            if let Ok(data) = resp.json::<serde_json::Value>().await {
                let result = data["response"].as_str().unwrap_or("Processing...");
                (StatusCode::OK, Json(CommandResponse {
                    command: cmd,
                    status: "success".to_string(),
                    result: result.to_string(),
                }))
            } else {
                (StatusCode::OK, Json(CommandResponse {
                    command: cmd,
                    status: "partial".to_string(),
                    result: "AI processing".to_string(),
                }))
            }
        }
        Err(e) => {
            (StatusCode::OK, Json(CommandResponse {
                command: cmd,
                status: "fallback".to_string(),
                result: format!("Local mode: {}", e),
            }))
        }
    }
}
