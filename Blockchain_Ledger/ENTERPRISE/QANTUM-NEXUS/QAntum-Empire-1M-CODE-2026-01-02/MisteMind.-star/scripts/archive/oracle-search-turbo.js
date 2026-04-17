#!/usr/bin/env node

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║           ORACLE SEARCH v28.1.4 - TURBO EDITION (384-dim)                      ║
 * ╠═══════════════════════════════════════════════════════════════════════════════╣
 * ║     🔍 Semantic search across the QAntum Empire                                ║
 * ║     ⚡ Transformers.js ONNX with all-MiniLM-L6-v2                              ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const CONFIG = {
  pineconeApiKey: process.env.PINECONE_API_KEY,
  indexName: 'qantum-empire',
  namespace: 'empire',
  topK: 10,
};

const c = {
  header: (s) => `\x1b[1m\x1b[36m${s}\x1b[0m`,
  success: (s) => `\x1b[32m${s}\x1b[0m`,
  warning: (s) => `\x1b[33m${s}\x1b[0m`,
  info: (s) => `\x1b[34m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  turbo: (s) => `\x1b[1m\x1b[35m${s}\x1b[0m`,
  score: (s) => s >= 0.85 ? `\x1b[32m${s.toFixed(3)}\x1b[0m` : s >= 0.7 ? `\x1b[33m${s.toFixed(3)}\x1b[0m` : `\x1b[31m${s.toFixed(3)}\x1b[0m`,
};

let pipeline = null;

async function initPipeline() {
  if (pipeline) return pipeline;
  const { pipeline: createPipeline } = await import('@xenova/transformers');
  pipeline = await createPipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { quantized: true });
  return pipeline;
}

async function embedQuery(text) {
  const extractor = await initPipeline();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

async function search(query) {
  console.log(c.turbo('\n   ╔═══════════════════════════════════════════════════════╗'));
  console.log(c.turbo('   ║       🔮 ORACLE SEARCH v28.1.4 - TURBO EDITION         ║'));
  console.log(c.turbo('   ╚═══════════════════════════════════════════════════════╝\n'));
  
  console.log(c.info(`   Query: "${query}"\n`));
  
  // 1. Embed query
  console.log(c.dim('   ⚡ Embedding query with ONNX...'));
  const startEmbed = Date.now();
  const queryVector = await embedQuery(query);
  console.log(c.success(`   ✓ Embedded in ${Date.now() - startEmbed}ms\n`));
  
  // 2. Search Pinecone
  console.log(c.dim('   🔍 Searching Pinecone...'));
  const pc = new Pinecone({ apiKey: CONFIG.pineconeApiKey });
  const index = pc.index(CONFIG.indexName);
  
  const startSearch = Date.now();
  const results = await index.namespace(CONFIG.namespace).query({
    vector: queryVector,
    topK: CONFIG.topK,
    includeMetadata: true,
  });
  console.log(c.success(`   ✓ Found ${results.matches?.length || 0} results in ${Date.now() - startSearch}ms\n`));
  
  // 3. Display results
  console.log(c.header('   ══════════════════════════════════════════════════════'));
  console.log(c.header('                         RESULTS                         '));
  console.log(c.header('   ══════════════════════════════════════════════════════\n'));
  
  if (!results.matches || results.matches.length === 0) {
    console.log(c.warning('   No results found.'));
    return;
  }
  
  for (let i = 0; i < results.matches.length; i++) {
    const match = results.matches[i];
    const meta = match.metadata || {};
    const score = match.score || 0;
    
    console.log(c.turbo(`   [${i + 1}] Score: ${c.score(score)}`));
    console.log(c.info(`       📁 ${meta.project || 'Unknown'}`));
    console.log(c.dim(`       📄 ${meta.filePath || 'Unknown'}`));
    console.log(c.dim(`       📍 Lines: ${meta.startLine || '?'}-${meta.endLine || '?'}`));
    console.log(c.dim(`       ─────────────────────────────────────────────────`));
    
    const preview = (meta.content || '').substring(0, 300).split('\n').slice(0, 6).join('\n');
    console.log(c.dim(`       ${preview.replace(/\n/g, '\n       ')}`));
    console.log();
  }
  
  // 4. Cross-project analysis
  const projects = new Set(results.matches.map(m => m.metadata?.project).filter(Boolean));
  if (projects.size > 1) {
    console.log(c.turbo('   🔗 CROSS-PROJECT CONNECTION DETECTED!'));
    console.log(c.info(`      Projects: ${[...projects].join(', ')}`));
  }
  
  console.log();
}

const query = process.argv.slice(2).join(' ') || 'Ghost Protocol Cloudflare bypass';
search(query).catch(console.error);
