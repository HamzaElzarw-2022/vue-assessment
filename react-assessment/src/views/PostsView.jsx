import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'

import BaseButton from '@/shared/components/BaseButton'
import BaseSelect from '@/shared/components/BaseSelect'
import BaseFilter from '@/shared/components/BaseFilter'
import UserSelect from '@/features/users/components/UserSelect'
import PostsTable from '@/features/posts/components/PostsTable'

import PostDetail from '@/features/posts/components/PostDetail'
import PostForm from '@/features/posts/components/PostForm'
import CommentForm from '@/features/comments/components/CommentForm'
import PostEditResolver from '@/shared/sidebar/resolvers/PostEditResolver'
import CommentEditResolver from '@/shared/sidebar/resolvers/CommentEditResolver'

import { postsApi } from '@/features/posts/api'
import { tagsApi } from '@/features/tags/api'
import { usePostActions } from '@/features/posts/hooks/usePostActions'
import { useSidebarRoutes } from '@/shared/hooks/useSidebarRoutes'

const sortOptions = [
  { label: 'Sort by ID', value: 'id' },
  { label: 'Sort by Views', value: 'views' },
  { label: 'Sort by Date', value: 'createdAt' },
]

const sortDirOptions = [
  { label: 'Ascending', value: 'ascending' },
  { label: 'Descending', value: 'descending' },
]

const postsSidebarRoutes = [
  {
    pattern: 'new',
    title: 'Create New Post',
    render: () => <PostForm />,
    closeUrl: () => '/posts',
  },
  {
    pattern: ':postId',
    title: 'Post Details',
    render: (p) => <PostDetail postId={Number(p.postId)} />,
    closeUrl: () => '/posts',
  },
  {
    pattern: ':postId/edit',
    title: 'Edit Post',
    render: (p) => <PostEditResolver postId={Number(p.postId)} />,
    closeUrl: (p) => `/posts/${p.postId}`,
  },
  {
    pattern: ':postId/comments/new',
    title: ['Post Details', 'Create Comment'],
    render: (p) => [
      <PostDetail key="detail" postId={Number(p.postId)} />,
      <CommentForm key="form" defaultPostId={Number(p.postId)} />,
    ],
    closeUrl: (p) => `/posts/${p.postId}`,
  },
  {
    pattern: ':postId/comments/:commentId/edit',
    title: ['Post Details', 'Edit Comment'],
    render: (p) => [
      <PostDetail key="detail" postId={Number(p.postId)} />,
      <CommentEditResolver key="form" commentId={Number(p.commentId)} />,
    ],
    closeUrl: (p) => `/posts/${p.postId}`,
  },
]

export default function PostsView() {
  const { openCreateForm, openEditForm, openDetail, handleDelete } = usePostActions()

  // URL-synced sidebar
  useSidebarRoutes('/posts', postsSidebarRoutes)

  // URL-synced filters via search params
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => ({
    page: Number(searchParams.get('page') || 0),
    size: Number(searchParams.get('size') || 10),
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'id',
    sortDir: searchParams.get('sortDir') || 'ascending',
    tag: searchParams.get('tag') || '',
    userId: searchParams.get('userId') ? Number(searchParams.get('userId')) : undefined,
  }), [searchParams])

  function updateFilter(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      // Reset page when non-page filters change
      if (key !== 'page') {
        next.delete('page')
      }
      if (value === '' || value === undefined || value === null) {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
      // Remove defaults to keep URL clean
      if (next.get('size') === '10') next.delete('size')
      if (next.get('sortBy') === 'id') next.delete('sortBy')
      if (next.get('sortDir') === 'ascending') next.delete('sortDir')
      if (next.get('page') === '0') next.delete('page')
      return next
    })
  }

  function handleSizeChange(size) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('page')
      if (size === 10) {
        next.delete('size')
      } else {
        next.set('size', String(size))
      }
      return next
    })
  }

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getTags(),
  })

  const tagOptions = useMemo(() => {
    const options = [{ label: 'All Tags', value: '' }]
    if (tagsData?.data) {
      tagsData.data.forEach((t) => options.push({ label: t.name, value: t.name }))
    }
    return options
  }, [tagsData])

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', filters],
    queryFn: () =>
      postsApi.getAdminPosts({
        ...filters,
        search: filters.search || undefined,
        tag: filters.tag || undefined,
        userId: filters.userId || undefined,
      }),
  })

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Posts Management</h1>
        <BaseButton onClick={() => openCreateForm()}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </BaseButton>
      </div>

      {/* Search & Filters */}
      <BaseFilter search={filters.search} onSearchChange={(v) => updateFilter('search', v)}>
        <UserSelect
          value={filters.userId}
          onValueChange={(v) => updateFilter('userId', v)}
          placeholder="Filter by user..."
          className="w-48"
        />
        <BaseSelect
          value={filters.tag}
          onChange={(e) => updateFilter('tag', e.target.value)}
          options={tagOptions}
          className="w-32"
        />
        <BaseSelect
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          options={sortOptions}
          className="w-36"
        />
        <BaseSelect
          value={filters.sortDir}
          onChange={(e) => updateFilter('sortDir', e.target.value)}
          options={sortDirOptions}
          className="w-32"
        />
      </BaseFilter>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
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
          onPageChange={(p) => updateFilter('page', p)}
          onSizeChange={handleSizeChange}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onView={openDetail}
        />
      ) : null}
    </>
  )
}
