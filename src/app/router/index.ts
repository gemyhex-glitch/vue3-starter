import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import '@app/router/types'
import { useAuthStore } from '@stores/auth.store'
import { updateDocumentTitle } from '@app/router/page-title'

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@pages/auth/AuthPage.vue'),
    meta: { layout: 'auth', guestOnly: true, titleKey: 'pageTitles.auth' },
  },
  {
    path: '/login',
    redirect: () => ({
      name: 'auth',
      state: { authMode: 'login' },
    }),
  },
  {
    path: '/signup',
    redirect: () => ({
      name: 'auth',
      state: { authMode: 'signup' },
    }),
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@pages/dashboard/DashboardPage.vue'),
    meta: { layout: 'default', requiresAuth: true, titleKey: 'pageTitles.dashboard' },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@pages/users/UsersPage.vue'),
    meta: { layout: 'default', requiresAuth: true, titleKey: 'pageTitles.users' },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@pages/notifications/NotificationsPage.vue'),
    meta: { layout: 'default', requiresAuth: true, titleKey: 'pageTitles.notifications' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@pages/profile/ProfilePage.vue'),
    meta: { layout: 'default', requiresAuth: true, titleKey: 'pageTitles.profile' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@pages/settings/SettingsPage.vue'),
    meta: { layout: 'default', requiresAuth: true, titleKey: 'pageTitles.settings' },
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@pages/errors/ForbiddenPage.vue'),
    meta: { layout: 'auth', titleKey: 'pageTitles.forbidden' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.name === 'auth' && Object.keys(to.query).length > 0) {
    const redirectPath = typeof to.query.redirect === 'string' ? to.query.redirect : undefined

    return {
      name: 'auth',
      replace: true,
      state: {
        authMode: to.query.mode === 'signup' ? 'signup' : 'login',
        authRedirect: redirectPath,
      },
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'auth',
      state: { authRedirect: to.fullPath },
    }
  }

  if (to.meta.requiresAuth && !authStore.user) {
    try {
      await authStore.fetchProfile()
    } catch {
      if (!authStore.isAuthenticated) {
        return {
          name: 'auth',
          state: { authRedirect: to.fullPath },
        }
      }
    }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})

router.afterEach((to) => {
  void updateDocumentTitle(to)
})
