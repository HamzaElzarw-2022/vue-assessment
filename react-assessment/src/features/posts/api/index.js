import { apiClient } from '@/shared/api/axiosInstance'

export const postsApi = {
  getAdminPosts(params) {
    return apiClient.get('/admin/posts', { params })
  },
  getAdminPost(id) {
    return apiClient.get(`/admin/posts/${id}`)
  },
  createPost(data) {
    return apiClient.post('/admin/posts', data)
  },
  updatePost(id, data) {
    return apiClient.put(`/admin/posts/${id}`, data)
  },
  deletePost(id) {
    return apiClient.delete(`/admin/posts/${id}`)
  }
}
