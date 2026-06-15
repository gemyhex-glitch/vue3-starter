import { ref } from 'vue'
import { userService } from '@modules/users/services/user.service'
import type { User } from '@models/user/model'

export function useUsers() {
  const users = ref<User[]>([])
  const isLoading = ref(false)

  async function fetchUsers(): Promise<void> {
    isLoading.value = true

    try {
      users.value = await userService.list()
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    isLoading,
    fetchUsers,
  }
}
