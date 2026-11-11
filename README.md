# TUNING/304 — сайт-визитка производства защиты бамперов

Тёмный сайт с золотыми акцентами (палитра: фон `#1a1a1a`, золото `#d4af37`,
светлые секции `#f5f5f5`, шрифт Comfortaa) по референс-макету: герой
«Защита, которая держит форму», философия бренда, карточки моделей,
6 преимуществ, 3 шага индивидуальной разработки, форма заявки.

Страницы: Главная, О компании, Продукция (+ отдельная страница каждого товара),
Преимущества, На заказ (индивидуальное изготовление), Контакты, Админ-панель.
Название бренда, телефоны, адреса и цены — **заглушки**, заменить на реальные.

## Стек

| Слой | Технологии |
|---|---|
| Фронтенд | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui |
| Бэкенд | Next.js API Routes + Server Actions (Node.js runtime) |
| БД | PostgreSQL + Drizzle ORM (миграции SQL в `drizzle/`) |
| Валидация | Zod — одна схема для клиента и сервера (`src/lib/validation.ts`) |
| Данные (фетчи) | SWR (`/products` запрашивает `GET /api/products`) |
| Анимации | framer-motion (появление блоков, мобильное меню) |
| Шрифт | Comfortaa (кириллица) через next/font |
| Формы | react-hook-form + @hookform/resolvers |
| Тосты | sonner |
| Иконки | lucide-react |
| Деплой | Railway (Nixpacks, healthcheck, pre-deploy миграции) |

## Структура

```
src/
├── app/
│   ├── page.tsx                  # Главная: герой, философия, модели, преимущества, шаги, форма
│   ├── about/                    # О компании (факты, материалы)
│   ├── products/
│   │   ├── page.tsx              # Каталог: страница + клиент с SWR, фильтр ?model=
│   │   └── [slug]/page.tsx       # Карточка товара (SEO-метаданные, заявка с предзаполнением)
│   ├── advantages/               # Преимущества и материалы
│   ├── custom/                   # Индивидуальное изготовление + форма
│   ├── contacts/                 # Контакты + форма
│   ├── admin/
│   │   ├── login/page.tsx        # Вход (логин/пароль из переменных окружения)
│   │   └── (dashboard)/          # Защищённые страницы (редирект без сессии)
│   │       ├── page.tsx          #   Обзор: счётчики, последняя заявка
│   │       ├── products/         #   Список / создание / редактирование / удаление
│   │       └── leads/            #   Заявки: таблица + удаление
│   └── api/
│       ├── products/route.ts     # GET  каталог (JSON)
│       ├── leads/route.ts        # POST заявка (REST-вариант)
│       └── health/route.ts       # GET health-check для Railway
├── components/
│   ├── site/                     # Navbar, Footer, LeadForm, ProductCard, FadeIn
│   └── admin/                    # AdminNav, LoginForm, ProductForm, кнопки удаления
├── lib/                          # zod-схемы, типы DTO, SWR-фетчер, данные сайта
└── server/                       # ← БЭКЕНД-СЛОЙ (Node.js)
    ├── db/schema.ts              #   таблицы products, leads (Drizzle)
    ├── db/index.ts               #   клиент БД + демо-режим без DATABASE_URL
    ├── queries.ts                #   каталог, заявки, CRUD товаров
    ├── actions.ts                #   Server Action публичной формы
    ├── admin-actions.ts          #   Server Actions админки (login, CRUD) — с проверкой сессии
    ├── auth.ts                   #   сессия админа: HMAC-cookie, логин/пароль из env
    └── demo-store.ts             #   in-memory стор для режима без БД
drizzle/                          # SQL-миграции (применяются на Railway автоматически)
scripts/seed.ts                   # первичное наполнение БД
railway.json                      # конфиг деплоя: build/start/pre-deploy/healthcheck
```

## Админка

Адрес: **`/admin`** (ссылка «Вход для сотрудников» — в подвале сайта).

- Логин/пароль задаются переменными окружения `ADMIN_USERNAME` / `ADMIN_PASSWORD`
  (по умолчанию `admin` / `admin123` — обязательно смените на Railway).
- Сессия — подписанная HMAC cookie (секрет в `ADMIN_SESSION_SECRET`), живёт 7 дней.
- Без БД (демо-режим) админка полностью интерактивна, но изменения хранятся
  в памяти процесса и сбрасываются при перезапуске. С PostgreSQL — всё
  сохраняется в БД.

Возможности:

- **Обзор**: количество товаров и заявок, последняя заявка;
- **Товары**: таблица всех позиций, создание, редактирование, скрытие
  (`isActive`), удаление. У товара есть поле «Фото» (`/images/...` из `/public`
  или внешний URL) с предпросмотром прямо в форме. Правки сразу видны на сайте;
- **Заявки**: все обращения с датой, телефоном, источником (страница/товар);
  удаление. У каждой карточки товара свой источник вида `product:<slug>`.

## Демо-режим (важно)

