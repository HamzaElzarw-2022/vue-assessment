import { apiClient } from '@/shared/api/axiosInstance'

export const commentsApi = {
  getComments(params) {
    return apiClient.get('/comments', { params })
  },
  getPostComments(postId, params) {
    return apiClient.get(`/posts/${postId}/comments`, { params })
  },
  createPostComment(postId, data) {
    return apiClient.post(`/admin/posts/${postId}/comments`, data)
  },
  updateComment(id, data) {
    return apiClient.put(`/admin/comments/${id}`, data)
  },
  deleteComment(id) {
    return apiClient.delete(`/admin/comments/${id}`)
  }
}
