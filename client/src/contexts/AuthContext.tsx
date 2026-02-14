import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { AuthUser, AuthState } from '@/types'
import { authApi } from '@/lib/api'

interface AuthContextType extends AuthState {
  login: () => void
  logout: () => void
  checkAuth: () => Promise<void>
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_FAILURE' }
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
    case 'AUTH_START':
    case 'CHECK_AUTH_START':
      return { ...state, loading: true }
    case 'AUTH_SUCCESS':
    case 'CHECK_AUTH_SUCCESS':
      return {
        user: action.payload,
        loading: false,
        isAuthenticated: true,
      }
    case 'AUTH_FAILURE':
    case 'CHECK_AUTH_FAILURE':
      return {
        user: null,
        loading: false,
        isAuthenticated: false,
      }
    case 'LOGOUT':
      return {
        user: null,
        loading: false,
        isAuthenticated: false,
      }
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
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    window.location.href = `${apiUrl}/auth/google`
  }

  const logout = async () => {
    try {
      await authApi.logout()
      dispatch({ type: 'LOGOUT' })
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const checkAuth = async () => {
    dispatch({ type: 'CHECK_AUTH_START' })
    try {
      const response = await authApi.me()
      if (response.success && response.data) {
        dispatch({ type: 'CHECK_AUTH_SUCCESS', payload: response.data })
      } else {
        dispatch({ type: 'CHECK_AUTH_FAILURE' })
      }
    } catch (error) {
      dispatch({ type: 'CHECK_AUTH_FAILURE' })
    }
  }

  useEffect(() => {
    // Only check auth on initial mount
    const controller = new AbortController()
    
    const checkAuthAsync = async () => {
      try {
        const response = await authApi.me()
        if (response.success && response.data) {
          dispatch({ type: 'CHECK_AUTH_SUCCESS', payload: response.data })
        } else {
          dispatch({ type: 'CHECK_AUTH_FAILURE' })
        }
      } catch (error) {
        // Silent failure - don't dispatch to prevent infinite loops
        console.log('Auth check failed:', error)
      }
    }

    checkAuthAsync()

    return () => {
      controller.abort()
    }
  }, [])

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
