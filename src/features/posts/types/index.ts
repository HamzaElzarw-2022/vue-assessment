export interface UserResponse {
  id: number
  username: string
  fullName: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface PostResponse {
  id: number
  title: string
  body: string
  user: UserResponse
  tags: string[]
  views: number
  commentsCount: number
  createdAt: string
  updatedAt: string
}

export interface PostResponseAdmin extends PostResponse {
  deleted?: boolean
  deletedAt?: string
}

export interface CreatePostRequest {
  title: string
  body: string
  userId: number
  tagIds?: number[]
  views?: number
}

export interface UpdatePostRequest extends CreatePostRequest {}

export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  totalItems: number
  totalPages: number
  sort?: {
    field: string
    direction: string
  }
}

export type PageResponsePostResponseAdmin = PageResponse<PostResponseAdmin>
export type PageResponsePostResponse = PageResponse<PostResponse>

export interface PostFilterParams {
  page?: number
  search?: string
  size?: number
  sortBy?: string
  sortDir?: 'ascending' | 'descending' | string
  tag?: string
  userId?: number
}
