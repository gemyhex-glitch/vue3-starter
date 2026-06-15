export type NotificationType = 'info' | 'success' | 'warning' | 'danger'

export interface NotificationItem {
  id: string
  title: string
  body: string
  createdAt: string
  read: boolean
  type: NotificationType
}

export interface NotificationListParams {
  page: number
  perPage: number
  search: string
}

export interface NotificationListResult {
  items: NotificationItem[]
  total: number
  hasMore: boolean
}
