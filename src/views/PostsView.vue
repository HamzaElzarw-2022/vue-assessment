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
    <div class="mb-6 flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <BaseInput 
        v-model="searchQuery" 
        placeholder="Search posts..." 
        class="w-64"
        @input="handleSearch"
      />
    </div>

    <!-- Table -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
    
    <BaseTable 
      v-else-if="postsData" 
      :columns="columns" 
      :data="postsData.data.items"
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
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus as PlusIcon, Edit as EditIcon, Trash as TrashIcon, Eye as EyeIcon } from 'lucide-vue-next'
import debounce from 'lodash-es/debounce'

import AdminLayout from '@/shared/components/AdminLayout.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseTable, { type Column } from '@/shared/components/BaseTable.vue'
import PostForm from '@/features/posts/components/PostForm.vue'
import PostDetail from '@/features/posts/components/PostDetail.vue'

import { useUiStore } from '@/shared/stores/uiStore'
import { postsApi } from '@/features/posts/api'

const uiStore = useUiStore()
const queryClient = useQueryClient()

const page = ref(0)
const searchQuery = ref('')
const activeSearch = ref('')

// Debounce search input
const handleSearch = debounce(() => {
  activeSearch.value = searchQuery.value
  page.value = 0
}, 300)

const { data: postsData, isLoading } = useQuery({
  queryKey: ['posts', page, activeSearch],
  queryFn: () => postsApi.getAdminPosts({ 
    page: page.value, 
    search: activeSearch.value || undefined,
    size: 10
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
