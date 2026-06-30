import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/features/posts/api'
import PostForm from '@/features/posts/components/PostForm'

export default function PostEditResolver({ postId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => postsApi.getAdminPost(postId),
    enabled: !!postId,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data?.data) return null

  return <PostForm post={data.data} />
}
