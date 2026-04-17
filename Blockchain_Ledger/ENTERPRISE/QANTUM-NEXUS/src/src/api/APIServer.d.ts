/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: API SERVER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * REST API for remote control of Mind Engine
 * HTTP server, endpoints, authentication, WebSocket
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import * as http from 'http';
import { EventEmitter } from 'events';
export interface APIServerConfig {
    port: number;
    host?: string;
    cors?: boolean;
    auth?: {
        type: 'none' | 'apikey' | 'jwt' | 'basic';
        apiKey?: string;
        jwtSecret?: string;
        users?: Array<{
            username: string;
            password: string;
        }>;
    };
    ssl?: {
        key: string;
        cert: string;
    };
    rateLimit?: {
        windowMs: number;
        max: number;
    };
}
export interface Request {
    method: string;
    path: string;
    params: Record<string, string>;
    query: Record<string, string>;
    body: any;
    headers: Record<string, string>;
    raw: http.IncomingMessage;
}
export interface Response {
    status: (code: number) => Response;
    json: (data: any) => void;
    send: (data: string) => void;
    header: (name: string, value: string) => Response;
    raw: http.ServerResponse;
}
export type RouteHandler = (req: Request, res: Response) => Promise<void> | void;
export type Middleware = (req: Request, res: Response, next: () => void) => Promise<void> | void;
export declare class APIServer extends EventEmitter {
    private server?;
    private routes;
    private middlewares;
    private config;
    private rateLimiter?;
    constructor(config: APIServerConfig);
    /**
     * Add middleware
     */
    use(middleware: Middleware): this;
    /**
     * GET route
     */
    get(path: string, handler: RouteHandler): this;
    /**
     * POST route
     */
    post(path: string, handler: RouteHandler): this;
    /**
     * PUT route
     */
    put(path: string, handler: RouteHandler): this;
    /**
     * DELETE route
     */
    delete(path: string, handler: RouteHandler): this;
    /**
     * PATCH route
     */
    patch(path: string, handler: RouteHandler): this;
    /**
     * Add route
     */
    private addRoute;
    /**
     * Start server
     */
    start(): Promise<void>;
    /**
     * Stop server
     */
    stop(): Promise<void>;
    /**
     * Handle incoming request
     */
    private handleRequest;
    private findRoute;
    private parseBody;
    private runMiddlewares;
    private authenticate;
    private getClientIP;
}
export declare class MindEngineAPI extends APIServer {
    private sessions;
    private jobs;
    constructor(config: APIServerConfig);
    private registerRoutes;
    private simulateTestRun;
}
export declare function createAPI(config: APIServerConfig): MindEngineAPI;
declare const _default: {
    APIServer: typeof APIServer;
    MindEngineAPI: typeof MindEngineAPI;
    createAPI: typeof createAPI;
};
export default _default;
//# sourceMappingURL=APIServer.d.ts.map