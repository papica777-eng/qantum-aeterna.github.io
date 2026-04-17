/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: UNIFIED API - EXPORTS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Main entry point for the unified API module
 *
 * @author Dimitar Prodromov
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export { UnifiedServer, createServer, type ServerConfig, type Request, type Response, type RouteHandler, type Middleware, type CorsConfig } from './server.js';
export { Logger, createLogger, getLogger, type LogLevel, type LogEntry, type LoggerConfig } from './utils/logger.js';
export { Schema, ValidationException, CommonSchemas, RequestSchemas, v, type ValidationResult, type ValidationError, type SchemaInfer } from './utils/validation.js';
export { AuthMiddleware, createApiKey, createUser, createJWT, JWTUtil, PasswordUtil, type AuthConfig, type AuthStrategy, type AuthResult, type AuthenticatedUser, type ApiKeyInfo, type UserInfo, type JWTPayload } from './middleware/auth.js';
export { RateLimiter, SlidingWindowRateLimiter, TieredRateLimiter, createRateLimiter, createSlidingWindowRateLimiter, createTieredRateLimiter, type RateLimitConfig, type RateLimitResult, type TieredRateLimitConfig } from './middleware/rateLimit.js';
export { ErrorHandler, createErrorHandler, AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, TooManyRequestsError, InternalServerError, ServiceUnavailableError, asyncHandler, tryCatch, type ErrorResponse, type ErrorHandlerConfig } from './middleware/errorHandler.js';
export { RequestLogger, ResponseTimeTracker, createRequestLogger, createResponseTimeTracker, type RequestLogConfig, type RequestLog, type ResponseLog } from './middleware/logging.js';
import { createServer } from './server.js';
import { type ApiKeyInfo } from './middleware/auth.js';
/**
 * Quick start a production-ready API server
 */
export declare function quickStart(options: {
    port?: number;
    apiKeys?: string[];
    rateLimit?: boolean;
    cors?: boolean;
}): {
    server: ReturnType<typeof createServer>;
    keys: ApiKeyInfo[];
};
declare const _default: {
    createServer: typeof createServer;
    quickStart: typeof quickStart;
};
export default _default;
//# sourceMappingURL=index.d.ts.map