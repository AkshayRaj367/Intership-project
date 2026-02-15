import { useState, useEffect, useCallback } from 'react'
import { Contact } from '@/types'
import { contactApi } from '@/lib/api'
import { useSocket } from './useSocket'
import { toast } from 'sonner'

interface ContactStats {
  total: number
  new: number
  read: number
  replied: number
  archived: number
  unread: number
  last30Days: number
}

interface UseContactsReturn {
  contacts: Contact[]
  stats: ContactStats | null
  loading: boolean
  error: string | null
  isConnected: boolean
  refetch: () => Promise<void>
  updateStatus: (contactId: string, newStatus: string) => Promise<void>
  deleteContact: (contactId: string) => Promise<void>
  exportContacts: () => Promise<void>
}

const defaultStats: ContactStats = {
  total: 0,
  new: 0,
  read: 0,
  replied: 0,
  archived: 0,
  unread: 0,
  last30Days: 0,
}

export const useContacts = (): UseContactsReturn => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<ContactStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { socket, isConnected } = useSocket()

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [contactsResponse, statsResponse] = await Promise.all([
        contactApi.getAll(),
        contactApi.getStats(),
      ])

      if (contactsResponse.success && contactsResponse.data) {
        const paginatedData = contactsResponse.data as any
        setContacts(paginatedData.data || paginatedData)
      }

      if (statsResponse.success && statsResponse.data) {
        const statsData = Array.isArray(statsResponse.data) 
          ? statsResponse.data[0] 
          : statsResponse.data
        setStats(statsData || defaultStats)
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load contacts'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Poll for updates when socket is not connected (e.g. serverless deployment)
  useEffect(() => {
    if (isConnected) return // skip polling when socket is live
    const interval = setInterval(() => {
      fetchData()
    }, 15000) // poll every 15 seconds
    return () => clearInterval(interval)
  }, [isConnected, fetchData])

  // Listen for real-time events
  useEffect(() => {
    if (!socket) return

    const handleContactCreated = (data: { contact: Contact }) => {
      setContacts((prev) => {
        // Avoid duplicates
        if (prev.some((c) => c._id === data.contact._id)) return prev
        return [data.contact, ...prev]
      })
      // Increment stats
      setStats((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          total: prev.total + 1,
          new: prev.new + 1,
          last30Days: prev.last30Days + 1,
        }
      })
      toast.info(`New contact from ${data.contact.name}`, {
        description: data.contact.email,
      })
    }

    const handleContactUpdated = (data: { contact: Contact }) => {
      setContacts((prev) =>
        prev.map((c) => (c._id === data.contact._id ? data.contact : c))
      )
      // Refetch stats to be accurate
      contactApi.getStats().then((res) => {
        if (res.success && res.data) {
          const statsData = Array.isArray(res.data) ? res.data[0] : res.data
          setStats(statsData || defaultStats)
        }
      }).catch(() => {})
    }

    const handleContactDeleted = (data: { contactId: string }) => {
      setContacts((prev) => prev.filter((c) => c._id !== data.contactId))
      // Refetch stats
      contactApi.getStats().then((res) => {
        if (res.success && res.data) {
          const statsData = Array.isArray(res.data) ? res.data[0] : res.data
          setStats(statsData || defaultStats)
        }
      }).catch(() => {})
    }

    socket.on('contact:created', handleContactCreated)
    socket.on('contact:updated', handleContactUpdated)
    socket.on('contact:deleted', handleContactDeleted)

    return () => {
      socket.off('contact:created', handleContactCreated)
      socket.off('contact:updated', handleContactUpdated)
      socket.off('contact:deleted', handleContactDeleted)
    }
  }, [socket])

  // Update contact status
  const updateStatus = useCallback(async (contactId: string, newStatus: string) => {
    try {
      const response = await contactApi.updateStatus(contactId, newStatus)
      if (response.success) {
        // Optimistically update local state
        setContacts((prev) =>
          prev.map((c) =>
            c._id === contactId ? { ...c, status: newStatus as any } : c
          )
        )
        toast.success('Status updated successfully')
      }
    } catch (err) {
      toast.error('Failed to update status')
    }
  }, [])

  // Delete contact
  const deleteContact = useCallback(async (contactId: string) => {
    try {
      const response = await contactApi.delete(contactId)
      if (response.success) {
        setContacts((prev) => prev.filter((c) => c._id !== contactId))
        toast.success('Contact deleted')
      }
    } catch (err) {
      toast.error('Failed to delete contact')
    }
  }, [])

  // Export contacts
  const exportContacts = useCallback(async () => {
    try {
      const blob = await contactApi.export()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Contacts exported successfully')
    } catch (err) {
      toast.error('Failed to export contacts')
    }
  }, [])

  return {
    contacts,
    stats,
    loading,
    error,
    isConnected,
    refetch: fetchData,
    updateStatus,
    deleteContact,
    exportContacts,
  }
}

export default useContacts
