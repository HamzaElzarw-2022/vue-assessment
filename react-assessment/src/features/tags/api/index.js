import { apiClient } from '@/shared/api/axiosInstance'

export const tagsApi = {
  getTags() {
    return apiClient.get('/tags')
  }
}
