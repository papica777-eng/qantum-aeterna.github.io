/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: SCHEDULER SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Task scheduling with cron expressions, intervals, and queue management
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface ScheduledTask {
    id: string;
    name: string;
    schedule: string | number;
    handler: () => Promise<void> | void;
    options?: TaskOptions;
}
export interface TaskOptions {
    timezone?: string;
    runOnStart?: boolean;
    retries?: number;
    retryDelay?: number;
    timeout?: number;
    concurrency?: number;
    enabled?: boolean;
}
export interface TaskExecution {
    id: string;
    taskId: string;
    startTime: Date;
    endTime?: Date;
    status: 'running' | 'completed' | 'failed' | 'timeout';
    error?: string;
    duration?: number;
}
interface CronParts {
    minute: number[];
    hour: number[];
    dayOfMonth: number[];
    month: number[];
    dayOfWeek: number[];
}
export declare class CronParser {
    static parse(expression: string): CronParts;
    private static parsePart;
    private static range;
    static getNextRun(cronParts: CronParts, from?: Date): Date;
}
export declare class Scheduler extends EventEmitter {
    private state;
    private maxExecutionHistory;
    /**
     * Add scheduled task
     */
    addTask(task: ScheduledTask): this;
    /**
     * Remove task
     */
    removeTask(id: string): boolean;
    /**
     * Get task
     */
    getTask(id: string): ScheduledTask | undefined;
    /**
     * List all tasks
     */
    listTasks(): Array<{
        id: string;
        name: string;
        schedule: string | number;
        enabled: boolean;
        nextRun?: Date;
        lastRun?: Date;
        runCount: number;
    }>;
    /**
     * Enable task
     */
    enableTask(id: string): void;
    /**
     * Disable task
     */
    disableTask(id: string): void;
    /**
     * Run task immediately
     */
    runTask(id: string): Promise<TaskExecution>;
    /**
     * Start scheduler
     */
    start(): void;
    /**
     * Stop scheduler
     */
    stop(): void;
    /**
     * Get execution history
     */
    getExecutions(taskId?: string): TaskExecution[];
    /**
     * Get scheduler stats
     */
    getStats(): {
        totalTasks: number;
        enabledTasks: number;
        totalExecutions: number;
        successfulExecutions: number;
        failedExecutions: number;
        running: boolean;
    };
    private scheduleTask;
    private executeTask;
    private trimExecutionHistory;
    private delay;
}
export declare const SCHEDULES: {
    readonly EVERY_MINUTE: "* * * * *";
    readonly EVERY_5_MINUTES: "*/5 * * * *";
    readonly EVERY_15_MINUTES: "*/15 * * * *";
    readonly EVERY_30_MINUTES: "*/30 * * * *";
    readonly EVERY_HOUR: "0 * * * *";
    readonly EVERY_2_HOURS: "0 */2 * * *";
    readonly EVERY_6_HOURS: "0 */6 * * *";
    readonly EVERY_12_HOURS: "0 */12 * * *";
    readonly DAILY: "0 0 * * *";
    readonly DAILY_9AM: "0 9 * * *";
    readonly DAILY_6PM: "0 18 * * *";
    readonly WEEKLY: "0 0 * * 0";
    readonly WEEKLY_MONDAY: "0 0 * * 1";
    readonly MONTHLY: "0 0 1 * *";
    readonly QUARTERLY: "0 0 1 */3 *";
    readonly YEARLY: "0 0 1 1 *";
    readonly WEEKDAYS: "0 9 * * 1-5";
    readonly WEEKENDS: "0 10 * * 0,6";
};
export declare class TestScheduler extends Scheduler {
    private testSuites;
    addTestSuite(config: TestSuiteSchedule): this;
    removeTestSuite(id: string): boolean;
}
export interface TestSuiteSchedule {
    id: string;
    name: string;
    schedule: string | number;
    tests: string[];
    browser?: string;
    options?: TaskOptions;
}
export declare function createScheduler(): Scheduler;
export declare function createTestScheduler(): TestScheduler;
declare const _default: {
    Scheduler: typeof Scheduler;
    TestScheduler: typeof TestScheduler;
    CronParser: typeof CronParser;
    SCHEDULES: {
        readonly EVERY_MINUTE: "* * * * *";
        readonly EVERY_5_MINUTES: "*/5 * * * *";
        readonly EVERY_15_MINUTES: "*/15 * * * *";
        readonly EVERY_30_MINUTES: "*/30 * * * *";
        readonly EVERY_HOUR: "0 * * * *";
        readonly EVERY_2_HOURS: "0 */2 * * *";
        readonly EVERY_6_HOURS: "0 */6 * * *";
        readonly EVERY_12_HOURS: "0 */12 * * *";
        readonly DAILY: "0 0 * * *";
        readonly DAILY_9AM: "0 9 * * *";
        readonly DAILY_6PM: "0 18 * * *";
        readonly WEEKLY: "0 0 * * 0";
        readonly WEEKLY_MONDAY: "0 0 * * 1";
        readonly MONTHLY: "0 0 1 * *";
        readonly QUARTERLY: "0 0 1 */3 *";
        readonly YEARLY: "0 0 1 1 *";
        readonly WEEKDAYS: "0 9 * * 1-5";
        readonly WEEKENDS: "0 10 * * 0,6";
    };
    createScheduler: typeof createScheduler;
    createTestScheduler: typeof createTestScheduler;
};
export default _default;
//# sourceMappingURL=Scheduler.d.ts.map