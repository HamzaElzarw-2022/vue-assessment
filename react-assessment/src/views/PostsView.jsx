import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

import BaseButton from '@/shared/components/BaseButton'
import BaseSelect from '@/shared/components/BaseSelect'
import BaseFilter from '@/shared/components/BaseFilter'
import UserSelect from '@/features/users/components/UserSelect'
import PostsTable from '@/features/posts/components/PostsTable'

import { postsApi } from '@/features/posts/api'
import { tagsApi } from '@/features/tags/api'
import { usePostActions } from '@/features/posts/hooks/usePostActions'

const sortOptions = [
  { label: 'Sort by ID', value: 'id' },
  { label: 'Sort by Views', value: 'views' },
  { label: 'Sort by Date', value: 'createdAt' },
]

const sortDirOptions = [
  { label: 'Ascending', value: 'ascending' },
  { label: 'Descending', value: 'descending' },
]

export default function PostsView() {
  const { openCreateForm, openEditForm, openDetail, handleDelete } = usePostActions()

  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    search: '',
    sortBy: 'id',
    sortDir: 'ascending',
    tag: '',
    userId: undefined,
  })

  // Reset page when filters change (except page itself)
  const [prevFilterKey, setPrevFilterKey] = useState('')
  const filterKey = `${filters.search}-${filters.size}-${filters.sortBy}-${filters.sortDir}-${filters.tag}-${filters.userId}`
  useEffect(() => {
    if (prevFilterKey && prevFilterKey !== filterKey) {
      setFilters((f) => ({ ...f, page: 0 }))
    }
    setPrevFilterKey(filterKey)
  }, [filterKey, prevFilterKey])

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

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }))
  }

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
          onSizeChange={(s) => {
            setFilters((f) => ({ ...f, size: s, page: 0 }))
          }}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onView={openDetail}
        />
      ) : null}
    </>
  )
}
