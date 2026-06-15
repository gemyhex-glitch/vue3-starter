import { computed } from 'vue'
import { notificationService } from '@modules/notifications/services/notification.service'
import { useInfiniteList } from '@shared/composables/useInfiniteList'
import type { NotificationItem } from '@modules/notifications/model/types'

export function useNotifications(options: { perPage?: number } = {}) {
  const infiniteList = useInfiniteList<NotificationItem>(
    (params) => notificationService.list(params),
    {
      perPage: options.perPage ?? 8,
    },
  )
  const unreadCount = computed(() =>
    infiniteList.items.value.filter((notification) => !notification.read).length,
  )

  return {
    notifications: infiniteList.items,
    unreadCount,
    ...infiniteList,
  }
}
