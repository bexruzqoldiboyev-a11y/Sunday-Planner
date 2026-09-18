/**
 * client/dist → dist (ildizga nusxa).
 *
 * Nega: Vercel loyiha sozlamalarida Output Directory «dist» boʻlib qolishi
 * mumkin va u vercel.json dan ustun keladi. Natijani ildizga ham qoʻysak,
 * qaysi sozlama ishlashidan qatʼi nazar build topiladi.
 */
import { cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const from = new URL('../client/dist/', import.meta.url);
const to = new URL('../dist/', import.meta.url);

if (!existsSync(from)) {
  console.error('client/dist topilmadi — avval client build qilinishi kerak.');
  process.exit(1);
}

await rm(to, { recursive: true, force: true });
await cp(from, to, { recursive: true });
console.log('✓ dist tayyor (client/dist → dist)');
