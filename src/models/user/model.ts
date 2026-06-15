import { formatDisplayPhone } from '@shared/utils/phone'

export interface User {
  id: string | number
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  avatar?: string
  image?: string
  profile_image?: string
  role?: 'Admin' | 'Manager' | 'Analyst'
  status?: 'Active' | 'Invited' | 'Suspended'
  lastSeenAt?: string
  last_seen_at?: string
}

export function getUserDisplayName(user: User | null | undefined, fallback = ''): string {
  if (!user) {
    return fallback
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()

  return user.name || fullName || fallback
}

export function getUserEmail(user: User | null | undefined, fallback = ''): string {
  return user?.email || fallback
}

export function getUserContactLabel(user: User | null | undefined): string {
  return user?.email || formatDisplayPhone(user?.phone ?? '')
}

export function getUserAvatarUrl(user: User | null | undefined): string | undefined {
  return user?.avatar || user?.image || user?.profile_image
}

export function getUserPhone(user: User | null | undefined): string {
  return formatDisplayPhone(user?.phone ?? '')
}
