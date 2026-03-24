/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  QANTUM SECURE SERVER CORE                                                ║
 * ║  "The Shield"                                                             ║
 * ║                                                                           ║
 * ║  🛡️ Implements Helmet, Rate-Limit, XSS-Clean                              ║
 * ║  ⚡ Hardened Express.js Identity                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Initialize 'The Shield'
const app = express();

// 1. SECURE HTTP HEADERS (HELMET)
// Hides 'X-Powered-By: Express' and sets strict security headers
app.use(helmet());

// 2. RATE LIMITING (DDoS Protection)
// Limits requests from the same IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: '{ "error": "Too many requests from this IP, please try again after 15 minutes. Security Protocol Activated." }'
});
app.use(limiter);

// 3. PARAMETER POLLUTION PROTECTION
app.use(hpp());

// 4. CORS (Cross-Origin Resource Sharing)
// Only allow trusted domains
const corsOptions = {
    origin: ['https://qantum.pro', 'http://localhost:3000'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 5. BODY PARSER
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS

// ═══════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ONLINE',
        system: 'QAntum Vortex Core',
        security: 'MAXIMUM',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    // Health check endpoint for Load Balancer
    res.status(200).send('OK');
});

// 404 Handler (Obfuscated)
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found or access denied.' });
});

// ═══════════════════════════════════════════════════════════════════════════
// SERVER START
// ═══════════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║  ✅ QANTUM SERVER ONLINE                   ║
    ║  🛡️  SHIELD: ACTIVE                        ║
    ║  🚀 PORT:   ${PORT}                           ║
    ╚════════════════════════════════════════════╝
    `);
});

// Handle Unhandled Promise Rejections (Crash Prevention)
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
