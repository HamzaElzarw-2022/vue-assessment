import { apiClient } from '@/shared/api/axiosInstance'

export const usersApi = {
  getUsers(params) {
    return apiClient.get('/users', { params })
  }
}
