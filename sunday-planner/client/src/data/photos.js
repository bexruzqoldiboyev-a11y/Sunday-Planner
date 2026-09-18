/**
 * WIKIMEDIA COMMONS FOTOSURATLARI
 *
 * Bu — internetdagi haqiqiy, erkin litsenziyali fotosuratlar. Ular faqat
 * mashhur, ommaviy joylar uchun mavjud (masjid, bozor, muzey, bogʻ).
 * Kafe, bouling, karaoke kabi biznes joylar uchun Commons'da rasm boʻlmaydi —
 * ular uchun Google Places fotosi (kalit bilan) yoki jonli sahna ishlatiladi.
 *
 * Havola Commons qoidasi boʻyicha quriladi:
 *   upload.wikimedia.org/wikipedia/commons/thumb/<h0>/<h0h1>/<Fayl>/<en>px-<Fayl>
 * bu yerda h — fayl nomining (pastki chiziqli koʻrinishda) md5 xeshi.
 *
 * Har bir rasm uchun muallif va litsenziya koʻrsatilgan — bu Commons talabi.
 * Rasm yuklanmasa interfeys oʻz sahnasiga qaytadi (onError), shuning uchun
 * sahifada hech qachon singan rasm chiqmaydi.
 */

/**
 * Qoʻlda qoʻshiladigan Commons fayllari.
 *
 * Boʻsh — chunki fayl nomini taxmin qilish xavfli (bitta harf farq qilsa 404).
 * Real fotosuratlar endi Wikipedia REST API orqali olinadi
 * (services/wikiPhotos.js) — u maqola nomi boʻyicha rasmni oʻzi topadi.
 *
 * Agar aniq fayl nomini bilsangiz, shu yerga qoʻshing:
 *   'photo-24': { file: 'Minor Mosque Tashkent.jpg', hash: 'de',
 *                 author: '…', license: 'CC0', page: '…' }
 * hash — fayl nomining (pastki chiziqli koʻrinishda) md5 xeshining
 * birinchi ikki belgisi.
 */
export const COMMONS_PHOTOS = {};

/**
 * Commons rasm manzilini quradi.
 *
 * Wikimedia fayllarni md5 xeshi boʻyicha joylashtiradi:
 *   /wikipedia/commons/<h0>/<h0h1>/<Fayl>
 * Kichraytirilgan nusxa esa /thumb/ ostida. Asl fayl kichik boʻlsa
 * (masalan 761px), undan kattaroq thumb yaratilmaydi — shunda asl fayl olinadi.
 */
export function commonsUrl(entry, width) {
  if (!entry) return null;
  // Apostrof va vergul Wikimedia'da %27 / %2C koʻrinishida boʻladi.
  const name = encodeURIComponent(entry.file.replace(/ /g, '_')).replace(/'/g, '%27');
  const first = entry.hash[0];
  const pair = entry.hash.slice(0, 2);
  const base = `https://upload.wikimedia.org/wikipedia/commons`;

  if (entry.original) return `${base}/${first}/${pair}/${name}`;

  const size = width || entry.width || 960;
  return `${base}/thumb/${first}/${pair}/${name}/${size}px-${name}`;
}
