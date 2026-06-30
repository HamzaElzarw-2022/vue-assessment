import { apiClient } from '@/shared/api/axiosInstance'

export const commentsApi = {
  getComments(params) {
    return apiClient.get('/comments', { params })
  },
  getComment(id) {
    return apiClient.get('/comments', { params: { size: 1000 } }).then(res => {
      const comment = res.data.items.find(c => c.id === Number(id));
      if (!comment) throw new Error('Comment not found');
      return { data: comment };
    });
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
