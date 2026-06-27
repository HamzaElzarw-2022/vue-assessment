import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

import BaseButton from '@/shared/components/BaseButton'
import CommentsTable from '@/features/comments/components/CommentsTable'
import { commentsApi } from '@/features/comments/api'
import { useCommentActions } from '@/features/comments/hooks/useCommentActions'

export default function CommentsView() {
  const { openCreateForm, openEditForm, handleDelete } = useCommentActions()

  const [filters, setFilters] = useState({
    page: 0,
    size: 20,
  })

  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', filters],
    queryFn: () => commentsApi.getComments({ ...filters }),
  })

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Comments Management</h1>
        <BaseButton onClick={() => openCreateForm()}>
          <Plus className="w-4 h-4 mr-2" />
          New Comment
        </BaseButton>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : commentsData ? (
        <CommentsTable
          comments={commentsData.data.items}
          pagination={{
            page: commentsData.data.page,
            size: commentsData.data.size,
            totalItems: commentsData.data.totalItems,
            totalPages: commentsData.data.totalPages,
          }}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          onSizeChange={(s) => setFilters((f) => ({ ...f, size: s, page: 0 }))}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      ) : null}
    </>
  )
}
