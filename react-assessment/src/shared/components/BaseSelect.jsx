import { cn } from '@/lib/cn'

export default function BaseSelect({
  id,
  label,
  error,
  options = [],
  multiple = false,
  className,
  value,
  onChange,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        multiple={multiple}
        className={cn(
          'flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm',
          multiple ? 'min-h-[100px]' : 'h-10',
          error ? 'border-red-500 focus:ring-red-500' : '',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
