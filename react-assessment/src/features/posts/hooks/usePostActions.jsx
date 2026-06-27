import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSidebar } from '@/shared/context/SidebarContext'
import { postsApi } from '../api'
import PostForm from '../components/PostForm'
import PostDetail from '../components/PostDetail'

export function usePostActions() {
  const queryClient = useQueryClient()
  const { openSidebar } = useSidebar()

  const deleteMutation = useMutation({
    mutationFn: (id) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  function openCreateForm(defaultUserId) {
    const userId = typeof defaultUserId === 'number' ? defaultUserId : undefined
    openSidebar(
      'Create New Post',
      <PostForm {...(userId !== undefined ? { defaultUserId: userId } : {})} />
    )
  }

  function openEditForm(post) {
    openSidebar('Edit Post', <PostForm post={post} />)
  }

  function openDetail(postId) {
    openSidebar('Post Details', <PostDetail postId={postId} />)
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
