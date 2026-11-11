/**
 * Базовый URL API бэкенда.
 *
 * Фронтенд работает ТОЛЬКО в связке с отдельным бэкендом:
 *
 *     фронтенд (Next.js)  <->  бэкенд (Express)  <->  база данных (Postgres)
 *
 * Адрес бэкенда задаётся переменной окружения NEXT_PUBLIC_API_URL
 * (например, https://china-cars-backend.vercel.app). Собственных
 * API-маршрутов и доступа к БД у фронтенда больше НЕТ: все данные
 * (каталог, заявки, админка) приходят исключительно с бэкенда.
 *
 * ВАЖНО: NEXT_PUBLIC_* переменные Next.js вшивает в бандл при сборке,
 * поэтому после изменения переменной нужен перезапуск dev-сервера
 * или Redeploy на Vercel.
 */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/+$/,
  "",
);

/**
 * Возвращает базовый URL или бросает понятную ошибку,
 * если переменная окружения не задана (частая причина «белого экрана»
 * каталога после переноса на разделённую архитектуру).
 */
export function requireApiBase(): string {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_URL не задан. Фронтенд работает только с бэкендом: " +
        "укажите адрес API (например, https://ваш-бэк.vercel.app) в .env.local " +
        "или в Variables проекта Vercel и пересоберите приложение.",
    );
  }
  return API_BASE;
}

/**
 * Универсальный fetcher для SWR: проверяет статус ответа
 * и бросает ошибку с текстом от бэкенда, чтобы SWR показал error state.
 */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(`${requireApiBase()}${url}`);
  if (!res.ok) {
    let message = `Запрос к ${url} завершился с ошибкой ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      /* тело не JSON — оставляем стандартное сообщение */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}
