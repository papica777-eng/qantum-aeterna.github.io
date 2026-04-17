#!/usr/bin/env node
/**
 * 📚 MODULE DOCUMENTER - Автоматична документация на всички модули
 * 
 * Сканира цялата кодова база и генерира подробна документация
 * за всеки модул/директория.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT, 'docs', 'MODULES-DOCUMENTATION.md');

const IGNORE_PATTERNS = [
    'node_modules', '.git', 'dist', 'build', '.vs', 
    'purge-backup', '.devcontainer', 'coverage'
];

const FILE_ICONS = {
    '.ts': '📘',
    '.tsx': '⚛️',
    '.js': '📙',
    '.jsx': '⚛️',
    '.json': '📋',
    '.md': '📝',
    '.css': '🎨',
    '.scss': '🎨',
    '.html': '🌐',
    '.sql': '🗃️',
    '.prisma': '💾',
    '.yml': '⚙️',
    '.yaml': '⚙️',
    '.sh': '🐚',
    '.ps1': '💠',
    '.env': '🔐'
};

const CATEGORY_ICONS = {
    'src': '💻',
    'scripts': '⚡',
    'data': '📊',
    'docs': '📚',
    'tools': '🔧',
    'infrastructure': '🏗️',
    'dashboard': '🎛️',
    'qantum-nerve-center': '🧠',
    'security': '🔒',
    'api': '🌐',
    'components': '🧩',
    'hooks': '🪝',
    'utils': '🛠️',
    'services': '⚙️',
    'models': '📦',
    'tests': '🧪',
    'config': '⚙️'
};

let totalFiles = 0;
let totalLines = 0;
let totalModules = 0;

function shouldIgnore(filePath) {
    return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function getFileIcon(filename) {
    const ext = path.extname(filename).toLowerCase();
    return FILE_ICONS[ext] || '📄';
}

function getCategoryIcon(dirname) {
    const lower = dirname.toLowerCase();
    for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
        if (lower.includes(key)) return icon;
    }
    return '📁';
}

function countLines(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content.split('\n').length;
    } catch {
        return 0;
    }
}

function extractDescription(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').slice(0, 30);
        
        // Look for JSDoc comment
        const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
        if (jsdocMatch) {
            const desc = jsdocMatch[0]
                .replace(/\/\*\*|\*\/|\*/g, '')
                .split('\n')
                .map(l => l.trim())
                .filter(l => l && !l.startsWith('@'))
                .slice(0, 3)
                .join(' ')
                .trim();
            if (desc) return desc.substring(0, 200);
        }
        
        // Look for single line comment at top
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('//') && trimmed.length > 5) {
                return trimmed.replace('//', '').trim().substring(0, 150);
            }
            if (trimmed.startsWith('#') && !trimmed.startsWith('#!')) {
                return trimmed.replace(/^#+/, '').trim().substring(0, 150);
            }
        }
        
        // Look for export/class/function name
        const exportMatch = content.match(/export\s+(class|function|const|interface)\s+(\w+)/);
        if (exportMatch) {
            return `Exports ${exportMatch[1]} ${exportMatch[2]}`;
        }
        
        return 'No description available';
    } catch {
        return 'Could not read file';
    }
}

function analyzeDirectory(dirPath, relativePath = '') {
    const result = {
        name: path.basename(dirPath),
        path: relativePath || '/',
        files: [],
        subdirs: [],
        totalFiles: 0,
        totalLines: 0,
        icon: getCategoryIcon(path.basename(dirPath))
    };
    
    try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);
            const itemRelPath = path.join(relativePath, item.name);
            
            if (shouldIgnore(fullPath)) continue;
            
            if (item.isDirectory()) {
                const subdir = analyzeDirectory(fullPath, itemRelPath);
                result.subdirs.push(subdir);
                result.totalFiles += subdir.totalFiles;
                result.totalLines += subdir.totalLines;
            } else if (item.isFile()) {
                const lines = countLines(fullPath);
                const fileInfo = {
                    name: item.name,
                    icon: getFileIcon(item.name),
                    lines: lines,
                    description: extractDescription(fullPath)
                };
                result.files.push(fileInfo);
                result.totalFiles++;
                result.totalLines += lines;
                totalFiles++;
                totalLines += lines;
            }
        }
    } catch (e) {
        console.error(`Error reading ${dirPath}: ${e.message}`);
    }
    
    return result;
}

