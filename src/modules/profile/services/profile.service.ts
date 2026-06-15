import { apiClient } from '@shared/api/client'
import type { User } from '@models/user/model'
import type { ApiResponse } from '@shared/types/api'

export const profileService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/details/profile')

    return response.data.data
  },
}
