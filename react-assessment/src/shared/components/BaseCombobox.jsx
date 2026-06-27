import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function BaseCombobox({
  id,
  label,
  error,
  options = [],
  placeholder = '',
  className,
  onValueChange,
  searchText = '',
  onSearchChange,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  function selectOption(opt) {
    onValueChange?.(opt.value)
    onSearchChange?.(opt.label)
    setIsOpen(false)
  }

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 mb-1.5 block">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type="text"
          value={searchText}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors shadow-sm',
            error ? 'border-red-500 focus:ring-red-500' : '',
            className
          )}
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && options.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => selectOption(opt)}
                className="px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors"
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
