#!/usr/bin/env node

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║          EMPIRE RE-SYNC v28.1.1 - USE SEMANTIC VECTORS                         ║
 * ╠═══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                               ║
 * ║     Re-index all code with Universal Sentence Encoder for TRUE semantics      ║
 * ║     This creates a NEW index with 512-dim vectors for perfect search          ║
 * ║                                                                               ║
 * ║     Created: 2026-01-01 | QAntum Prime v28.1.1 SUPREME                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const { Pinecone } = require('@pinecone-database/pinecone');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  pineconeApiKey: process.env.PINECONE_API_KEY,
  indexName: 'qantum-empire',  // Main index with 512-dim
  namespace: 'empire',
  dimension: 512,  // USE native dimension
  batchSize: 30,   // Optimized for Ryzen 7
  throttleMs: 300, // Faster with 16 threads
  projects: [
    { name: 'MisteMind', path: 'C:/MisteMind' },
    { name: 'MrMindQATool', path: 'C:/MrMindQATool' },
    { name: 'MisterMindPage', path: 'C:/MisterMindPage' },
  ],
  extensions: ['.ts', '.js', '.tsx', '.jsx', '.json', '.md', '.html', '.css'],
  ignoreDirs: ['node_modules', '.git', 'dist', 'coverage', '.vscode', '__pycache__'],
  chunkSize: 500,  // Characters per chunk
};

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const c = {
  reset: '\x1b[0m',
  header: (s) => `\x1b[1m\x1b[36m${s}\x1b[0m`,
  success: (s) => `\x1b[32m${s}\x1b[0m`,
  warning: (s) => `\x1b[33m${s}\x1b[0m`,
  info: (s) => `\x1b[34m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL LOADER
// ═══════════════════════════════════════════════════════════════════════════════

let model = null;

async function loadModel() {
  if (model) return model;
  console.log(c.info('   ⏳ Loading Universal Sentence Encoder...'));
  const start = Date.now();
  model = await use.load();
  console.log(c.success(`   ✓ Model loaded in ${Date.now() - start}ms`));
  return model;
}

/**
 * Batch embed multiple texts
 */
async function batchEmbed(texts) {
  const encoder = await loadModel();
  const embeddings = await encoder.embed(texts);
  const vectors = await embeddings.array();
  embeddings.dispose();
  return vectors;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILE SCANNER
// ═══════════════════════════════════════════════════════════════════════════════

function scanFiles(basePath, projectName) {
  const files = [];
  
  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (CONFIG.ignoreDirs.includes(entry.name)) continue;
        if (entry.name.startsWith('.')) continue;
        
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          walk(fullPath);
        } else {
          const ext = path.extname(entry.name).toLowerCase();
          if (CONFIG.extensions.includes(ext)) {
            files.push({ path: fullPath, project: projectName });
          }
        }
      }
    } catch (e) {}
  }
  
  walk(basePath);
  return files;
}

/**
 * Chunk file content
 */
function chunkContent(content, filePath, project) {
  const chunks = [];
  const lines = content.split('\n');
  let currentChunk = '';
  let startLine = 1;
  let currentLine = 1;
  
  for (const line of lines) {
    if (currentChunk.length + line.length > CONFIG.chunkSize && currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.trim(),
        filePath: filePath.replace(/\\/g, '/'),
        project,
        startLine,
        endLine: currentLine - 1,
      });
      currentChunk = '';
      startLine = currentLine;
    }
    currentChunk += line + '\n';
    currentLine++;
  }
  
  // Last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      filePath: filePath.replace(/\\/g, '/'),
      project,
      startLine,
      endLine: currentLine - 1,
    });
  }
  
  return chunks;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PINECONE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function ensureIndex(pc) {
  const indexes = await pc.listIndexes();
  const exists = indexes.indexes?.some(i => i.name === CONFIG.indexName);
  
  if (!exists) {
    console.log(c.info(`   📌 Creating new index "${CONFIG.indexName}" (512 dimensions)...`));
    await pc.createIndex({
      name: CONFIG.indexName,
      dimension: CONFIG.dimension,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
    });
    
    // Wait for index to be ready
    console.log(c.dim('   ⏳ Waiting for index to initialize...'));
    await new Promise(r => setTimeout(r, 30000));
  } else {
    console.log(c.success(`   ✓ Index "${CONFIG.indexName}" exists`));
  }
  
  return pc.index(CONFIG.indexName);
}

async function upsertBatch(index, vectors, retries = 3) {
  const formattedVectors = vectors.map((v, i) => ({
    id: `use-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
    values: v.vector,
    metadata: {
      content: v.content.substring(0, 1000),
      filePath: v.filePath,
      project: v.project,
      startLine: v.startLine,
      endLine: v.endLine,
    },
  }));
  
  // Chronos-Retry: 3 attempts with exponential backoff
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await index.namespace(CONFIG.namespace).upsert(formattedVectors);
      return; // Success!
    } catch (error) {
      if (attempt === retries) throw error;
      const delay = attempt * 2000; // 2s, 4s, 6s
      console.log(c.dim(`\n   🔄 Retry ${attempt}/${retries} in ${delay}ms...`));
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(c.header('\n╔═══════════════════════════════════════════════════════════════╗'));
  console.log(c.header('║      EMPIRE RE-SYNC v28.1.1 - USE SEMANTIC VECTORS            ║'));
  console.log(c.header('╚═══════════════════════════════════════════════════════════════╝\n'));
  
  if (!CONFIG.pineconeApiKey) {
    console.log(c.warning('   ⚠️  PINECONE_API_KEY not found'));
    process.exit(1);
  }
  
  // 1. Collect all chunks
  console.log(c.header('   📂 SCANNING PROJECTS...'));
  const allChunks = [];
  
  for (const project of CONFIG.projects) {
    const files = scanFiles(project.path, project.name);
    console.log(c.dim(`   ${project.name}: ${files.length} files`));
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file.path, 'utf-8');
        const chunks = chunkContent(content, file.path, file.project);
        allChunks.push(...chunks);
      } catch (e) {}
    }
  }
  
  console.log(c.success(`\n   ✓ Total chunks to embed: ${allChunks.length}`));
  
  // 2. Initialize Pinecone
  console.log(c.header('\n   📌 INITIALIZING PINECONE...'));
  const pc = new Pinecone({ apiKey: CONFIG.pineconeApiKey });
  const index = await ensureIndex(pc);
  
  // 3. Embed and upsert in batches
  console.log(c.header('\n   🧠 EMBEDDING WITH UNIVERSAL SENTENCE ENCODER...'));
  console.log(c.dim(`   Batch size: ${CONFIG.batchSize} | Throttle: ${CONFIG.throttleMs}ms\n`));
  
  let processed = 0;
  let failed = 0;
  const totalBatches = Math.ceil(allChunks.length / CONFIG.batchSize);
  
  for (let i = 0; i < allChunks.length; i += CONFIG.batchSize) {
    const batch = allChunks.slice(i, i + CONFIG.batchSize);
    const batchNum = Math.floor(i / CONFIG.batchSize) + 1;
    
    try {
      // Embed batch
      const texts = batch.map(c => c.content);
      const vectors = await batchEmbed(texts);
      
      // Combine with metadata
      const vectorsWithMeta = batch.map((chunk, idx) => ({
        ...chunk,
        vector: vectors[idx],
      }));
      
      // Upsert to Pinecone
      await upsertBatch(index, vectorsWithMeta);
      
      processed += batch.length;
      process.stdout.write(`\r   📤 Batch ${batchNum}/${totalBatches} ✅ (${processed}/${allChunks.length})`);
      
      // Throttle
      await new Promise(r => setTimeout(r, CONFIG.throttleMs));
      
    } catch (error) {
      failed += batch.length;
      console.log(c.warning(`\n   ⚠️  Batch ${batchNum} failed: ${error.message}`));
    }
  }
  
  console.log(c.success(`\n\n   ✅ SYNC COMPLETE!`));
  console.log(c.dim(`      Processed: ${processed}`));
  console.log(c.dim(`      Failed: ${failed}`));
  console.log(c.info(`      Index: ${CONFIG.indexName}`));
  console.log(c.info(`      Dimension: ${CONFIG.dimension} (USE native)`));
  console.log();
}

main().catch(console.error);
