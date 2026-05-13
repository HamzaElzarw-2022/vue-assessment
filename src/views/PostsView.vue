<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Posts Management</h1>
      <BaseButton @click="openCreateForm()">
        <PlusIcon class="w-4 h-4 mr-2" />
        New Post
      </BaseButton>
    </div>

    <!-- Search & Filters -->
    <BaseFilter v-model="filters.search">
      <UserSelect 
        v-model="filters.userId" 
        placeholder="Filter by user..."
        class="w-48" 
      />
      <BaseSelect v-model="filters.tag" :options="tagOptions" class="w-32" />
      <BaseSelect v-model="filters.sortBy" :options="sortOptions" class="w-36" />
      <BaseSelect v-model="filters.sortDir" :options="sortDirOptions" class="w-32" />
    </BaseFilter>

    <!-- Table -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
    
    <PostsTable 
      v-else-if="postsData"
      :posts="postsData.data.items"
      :pagination="{
        page: postsData.data.page,
        size: postsData.data.size,
        totalItems: postsData.data.totalItems,
        totalPages: postsData.data.totalPages
      }"
      @page-change="(p) => { filters.page = p; }"
      @size-change="(s) => { filters.size = s; filters.page = 0; }"
      @edit="openEditForm"
      @delete="handleDelete"
      @view="openDetail"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Plus as PlusIcon } from 'lucide-vue-next'

import AdminLayout from '@/shared/components/AdminLayout.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseSelect from '@/shared/components/BaseSelect.vue'
import UserSelect from '@/features/users/components/UserSelect.vue'
import BaseFilter from '@/shared/components/BaseFilter.vue'
import PostsTable from '@/features/posts/components/PostsTable.vue'

import { postsApi } from '@/features/posts/api'
import { tagsApi } from '@/features/tags/api'
import type { PostFilterParams } from '@/features/posts/types'
import { usePostActions } from '@/features/posts/composables/usePostActions'

const { openCreateForm, openEditForm, openDetail, handleDelete } = usePostActions()

const filters = reactive<PostFilterParams>({
  page: 0,
  size: 10,
  search: '',
  sortBy: 'id',
  sortDir: 'ascending',
  tag: '',
  userId: undefined
})

const { data: tagsData } = useQuery({
  queryKey: ['tags'],
  queryFn: () => tagsApi.getTags()
})

const tagOptions = computed(() => {
  const options = [{ label: 'All Tags', value: '' }]
  if (tagsData.value?.data) {
    tagsData.value.data.forEach((t: any) => options.push({ label: t.name, value: t.name }))
  }
  return options
})

const sortOptions = [
  { label: 'Sort by ID', value: 'id' },
  { label: 'Sort by Views', value: 'views' },
  { label: 'Sort by Date', value: 'createdAt' }
]
const sortDirOptions = [
  { label: 'Ascending', value: 'ascending' },
  { label: 'Descending', value: 'descending' }
]

watch(() => [filters.search, filters.size, filters.sortBy, filters.sortDir, filters.tag, filters.userId], () => {
  filters.page = 0
})

const { data: postsData, isLoading } = useQuery({
  queryKey: ['posts', filters],
  queryFn: () => postsApi.getAdminPosts({ 
    ...filters,
    search: filters.search || undefined,
    tag: filters.tag || undefined,
    userId: filters.userId || undefined
  })
})
</script>
