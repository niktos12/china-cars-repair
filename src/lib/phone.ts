/**
 * Маска телефона: +7 (912) 345-67-89. Подставляется в onChange обычного
 * <input> — библиотеки не нужны. Берёт из ввода только цифры, 8/7 в начале
 * трактуется как код страны, лимит — 11 цифр. Разделители дописываются
 * только вместе со следующей цифрой, поэтому Backspace не «залипает».
 */
export function formatRuPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return "";

  if (digits[0] === "8") digits = "7" + digits.slice(1);
  else if (digits[0] !== "7") digits = "7" + digits;
  digits = digits.slice(0, 11);

  const rest = digits.slice(1); // 10 значащих цифр номера без кода страны
  let out = `+7 (${rest.slice(0, 3)}`;
  if (rest.length > 3) out += `) ${rest.slice(3, 6)}`;
  else return out;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  else return out;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}
