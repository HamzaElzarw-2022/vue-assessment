<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <BaseInput
      v-model="formData.title"
      id="title"
      label="Title"
      placeholder="Enter post title"
      required
    />

    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-slate-700">Body</label>
      <textarea
        v-model="formData.body"
        class="w-full min-h-[150px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors shadow-sm"
        placeholder="Post body content..."
        required
      ></textarea>
    </div>

    <UserSelect
      v-if="!defaultUserId"
      v-model="formData.userId"
      id="userId"
      label="Author"
      :default-search="post?.user?.fullName || post?.user?.username"
      required
    />

    <BaseSelect
      v-model="formData.tagIds"
      id="tagIds"
      label="Tags"
      :options="tagOptions"
      multiple
    />

    <BaseInput
      v-model="formData.views"
      type="number"
      id="views"
      label="Views (Optional)"
      placeholder="0"
    />

    <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
      <BaseButton type="button" variant="outline" @click="$emit('close')">Cancel</BaseButton>
      <BaseButton type="submit" :disabled="isPending">
        {{ isPending ? 'Saving...' : (isEdit ? 'Update Post' : 'Create Post') }}
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
import { postsApi } from '../api'
import { tagsApi } from '@/features/tags/api'
import type { PostResponseAdmin, CreatePostRequest } from '../types'

const props = defineProps<{
  post?: PostResponseAdmin
  defaultUserId?: number
}>()

const emit = defineEmits(['close', 'success'])
const queryClient = useQueryClient()

const isEdit = computed(() => !!props.post)

// Form State
const formData = ref({
  title: '',
  body: '',
  userId: (props.defaultUserId || '') as number | '',
  tagIds: [] as number[],
  views: 0
})

watch(() => props.post, (newPost) => {
  if (newPost) {
    formData.value = {
      title: newPost.title,
      body: newPost.body,
      userId: newPost.user?.id || '',
      tagIds: [], // We need a way to map string tags back to tagIds if required, but API gives tags as string array.
      views: newPost.views || 0
    }
  }
}, { immediate: true })


// Fetch tags for select
const { data: tagsData } = useQuery({
  queryKey: ['tags'],
  queryFn: () => tagsApi.getTags()
})
const tagOptions = computed(() => {
  return tagsData.value?.data.map(t => ({ label: t.name, value: t.id })) || []
})

// Mutations
const createMutation = useMutation({
  mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    emit('success')
    emit('close')
  }
})

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: number, data: CreatePostRequest }) => postsApi.updatePost(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    emit('success')
    emit('close')
  }
})

const isPending = computed(() => createMutation.isPending.value || updateMutation.isPending.value)

function handleSubmit() {
  const payload: CreatePostRequest = {
    title: formData.value.title,
    body: formData.value.body,
    userId: Number(formData.value.userId),
    tagIds: formData.value.tagIds.map(Number),
    views: Number(formData.value.views)
  }

  if (isEdit.value && props.post) {
    updateMutation.mutate({ id: props.post.id, data: payload })
  } else {
    createMutation.mutate(payload)
  }
}
</script>
