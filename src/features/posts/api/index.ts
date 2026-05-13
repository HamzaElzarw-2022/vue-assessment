import { apiClient } from '@/shared/api/client'
import type { 
  PageResponsePostResponseAdmin, 
  CreatePostRequest, 
  UpdatePostRequest,
  PostResponseAdmin,
  PostFilterParams
} from '../types'

export const postsApi = {
  getAdminPosts(params?: PostFilterParams) {
    return apiClient.get<PageResponsePostResponseAdmin>('/admin/posts', { params })
  },
  
  getAdminPost(id: number) {
    return apiClient.get<PostResponseAdmin>(`/admin/posts/${id}`)
  },

  createPost(data: CreatePostRequest) {
    return apiClient.post('/admin/posts', data)
  },

  updatePost(id: number, data: UpdatePostRequest) {
    return apiClient.put(`/admin/posts/${id}`, data)
  },

  deletePost(id: number) {
    return apiClient.delete(`/admin/posts/${id}`)
  }
}
