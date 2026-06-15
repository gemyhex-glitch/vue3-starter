import { apiClient } from '@shared/api/client'
import { env } from '@shared/config/env'
import type { User } from '@models/user/model'
import type { ApiResponse } from '@shared/types/api'

const users: User[] = [
  {
    id: 'usr_1',
    name: 'Mira Chen',
    email: 'mira@example.com',
    role: 'Admin',
    status: 'Active',
    lastSeenAt: '2026-06-06T12:30:00.000Z',
  },
  {
    id: 'usr_2',
    name: 'Omar Farouk',
    email: 'omar@example.com',
    role: 'Manager',
    status: 'Invited',
    lastSeenAt: '2026-06-04T08:15:00.000Z',
  },
  {
    id: 'usr_3',
    name: 'Nora Patel',
    email: 'nora@example.com',
    role: 'Analyst',
    status: 'Active',
    lastSeenAt: '2026-06-07T07:45:00.000Z',
  },
  {
    id: 'usr_4',
    name: 'Leo Martin',
    email: 'leo@example.com',
    role: 'Analyst',
    status: 'Suspended',
    lastSeenAt: '2026-05-21T14:20:00.000Z',
  },
]

export const userService = {
  async list(): Promise<User[]> {
    if (env.useMockApi) {
      return users
    }

    const response = await apiClient.get<ApiResponse<User[]>>('/users')

    return response.data.data
  },
}
