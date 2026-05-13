<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Posts Management</h1>
      <BaseButton @click="openCreateForm">
        <PlusIcon class="w-4 h-4 mr-2" />
        New Post
      </BaseButton>
    </div>

    <!-- Search & Filters -->
    <BaseFilter v-model="filters.search">
      <BaseCombobox 
        v-model="filters.userId" 
        v-model:search="userSearch"
        :options="userOptions" 
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
    
    <BaseTable 
      v-else-if="postsData" 
      :columns="columns" 
      :data="postsData.data.items"
      :pagination="{
        page: postsData.data.page,
        size: postsData.data.size,
        totalItems: postsData.data.totalItems,
        totalPages: postsData.data.totalPages
      }"
      @page-change="(p) => { filters.page = p; }"
      @size-change="(s) => { filters.size = s; filters.page = 0; }"
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
          <span class="text-sm text-gray-700">{{ row.user?.fullName || row.user?.username }}</span>
        </div>
      </template>

      <template #cell-createdAt="{ row }">
        {{ new Date(row.createdAt).toLocaleDateString() }}
      </template>

      <template #cell-status="{ row }">
        <span 
          v-if="row.deleted" 
          class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
        >
          Deleted
        </span>
        <span 
          v-else 
          class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
        >
          Active
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2 justify-end">
          <button 
            @click="openDetail(row.id)"
            class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="View Details"
          >
            <EyeIcon class="w-4 h-4" />
          </button>
          <button 
            @click="openEditForm(row)"
            class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit"
          >
            <EditIcon class="w-4 h-4" />
          </button>
          <button 
            v-if="!row.deleted"
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
import { ref, reactive, computed, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus as PlusIcon, Edit as EditIcon, Trash as TrashIcon, Eye as EyeIcon } from 'lucide-vue-next'
import debounce from 'lodash-es/debounce'

import AdminLayout from '@/shared/components/AdminLayout.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseSelect from '@/shared/components/BaseSelect.vue'
import BaseCombobox from '@/shared/components/BaseCombobox.vue'
import BaseTable, { type Column } from '@/shared/components/BaseTable.vue'
import BaseFilter from '@/shared/components/BaseFilter.vue'
import PostForm from '@/features/posts/components/PostForm.vue'
import PostDetail from '@/features/posts/components/PostDetail.vue'

import { useUiStore } from '@/shared/stores/uiStore'
import { postsApi } from '@/features/posts/api'
import { usersApi } from '@/features/users/api'
import { tagsApi } from '@/features/tags/api'
import type { PostFilterParams } from '@/features/posts/types'

const uiStore = useUiStore()
const queryClient = useQueryClient()

const filters = reactive<PostFilterParams>({
  page: 0,
  size: 10,
  search: '',
  sortBy: 'id',
  sortDir: 'ascending',
  tag: '',
  userId: undefined
})

const userSearch = ref('')
const activeUserSearch = ref('')

const handleUserSearch = debounce(() => {
  activeUserSearch.value = userSearch.value
}, 300)

watch(userSearch, (newVal) => {
  handleUserSearch()
  if (!newVal) {
    filters.userId = undefined
  }
})

const { data: tagsData } = useQuery({
  queryKey: ['tags'],
  queryFn: () => tagsApi.getTags()
})

const { data: usersData } = useQuery({
  queryKey: ['users', activeUserSearch],
  queryFn: () => usersApi.getUsers({ size: 5, search: activeUserSearch.value || undefined })
})

const tagOptions = computed(() => {
  const options = [{ label: 'All Tags', value: '' }]
  if (tagsData.value?.data) {
    tagsData.value.data.forEach((t: any) => options.push({ label: t.name, value: t.name }))
  }
  return options
})

const userOptions = computed(() => {
  const options: { label: string, value: any }[] = []
  if (usersData.value?.data?.items) {
    usersData.value.data.items.forEach((u: any) => options.push({ label: u.fullName || u.username, value: u.id }))
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

const deleteMutation = useMutation({
  mutationFn: (id: number) => postsApi.deletePost(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }
})

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Post' },
  { key: 'user', label: 'Author' },
  { key: 'createdAt', label: 'Date' },
  { key: 'views', label: 'Views' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' }
]

function openCreateForm() {
  uiStore.openSidebar('Create New Post', PostForm)
}

function openEditForm(post: any) {
  uiStore.openSidebar('Edit Post', PostForm, { post })
}

function openDetail(postId: number) {
  uiStore.openSidebar('Post Details', PostDetail, { postId })
}

function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this post?')) {
    deleteMutation.mutate(id)
  }
}
</script>
