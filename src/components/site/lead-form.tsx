"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { postLead } from "@/lib/api";
import { formatRuPhone } from "@/lib/phone";
import {
  leadSchema,
  type LeadInput,
} from "@/lib/validation";

/** Клиентская схема = серверная leadSchema + согласие (152-ФЗ) и
 *  требование полного номера телефона. */
const leadFormSchema = leadSchema.and(
  z.object({
    consent: z
      .boolean()
      .refine((v) => v === true, {
        message: "Отметьте согласие на обработку персональных данных",
      }),
    /** Маска не даёт ввести лишнее, но номер можно отправить недобранным —
     * требуем все 11 цифр. */
    phone: z.string().refine((v) => v.replace(/\D/g, "").length === 11, {
      message: "Введите номер полностью — 11 цифр",
    }),
  }),
);

type LeadFormValues = LeadInput & { consent: boolean };

/**
 * Форма заявки. variant="light" — для светлых секций (главная, товар),
 * variant="dark" — для тёмных (контакты, индивидуальный заказ).
 */
export function LeadForm({
  source = "website",
  title,
  description,
  defaultCarModel,
  variant = "dark",
  className,
}: {
  /** откуда отправлена заявка — попадает в БД (поле leads.source) */
  source?: string;
  /** заголовок формы; на главной не выводится (заголовок слева от формы) */
  title?: string;
  description?: string;
  /** предзаполнить поле «Автомобиль» (например, со страницы товара) */
  defaultCarModel?: string;
  /** светлая или тёмная секция */
  variant?: "light" | "dark";
  className?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      carModel: defaultCarModel ?? "",
      message: "",
      consent: false,
    },
  });

  /** Маска телефона: забираем onChange из register и подставляем формат. */
  const phoneRegister = register("phone");

  const isLight = variant === "light";
  const labelCls = `mb-1 block text-xs ${isLight ? "text-zinc-600" : "text-zinc-400"}`;
  const inputCls = isLight ? "input-underline-light" : "input-underline-dark";
  const errorCls = "mt-1.5 text-xs text-red-600";

  async function onSubmit({ consent: _consent, ...values }: LeadFormValues) {
    try {
      await postLead(values, source);
      toast.success("Заявка отправлена!", {
        description: "Мы свяжемся с вами в ближайшее время.",
      });
      reset({ name: "", phone: "", carModel: "", message: "", consent: false });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Что-то пошло не так. Попробуйте ещё раз.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={className}
      noValidate
      aria-label="Форма заявки"
    >
      {title && (
        <h3 className="text-xl font-bold text-current">{title}</h3>
      )}
      {description && (
        <p className={`mt-2 text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
          {description}
        </p>
      )}

      <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={labelCls}>
            Ваше имя
          </label>
          <input
            id="lead-name"
            type="text"
            placeholder="Как к вам обращаться"
            className={inputCls}
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className={errorCls} role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-phone" className={labelCls}>
            Телефон
          </label>
          <input
            id="lead-phone"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            className={inputCls}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            {...phoneRegister}
            onChange={(e) => {
              e.target.value = formatRuPhone(e.target.value);
              phoneRegister.onChange(e);
            }}
          />
          {errors.phone && (
            <p className={errorCls} role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-car" className={labelCls}>
            Автомобиль
          </label>
          <input
            id="lead-car"
            type="text"
            placeholder="Марка, модель и год"
            className={inputCls}
            {...register("carModel")}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="lead-message" className={labelCls}>
            Комментарий
          </label>
          <input
            id="lead-message"
            type="text"
            placeholder="Что вас интересует?"
            className={inputCls}
            {...register("message")}
          />
          {errors.message && (
            <p className={errorCls} role="alert">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label
          className={`flex cursor-pointer items-start gap-2.5 text-xs ${
            isLight ? "text-zinc-600" : "text-zinc-400"
          }`}
        >
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#d4af37]"
            {...register("consent")}
          />
          <span>
            Я согласен на обработку персональных данных
            {errors.consent && (
              <span className={`${errorCls} block`} role="alert">
                {errors.consent.message}
              </span>
            )}
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-7 ${isLight ? "btn-solid-dark" : "btn-outline-gold"}`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Отправляем...
          </>
        ) : (
          <>
            Отправить заявку
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
