import { defineStore } from 'pinia'
import { storage } from '@shared/utils/storage'

function resolveSidebarCollapsed(): boolean {
  return storage.get('sidebarCollapsed') === 'true'
}

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    isSidebarCollapsed: resolveSidebarCollapsed(),
  }),
  actions: {
    toggleSidebar(): void {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
      storage.set('sidebarCollapsed', String(this.isSidebarCollapsed))
    },
    expandSidebar(): void {
      this.isSidebarCollapsed = false
      storage.set('sidebarCollapsed', 'false')
    },
  },
})
