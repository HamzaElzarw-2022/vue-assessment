<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="!isEdit" class="space-y-6">
      <BaseSelect
        v-if="!defaultPostId"
        v-model="formData.postId"
        id="postId"
        label="Post"
        :options="postOptions"
        required
      />
      <UserSelect
        v-model="formData.userId"
        id="userId"
        label="User (Author)"
        :default-search="comment?.commenterName"
        required
      />
    </div>

    <BaseInput
      v-model="formData.commenterName"
      id="commenterName"
      label="Commenter Name"
      placeholder="John Doe"
      required
    />

    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-slate-700">Comment Body</label>
      <textarea
        v-model="formData.body"
        class="w-full min-h-[100px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors shadow-sm"
        placeholder="Write a comment..."
        required
      ></textarea>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
      <BaseButton type="button" variant="outline" @click="$emit('close')">Cancel</BaseButton>
      <BaseButton type="submit" :disabled="isPending">
        {{ isPending ? 'Saving...' : (isEdit ? 'Update Comment' : 'Create Comment') }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseSelect from '@/shared/components/BaseSelect.vue'
import UserSelect from '@/features/users/components/UserSelect.vue'
import { commentsApi } from '../api'
import { postsApi } from '@/features/posts/api'
import type { CommentResponse, CreateCommentRequest, UpdateCommentRequest } from '../types'

const props = defineProps<{
  comment?: CommentResponse
  defaultPostId?: number
}>()

const emit = defineEmits(['close', 'success'])
const queryClient = useQueryClient()

const isEdit = computed(() => !!props.comment)

const formData = ref({
  postId: props.defaultPostId || ('' as number | ''),
  userId: '' as number | '',
  commenterName: '',
  body: ''
})

watch(() => props.comment, (newComment) => {
  if (newComment) {
    formData.value = {
      postId: newComment.postId,
      userId: newComment.userId,
      commenterName: newComment.commenterName,
      body: newComment.body
    }
  }
}, { immediate: true })


// Fetch posts (for creation)
const { data: postsData } = useQuery({
  queryKey: ['posts', 'all'],
  queryFn: () => postsApi.getAdminPosts({ size: 100 }),
  enabled: !isEdit.value
})
const postOptions = computed(() => {
  return postsData.value?.data.items.map(p => ({ label: p.title, value: p.id })) || []
})

// Mutations
const createMutation = useMutation({
  mutationFn: (data: CreateCommentRequest & { postId: number }) => {
    const { postId, ...req } = data
    return commentsApi.createPostComment(postId, req)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['comments'] })
    emit('success')
    emit('close')
  }
})

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: number, data: UpdateCommentRequest }) => commentsApi.updateComment(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['comments'] })
    emit('success')
    emit('close')
  }
})

const isPending = computed(() => createMutation.isPending.value || updateMutation.isPending.value)

function handleSubmit() {
  if (isEdit.value && props.comment) {
    updateMutation.mutate({ 
      id: props.comment.id, 
      data: {
        body: formData.value.body,
        commenterName: formData.value.commenterName
      } 
    })
  } else {
    createMutation.mutate({
      postId: Number(formData.value.postId),
      userId: Number(formData.value.userId),
      body: formData.value.body,
      commenterName: formData.value.commenterName
    })
  }
}
</script>
