// Тест: Проверка на структурата на проекта
const fs = require('fs');
const assert = require('assert');

const requiredDirs = [
  'soul/data',
  'soul/docs',
  'body/qa',
  'body/scripts',
  'mind/core',
  'mind/tests',
  'mind/demos',
  'mind/docker'
];

for (const dir of requiredDirs) {
  assert(fs.existsSync(`../${dir}`), `Missing directory: ${dir}`);
}

console.log('✅ Структурата на проекта е валидна!');
