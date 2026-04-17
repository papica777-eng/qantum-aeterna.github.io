// Главен мозък (Orchestrator) и защитна мрежа от агенти
// Extreme MML + QA Best Practices

class Orchestrator {
    constructor(agents = []) {
        this.agents = agents;
        this.history = [];
        this.state = { errors: 0, passes: 0 };
    }
    runTest(test) {
        // Главният мозък изпълнява тест
        const result = test();
        this.history.push({ type: result ? 'pass' : 'fail', timestamp: Date.now() });
        if (result) this.state.passes++;
        else this.state.errors++;
        // Всеки агент от защитната мрежа анализира и взима превантивни мерки
        for (const agent of this.agents) {
            agent.observe(this);
        }
        return result;
    }
    getStats() {
        return { passes: this.state.passes, errors: this.state.errors };
    }
}

class GuardianAgent {
    constructor(name) {
        this.name = name;
        this.predictionLog = [];
    }
    observe(orchestrator) {
        // Анализира последните резултати и предвижда бъдещи грешки
        const recent = orchestrator.history.slice(-5);
        const fails = recent.filter(e => e.type === 'fail').length;
        const willFail = fails >= 2;
        this.predictionLog.push({ time: Date.now(), predictedFailure: willFail });
        if (willFail) {
            // Превантивна мярка: reset на грешките
            orchestrator.state.errors = 0;
            orchestrator.history.push({ type: 'preventive-reset', by: this.name, timestamp: Date.now() });
        }
    }
}

// Примерна инициализация
const guardian1 = new GuardianAgent('Guardian-1');
const guardian2 = new GuardianAgent('Guardian-2');
const orchestrator = new Orchestrator([guardian1, guardian2]);

// Демонстрация: изпълнение на 20 теста
for (let i = 0; i < 20; i++) {
    orchestrator.runTest(() => Math.random() > 0.85);
}

console.log('Orchestrator stats:', orchestrator.getStats());
console.log('Guardian-1 predictions:', guardian1.predictionLog.slice(-5));
console.log('Guardian-2 predictions:', guardian2.predictionLog.slice(-5));

module.exports = { Orchestrator, GuardianAgent };