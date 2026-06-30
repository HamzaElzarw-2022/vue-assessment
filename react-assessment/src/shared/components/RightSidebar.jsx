import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '@/shared/context/SidebarContext'

export default function RightSidebar({ basePath }) {
  const navigate = useNavigate()
  const { isOpen, stack, depth, title, currentEntry } = useSidebar()

  if (!isOpen) return null

  function handleBack() {
    // Navigate to the current entry's closeUrl (pops one level)
    const current = stack[stack.length - 1]
    if (current?.closeUrl) {
      navigate(current.closeUrl)
    } else {
      navigate(-1)
    }
  }

  function handleCloseAll() {
    // Navigate to the base page path (closes all sidebars)
    if (basePath) {
      navigate(basePath)
    } else {
      // Fallback: use the deepest entry's first-level closeUrl or go back
      const firstEntry = stack[0]
      if (firstEntry?.closeUrl) {
        navigate(firstEntry.closeUrl)
      } else {
        navigate(-1)
      }
    }
  }

  function handleBreadcrumbClick(index) {
    // Navigate to the close URL of the entry AFTER the clicked one
    // (this truncates the stack to include only up to the clicked entry)
    if (index < stack.length - 1) {
      const nextEntry = stack[index + 1]
      if (nextEntry?.closeUrl) {
        navigate(nextEntry.closeUrl)
      }
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity animate-fade-in"
        onClick={handleCloseAll}
      />

      {/* Sidebar Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-3xl bg-white shadow-xl z-50 flex flex-col h-full animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          {/* Breadcrumbs (depth > 1) */}
          {depth > 1 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5 flex-wrap">
              {stack.map((entry, index) => (
                <span key={index} className="flex items-center gap-1.5">
                  <span
                    className={
                      index === stack.length - 1
                        ? 'text-slate-600 font-medium'
                        : 'hover:text-indigo-500 cursor-pointer transition-colors'
                    }
                    onClick={() => handleBreadcrumbClick(index)}
                  >
                    {entry.title}
                  </span>
                  {index < stack.length - 1 && (
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Title Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {depth > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-shrink-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Go back"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <h2 className="text-lg font-semibold text-gray-800 truncate">{title}</h2>
            </div>
            <button
              onClick={handleCloseAll}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-200 cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentEntry?.content}
        </div>
      </div>
    </>
  )
}
