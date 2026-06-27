import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Mail } from 'lucide-react'

import BaseButton from '@/shared/components/BaseButton'
import PostsTable from '@/features/posts/components/PostsTable'
import { postsApi } from '@/features/posts/api'
import { usePostActions } from '@/features/posts/hooks/usePostActions'

export default function UserDetail({ user }) {
  const [postFilters, setPostFilters] = useState({
    page: 0,
    size: 5,
    userId: user.id,
  })

  const { openCreateForm, openEditForm, openDetail, handleDelete } = usePostActions()

  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['posts', postFilters],
    queryFn: () => postsApi.getAdminPosts(postFilters),
  })

  const initial = (user.fullName || user.username || '?').charAt(0).toUpperCase()

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-900 truncate">
            {user.fullName || user.username}
          </h2>
          <p className="text-sm text-slate-500">@{user.username}</p>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5" />
            {user.email}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-indigo-600">
            {postsData?.data?.totalItems ?? '—'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Total Posts</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
          <p className="text-sm font-medium text-slate-700">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Joined</p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-800">Posts</h3>
          <BaseButton size="sm" onClick={() => openCreateForm(user.id)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Post
          </BaseButton>
        </div>

        {isLoadingPosts ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : postsData ? (
          <PostsTable
            posts={postsData.data.items}
            pagination={{
              page: postsData.data.page,
              size: postsData.data.size,
              totalItems: postsData.data.totalItems,
              totalPages: postsData.data.totalPages,
            }}
            hideAuthorColumn
            onPageChange={(p) =>
              setPostFilters((prev) => ({ ...prev, page: p }))
            }
            onSizeChange={(s) =>
              setPostFilters((prev) => ({ ...prev, size: s, page: 0 }))
            }
            onEdit={openEditForm}
            onDelete={handleDelete}
            onView={openDetail}
          />
        ) : (
          <div className="text-center py-6 text-slate-400 text-sm">
            No posts found.
          </div>
        )}
      </div>
    </div>
  )
}
