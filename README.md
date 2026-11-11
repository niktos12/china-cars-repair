# TUNING/304 — сайт-визитка производства защиты бамперов

Тёмный сайт с золотыми акцентами (палитра: фон `#1a1a1a`, золото `#d4af37`,
светлые секции `#f5f5f5`, шрифт Comfortaa) по референс-макету: герой
«Защита, которая держит форму», философия бренда, карточки моделей,
6 преимуществ, 3 шага индивидуальной разработки, форма заявки.

Страницы: Главная, О компании, Продукция (+ отдельная страница каждого товара),
Преимущества, На заказ (индивидуальное изготовление), Контакты, Админ-панель.
Название бренда, телефоны, адреса и цены — **заглушки**, заменить на реальные.

## Архитектура

Фронтенд — **чистый клиент API**: своих API-маршрутов и подключения к БД
у него больше нет. Все данные приходят от отдельного Express-бэкенда
(репозиторий `china-cars-backend`):

```
Браузер  <-fetch->  Next.js фронтенд  <-fetch->  Express-бэкенд  <-Drizzle->  PostgreSQL (Neon)
```

Единственная обязательная переменная окружения — `NEXT_PUBLIC_API_URL`
(адрес бэкенда). Если она не задана, фронтенд честно покажет ошибку
«NEXT_PUBLIC_API_URL не задан» вместо молчаливых пустых данных.

## Стек

| Слой | Технологии |
|---|---|
| Фронтенд | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui |
| Бэкенд | отдельный репозиторий: Express 4 + Drizzle ORM + PostgreSQL (Neon) |
| Запросы | SWR (каталог, списки админки) + fetch (`src/lib/api.ts`) |
| Авторизация админки | JWT из бэкенда (`POST /api/admin/login`), Bearer-токен в localStorage |
| Валидация | Zod — схемы форм на клиенте, бэкенд повторно валидирует тем же набором правил |
| Анимации | framer-motion (появление блоков, мобильное меню) |
| Формы | react-hook-form + @hookform/resolvers |
| Тосты | sonner |
| Деплой | Vercel: фронт этим репо + бэкенд отдельным Node.js-проектом |

## Структура

```
src/
├── app/
│   ├── page.tsx                  # Главная: герой, философия, модели, преимущества, шаги, форма
│   ├── about/                    # О компании (факты, материалы)
│   ├── products/
│   │   ├── page.tsx              # Каталог: страница + клиент с SWR, фильтр ?model=
│   │   └── [slug]/page.tsx       # Карточка товара: SSR-фетч с бэкенда + SEO-метаданные
│   ├── advantages/               # Преимущества и материалы
│   ├── custom/                   # Индивидуальное изготовление + форма
│   ├── contacts/                 # Контакты + форма
│   └── admin/
│       ├── login/page.tsx        # Вход: POST /api/admin/login → JWT в localStorage
│       └── (dashboard)/          # AdminGate проверяет токен через GET /api/admin/me
│           ├── page.tsx          #   Обзор: счётчики, последняя заявка
│           ├── products/         #   Список / создание / редактирование / удаление
│           └── leads/            #   Заявки: таблица + удаление
├── components/
│   ├── site/                     # Navbar, Footer, LeadForm, ProductCard, FadeIn
│   └── admin/                    # AdminGate, AdminNav, LoginForm, ProductForm, клиенты страниц
└── lib/
    ├── api.ts                    # ЕДИНЫЙ клиент бэкенда: публичные эндпоинты + /api/admin/* (Bearer)
    ├── fetcher.ts                # API_BASE из NEXT_PUBLIC_API_URL + SWR-фетчер
    ├── types.ts                  # Типы DTO (контракт с бэкендом)
    ├── validation.ts             # zod-схемы форм, контакты-заглушки
    └── site-data.ts              # Контент страниц (преимущества и т.д.)
```

## Где ходят запросы к бэкенду

| Что | Код | Запрос |
|---|---|---|
| Каталог «Продукция» | `src/app/products/products-client.tsx` | SWR → `GET /api/products` |
| Карточка товара | `src/app/products/[slug]/page.tsx` | SSR-фетч → `GET /api/products/:slug` (+ каталог для «похожих») |
| Форма заявки (все страницы) | `src/lib/api.ts → postLead()` | `POST /api/leads?source=...` |
| Вход в админку | `src/components/admin/login-form.tsx` | `POST /api/admin/login` |
| Проверка сессии | `src/components/admin/admin-gate.tsx` | `GET /api/admin/me` |
| Список/CRUD товаров | `overview-client`, `products-admin-client`, `product-edit-client`, `product-form` | `GET/POST/PUT/DELETE /api/admin/products` |
| Заявки в админке | `leads-client.tsx`, `delete-buttons.tsx` | `GET /api/admin/leads`, `DELETE /api/admin/leads/:id` |

