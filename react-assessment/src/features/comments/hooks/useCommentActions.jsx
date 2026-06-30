import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { commentsApi } from '../api'

export function useCommentActions() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  const deleteMutation = useMutation({
    mutationFn: (id) => commentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  function openCreateForm(defaultPostId) {
    if (typeof defaultPostId === 'number') {
      // Context-aware: navigate within the current page context
      const basePath = location.pathname
      if (basePath.startsWith('/users/')) {
        // Already in a nested user context, find postId path
        navigate(`${basePath}/comments/new`.replace(/\/+/g, '/'))
      } else {
        navigate(`/posts/${defaultPostId}/comments/new`)
      }
    } else {
      navigate('/comments/new')
    }
  }

  function openEditForm(comment) {
    const basePath = location.pathname
    if (basePath.includes(`/posts/${comment.postId}`)) {
      // We're viewing this post's comments, keep the context
      navigate(`${basePath}/comments/${comment.id}/edit`.replace(/\/+/g, '/'))
    } else {
      navigate(`/comments/${comment.id}/edit`)
    }
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate(id)
    }
  }

  return {
    openCreateForm,
    openEditForm,
    handleDelete,
    isDeleting: deleteMutation.isPending,
  }
}
