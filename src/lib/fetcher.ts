/**
 * Клиент доступа к бэкенду. Адрес(а) вшиваются в бандл при сборке:
 *  - NEXT_PUBLIC_API_URLS=https://a.vercel.app,https://b.netlify.app — два (и больше) бэкенда;
 *  - NEXT_PUBLIC_API_URL=https://a.vercel.app — один бэкенд (старая переменная, работает как раньше).
 * После изменения переменных нужен перезапуск dev-сервера или Redeploy.
 *
 * Два бэкенда (Vercel + Netlify) работают в режиме гонки запросов:
 *  - GET (каталог, заявки, списки) уходит на ВСЕ хостинги одновременно;
 *    берётся первый успешный (2xx) ответ, остальные соединения прерываются;
 *  - записи (POST/PUT/DELETE: заявка с формы, вход, правки товаров) идут на первый
 *    хостинг и только при его недоступности/ошибке 5xx — на второй: иначе заявка
 *    или товар создались бы дважды.
 */
export const API_BASES: string[] = (
  process.env.NEXT_PUBLIC_API_URLS ??
  process.env.NEXT_PUBLIC_API_URL ??
  ""
)
  .split(",")
  .map((s) => s.trim().replace(/\/+$/, ""))
  .filter(Boolean);

/** Первый бэкенд из списка (для совместимости со старым API_BASE) */
export const API_BASE = API_BASES[0] ?? "";

/** Базовый URL или ошибка, если переменные окружения не заданы */
export function requireApiBase(): string {
  if (API_BASES.length === 0) {
    throw new Error(
      "Не задан адрес API: переменные NEXT_PUBLIC_API_URLS и NEXT_PUBLIC_API_URL пусты. " +
        "Укажите хотя бы одну из них в .env.local и перезапустите приложение.",
    );
  }
  return API_BASE;
}

/** Ошибка HTTP-ответа бэкенда с понятным текстом для показа пользователю */
export class ApiHttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
  }
}

const STATUS_TEXT: Record<number, string> = {
  400: "Проверьте правильность заполненных данных",
  404: "Данные не найдены",
  500: "Ошибка сервера, попробуйте позже",
  503: "Сервис временно недоступен",
};

/** ApiHttpError из ответа: текст из JSON-тела ({ error: "..." }) или общий по статусу */
async function toApiError(res: Response): Promise<ApiHttpError> {
  let message = "";
  try {
    const data = (await res.json()) as { error?: string };
    if (data?.error) message = data.error;
  } catch {
    /* тело не JSON — оставляем общий текст */
  }
  if (!message) {
    message =
      STATUS_TEXT[res.status] ??
      `Сервис временно недоступен (ошибка ${res.status})`;
  }
  return new ApiHttpError(res.status, message);
}

/** Единый перевод ошибки запроса в понятный текст */
export function errorMessage(err: unknown): string {
  if (err instanceof ApiHttpError) return err.message;
  if (err instanceof AggregateError) {
    return "Ни один из бэкендов не ответил. Попробуйте позже.";
  }
  if (err instanceof Error && err.message) return err.message;
  return "Сервис временно недоступен. Попробуйте позже.";
}

function networkError(): ApiHttpError {
  return new ApiHttpError(0, "Сервис временно недоступен. Попробуйте позже.");
}

/**
 * GET-запрос в режиме гонки: уходит на все бэкенды сразу,
 * побеждает первый успешный ответ, соединения к остальным прерываются.
 */
export async function raceGet(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  requireApiBase();

  /* Один бэкенд — обычный запрос (поведение прежнее) */
  if (API_BASES.length === 1) {
    try {
      const res = await fetch(`${API_BASES[0]}${path}`, init);
      if (!res.ok) throw await toApiError(res);
      return res;
    } catch (err) {
      if (err instanceof ApiHttpError) throw err;
      throw networkError();
    }
  }

  const controllers = API_BASES.map(() => new AbortController());
  const attempts = API_BASES.map(async (base, i) => {
    const res = await fetch(`${base}${path}`, {
      ...init,
      signal: controllers[i].signal,
    });
    if (!res.ok) throw await toApiError(res);
    /* Победитель найден — глушим запросы к остальным бэкендам */
    controllers.forEach((c, j) => {
      if (j !== i) c.abort();
    });
    return res;
  });

  try {
    return await Promise.any(attempts);
  } catch (err) {
    if (err instanceof AggregateError) {
      /* Ответили ошибкой все — показываем первую содержательную */
      const http = err.errors.find((e) => e instanceof ApiHttpError) as
        | ApiHttpError
        | undefined;
      throw http ?? networkError();
    }
    throw err;
  }
}

/**
 * Запись (POST/PUT/DELETE): первый бэкенд, при недоступности или 5xx — следующий.
 * 4xx (валидация, 401) не ретраится — это ошибка данных, а не хостинга.
 */
export async function fallbackWrite(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  requireApiBase();

  let last: unknown;
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, init);
      if (res.ok) return res;
      const apiErr = await toApiError(res);
      if (res.status < 500) throw apiErr; // 400/401/404/422 — не хостинг, дальше не идём
      last = apiErr; // 5xx — пробуем следующий бэкенд
    } catch (err) {
      if (
        err instanceof ApiHttpError &&
        err.status >= 400 &&
        err.status < 500
      ) {
        throw err;
      }
      last = err;
    }
  }
  throw last instanceof Error ? last : networkError();
}

/** Fetcher для SWR: гонка GET-запросов, проверка статуса, JSON */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await raceGet(url);
  return (await res.json()) as T;
}
