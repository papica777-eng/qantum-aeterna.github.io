/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: UNIFIED API SERVER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Production-ready HTTP server combining REST API + WebSocket Dashboard
 * Enterprise features: Auth, Rate Limiting, Logging, Error Handling
 *
 * @author Dimitar Prodromov
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import * as http from 'http';
import { EventEmitter } from 'events';
import { Logger, type LogLevel } from './utils/logger.js';
import { type AuthConfig, type AuthenticatedUser } from './middleware/auth.js';
export interface ServerConfig {
    port: number;
    host?: string;
    ssl?: {
        key: string;
        cert: string;
    };
    cors?: CorsConfig;
    auth?: AuthConfig;
    rateLimit?: {
        windowMs: number;
        tiers: {
            anonymous: number;
            free: number;
            pro: number;
            enterprise: number;
        };
    };
    logging?: {
        level: LogLevel;
        requestBody?: boolean;
        responseBody?: boolean;
    };
    timeouts?: {
        request?: number;
        keepAlive?: number;
    };
    trustProxy?: boolean;
}
export interface CorsConfig {
    enabled: boolean;
    origins?: string[];
    methods?: string[];
    headers?: string[];
    credentials?: boolean;
    maxAge?: number;
}
export interface Request {
    raw: http.IncomingMessage;
    method: string;
    path: string;
    url: URL;
    params: Record<string, string>;
    query: Record<string, string>;
    headers: Record<string, string>;
    body: unknown;
    requestId: string;
    startTime: number;
    user?: AuthenticatedUser;
}
export interface Response {
    raw: http.ServerResponse;
    statusCode: number;
    headers: Map<string, string>;
    sent: boolean;
    status(code: number): Response;
    header(name: string, value: string): Response;
    json(data: unknown): void;
    send(data: string | Buffer): void;
    redirect(url: string, status?: number): void;
    stream(readable: NodeJS.ReadableStream): void;
}
export type RouteHandler = (req: Request, res: Response) => Promise<void> | void;
export type Middleware = (req: Request, res: Response, next: () => Promise<void>) => Promise<void> | void;
export declare class UnifiedServer extends EventEmitter {
    private server?;
    private config;
    private routes;
    private globalMiddlewares;
    private logger;
    private auth?;
    private rateLimiter?;
    private errorHandler;
    private requestLogger;
    private responseTimeTracker;
    private isShuttingDown;
    private activeConnections;
    constructor(config: ServerConfig);
    get(path: string, ...handlers: (Middleware | RouteHandler)[]): this;
    post(path: string, ...handlers: (Middleware | RouteHandler)[]): this;
    put(path: string, ...handlers: (Middleware | RouteHandler)[]): this;
    delete(path: string, ...handlers: (Middleware | RouteHandler)[]): this;
    patch(path: string, ...handlers: (Middleware | RouteHandler)[]): this;
    options(path: string, ...handlers: (Middleware | RouteHandler)[]): this;
    all(path: string, ...handlers: (Middleware | RouteHandler)[]): this;
    use(middleware: Middleware): this;
    private addRoute;
    start(): Promise<void>;
    stop(): Promise<void>;
    private setupShutdownHandlers;
    private handleRequest;
    private createResponse;
    private findRoute;
    private parseBody;
    private runMiddlewares;
    private handleCors;
    private setSecurityHeaders;
    private registerBuiltInRoutes;
    getLogger(): Logger;
    getMetrics(): Record<string, unknown>;
}
export declare function createServer(config: ServerConfig): UnifiedServer;
export default UnifiedServer;
//# sourceMappingURL=server.d.ts.map