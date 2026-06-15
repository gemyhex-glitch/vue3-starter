import { watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import { defineStore } from 'pinia'
import { storage } from '@shared/utils/storage'

export type ThemeMode = 'light' | 'dark'

const themePalettes = {
  light: {
    primary: '#2563eb',
    primaryStrong: '#1d4ed8',
    success: '#168a57',
    warning: '#b66a00',
    danger: '#d92d20',
    info: '#1570ef',
  },
  dark: {
    primary: '#3b82f6',
    primaryStrong: '#60a5fa',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#f87171',
    info: '#38bdf8',
  },
} as const

let initialized = false

function resolveInitialTheme(): ThemeMode {
  const storedTheme = storage.get('theme')

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return usePreferredDark().value ? 'dark' : 'light'
}

function cssVariableName(token: string): string {
  return token.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

function transparentColor(color: string, amount: number): string {
  return `color-mix(in srgb, ${color} ${amount}%, transparent)`
}

function setCssVariables(variables: Record<string, string>): void {
  Object.entries(variables).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value)
  })
}

function applyPrimeVuePalette(palette: ThemePalette, mode: ThemeMode): void {
  const contrastColor = mode === 'dark' ? '#020617' : '#ffffff'
  const primaryTint = mode === 'dark' ? 24 : 10
  const primaryFocusTint = mode === 'dark' ? 34 : 16
  const selectedTextColor = mode === 'dark' ? '#ffffff' : palette.primaryStrong

  setCssVariables({
    '--p-primary-color': palette.primary,
    '--p-primary-hover-color': palette.primaryStrong,
    '--p-primary-active-color': palette.primaryStrong,
    '--p-primary-contrast-color': contrastColor,
    '--p-focus-ring-color': transparentColor(palette.primary, 28),
    '--p-form-field-focus-border-color': palette.primary,

    '--p-button-primary-background': palette.primary,
    '--p-button-primary-border-color': palette.primary,
    '--p-button-primary-color': contrastColor,
    '--p-button-primary-hover-background': palette.primaryStrong,
    '--p-button-primary-hover-border-color': palette.primaryStrong,
    '--p-button-primary-hover-color': contrastColor,
    '--p-button-primary-active-background': palette.primaryStrong,
    '--p-button-primary-active-border-color': palette.primaryStrong,
    '--p-button-primary-active-color': contrastColor,
    '--p-button-outlined-primary-color': palette.primary,
    '--p-button-outlined-primary-border-color': palette.primary,
    '--p-button-outlined-primary-hover-background': transparentColor(palette.primary, primaryTint),
    '--p-button-text-primary-color': palette.primary,
    '--p-button-text-primary-hover-background': transparentColor(palette.primary, primaryTint),

    '--p-highlight-background': transparentColor(palette.primary, primaryTint),
    '--p-highlight-focus-background': transparentColor(palette.primary, primaryFocusTint),
    '--p-highlight-color': selectedTextColor,
    '--p-highlight-focus-color': selectedTextColor,
    '--p-list-option-selected-background': transparentColor(palette.primary, primaryTint),
    '--p-list-option-selected-focus-background': transparentColor(
      palette.primary,
      primaryFocusTint,
    ),
    '--p-list-option-selected-color': selectedTextColor,
    '--p-list-option-selected-focus-color': selectedTextColor,
    '--p-select-option-selected-background': transparentColor(palette.primary, primaryTint),
    '--p-select-option-selected-focus-background': transparentColor(
      palette.primary,
      primaryFocusTint,
    ),
    '--p-select-option-selected-color': selectedTextColor,
    '--p-select-option-selected-focus-color': selectedTextColor,

    '--p-badge-success-background': palette.success,
    '--p-badge-success-color': '#ffffff',
    '--p-badge-info-background': palette.info,
    '--p-badge-info-color': '#ffffff',
    '--p-badge-warn-background': palette.warning,
    '--p-badge-warn-color': '#ffffff',
    '--p-badge-danger-background': palette.danger,
    '--p-badge-danger-color': '#ffffff',
    '--p-tag-success-background': transparentColor(palette.success, mode === 'dark' ? 24 : 12),
    '--p-tag-success-color': palette.success,
    '--p-tag-info-background': transparentColor(palette.info, mode === 'dark' ? 24 : 12),
    '--p-tag-info-color': palette.info,
    '--p-tag-warn-background': transparentColor(palette.warning, mode === 'dark' ? 24 : 12),
    '--p-tag-warn-color': palette.warning,
    '--p-tag-danger-background': transparentColor(palette.danger, mode === 'dark' ? 24 : 12),
    '--p-tag-danger-color': palette.danger,
  })
}

type ThemePalette = (typeof themePalettes)[ThemeMode]

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: resolveInitialTheme(),
  }),
  actions: {
    setTheme(mode: ThemeMode) {
      this.mode = mode
      storage.set('theme', mode)
      document.documentElement.classList.toggle('dark', mode === 'dark')
      this.applyPalette()
    },
    toggleTheme() {
      this.setTheme(this.mode === 'dark' ? 'light' : 'dark')
    },
    applyPalette(): void {
      const activePalette = themePalettes[this.mode]

      Object.entries(activePalette).forEach(([token, value]) => {
        document.documentElement.style.setProperty(`--color-${cssVariableName(token)}`, value)
      })

      applyPrimeVuePalette(activePalette, this.mode)
    },
    initialize() {
      if (initialized) {
        return
      }

      initialized = true
      this.setTheme(this.mode)
      this.applyPalette()

      watch(
        () => this.mode,
        (mode) => {
          document.documentElement.classList.toggle('dark', mode === 'dark')
          this.applyPalette()
        },
      )
    },
  },
})
