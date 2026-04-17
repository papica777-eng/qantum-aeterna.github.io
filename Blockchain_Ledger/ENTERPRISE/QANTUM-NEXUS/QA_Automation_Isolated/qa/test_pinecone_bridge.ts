
/**
 * 🧪 PINECONE BRIDGE - COGNITIVE INTERACTION TEST
 * 
 * This script demonstrates the "interaction" with the Pinecone Context Bridge.
 * It simulates a connection, context creation, and semantic query execution.
 * 
 * Usage: npx ts-node scripts/qa/test_pinecone_bridge.ts
 */

import { PineconeContextBridge } from '../PineconeContextBridge';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runCognitiveTest() {
    console.log('\n🔵 [INIT] Initializing Pinecone Context Bridge Test...');

    const bridge = new PineconeContextBridge({
        indexName: 'qantum-test-index',
        namespace: 'test-realm'
    });

    // Event listeners for transparency
    bridge.on('log', (log) => {
        // Only show info/success/error/warn
        if (log.level !== 'debug') {
            const color = log.level === 'error' ? '\x1b[31m' : log.level === 'warn' ? '\x1b[33m' : log.level === 'success' ? '\x1b[32m' : '\x1b[36m';
            console.log(`${color}${log.message}\x1b[0m`);
        }
    });

    bridge.on('connected', (data) => {
        console.log(`\n🟢 [EVENT] Bridge Connected!`);
        console.log(`   └─ Vectors: ${data.totalVectors}`);
        console.log(`   └─ Simulated: ${data.simulated ? 'YES' : 'NO'}`);
    });

    // 1. Connect
    console.log('\n--- PHASE 1: CONNECTIVITY ---');
    await bridge.connect();

    // 2. Session Management
    console.log('\n--- PHASE 2: SESSION CONTEXT ---');
    const session = bridge.createSession('architect-session-alpha', ['DemoScope']);
    console.log(`✅ Session Created: ${session.sessionId}`);

    // Set some context filters
    bridge.setSessionFilters(session.sessionId, { accessLevel: 'admin' });
    console.log(`✅ Passive filters applied: { accessLevel: 'admin' }`);

    // 3. Semantic Query
    console.log('\n--- PHASE 3: SEMANTIC QUERY ---');
    const queryText = "What is the nature of entropy in the system?";
    console.log(`❓ Querying: "${queryText}"`);

    // Mock embedding function (normally calls OpenAI/Gemini)
    const mockEmbed = async (text: string): Promise<number[]> => {
        console.log(`   Creating embedding for: "${text.substring(0, 30)}..." [DIM: 512]`);
        return new Array(512).fill(0).map(() => Math.random());
    };

    const results = await bridge.queryByText(queryText, mockEmbed, {
        sessionId: session.sessionId,
        topK: 3
    });

    console.log(`\n🔍 RESULTS (${results.matches.length} matches found in ${results.queryTimeMs}ms):`);
    results.matches.forEach((match, i) => {
        console.log(`\n   [${i + 1}] Score: ${(match.score * 100).toFixed(1)}% | ID: ${match.id}`);
        console.log(`       📄 ${match.content}`);
        console.log(`       📂 ${match.filePath}`);
    });

    // 4. Stats
    console.log('\n--- PHASE 4: TELEMETRY ---');
    const stats = bridge.getStats();
    console.log('📊 Bridge Capabilities:');
    console.log(JSON.stringify(stats, null, 2));

    console.log('\n👋 [TEST COMPLETE] Pinecone Bridge interaction successful.');
    process.exit(0);
}

runCognitiveTest().catch(err => {
    console.error('\n💥 CRITICAL FAILURE:', err);
    process.exit(1);
});
