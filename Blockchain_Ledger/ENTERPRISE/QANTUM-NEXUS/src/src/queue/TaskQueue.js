"use strict";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: TASK QUEUE SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Enterprise task queue with Bull/BullMQ for reliable job processing
 * Supports parallel workers, priorities, retries, and rate limiting
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerPool = exports.RateLimiter = exports.TaskQueueManager = exports.InMemoryQueue = void 0;
exports.createQueue = createQueue;
exports.createWorkerPool = createWorkerPool;
exports.createRateLimiter = createRateLimiter;
const events_1 = require("events");
// ═══════════════════════════════════════════════════════════════════════════════
// IN-MEMORY JOB QUEUE (for non-Redis usage)
// ═══════════════════════════════════════════════════════════════════════════════
class InMemoryQueue extends events_1.EventEmitter {
    jobs = new Map();
    waitingQueue = [];
    activeJobs = new Set();
    delayedJobs = new Map();
    config;
    isProcessing = false;
    processor = null;
    concurrency = 1;
    jobCounter = 0;
    constructor(config) {
        super();
        this.config = config;
    }
    /**
     * Add job to queue
     */
    async add(name, data, opts) {
        const mergedOpts = { ...this.config.defaultJobOptions, ...opts };
        const jobId = opts?.jobId || `${++this.jobCounter}`;
        const job = {
            id: jobId,
            name,
            data,
            status: 'waiting',
            progress: 0,
            attempts: 0,
            maxAttempts: mergedOpts.attempts || 3,
            createdAt: new Date(),
            opts: mergedOpts
        };
        this.jobs.set(jobId, job);
        // Handle delay
        if (mergedOpts.delay && mergedOpts.delay > 0) {
            job.status = 'delayed';
            const timeout = setTimeout(() => {
                job.status = 'waiting';
                this.waitingQueue.push(jobId);
                this.delayedJobs.delete(jobId);
                this.emit('waiting', job);
                this.processNext();
            }, mergedOpts.delay);
            this.delayedJobs.set(jobId, timeout);
        }
        else {
            // Add to queue (LIFO or FIFO)
            if (mergedOpts.lifo) {
                this.waitingQueue.unshift(jobId);
            }
            else {
                this.waitingQueue.push(jobId);
            }
            this.emit('waiting', job);
            this.processNext();
        }
        // Sort by priority
        this.sortByPriority();
        return job;
    }
    /**
     * Add bulk jobs
     */
    async addBulk(jobs) {
        const results = [];
        for (const j of jobs) {
            results.push(await this.add(j.name, j.data, j.opts));
        }
        return results;
    }
    process(arg1, arg2) {
        if (typeof arg1 === 'number') {
            this.concurrency = arg1;
            this.processor = arg2;
        }
        else {
            this.concurrency = 1;
            this.processor = arg1;
        }
        this.processNext();
    }
    /**
     * Process next jobs
     */
    async processNext() {
        if (!this.processor || this.isProcessing)
            return;
        if (this.activeJobs.size >= this.concurrency)
            return;
        if (this.waitingQueue.length === 0)
            return;
        // Rate limiter check
        if (this.config.limiter) {
            // Simplified rate limiting
            const activeCount = this.activeJobs.size;
            if (activeCount >= this.config.limiter.max)
                return;
        }
        const jobId = this.waitingQueue.shift();
        if (!jobId)
            return;
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        this.activeJobs.add(jobId);
        job.status = 'active';
        job.processedAt = new Date();
        job.attempts++;
        this.emit('active', job);
        try {
            const result = await Promise.race([
                this.processor(job),
                this.createTimeout(job.opts.timeout || 300000)
            ]);
            job.status = 'completed';
            job.finishedAt = new Date();
            job.returnValue = result;
            this.emit('completed', job, result);
            // Remove on complete
            if (job.opts.removeOnComplete === true) {
                this.jobs.delete(jobId);
            }
        }
        catch (error) {
            job.failedReason = String(error);
            // Retry logic
            if (job.attempts < job.maxAttempts) {
                job.status = 'waiting';
                // Calculate backoff delay
                let retryDelay = 1000;
                if (job.opts.backoff) {
                    if (job.opts.backoff.type === 'exponential') {
                        retryDelay = job.opts.backoff.delay * Math.pow(2, job.attempts - 1);
                    }
                    else {
                        retryDelay = job.opts.backoff.delay;
                    }
                }
                // Schedule retry
                setTimeout(() => {
                    this.waitingQueue.push(jobId);
                    this.processNext();
                }, retryDelay);
                this.emit('retrying', job, error);
            }
            else {
                job.status = 'failed';
                job.finishedAt = new Date();
                this.emit('failed', job, error);
                // Remove on fail
                if (job.opts.removeOnFail === true) {
                    this.jobs.delete(jobId);
                }
            }
        }
        finally {
            this.activeJobs.delete(jobId);
            this.processNext();
        }
    }
    /**
     * Sort waiting queue by priority
     */
    sortByPriority() {
        this.waitingQueue.sort((a, b) => {
            const jobA = this.jobs.get(a);
            const jobB = this.jobs.get(b);
            const priorityA = jobA?.opts.priority || 5;
            const priorityB = jobB?.opts.priority || 5;
            return priorityA - priorityB; // Lower number = higher priority
        });
    }
    /**
     * Create timeout promise
     */
    createTimeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Job timeout')), ms);
        });
    }
    /**
     * Get job by ID
     */
    async getJob(jobId) {
        return this.jobs.get(jobId);
    }
    /**
     * Get jobs by status
     */
    async getJobs(status, start, end) {
        const statuses = Array.isArray(status) ? status : [status];
        const jobs = Array.from(this.jobs.values())
            .filter(j => statuses.includes(j.status));
        if (start !== undefined && end !== undefined) {
            return jobs.slice(start, end);
        }
        return jobs;
    }
    /**
     * Get queue statistics
     */
    async getStats() {
        const jobs = Array.from(this.jobs.values());
        return {
            waiting: jobs.filter(j => j.status === 'waiting').length,
            active: jobs.filter(j => j.status === 'active').length,
            completed: jobs.filter(j => j.status === 'completed').length,
            failed: jobs.filter(j => j.status === 'failed').length,
            delayed: jobs.filter(j => j.status === 'delayed').length,
            paused: jobs.filter(j => j.status === 'paused').length
        };
    }
    /**
     * Pause queue
     */
    async pause() {
        this.isProcessing = false;
        this.emit('paused');
    }
    /**
     * Resume queue
     */
    async resume() {
        this.isProcessing = false;
        this.processNext();
        this.emit('resumed');
    }
    /**
     * Remove job
     */
    async remove(jobId) {
        this.jobs.delete(jobId);
        this.waitingQueue = this.waitingQueue.filter(id => id !== jobId);
        this.activeJobs.delete(jobId);
        const timeout = this.delayedJobs.get(jobId);
        if (timeout) {
            clearTimeout(timeout);
            this.delayedJobs.delete(jobId);
        }
    }
    /**
     * Clean old jobs
     */
    async clean(grace, status = 'completed') {
        const cutoff = Date.now() - grace;
        const removed = [];
        for (const [id, job] of this.jobs) {
            if (job.status === status && job.finishedAt && job.finishedAt.getTime() < cutoff) {
                removed.push(job);
                this.jobs.delete(id);
            }
        }
        return removed;
    }
    /**
     * Empty queue
     */
    async empty() {
        this.waitingQueue = [];
        for (const [id, job] of this.jobs) {
            if (job.status === 'waiting' || job.status === 'delayed') {
                this.jobs.delete(id);
            }
        }
        for (const timeout of this.delayedJobs.values()) {
            clearTimeout(timeout);
        }
        this.delayedJobs.clear();
    }
    /**
     * Close queue
     */
    async close() {
        this.isProcessing = false;
        for (const timeout of this.delayedJobs.values()) {
            clearTimeout(timeout);
        }
        this.delayedJobs.clear();
        this.emit('closed');
    }
}
exports.InMemoryQueue = InMemoryQueue;
// ═══════════════════════════════════════════════════════════════════════════════
// TASK QUEUE MANAGER
// ═══════════════════════════════════════════════════════════════════════════════
class TaskQueueManager extends events_1.EventEmitter {
    queues = new Map();
    defaultConfig;
    constructor(defaultConfig = {}) {
        super();
        this.defaultConfig = defaultConfig;
    }
    /**
     * Create or get queue
     */
    getQueue(name, config) {
        if (!this.queues.has(name)) {
            const queue = new InMemoryQueue({
                name,
                ...this.defaultConfig,
                ...config
            });
            // Forward events
            queue.on('waiting', (job) => this.emit('job:waiting', { queue: name, job }));
            queue.on('active', (job) => this.emit('job:active', { queue: name, job }));
            queue.on('completed', (job, result) => this.emit('job:completed', { queue: name, job, result }));
            queue.on('failed', (job, error) => this.emit('job:failed', { queue: name, job, error }));
            queue.on('retrying', (job) => this.emit('job:retrying', { queue: name, job }));
            this.queues.set(name, queue);
        }
        return this.queues.get(name);
    }
    /**
     * Get all queue stats
     */
    async getAllStats() {
        const stats = {};
        for (const [name, queue] of this.queues) {
            stats[name] = await queue.getStats();
        }
        return stats;
    }
    /**
     * Pause all queues
     */
    async pauseAll() {
        for (const queue of this.queues.values()) {
            await queue.pause();
        }
    }
    /**
     * Resume all queues
     */
    async resumeAll() {
        for (const queue of this.queues.values()) {
            await queue.resume();
        }
    }
    /**
     * Close all queues
     */
    async closeAll() {
        for (const queue of this.queues.values()) {
            await queue.close();
        }
        this.queues.clear();
    }
}
exports.TaskQueueManager = TaskQueueManager;
class RateLimiter {
    config;
    requests = new Map();
    constructor(config) {
        this.config = config;
    }
    /**
     * Check if request is allowed
     */
    async isAllowed(key) {
        const fullKey = `${this.config.keyPrefix || ''}${key}`;
        const now = Date.now();
        const windowStart = now - this.config.windowMs;
        // Get existing timestamps
        let timestamps = this.requests.get(fullKey) || [];
        // Filter out old timestamps
        timestamps = timestamps.filter(t => t > windowStart);
        // Check limit
        if (timestamps.length >= this.config.maxRequests) {
            return false;
        }
        // Add new timestamp
        timestamps.push(now);
        this.requests.set(fullKey, timestamps);
        return true;
    }
    /**
     * Wait until request is allowed
     */
    async waitForSlot(key, timeout = 60000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            if (await this.isAllowed(key)) {
                return true;
            }
            await new Promise(r => setTimeout(r, 100));
        }
        return false;
    }
    /**
     * Get remaining requests
     */
    getRemainingRequests(key) {
        const fullKey = `${this.config.keyPrefix || ''}${key}`;
        const now = Date.now();
        const windowStart = now - this.config.windowMs;
        const timestamps = this.requests.get(fullKey) || [];
        const validTimestamps = timestamps.filter(t => t > windowStart);
        return Math.max(0, this.config.maxRequests - validTimestamps.length);
    }
    /**
     * Reset key
     */
    reset(key) {
        const fullKey = `${this.config.keyPrefix || ''}${key}`;
        this.requests.delete(fullKey);
    }
    /**
     * Clear all
     */
    clear() {
        this.requests.clear();
    }
}
exports.RateLimiter = RateLimiter;
class WorkerPool extends events_1.EventEmitter {
    config;
    workers = new Set();
    idleWorkers = [];
    taskQueue = [];
    processor = null;
    workerIdCounter = 0;
    idleTimers = new Map();
    isShuttingDown = false;
    constructor(config) {
        super();
        this.config = {
            idleTimeout: 30000,
            taskTimeout: 300000,
            ...config
        };
        // Initialize minimum workers
        for (let i = 0; i < this.config.minWorkers; i++) {
            this.createWorker();
        }
    }
    /**
     * Set processor function
     */
    setProcessor(processor) {
        this.processor = processor;
    }
    /**
     * Execute task
     */
    async execute(input) {
        if (!this.processor) {
            throw new Error('No processor set. Call setProcessor() first.');
        }
        return new Promise((resolve, reject) => {
            const task = {
                id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                input,
                resolve,
                reject
            };
            this.taskQueue.push(task);
            this.processQueue();
        });
    }
    /**
     * Execute multiple tasks
     */
    async executeAll(inputs) {
        return Promise.all(inputs.map(input => this.execute(input)));
    }
    /**
     * Execute tasks with concurrency limit
     */
    async executeBatch(inputs, concurrency = this.config.maxWorkers) {
        const results = [];
        const chunks = [];
        for (let i = 0; i < inputs.length; i += concurrency) {
            chunks.push(inputs.slice(i, i + concurrency));
        }
        for (const chunk of chunks) {
            const chunkResults = await Promise.all(chunk.map(input => this.execute(input)));
            results.push(...chunkResults);
        }
        return results;
    }
    /**
     * Create new worker
     */
    createWorker() {
        const workerId = ++this.workerIdCounter;
        this.workers.add(workerId);
        this.idleWorkers.push(workerId);
        this.emit('worker:created', { workerId });
        return workerId;
    }
    /**
     * Remove worker
     */
    removeWorker(workerId) {
        this.workers.delete(workerId);
        this.idleWorkers = this.idleWorkers.filter(id => id !== workerId);
        const timer = this.idleTimers.get(workerId);
        if (timer) {
            clearTimeout(timer);
            this.idleTimers.delete(workerId);
        }
        this.emit('worker:removed', { workerId });
    }
    /**
     * Process task queue
     */
    async processQueue() {
        if (this.isShuttingDown)
            return;
        if (this.taskQueue.length === 0)
            return;
        // Get idle worker or create new one
        let workerId;
        if (this.idleWorkers.length > 0) {
            workerId = this.idleWorkers.shift();
            // Clear idle timer
            const timer = this.idleTimers.get(workerId);
            if (timer) {
                clearTimeout(timer);
                this.idleTimers.delete(workerId);
            }
        }
        else if (this.workers.size < this.config.maxWorkers) {
            workerId = this.createWorker();
            this.idleWorkers.shift(); // Remove from idle since we'll use it
        }
        else {
            // No available workers, wait
            return;
        }
        const task = this.taskQueue.shift();
        if (!task) {
            this.idleWorkers.push(workerId);
            return;
        }
        this.emit('task:start', { workerId, taskId: task.id });
        try {
            // Execute with timeout
            const result = await Promise.race([
                this.processor(task.input),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Task timeout')), this.config.taskTimeout);
                })
            ]);
            task.resolve(result);
            this.emit('task:complete', { workerId, taskId: task.id });
        }
        catch (error) {
            task.reject(error);
            this.emit('task:error', { workerId, taskId: task.id, error });
        }
        finally {
            // Return worker to pool
            if (!this.isShuttingDown) {
                this.returnWorker(workerId);
            }
        }
    }
    /**
     * Return worker to idle pool
     */
    returnWorker(workerId) {
        this.idleWorkers.push(workerId);
        this.processQueue();
        // Set idle timeout (only if above minimum workers)
        if (this.workers.size > this.config.minWorkers) {
            const timer = setTimeout(() => {
                if (this.idleWorkers.includes(workerId)) {
                    this.removeWorker(workerId);
                }
            }, this.config.idleTimeout);
            this.idleTimers.set(workerId, timer);
        }
    }
    /**
     * Get pool stats
     */
    getStats() {
        return {
            totalWorkers: this.workers.size,
            idleWorkers: this.idleWorkers.length,
            busyWorkers: this.workers.size - this.idleWorkers.length,
            pendingTasks: this.taskQueue.length
        };
    }
    /**
     * Shutdown pool
     */
    async shutdown(force = false) {
        this.isShuttingDown = true;
        if (!force) {
            // Wait for pending tasks
            while (this.taskQueue.length > 0 || this.workers.size > this.idleWorkers.length) {
                await new Promise(r => setTimeout(r, 100));
            }
        }
        else {
            // Reject pending tasks
            for (const task of this.taskQueue) {
                task.reject(new Error('Pool shutdown'));
            }
            this.taskQueue = [];
        }
        // Clear idle timers
        for (const timer of this.idleTimers.values()) {
            clearTimeout(timer);
        }
        this.idleTimers.clear();
        // Clear workers
        this.workers.clear();
        this.idleWorkers = [];
        this.emit('shutdown');
    }
}
exports.WorkerPool = WorkerPool;
// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════
function createQueue(name, config) {
    return new InMemoryQueue({ name, ...config });
}
function createWorkerPool(config) {
    return new WorkerPool(config);
}
function createRateLimiter(config) {
    return new RateLimiter(config);
}
exports.default = TaskQueueManager;
//# sourceMappingURL=TaskQueue.js.map