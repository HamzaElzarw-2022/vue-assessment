import type { PageResponse } from '@/features/posts/types'

export interface CommentResponse {
  id: number
  postId: number
  userId: number
  commenterName: string
  body: string
  createdAt: string
  updatedAt: string
}

export interface CreateCommentRequest {
  body: string
  commenterName: string
  userId: number
}

export interface UpdateCommentRequest {
  body: string
  commenterName: string
}

export type PageResponseCommentResponse = PageResponse<CommentResponse>
