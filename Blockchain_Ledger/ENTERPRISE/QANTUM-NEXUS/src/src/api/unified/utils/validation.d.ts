/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: VALIDATION UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Schema validation with Zod-like patterns
 * Type-safe request validation
 *
 * @author Dimitar Prodromov
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export type ValidationResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    errors: ValidationError[];
};
export interface ValidationError {
    path: string;
    message: string;
    code: string;
    expected?: string;
    received?: string;
}
export declare class Schema<T = unknown> {
    private def;
    private constructor();
    static string(): Schema<string>;
    static number(): Schema<number>;
    static boolean(): Schema<boolean>;
    static object<T extends Record<string, Schema>>(properties: T): Schema<{
        [K in keyof T]: SchemaInfer<T[K]>;
    }>;
    static array<T>(items: Schema<T>): Schema<T[]>;
    static literal<T extends string | number | boolean>(value: T): Schema<T>;
    static union<T extends Schema[]>(...schemas: T): Schema<SchemaInfer<T[number]>>;
    static enum<T extends readonly string[]>(values: T): Schema<T[number]>;
    optional(): Schema<T | undefined>;
    nullable(): Schema<T | null>;
    default(value: T): Schema<T>;
    min(value: number): Schema<T>;
    max(value: number): Schema<T>;
    length(min: number, max?: number): Schema<T>;
    pattern(regex: RegExp): Schema<T>;
    email(): Schema<T>;
    url(): Schema<T>;
    uuid(): Schema<T>;
    custom(fn: (value: T) => boolean | string): Schema<T>;
    transform<U>(fn: (value: T) => U): Schema<U>;
    validate(value: unknown, path?: string): ValidationResult<T>;
    parse(value: unknown): T;
    safeParse(value: unknown): ValidationResult<T>;
}
export type SchemaInfer<T> = T extends Schema<infer U> ? U : never;
export declare class ValidationException extends Error {
    readonly errors: ValidationError[];
    constructor(errors: ValidationError[]);
    toJSON(): {
        message: string;
        errors: ValidationError[];
    };
}
export declare const CommonSchemas: {
    /** UUID v4 */
    uuid: Schema<string>;
    /** Email address */
    email: Schema<string>;
    /** URL */
    url: Schema<string>;
    /** Non-empty string */
    nonEmptyString: Schema<string>;
    /** Positive integer */
    positiveInt: Schema<number>;
    /** Port number */
    port: Schema<number>;
    /** Browser type */
    browser: Schema<"chromium" | "firefox" | "webkit">;
    /** Test status */
    testStatus: Schema<"failed" | "skipped" | "passed" | "running" | "pending">;
    /** Job status */
    jobStatus: Schema<"completed" | "failed" | "running" | "queued" | "cancelled">;
    /** Pagination */
    pagination: Schema<{
        page: number;
        limit: number;
    }>;
};
export declare const RequestSchemas: {
    /** Create session request */
    createSession: Schema<{
        browser: "chromium" | "firefox" | "webkit";
        headless: boolean;
        viewport: {
            width: number;
            height: number;
        };
        timeout: number;
        userAgent: string;
    }>;
    /** Run tests request */
    runTests: Schema<{
        tests: string[];
        browser: "chromium" | "firefox" | "webkit";
        workers: number;
        retries: number;
        timeout: number;
        reporter: "html" | "json" | "junit";
        env: {};
    }>;
    /** Navigate request */
    navigate: Schema<{
        url: string;
        waitUntil: "domcontentloaded" | "load" | "networkidle";
    }>;
    /** Click request */
    click: Schema<{
        selector: string;
        button: "right" | "left" | "middle";
        clickCount: number;
        timeout: number;
    }>;
    /** Type request */
    type: Schema<{
        selector: string;
        text: string;
        delay: number;
        clear: boolean;
    }>;
    /** Screenshot request */
    screenshot: Schema<{
        fullPage: boolean;
        format: "png" | "jpeg" | "webp";
        quality: number;
        selector: string;
    }>;
    /** Evaluate request */
    evaluate: Schema<{
        script: string;
        args: string[];
    }>;
};
export declare const v: {
    string: typeof Schema.string;
    number: typeof Schema.number;
    boolean: typeof Schema.boolean;
    object: typeof Schema.object;
    array: typeof Schema.array;
    literal: typeof Schema.literal;
    union: typeof Schema.union;
    enum: typeof Schema.enum;
};
export default Schema;
//# sourceMappingURL=validation.d.ts.map