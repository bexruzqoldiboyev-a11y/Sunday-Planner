/**
 * Kichik fetch-wrapper: timeout, JSON parse va tushunarli xato obyekti.
 * Har qanday tarmoq muammosi shu yerda "ApiError" ga aylanadi.
 */

const DEFAULT_TIMEOUT = 15000;

export class ApiError extends Error {
  constructor(message, { status = 0, details = null, offline = false } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.offline = offline;
  }
}

export async function request(path, { method = 'GET', body, timeout = DEFAULT_TIMEOUT } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`/api${path}`, {
      method,
      signal: controller.signal,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok || data.ok === false) {
      throw new ApiError(data?.error?.message || 'Server javob bermadi', {
        status: response.status,
        details: data?.error?.details || null,
      });
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const aborted = error.name === 'AbortError';
    throw new ApiError(
      aborted ? 'Server javobini kutish choʻzilib ketdi' : 'Serverga ulanib boʻlmadi',
      { offline: true },
    );
  } finally {
    clearTimeout(timer);
  }
}
