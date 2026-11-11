import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Простая авторизация админки:
 *  - логин/пароль берутся из переменных окружения (со значениями по умолчанию
 *    для локального запуска — ОБЯЗАТЕЛЬНО переопределите на Railway);
 *  - после входа выдаётся подписанная HMAC cookie со сроком жизни 7 дней;
 *  - каждый защищённый вызов проверяет подпись и срок.
 */

const COOKIE_NAME = "sc_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET =
  process.env.ADMIN_SESSION_SECRET || "dev-secret-change-me-on-railway";

type SessionPayload = { u: string; exp: number };

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function createToken(username: string): string {
  const payload: SessionPayload = {
    u: username,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function verifyToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function startSession(username: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Возвращает логин админа, если сессия валидна, иначе null. */
export async function getSession(): Promise<string | null> {
  const store = await cookies();
  const payload = verifyToken(store.get(COOKIE_NAME)?.value);
  return payload?.u ?? null;
}

/** Для серверных страниц админки: без сессии — редирект на логин. */
export async function requireAdmin(): Promise<string> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Для Server Action'ов и API: без сессии — «не авторизован». */
export async function requireAdminApi(): Promise<string | null> {
  return getSession();
}
