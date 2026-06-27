<template>
  <BaseTable 
    :columns="activeColumns" 
    :data="posts"
    :pagination="pagination"
    @page-change="$emit('page-change', $event)"
    @size-change="$emit('size-change', $event)"
  >
    <template #cell-title="{ row }">
      <div class="font-medium text-gray-900">{{ row.title }}</div>
      <div class="text-xs text-gray-500 truncate max-w-[200px]">{{ row.body }}</div>
    </template>

    <template #cell-user="{ row }">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
          {{ (row.user?.fullName || row.user?.username || '?').charAt(0).toUpperCase() }}
        </div>
        <span class="text-sm font-medium text-gray-700">{{ row.user?.fullName || row.user?.username }}</span>
      </div>
    </template>

    <template #cell-createdAt="{ row }">
      <div class="flex items-center text-sm text-gray-500">
        {{ new Date(row.createdAt).toLocaleDateString() }}
      </div>
    </template>

    <template #cell-views="{ row }">
      <div class="flex items-center gap-1.5 text-sm text-gray-500">
        <EyeIcon class="w-4 h-4" />
        {{ row.views }}
      </div>
    </template>

    <template #cell-status="{ row }">
      <span 
        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
        :class="row.deleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
      >
        {{ row.deleted ? 'Deleted' : 'Active' }}
      </span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center gap-2 justify-end">
        <button 
          @click="$emit('view', row.id)"
          class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
          title="View Details"
        >
          <EyeIcon class="w-4 h-4" />
        </button>
        <button 
          @click="$emit('edit', row)"
          class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="Edit"
        >
          <EditIcon class="w-4 h-4" />
        </button>
        <button 
          @click="$emit('delete', row.id)"
          class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Edit as EditIcon, Trash as TrashIcon, Eye as EyeIcon } from 'lucide-vue-next'
import BaseTable, { type Column, type PaginationDetails } from '@/shared/components/BaseTable.vue'
import type { PostResponseAdmin } from '../types'

const props = defineProps<{
  posts: PostResponseAdmin[]
  pagination?: PaginationDetails
  hideAuthorColumn?: boolean
}>()

defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
  (e: 'edit', post: PostResponseAdmin): void
  (e: 'delete', id: number): void
  (e: 'view', id: number): void
}>()

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Post' },
  { key: 'user', label: 'Author' },
  { key: 'createdAt', label: 'Date' },
  { key: 'views', label: 'Views' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' }
]

const activeColumns = computed(() => {
  if (props.hideAuthorColumn) {
    return columns.filter(c => c.key !== 'user')
  }
  return columns
})
</script>
