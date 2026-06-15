import { apiClient } from '@shared/api/client'
import { i18n } from '@app/plugins/i18n'
import { env } from '@shared/config/env'
import type { ApiResponse } from '@shared/types/api'
import type {
  NotificationItem,
  NotificationListParams,
  NotificationListResult,
} from '@modules/notifications/model/types'

type NotificationMessageKey =
  | 'invitation'
  | 'billing'
  | 'permission'
  | 'apiFailed'
  | 'report'
  | 'security'
  | 'newUser'
  | 'storage'
  | 'integration'
  | 'passwordPolicy'
  | 'importCompleted'
  | 'reviewFailed'

const mockNotifications: Array<Omit<NotificationItem, 'title' | 'body'> & { messageKey: NotificationMessageKey }> = [
  {
    id: 'ntf_1',
    messageKey: 'invitation',
    createdAt: '2026-06-11T07:25:00.000Z',
    read: false,
    type: 'info',
  },
  {
    id: 'ntf_2',
    messageKey: 'billing',
    createdAt: '2026-06-11T06:12:00.000Z',
    read: false,
    type: 'success',
  },
  {
    id: 'ntf_3',
    messageKey: 'permission',
    createdAt: '2026-06-10T18:42:00.000Z',
    read: false,
    type: 'warning',
  },
  {
    id: 'ntf_4',
    messageKey: 'apiFailed',
    createdAt: '2026-06-10T15:20:00.000Z',
    read: true,
    type: 'danger',
  },
  {
    id: 'ntf_5',
    messageKey: 'report',
    createdAt: '2026-06-10T12:05:00.000Z',
    read: true,
    type: 'success',
  },
  {
    id: 'ntf_6',
    messageKey: 'security',
    createdAt: '2026-06-09T20:18:00.000Z',
    read: true,
    type: 'info',
  },
  {
    id: 'ntf_7',
    messageKey: 'newUser',
    createdAt: '2026-06-09T11:34:00.000Z',
    read: true,
    type: 'info',
  },
  {
    id: 'ntf_8',
    messageKey: 'storage',
    createdAt: '2026-06-08T16:09:00.000Z',
    read: true,
    type: 'warning',
  },
  {
    id: 'ntf_9',
    messageKey: 'integration',
    createdAt: '2026-06-08T09:30:00.000Z',
    read: true,
    type: 'success',
  },
  {
    id: 'ntf_10',
    messageKey: 'passwordPolicy',
    createdAt: '2026-06-07T19:50:00.000Z',
    read: true,
    type: 'info',
  },
  {
    id: 'ntf_11',
    messageKey: 'importCompleted',
    createdAt: '2026-06-07T14:11:00.000Z',
    read: true,
    type: 'success',
  },
  {
    id: 'ntf_12',
    messageKey: 'reviewFailed',
    createdAt: '2026-06-06T22:48:00.000Z',
    read: true,
    type: 'warning',
  },
]

function getMockNotifications(): NotificationItem[] {
  return mockNotifications.map(({ messageKey, ...notification }) => ({
    ...notification,
    title: i18n.global.t(`notificationItems.${messageKey}.title`),
    body: i18n.global.t(`notificationItems.${messageKey}.body`),
  }))
}

function filterNotifications(search: string): NotificationItem[] {
  const query = search.trim().toLowerCase()
  const notifications = getMockNotifications()

  if (!query) {
    return notifications
  }

  return notifications.filter((notification) =>
    [notification.title, notification.body].some((value) => value.toLowerCase().includes(query)),
  )
}

function paginate(items: NotificationItem[], page: number, perPage: number): NotificationListResult {
  const start = (page - 1) * perPage
  const nextItems = items.slice(start, start + perPage)

  return {
    items: nextItems,
    total: items.length,
    hasMore: start + nextItems.length < items.length,
  }
}

export const notificationService = {
  async list(params: NotificationListParams): Promise<NotificationListResult> {
    if (env.useMockApi) {
      return paginate(filterNotifications(params.search), params.page, params.perPage)
    }

    const response = await apiClient.get<ApiResponse<NotificationListResult>>('/notifications', {
      params,
    })

    return response.data.data
  },
}
