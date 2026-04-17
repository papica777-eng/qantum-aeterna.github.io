/**
 * 🛡️ QANTUM GATEKEEPER (The Registrar)
 * 
 * PURPOSE:
 * Automatically documents every new asset entering the ecosystem.
 * Acts as the "Check-in" desk for code, modules, and algorithms.
 * 
 * USAGE:
 * ts-node scripts/tools/gatekeeper.ts <NAME> <TYPE> <DESCRIPTION> <LOCATION>
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// PATHS
const INVENTORY_FILE = path.join(__dirname, '../../docs/INVENTORY-V5.md');
const README_FILE = path.join(__dirname, '../../README.md');
const REGISTRY_LOG = path.join(__dirname, '../../docs/GATEKEEPER_LOG.csv');

// ARGS
const args = process.argv.slice(2);
const isAudit = args.includes('--audit');

if (isAudit) {
    runAudit();
} else {
    const [name, type, description, location] = args;
    if (!name || !type) {
        console.error(`
❌ GATEKEEPER DENIED ENTRY
Usage: npm run register -- "Name" "Type" "Description" "Location"
Option: npm run register -- --audit
        `);
        process.exit(1);
    }
    registerAsset(name, type, description, location);
}

/**
 * 🔍 GLOBAL AUDIT: Scans the empire for untracked logic.
 */
function runAudit() {
    console.log('🛡️ GATEKEEPER: Starting Global Empire Audit...');
    const scanDirs = [
        path.join(__dirname, '../../src'),
        path.join(__dirname, '../../scripts')
    ];

    let trackedFiles: Set<string> = new Set();
    if (fs.existsSync(REGISTRY_LOG)) {
        const log = fs.readFileSync(REGISTRY_LOG, 'utf-8');
        log.split('\n').slice(1).forEach(line => {
            const parts = line.split(',');
            if (parts[4]) trackedFiles.add(path.normalize(parts[4]));
        });
    }

    let found = 0;
    const walk = (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const relPath = path.relative(path.join(__dirname, '../../'), fullPath);

            if (fs.statSync(fullPath).isDirectory()) {
                if (file !== 'node_modules' && file !== '.git') walk(fullPath);
            } else if (file.endsWith('.ts') || file.endsWith('.js')) {
                if (!trackedFiles.has(path.normalize(relPath))) {
                    console.log(`🔎 Found untracked logic: ${relPath}`);
                    registerAsset(file, 'Script/Module', 'Discovered during Global Audit', relPath, true);
                    found++;
                }
            }
        }
    };

    scanDirs.forEach(dir => { if (fs.existsSync(dir)) walk(dir); });
    console.log(`✅ Audit Complete. ${found} new assets synthesized into the registry.`);

    // 5. GIT COMMIT (The "Lock") - After all audit registrations
    try {
        execSync(`git add "${INVENTORY_FILE}" "${REGISTRY_LOG}" "${README_FILE}"`);
        execSync(`git commit -m "🛡️ Gatekeeper: Global Audit registered ${found} new assets"`);
        console.log(`🔒 Audit changes secured in Git Vault.`);
    } catch (e) {
        console.warn(`⚠️ Git commit failed after audit (maybe no changes or git not ready).`);
    }
}

/**
 * 📝 REGISTER ASSET: The core registration logic.
 */
function registerAsset(name: string, type: string, description: string, location: string, silent = false) {
    // 1. GENERATE ID (The "Wristband")
    const timestamp = new Date().toISOString();
    const id = `ASSET-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // 2. LOG ENTRY (The "Stamp")
    const logEntry = `${id},${timestamp},${name},${type},${location},"${description}"\n`;

    // Ensure CSV header exists
    if (!fs.existsSync(REGISTRY_LOG)) {
        fs.writeFileSync(REGISTRY_LOG, 'ID,TIMESTAMP,NAME,TYPE,LOCATION,DESCRIPTION\n');
    }
    fs.appendFileSync(REGISTRY_LOG, logEntry);

    // 3. UPDATE INVENTORY (The "Menu")
    const inventoryLine = `\n### 🆕 [${type.toUpperCase()}] ${name}\n* **ID:** \`${id}\`\n* **Added:** ${new Date().toLocaleDateString()}\n* **Location:** \`${location || 'N/A'}\`\n* **Description:** ${description}\n`;

    // Append to Inventory file (create if missing, though it exists)
    if (fs.existsSync(INVENTORY_FILE)) {
        let content = fs.readFileSync(INVENTORY_FILE, 'utf-8');
        // Insert after the "CURRENT MISSION" section or at end
        if (content.includes('## 📁 DOCUMENTATION MAP')) {
            content = content.replace('## 📁 DOCUMENTATION MAP', `${inventoryLine}\n## 📁 DOCUMENTATION MAP`);
        } else {
            content += inventoryLine;
        }
        fs.writeFileSync(INVENTORY_FILE, content);
    }

    // 4. UPDATE README COUNTERS (The "Scoreboard")
    // Simple increment of "Modules" count if present
    if (fs.existsSync(README_FILE)) {
        let readme = fs.readFileSync(README_FILE, 'utf-8');
        // Try to find module count like "173 Modules"
        const moduleMatch = readme.match(/(\d+) Modules/);
        if (moduleMatch) {
            const count = parseInt(moduleMatch[1]) + 1;
            readme = readme.replace(`${moduleMatch[1]} Modules`, `${count} Modules`);
            fs.writeFileSync(README_FILE, readme);
            if (!silent) {
                console.log(`✅ Updated README Module Count to ${count}`);
            }
        }
    }

    if (!silent) {
        // 5. GIT COMMIT (The "Lock") - For single asset registration
        try {
            execSync(`git add "${INVENTORY_FILE}" "${REGISTRY_LOG}" "${README_FILE}"`);
            execSync(`git commit -m "🛡️ Gatekeeper: Registered ${name} (${id})"`);
            console.log(`🔒 Asset secured in Git Vault.`);
        } catch (e) {
            console.warn(`⚠️ Git commit failed (maybe no changes or git not ready).`);
        }

        console.log(`
╔════════════════════════════════════════════════════╗
║  🛡️  GATEKEEPER APPROVED                           ║
╠════════════════════════════════════════════════════╣
║  ID:          ${id}
║  Asset:       ${name}
║  Type:        ${type}
║  Status:      OFFICIALLY REGISTERED
╚════════════════════════════════════════════════════╝
`);
    }
}
