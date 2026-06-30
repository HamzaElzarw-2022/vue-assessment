import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'

import BaseFilter from '@/shared/components/BaseFilter'
import BaseTable from '@/shared/components/BaseTable'

import UserDetailResolver from '@/shared/sidebar/resolvers/UserDetailResolver'
import PostDetail from '@/features/posts/components/PostDetail'
import PostForm from '@/features/posts/components/PostForm'
import PostEditResolver from '@/shared/sidebar/resolvers/PostEditResolver'
import CommentForm from '@/features/comments/components/CommentForm'
import CommentEditResolver from '@/shared/sidebar/resolvers/CommentEditResolver'

import { usersApi } from '@/features/users/api'
import { useSidebarRoutes } from '@/shared/hooks/useSidebarRoutes'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'User' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Joined' },
  { key: 'actions', label: '' },
]

const usersSidebarRoutes = [
  {
    pattern: ':userId',
    title: 'User Details',
    render: (p) => <UserDetailResolver userId={Number(p.userId)} />,
    closeUrl: () => '/users',
  },
  {
    pattern: ':userId/posts/new',
    title: ['User Details', 'Create New Post'],
    render: (p) => [
      <UserDetailResolver key="user" userId={Number(p.userId)} />,
      <PostForm key="form" defaultUserId={Number(p.userId)} />,
    ],
    closeUrl: (p) => `/users/${p.userId}`,
  },
  {
    pattern: ':userId/posts/:postId',
    title: ['User Details', 'Post Details'],
    render: (p) => [
      <UserDetailResolver key="user" userId={Number(p.userId)} />,
      <PostDetail key="post" postId={Number(p.postId)} />,
    ],
    closeUrl: (p) => `/users/${p.userId}`,
  },
  {
    pattern: ':userId/posts/:postId/edit',
    title: ['User Details', 'Edit Post'],
    render: (p) => [
      <UserDetailResolver key="user" userId={Number(p.userId)} />,
      <PostEditResolver key="form" postId={Number(p.postId)} />,
    ],
    closeUrl: (p) => `/users/${p.userId}/posts/${p.postId}`,
  },
  {
    pattern: ':userId/posts/:postId/comments/new',
    title: ['User Details', 'Post Details', 'Create Comment'],
    render: (p) => [
      <UserDetailResolver key="user" userId={Number(p.userId)} />,
      <PostDetail key="post" postId={Number(p.postId)} />,
      <CommentForm key="form" defaultPostId={Number(p.postId)} />,
    ],
    closeUrl: (p) => `/users/${p.userId}/posts/${p.postId}`,
  },
  {
    pattern: ':userId/posts/:postId/comments/:commentId/edit',
    title: ['User Details', 'Post Details', 'Edit Comment'],
    render: (p) => [
      <UserDetailResolver key="user" userId={Number(p.userId)} />,
      <PostDetail key="post" postId={Number(p.postId)} />,
      <CommentEditResolver key="form" commentId={Number(p.commentId)} />,
    ],
    closeUrl: (p) => `/users/${p.userId}/posts/${p.postId}`,
  },
]

export default function UsersView() {
  const navigate = useNavigate()

  // URL-synced sidebar
  useSidebarRoutes('/users', usersSidebarRoutes)

  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    search: '',
  })

  // Reset page when search changes
  const [prevSearch, setPrevSearch] = useState('')
  useEffect(() => {
    if (prevSearch !== filters.search) {
      if (prevSearch !== '') {
        setFilters((f) => ({ ...f, page: 0 }))
      }
      setPrevSearch(filters.search)
    }
  }, [filters.search, prevSearch])

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users-list', filters],
    queryFn: () =>
      usersApi.getUsers({
        ...filters,
        search: filters.search || undefined,
      }),
  })

  function openUserDetail(user) {
    navigate(`/users/${user.id}`)
  }

  function renderCell(key, row) {
    switch (key) {
      case 'fullName':
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {(row.fullName || row.username || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-gray-900">{row.fullName || '—'}</div>
              <div className="text-xs text-gray-500">@{row.username}</div>
            </div>
          </div>
        )
      case 'email':
        return <span className="text-sm text-gray-600">{row.email}</span>
      case 'createdAt':
        return (
          <span className="text-sm text-gray-500">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        )
      case 'actions':
        return (
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => openUserDetail(row)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
      </div>

      {/* Search */}
      <BaseFilter
        search={filters.search}
        onSearchChange={(v) => setFilters((f) => ({ ...f, search: v }))}
      />

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : usersData ? (
        <BaseTable
          columns={columns}
          data={usersData.data.items}
          pagination={{
            page: usersData.data.page,
            size: usersData.data.size,
            totalItems: usersData.data.totalItems,
            totalPages: usersData.data.totalPages,
          }}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          onSizeChange={(s) => setFilters((f) => ({ ...f, size: s, page: 0 }))}
          renderCell={renderCell}
        />
      ) : null}
    </>
  )
}
