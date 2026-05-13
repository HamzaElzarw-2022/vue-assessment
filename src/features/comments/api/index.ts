import { apiClient } from '@/shared/api/client'
import type { 
  PageResponseCommentResponse, 
  CreateCommentRequest, 
  UpdateCommentRequest,
  CommentResponse,
  CommentFilterParams
} from '../types'

export const commentsApi = {
  getComments(params?: CommentFilterParams) {
    return apiClient.get<PageResponseCommentResponse>('/comments', { params })
  },

  getPostComments(postId: number, params?: CommentFilterParams) {
    return apiClient.get<PageResponseCommentResponse>(`/posts/${postId}/comments`, { params })
  },

  createPostComment(postId: number, data: CreateCommentRequest) {
    return apiClient.post(`/admin/posts/${postId}/comments`, data)
  },

  updateComment(id: number, data: UpdateCommentRequest) {
    return apiClient.put<CommentResponse>(`/admin/comments/${id}`, data)
  },

  deleteComment(id: number) {
    return apiClient.delete(`/admin/comments/${id}`)
  }
}
