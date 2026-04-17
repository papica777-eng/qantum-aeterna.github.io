import { OracleSearchTurbo } from './modules/oracle-search-turbo';
import { GenesisBridgeAdapter } from './modules/GenesisBridgeAdapter';
import { ProjectAnchor } from './modules/ProjectAnchor';
import { KineticGateAdapter } from './modules/KineticGateAdapter';

// Ensure environment is loaded
ProjectAnchor.initEnv();

const oracle = new OracleSearchTurbo();
const bridge = new GenesisBridgeAdapter();
const kineticGate = new KineticGateAdapter();

async function testOracleToKineticGate() {
    console.log("/// [TEST] Starting Oracle -> Kinetic Gate -> Singularity Flow ///");

    try {
        // 1. Oracle Scans for High-Value Targets (Logical Anomalies)
        const targets = await oracle.scan();
        console.log(`[TEST] Oracle identified ${targets.length} targets.`);

        // 2. Transmit to Genesis Bridge AND Kinetic Gate
        for (const target of targets) {
            console.log(`\n--- Processing Target: ${target.source} ---`);
            console.log(`[TEST] LogicState: ${target.logicState || 'NORMAL'}`);

            // PII Scan & Kinetic Validation
            const order = await kineticGate.ignite(target);

            if (order) {
                console.log(`[TEST] 🚀 KINETIC SUCCESS: Order ${order.orderId} ready for Atomic Engine execution.`);
            }

            // Persistence in Genesis Bridge
            const realityId = await bridge.storeMarketOpportunity(target);
            if (realityId) {
                console.log(`[TEST] ✅ Reality Anchored: ${realityId}`);
            }
        }

        console.log("\n/// [TEST] Singularity Flow Completed Successfully ///");
    } catch (error) {
        console.error("/// [TEST_FAULT] Integration Test Failed ///", error);
    }
}

// Execute the test
testOracleToKineticGate();
