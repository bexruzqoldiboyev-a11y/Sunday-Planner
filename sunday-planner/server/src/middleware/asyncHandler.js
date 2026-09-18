/** async controllerlardagi xatolarni Express error handlerga uzatadi. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
