<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Users Management</h1>
    </div>

    <!-- Search -->
    <BaseFilter v-model="filters.search" />

    <!-- Table -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>

    <BaseTable
      v-else-if="usersData"
      :columns="columns"
      :data="usersData.data.items"
      :pagination="{
        page: usersData.data.page,
        size: usersData.data.size,
        totalItems: usersData.data.totalItems,
        totalPages: usersData.data.totalPages
      }"
      @page-change="(p) => filters.page = p"
      @size-change="(s) => { filters.size = s; filters.page = 0; }"
    >
      <template #cell-fullName="{ row }">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {{ (row.fullName || row.username || '?').charAt(0).toUpperCase() }}
          </div>
          <div>
            <div class="font-medium text-gray-900">{{ row.fullName || '—' }}</div>
            <div class="text-xs text-gray-500">@{{ row.username }}</div>
          </div>
        </div>
      </template>

      <template #cell-email="{ row }">
        <span class="text-sm text-gray-600">{{ row.email }}</span>
      </template>

      <template #cell-createdAt="{ row }">
        <span class="text-sm text-gray-500">{{ new Date(row.createdAt).toLocaleDateString() }}</span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2 justify-end">
          <button 
            @click="openUserDetail(row)"
            class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="View Details"
          >
            <EyeIcon class="w-4 h-4" />
          </button>
        </div>
      </template>
    </BaseTable>
  </AdminLayout>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Eye as EyeIcon } from 'lucide-vue-next'

import AdminLayout from '@/shared/components/AdminLayout.vue'
import BaseFilter from '@/shared/components/BaseFilter.vue'
import BaseTable, { type Column } from '@/shared/components/BaseTable.vue'
import UserDetail from '@/features/users/components/UserDetail.vue'

import { usersApi } from '@/features/users/api'
import { useUiStore } from '@/shared/stores/uiStore'
import type { UserFilterParams, UserResponse } from '@/features/users/types'

const uiStore = useUiStore()

const filters = reactive<UserFilterParams>({
  page: 0,
  size: 10,
  search: ''
})

watch(() => filters.search, () => {
  filters.page = 0
})

const { data: usersData, isLoading } = useQuery({
  queryKey: ['users-list', filters],
  queryFn: () => usersApi.getUsers({ 
    ...filters,
    search: filters.search || undefined
  })
})

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'User' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Joined' },
  { key: 'actions', label: '' }
]

function openUserDetail(user: UserResponse) {
  uiStore.openSidebar('User Details', UserDetail, { user })
}
</script>
