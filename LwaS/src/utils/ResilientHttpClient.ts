import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Logger from './Logger.ts'; // Corrected Import (Default)

// --- CONFIGURATION ---
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
const TIMEOUT_MS = 5000;

/**
 * 🧱 RESILIENT HTTP CLIENT
 * Wraps Axios with enterprise resilience patterns:
 * 1. Correlation IDs (Tracing)
 * 2. Exponential Backoff (Smart Retries)
 * 3. Jitter (Anti-Thundering Herd)
 * 4. Structured Error Handling
 */
export default class ResilientHttpClient {
    private client: AxiosInstance;
    private name: string;

    constructor(serviceName: string, baseUrl: string, apiKey?: string) {
        this.name = serviceName;
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: TIMEOUT_MS,
            headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { 'X-MBX-APIKEY': apiKey } : {})
            }
        });

        this.setupInterceptors();
    }

    /**
     * 🕵️ INTERCEPTORS: Inject tracing and log performance
     */
    private setupInterceptors() {
        this.client.interceptors.request.use(config => {
            // Debugging ID (Correlation ID)
            const correlationId = uuidv4();
            (config as any).metadata = { correlationId, startTime: Date.now() };
            Logger.info(`[${this.name}] 📤 REQ [${correlationId}] ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        });

        this.client.interceptors.response.use(
            response => {
                const { correlationId, startTime } = (response.config as any).metadata;
                const duration = Date.now() - startTime;
                Logger.info(`[${this.name}] 📥 RES [${correlationId}] ${response.status} (${duration}ms)`);
                return response;
            },
            error => Promise.reject(error)
        );
    }

    /**
     * 🚀 GENERIC GET REQUEST WITH RETRY STRATEGY
     */
    public async get<T>(endpoint: string, params: object = {}): Promise<T> {
        return this.executeWithRetry<T>(() => this.client.get(endpoint, { params }));
    }

    /**
     * 🚀 GENERIC POST REQUEST WITH RETRY STRATEGY
     */
    public async post<T>(endpoint: string, body: object = {}): Promise<T> {
        return this.executeWithRetry<T>(() => this.client.post(endpoint, body));
    }

    /**
     * ⚙️ THE RETRY ENGINE (Exponential Backoff + Jitter)
     */
    private async executeWithRetry<T>(operation: () => Promise<any>): Promise<T> {
        let attempt = 0;

        while (attempt < MAX_RETRIES) {
            try {
                const response = await operation();
                return response.data;
            } catch (error: any) {
                attempt++;
                const isCritical = this.isCriticalError(error);

                if (isCritical || attempt >= MAX_RETRIES) {
                    this.handleFinalError(error, attempt);
                    throw error; // Rethrow after logging
                }

                // Calculate Backoff
                const delay = this.calculateBackoff(attempt);
                Logger.warn(`[${this.name}] ⚠️ Request failed. Retrying in ${delay.toFixed(0)}ms... (Attempt ${attempt}/${MAX_RETRIES})`);

                // Smart Wait
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw new Error("UNREACHABLE_CODE");
    }

    /**
     * 🧮 CALCULATE DELAY: 2^attempt * 1000 + Random Jitter
     * Jitter is crucial to prevent DDOS-ing the server.
     */
    private calculateBackoff(attempt: number): number {
        const exponential = Math.pow(2, attempt) * BASE_DELAY_MS;
        const jitter = Math.random() * 500; // 0-500ms jitter
        return exponential + jitter;
    }

    /**
     * 🛑 ERROR CLASSIFICATION
     */
    private isCriticalError(error: any): boolean {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            // 400 (Bad), 401 (Auth), 403 (Forbidden) = FATAL.
            // 429 (Rate Limit), 5xx (Server) = RETRY.
            if (status && [400, 401, 403].includes(status)) return true;
        }
        return false;
    }

    private handleFinalError(error: any, attempts: number) {
        const msg = axios.isAxiosError(error)
            ? `API Error: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
            : `Network Error: ${error.message}`;

        Logger.error(`[${this.name}] ❌ FATAL REQUEST FAILURE after ${attempts} attempts: ${msg}`);
    }
}
