#!/usr/bin/env node
/**
 * 🔧 QAntum TypeScript Auto-Fixer
 * 
 * Този скрипт автоматично:
 * 1. Локализира всички TypeScript грешки чрез `tsc --noEmit`
 * 2. Парсва грешките и ги категоризира
 * 3. Прилага автоматични корекции според типа на грешката
 * 
 * Логика на корекциите:
 * - TS2345 (Type mismatch): Добавя type assertion
 * - TS2322 (Type not assignable): Коригира типовете
 * - TS2339 (Property does not exist): Добавя optional chaining или type guard
 * - TS2307 (Cannot find module): Поправя import пътища
 * - TS4114 (Override modifier missing): Добавя `override`
 * - TS2769 (No overload matches): Премахва типови анотации от callbacks
 * - TS2532 (Object possibly undefined): Добавя null checks
 * - TS4023 (Re-exporting type): Променя на `export type`
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Цветове за конзолата
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// СТЪПКА 1: Локализиране на грешките
// ═══════════════════════════════════════════════════════════════════════════

function findErrors() {
  log('\n🔍 СТЪПКА 1: Локализиране на TypeScript грешки...', 'cyan');
  
  try {
    execSync('npx tsc --noEmit 2>&1', { encoding: 'utf8' });
    log('✅ Няма грешки!', 'green');
    return [];
  } catch (error) {
    const output = error.stdout || error.message;
    return parseErrors(output);
  }
}

function parseErrors(output) {
  const errorRegex = /^(.+\.ts)\((\d+),(\d+)\): error (TS\d+): (.+)$/gm;
  const errors = [];
  let match;
  
  while ((match = errorRegex.exec(output)) !== null) {
    errors.push({
      file: match[1],
      line: parseInt(match[2]),
      column: parseInt(match[3]),
      code: match[4],
      message: match[5],
    });
  }
  
  log(`📊 Намерени ${errors.length} грешки`, 'yellow');
  
  // Групиране по тип
  const byCode = {};
  errors.forEach(e => {
    byCode[e.code] = (byCode[e.code] || 0) + 1;
  });
  
  Object.entries(byCode).forEach(([code, count]) => {
    log(`   ${code}: ${count} грешки`, 'blue');
  });
  
  return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// СТЪПКА 2: Автоматични корекции
// ═══════════════════════════════════════════════════════════════════════════

const fixStrategies = {
  // TS2307: Cannot find module - поправка на import пътища
  TS2307: (error, content, lines) => {
    const line = lines[error.line - 1];
    
    // Проверка за voice-commander
    if (error.message.includes('voice-commander')) {
      const fixed = line.replace('./voice-commander', '../multimodal/voice-commander');
      if (fixed !== line) {
        lines[error.line - 1] = fixed;
        return { fixed: true, description: 'Поправен import път за voice-commander' };
      }
    }
    
    return { fixed: false };
  },
  
  // TS4114: Override modifier missing
  TS4114: (error, content, lines) => {
    const line = lines[error.line - 1];
    
    // Добавяне на override пред метода
    if (!line.includes('override') && (line.includes('_transform') || line.includes('_flush') || line.includes('_read') || line.includes('_write'))) {
      const fixed = line.replace(/(\s+)(async\s+)?(_\w+)/, '$1override $2$3');
      if (fixed !== line) {
        lines[error.line - 1] = fixed;
        return { fixed: true, description: 'Добавен override modifier' };
      }
    }
    
    return { fixed: false };
  },
  
  // TS4023: Re-exporting type requires export type
  TS4023: (error, content, lines) => {
    const line = lines[error.line - 1];
    
    if (line.includes('export {') && !line.includes('export type')) {
      // Извличане на името от грешката
      const typeMatch = error.message.match(/'(\w+)'/);
      if (typeMatch) {
        const typeName = typeMatch[1];
        // Ако линията експортва само типове, сменяме на export type
        if (line.includes(typeName)) {
          const fixed = line.replace(`export { ${typeName}`, `export type { ${typeName}`);
          if (fixed !== line) {
            lines[error.line - 1] = fixed;
            return { fixed: true, description: `Променено на export type за ${typeName}` };
          }
        }
      }
    }
    
    return { fixed: false };
  },
  
  // TS2769: No overload matches - премахване на типове от callback параметри
  TS2769: (error, content, lines) => {
    const line = lines[error.line - 1];
    
    // Премахване на типова анотация от callback параметри
    if (line.includes('.evaluate(') && line.includes(': string') || line.includes(': number')) {
      const fixed = line
        .replace(/\((\w+): string\)/g, '($1)')
        .replace(/\((\w+): number\)/g, '($1)')
        .replace(/\((\w+): string,/g, '($1,')
        .replace(/\((\w+): number,/g, '($1,');
      
      if (fixed !== line) {
        lines[error.line - 1] = fixed;
        return { fixed: true, description: 'Премахнати типови анотации от evaluate callback' };
      }
    }
    
    return { fixed: false };
  },
  
  // TS2322: Type not assignable - добавяне на type assertion
  TS2322: (error, content, lines) => {
    const line = lines[error.line - 1];
    
    // За unknown[] към конкретен тип
    if (error.message.includes("'unknown[]'") && line.includes('const') && line.includes('[]')) {
      // Намиране на правилния тип от грешката
      const typeMatch = error.message.match(/to type '([^']+)'/);
      if (typeMatch) {
        const targetType = typeMatch[1];
        const fixed = line.replace(/: unknown\[\]/, `: ${targetType}`);
        if (fixed !== line) {
          lines[error.line - 1] = fixed;
          return { fixed: true, description: `Променен тип от unknown[] на ${targetType}` };
        }
      }
    }
    
    return { fixed: false };
  },
  
  // TS2339: Property does not exist
  TS2339: (error, content, lines) => {
    const line = lines[error.line - 1];
    
    // За error.message на unknown
    if (error.message.includes("'message'") && error.message.includes("'unknown'")) {
      if (line.includes('error.message')) {
        // Търсене на catch блока нагоре
        for (let i = error.line - 2; i >= Math.max(0, error.line - 10); i--) {
          if (lines[i].includes('catch')) {
            // Добавяме type guard преди използването
            const indent = line.match(/^(\s*)/)[1];
            const errorVar = line.match(/(\w+)\.message/)?.[1] || 'error';
            const typeGuard = `${indent}const errorMessage = ${errorVar} instanceof Error ? ${errorVar}.message : String(${errorVar});`;
            const fixed = line.replace(`${errorVar}.message`, 'errorMessage');
            
            // Вмъкване на type guard
            lines.splice(error.line - 1, 0, typeGuard);
            lines[error.line] = fixed;
            
            return { fixed: true, description: 'Добавен type guard за error.message' };
          }
        }
      }
    }
    
    // За metadata property
    if (error.message.includes("'metadata'")) {
      if (line.includes('.metadata')) {
        const fixed = line.replace('.metadata', '.params');
        if (fixed !== line) {
          lines[error.line - 1] = fixed;
          return { fixed: true, description: 'Заменено metadata с params' };
        }
      }
    }
    
    return { fixed: false };
  },
  
  // TS2345: Argument type mismatch
  TS2345: (error, content, lines) => {
    const line = lines[error.line - 1];
    
    // За WorkerTask generic mismatch
    if (error.message.includes('WorkerTask')) {
      // Добавяне на type assertion
      if (line.includes('.enqueue(')) {
        const fixed = line.replace('.enqueue(task)', '.enqueue(task as WorkerTask<unknown, unknown>)');
        if (fixed !== line) {
          lines[error.line - 1] = fixed;
          return { fixed: true, description: 'Добавен type assertion за WorkerTask' };
        }
      }
    }
    
    // За Map type mismatch
    if (error.message.includes("Map<string, string>") && error.message.includes("Map<string, number>")) {
      // Това изисква промяна на интерфейса или cast
      return { fixed: false, suggestion: 'Промени интерфейса CompressedHeuristics или deduplicate метода' };
    }
    
    return { fixed: false };
  },
  
  // TS2532: Object is possibly undefined
  TS2532: (error, content, lines) => {
    const line = lines[error.line - 1];
    
    // Добавяне на optional chaining
    const propMatch = error.message.match(/'(\w+)'/);
    if (propMatch) {
      const prop = propMatch[1];
      const regex = new RegExp(`(\\w+)\\.${prop}(?!\\?)`, 'g');
      const fixed = line.replace(regex, `$1?.${prop}`);
      
      if (fixed !== line) {
        lines[error.line - 1] = fixed;
        return { fixed: true, description: `Добавен optional chaining за ${prop}` };
      }
    }
    
    return { fixed: false };
  },
};

function applyFixes(errors) {
  log('\n🔧 СТЪПКА 2: Автоматично коригиране...', 'cyan');
  
  // Групиране по файл
  const byFile = {};
  errors.forEach(e => {
    if (!byFile[e.file]) byFile[e.file] = [];
    byFile[e.file].push(e);
  });
  
  let totalFixed = 0;
  let totalFailed = 0;
  
  for (const [file, fileErrors] of Object.entries(byFile)) {
    const fullPath = path.resolve(file);
    
    if (!fs.existsSync(fullPath)) {
      log(`⚠️ Файлът не съществува: ${file}`, 'yellow');
      continue;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let lines = content.split('\n');
    let modified = false;
    
    // Сортиране по ред в обратен ред (за да не се разминават индексите)
    fileErrors.sort((a, b) => b.line - a.line);
    
    for (const error of fileErrors) {
      const strategy = fixStrategies[error.code];
      
      if (strategy) {
        const result = strategy(error, content, lines);
        
        if (result.fixed) {
          log(`  ✅ ${file}:${error.line} [${error.code}] - ${result.description}`, 'green');
          modified = true;
          totalFixed++;
        } else if (result.suggestion) {
          log(`  ⚠️ ${file}:${error.line} [${error.code}] - ${result.suggestion}`, 'yellow');
          totalFailed++;
        } else {
          log(`  ❌ ${file}:${error.line} [${error.code}] - Няма автоматична корекция`, 'red');
          totalFailed++;
        }
      } else {
        log(`  ❓ ${file}:${error.line} [${error.code}] - Непознат тип грешка`, 'yellow');
        totalFailed++;
      }
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
      log(`  💾 Записан: ${file}`, 'blue');
    }
  }
  
  return { totalFixed, totalFailed };
}

// ═══════════════════════════════════════════════════════════════════════════
// СТЪПКА 3: Верификация
// ═══════════════════════════════════════════════════════════════════════════

function verify() {
  log('\n✔️ СТЪПКА 3: Верификация...', 'cyan');
  
  const remainingErrors = findErrors();
  
  if (remainingErrors.length === 0) {
    log('\n🎉 УСПЕХ! Всички грешки са коригирани!', 'green');
    return true;
  } else {
    log(`\n⚠️ Остават ${remainingErrors.length} грешки за ръчна корекция:`, 'yellow');
    remainingErrors.forEach(e => {
      log(`   ${e.file}:${e.line} [${e.code}] ${e.message}`, 'red');
    });
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ГЛАВНА ФУНКЦИЯ
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  log('╔═══════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     🧠 QAntum TypeScript Auto-Fixer v1.0                          ║', 'cyan');
  log('║     Автоматично локализиране и коригиране на TS грешки               ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════════════════╝', 'cyan');
  
  // Стъпка 1: Намиране на грешки
  const errors = findErrors();
  
  if (errors.length === 0) {
    return;
  }
  
  // Стъпка 2: Прилагане на корекции
  const { totalFixed, totalFailed } = applyFixes(errors);
  
  log(`\n📈 Резултат: ${totalFixed} коригирани, ${totalFailed} неуспешни`, 'blue');
  
  // Стъпка 3: Верификация
  verify();
}

main();
