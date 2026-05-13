import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useUiStore } from '@/shared/stores/uiStore'
import { commentsApi } from '../api'
import CommentForm from '../components/CommentForm.vue'
import type { CommentResponse } from '../types'

export function useCommentActions() {
  const queryClient = useQueryClient()
  const uiStore = useUiStore()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => commentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  function openCreateForm(defaultPostId?: number) {
    uiStore.openSidebar('Create New Comment', CommentForm, { defaultPostId })
  }

  function openEditForm(comment: CommentResponse) {
    uiStore.openSidebar('Edit Comment', CommentForm, { comment })
  }

  function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate(id)
    }
  }

  return {
    openCreateForm,
    openEditForm,
    handleDelete,
    isDeleting: deleteMutation.isPending
  }
}