Если переменная `DATABASE_URL` не задана или недоступна — сайт не падает:
каталог отдаёт заглушки с плашкой «Демо-режим», форма пишет заявку в лог
сервера. На Railway с подключённым PostgreSQL данные идут из реальной БД.

---

## Локальный запуск

```bash
npm install                 # или bun install
cp .env.example .env        # укажите локальный/облачный Postgres
npm run db:push             # создать таблицы (для быстрой разработки)
npm run db:seed             # наполнить каталог демо-товарами
npm run dev                 # http://localhost:3000
```

Команды Drizzle:

```bash
npm run db:generate         # сгенерировать SQL-миграцию из schema.ts
npm run db:migrate          # применить миграции (используется на Railway)
npm run db:studio           # визуальный редактор данных
```

---

## Шаг 1. Залить на GitHub

```bash
cd <папка проекта>
git init
git add .
git commit -m "feat: стартовый сайт-визитка (Next.js + Drizzle + Railway)"
git branch -M main
git remote add origin https://github.com/<ваш-логин>/<имя-репозитория>.git
git push -u origin main
```

`.env` в репозиторий не попадёт (уже в `.gitignore`) — секреты только в переменных Railway.

## Шаг 2. Развернуть на Railway

1. Зайдите на [railway.com](https://railway.com) → **New Project → Deploy from GitHub repo** → выберите репозиторий. Railway сам определит Next.js (`npm run build` из `railway.json`).
2. Добавьте БД: в том же проекте **+ New → Database → PostgreSQL**.
3. Свяжите приложение с БД: сервис приложения → **Variables → Add Reference Variable → `DATABASE_URL`** (из сервиса Postgres). Проект перезапустится сам.
4. Публичный домен: сервис приложения → **Settings → Networking → Generate Domain** → получите `...up.railway.app`.
5. Дождитесь деплоя. Railway перед каждым запуском выполнит `npm run db:migrate`
   (pre-deploy command из `railway.json`) — таблицы создадутся автоматически.
6. Наполните каталог: скопируйте публичную строку подключения Postgres
   (сервис Postgres → Variables → `DATABASE_URL`) и выполните локально:
   ```bash
   DATABASE_URL="postgresql://..." npm run db:seed
   ```

Проверка: откройте `https://<домен>/api/health` → `{"ok":true,"db":"configured"}`,
а на `/products` пропадёт плашка «Демо-режим».

Полезно: вкладка **Deployments / Logs** — логи приложения; **Metrics** — расход ресурсов.

## Шаг 3. Обновления

Любой `git push` в `main` автоматически перезапускает деплой:
изменили код → push → Railway пересобрал → миграции применились → сайт обновился.

---

## Как фронтенд общается с бэкендом

Бэкенд и фронтенд живут **в одном процессе** — это обычное приложение Next.js:

1. **REST + SWR (каталог).** Клиентский компонент `useSWR("/api/products", fetcher)`
   делает обычный `fetch` на тот же домен → Next.js выполняет серверный роут
   `app/api/products/route.ts` (это Node.js) → тот через Drizzle читает Postgres
   → возвращает JSON. Фронт рисует карточки. Плюсы: кэширование SWR, загрузка,
   ошибки и повторные запросы — из коробки.
2. **Server Action (форма заявки).** `LeadForm` вызывает функцию
   `submitLeadAction()` напрямую — это «прокол» клиент-сервер границы без ручного
   fetch и REST-эндпоинта. Функция валидирует данные zod-схемой (та же, что на
   клиенте) и пишет заявку в БД. Плюсы: минимум кода, типобезопасность, никаких
   CORS. Дополнительно есть дублирующий REST `POST /api/leads` — на будущее
   (мобильное приложение, ВК-мини-апп).

Это **хорошо** для такого проекта: один домен (нет CORS и проблем с cookie),
один деплой, SSR для SEO. Отдельный бэкенд (NestJS/Fastify на другом сервисе
Railway) имеет смысл позже — при интеграциях (1С, маркетплейсы), фоновых задачах
или когда API нужен нескольким клиентам.

## Что заменить перед запуском в прод

- [ ] Название бренда «TUNING/304» → финальное (согласуется по ТЗ);
- [ ] телефон `+7 (900) 123-45-67`, почта, мессенджеры и адрес производства — в `src/lib/validation.ts` и `src/app/contacts/page.tsx`;
- [ ] **пароль админки**: `ADMIN_PASSWORD` и `ADMIN_SESSION_SECRET` в переменных Railway;
- [ ] цены и описания товаров — заглушки (правьте прямо в админке или пересеять seed);
- [ ] заменить стоковые фото на реальные снимки продукции: файлы в
  `public/images/` (hero.jpg, philosophy.jpg, jac-t9.jpg, haval-h3.jpg,
  custom.jpg) + поле «Фото» у каждого товара в админке;
- [ ] подключить свой домен в Railway (Settings → Networking → Custom Domain);
- [ ] настроить уведомления о заявках (Telegram-бот или Resend) — в `src/server/queries.ts → createLead()`.
