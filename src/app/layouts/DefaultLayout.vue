<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  HomeIcon,
  LanguageIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import BaseButton from '@shared/components/ui/BaseButton.vue'
import BaseAvatar from '@shared/components/ui/BaseAvatar.vue'
import NotificationsDropdown from '@modules/notifications/components/NotificationsDropdown.vue'
import { useAuth } from '@modules/auth/composables/useAuth'
import { useLocale } from '@shared/composables/useLocale'
import { getUserAvatarUrl, getUserContactLabel, getUserDisplayName } from '@models/user/model'
import { useLayoutStore } from '@stores/layout.store'
import { useThemeStore } from '@stores/theme.store'
import type { AvailableLocale } from '@app/plugins/i18n'

const route = useRoute()
const { logout, user } = useAuth()
const { availableLocales, currentLocale, switchLocale } = useLocale()
const { t } = useI18n()
const layoutStore = useLayoutStore()
const themeStore = useThemeStore()
const profileMenuOpen = ref(false)
const profileMenuRef = ref<HTMLElement | null>(null)

const userName = computed(() => getUserDisplayName(user.value, t('layout.userFallbackName')))
const userContact = computed(() => getUserContactLabel(user.value))
const userAvatar = computed(() => getUserAvatarUrl(user.value))
const userFirstName = computed(() => user.value?.first_name || userName.value.split(/\s+/)[0])
const navbarProfileLabel = computed(() =>
  t('layout.welcomeUser', { name: userFirstName.value || t('layout.userFallbackName') }),
)
const nextLocale = computed<AvailableLocale>(() => {
  const locales = availableLocales.value
  const currentIndex = locales.indexOf(currentLocale.value)
  return locales[(currentIndex + 1) % locales.length] ?? currentLocale.value
})

const navItems = computed(() => [
  { label: t('layout.nav.dashboard'), to: '/', icon: HomeIcon },
  { label: t('layout.nav.users'), to: '/users', icon: UsersIcon },
  { label: t('layout.nav.notifications'), to: '/notifications', icon: BellIcon },
  { label: t('layout.nav.settings'), to: '/settings', icon: Cog6ToothIcon },
])

async function switchToNextLocale(): Promise<void> {
  await switchLocale(nextLocale.value)
}

async function logoutFromMenu(): Promise<void> {
  profileMenuOpen.value = false
  await logout()
}

function closeProfileMenu(): void {
  profileMenuOpen.value = false
}

function handleDocumentClick(event: MouseEvent): void {
  if (!profileMenuRef.value?.contains(event.target as Node)) {
    closeProfileMenu()
  }
}

onMounted(() => {
  globalThis.document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  globalThis.document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
  <div
    class="dashboard-layout"
    :class="{
      'dashboard-layout--collapsed': layoutStore.isSidebarCollapsed,
    }"
  >
    <aside class="dashboard-sidebar">
      <RouterLink to="/" class="brand" :aria-label="t('common.appName')">
        <span class="brand__mark">
          <img src="/favicon.svg" alt="" aria-hidden="true" />
        </span>
        <span class="brand__label">{{ t('layout.brand') }}</span>
      </RouterLink>

      <nav class="dashboard-nav" :aria-label="t('layout.mainNavigation')">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="dashboard-nav__item"
          :class="{ 'dashboard-nav__item--active': route.path === item.to }"
          :data-tooltip="item.label"
          :aria-label="layoutStore.isSidebarCollapsed ? item.label : undefined"
        >
          <component :is="item.icon" aria-hidden="true" />
          <span class="dashboard-nav__label">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="dashboard-frame">
      <header class="dashboard-header">
        <div class="dashboard-header__left">
          <BaseButton
            variant="ghost"
            size="sm"
            icon-only
            :aria-label="
              layoutStore.isSidebarCollapsed
                ? t('layout.expandSidebar')
                : t('layout.collapseSidebar')
            "
            @click="layoutStore.toggleSidebar()"
          >
            <Bars3Icon aria-hidden="true" />
          </BaseButton>
        </div>

        <div class="dashboard-header__actions">
          <BaseButton
            variant="ghost"
            size="sm"
            icon-only
            :aria-label="
              themeStore.mode === 'dark' ? t('layout.useLightMode') : t('layout.useDarkMode')
            "
            @click="themeStore.toggleTheme()"
          >
            <SunIcon v-if="themeStore.mode === 'dark'" aria-hidden="true" />
            <MoonIcon v-else aria-hidden="true" />
          </BaseButton>

          <BaseButton
            variant="ghost"
            size="sm"
            icon-only
            :aria-label="t('layout.switchLanguage', { locale: t(`locale.${nextLocale}`) })"
            @click="switchToNextLocale"
          >
            <LanguageIcon aria-hidden="true" />
          </BaseButton>

          <NotificationsDropdown />

          <div ref="profileMenuRef" class="profile-menu">
            <button
              type="button"
              class="profile-menu__trigger"
              :aria-expanded="profileMenuOpen"
              aria-haspopup="menu"
              @click="profileMenuOpen = !profileMenuOpen"
              @keydown.escape="profileMenuOpen = false"
            >
              <BaseAvatar :name="userName" :src="userAvatar" />
              <span class="profile-menu__name">{{ navbarProfileLabel }}</span>
              <ChevronDownIcon aria-hidden="true" />
            </button>

            <div v-if="profileMenuOpen" class="profile-menu__panel" role="menu">
              <div class="profile-menu__identity">
                <BaseAvatar :name="userName" :src="userAvatar" />
                <span>
                  <strong>{{ userName }}</strong>
                  <small v-if="userContact">{{ userContact }}</small>
                </span>
              </div>
              <RouterLink
                to="/profile"
                role="menuitem"
                class="profile-menu__item"
                @click="profileMenuOpen = false"
              >
                <span class="profile-menu__item-icon" aria-hidden="true">
                  <UserCircleIcon />
                </span>
                <span>{{ t('profile.title') }}</span>
              </RouterLink>
              <button
                type="button"
                role="menuitem"
                class="profile-menu__item profile-menu__item--danger"
                @click="logoutFromMenu"
              >
                <span class="profile-menu__item-icon" aria-hidden="true">
                  <ArrowRightOnRectangleIcon />
                </span>
                <span>{{ t('common.logout') }}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        <slot />
      </main>
    </div>
  </div>
</template>
