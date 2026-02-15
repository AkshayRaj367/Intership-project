import axios, { AxiosResponse } from 'axios'
import { ApiResponse, AuthUser, Contact, ContactFormData, PaginationResponse } from '@/types'

// Use fallback if environment variable is not available
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Temporarily disable automatic redirect to prevent infinite reload
    // if (error.response?.status === 401) {
    //   // Clear token and redirect to login
    //   localStorage.removeItem('auth_token')
    //   window.location.href = '/login'
    // }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  me: async (): Promise<ApiResponse<AuthUser>> => {
    const response = await api.get('/auth/me')
    return response.data
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}

// Contact API
export const contactApi = {
  submit: async (data: ContactFormData): Promise<ApiResponse<Contact>> => {
    const response = await api.post('/contact', data)
    return response.data
  },

  getAll: async (params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<ApiResponse<PaginationResponse<Contact>>> => {
    const response = await api.get('/contact', { params })
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<Contact>> => {
    const response = await api.get(`/contact/${id}`)
    return response.data
  },

  updateStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<Contact>> => {
    const response = await api.patch(`/contact/${id}/status`, { status })
    return response.data
  },

  update: async (
    id: string,
    data: Partial<ContactFormData & { status?: string }>
  ): Promise<ApiResponse<Contact>> => {
    const response = await api.put(`/contact/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/contact/${id}`)
    return response.data
  },

  getStats: async (): Promise<ApiResponse<{
    total: number
    new: number
    read: number
    replied: number
    archived: number
    unread: number
    last30Days: number
  }>> => {
    const response = await api.get('/contact/stats')
    return response.data
  },

  export: async (): Promise<Blob> => {
    const response = await api.get('/contact/export', {
      responseType: 'blob',
    })
    return response.data
  },
}

// Health check API
export const healthApi = {
  check: async (): Promise<ApiResponse> => {
    const response = await api.get('/health')
    return response.data
  },
}

export default api
