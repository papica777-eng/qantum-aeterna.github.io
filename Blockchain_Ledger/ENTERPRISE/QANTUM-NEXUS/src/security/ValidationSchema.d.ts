import { z } from 'zod';
/**
 * 🛡️ VORTEX SECURITY: VALIDATION SCHEMAS
 * Purpose: Guard the core against malformed inputs and data corruption.
 */
export declare const WebhookPayloadSchema: z.ZodObject<{
    ref: z.ZodString;
    before: z.ZodString;
    after: z.ZodString;
    repository: z.ZodObject<{
        name: z.ZodString;
        full_name: z.ZodString;
        owner: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            login: z.ZodString;
        }, z.core.$strip>;
        url: z.ZodString;
    }, z.core.$strip>;
    pusher: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    commits: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        message: z.ZodString;
        timestamp: z.ZodString;
        url: z.ZodString;
        author: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        added: z.ZodArray<z.ZodString>;
        removed: z.ZodArray<z.ZodString>;
        modified: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const ModuleManifestSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    type: z.ZodEnum<{
        CORE: "CORE";
        MODULE: "MODULE";
        ADAPTER: "ADAPTER";
        INTERFACE: "INTERFACE";
    }>;
    path: z.ZodString;
    exports: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const VectorDocumentSchema: z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodAny, z.core.SomeType>>;
    embedding: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export declare const CLIArgsSchema: z.ZodObject<{
    command: z.ZodString;
    target: z.ZodOptional<z.ZodString>;
    verbose: z.ZodOptional<z.ZodBoolean>;
    format: z.ZodDefault<z.ZodEnum<{
        text: "text";
        json: "json";
        markdown: "markdown";
    }>>;
}, z.core.$strip>;
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
export type ModuleManifest = z.infer<typeof ModuleManifestSchema>;
export type VectorDocument = z.infer<typeof VectorDocumentSchema>;
export type CLIArgs = z.infer<typeof CLIArgsSchema>;
//# sourceMappingURL=ValidationSchema.d.ts.map