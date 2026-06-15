# Architecture

## Decisions

- Vue 3 + Vite keeps the starter framework-light and fast to reason about.
- TypeScript runs in strict mode with no unchecked indexed access to catch unsafe assumptions early.
- PrimeVue is installed for enterprise-grade widgets, while shared base components keep the public app API consistent.
- Tailwind CSS v4 is used alongside CSS variables. Tokens live in CSS variables so runtime theme changes do not require rebuilding styles.
- Modules own business behavior, pages compose modules, and shared owns generic primitives.

## Folder Structure

```txt
src/
  app/          router, providers, plugins, layouts, root app
  shared/       generic UI, composables, API client, config, utilities, validation
  modules/      auth, users, and future feature modules
  models/       shared domain models
  pages/        route-level composition
  stores/       global Pinia stores only
  locales/      lazy-loaded locale modules
  assets/       styles and static app assets
```

## Modular Rule

The structure is modular by capability, not by file extension. A users service belongs in `modules/users/services`, user list orchestration belongs in `modules/users/composables`, and the route page in `pages/users` only composes those pieces.

## State Strategy

Pinia is reserved for global state: auth, locale, theme, layout preferences, and toast messages. Local UI state stays in components or composables. Server data orchestration lives in feature composables so components never call APIs directly.

## Layout Strategy

The default dashboard shell uses a single collapsible sidebar. `useLayoutStore` owns only
`isSidebarCollapsed`, which keeps the layout state easy to understand and avoids starter-only
navigation modes.

## Authentication Flow

Auth tokens are managed through `tokenService`, which is the storage boundary for the access token. `apiClient` owns only Axios client configuration. API interceptors live beside it and attach the access token, normalize transport errors, trigger app-level redirects, and show global error toasts. Public auth endpoints such as login, register, verify, and password reset do not trigger another auth redirect. Expected workflow errors can opt out of global toasts per request.

Phone login requests an OTP without applying any returned session to the auth store. The user becomes authenticated only after OTP verification returns a session.

Login and signup are composed in one route-level page at `/auth`. The page owns only mode, redirect, and OTP orchestration. Form validation and payload mapping live in `modules/auth/components`. Auth UI state is not exposed in the URL. Legacy `/login` and `/signup` URLs redirect into the unified auth surface and pass mode through router history state.

## Internationalization

Locale modules are lazy-loaded from `src/locales/{locale}/index.ts`. `useLocale` exposes the current locale, available locales, and `switchLocale`.

## Form System

`DynamicForm` renders fields from schema metadata and validates with VeeValidate + Zod. Field updates do not validate while typing; validation is triggered on submit and errors are shown after a submit attempt.

`BasePhoneInput` is a shared input primitive. It accepts country data as a prop and does not call the backend directly. Feature wrappers such as `AuthPhoneInput` own endpoint loading when a page needs `/countries`.

## Table System

`BaseTable` accepts rows, columns, simple filters, and cell slots. It handles local search, local filters, local sorting, loading state, and empty state. It does not fetch data, paginate data, own row actions, or know business rules.

Feature composables load data. Route pages compose the table and provide feature-specific slots.

`BaseInput` supports an optional `#icon` slot and `iconPosition` prop. The default icon position is `start`.

`BaseModal` owns the overlay shell, fixed header/footer regions, scrollable content body, and simple dividers. Consumers pass workflow actions through the `#footer` slot instead of mixing action bars into scrollable content.

Toast notifications are positioned at the top-end of LTR layouts and top-start for RTL layouts, which places Arabic notifications in the top-left corner while preserving the same visual hierarchy. Toast surfaces use subtle type-colored animated wave backgrounds, with reduced-motion support. The toast store caps the visible stack at 3 messages to avoid notification flooding.

## Design System

Design tokens are CSS variables for color, spacing, radius, typography, and elevation. Components consume tokens rather than hardcoded product colors. Dark mode changes the token values at the root.
