import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { AuthUser, AuthState } from '@/types'
import { authApi } from '@/lib/api'

interface AuthContextType extends AuthState {
  login: () => void
  logout: () => void
  checkAuth: () => Promise<void>
  loginWithToken: (token: string) => Promise<void>
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'CHECK_AUTH_START' }
  | { type: 'CHECK_AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'CHECK_AUTH_FAILURE' }

const initialState: AuthState = {
  user: null,
  loading: false,
  isAuthenticated: false,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true }
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, isAuthenticated: true, user: action.payload }
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, isAuthenticated: false, user: null }
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null }
    case 'CHECK_AUTH_START':
      return { ...state, loading: true }
    case 'CHECK_AUTH_SUCCESS':
      return { ...state, loading: false, isAuthenticated: true, user: action.payload }
    case 'CHECK_AUTH_FAILURE':
      return { ...state, loading: false, isAuthenticated: false, user: null }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthStore = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthStore must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { ...initialState, loading: true })

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      checkAuth()
    } else {
      dispatch({ type: 'CHECK_AUTH_FAILURE' })
    }
  }, [])

  const login = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    window.location.href = `${apiUrl}/auth/google`
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
    }
    dispatch({ type: 'LOGOUT' })
    localStorage.removeItem('auth_token')
    window.location.href = '/'
  }

  const checkAuth = async () => {
    dispatch({ type: 'CHECK_AUTH_START' })
    try {
      const response = await authApi.me()
      if (response.success && response.data) {
        dispatch({ type: 'CHECK_AUTH_SUCCESS', payload: response.data })
      } else {
        dispatch({ type: 'CHECK_AUTH_FAILURE' })
        localStorage.removeItem('auth_token')
      }
    } catch (error) {
      dispatch({ type: 'CHECK_AUTH_FAILURE' })
      localStorage.removeItem('auth_token')
    }
  }

  const loginWithToken = async (token: string) => {
    localStorage.setItem('auth_token', token)
    await checkAuth()
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
    loginWithToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
