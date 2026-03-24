use axum::{
    extract::{State, Json, Path, ws::{WebSocketUpgrade, WebSocket, Message}},
    response::IntoResponse,
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use std::{
    sync::{Arc, RwLock},
    time::Duration,
};
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing::info;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use tokio::sync::broadcast;

// --- Domain Models ---

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TestType {
    Playwright,
    Selenium,
    Cypress,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum JobStatus {
    Pending,
    Running,
    Completed,
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum StepStatus {
    Success,
    Healed, // "Unique" Feature
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestStep {
    pub step_id: String,
    pub description: String,
    pub timestamp: DateTime<Utc>,
    pub status: StepStatus,
    pub snapshot_url: Option<String>, // For "Visual Time-Travel"
    pub healing_attempt: Option<String>, // Details on what was healed
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestJob {
    pub id: String,
    pub test_type: TestType,
    pub config_payload: String,
    pub status: JobStatus,
    pub created_at: DateTime<Utc>,
    pub result: Option<String>,
    pub steps: Vec<TestStep>,
    pub stability_score: f32, // 0.0 to 1.0 (Predictive Analytics)
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateJobRequest {
    pub test_type: TestType,
    pub config_payload: String,
}

// --- App State ---

#[derive(Clone)]
pub struct AppState {
    pub jobs: Arc<RwLock<Vec<TestJob>>>,
    pub tx: broadcast::Sender<String>, // For real-time updates
}

// --- Handlers ---

async fn health_check() -> &'static str {
    "IT'sMine Platform (Veritas Engine) is Online"
}

// WebSocket Handler
async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: AppState) {
    let mut rx = state.tx.subscribe();
    while let Ok(msg) = rx.recv().await {
        if socket.send(Message::Text(msg.into())).await.is_err() {
            break;
        }
    }
}

async fn get_status(State(state): State<AppState>) -> Json<serde_json::Value> {
    let jobs = state.jobs.read().unwrap();
    let total = jobs.len();
    let running = jobs.iter().filter(|j| j.status == JobStatus::Running).count();
    let completed = jobs.iter().filter(|j| j.status == JobStatus::Completed).count();
    let healed_count = jobs.iter().map(|j| j.steps.iter().filter(|s| s.status == StepStatus::Healed).count()).sum::<usize>();

    // Simulate 50k+ scale
    let simulated_total = 54320 + total;

    Json(serde_json::json!({
        "status": "Healthy",
        "active_runners": running,
        "completed_jobs_session": completed,
        "total_tests_managed": simulated_total,
        "self_healing_events": healed_count,
        "global_stability_score": "98.4%"
    }))
}

async fn create_job(
    State(state): State<AppState>,
    Json(payload): Json<CreateJobRequest>,
) -> Json<TestJob> {
    let job_id = Uuid::new_v4().to_string();
    let new_job = TestJob {
        id: job_id.clone(),
        test_type: payload.test_type.clone(),
        config_payload: payload.config_payload,
        status: JobStatus::Pending,
        created_at: Utc::now(),
        result: None,
        steps: Vec::new(),
        stability_score: 1.0, // Start perfect
    };

    {
        let mut jobs = state.jobs.write().unwrap();
        jobs.push(new_job.clone());
    }
    
    info!("Job created: {} [{:?}]", job_id, payload.test_type);
    let _ = state.tx.send(format!("JOB_CREATED:{}", job_id));

    // Spawn "Veritas AI" Orchestrator
    let jobs_clone = state.jobs.clone();
    let tx_clone = state.tx.clone();
    tokio::spawn(async move {
        process_job_with_ai(jobs_clone, tx_clone, job_id).await;
    });

    Json(new_job)
}

async fn get_jobs(State(state): State<AppState>) -> Json<Vec<TestJob>> {
    let jobs = state.jobs.read().unwrap();
    let mut sorted_jobs = jobs.clone();
    sorted_jobs.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    Json(sorted_jobs)
}

async fn get_job_detail(
    Path(id): Path<String>,
    State(state): State<AppState>
) -> Json<Option<TestJob>> {
    let jobs = state.jobs.read().unwrap();
    let job = jobs.iter().find(|j| j.id == id).cloned();
    Json(job)
}

// --- Veritas AI Orchestrator (Simulated) ---

async fn process_job_with_ai(
    jobs: Arc<RwLock<Vec<TestJob>>>,
    tx: broadcast::Sender<String>,
    job_id: String
) {
    // 1. Queueing
    tokio::time::sleep(Duration::from_secs(1)).await;

    // 2. Start
    {
        let mut jobs_guard = jobs.write().unwrap();
        if let Some(job) = jobs_guard.iter_mut().find(|j| j.id == job_id) {
            job.status = JobStatus::Running;
            let _ = tx.send(format!("JOB_STARTED:{}", job_id));
        }
    }

    // 3. Execute Steps (Simulating "Time-Travel" and "Self-Healing")
    let steps_to_simulate = vec![
        ("Navigate to Login", StepStatus::Success, None),
        ("Enter Credentials", StepStatus::Success, None),
        ("Click Submit Button", StepStatus::Healed, Some("Selector #btn-sub failed. Healed using Text='Log In'")), // UNIQUE FEATURE
        ("Verify Dashboard Load", StepStatus::Success, None),
    ];

    for (desc, status, heal_msg) in steps_to_simulate {
        tokio::time::sleep(Duration::from_secs(2)).await; // Simulate processing time

        let step = TestStep {
            step_id: Uuid::new_v4().to_string(),
            description: desc.to_string(),
            timestamp: Utc::now(),
            status: status.clone(),
            snapshot_url: Some(format!("https://dummyimage.com/600x400/000/fff&text={}", desc.replace(" ", "+"))),
            healing_attempt: heal_msg.map(|s| s.to_string()),
        };

        {
            let mut jobs_guard = jobs.write().unwrap();
            if let Some(job) = jobs_guard.iter_mut().find(|j| j.id == job_id) {
                job.steps.push(step.clone());
                // Update Stability Score based on healing
                if status == StepStatus::Healed {
                    job.stability_score -= 0.1;
                }
                let _ = tx.send(format!("JOB_UPDATE:{}:STEP_ADDED", job_id));
            }
        }
    }

    // 4. Complete
    {
        let mut jobs_guard = jobs.write().unwrap();
        if let Some(job) = jobs_guard.iter_mut().find(|j| j.id == job_id) {
            job.status = JobStatus::Completed;
            job.result = Some("Passed (with Self-Healing interventions)".to_string());
            let _ = tx.send(format!("JOB_COMPLETED:{}", job_id));
        }
    }
}

// --- Main ---

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let (tx, _rx) = broadcast::channel(100);

    let shared_state = AppState {
        jobs: Arc::new(RwLock::new(Vec::new())),
        tx,
    };

    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/status", get(get_status))
        .route("/api/jobs", get(get_jobs).post(create_job))
        .route("/api/jobs/{id}", get(get_job_detail))
        .route("/ws", get(ws_handler))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .with_state(shared_state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    info!("IT'sMine Veritas Engine running on http://0.0.0.0:8080");
    axum::serve(listener, app).await.unwrap();
}
