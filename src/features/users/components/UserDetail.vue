<template>
  <div class="space-y-6">
    <!-- User Profile Card -->
    <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
        {{ (user.fullName || user.username || '?').charAt(0).toUpperCase() }}
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-lg font-bold text-slate-900 truncate">{{ user.fullName || user.username }}</h2>
        <p class="text-sm text-slate-500">@{{ user.username }}</p>
        <p class="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
          <MailIcon class="w-3.5 h-3.5" />
          {{ user.email }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white border border-slate-200 rounded-lg p-3 text-center">
        <p class="text-2xl font-bold text-indigo-600">{{ postsData?.data.totalItems ?? '—' }}</p>
        <p class="text-xs text-slate-500 mt-0.5">Total Posts</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-lg p-3 text-center">
        <p class="text-sm font-medium text-slate-700">{{ new Date(user.createdAt).toLocaleDateString() }}</p>
        <p class="text-xs text-slate-500 mt-0.5">Joined</p>
      </div>
    </div>

    <!-- Posts Section -->
    <div class="border-t border-slate-100 pt-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-base font-semibold text-slate-800">Posts</h3>
        <BaseButton size="sm" @click="openCreateForm(user.id)">
          <PlusIcon class="w-3.5 h-3.5 mr-1" />
          New Post
        </BaseButton>
      </div>

      <div v-if="isLoadingPosts" class="flex justify-center py-6">
        <div class="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
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
        hide-author-column
        @page-change="(p) => postFilters.page = p"
        @size-change="(s) => { postFilters.size = s; postFilters.page = 0; }"
        @edit="openEditForm"
        @delete="handleDelete"
        @view="openDetail"
      />

      <div v-else-if="!isLoadingPosts" class="text-center py-6 text-slate-400 text-sm">
        No posts found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Plus as PlusIcon, Mail as MailIcon } from 'lucide-vue-next'

import BaseButton from '@/shared/components/BaseButton.vue'
import PostsTable from '@/features/posts/components/PostsTable.vue'

import { postsApi } from '@/features/posts/api'
import { usePostActions } from '@/features/posts/composables/usePostActions'
import type { UserResponse } from '@/features/users/types'
import type { PostFilterParams } from '@/features/posts/types'

const props = defineProps<{
  user: UserResponse
}>()

const { openCreateForm, openEditForm, openDetail, handleDelete } = usePostActions()

const postFilters = reactive<PostFilterParams>({
  page: 0,
  size: 5,
  userId: props.user.id
})

const { data: postsData, isLoading: isLoadingPosts } = useQuery({
  queryKey: ['posts', postFilters],
  queryFn: () => postsApi.getAdminPosts({ ...postFilters })
})
</script>
