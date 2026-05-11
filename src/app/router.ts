import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AdminDashboard from '@/views/AdminDashboard.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: AdminDashboard
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('@/views/PostsView.vue')
  },
  {
    path: '/comments',
    name: 'Comments',
    component: () => import('@/views/CommentsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
