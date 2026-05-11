<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Comments Management</h1>
      <BaseButton @click="openCreateForm">
        <PlusIcon class="w-4 h-4 mr-2" />
        New Comment
      </BaseButton>
    </div>

    <!-- Table -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
    
    <BaseTable 
      v-else-if="commentsData" 
      :columns="columns" 
      :data="commentsData.data.items"
    >
      <template #cell-commenterName="{ row }">
        <div class="font-medium text-gray-900">{{ row.commenterName }}</div>
      </template>

      <template #cell-body="{ row }">
        <div class="text-sm text-gray-600 truncate max-w-xs">{{ row.body }}</div>
      </template>

      <template #cell-createdAt="{ row }">
        {{ new Date(row.createdAt).toLocaleDateString() }}
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2 justify-end">
          <button 
            @click="openEditForm(row)"
            class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit"
          >
            <EditIcon class="w-4 h-4" />
          </button>
          <button 
            @click="handleDelete(row.id)"
            class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </template>
    </BaseTable>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus as PlusIcon, Edit as EditIcon, Trash as TrashIcon } from 'lucide-vue-next'

import AdminLayout from '@/shared/components/AdminLayout.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseTable, { type Column } from '@/shared/components/BaseTable.vue'
import CommentForm from '@/features/comments/components/CommentForm.vue'

import { useUiStore } from '@/shared/stores/uiStore'
import { commentsApi } from '@/features/comments/api'

const uiStore = useUiStore()
const queryClient = useQueryClient()

const page = ref(0)

const { data: commentsData, isLoading } = useQuery({
  queryKey: ['comments', page],
  queryFn: () => commentsApi.getComments({ page: page.value, size: 20 })
})

const deleteMutation = useMutation({
  mutationFn: (id: number) => commentsApi.deleteComment(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['comments'] })
  }
})

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'commenterName', label: 'Author' },
  { key: 'body', label: 'Comment' },
  { key: 'postId', label: 'Post ID' },
  { key: 'createdAt', label: 'Date' },
  { key: 'actions', label: '' }
]

function openCreateForm() {
  uiStore.openSidebar('Create New Comment', CommentForm)
}

function openEditForm(comment: any) {
  uiStore.openSidebar('Edit Comment', CommentForm, { comment })
}

function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this comment?')) {
    deleteMutation.mutate(id)
  }
}
</script>
