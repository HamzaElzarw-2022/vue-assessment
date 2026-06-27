/**
 * Generic data table with pagination footer.
 * Columns can provide a custom `render` function, otherwise the value is resolved
 * from the row using the column key (supports dotted paths).
 */
export default function BaseTable({
  columns = [],
  data = [],
  pagination,
  onPageChange,
  onSizeChange,
  renderCell,
}) {
  function getNestedValue(obj, path) {
    return String(path).split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  return (
    <div className="w-full overflow-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-4 font-medium">
                {col.headerRender ? col.headerRender() : col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-6 py-4">
                    {renderCell
                      ? renderCell(col.key, row) ?? getNestedValue(row, String(col.key))
                      : col.render
                        ? col.render(row)
                        : getNestedValue(row, String(col.key))}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && pagination.totalItems > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
          <div className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-medium text-slate-900">
              {pagination.page * pagination.size + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-slate-900">
              {Math.min((pagination.page + 1) * pagination.size, pagination.totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-slate-900">{pagination.totalItems}</span>{' '}
            results
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-200/50 p-1 rounded-lg">
              {[5, 10, 20].map((size) => (
                <button
                  key={size}
                  onClick={() => onSizeChange?.(size)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    pagination.size === size
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
