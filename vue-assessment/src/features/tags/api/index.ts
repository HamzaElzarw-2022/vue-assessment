import { apiClient } from '@/shared/api/client'
import type { TagResponse } from '../types'

export const tagsApi = {
  getTags() {
    return apiClient.get<TagResponse[]>('/tags')
  }
}
