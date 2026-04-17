
// @ts-nocheck
import { ArmedReaper } from './src/modules/_root_migrated/core/brain/energy/ArmedReaper';

console.log('⚡ ATTEMPTING TO LOAD ARMED REAPER...');

try {
    const reaper = new ArmedReaper({
        mode: 'dry-run',
        enableKillSwitch: false, // Disable for test to avoid hardware lock issues
        enableBiometricJitter: false
    });

    console.log('✅ ArmedReaper Instance Created!');
    console.log('   Mode:', 'dry-run');

    // Simulate activation
    reaper.activate().then(success => {
        if (success) {
            console.log('✅ Activation Successful (Simulation)');
            process.exit(0);
        } else {
            console.error('❌ Activation Failed');
            process.exit(1);
        }
    }).catch(err => {
        console.error('❌ Activation Error:', err.message);
        process.exit(1);
    });

} catch (error) {
    console.error('❌ FATAL ERROR LOADING MODULE:', error.message);
    console.error(error);
}
