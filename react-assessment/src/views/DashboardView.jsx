import { useQuery } from '@tanstack/react-query'
import { FileText, MessageSquare, Users } from 'lucide-react'
import { postsApi } from '@/features/posts/api'
import { commentsApi } from '@/features/comments/api'
import { usersApi } from '@/features/users/api'

export default function DashboardView() {
  const { data: postsData } = useQuery({
    queryKey: ['posts', 'count'],
    queryFn: () => postsApi.getAdminPosts({ size: 1 }),
  })

  const { data: commentsData } = useQuery({
    queryKey: ['comments', 'count'],
    queryFn: () => commentsApi.getComments({ size: 1 }),
  })

  const { data: usersData } = useQuery({
    queryKey: ['users', 'count'],
    queryFn: () => usersApi.getUsers({ size: 1 }),
  })

  const stats = [
    {
      label: 'Total Posts',
      value: postsData?.data.totalItems || 0,
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      label: 'Total Comments',
      value: commentsData?.data.totalItems || 0,
      icon: MessageSquare,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Total Users',
      value: usersData?.data.totalItems || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center"
            >
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mr-4`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
