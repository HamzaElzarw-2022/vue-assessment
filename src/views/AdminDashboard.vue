<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p class="text-gray-500">Welcome back! Here's an overview of your platform.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Posts Stat -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
        <div class="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4">
          <FileTextIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Total Posts</p>
          <p class="text-2xl font-bold text-gray-900">{{ postsData?.data.totalItems || 0 }}</p>
        </div>
      </div>

      <!-- Comments Stat -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
        <div class="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-4">
          <MessageSquareIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Total Comments</p>
          <p class="text-2xl font-bold text-gray-900">{{ commentsData?.data.totalItems || 0 }}</p>
        </div>
      </div>

      <!-- Users Stat -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
        <div class="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
          <UsersIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Total Users</p>
          <p class="text-2xl font-bold text-gray-900">{{ usersData?.data.totalItems || 0 }}</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { FileText as FileTextIcon, MessageSquare as MessageSquareIcon, Users as UsersIcon } from 'lucide-vue-next'
import AdminLayout from '@/shared/components/AdminLayout.vue'
import { postsApi } from '@/features/posts/api'
import { commentsApi } from '@/features/comments/api'
import { usersApi } from '@/features/users/api'

const { data: postsData } = useQuery({
  queryKey: ['posts', 'count'],
  queryFn: () => postsApi.getAdminPosts({ size: 1 })
})

const { data: commentsData } = useQuery({
  queryKey: ['comments', 'count'],
  queryFn: () => commentsApi.getComments({ size: 1 })
})

const { data: usersData } = useQuery({
  queryKey: ['users', 'count'],
  queryFn: () => usersApi.getUsers({ size: 1 })
})
</script>
