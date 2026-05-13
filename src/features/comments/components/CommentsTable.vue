<template>
  <BaseTable 
    :columns="activeColumns" 
    :data="comments"
    :pagination="pagination"
    @page-change="$emit('page-change', $event)"
    @size-change="$emit('size-change', $event)"
  >
    <template #cell-commenterName="{ row }">
      <div class="font-medium text-gray-900">{{ row.commenterName }}</div>
    </template>

    <template #cell-body="{ row }">
      <div class="text-sm text-gray-600 truncate max-w-xs" :title="row.body">{{ row.body }}</div>
    </template>

    <template #cell-createdAt="{ row }">
      {{ new Date(row.createdAt).toLocaleDateString() }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center gap-2 justify-end">
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
import { Edit as EditIcon, Trash as TrashIcon } from 'lucide-vue-next'
import BaseTable, { type Column, type PaginationDetails } from '@/shared/components/BaseTable.vue'
import type { CommentResponse } from '../types'

const props = defineProps<{
  comments: CommentResponse[]
  pagination?: PaginationDetails
  hidePostColumn?: boolean
}>()

defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
  (e: 'edit', comment: CommentResponse): void
  (e: 'delete', id: number): void
}>()

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'commenterName', label: 'Author' },
  { key: 'body', label: 'Comment' },
  { key: 'postId', label: 'Post ID' },
  { key: 'createdAt', label: 'Date' },
  { key: 'actions', label: '' }
]

const activeColumns = computed(() => {
  if (props.hidePostColumn) {
    return columns.filter(c => c.key !== 'postId')
  }
  return columns
})
</script>
