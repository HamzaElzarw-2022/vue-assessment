import axios from 'axios'
import { useAuthStore } from '@/shared/stores/authStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  // Only inject token for admin endpoints
  if (config.url && config.url.includes('/admin')) {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // If error is 401 and it's not already a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const authStore = useAuthStore()
      
      const success = await authStore.refreshAccessToken()
      if (success) {
        // Retry the original request
        return apiClient(originalRequest)
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)
