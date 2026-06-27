import { useMemo } from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import BaseTable from '@/shared/components/BaseTable'

const allColumns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Post' },
  { key: 'user', label: 'Author' },
  { key: 'createdAt', label: 'Date' },
  { key: 'views', label: 'Views' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' }
]

export default function PostsTable({
  posts = [],
  pagination,
  hideAuthorColumn = false,
  onPageChange,
  onSizeChange,
  onEdit,
  onDelete,
  onView
}) {
  const columns = useMemo(() => {
    if (hideAuthorColumn) {
      return allColumns.filter((c) => c.key !== 'user')
    }
    return allColumns
  }, [hideAuthorColumn])

  function renderCell(key, row) {
    switch (key) {
      case 'title':
        return (
          <div>
            <div className="font-medium text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500 truncate max-w-[200px]">
              {row.body}
            </div>
          </div>
        )

      case 'user':
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              {(row.user?.fullName || row.user?.username || '?')
                .charAt(0)
                .toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {row.user?.fullName || row.user?.username}
            </span>
          </div>
        )

      case 'createdAt':
        return (
          <div className="flex items-center text-sm text-gray-500">
            {new Date(row.createdAt).toLocaleDateString()}
          </div>
        )

      case 'views':
        return (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Eye className="w-4 h-4" />
            {row.views}
          </div>
        )

      case 'status':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              row.deleted
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {row.deleted ? 'Deleted' : 'Active'}
          </span>
        )

      case 'actions':
        return (
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => onView?.(row.id)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit?.(row)}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete?.(row.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
      data={posts}
      pagination={pagination}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      renderCell={renderCell}
    />
  )
}
