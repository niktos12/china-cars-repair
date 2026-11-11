"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { ImagePlus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AuthError,
  createAdminProduct,
  updateAdminProduct,
} from "@/lib/api";
import type { ProductSavePayload } from "@/lib/types";
import {
  productFormSchema,
  type ProductFormInput,
} from "@/lib/validation";

/**
 * Форма создания/редактирования товара.
 * Валидация на клиенте (zod), затем POST/PUT /api/admin/products на бэкенд
 * с Bearer-токеном (повторная валидация там же, в productPayloadSchema).
 */
export function ProductForm({
  productId,
  defaultValues,
}: {
  /** задан — редактирование, не задан — создание */
  productId?: number;
  defaultValues: ProductFormInput;
}) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl ?? "");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  async function onSubmit(values: ProductFormInput) {
    /* Форма хранит цену строкой — приводим к формату API (number | null) */
    const payload: ProductSavePayload = {
      slug: values.slug,
      title: values.title,
      carModel: values.carModel,
      position: values.position,
      material: values.material,
      description: values.description,
      priceFrom: values.priceFrom === "" ? null : Number(values.priceFrom),
      imageUrl: values.imageUrl ? values.imageUrl : null,
      isActive: values.isActive,
    };

    try {
      if (productId) {
        await updateAdminProduct(productId, payload);
      } else {
        await createAdminProduct(payload);
      }
      toast.success(productId ? "Товар сохранён" : "Товар создан", {
        description: "Изменения уже на сайте.",
      });
      /* Обновляем кэш админки и публичного каталога */
      void mutate("/api/admin/products");
      void mutate("/api/products");
      router.push("/admin/products");
    } catch (err) {
      if (err instanceof AuthError) {
        toast.error(err.message);
        router.replace("/admin/login");
      } else {
        toast.error(
          err instanceof Error ? err.message : "Не удалось сохранить товар",
        );
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="p-title">Название *</Label>
          <Input
            id="p-title"
            placeholder="Защита переднего бампера JAC T9"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-red-500" role="alert">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="p-slug">Slug (адрес страницы) *</Label>
          <Input
            id="p-slug"
            placeholder="jac-t9-front-aisi304"
            aria-invalid={!!errors.slug}
            {...register("slug")}
          />
          <p className="text-xs text-zinc-500">
            Страница товара: /products/&lt;slug&gt;. Латиница, цифры, дефис.
          </p>
          {errors.slug && (
            <p className="text-xs text-red-500" role="alert">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="p-car">Модель авто *</Label>
          <Input
            id="p-car"
            list="car-models"
            placeholder="JAC T9"
            aria-invalid={!!errors.carModel}
            {...register("carModel")}
          />
          <datalist id="car-models">
            <option value="JAC T9" />
            <option value="Haval H3" />
          </datalist>
          {errors.carModel && (
            <p className="text-xs text-red-500" role="alert">{errors.carModel.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="p-position">Позиция *</Label>
          <Input
            id="p-position"
            list="positions"
            placeholder="Передний бампер / Задний бампер / Комплект"
            aria-invalid={!!errors.position}
            {...register("position")}
          />
          <datalist id="positions">
            <option value="Передний бампер" />
            <option value="Задний бампер" />
            <option value="Комплект" />
          </datalist>
          {errors.position && (
            <p className="text-xs text-red-500" role="alert">{errors.position.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="p-material">Материал *</Label>
          <Input
            id="p-material"
            placeholder="Нержавеющая сталь AISI 304, зеркальная полировка"
            aria-invalid={!!errors.material}
            {...register("material")}
          />
          {errors.material && (
            <p className="text-xs text-red-500" role="alert">{errors.material.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="p-price">Цена «от», ₽</Label>
          <Input
            id="p-price"
            inputMode="numeric"
            placeholder="14900 (пусто = цена по запросу)"
            aria-invalid={!!errors.priceFrom}
            {...register("priceFrom")}
          />
          {errors.priceFrom && (
            <p className="text-xs text-red-500" role="alert">{errors.priceFrom.message}</p>
          )}
        </div>
      </div>

      {/* Фото товара */}
      <div className="grid gap-4 md:grid-cols-[1fr_240px]">
        <div className="space-y-1.5">
          <Label htmlFor="p-image">Фото (ссылка)</Label>
          <div className="relative">
            <ImagePlus
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <Input
              id="p-image"
              className="pl-9"
              placeholder="/images/jac-t9.jpg или https://..."
              aria-invalid={!!errors.imageUrl}
              {...register("imageUrl", {
                onChange: (e) => setImageUrl(e.target.value),
              })}
            />
          </div>
          <p className="text-xs text-zinc-500">
            Путь в /public (например, /images/jac-t9.jpg) или внешний URL.
            Пусто — в карточке будет заглушка с иконкой.
          </p>
          {errors.imageUrl && (
            <p className="text-xs text-red-500" role="alert">{errors.imageUrl.message}</p>
          )}
        </div>
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden border border-white/10 bg-white/5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Предпросмотр фото товара"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-zinc-600">предпросмотр</span>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="p-description">Описание *</Label>
        <Textarea
          id="p-description"
          rows={5}
          placeholder="Что входит в комплект, особенности монтажа и т.д."
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500" role="alert">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <Checkbox
              id="p-active"
              checked={field.value}
              onCheckedChange={(v) => field.onChange(Boolean(v))}
            />
          )}
        />
        <Label htmlFor="p-active" className="cursor-pointer">
          Показывать на сайте (активен)
        </Label>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gold font-semibold text-coal hover:bg-gold-light"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          {productId ? "Сохранить изменения" : "Создать товар"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
