import { apiClient } from '@/shared/api/client'
import type { PageResponseUserResponse, UserFilterParams } from '../types'

export const usersApi = {
  getUsers(params?: UserFilterParams) {
    return apiClient.get<PageResponseUserResponse>('/users', { params })
  }
}
