import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: ToastType
  duration: number
  createdAt: number
}

const MAX_VISIBLE_TOASTS = 3

export const useToastStore = defineStore('toast', {
  state: () => ({
    messages: [] as ToastMessage[],
  }),
  actions: {
    show(
      message: Omit<ToastMessage, 'id' | 'duration' | 'createdAt'> & { duration?: number },
    ): void {
      const id = crypto.randomUUID()
      const duration = message.duration ?? 4_000
      const createdAt = Date.now()

      this.messages.push({ ...message, id, duration, createdAt })

      if (this.messages.length > MAX_VISIBLE_TOASTS) {
        this.messages = this.messages.slice(-MAX_VISIBLE_TOASTS)
      }

      window.setTimeout(() => {
        this.dismiss(id)
      }, duration)
    },
    dismiss(id: string): void {
      this.messages = this.messages.filter((message) => message.id !== id)
    },
  },
})
