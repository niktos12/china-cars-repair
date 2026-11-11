import { z } from "zod";

/**
 * Zod-схема заявки. Единый источник правды:
 *  - на клиенте через неё валидируется форма (react-hook-form);
 *  - на сервере — данные в Server Action и в REST-роуте.
 */
export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя (минимум 2 символа)")
    .max(100, "Слишком длинное имя"),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9\s\-()]{6,20}$/,
      "Введите корректный номер телефона",
    ),
  carModel: z
    .string()
    .trim()
    .max(120, "Слишком длинное название модели")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, "Комментарий слишком длинный")
    .optional()
    .or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

/**
 * Схема товара для формы админки. Цена — строка (поле input),
 * серверный экшен приводит её к number | null перед записью в БД.
 */
export const productFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Минимум 2 символа")
    .max(120, "Максимум 120 символов")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Только строчные латинские буквы, цифры и дефис"),
  title: z.string().trim().min(4, "Минимум 4 символа").max(200),
  carModel: z.string().trim().min(2, "Укажите модель авто").max(120),
  position: z.string().trim().min(2, "Укажите позицию").max(80),
  material: z.string().trim().min(4, "Укажите материал").max(160),
  description: z.string().trim().min(10, "Минимум 10 символов").max(4000),
  priceFrom: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{1,7}$/.test(v), "Цена — целое число в рублях (или пусто)"),
  /** Фото: путь в /public или внешний URL. Пустая строка = заглушка с иконкой */
  imageUrl: z
    .string()
    .trim()
    .max(500, "Слишком длинная ссылка")
    .refine(
      (v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v),
      "Ссылка должна начинаться с /, http:// или https://",
    )
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

/** Логин в админку. */
export const adminLoginSchema = z.object({
  username: z.string().trim().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

/** Телефон для шапки/подвала — заглушка из ТЗ, заменить на реальный. */
export const CONTACT_PHONE = "+7 (900) 123-45-67";
export const CONTACT_EMAIL = "info@tuning304.example";
