#!/usr/bin/env node

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║           RECREATE INDEX - 512-DIM NEURAL ALIGNMENT                            ║
 * ╠═══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                               ║
 * ║     Delete old 384-dim index and create new 512-dim for USE vectors           ║
 * ║     "В QAntum не лъжем. Само математически съвършени вектори."                ║
 * ║                                                                               ║
 * ║     Created: 2026-01-01 | QAntum Prime v28.1.3 SUPREME                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  pineconeApiKey: process.env.PINECONE_API_KEY,
  oldIndexName: 'qantum-empire',      // Old 384-dim index
  newIndexName: 'qantum-empire',      // Same name, new dimensions
  dimension: 512,                      // USE native dimension
  metric: 'cosine',                   // Cosine similarity
  cloud: 'aws',
  region: 'us-east-1',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const c = {
  reset: '\x1b[0m',
  header: (s) => `\x1b[1m\x1b[36m${s}\x1b[0m`,
  success: (s) => `\x1b[32m${s}\x1b[0m`,
  warning: (s) => `\x1b[33m${s}\x1b[0m`,
  error: (s) => `\x1b[31m${s}\x1b[0m`,
  info: (s) => `\x1b[34m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(c.header('\n╔═══════════════════════════════════════════════════════════════╗'));
  console.log(c.header('║         RECREATE INDEX - 512-DIM NEURAL ALIGNMENT             ║'));
  console.log(c.header('╚═══════════════════════════════════════════════════════════════╝\n'));
  
  if (!CONFIG.pineconeApiKey) {
    console.log(c.error('   ⚠️  PINECONE_API_KEY not found in .env'));
    process.exit(1);
  }
  
  const pc = new Pinecone({ apiKey: CONFIG.pineconeApiKey });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 1: LIST EXISTING INDEXES
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log(c.info('   📋 STEP 1: Listing existing indexes...'));
  const indexes = await pc.listIndexes();
  console.log(c.dim(`   Found ${indexes.indexes?.length || 0} indexes:`));
  
  indexes.indexes?.forEach(idx => {
    console.log(c.dim(`      - ${idx.name} (${idx.dimension} dimensions, ${idx.metric})`));
  });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 2: DELETE OLD INDEX (if exists)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const oldIndexExists = indexes.indexes?.some(i => i.name === CONFIG.oldIndexName);
  
  if (oldIndexExists) {
    console.log(c.warning(`\n   🗑️  STEP 2: Deleting old index "${CONFIG.oldIndexName}"...`));
    console.log(c.dim('   This will remove all 12,624 vectors (384-dim)...'));
    
    await pc.deleteIndex(CONFIG.oldIndexName);
    console.log(c.success(`   ✓ Index "${CONFIG.oldIndexName}" deleted`));
    
    // Wait for deletion to propagate
    console.log(c.dim('   ⏳ Waiting for deletion to propagate (10s)...'));
    await new Promise(r => setTimeout(r, 10000));
  } else {
    console.log(c.dim(`\n   ℹ️  Index "${CONFIG.oldIndexName}" does not exist, skipping deletion`));
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 3: CREATE NEW 512-DIM INDEX
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log(c.info(`\n   🆕 STEP 3: Creating new index "${CONFIG.newIndexName}"...`));
  console.log(c.dim(`      Dimension: ${CONFIG.dimension} (USE native)`));
  console.log(c.dim(`      Metric: ${CONFIG.metric}`));
  console.log(c.dim(`      Cloud: ${CONFIG.cloud} / ${CONFIG.region}`));
  
  await pc.createIndex({
    name: CONFIG.newIndexName,
    dimension: CONFIG.dimension,
    metric: CONFIG.metric,
    spec: {
      serverless: {
        cloud: CONFIG.cloud,
        region: CONFIG.region,
      },
    },
  });
  
  console.log(c.success(`   ✓ Index "${CONFIG.newIndexName}" created!`));
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 4: WAIT FOR INDEX TO BE READY
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log(c.info('\n   ⏳ STEP 4: Waiting for index to be ready...'));
  
  let ready = false;
  let attempts = 0;
  const maxAttempts = 60;  // 5 minutes max
  
  while (!ready && attempts < maxAttempts) {
    attempts++;
    await new Promise(r => setTimeout(r, 5000));
    
    try {
      const description = await pc.describeIndex(CONFIG.newIndexName);
      ready = description.status?.ready === true;
      
      if (!ready) {
        process.stdout.write(`\r   ⏳ Initializing... (${attempts * 5}s)`);
      }
    } catch (e) {
      process.stdout.write(`\r   ⏳ Initializing... (${attempts * 5}s)`);
    }
  }
  
  if (ready) {
    console.log(c.success(`\n\n   ✅ INDEX READY!`));
    
    // Get index info
    const description = await pc.describeIndex(CONFIG.newIndexName);
    console.log(c.header('\n   ═══════════════════════════════════════════════════════════'));
    console.log(c.header('   📊 NEW INDEX DETAILS:'));
    console.log(c.info(`      Name: ${CONFIG.newIndexName}`));
    console.log(c.info(`      Dimension: ${CONFIG.dimension} (USE native)`));
    console.log(c.info(`      Metric: ${CONFIG.metric}`));
    console.log(c.info(`      Host: ${description.host}`));
    console.log(c.header('   ═══════════════════════════════════════════════════════════'));
    
    console.log(c.success('\n   🎯 NEXT STEP: Run empire-resync-use.js to populate vectors'));
    console.log(c.dim('      node scripts/empire-resync-use.js\n'));
    
  } else {
    console.log(c.error('\n   ⚠️  Index creation timed out. Check Pinecone dashboard.'));
    process.exit(1);
  }
}

main().catch(err => {
  console.error(c.error(`\n   ❌ Error: ${err.message}`));
  process.exit(1);
});
