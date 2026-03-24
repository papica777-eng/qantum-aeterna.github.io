/**
 * 🌌 SOVEREIGN API BRIDGE
 * Connects the HUD to the Rust Monolith (Axum)
 * Port: 8890
 */

const SOVEREIGN_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8890") + "/api";

export const useSovereignAPI = () => {

    const fetchStatus = async () => {
        const response = await fetch(`${SOVEREIGN_BASE}/status`);
        return await response.json();
    };

    const runRefactor = async () => {
        const response = await fetch(`${SOVEREIGN_BASE}/scribe/refactor`, {
            method: 'POST'
        });
        return await response.json();
    };

    const askOracle = async (prompt: string) => {
        const response = await fetch(`${SOVEREIGN_BASE}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        return await response.json();
    };

    const generateAssets = async () => {
        const response = await fetch(`${SOVEREIGN_BASE}/scribe/generate`, {
            method: 'POST'
        });
        return await response.json();
    };

    const createCheckoutSession = async (productId: string) => {
        const response = await fetch(`${SOVEREIGN_BASE}/market/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        });
        return await response.json();
    };

    /** SaaS Platform Endpoints **/
    const fetchSaaSApps = async () => {
        const response = await fetch(`${SOVEREIGN_BASE}/saas`);
        return await response.json();
    };

    const getSaaSMetrics = async () => {
        const response = await fetch(`${SOVEREIGN_BASE}/saas/metrics/overview`);
        return await response.json();
    };

    const executeSaaSAutomation = async (workflowName: string) => {
        const response = await fetch(`${SOVEREIGN_BASE}/saas/automation/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workflow_name: workflowName })
        });
        return await response.json();
    };

    const generateAndDeploySaaS = async (task: any, pricing: any) => {
        const response = await fetch(`${SOVEREIGN_BASE}/saas/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task, pricing })
        });
        return await response.json();
    };

    return { 
        fetchStatus, 
        runRefactor, 
        askOracle, 
        generateAssets, 
        createCheckoutSession,
        fetchSaaSApps,
        getSaaSMetrics,
        executeSaaSAutomation,
        generateAndDeploySaaS
    };
};
