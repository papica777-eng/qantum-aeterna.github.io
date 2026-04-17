// Extreme MML + QA Best Practices: Agent Chain with Predictive Oversight
// Всеки агент наблюдава предходния, предсказва грешки и взима превантивни мерки

class CoreAgent {
    constructor(id) {
        this.id = id;
        this.state = { errors: 0, warnings: 0, metrics: [] };
        this.log = [];
    }
    performTask(task) {
        // Симулира изпълнение и евентуална грешка
        const errorChance = Math.random();
        if (errorChance > 0.85) {
            this.state.errors++;
            this.log.push({ type: 'error', timestamp: Date.now() });
            return false;
        }
        this.log.push({ type: 'success', timestamp: Date.now() });
        return true;
    }
    getRecentLog() {
        return this.log.slice(-10);
    }
}

class OversightAgent {
    constructor(id, observedAgent) {
        this.id = id;
        this.observed = observedAgent;
        this.predictionHistory = [];
    }
    analyzeAndPredict() {
        const log = this.observed.getRecentLog();
        const errorCount = log.filter(e => e.type === 'error').length;
        // Проста логика: ако има >=2 грешки в последните 10, предсказва бъдеща грешка
        const willFail = errorCount >= 2;
        this.predictionHistory.push({
            time: Date.now(),
            predictedFailure: willFail
        });
        return willFail;
    }
    takePreventiveAction() {
        if (this.analyzeAndPredict()) {
            // Превантивна мярка: reset на агента
            this.observed.state.errors = 0;
            this.observed.log.push({ type: 'preventive-reset', timestamp: Date.now() });
            return 'reset';
        }
        return 'none';
    }
}

// Създаване на верига от агенти
const agentA = new CoreAgent('A');
const agentB = new OversightAgent('B', agentA);
const agentC = new OversightAgent('C', agentB);

// Демонстрация
for (let i = 0; i < 20; i++) {
    agentA.performTask('task');
    agentB.takePreventiveAction();
    agentC.takePreventiveAction();
}

console.log('Agent A log:', agentA.getRecentLog());
console.log('Agent B predictions:', agentB.predictionHistory.slice(-5));
console.log('Agent C predictions:', agentC.predictionHistory.slice(-5));

module.exports = { CoreAgent, OversightAgent };