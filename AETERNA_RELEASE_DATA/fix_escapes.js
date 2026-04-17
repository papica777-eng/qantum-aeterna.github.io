const fs = require('fs');
const path = 'Blockchain_Ledger/ENTERPRISE/QANTUM-NEXUS/apps/dashboard/src/components/dashboard/watchdog-panel.tsx';

let content = fs.readFileSync(path, 'utf8');

// Replace all occurrences of backslash followed by backtick
content = content.replace(/\\`/g, '`');
// Replace all occurrences of backslash followed by dollar sign
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(path, content);
console.log('Fixed watchdog-panel.tsx escapes');
