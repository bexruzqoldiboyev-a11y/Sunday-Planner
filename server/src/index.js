import 'dotenv/config';
import { createApp } from './app.js';

const PORT = process.env.PORT || 5050;
const app = createApp();

app.listen(PORT, () => {
  console.log(`\n  Sunday Planner API — http://localhost:${PORT}/api/health`);
  console.log(`  Joylar manbai: ${process.env.PLACES_PROVIDER || 'demo'}`);
  console.log(`  AI matn: ${process.env.ANTHROPIC_API_KEY ? 'yoqilgan' : "o'chiq (shablon matn)"}\n`);
});
