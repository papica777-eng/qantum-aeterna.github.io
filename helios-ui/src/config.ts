export const CONFIG = {
    // Dynamic endpoints via Vite environment variables (supports VITE_API_URL or VITE_SAAS_API_URL)
    API_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_SAAS_API_URL || "http://localhost:8890",
    WS_URL: import.meta.env.VITE_WS_URL || (import.meta.env.VITE_SAAS_API_URL ? import.meta.env.VITE_SAAS_API_URL.replace("https://", "wss://").replace("http://", "ws://") + "/ws" : "ws://localhost:8890/ws"),

    // System Parameters
    HEARTBEAT_INTERVAL: 10000,
    RECONNECT_INTERVAL: 5000
};
