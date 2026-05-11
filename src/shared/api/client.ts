import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // From openapi.yml
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: Add interceptors for auth if needed
apiClient.interceptors.request.use((config) => {
  // Mocking auth for the "posts-admin" security scheme if needed
  // config.headers.Authorization = `Bearer fake-token`
  return config
})
