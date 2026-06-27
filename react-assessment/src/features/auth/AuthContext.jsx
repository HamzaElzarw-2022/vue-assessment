import { createContext, useReducer, useCallback, useMemo } from 'react'
import { fetchToken, refreshTokenRequest } from './authApi'

const AuthContext = createContext(null)

const initialState = {
  token: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isAuthPending: false,
  authError: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isAuthPending: true, authError: null }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.access_token,
        refreshToken: action.payload.refresh_token,
        isAuthenticated: true,
        isAuthPending: false,
        authError: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthPending: false,
        authError: action.payload,
      }
    case 'TOKEN_REFRESHED':
      return {
        ...state,
        token: action.payload.access_token,
        refreshToken: action.payload.refresh_token ?? state.refreshToken,
      }
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        authError: null,
      }
    default:
      return state
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = useCallback(async (username, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const data = await fetchToken(username, password)
      localStorage.setItem('access_token', data.access_token)
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
      dispatch({ type: 'LOGIN_SUCCESS', payload: data })
      return true
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message || 'An error occurred during login.' })
      return false
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    dispatch({ type: 'LOGOUT' })
  }, [])

  const refreshAccessToken = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem('refresh_token')
    if (!currentRefreshToken) {
      logout()
      return false
    }
    try {
      const data = await refreshTokenRequest(currentRefreshToken)
      localStorage.setItem('access_token', data.access_token)
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
      dispatch({ type: 'TOKEN_REFRESHED', payload: data })
      return true
    } catch {
      logout()
      return false
    }
  }, [logout])

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    refreshAccessToken,
  }), [state, login, logout, refreshAccessToken])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
