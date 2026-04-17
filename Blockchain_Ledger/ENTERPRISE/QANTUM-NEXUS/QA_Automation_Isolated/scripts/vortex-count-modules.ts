#!/usr/bin/env npx tsx
/** Бърз преглед: колко модула вижда Vortex на живо. */
import { getLiveTaxonomy } from '../vortex-live-scan';

const t = getLiveTaxonomy();
console.log('Модули (на живо):', t.total);
console.log('По категория:', t.counts);
console.log('Сканирано:', t.scannedAt);
