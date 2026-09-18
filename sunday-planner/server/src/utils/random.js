/** Seed asosidagi tasodif — "Qayta tuzish" tugmasi har safar boshqa reja bersin,
 *  lekin bir xil seed bilan natija takrorlanadigan bo'lsin. */
export function createRandom(seed = 1) {
  let state = (Number(seed) || 1) % 2147483647;
  if (state <= 0) state += 2147483646;
  return function next() {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}
