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
        <h3 class="text-lg font-semibold mb-4">Comments ({{ post.commentsCount }})</h3>
        <!-- We could list comments here, but for now we just show the count to keep it simple -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { postsApi } from '../api'
import { AlertCircle as AlertCircleIcon } from 'lucide-vue-next'

const props = defineProps<{
  postId: number
}>()

const { data: postData, isLoading } = useQuery({
  queryKey: ['posts', props.postId],
  queryFn: () => postsApi.getAdminPost(props.postId),
  enabled: !!props.postId
})

const post = computed(() => postData.value?.data)
import { computed } from 'vue'
</script>
