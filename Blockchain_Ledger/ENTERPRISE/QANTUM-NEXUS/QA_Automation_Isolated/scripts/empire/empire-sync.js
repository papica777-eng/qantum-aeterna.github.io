/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  QAntum Prime v28.1.0 SUPREME - VECTOR SYNC RUNNER                        ║
 * ║  CommonJS wrapper for VectorSync                                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const EMPIRE_PATHS = {
  core: 'C:\\MisteMind',
  shield: 'C:\\MrMindQATool',
  voice: 'C:\\MisterMindPage',
};

const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];

const IGNORE_DIRS = [
  'node_modules', '.git', 'dist', 'build', 'coverage',
  '.next', '.nuxt', '.cache', '__pycache__', '.venv',
];

// Load .env
function loadEnv() {
  const envPath = path.join(EMPIRE_PATHS.core, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'qantum-empire';

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLE EMBEDDINGS (Local TF-IDF style)
// ═══════════════════════════════════════════════════════════════════════════

// Unicode Sanitizer - removes unpaired surrogates
function sanitizeUnicode(text) {
  if (!text) return '';
  return text
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control characters
}

function simpleEmbed(text) {
  // Sanitize first
  const cleanText = sanitizeUnicode(text);
  
  // Create a simple but consistent embedding based on text features
  const dimension = 384; // Smaller dimension for efficiency
  const embedding = new Array(dimension).fill(0);
  
  // Tokenize
  const tokens = cleanText.toLowerCase()
    .replace(/[^a-z0-9_]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
  
  // Create embedding based on token hashes
  for (const token of tokens) {
    const hash = crypto.createHash('md5').update(token).digest();
    for (let i = 0; i < Math.min(hash.length, dimension); i++) {
      embedding[i % dimension] += (hash[i] / 255 - 0.5) * 0.1;
    }
  }
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude;
    }
  }
  
  return embedding;
}

// ═══════════════════════════════════════════════════════════════════════════
// PINECONE API
// ═══════════════════════════════════════════════════════════════════════════

async function pineconeRequest(method, pathUrl, body = null, host = 'api.pinecone.io') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: 443,
      path: pathUrl,
      method: method,
      headers: {
        'Api-Key': PINECONE_API_KEY,
        'Content-Type': 'application/json',
      },
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(data ? JSON.parse(data) : {});
          } catch {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function getOrCreateIndex() {
  console.log('📌 Checking Pinecone index...');
  
  try {
    // List indexes
    const indexes = await pineconeRequest('GET', '/indexes');
    const existingIndex = indexes.indexes?.find(i => i.name === PINECONE_INDEX);
    
    if (existingIndex) {
      console.log(`   ✅ Index "${PINECONE_INDEX}" exists`);
      return existingIndex.host;
    }
    
    // Create index
    console.log(`   📝 Creating index "${PINECONE_INDEX}"...`);
    await pineconeRequest('POST', '/indexes', {
      name: PINECONE_INDEX,
      dimension: 384,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    });
    
    // Wait for index to be ready
    console.log('   ⏳ Waiting for index to initialize...');
    let attempts = 0;
    while (attempts < 60) {
      await new Promise(r => setTimeout(r, 2000));
      const check = await pineconeRequest('GET', `/indexes/${PINECONE_INDEX}`);
      if (check.status?.ready) {
        console.log(`   ✅ Index ready: ${check.host}`);
        return check.host;
      }
      attempts++;
      process.stdout.write('.');
    }
    
    throw new Error('Index creation timeout');
  } catch (error) {
    console.error('   ❌ Pinecone error:', error.message);
    return null;
  }
}

async function upsertVectors(host, vectors) {
  if (!host || vectors.length === 0) return { success: 0, failed: 0 };
  
  let success = 0;
  let failed = 0;
  
  // Reduced batch size + throttle
  const batchSize = 50;
  const throttleMs = 200;
  const maxRetries = 3;
  
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(vectors.length / batchSize);
    
    let retries = 0;
    let batchSuccess = false;
    
    while (retries < maxRetries && !batchSuccess) {
      try {
        await pineconeRequest('POST', '/vectors/upsert', {
          vectors: batch,
          namespace: 'empire'
        }, host);
        
        success += batch.length;
        batchSuccess = true;
        process.stdout.write(`\r   📤 Batch ${batchNum}/${totalBatches} ✅ (${success}/${vectors.length})`);
        
      } catch (error) {
        retries++;
        if (error.message.includes('socket hang up') || error.message.includes('timeout')) {
          // Chronos-Retry: wait and try again
          console.log(`\n   ⚠️ Batch ${batchNum} failed (attempt ${retries}/${maxRetries}), retrying in 1s...`);
          await new Promise(r => setTimeout(r, 1000));
        } else {
          console.error(`\n   ❌ Batch ${batchNum} error: ${error.message}`);
          failed += batch.length;
          break;
        }
      }
    }
    
    if (!batchSuccess && retries >= maxRetries) {
      failed += batch.length;
      console.log(`\n   ❌ Batch ${batchNum} failed after ${maxRetries} retries`);
    }
    
    // Throttle between batches
    await new Promise(r => setTimeout(r, throttleMs));
  }
  
  console.log(''); // New line after progress
  return { success, failed };
}

