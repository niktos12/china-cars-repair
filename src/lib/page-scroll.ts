/**
 * Мост между SmoothScroll (Lenis) и компонентами, которым нужно временно
 * блокировать прокрутку страницы (мобильное меню).
 * Если Lenis не активен (prefers-reduced-motion), вызовы — no-op.
 */
type LenisLike = { stop: () => void; start: () => void };

let lenis: LenisLike | null = null;

/** SmoothScroll регистрирует свой экземпляр при монтировании. */
export function bindPageScroll(instance: LenisLike | null) {
  lenis = instance;
}

/** Блокирует прокрутку страницы. true — если реально заблокирована. */
export function lockPageScroll(): boolean {
  if (!lenis) return false;
  lenis.stop();
  return true;
}

/** Возвращает прокрутку. */
export function unlockPageScroll() {
  lenis?.start();
}
