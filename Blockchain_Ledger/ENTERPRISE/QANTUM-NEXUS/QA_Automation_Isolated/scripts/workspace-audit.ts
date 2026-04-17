import fs from 'fs';
import path from 'path';

/**
 * @O(n) - Linear scan of workspace and README
 */

const rootDir = 'c:/Users/papic/Documents/SamsunS24';
const readmePath = path.join(rootDir, 'README.md');

const expectedDomains = [
    'core', 'engines', 'orchestrators', 'adapters', 'processors', 'config', 'network',
    'brain', 'neural', 'ml', 'cognition', 'knowledge',
    'finance', 'economy', 'security', 'saas', 'business', 'biology', 'chemistry', 'physics',
    'scripts', 'services', 'monitoring', 'telemetry', 'tests', 'verification',
    '_TITAN_LIBRARY_', '_STRATIFIED_VORTEX_', '_COLLECTED_MODULES_', '_LIBS_AND_MISC',
    'build-artifacts', 'logs', 'docs', 'manifests'
];

interface AuditResult {
    matched: string[];
    missing: string[];
    extraFilesAtRoot: string[];
    statistics: {
        totalExpected: number;
        totalFound: number;
        coverage: string;
        rootEntropy: number;
    };
}

async function runAudit(): Promise<void> {
    console.log('/// AUDIT: WORKSPACE SYNC VERIFICATION IN COGNITION ///');

    const matched: string[] = [];
    const missing: string[] = [];

    // 1. Check Directory Sync
    for (const domain of expectedDomains) {
        if (fs.existsSync(path.join(rootDir, domain)) && fs.lstatSync(path.join(rootDir, domain)).isDirectory()) {
            matched.push(domain);
        } else {
            missing.push(domain);
        }
    }

    // 2. Check Root Entropy (Files that shouldn't be there)
    const rootItems = fs.readdirSync(rootDir);
    const extraFilesAtRoot = rootItems.filter(item => {
        const fullPath = path.join(rootDir, item);
        const isFile = fs.lstatSync(fullPath).isFile();
        const whitelist = ['.env', '.gitignore', 'README.md', 'package.json', 'package-lock.json', 'tsconfig.json', 'LICENSE', '.cursorrules', '.eslintrc.json', '.npmignore'];
        return isFile && !whitelist.includes(item) && !item.endsWith('.code-workspace');
    });

    const result: AuditResult = {
        matched,
        missing,
        extraFilesAtRoot,
        statistics: {
            totalExpected: expectedDomains.length,
            totalFound: matched.length,
            coverage: ((matched.length / expectedDomains.length) * 100).toFixed(2) + '%',
            rootEntropy: extraFilesAtRoot.length
        }
    };

    console.log(JSON.stringify(result, null, 2));

    if (missing.length === 0 && extraFilesAtRoot.length === 0) {
        console.log('/// STATUS: ZERO ENTROPY CONFIRMED. WORKSPACE IS STEEL. ///');
    } else {
        console.log('/// STATUS: DATA_GAP DETECTED. AWAITING REMEDIATION. ///');
    }
}

runAudit();
