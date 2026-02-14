// User Types
export interface User {
  _id: string
  googleId: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthUser extends Omit<User, 'googleId' | 'isActive'> {}

// Contact Types
export interface Contact {
  _id: string
  name: string
  email: string
  subject: 'general' | 'demo' | 'support' | 'partnership'
  message: string
  userId?: string
  status: 'new' | 'read' | 'replied' | 'archived'
  ipAddress?: string
  userAgent?: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: any
  }
  message?: string
}

export interface PaginationResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface HealthCheck {
  success: boolean
  message: string
  timestamp: string
  environment: string
  uptime: number
  version: string
  database: {
    status: string
    responseTime: number
  }
}

// Form Types
export interface ContactFormData {
  name: string
  email: string
  subject: 'general' | 'demo' | 'support' | 'partnership'
  message: string
}

export interface LoginResponse {
  user: AuthUser
  token: string
}

// UI State Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps {
  label?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  id?: string
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
}

// Navigation Types
export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  requiresAuth?: boolean
  adminOnly?: boolean
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

// Error Types
export interface AppError {
  message: string
  code?: string
  status?: number
  details?: any
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
