import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSidebar } from '@/shared/context/SidebarContext'
import { commentsApi } from '../api'
import CommentForm from '../components/CommentForm'

export function useCommentActions() {
  const queryClient = useQueryClient()
  const { openSidebar } = useSidebar()

  const deleteMutation = useMutation({
    mutationFn: (id) => commentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  function openCreateForm(defaultPostId) {
    openSidebar(
      'Create New Comment',
      <CommentForm defaultPostId={defaultPostId} />
    )
  }

  function openEditForm(comment) {
    openSidebar(
      'Edit Comment',
      <CommentForm comment={comment} />
    )
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
