<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="post" class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">{{ post.title }}</h2>
        <div class="flex items-center gap-3 text-sm text-slate-500">
          <span class="font-medium text-slate-700">By {{ post.user?.fullName || post.user?.username }}</span>
          <span>&bull;</span>
          <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
          <span v-if="post.views" class="flex items-center gap-1">
            &bull; {{ post.views }} views
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <span 
          v-for="tag in post.tags" 
          :key="tag"
          class="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"
        >
          {{ tag }}
        </span>
      </div>

      <div class="prose prose-sm prose-slate max-w-none bg-slate-50 p-4 rounded-lg">
        <p class="whitespace-pre-wrap">{{ post.body }}</p>
      </div>

      <div v-if="post.deleted" class="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
        <AlertCircleIcon class="w-5 h-5" />
        This post was deleted on {{ new Date(post.deletedAt!).toLocaleDateString() }}
      </div>
      
      <div class="pt-6 border-t border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Comments ({{ post.commentsCount }})</h3>
          <BaseButton size="sm" @click="openCreateForm(post.id)">
            <PlusIcon class="w-4 h-4 mr-1.5" />
            Add Comment
          </BaseButton>
        </div>
        
        <div v-if="isLoadingComments" class="flex justify-center py-4">
          <div class="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
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
          hide-post-column
          @page-change="(p) => commentFilters.page = p"
          @size-change="(s) => { commentFilters.size = s; commentFilters.page = 0; }"
          @edit="openEditForm"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { postsApi } from '../api'
import { commentsApi } from '@/features/comments/api'
import { useCommentActions } from '@/features/comments/composables/useCommentActions'
import { AlertCircle as AlertCircleIcon, Plus as PlusIcon } from 'lucide-vue-next'
import BaseButton from '@/shared/components/BaseButton.vue'
import CommentsTable from '@/features/comments/components/CommentsTable.vue'
import type { CommentFilterParams } from '@/features/comments/types'

const props = defineProps<{
  postId: number
}>()

const { openCreateForm, openEditForm, handleDelete } = useCommentActions()

const { data: postData, isLoading } = useQuery({
  queryKey: ['posts', props.postId],
  queryFn: () => postsApi.getAdminPost(props.postId),
  enabled: !!props.postId
})

const post = computed(() => postData.value?.data)

const commentFilters = reactive<CommentFilterParams>({
  page: 0,
  size: 5
})

const { data: commentsData, isLoading: isLoadingComments } = useQuery({
  queryKey: ['posts', props.postId, 'comments', commentFilters],
  queryFn: () => commentsApi.getPostComments(props.postId, { ...commentFilters }),
  enabled: !!props.postId
})
</script>
