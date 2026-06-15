# Vue 3 Dashboard Starter

Production-ready Vue 3 dashboard starter built with Vite, TypeScript, Pinia, Vue Router, Vue I18n, Axios, Zod, VeeValidate, PrimeVue, Tailwind CSS v4, Hero Icons, ESLint, Prettier, Husky, and lint-staged.

This README is also the implementation progress tracker. Completed items are checked as the starter is built.

## UI Framework Decision

Chosen stack: **PrimeVue + Tailwind CSS v4**.

PrimeVue is the better choice for this dashboard starter because it has mature enterprise components, especially DataTable behavior, while still allowing a custom design system through unstyled/pass-through APIs. Nuxt UI is polished and supports plain Vue apps, but it remains Nuxt-centered. For a Vite-first Vue dashboard starter, PrimeVue provides stronger dashboard primitives with less long-term custom implementation work.

| Area                       | PrimeVue                            | Nuxt UI             | Result   |
| -------------------------- | ----------------------------------- | ------------------- | -------- |
| Bundle size                | Manageable with targeted imports    | Usually leaner      | Nuxt UI  |
| Customization              | Unstyled mode and pass-through APIs | Tailwind-first      | Tie      |
| Design system flexibility  | High with Tailwind/CSS variables    | High                | Tie      |
| Accessibility              | Mature enterprise widget support    | Good                | PrimeVue |
| TypeScript                 | Good Vue 3 support                  | Excellent DX        | Nuxt UI  |
| Enterprise maintainability | Broad, mature component ecosystem   | Good, Nuxt-centered | PrimeVue |
| Dashboard suitability      | Strong tables, forms, overlays      | Good general app UI | PrimeVue |

## Refactor And Cleanup Checklist

This starter is being simplified before it is treated as the reusable base for future projects.
The goal is a clean modular structure without over-engineering.

### Must Fix Before Using The Starter

- [x] Remove project-specific or secret-like environment values from the starter.
- [x] Update stale README and architecture documentation so they match the actual code.
- [x] Remove test setup from the starter for now: scripts, Vitest config, unused test dependencies, and pre-commit test command.
- [x] Remove claims about mock auth, token refresh retry, and test examples unless they are actually implemented.
- [x] Keep `/auth` URLs clean. Do not expose auth UI state through `mode` or `redirect` query params.
- [x] Split or simplify the auth page so it is easier to understand and customize.
- [x] Remove demo auth defaults such as real-looking names, phone numbers, company names, and sample passwords.
- [x] Keep auth service thin and aligned with the backend endpoints only.
- [x] Keep API errors globally handled through interceptors/toasts, with predictable behavior.
- [x] Review 401 redirect behavior so auth/public endpoints do not cause confusing redirects.

### Table And Users Cleanup

- [x] Simplify `BaseTable`.
- [x] Remove built-in table pagination.
- [x] Remove built-in table row actions.
- [x] Remove advanced table filters and modal-driven table filtering.
- [x] Keep only simple table columns, local search, simple filters, local sorting, loading state, empty state, and custom cell slots.
- [x] Simplify `UsersPage` so it does not depend on pagination/action/filter event orchestration.
- [x] Simplify `useUsers` so it only loads users and exposes loading state.
- [x] Simplify `user.service` mock/API handling.
- [x] Remove table-specific composables that no longer provide value.
- [x] Remove pagination types/components if they are no longer used.

### Shared Components Cleanup

- [x] Keep useful primitives: `BaseButton`, form inputs, `BaseModal`, `BaseToast`, `BaseTabs`, `BaseBadge`, `BaseAvatar`, and simplified `BaseTable`.
- [x] Decouple `BasePhoneInput` from direct backend fetching, or move country loading to a feature-level wrapper.
- [x] Remove phone/auth-specific behavior from `DynamicForm`.
- [x] Remove unused `BaseIcon` registry if direct Heroicons remain the chosen pattern.
- [x] Remove components that exist only for demo/playground usage.

### Starter-Specific Cleanup

- [x] Remove `/playground` from production starter structure unless it is kept as an explicit dev-only reference.
- [x] Remove unused dashboard widget/demo assets such as `MetricCard` and `hero.png`.
- [x] Remove empty folders that do not carry architectural meaning.
- [x] Clean dashboard and settings pages so they are minimal, useful starter examples.
- [ ] Remove business-specific copy and sample data that makes the starter feel project-specific.

### App Architecture Cleanup

- [x] Keep the modular folder structure simple: `app`, `pages`, `modules`, `models`, `shared`, and `stores`.
- [x] Avoid adding new architecture layers unless they reduce real complexity.
- [x] Review locale/theme/layout stores and keep only state that is valuable for a starter.
- [x] Guard store initialization where actions register watchers.
- [x] Remove unnecessary layout remounting from `App.vue` unless it is required.
- [x] Normalize API response typing at the service boundary.
- [x] Rename misleading API setup names, such as auth interceptor setup that also installs toast handling.

