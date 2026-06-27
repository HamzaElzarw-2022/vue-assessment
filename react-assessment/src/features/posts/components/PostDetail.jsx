import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Plus } from 'lucide-react'
import BaseButton from '@/shared/components/BaseButton'
import { postsApi } from '../api'
import { commentsApi } from '@/features/comments/api'
import { useCommentActions } from '@/features/comments/hooks/useCommentActions'
import CommentsTable from '@/features/comments/components/CommentsTable'

export default function PostDetail({ postId }) {
  const { openCreateForm, openEditForm, handleDelete } = useCommentActions()

  const { data: postData, isLoading } = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => postsApi.getAdminPost(postId),
    enabled: !!postId
  })

  const post = postData?.data

  const [commentFilters, setCommentFilters] = useState({
    page: 0,
    size: 5
  })

  const { data: commentsData, isLoading: isLoadingComments } = useQuery({
    queryKey: ['posts', postId, 'comments', commentFilters],
    queryFn: () => commentsApi.getPostComments(postId, { ...commentFilters }),
    enabled: !!postId
  })

  function handleCommentPageChange(page) {
    setCommentFilters((prev) => ({ ...prev, page }))
  }

  function handleCommentSizeChange(size) {
    setCommentFilters((prev) => ({ ...prev, size, page: 0 }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {post.title}
        </h2>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="font-medium text-slate-700">
            By {post.user?.fullName || post.user?.username}
          </span>
          <span>&bull;</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.views != null && (
            <>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                {post.views} views
              </span>
            </>
          )}
        </div>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="prose prose-sm prose-slate max-w-none bg-slate-50 p-4 rounded-lg">
        <p className="whitespace-pre-wrap">{post.body}</p>
      </div>

      {/* Deleted warning */}
      {post.deleted && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          This post was deleted on{' '}
          {new Date(post.deletedAt).toLocaleDateString()}
        </div>
      )}

      {/* Comments section */}
      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Comments ({post.commentsCount})
          </h3>
          <BaseButton size="sm" onClick={() => openCreateForm(post.id)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Comment
          </BaseButton>
        </div>

        {isLoadingComments ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : commentsData ? (
          <CommentsTable
            comments={commentsData.data.items}
            pagination={{
              page: commentsData.data.page,
              size: commentsData.data.size,
              totalItems: commentsData.data.totalItems,
              totalPages: commentsData.data.totalPages
            }}
            hidePostColumn
            onPageChange={handleCommentPageChange}
            onSizeChange={handleCommentSizeChange}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ) : null}
      </div>
    </div>
  )
}