function generateMarkdown(analysis, depth = 0) {
    let md = '';
    const indent = '  '.repeat(depth);
    
    if (depth === 0) {
        md += `# 📚 QAntum Empire - Complete Module Documentation\n\n`;
        md += `> **Auto-generated:** ${new Date().toISOString()}\n`;
        md += `> **Total Modules:** ${totalModules}\n`;
        md += `> **Total Files:** ${totalFiles.toLocaleString()}\n`;
        md += `> **Total Lines:** ${totalLines.toLocaleString()}\n\n`;
        md += `---\n\n`;
        md += `## 📋 Table of Contents\n\n`;
    }
    
    // Generate TOC for top level
    if (depth === 0) {
        for (const subdir of analysis.subdirs) {
            md += `- [${subdir.icon} ${subdir.name}](#${subdir.name.toLowerCase().replace(/[^a-z0-9]/g, '-')})\n`;
        }
        md += `\n---\n\n`;
    }
    
    // Module header
    if (depth > 0) {
        const heading = '#'.repeat(Math.min(depth + 1, 6));
        md += `${heading} ${analysis.icon} ${analysis.name}\n\n`;
        md += `| Metric | Value |\n`;
        md += `|--------|-------|\n`;
        md += `| Path | \`${analysis.path}\` |\n`;
        md += `| Files | ${analysis.totalFiles} |\n`;
        md += `| Lines | ${analysis.totalLines.toLocaleString()} |\n\n`;
    }
    
    // Files in this directory
    if (analysis.files.length > 0) {
        md += `**Files:**\n\n`;
        md += `| File | Lines | Description |\n`;
        md += `|------|-------|-------------|\n`;
        
        for (const file of analysis.files.sort((a, b) => b.lines - a.lines)) {
            const desc = file.description.replace(/\|/g, '\\|').replace(/\n/g, ' ');
            md += `| ${file.icon} \`${file.name}\` | ${file.lines} | ${desc} |\n`;
        }
        md += `\n`;
    }
    
    // Subdirectories
    if (analysis.subdirs.length > 0 && depth < 3) {
        for (const subdir of analysis.subdirs.sort((a, b) => b.totalLines - a.totalLines)) {
            totalModules++;
            md += generateMarkdown(subdir, depth + 1);
        }
    } else if (analysis.subdirs.length > 0) {
        md += `**Subdirectories:** `;
        md += analysis.subdirs.map(s => `\`${s.name}\` (${s.totalFiles} files)`).join(', ');
        md += `\n\n`;
    }
    
    if (depth > 0) {
        md += `---\n\n`;
    }
    
    return md;
}

// Main execution
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║   📚 MODULE DOCUMENTER - Scanning QAntum Empire...           ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('🔍 Analyzing directory structure...');
const analysis = analyzeDirectory(ROOT);

console.log(`\n📊 Found:`);
console.log(`   - ${totalFiles.toLocaleString()} files`);
console.log(`   - ${totalLines.toLocaleString()} lines of code`);

console.log('\n📝 Generating documentation...');
const markdown = generateMarkdown(analysis);

// Ensure docs directory exists
const docsDir = path.join(ROOT, 'docs');
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, markdown, 'utf8');

console.log(`\n✅ Documentation saved to: ${OUTPUT_FILE}`);
console.log(`   Size: ${(markdown.length / 1024).toFixed(1)} KB`);
console.log('\n═══════════════════════════════════════════════════════════════');
