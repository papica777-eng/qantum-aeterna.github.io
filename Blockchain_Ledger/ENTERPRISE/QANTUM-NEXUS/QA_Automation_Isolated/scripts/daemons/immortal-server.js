#!/usr/bin/env node
/**
 * 🔥 IMMORTAL SERVER - НЕУБИВАЕМ BACKEND
 * 
 * Стартира command-center-server.js и го рестартира автоматично при crash.
 * НИКОГА не спира.
 */

const { spawn } = require('child_process');
const path = require('path');

const SERVER_SCRIPT = path.join(__dirname, 'command-center-server.js');
let restartCount = 0;
let server = null;

function startServer() {
    console.log(`\n🚀 [${new Date().toLocaleTimeString()}] Starting server... (restart #${restartCount})`);
    
    server = spawn('node', [SERVER_SCRIPT], {
        cwd: __dirname,
        stdio: 'inherit',
        env: process.env
    });

    server.on('error', (err) => {
        console.error(`❌ Server error: ${err.message}`);
        scheduleRestart();
    });

    server.on('exit', (code, signal) => {
        console.log(`⚠️ Server exited with code ${code}, signal ${signal}`);
        scheduleRestart();
    });
}

function scheduleRestart() {
    restartCount++;
    const delay = Math.min(1000 * restartCount, 10000); // Max 10s delay
    console.log(`🔄 Restarting in ${delay/1000}s...`);
    setTimeout(startServer, delay);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down immortal server...');
    if (server) server.kill();
    process.exit(0);
});

process.on('SIGTERM', () => {
    if (server) server.kill();
    process.exit(0);
});

console.log('═══════════════════════════════════════════════');
console.log('   🔥 IMMORTAL SERVER - NEVER DIES 🔥');
console.log('═══════════════════════════════════════════════');
console.log('Press Ctrl+C to stop\n');

startServer();
