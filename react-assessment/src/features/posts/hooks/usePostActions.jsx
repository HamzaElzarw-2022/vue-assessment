import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { postsApi } from '../api'

export function usePostActions() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  const deleteMutation = useMutation({
    mutationFn: (id) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  function openCreateForm(defaultUserId) {
    if (typeof defaultUserId === 'number') {
      // Context-aware: if we're on /users/:id, use nested path
      navigate(`/users/${defaultUserId}/posts/new`)
    } else {
      navigate('/posts/new')
    }
  }

  function openEditForm(post) {
    // Determine context from current path
    const basePath = location.pathname
    if (basePath.startsWith('/users/')) {
      // Extract userId from path: /users/:userId/...
      const userId = basePath.split('/')[2]
      navigate(`/users/${userId}/posts/${post.id}/edit`)
    } else {
      navigate(`/posts/${post.id}/edit`)
    }
  }

  function openDetail(postId) {
    const basePath = location.pathname
    if (basePath.startsWith('/users/')) {
      const userId = basePath.split('/')[2]
      navigate(`/users/${userId}/posts/${postId}`)
    } else {
      navigate(`/posts/${postId}`)
    }
  }

  function handleDelete(id) {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id)
    }
  }

  return {
    openCreateForm,
    openEditForm,
    openDetail,
    handleDelete,
    isDeleting: deleteMutation.isPending
  }
}
