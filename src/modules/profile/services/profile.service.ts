import { apiClient } from '@shared/api/client'
import type { User } from '@models/user/model'
import type { ApiResponse } from '@shared/types/api'

export const profileService = {
  getProfile() {
    return apiClient.get<ApiResponse<User>>('/details/profile')
  },
}
