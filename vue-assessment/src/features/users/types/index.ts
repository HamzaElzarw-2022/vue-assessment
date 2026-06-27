import type { UserResponse, PageResponse } from '@/features/posts/types'

export type { UserResponse }
export type PageResponseUserResponse = PageResponse<UserResponse>

export interface UserFilterParams {
  page?: number
  size?: number
  search?: string
}
