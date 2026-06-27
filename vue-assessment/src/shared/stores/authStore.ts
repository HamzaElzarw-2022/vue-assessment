import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const isAuthPending = ref(false)
  const authError = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string) {
    isAuthPending.value = true
    authError.value = null

    try {
      const tokenUrl = import.meta.env.VITE_KEYCLOAK_TOKEN_URL
      const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID
      const clientSecret = import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET

      const params = new URLSearchParams()
      params.append('grant_type', 'password')
      params.append('client_id', clientId)
      params.append('client_secret', clientSecret)
      params.append('username', username)
      params.append('password', password)

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error_description || 'Invalid credentials or server error.')
      }

      const data = await response.json()
      
      token.value = data.access_token
      refreshToken.value = data.refresh_token
      
      localStorage.setItem('access_token', data.access_token)
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }

      return true
    } catch (error: any) {
      authError.value = error.message || 'An error occurred during login.'
      return false
    } finally {
      isAuthPending.value = false
    }
  }

  function logout() {
    token.value = null
    refreshToken.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) {
      logout()
      return false
    }

    try {
      const tokenUrl = import.meta.env.VITE_KEYCLOAK_TOKEN_URL
      const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID
      const clientSecret = import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET

      const params = new URLSearchParams()
      params.append('grant_type', 'refresh_token')
      params.append('client_id', clientId)
      params.append('client_secret', clientSecret)
      params.append('refresh_token', refreshToken.value)

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })

      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      
      token.value = data.access_token
      localStorage.setItem('access_token', data.access_token)
      
      if (data.refresh_token) {
        refreshToken.value = data.refresh_token
        localStorage.setItem('refresh_token', data.refresh_token)
      }

      return true
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    token,
    refreshToken,
    isAuthenticated,
    isAuthPending,
    authError,
    login,
    logout,
    refreshAccessToken
  }
})
