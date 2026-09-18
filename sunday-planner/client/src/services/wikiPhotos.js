/**
 * WIKIPEDIA'DAN REAL FOTOSURAT.
 *
 * Nega kerak: Commons faylining toʻgʻridan-toʻgʻri havolasini fayl nomidan
 * qurish mumkin, lekin nom bittagina harfga farq qilsa — 404. Wikipedia REST
 * API esa maqola nomi boʻyicha oʻzi qidirib, sahifaning asosiy rasmini
 * qaytaradi. Bu ancha ishonchli.
 *
 *   GET https://uz.wikipedia.org/api/rest_v1/page/summary/<sarlavha>
 *   → { thumbnail: { source }, originalimage: { source }, content_urls… }
 *
 * Natija localStorage'da 7 kun saqlanadi — har safar qayta soʻralmaydi.
 * Soʻrov ishlamasa (internet yoʻq, maqola topilmadi) — null qaytadi va
 * interfeys oʻzining jonli sahnasini koʻrsatadi.
 */

const CACHE_KEY = 'sp.wikiPhotos';
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const TIMEOUT_MS = 6000;

/**
 * Joy → Wikipedia maqolasi. Bir nechta nom berilgan: birinchisi ishlamasa
 * keyingisi sinaladi (oʻzbekcha maqola boʻlmasa — inglizchasi).
 */
export const WIKI_TITLES = {
  'photo-24': ['en:Minor Mosque', 'en:Minor Mosque, Tashkent', 'uz:Minor masjidi', 'ru:Мечеть Минор'],
  'sayr-23': ['uz:Chorsu bozori', 'en:Chorsu Bazaar', 'ru:Чорсу (базар)'],
  'photo-25': ['en:Japanese Garden (Tashkent)', 'ru:Японский сад (Ташкент)'],
  'muzey-29': ['en:Amir Timur Museum', 'ru:Музей Амира Темура', 'uz:Amir Temur muzeyi'],
  'sayr-22': ['en:Amir Timur Square', 'ru:Сквер Амира Темура'],
  'muzey-30': ['en:Museum of Applied Arts (Tashkent)', 'ru:Музей прикладного искусства (Ташкент)'],
  'park-17': ['en:Tashkent City Park', 'uz:Toshkent siti', 'ru:Ташкент-Сити'],
  'park-18': ['ru:Центральный парк культуры и отдыха (Ташкент)'],
  'entertainment-35': ['uz:Magic City', 'ru:Magic City (Ташкент)'],
  'entertainment-36': ['ru:Анхор', 'uz:Anhor'],
  'tabiat-46': ['en:Tashkent Botanical Garden', 'ru:Ботанический сад (Ташкент)'],
  'tabiat-47': ['en:Chimgan', 'ru:Чимган', 'uz:Chimyon'],
  'shopping-28': ['ru:Самарканд Дарваза'],
  'kino-4': ['ru:Панорамный кинотеатр (Ташкент)'],
};

/** Sarlavha joyning nomiga mos keladimi — tasodifiy rasm tushmasligi uchun. */
function looksRelated(placeName, articleTitle) {
  const normalize = (text) =>
    String(text)
      .toLowerCase()
      .replace(/[ʻʼ'`’]/g, '')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3);

  const placeWords = new Set(normalize(placeName));
  const titleWords = normalize(articleTitle);
  return titleWords.some((word) => placeWords.has(word));
}

function readCache() {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage toʻlgan — muhim emas */
  }
}

async function fetchSummary(lang, title) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;

    const data = await response.json();
    const source = data?.originalimage?.source || data?.thumbnail?.source;
    if (!source) return null;

    // Juda katta original oʻrniga 1000px li nusxani soʻraymiz.
    const sized = source.replace(/\/(\d{2,4})px-/, '/1000px-');

    return {
      url: sized,
      page: data?.content_urls?.desktop?.page || null,
      title: data?.title || title,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Sozlangan sarlavha boʻlmasa — Wikipedia'ning oʻzidan qidiramiz.
 * Topilgan maqola nomi joy nomiga mos kelmasa, rasm OLINMAYDI: aks holda
 * kartaga butunlay boshqa joyning surati tushib qolishi mumkin.
 */
async function searchPhoto(lang, placeName, query) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url =
      `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
      `&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3` +
      `&prop=pageimages&piprop=original|thumbnail&pithumbsize=1000`;

    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;

    const data = await response.json();
    const pages = Object.values(data?.query?.pages || {});

    for (const page of pages) {
      const source = page?.original?.source || page?.thumbnail?.source;
      if (!source) continue;
      if (!looksRelated(placeName, page.title)) continue;
      return {
        url: source,
        page: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
        title: page.title,
      };
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Joy uchun real fotosurat topadi.
 *   1. Sozlangan Wikipedia maqolalari (WIKI_TITLES)
 *   2. Wikipedia qidiruvi — joy nomi + shahar
 * Topilmasa null (interfeys oʻz sahnasini koʻrsatadi).
 */
export async function findWikiPhoto(placeId, placeName = '', cityLabel = 'Toshkent') {
  const cache = readCache();
  const hit = cache[placeId];
  if (hit && hit.expires > Date.now()) return hit.value;

  let found = null;

  for (const entry of WIKI_TITLES[placeId] || []) {
    const [lang, title] = entry.split(/:(.+)/);
    // eslint-disable-next-line no-await-in-loop
    found = await fetchSummary(lang, title);
    if (found) break;
  }

  if (!found && placeName) {
    const queries = [
      ['uz', `${placeName} ${cityLabel}`],
      ['ru', `${placeName} Ташкент`],
      ['en', `${placeName} Tashkent`],
    ];
    for (const [lang, query] of queries) {
      // eslint-disable-next-line no-await-in-loop
      found = await searchPhoto(lang, placeName, query);
      if (found) break;
    }
  }

  cache[placeId] = { value: found, expires: Date.now() + TTL_MS };
  writeCache(cache);
  return found;
}

/** Shu joy uchun maqola oldindan sozlanganmi (yorliq/kredit uchun). */
export function hasWikiPhoto(placeId) {
  return Boolean(WIKI_TITLES[placeId]);
}