### Styling Cleanup

- [ ] Decide whether the starter is Tailwind-first or CSS-variable/global-CSS-first.
- [x] Reduce stale global CSS created for removed components.
- [x] Keep responsive layout rules simple and predictable.
- [x] Keep auth page single-scroll behavior.

### Verification Checklist

- [x] Run `npm run lint`.
- [x] Run `npm run type-check`.
- [x] Run `npm run build`.
- [x] Manually verify auth login/signup/OTP layout.
- [x] Manually verify the users table after pagination/actions are removed.

## Progress

### 1. Project Setup

- [x] Scaffold Vue 3 + Vite + TypeScript app.
- [x] Install runtime dependencies.
- [x] Install development dependencies.
- [x] Create README progress tracker.
- [x] Configure package scripts.
- [x] Configure strict TypeScript and path aliases.
- [x] Configure Vite and Tailwind v4.
- [x] Configure ESLint Flat Config.
- [x] Configure Prettier.
- [x] Configure Husky and lint-staged.

### 2. Architecture

- [x] Replace scaffold demo files.
- [x] Create Feature-Sliced Design folder structure.
- [x] Add app providers.
- [x] Add dynamic layout system.
- [x] Add persisted sidebar/navbar navigation mode.
- [x] Add persisted sidebar collapse and expand behavior.
- [x] Add route-based code splitting.
- [x] Add route guards for protected and guest routes.

### 3. Design System

- [x] Add CSS variable tokens for colors, spacing, radius, typography, elevation, and breakpoints.
- [x] Add dark mode support.
- [x] Add global base styles.
- [x] Set shared default input and button height to 44px.
- [x] Add dashboard shell styles.

### 4. API Layer

- [x] Add simple environment access through `config/env.ts`.
- [x] Add typed Axios client.
- [x] Add request interceptors.
- [x] Add response interceptors.
- [x] Add token attachment and 401 handling.
- [x] Add unified error handling.
- [x] Split API client, interceptors, error normalization, and error toast handling.

### 5. Authentication

- [x] Add auth service.
- [x] Add auth store.
- [x] Add `useAuth` composable.
- [x] Add unified `/auth` page with login and signup modes.
- [x] Add signup flow.
- [x] Add logout flow.
- [x] Persist authentication through a storage boundary.

### 6. Internationalization

- [x] Add modular locale files.
- [x] Add lazy-loaded locale messages.
- [x] Add i18n provider.
- [x] Add `useLocale` composable.
- [x] Persist locale preference.
- [x] Ensure layout/application content updates on locale changes.

### 7. Shared UI Components

- [x] Add `BaseButton`.
- [x] Add input components.
- [x] Add feedback components.
- [x] Add fixed modal header/footer with scrollable content and simple dividers.
- [x] Add navigation components.
- [x] Add data display components.
- [x] Limit visible toast stack to 3 messages.
- [x] Add subtle type-colored animated wave backgrounds to toast messages.

### 8. Dynamic Form System

- [x] Add schema types.
- [x] Add dynamic form renderer.
- [x] Integrate VeeValidate + Zod.
- [x] Validate only on submit.
- [x] Support default values.
- [x] Support conditional fields and dynamic visibility.

### 9. Data Table System

- [x] Add reusable `BaseTable`.
- [x] Support dynamic columns.
- [x] Support local search.
- [x] Support simple filters.
- [x] Use shared input/select components across the table toolbar and filters.
- [x] Normalize table toolbar controls to the shared 44px control height.
- [x] Add RTL-aware table toolbar and toast placement behavior.
- [x] Support sorting.
- [x] Support loading and empty states.
- [x] Support custom cell slots.

### 10. Pages And Examples

- [x] Add auth layout page flow.
- [x] Add dashboard page.
- [x] Add users page with table example.
- [x] Add settings page with locale/theme examples.
- [x] Add example feature services/composables.

### 11. Documentation

- [x] Document architecture decisions.
- [x] Document folder structure.
- [x] Document state management strategy.
- [x] Document form system architecture.
- [x] Document table architecture.
- [x] Document authentication flow.
- [x] Document internationalization strategy.
- [x] Document design system principles.

### 12. Final Verification

- [x] Run `npm run lint`.
- [x] Run `npm run type-check`.
- [x] Run `npm run build`.

## Development

```bash
npm install
npm run dev
```

Set `VITE_USE_MOCK_API=true` when you want the example users list to load local starter data without a backend.

Authentication lives at `/auth`. Legacy `/login` and `/signup` paths redirect to `/auth` for compatibility.

## Documentation

- [Architecture](docs/architecture.md)
