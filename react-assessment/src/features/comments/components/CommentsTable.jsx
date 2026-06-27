import { useMemo } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import BaseTable from '@/shared/components/BaseTable'

export default function CommentsTable({
  comments = [],
  pagination,
  hidePostColumn = false,
  onPageChange,
  onSizeChange,
  onEdit,
  onDelete,
}) {
  const columns = useMemo(() => {
    const allColumns = [
      { key: 'id', label: 'ID' },
      { key: 'commenterName', label: 'Author' },
      { key: 'body', label: 'Comment' },
      { key: 'postId', label: 'Post ID' },
      { key: 'createdAt', label: 'Date' },
      { key: 'actions', label: 'Actions' },
    ]

    if (hidePostColumn) {
      return allColumns.filter((col) => col.key !== 'postId')
    }

    return allColumns
  }, [hidePostColumn])

  function renderCell(key, row) {
    switch (key) {
      case 'commenterName':
        return <span className="font-medium">{row.commenterName}</span>
      case 'body':
        return (
          <span className="max-w-xs truncate block">{row.body}</span>
        )
      case 'createdAt':
        return row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : '—'
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit?.(row)}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete?.(row.id)}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <BaseTable
      columns={columns}
      data={comments}
      pagination={pagination}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      renderCell={renderCell}
    />
  )
}
