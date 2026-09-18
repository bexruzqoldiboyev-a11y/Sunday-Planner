/**
 * Reja uchun sarlavha va qisqa izoh yozadi.
 *
 * ANTHROPIC_API_KEY bo'lsa — model matn yozadi.
 * Bo'lmasa (yoki so'rov ishlamasa) — shablon matn ishlatiladi.
 * Ya'ni AI ixtiyoriy: sayt AI'siz ham to'liq ishlaydi.
 */

import { formatUZS } from '../utils/money.js';

const MOOD_WORDS = {
  relax: 'sokin',
  adventure: 'sarguzashtli',
  fun: 'quvnoq',
  social: 'doʻstona',
  active: 'harakatli',
  quiet: 'tinch',
  luxury: 'maroqli',
  budget: 'tejamkor',
};

const COMPANION_WORDS = {
  solo: 'yolgʻiz',
  friends: 'doʻstlar bilan',
  family: 'oila bilan',
  couple: 'juftlik bilan',
};

export function fallbackCopy(plan) {
  const mood = MOOD_WORDS[plan.mood] || 'yaxshi';
  const companion = COMPANION_WORDS[plan.companion] || '';
  const spend = formatUZS(plan.totals.spend);
  const free = plan.totals.freeCount;

  return {
    headline: `${Math.round(plan.totals.spend).toLocaleString('ru-RU').replace(/\u00a0/g, ' ')} soʻmlik ${mood} ${plan.dayLabel.toLowerCase()}`,
    summary:
      `${plan.startTime}–${plan.endTime} oraligʻida ${plan.items.length} ta nuqta, ` +
      `${companion ? companion + ', ' : ''}jami ${spend}` +
      (free ? `, shundan ${free} tasi bepul.` : '.'),
    tip:
      plan.totals.remaining > 0
        ? `Budjetdan ${formatUZS(plan.totals.remaining)} ortadi — zaxira sifatida qoldiring.`
        : 'Reja budjetga tiq toʻgʻri keldi.',
    source: 'template',
  };
}

export async function writePlanCopy(plan) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackCopy(plan);

  const outline = plan.items
    .map((item) => `${item.time} ${item.place.name} (${item.place.categoryLabel}) — ${item.cost} soʻm`)
    .join('\n');

  const prompt = `Quyidagi kun rejasiga oʻzbek tilida qisqa matn yoz.
Kun: ${plan.dayLabel}, ${plan.cityLabel}. Budjet: ${plan.budget} soʻm. Sarf: ${plan.totals.spend} soʻm.
Kayfiyat: ${plan.mood}. Kim bilan: ${plan.companion}.
Reja:
${outline}

Faqat JSON qaytar, boshqa hech narsa yozma:
{"headline": "5-7 soʻzli sarlavha", "summary": "1 gap", "tip": "1 qisqa maslahat"}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'claude-sonnet-5',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`AI status ${response.status}`);

    const data = await response.json();
    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .replace(/```json|```/g, '')
      .trim();

    const parsed = JSON.parse(text);
    return {
      headline: parsed.headline || fallbackCopy(plan).headline,
      summary: parsed.summary || fallbackCopy(plan).summary,
      tip: parsed.tip || fallbackCopy(plan).tip,
      source: 'ai',
    };
  } catch (error) {
    console.warn('[ai] matn generatsiyasi ishlamadi, shablon ishlatildi:', error.message);
    return fallbackCopy(plan);
  }
}
