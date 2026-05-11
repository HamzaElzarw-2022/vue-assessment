import { apiClient } from '@/shared/api/client'
import type { PageResponseUserResponse } from '../types'

export const usersApi = {
  getUsers(params?: Record<string, any>) {
    return apiClient.get<PageResponseUserResponse>('/users', { params })
  }
}
