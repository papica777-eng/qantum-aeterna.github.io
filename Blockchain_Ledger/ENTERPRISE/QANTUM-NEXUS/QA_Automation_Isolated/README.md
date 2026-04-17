# QA Automation Isolated — Копие на QA скриптове

**Копирани** (не преместени) всички скриптове свързани с QA, автоматизация, тестване и CLI. Оригиналите остават на място — няма проблем с директориите.

## Структура

```
QA_Automation_Isolated/
├── qa/                          # Vortex swarm, parallel audit, тестове
│   ├── run-parallel-swarm.ts    # npm run vortex:audit / vortex:swarm / vortex:stress
│   ├── vortex-collect.ts        # npm run vortex:run
│   ├── VortexAuditRunner.ts
│   ├── vortex-pinecone-anchor.ts
│   ├── test_magnet_integration.ts
│   ├── test_pinecone_bridge.ts
│   └── ...
├── MrMindQATool_ACTIVE/         # MrMind QA Tool (активна версия)
├── MrMindQATool/                # MrMind QA Tool (базова)
├── MrMindQATool_data/
├── MrMindQATool_src/
├── MisterMindPage/              # UI framework за QA (от OMEGA_MIND)
├── qantum-cli.js                # CLI ~1400 реда
├── Nexus-HUD.html               # HUD интерфейс
├── scripts/
│   ├── analysis/                # architecture-reorganizer, nucleus-mapper, system-audit, assimilator...
│   ├── runners/                 # atomic-runner, integrated-runner, lead-hunter...
│   ├── empire/                  # empire-sync, empire-orchestrator...
│   ├── vortex-count-modules.ts
│   ├── run-full-analysis.ts
│   ├── mass-test-execution.ts
│   ├── stress-test.ts
│   ├── chaos-monkey.ts
│   ├── verify-vortex-healing.ts
│   └── ...
├── modules/
│   ├── final-audit.ts
│   ├── hunter-mode.ts
│   ├── hidden-element-finder.ts
│   ├── eagle-orchestrator.ts
│   └── empire-orchestrator.ts
├── security/
│   └── cybercody-cli.ts         # npm run cybercody / cybercody:audit / cybercody:scan
├── tests/                       # Unit/integration тестове (phase1, phase2, phase3, bridge...)
├── QAntumMasterOrchestrator.ts   # npm run vortex:orchestrate
├── vortex-terminal-server.ts     # npm run vortex:terminal
└── vortex-config.ts
```

## Как да ползваш

Скриптовете са **копия**. За да ги пуснеш от главния проект:

```bash
# От корена на SamsunS24:
npm run vortex:audit      # 1 run, 1 concurrent
npm run vortex:swarm      # 500 runs, 8 concurrent
npm run vortex:stress     # 1000 runs, 12 concurrent
npm run vortex:run        # vortex-collect
npm run vortex:orchestrate
npm run vortex:count
npm run vortex:terminal

npm run analyze:full
npm run analyze:architecture
npm run analyze:nucleus
npm run analyze:audit

npm run cybercody
npm run cybercody:audit
npm run cybercody:scan
npm run cybercody:report

npm run workspace:sync    # MrMind update-workspace-paths
```

Пътищата в `package.json` сочат към оригиналните файлове. Тази папка е за **преглед, портиране или standalone използване** — можеш да я копираш в друг проект или да я използваш като референция.

## MrMind QA Tool

- **MrMindQATool_ACTIVE** — активната версия с workspace:sync
- **MisterMindPage** — HTML/UI framework (сервира се на /mistermind/ и /qa-tool/)
- **qantum-cli.js** — глобален CLI за code ops, Empire Commands, REPL
