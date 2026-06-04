# CLAUDE.md

Guidance for Claude Code when working in this repository. For deep design/theory
(color tokens, the settlement math), see `CONTEXT.md` — this file is the practical
quick-reference.

## What this is

**Triplit** — a collaborative group‑travel app: plan trips, chat with a (mock) AI
travel assistant, and split/settle shared expenses. Next.js App Router + React 19,
TypeScript, Tailwind v4. Package manager is **npm**.

## Commands

```bash
npm install               # install deps
npm run dev               # Next dev server on http://localhost:3000
npm run build             # production build (output: "standalone")
npm start                 # run the production build
npm run lint              # eslint (flat config, eslint.config.mjs)
npx tsc --noEmit          # type-check only

# Database (TypeORM CLI via typeorm.config.ts)
npm run migration:generate --name=SomeName
npm run migration:run
npm run migration:revert

docker compose up         # Postgres (db "triplit", user/pass root) + web (Dockerfile.dev)
```

There is no test runner configured. After changes, validate with
`npx tsc --noEmit` + `npm run lint`, and smoke-test routes against `npm run dev`
(the landing `/` and `/authentication` pages are client-only and render without a DB).

## Stack & how the pieces fit

- **Framework**: Next.js 16 App Router (`src/app`), React 19, React Compiler enabled
  (`reactCompiler: true` in `next.config.ts` — note the stricter purity rules it
  enforces in lint).
- **Styling**: Tailwind v4 (CSS-first; theme tokens live in `src/app/globals.css`).
  Custom color tokens are used everywhere: `pearl-*`/`obsidian-*` (surfaces),
  `gold`/`ember`/`luxe`/`blue-primary` (accents). Dark mode = `.dark` class on `<html>`.
- **Auth**: better-auth (`src/lib/auth.ts`), Postgres via `pg` Pool. Google social
  login. Client helper: `src/lib/auth-client.ts` (`authClient`). API route:
  `src/app/api/auth/[...all]/route.ts`.
- **Middleware**: `src/proxy.ts` (Next middleware — the `config.matcher` makes it
  one). Gates `/dashboard` (requires session) and bounces `/` + `/authentication`
  to `/dashboard` when logged in.
- **ORM**: TypeORM (`src/lib/db.ts`, `AppDataSource`) with entities in
  `src/entities/` (`party`, `party_member`, `party_type`). `serverExternalPackages`
  in `next.config.ts` keeps `typeorm`/`pg`/`reflect-metadata` server-only.
- **Redux Toolkit** is installed but **`src/store/store.ts` is empty/unused** — app
  state is React Context + `localStorage`, not Redux. Don't assume a Redux store exists.
- Path alias: `@/*` → `src/*`.

## State & persistence conventions

Client state is React Context, persisted to `localStorage` (no backend for trip data):

- **Trips/expenses**: `src/app/dashboard/layout/DashboardContext.tsx`
  (`useDashboard()`), key `triplit_trips_data`. Seeds demo trips (Tokyo/Paris) on
  first load.
- **Theme**: `src/app/components/ThemeToggle.tsx`, key `triplit_theme` (default
  `dark`). A blocking inline script in `src/app/layout.tsx` applies the theme before
  paint to avoid a flash.
- **Language**: see i18n below, key `triplit_lang`.

## Internationalization (i18n)

Custom, dependency-free i18n (no next-intl/i18next). Supports **English + Thai**.

- `src/i18n/en.ts` — English strings; **defines the `Dictionary` type** (source of truth).
- `src/i18n/th.ts` — Thai strings, typed `Dictionary` so missing/extra keys are
  compile errors. **Keep `th.ts` in lockstep with `en.ts`.**
- `src/i18n/dictionaries.ts` — combines them; also exports `LOCALES`
  (`{ code, label, flag }`) which drives the switcher, and the `Locale` type.
- `src/i18n/LanguageProvider.tsx` — `useLanguage()` → `{ lang, setLang, toggleLang, t }`.
  `t("dot.path", { name })` does dot-path lookup with `{var}` interpolation and falls
  back to English then the raw key. Default locale auto-detects from the browser, then
  persists. SSR always renders `en` and the stored/detected locale is applied on mount
  (a brief flash is expected, no hydration error).
- `src/app/components/LanguageToggle.tsx` — custom flag dropdown (not a native
  `<select>`). Mounted in the landing nav, the dashboard sidebar + mobile bar, and the
  auth card.

**Adding UI text**: add the key to `en.ts` AND `th.ts`, then use `t("...")` in the
component. **Adding a language**: create a new file mirroring `en.ts`, register it in
`dictionaries.ts` (`dictionaries` map + `LOCALES`) and the `Locale` union.

## Key UI surfaces

- `src/app/content-landing/LandingView.tsx` + `Nav.tsx` — marketing landing page.
- `src/app/authentication/page.tsx` — login (email fields are presentational; Google
  sign-in is wired).
- `src/app/dashboard/layout/DashboardLayoutClient.tsx` — dashboard shell (sidebar,
  header, tabs). `dashboard/layout.tsx` is a server component that fetches the session.
- `src/app/dashboard/page.tsx` — trips planner + itinerary timeline.
- `src/app/dashboard/ai/contents/AIChatView.tsx` — mock AI assistant. Itinerary
  responses are generated locally from English keyword matching (`generateItineraryResponse`);
  the sample itineraries/responses are intentionally left in English.
- `src/app/dashboard/expenses/contents/ExpenseView.tsx` — expense ledger, category
  donut chart, and the greedy debt-settlement engine (see `CONTEXT.md` for the math).

## Gotchas

- **Don't shadow the `t` translation fn.** `trips.map((t) => …)` collides with
  `const { t } = useLanguage()`; name list/map params `trip`, `item`, etc.
- **Settlement detection is string-based**: `ExpenseView` flags settlement rows via
  `description.startsWith("Settlement:")`, so that stored prefix stays **English** on
  purpose. Don't translate it or the "Settled" badge logic breaks.
- **React Compiler purity**: avoid `Math.random()` / `setState` during render or in
  `useMemo`; lint will flag it. (Some pre-existing instances remain in `ExpenseView`
  and `AIChatView`.)
- **Flag emoji** in the language dropdown don't render on most Windows browsers (they
  fall back to letters). Swap to SVG flags if cross-platform flags are required.
- **Known perf issue**: `src/proxy.ts` calls `authClient.getSession()` (HTTP → DB) on
  every matched request, including client `<Link>` navigations and prefetches — this
  makes sidebar navigation slow. The fix is to use better-auth's `getSessionCookie`
  (cookie-only, no DB) for the optimistic middleware check; the authoritative session
  check already runs server-side in `dashboard/layout.tsx`.

## Environment

`.env` (git-ignored) provides: `NEXT_PUBLIC_APP_URL`, `DATABASE_*`,
`BETTER_AUTH_URL` / `BETTER_AUTH_API_KEY`, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
DB defaults (when unset): host `localhost`, port `5432`, db `my_database`, user/pass
`root` — but `docker-compose.yaml` provisions db **`triplit`**, so set `DATABASE_NAME`
accordingly when using Docker.
