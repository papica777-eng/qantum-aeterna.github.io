import { VeritasLock } from '../security/VeritasLock';
import { hardwareRoot } from '../security/HardwareRoot';
import { S24SearchBridge } from '../adapters/S24_Search_Bridge';
import { ValueBombTrigger } from './ValueBombTrigger';
import * as fs from 'fs';
import * as path from 'path';

/**
 * // Complexity: O(n) where n = target count
 * AutonomousIngestion: Executes the "Hunt" by ingesting targets into the QAntum sphere.
 */
export class AutonomousIngestion {
    private bombTrigger: ValueBombTrigger;
    private statePath: string;

    constructor() {
        this.bombTrigger = new ValueBombTrigger();
        this.statePath = path.resolve(__dirname, '../../helios-ui/public/conquest_state.json');
    }

    /**
     * // Complexity: O(n)
     * scaleToGlobal: Populates conquest_state.json with 100 targets from the manifest.
     */
    public async scaleToGlobal(): Promise<void> {
        console.log('🏛️ SCALING_TO_GLOBAL_DOMAIN...');
        const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../../docs/GLOBAL_TARGET_MANIFEST.json'), 'utf-8'));
        const currentState = fs.existsSync(this.statePath) ? JSON.parse(fs.readFileSync(this.statePath, 'utf-8')) : [];

        // Merge existing progress with new targets
        const newState = manifest.targets.map((t: any) => {
            const existing = currentState.find((curr: any) => curr.identifier === t.identifier);
            return existing || { ...t, status: 'TARGET', assimilation: 0, resources: null };
        });

        fs.writeFileSync(this.statePath, JSON.stringify(newState, null, 4));
        console.log(`📡 DOMAIN_EXPANDED: 100_TARGETS_ACTIVE`);
    }

    /**
     * // Complexity: O(1) per asset
     * executeDeepIngestion: Extracts compute resources from assimilated assets.
     */
    public async executeDeepIngestion(assetId: string): Promise<void> {
        if (!fs.existsSync(this.statePath)) return;
        const state = JSON.parse(fs.readFileSync(this.statePath, 'utf-8'));
        const asset = state.find((t: any) => t.id === assetId);

        if (asset && asset.status === 'ASSET') {
            console.log(`🧠 DEEP_INGESTION_ACTIVE: ${asset.identifier}`);
            asset.resources = {
                tflops: Math.floor(hardwareRoot.getSecureFloat() * 500) + 100, // Simulated extraction
                ram_gb: Math.floor(hardwareRoot.getSecureFloat() * 1024) + 256
            };
            fs.writeFileSync(this.statePath, JSON.stringify(state, null, 4));
        }
    }

    private updateState(targetId: string, assimilation: number, status: string) {
        if (!fs.existsSync(this.statePath)) return;
        const state = JSON.parse(fs.readFileSync(this.statePath, 'utf-8'));
        const targetIndex = state.findIndex((t: any) => t.id === targetId || t.identifier === targetId);
        
        if (targetIndex !== -1) {
            state[targetIndex].assimilation = assimilation;
            state[targetIndex].status = status;
            fs.writeFileSync(this.statePath, JSON.stringify(state, null, 4));
        }
    }

    public async manifestAsset(targetId: string): Promise<void> {
        console.log(`🏛️ MANIFESTING_ASSET: ${targetId}`);
        this.updateState(targetId, 100, 'ASSET');
    }

    public async startConquestCycle() {
        console.log('🏹 STARTING_SOVEREIGN_CONQUEST_CYCLE...');
        await this.scaleToGlobal();
        
        // Retrieve targets from the state file after scaling
        if (!fs.existsSync(this.statePath)) {
            console.error("State file not found after scaling. Cannot proceed with conquest.");
            return;
        }
        const state = JSON.parse(fs.readFileSync(this.statePath, 'utf-8'));
        const targets = state.map((t: any) => t.id || t.identifier); // Use id or identifier as target reference

        console.log(`🌌 STARTING_AUTONOMOUS_CONQUEST: ${targets.length} TARGETS_IDENTIFIED`);
        for (const target of targets) {
            console.log(`🏹 INGESTING_TARGET: ${target}`);
            
            // Phase 1: Injection (0-50%)
            this.updateState(target, 25, 'TARGET');
            await this.bombTrigger.releaseValueBomb(target, { effect: 'MAGNET' });
            
            // Phase 2: Assimilation (50-100%)
            await new Promise(r => VeritasLock.verifyWait(2).then(() => r()));
            this.updateState(target, 75, 'TARGET');
            
            await new Promise(r => VeritasLock.verifyWait(3).then(() => r()));
            this.updateState(target, 100, 'ASSET');
            
            console.log(`🎯 TARGET_ASSIMILATED: ${target}`);
        }
        console.log('🏛️ CONQUEST_CYCLE_COMPLETED: ENTROPY_AT_ZERO');
    }
}