После правок товаров в админке клиент сбрасывает кэш SWR (`mutate`), поэтому
изменения видны и в админке, и в публичном каталоге без перезапуска.

## Админка

Адрес: **`/admin`** (ссылка «Вход для сотрудников» — в подвале сайта).

- Логин/пароль задаются **на бэкенде** переменными `ADMIN_USERNAME` /
  `ADMIN_PASSWORD`; `POST /api/admin/login` возвращает JWT (живёт 8 часов).
- Токен хранится в `localStorage` и отправляется заголовком
  `Authorization: Bearer ...`. Просрочка (401) → админка отправляет на логин.
- Без БД (демо-режим бэкенда) списки отдаются демонстрационными, а запись
  (создание/правка/удаление) отвечает 503 — это нормально: подключите
  `DATABASE_URL`, и всё заработает.

Возможности:

- **Обзор**: количество товаров и заявок, последняя заявка;
- **Товары**: таблица всех позиций, создание, редактирование, скрытие
  (`isActive`), удаление. Поле «Фото» (`/images/...` или внешний URL)
  с предпросмотром прямо в форме. Правки сразу видны на сайте;
- **Заявки**: все обращения с датой, телефоном, источником (страница/товар);
  удаление (`DELETE /api/admin/leads/:id`).

## Демо-режим (свойство бэкенда)

Если на бэкенде переменная `DATABASE_URL` не задана или недоступна — он не
падает: каталог отдаёт демо-позиции с флагом `demo: true` (фронт показывает
золотую плашку), форма пишет заявку в лог сервера. Фронт при этом работает
как обычно — источник данных всегда один: бэкенд.

## Локальный запуск

Нужны два терминала: бэкенд и фронтенд.

```bash
# Терминал 1 — бэкенд (отдельное репо china-cars-backend)
cd china-cars-backend
cp .env.example .env            # вписать DATABASE_URL (Neon), ADMIN_*, CORS_ORIGIN
npm install
npm run db:migrate              # создать таблицы products/leads в Neon
npm run db:seed                 # наполнить каталог демо-товарами
npm run dev                     # http://localhost:3001

# Терминал 2 — фронтенд (это репо)
npm install
cp .env.example .env.local      # NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev                     # http://localhost:3000
```

В `CORS_ORIGIN` бэкенда добавьте `http://localhost:3000`, иначе браузер
заблокирует запросы. Напоминание: после изменения `NEXT_PUBLIC_API_URL`
dev-сервер фронта нужно перезапускать — переменная вшивается при сборке.

## Деплой на Vercel (два проекта)

| Проект | Переменная | Значение |
|---|---|---|
| Фронтенд (это репо) | `NEXT_PUBLIC_API_URL` | `https://ваш-бэк.vercel.app` |
| Бэкенд (china-cars-backend) | `DATABASE_URL` | pooled-строка Neon (`...-pooler...neon.tech/...?sslmode=require`) |
| Бэкенд | `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET` | логин/пароль админки |
| Бэкенд | `CORS_ORIGIN` | `https://ваш-фронт.vercel.app` |

Порядок: залить бэкенд → залить фронтенд → добавить переменные →
**Redeploy обоих** (NEXT_PUBLIC_* и CORS_ORIGIN применяются пересборкой).
Проверка: `https://ваш-бэк.vercel.app/api/health` → `"db":"configured"`;
на сайте каталог открывается без плашки «Демо-режим».

## Что заменить перед запуском в прод

- [ ] Название бренда «TUNING/304» → финальное (согласуется по ТЗ);
- [ ] телефон `+7 (900) 123-45-67`, почта, мессенджеры и адрес производства — в `src/lib/validation.ts` и `src/app/contacts/page.tsx`;
- [ ] **пароль админки**: `ADMIN_PASSWORD` и `ADMIN_JWT_SECRET` в Variables бэкенд-проекта Vercel;
- [ ] цены и описания товаров — заглушки (правьте прямо в админке);
- [ ] заменить стоковые фото на реальные снимки продукции: файлы в
  `public/images/` (hero.jpg, philosophy.jpg, jac-t9.jpg, haval-h3.jpg,
  custom.jpg) + поле «Фото» у каждого товара в админке;
- [ ] подключить свой домен в Vercel (Settings → Domains);
- [ ] настроить уведомления о заявках (Telegram-бот или Resend) — на бэкенде,
  в роуте `POST /api/leads`.
