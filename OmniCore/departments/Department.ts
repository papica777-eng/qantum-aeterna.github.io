// [PURIFIED_BY_AETERNA: 854550d2-f1bf-4ae4-933f-07251b29041c]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: e82649db-74b0-4d75-b2b9-ccdf73e05970]
// Suggestion: Review and entrench stable logic.

export enum DepartmentStatus {
    OFFLINE = 'OFFLINE',
    INITIALIZING = 'INITIALIZING',
    OPERATIONAL = 'OPERATIONAL',
    DEGRADED = 'DEGRADED',
    MAINTENANCE = 'MAINTENANCE',
    ONLINE = 'ONLINE'
}

import { EventEmitter } from 'events';

export abstract class Department extends EventEmitter {
    public name: string;
    public id: string;
    public status: DepartmentStatus = DepartmentStatus.OFFLINE;
    private startTime: number = 0;
    private metrics: { latency: number[], requests: number, errors: number } = { latency: [], requests: 0, errors: 0 };

    constructor(name: string, id: string) {
        super();
        this.name = name;
        this.id = id;
    }

    public abstract initialize(): Promise<void>;
    public abstract shutdown(): Promise<void>;
    public abstract getHealth(): Promise<any>;

    protected setStatus(status: DepartmentStatus) {
        this.status = status;
        console.log(`[${this.name}] Status changed to: ${status}`);
    }

    protected startClock() {
        this.startTime = Date.now();
    }

    protected updateMetrics(latencyMs: number, isError: boolean = false) {
        this.metrics.requests++;
        this.metrics.latency.push(latencyMs);
        if (this.metrics.latency.length > 100) this.metrics.latency.shift(); // Keep last 100
        if (isError) this.metrics.errors++;
    }

    protected getMetrics() {
        const avgLatency = this.metrics.latency.length > 0
            ? this.metrics.latency.reduce((a, b) => a + b, 0) / this.metrics.latency.length
            : 0;

        return {
            uptime: Date.now() - this.startTime,
            requests: this.metrics.requests,
            errors: this.metrics.errors,
            avgLatency: avgLatency.toFixed(2) + 'ms'
        };
    }
}
