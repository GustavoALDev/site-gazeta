#!/usr/bin/env node
/**
 * Extrai o bloco INSERT INTO `videos` de um dump SQL (ex.: docs/gazeta_db.sql)
 * e grava um .sql pronto para executar após 03-replace-videos.sql
 *
 * Uso:
 *   node prisma/scripts/extract-videos-insert.mjs <entrada.sql> <saida.sql>
 *
 * Exemplo (a partir de apps/backend-gazeta):
 *   node prisma/scripts/extract-videos-insert.mjs docs/gazeta_db.sql prisma/scripts/generated/03-videos-insert.sql
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error(
    'Uso: node extract-videos-insert.mjs <dump.sql> <saida.sql>',
  );
  process.exit(1);
}

const sql = readFileSync(inputPath, 'utf8');

const marker = 'INSERT INTO `videos`';
const idx = sql.indexOf(marker);
if (idx === -1) {
  console.error(`Não encontrado: ${marker}`);
  process.exit(1);
}

let end = sql.indexOf('\n\n--', idx);
if (end === -1) end = sql.indexOf('\n--\n--', idx);
if (end === -1) end = sql.length;

let chunk = sql.slice(idx, end).trim();
if (!chunk.endsWith(';')) chunk += ';';

const header = `-- Gerado por extract-videos-insert.mjs a partir de ${inputPath}\n-- Revisar URLs/IDs antes de aplicar em produção.\n\nSET NAMES utf8mb4;\n\n`;

const idMatches = chunk.matchAll(/\((\d+)\s*,/g);
let maxId = 0;
for (const m of idMatches) {
  const n = Number(m[1], 10);
  if (n > maxId) maxId = n;
}
const nextAi = maxId > 0 ? maxId + 1 : 1;
const footer = `\n-- Próximo AUTO_INCREMENT sugerido (maior id inserido + 1)\nALTER TABLE videos AUTO_INCREMENT = ${nextAi};\n`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, header + chunk + '\n' + footer, 'utf8');

const lines = chunk.split('\n').length;
console.log(`Escrito: ${outputPath} (${lines} linhas aprox.)`);
