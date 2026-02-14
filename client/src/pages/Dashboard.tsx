import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/contexts/AuthContext'
import { User, Mail, Phone, MessageSquare, TrendingUp, Calendar, Download, Search, Filter } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { contactApi } from '@/lib/api'
import { Contact, ApiResponse } from '@/types'
import { toast } from 'sonner'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch contacts and stats in parallel
      const [contactsResponse, statsResponse] = await Promise.all([
        contactApi.getAll(),
        contactApi.getStats()
      ])

      if (contactsResponse.success && contactsResponse.data) {
        setContacts(contactsResponse.data)
      }

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data)
      }
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (contactId: string, newStatus: string) => {
    try {
      const response = await contactApi.updateStatus(contactId, newStatus)
      if (response.success) {
        // Update local state
        setContacts(prev => 
          prev.map(contact => 
            contact._id === contactId 
              ? { ...contact, status: newStatus as any }
              : contact
          )
        )
        toast.success('Status updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleExport = async () => {
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
    } catch (error) {
      toast.error('Failed to export contacts')
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const statusColors = {
    new: 'bg-[#fef7e0] text-[#f59e0b]',
    read: 'bg-[#e8f0fe] text-[#1a73e8]',
    replied: 'bg-[#e6f4ea] text-[#34a853]',
    archived: 'bg-[#f3f4f6] text-[#6b7280]',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#202124]">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-[#5f6368] mt-1">
                Manage your contacts and track your business growth
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#5f6368]">Total Contacts</p>
                    <p className="text-2xl font-bold text-[#202124]">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#e8f0fe] rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-[#1a73e8]" />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#5f6368]">New Messages</p>
                    <p className="text-2xl font-bold text-[#202124]">{stats.new}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#fef7e0] rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-[#f59e0b]" />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#5f6368]">Replied</p>
                    <p className="text-2xl font-bold text-[#202124]">{stats.replied}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#e6f4ea] rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#34a853]" />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#5f6368]">Last 30 Days</p>
                    <p className="text-2xl font-bold text-[#202124]">{stats.last30Days}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#fce8e6] rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#ea4335]" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Contacts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#202124] mb-4 sm:mb-0">
                  Contact Messages
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5f6368]" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={setSearchTerm}
                      className="pl-10"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-[#dadce0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#dadce0]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#5f6368]">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#5f6368]">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#5f6368]">Subject</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#5f6368]">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#5f6368]">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#5f6368]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact._id} className="border-b border-[#dadce0] hover:bg-[#f8f9fa]">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#1a73e8] rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-medium">
                                {contact.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-[#202124] font-medium">{contact.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#1a73e8]">{contact.email}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#202124] capitalize">{contact.subject}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contact.status as keyof typeof statusColors]}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#5f6368] text-sm">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <select
                              value={contact.status}
                              onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                              className="text-sm border border-[#dadce0] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                              <option value="archived">Archived</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredContacts.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-[#5f6368] mx-auto mb-4" />
                    <p className="text-[#5f6368]">No contacts found</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
