/**
 * Универсальный fetcher для SWR: проверяет статус ответа
 * и бросает ошибку, чтобы SWR мог показать error state.
 */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Запрос к ${url} завершился с ошибкой ${res.status}`);
  }
  return (await res.json()) as T;
}
