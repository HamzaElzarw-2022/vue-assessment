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
    
    <CommentsTable 
      v-else-if="commentsData" 
      :comments="commentsData.data.items"
      :pagination="{
        page: commentsData.data.page,
        size: commentsData.data.size,
        totalItems: commentsData.data.totalItems,
        totalPages: commentsData.data.totalPages
      }"
      @page-change="(p) => filters.page = p"
      @size-change="(s) => { filters.size = s; filters.page = 0; }"
      @edit="openEditForm"
      @delete="handleDelete"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Plus as PlusIcon } from 'lucide-vue-next'

import AdminLayout from '@/shared/components/AdminLayout.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import CommentsTable from '@/features/comments/components/CommentsTable.vue'

import { commentsApi } from '@/features/comments/api'
import type { CommentFilterParams } from '@/features/comments/types'
import { useCommentActions } from '@/features/comments/composables/useCommentActions'

const { openCreateForm, openEditForm, handleDelete } = useCommentActions()

const filters = reactive<CommentFilterParams>({
  page: 0,
  size: 20
})

const { data: commentsData, isLoading } = useQuery({
  queryKey: ['comments', filters],
  queryFn: () => commentsApi.getComments({ ...filters })
})
</script>
