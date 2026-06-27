import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import BaseCombobox from '@/shared/components/BaseCombobox'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { usersApi } from '@/features/users/api'

export default function UserSelect({
  id,
  label,
  error,
  placeholder,
  value,
  onValueChange,
  defaultSearch,
}) {
  const [searchText, setSearchText] = useState(defaultSearch || '')
  const activeSearch = useDebounce(searchText, 300)

  // Initialize searchText from defaultSearch on mount
  useEffect(() => {
    if (defaultSearch) {
      setSearchText(defaultSearch)
    }
  }, [defaultSearch])

  const { data: usersData } = useQuery({
    queryKey: ['users', activeSearch],
    queryFn: () => usersApi.getUsers({ size: 5, search: activeSearch || undefined }),
  })

  const options = (usersData?.data?.items || []).map((u) => ({
    label: u.fullName || u.username,
    value: u.id,
  }))

  function handleSearchChange(newSearch) {
    setSearchText(newSearch)
    if (!newSearch) {
      onValueChange?.(undefined)
    }
  }

  return (
    <BaseCombobox
      id={id}
      label={label}
      error={error}
      placeholder={placeholder}
      options={options}
      value={value}
      onValueChange={onValueChange}
      searchText={searchText}
      onSearchChange={handleSearchChange}
    />
  )
}
