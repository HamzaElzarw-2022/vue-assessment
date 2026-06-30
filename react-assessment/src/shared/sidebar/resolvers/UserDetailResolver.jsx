import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/features/users/api'
import UserDetail from '@/features/users/components/UserDetail'

export default function UserDetailResolver({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.getUser(userId),
    enabled: !!userId,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data?.data) return null

  return <UserDetail user={data.data} />
}
