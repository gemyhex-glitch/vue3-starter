import 'vue-router'

export type AppLayout = 'auth' | 'default'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: AppLayout
    requiresAuth?: boolean
    guestOnly?: boolean
    title?: string
    titleKey?: string
  }
}
