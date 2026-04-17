#!/usr/bin/env node
/**
 * 🖥️ COMMAND CENTER SERVER v34.1
 * ==============================
 * 
 * Lightweight server за Script Command Center
 * Може да работи на слаба машина - оптимизиран за host
 * 
 * Features:
 * - HTTP server за dashboard-а
 * - WebSocket за real-time output
 * - Script execution с streaming
 * - Change detection notifications
 * 
 * Usage:
 *   node scripts/command-center-server.js
 *   node scripts/command-center-server.js --port 3400
 * 
 * За достъп от друга машина:
 *   http://<IP>:3400
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const WebSocket = require('ws');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
    httpPort: parseInt(process.argv.find(a => a.startsWith('--port='))?.split('=')[1]) || 3400,
    wsPort: 3401,
    dashboardPath: path.join(__dirname, '..', 'dashboard'),
    allowedOrigins: ['*'], // За локална мрежа
    maxOutputBuffer: 1024 * 100, // 100KB output buffer
};

// ═══════════════════════════════════════════════════════════════════════════════
// HTTP SERVER
// ═══════════════════════════════════════════════════════════════════════════════

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const httpServer = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Parse URL
    let urlPath = req.url.split('?')[0];
    
    // Default to command center
    if (urlPath === '/' || urlPath === '') {
        urlPath = '/script-command-center.html';
    }
    
    // API endpoints
    if (urlPath.startsWith('/api/')) {
        handleAPI(req, res, urlPath);
        return;
    }
    
    // Static files
    const filePath = path.join(CONFIG.dashboardPath, urlPath);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
            return;
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

function handleAPI(req, res, urlPath) {
    // POST /api/execute - Execute a command
    if (urlPath === '/api/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { command } = JSON.parse(body);
                executeCommandHTTP(command, res);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
        return;
    }
    
    // GET /api/status - Server status
    if (urlPath === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            connections: wsClients.size
        }));
        return;
    }
    
    // GET /api/stats - Real project statistics
    if (urlPath === '/api/stats') {
        getProjectStats(res);
        return;
    }

    // GET /api/scripts - List available scripts
    if (urlPath === '/api/scripts') {
        const scripts = listScripts();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(scripts));
        return;
    }
    
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
}

function executeCommandHTTP(command, res) {
    const cwd = path.join(__dirname, '..');
    let output = '';
    
    const child = spawn('cmd', ['/c', command], {
        cwd,
        env: { ...process.env, FORCE_COLOR: '0' }
    });
    
    child.stdout.on('data', data => {
        output += data.toString();
    });
    
    child.stderr.on('data', data => {
        output += data.toString();
    });
    
    child.on('close', code => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: code === 0,
            exitCode: code,
            output: output.substring(0, CONFIG.maxOutputBuffer)
        }));
    });
    
    child.on('error', err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            error: err.message
        }));
    });
}


// ═
// REAL-TIME STATISTICS
// 

function getProjectStats(res) {
    const projectRoot = path.join(__dirname, '..');
    const stats = {
        files: 0,
        folders: 0,
        lines: 0,
        departments: 8,
        vectors: 52573,
        lastUpdated: new Date().toISOString()
    };

    try {
        // Count files and folders recursively
        const countDir = (dir) => {
            if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('dist')) return;
            
            const items = fs.readdirSync(dir, { withFileTypes: true });
            items.forEach(item => {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory()) {
                    stats.folders++;
                    countDir(fullPath);
                } else if (item.isFile()) {
                    stats.files++;
                    // Count lines for code files
                    if (/\.(ts|js|tsx|jsx|json|css|html|md)$/.test(item.name)) {
                        try {
                            const content = fs.readFileSync(fullPath, 'utf8');
                            stats.lines += content.split('\n').length;
                        } catch (e) {}
                    }
                }
            });
        };

        countDir(projectRoot);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats));
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
    }
}

function listScripts() {
    const scriptsDir = path.join(__dirname);
    const templates = path.join(scriptsDir, 'nerve-templates');
    
    const scripts = [];
    
    // Main scripts
    if (fs.existsSync(scriptsDir)) {
        fs.readdirSync(scriptsDir)
            .filter(f => f.endsWith('.ts') || f.endsWith('.js'))
            .forEach(f => scripts.push({ name: f, path: `scripts/${f}` }));
    }
    
    // Templates
    if (fs.existsSync(templates)) {
        fs.readdirSync(templates)
            .filter(f => f.endsWith('.ts'))
            .forEach(f => scripts.push({ name: f, path: `scripts/nerve-templates/${f}`, category: 'template' }));
    }
    
    return scripts;
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEBSOCKET SERVER
// ═══════════════════════════════════════════════════════════════════════════════

const wsClients = new Set();
let wss;

function startWebSocket() {
    wss = new WebSocket.Server({ port: CONFIG.wsPort });
    
    wss.on('connection', (ws, req) => {
        const clientIP = req.socket.remoteAddress;
        console.log(`🔌 Client connected from ${clientIP}`);
        wsClients.add(ws);
        
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                handleWebSocketMessage(ws, data);
            } catch (e) {
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
            }
        });
        
        ws.on('close', () => {
            wsClients.delete(ws);
            console.log(`🔌 Client disconnected`);
        });
        
        // Send welcome
        ws.send(JSON.stringify({
            type: 'connected',
            message: 'Connected to Command Center Server'
        }));
    });
    
    console.log(`📡 WebSocket server running on port ${CONFIG.wsPort}`);
}

function handleWebSocketMessage(ws, data) {
    switch (data.type) {
        case 'execute':
            executeCommandWS(ws, data.command);
            break;
            
        case 'ping':
            ws.send(JSON.stringify({ type: 'pong', time: Date.now() }));
            break;
            
        case 'subscribe':
            // Subscribe to change notifications
            ws.subscribed = true;
            break;
            
        default:
            ws.send(JSON.stringify({ type: 'error', message: 'Unknown command type' }));
    }
}

function executeCommandWS(ws, command) {
    const cwd = path.join(__dirname, '..');
    let output = '';
    
    // Notify start
    ws.send(JSON.stringify({
        type: 'stream',
        line: `⚡ Executing: ${command}`,
        level: 'info'
    }));
    
    const child = spawn('cmd', ['/c', command], {
        cwd,
        env: { ...process.env, FORCE_COLOR: '0' }
    });
    
    // Stream stdout
    child.stdout.on('data', data => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                output += line + '\n';
                ws.send(JSON.stringify({
                    type: 'stream',
                    line: line,
                    level: detectLevel(line)
                }));
            }
        });
    });
    
    // Stream stderr
    child.stderr.on('data', data => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                output += line + '\n';
                ws.send(JSON.stringify({
                    type: 'stream',
                    line: line,
                    level: 'error'
                }));
            }
        });
    });
    
    child.on('close', code => {
        ws.send(JSON.stringify({
            type: 'output',
            success: code === 0,
            exitCode: code,
            output: output.substring(0, CONFIG.maxOutputBuffer)
        }));
    });
    
    child.on('error', err => {
        ws.send(JSON.stringify({
            type: 'output',
            success: false,
            error: err.message,
            output: output
        }));
    });
}

function detectLevel(line) {
    if (line.includes('✅') || line.includes('success') || line.includes('Success')) return 'success';
    if (line.includes('❌') || line.includes('error') || line.includes('Error')) return 'error';
    if (line.includes('⚠️') || line.includes('warning') || line.includes('Warning')) return 'warning';
    if (line.includes('🔍') || line.includes('📊') || line.includes('info')) return 'info';
    return '';
}

// Broadcast to all clients
function broadcast(data) {
    const message = JSON.stringify(data);
    wsClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILE WATCHER (Optional - for change notifications)
// ═══════════════════════════════════════════════════════════════════════════════

function startFileWatcher() {
    const srcDir = path.join(__dirname, '..', 'src');
    
    if (fs.existsSync(srcDir)) {
        fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
            if (filename && !filename.includes('node_modules')) {
                broadcast({
                    type: 'change',
                    event: eventType,
                    file: filename,
                    time: Date.now()
                });
            }
        });
        console.log(`👁️  Watching for changes in /src`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NETWORK INFO
// ═══════════════════════════════════════════════════════════════════════════════

function getNetworkInfo() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    const addresses = [];
    
    for (const [name, nets] of Object.entries(interfaces)) {
        for (const net of nets) {
            if (net.family === 'IPv4' && !net.internal) {
                addresses.push({ interface: name, address: net.address });
            }
        }
    }
    
    return addresses;
}

// ═══════════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════════

console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║           🖥️  COMMAND CENTER SERVER v34.1                                    ║
║                                                                              ║
║         "В QAntum не лъжем."                                                 ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

// Check for ws module
try {
    require.resolve('ws');
} catch (e) {
    console.log('⚠️  WebSocket module not found. Installing...');
    require('child_process').execSync('npm install ws', { stdio: 'inherit' });
}

httpServer.listen(CONFIG.httpPort, '0.0.0.0', () => {
    console.log(`🌐 HTTP Server running on port ${CONFIG.httpPort}`);
    
    // Show access URLs
    const networks = getNetworkInfo();
    console.log(`\n📡 Access URLs:`);
    console.log(`   Local:    http://localhost:${CONFIG.httpPort}`);
    networks.forEach(n => {
        console.log(`   Network:  http://${n.address}:${CONFIG.httpPort} (${n.interface})`);
    });
    
    console.log(`\n💡 За достъп от стария лаптоп, използвай Network URL-а`);
    console.log(`   Старият лаптоп ще служи като HOST`);
    console.log(`   Работната машина ще достъпва dashboard-а през браузър\n`);
});

startWebSocket();
startFileWatcher();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down...');
    httpServer.close();
    wss.close();
    process.exit(0);
});


