/**
 * Адрес бэкенда (NEXT_PUBLIC_API_URL) вшивается в бандл при сборке:
 * после изменения переменной нужен перезапуск dev-сервера или Redeploy.
 */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/+$/,
  "",
);

/** Базовый URL или ошибка, если переменная окружения не задана */
export function requireApiBase(): string {
  if (!API_BASE) {
    throw new Error(
      "Не задан адрес API: переменная NEXT_PUBLIC_API_URL пуста. " +
        "Укажите её в .env.local и перезапустите приложение.",
    );
  }
  return API_BASE;
}

/** Fetcher для SWR: проверяет статус и бросает ошибку с текстом от бэкенда */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(`${requireApiBase()}${url}`);
  if (!res.ok) {
    let message = `Сервис временно недоступен (ошибка ${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      /* тело не JSON — оставляем общий текст */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}
