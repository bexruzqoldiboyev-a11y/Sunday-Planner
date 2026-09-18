import { ApiError } from '../utils/ApiError.js';

export function notFound(req, _res, next) {
  next(new ApiError(404, `Bunday endpoint yoʻq: ${req.method} ${req.originalUrl}`));
}

/* eslint-disable no-unused-vars */
export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  if (status >= 500) console.error('[error]', error);

  res.status(status).json({
    ok: false,
    error: {
      message: error.message || 'Serverda kutilmagan xatolik',
      details: error.details || null,
      code: status,
    },
  });
}
