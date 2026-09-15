/** Controllerlarda tashlanadigan, statusi bor xatolik. */
export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }

  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }

  static notFound(message = 'Topilmadi') {
    return new ApiError(404, message);
  }
}
