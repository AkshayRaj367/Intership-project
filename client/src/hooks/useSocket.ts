import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/contexts/AuthContext'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      console.log('🔌 Socket connected:', socket.id)
      // Join the dashboard room for real-time updates
      socket.emit('join:dashboard')
      // Join user-specific room so events are scoped to this account
      if (user?._id) {
        socket.emit('join:user', user._id)
      }
    })

    socket.on('disconnect', (reason) => {
      setIsConnected(false)
      console.log('🔌 Socket disconnected:', reason)
    })

    socket.on('connect_error', (error) => {
      console.warn('🔌 Socket connection error:', error.message)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [user?._id])

  return {
    socket: socketRef.current,
    isConnected,
  }
}

export default useSocket
