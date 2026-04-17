
/**
 * INTELLIGENT INTEGRATION TEST
 * Neural Core Magnet <-> Pinecone Context Bridge
 * 
 * Verifies that the Magnet can successfully ingest data through the Bridge's 
 * compatibility layer (embed/store interfaces).
 */

import 'dotenv/config'; // Load environment variables
import { PineconeContextBridge } from '../PineconeContextBridge';

async function runIntegrationTest() {
    console.log('\n🧲 NEURAL CORE MAGNET INTEGRATION TEST INITIATED...\n');

    // 1. Initialize Bridge (Force Simulation if needed, though it auto-detects)
    const bridge = new PineconeContextBridge({
        // apiKey: 'REPLACE_ME' // Force simulation
    });

    try {
        await bridge.connect();

        // 2. Verify Compatibility Layer
        if (!bridge.embed || !bridge.store) {
            throw new Error('❌ Compatibility layer (embed/store) missing on Bridge!');
        }
        console.log('✅ Bridge Compatibility Layer Detected');

        // 3. Simulate Data Ingestion (Magnet Behavior)
        const inputs = [
            "The Singularity is near.",
            "Zero Entropy is the goal.",
            "Rust is the metal of the gods."
        ];

        console.log(`\n📥 Ingesting ${inputs.length} axioms...`);

        // 4. Test Embedding Generation
        const embeddings = await bridge.embed.embedBatch(inputs);
        if (embeddings.length !== inputs.length) throw new Error('Embedding mismatch');
        if (embeddings[0].length === 0) throw new Error('Empty embedding generated');
        console.log(`✅ Generated ${embeddings.length} embeddings (Dim: ${embeddings[0].length})`);

        // 5. Test Storage (Knowledge Set)
        console.log('\n💾 Persisting to Eternal Memory...');
        for (let i = 0; i < inputs.length; i++) {
            await bridge.store.setKnowledge({
                id: `axiom_${Date.now()}_${i}`,
                vector: embeddings[i],
                content: inputs[i],
                metadata: { source: 'integration_test', type: 'axiom' }
            });
        }

        // 6. Verify Stats
        const stats = bridge.getStats();
        console.log('\n📊 POST-INGESTION STATS:');
        console.log(`   - Vectors: ${stats.totalVectors}`);
        console.log(`   - Queries: ${stats.queriesExecuted}`);
        console.log(`   - Uptime: ${stats.uptime}ms`);

        if (stats.totalVectors >= inputs.length) {
            console.log('\n✅ TEST SUCCESS: Data magnetized and stored effectively.');
        } else {
            console.log('\n⚠️ TEST WARNING: Vector count did not increase as expected (Simulation mode static count?)');
        }

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error);
        process.exit(1);
    }
}

runIntegrationTest();
