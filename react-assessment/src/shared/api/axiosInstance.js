import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: inject auth token for admin endpoints only
apiClient.interceptors.request.use((config) => {
  if (config.url && config.url.includes('/admin')) {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor: auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const tokenUrl = import.meta.env.VITE_KEYCLOAK_TOKEN_URL
        const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID
        const clientSecret = import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET

        const params = new URLSearchParams()
        params.append('grant_type', 'refresh_token')
        params.append('client_id', clientId)
        params.append('client_secret', clientSecret)
        params.append('refresh_token', refreshToken)

        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params,
        })

        if (!response.ok) throw new Error('Refresh failed')

        const data = await response.json()
        localStorage.setItem('access_token', data.access_token)
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token)
        }

        // Retry the original request with new token
        return apiClient(originalRequest)
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)
