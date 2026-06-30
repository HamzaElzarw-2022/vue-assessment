import { useQuery } from '@tanstack/react-query'
import { commentsApi } from '@/features/comments/api'
import CommentForm from '@/features/comments/components/CommentForm'

export default function CommentEditResolver({ commentId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['comments', commentId],
    queryFn: () => commentsApi.getComment(commentId),
    enabled: !!commentId,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data?.data) return null

  return <CommentForm comment={data.data} />
}
