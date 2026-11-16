/**
 * Клиент API бэкенда (адрес(а) — NEXT_PUBLIC_API_URLS или NEXT_PUBLIC_API_URL).
 * Публичные запросы — без авторизации; админ-API — с JWT: POST /api/admin/login
 * возвращает токен, он хранится в localStorage и идёт заголовком
 * Authorization: Bearer. 401 выбрасывает AuthError — код отправляет на /admin/login.
 *
 * GET-запросы летят на все бэкенды сразу (raceGet — побеждает первый ответ),
 * записи (POST/PUT/DELETE) — на первый бэкенд с фолбэком на второй (fallbackWrite).
 */
import { ApiHttpError, errorMessage, fallbackWrite, raceGet } from "./fetcher";
import type {
  AdminLeadsResponse,
  AdminLoginResponse,
  AdminProduct,
  AdminProductsResponse,
  LeadActionResult,
  LeadInput,
  ProductDto,
  ProductPageResponse,
  ProductSavePayload,
  ProductsResponse,
} from "./types";

/* ==================================================================== */
/* Публичное API: каталог, страница товара, заявки                       */
/* ==================================================================== */

/** GET /api/products — каталог для страницы «Продукция» (SWR) */
export async function fetchProducts(): Promise<ProductsResponse> {
  const res = await raceGet("/api/products");
  return (await res.json()) as ProductsResponse;
}

/** GET /api/products/:slug — товар для серверного рендера страницы.
 *  404 или недоступный бэкенд = null (страница покажет «не найдено»). */
export async function fetchProductBySlug(
  slug: string,
): Promise<ProductPageResponse | null> {
  try {
    const res = await raceGet(`/api/products/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    return (await res.json()) as ProductPageResponse;
  } catch (err) {
    /* 404 — товара действительно нет (не логируем как аварию) */
    if (err instanceof ApiHttpError && err.status === 404) return null;
    console.error("[api] fetchProductBySlug:", err);
    return null;
  }
}

/** Похожие товары: та же модель авто, без самого товара, максимум 3 */
export async function fetchRelatedProducts(
  carModel: string,
  excludeSlug: string,
): Promise<ProductDto[]> {
  const { products } = await fetchProducts();
  return products
    .filter((p) => p.carModel === carModel && p.slug !== excludeSlug)
    .slice(0, 3);
}

/** POST /api/leads?source=... — заявка с формы.
 *  Бросает Error с текстом от бэкенда (валидация, недоступность). */
export async function postLead(
  values: LeadInput,
  source: string,
): Promise<LeadActionResult> {
  const res = await fallbackWrite(
    `/api/leads?source=${encodeURIComponent(source)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    },
  );
  const data = (await res.json().catch(() => null)) as
    | (LeadActionResult & { error?: string })
    | null;
  if (!data?.ok) {
    throw new Error("Что-то пошло не так. Попробуйте ещё раз.");
  }
  return data;
}

/* ==================================================================== */
/* Админ-API: JWT в localStorage, Bearer-заголовок                       */
/* ==================================================================== */

const TOKEN_KEY = "granfort.admin.jwt";

/** 401 от бэкенда: токена нет/просрочен — нужно разлогинить */
export class AuthError extends Error {
  constructor() {
    super("Сессия истекла. Войдите заново.");
    this.name = "AuthError";
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Запрос к /api/admin/* с Bearer-токеном. GET — гонка по всем бэкендам,
 * записи — первый бэкенд + фолбэк. 401 → AuthError,
 * остальные ошибки → Error с текстом от бэкенда.
 */
export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  const token = getStoredToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const method = (init?.method ?? "GET").toUpperCase();

  let res: Response;
  try {
    res =
      method === "GET"
        ? await raceGet(path, { ...init, headers })
        : await fallbackWrite(path, { ...init, headers });
  } catch (err) {
    if (err instanceof ApiHttpError && err.status === 401) {
      clearStoredToken();
      throw new AuthError();
    }
    throw new Error(errorMessage(err));
  }

  return (await res.json().catch(() => null)) as T;
}

/** POST /api/admin/login — обмен логин/пароль на JWT. Возвращает токен. */
export async function adminLogin(
  username: string,
  password: string,
): Promise<string> {
  const res = await fallbackWrite("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = (await res.json().catch(() => null)) as
    | (AdminLoginResponse & { error?: string })
    | null;
  if (!data?.token) {
    throw new Error(data?.error ?? "Не удалось войти. Попробуйте ещё раз.");
  }
  return data.token;
}

/** GET /api/admin/me — проверка токена, возвращает имя администратора */
export async function adminMe(): Promise<string> {
  const data = await adminFetch<{ username: string | null }>("/api/admin/me");
  return data.username ?? "admin";
}

/** fetcher для SWR на админских эндпоинтах */
export const adminFetcher = <T>(url: string): Promise<T> => adminFetch<T>(url);

export function listAdminProducts(): Promise<AdminProductsResponse> {
  return adminFetch<AdminProductsResponse>("/api/admin/products");
}

export function listAdminLeads(): Promise<AdminLeadsResponse> {
  return adminFetch<AdminLeadsResponse>("/api/admin/leads");
}

export async function createAdminProduct(
  payload: ProductSavePayload,
): Promise<AdminProduct> {
  const data = await adminFetch<{ product: AdminProduct }>(
    "/api/admin/products",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return data.product;
}

export async function updateAdminProduct(
  id: number,
  payload: ProductSavePayload,
): Promise<AdminProduct> {
  const data = await adminFetch<{ product: AdminProduct }>(
    `/api/admin/products/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return data.product;
}

export async function deleteAdminProduct(id: number): Promise<void> {
  await adminFetch<{ ok: boolean }>(`/api/admin/products/${id}`, {
    method: "DELETE",
  });
}

export async function deleteAdminLead(id: number): Promise<void> {
  await adminFetch<{ ok: boolean }>(`/api/admin/leads/${id}`, {
    method: "DELETE",
  });
}
