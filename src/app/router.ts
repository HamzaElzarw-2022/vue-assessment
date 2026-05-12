import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/shared/stores/authStore'
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
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthRequired = to.meta.requiresAuth !== false // default to true unless explicitly false

  if (isAuthRequired && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
