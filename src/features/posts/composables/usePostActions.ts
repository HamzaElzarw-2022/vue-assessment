import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useUiStore } from '@/shared/stores/uiStore'
import { postsApi } from '../api'
import PostForm from '../components/PostForm.vue'
import PostDetail from '../components/PostDetail.vue'

export function usePostActions() {
  const queryClient = useQueryClient()
  const uiStore = useUiStore()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  function openCreateForm(defaultUserId?: number) {
    const userId = typeof defaultUserId === 'number' ? defaultUserId : undefined
    uiStore.openSidebar('Create New Post', PostForm, {
      ...(userId !== undefined ? { defaultUserId: userId } : {})
    })
  }

  function openEditForm(post: any) {
    uiStore.openSidebar('Edit Post', PostForm, { post })
  }

  function openDetail(postId: number) {
    uiStore.openSidebar('Post Details', PostDetail, { postId })
  }

  function handleDelete(id: number) {
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
