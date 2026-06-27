import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Eye } from 'lucide-react'

import BaseFilter from '@/shared/components/BaseFilter'
import BaseTable from '@/shared/components/BaseTable'
import UserDetail from '@/features/users/components/UserDetail'
import { usersApi } from '@/features/users/api'
import { useSidebar } from '@/shared/context/SidebarContext'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'User' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Joined' },
  { key: 'actions', label: '' },
]

export default function UsersView() {
  const { openSidebar } = useSidebar()

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
    openSidebar('User Details', <UserDetail user={user} />)
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