// ═══════════════════════════════════════════════════════════════════════════
// CODE EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════

function extractChunks(filePath, content) {
  const chunks = [];
  const lines = content.split('\n');
  const fileName = path.basename(filePath);
  const relativePath = filePath.replace(/\\/g, '/');
  
  // Extract functions/methods
  const functionRegex = /(?:export\s+)?(?:async\s+)?(?:function|const|let|var)\s+(\w+)\s*[=:]\s*(?:async\s*)?\([^)]*\)\s*(?:=>|{)|(?:public|private|protected)?\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*\w+)?\s*{/g;
  
  let match;
  while ((match = functionRegex.exec(content)) !== null) {
    const funcName = match[1] || match[2];
    if (funcName && !['if', 'for', 'while', 'switch', 'catch'].includes(funcName)) {
      const startIndex = match.index;
      const lineNum = content.substring(0, startIndex).split('\n').length;
      
      // Get ~30 lines of context
      const startLine = Math.max(0, lineNum - 1);
      const endLine = Math.min(lines.length, lineNum + 30);
      const chunk = lines.slice(startLine, endLine).join('\n');
      
      chunks.push({
        id: `${relativePath}:${funcName}:${lineNum}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
        type: 'function',
        name: funcName,
        file: fileName,
        path: relativePath,
        line: lineNum,
        content: chunk.substring(0, 2000),
      });
    }
  }
  
  // Extract classes
  const classRegex = /(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/g;
  while ((match = classRegex.exec(content)) !== null) {
    const className = match[1];
    const startIndex = match.index;
    const lineNum = content.substring(0, startIndex).split('\n').length;
    
    const startLine = Math.max(0, lineNum - 1);
    const endLine = Math.min(lines.length, lineNum + 50);
    const chunk = lines.slice(startLine, endLine).join('\n');
    
    chunks.push({
      id: `${relativePath}:class:${className}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
      type: 'class',
      name: className,
      file: fileName,
      path: relativePath,
      line: lineNum,
      content: chunk.substring(0, 3000),
    });
  }
  
  // Extract interfaces
  const interfaceRegex = /(?:export\s+)?interface\s+(\w+)/g;
  while ((match = interfaceRegex.exec(content)) !== null) {
    const interfaceName = match[1];
    const startIndex = match.index;
    const lineNum = content.substring(0, startIndex).split('\n').length;
    
    const startLine = Math.max(0, lineNum - 1);
    const endLine = Math.min(lines.length, lineNum + 30);
    const chunk = lines.slice(startLine, endLine).join('\n');
    
    chunks.push({
      id: `${relativePath}:interface:${interfaceName}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
      type: 'interface',
      name: interfaceName,
      file: fileName,
      path: relativePath,
      line: lineNum,
      content: chunk.substring(0, 2000),
    });
  }
  
  return chunks;
}

function scanProject(projectPath, projectName) {
  const chunks = [];
  
  function walkDir(dir) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(item) && !item.startsWith('.')) {
              walkDir(fullPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (CODE_EXTENSIONS.includes(ext)) {
              try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const fileChunks = extractChunks(fullPath, content);
                for (const chunk of fileChunks) {
                  chunk.project = projectName;
                  chunks.push(chunk);
                }
              } catch (e) {
                // Skip unreadable files
              }
            }
          }
        } catch (e) {
          // Skip inaccessible items
        }
      }
    } catch (e) {
      // Skip inaccessible directories
    }
  }
  
  walkDir(projectPath);
  return chunks;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SYNC
// ═══════════════════════════════════════════════════════════════════════════

async function syncEmpire() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                     🧠 VECTOR SYNC - CLOUD MEMORY ENGINE                      ║
║                                                                               ║
║                    QAntum Prime v28.1.0 - Empire Architect                    ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`);

  if (!PINECONE_API_KEY) {
    console.log('❌ PINECONE_API_KEY not set in .env');
    process.exit(1);
  }
  
  // Get or create index
  const indexHost = await getOrCreateIndex();
  if (!indexHost) {
    console.log('❌ Could not initialize Pinecone index');
    process.exit(1);
  }
  
  console.log('');
  console.log('🔍 Scanning Empire projects...');
  console.log('════════════════════════════════════════════════════════════════');
  
  const allChunks = [];
  const projects = [
    { path: EMPIRE_PATHS.core, name: 'MisteMind' },
    { path: EMPIRE_PATHS.shield, name: 'MrMindQATool' },
    { path: EMPIRE_PATHS.voice, name: 'MisterMindPage' },
  ];
  
  for (const project of projects) {
    console.log(`\n📂 Scanning ${project.name}...`);
    const chunks = scanProject(project.path, project.name);
    console.log(`   Found ${chunks.length} code chunks`);
    allChunks.push(...chunks);
  }
  
  console.log('');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`📊 Total chunks found: ${allChunks.length}`);
  console.log('');
  
  // Create vectors
  console.log('🧮 Generating embeddings...');
  const vectors = [];
  let processed = 0;
  
  for (const chunk of allChunks) {
    // Sanitize content before embedding and metadata
    const cleanContent = sanitizeUnicode(chunk.content);
    const embedding = simpleEmbed(cleanContent);
    
    vectors.push({
      id: chunk.id,
      values: embedding,
      metadata: {
        type: chunk.type,
        name: sanitizeUnicode(chunk.name),
        file: sanitizeUnicode(chunk.file),
        path: sanitizeUnicode(chunk.path),
        line: chunk.line,
        project: chunk.project,
        preview: sanitizeUnicode(cleanContent.substring(0, 500)),
      },
    });
    
    processed++;
    if (processed % 100 === 0) {
      process.stdout.write(`\r   Processed: ${processed}/${allChunks.length}`);
    }
  }
  console.log(`\r   Processed: ${processed}/${allChunks.length} ✅`);
  
  // Upsert to Pinecone
  console.log('');
  console.log('📤 Uploading to Pinecone...');
  const result = await upsertVectors(indexHost, vectors);
  
  console.log('');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('✅ EMPIRE SYNC COMPLETE!');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`   Vectors uploaded: ${result.success}/${vectors.length}`);
  console.log(`   Failed: ${result.failed}`);
  console.log(`   Index: ${PINECONE_INDEX}`);
  console.log(`   Host: ${indexHost}`);
  console.log('════════════════════════════════════════════════════════════════');
  
  // Update backpack
  const backpackPath = path.join(EMPIRE_PATHS.core, 'data', 'backpack.json');
  try {
    const backpack = JSON.parse(fs.readFileSync(backpackPath, 'utf-8'));
    backpack.lastSync = {
      timestamp: new Date().toISOString(),
      vectors: vectors.length,
      index: PINECONE_INDEX,
      host: indexHost,
    };
    backpack.metadata.lastUpdated = new Date().toISOString();
    fs.writeFileSync(backpackPath, JSON.stringify(backpack, null, 2));
    console.log('');
    console.log('📝 Updated backpack.json with sync info');
  } catch (e) {
    // Ignore backpack errors
  }
}

// Run
syncEmpire().catch(err => {
  console.error('❌ Sync failed:', err.message);
  process.exit(1);
});
