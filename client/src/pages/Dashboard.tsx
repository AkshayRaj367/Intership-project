import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/contexts/AuthContext'
import { User, Mail, Phone, MessageSquare, TrendingUp, Calendar, Download, Search, Filter, Wifi, WifiOff } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Contact } from '@/types'
import { toast } from 'sonner'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useContacts } from '@/hooks/useContacts'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore()
  const { 
    contacts, 
    stats, 
    loading, 
    isConnected, 
    updateStatus: handleStatusUpdate,
    exportContacts: handleExport,
  } = useContacts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#202124]">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-sm sm:text-base text-[#5f6368] mt-1">
                Manage your contacts and track your business growth
              </p>
            </div>
            
            <div className="flex gap-2 items-center flex-wrap">
              {/* Real-time connection indicator */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isConnected 
                  ? 'bg-[#e6f4ea] text-[#34a853]' 
                  : 'bg-[#fce8e6] text-[#ea4335]'
              }`}>
                {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isConnected ? 'Live' : 'Offline'}
              </div>
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
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
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
                      onChange={(e) => setSearchTerm(e.target.value)}
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

              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-[#e8eaed]">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Name</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Email</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Subject</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#5f6368] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact._id} className="border-b border-[#f1f3f4] hover:bg-[#f8f9fa] transition-colors duration-150">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#e8f0fe] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              <span className="text-[#1a73e8] text-sm font-medium">
                                {contact.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm text-[#202124] font-medium truncate">{contact.name}</span>
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
    </div>
  )
}

export default Dashboard
