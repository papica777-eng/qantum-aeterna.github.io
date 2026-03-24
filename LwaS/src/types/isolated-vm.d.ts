// Type declarations for isolated-vm module
declare module 'isolated-vm' {
    export class Isolate {
        constructor(options?: { memoryLimit?: number; inspector?: boolean });
        createContext(): Promise<Context>;
        dispose(): void;
        getHeapStatistics(): Promise<HeapStatistics>;
    }

    export class Context {
        eval(code: string, options?: EvalOptions): Promise<any>;
        evalClosure(code: string, arguments?: any[], options?: EvalOptions): Promise<any>;
        global: Reference;
    }

    export class Reference {
        set(key: string, value: any): Promise<void>;
        get(key: string): Promise<any>;
        delete(key: string): Promise<boolean>;
    }

    export interface EvalOptions {
        timeout?: number;
        filename?: string;
        columnOffset?: number;
        lineOffset?: number;
    }

    export interface HeapStatistics {
        total_heap_size: number;
        total_heap_size_executable: number;
        total_physical_size: number;
        total_available_size: number;
        used_heap_size: number;
        heap_size_limit: number;
    }
}
