/**
 * VERCEL SERVERLESS ENTRY.
 *
 * Vercel'da `/api/...` ga kelgan har bir soʻrov shu faylga tushadi va
 * Express ilovasiga uzatiladi. `app.listen` chaqirilmaydi — platformaning
 * oʻzi soʻrovni beradi.
 *
 * Lokalda esa hech narsa oʻzgarmaydi: `npm run dev` avvalgidek
 * server/src/index.js ni ishga tushiradi.
 */
import { createApp } from '../server/src/app.js';

const app = createApp();

export default app;
