import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/contexts/AuthContext'
import { 
  User, Mail, MessageSquare, TrendingUp, Download, Search, 
  Wifi, WifiOff, Trash2, Edit3, ChevronDown, ChevronUp, Plus, X, Eye
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Contact } from '@/types'
import { toast } from 'sonner'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useContacts } from '@/hooks/useContacts'
import { contactApi } from '@/lib/api'

// ─── Modal Wrapper ────────────────────────────────────────────
const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ open, onClose, title, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8eaed]">
          <h3 className="text-lg font-semibold text-[#202124]">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#f1f3f4] transition-colors">
            <X className="w-5 h-5 text-[#5f6368]" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  )
}

// ─── Create / Edit Contact Form ───────────────────────────────
type SubjectType = 'general' | 'demo' | 'support' | 'partnership'
type StatusType = 'new' | 'read' | 'replied' | 'archived'

interface ContactFormData {
  name: string
  email: string
  subject: SubjectType
  message: string
  status?: StatusType
}

interface ContactFormProps {
  initial?: Partial<Contact>
  onSubmit: (data: ContactFormData) => Promise<void>
  onCancel: () => void
  isEdit?: boolean
}

const ContactForm: React.FC<ContactFormProps> = ({ initial, onSubmit, onCancel, isEdit }) => {
  const [name, setName] = useState(initial?.name || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [subject, setSubject] = useState<SubjectType>(initial?.subject || 'general')
  const [message, setMessage] = useState(initial?.message || '')
  const [status, setStatus] = useState<StatusType>(initial?.status || 'new')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    if (message.trim().length < 10) {
      toast.error('Message must be at least 10 characters')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), subject, message: message.trim(), ...(isEdit ? { status } : {}) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#202124] mb-1">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent"
          placeholder="Contact name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#202124] mb-1">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent"
          placeholder="email@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#202124] mb-1">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value as SubjectType)}
          className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent"
        >
          <option value="general">General</option>
          <option value="demo">Demo</option>
          <option value="support">Support</option>
          <option value="partnership">Partnership</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#202124] mb-1">Message *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent resize-none"
          placeholder="Enter your message (min 10 characters)"
          required
        />
        <p className="text-xs text-[#5f6368] mt-1">{message.length}/1000 characters</p>
      </div>
      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-[#202124] mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusType)}
            className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent"
          >
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-[#5f6368] bg-white border border-[#dadce0] rounded-lg hover:bg-[#f1f3f4] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm font-medium text-white bg-[#1a73e8] rounded-lg hover:bg-[#1557b0] disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Saving...' : isEdit ? 'Update Contact' : 'Create Contact'}
        </button>
      </div>
    </form>
  )
}

// ─── View Message Modal ───────────────────────────────────────
const ViewMessageModal: React.FC<{ contact: Contact | null; open: boolean; onClose: () => void }> = ({ contact, open, onClose }) => {
  if (!contact) return null
  return (
    <Modal open={open} onClose={onClose} title="Contact Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-[#5f6368] uppercase">Name</p>
            <p className="text-sm text-[#202124] mt-1">{contact.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#5f6368] uppercase">Email</p>
            <p className="text-sm text-[#1a73e8] mt-1">{contact.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#5f6368] uppercase">Subject</p>
            <p className="text-sm text-[#202124] capitalize mt-1">{contact.subject}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#5f6368] uppercase">Status</p>
            <p className="text-sm capitalize mt-1">{contact.status}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#5f6368] uppercase">Submitted</p>
            <p className="text-sm text-[#202124] mt-1">{new Date(contact.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-[#5f6368] uppercase mb-2">Message</p>
          <div className="bg-[#f8f9fa] rounded-lg p-4 border border-[#e8eaed]">
            <p className="text-sm text-[#202124] whitespace-pre-wrap leading-relaxed">{contact.message}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ─── Delete Confirmation Modal ────────────────────────────────
const DeleteConfirmModal: React.FC<{ contact: Contact | null; open: boolean; onClose: () => void; onConfirm: () => void; deleting: boolean }> = ({ contact, open, onClose, onConfirm, deleting }) => {
  if (!contact) return null
  return (
    <Modal open={open} onClose={onClose} title="Delete Contact">
      <div className="space-y-4">
        <p className="text-sm text-[#5f6368]">
          Are you sure you want to delete the contact from <strong className="text-[#202124]">{contact.name}</strong> ({contact.email})? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#5f6368] bg-white border border-[#dadce0] rounded-lg hover:bg-[#f1f3f4] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#ea4335] rounded-lg hover:bg-[#d33426] disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Dashboard ────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore()
  const { 
    contacts, 
    stats, 
    loading, 
    isConnected, 
    updateStatus: handleStatusUpdate,
    updateContact: handleUpdateContact,
    deleteContact: handleDeleteContact,
    exportContacts: handleExport,
    refetch,
  } = useContacts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Modal state
  const [createOpen, setCreateOpen] = useState(false)
  const [editContact, setEditContact] = useState<Contact | null>(null)
  const [viewContact, setViewContact] = useState<Contact | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  const handleCreate = async (data: ContactFormData) => {
    try {
      const response = await contactApi.submit(data as any)
      if (response.success) {
        toast.success('Contact created successfully')
        setCreateOpen(false)
        refetch()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to create contact')
    }
  }

  const handleEdit = async (data: ContactFormData) => {
    if (!editContact) return
    await handleUpdateContact(editContact._id, data)
    setEditContact(null)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await handleDeleteContact(deleteTarget._id)
    setDeleting(false)
    setDeleteTarget(null)
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
                onClick={() => setCreateOpen(true)}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Contact
              </Button>
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
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#e8eaed]">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#5f6368] uppercase tracking-wider w-8"></th>
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
                      <React.Fragment key={contact._id}>
                        <tr className="border-b border-[#f1f3f4] hover:bg-[#f8f9fa] transition-colors duration-150">
                          {/* Expand toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setExpandedId(expandedId === contact._id ? null : contact._id)}
                              className="p-1 rounded hover:bg-[#e8eaed] transition-colors"
                              title="Toggle message"
                            >
                              {expandedId === contact._id 
                                ? <ChevronUp className="w-4 h-4 text-[#5f6368]" />
                                : <ChevronDown className="w-4 h-4 text-[#5f6368]" />
                              }
                            </button>
                          </td>
                          {/* Name */}
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
                          {/* Email */}
                          <td className="py-3 px-4">
                            <span className="text-sm text-[#1a73e8]">{contact.email}</span>
                          </td>
                          {/* Subject */}
                          <td className="py-3 px-4">
                            <span className="text-sm text-[#202124] capitalize">{contact.subject}</span>
                          </td>
                          {/* Status */}
                          <td className="py-3 px-4">
                            <select
                              value={contact.status}
                              onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                              className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1a73e8] ${statusColors[contact.status as keyof typeof statusColors]}`}
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          {/* Date */}
                          <td className="py-3 px-4">
                            <span className="text-[#5f6368] text-sm">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setViewContact(contact)}
                                className="p-1.5 rounded-lg hover:bg-[#e8f0fe] text-[#1a73e8] transition-colors"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditContact(contact)}
                                className="p-1.5 rounded-lg hover:bg-[#e8f0fe] text-[#1a73e8] transition-colors"
                                title="Edit contact"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(contact)}
                                className="p-1.5 rounded-lg hover:bg-[#fce8e6] text-[#ea4335] transition-colors"
                                title="Delete contact"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Expanded message row */}
                        <AnimatePresence>
                          {expandedId === contact._id && (
                            <tr>
                              <td colSpan={7} className="p-0">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-8 py-4 bg-[#f8f9fa] border-b border-[#e8eaed]">
                                    <p className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider mb-2">Message</p>
                                    <p className="text-sm text-[#202124] whitespace-pre-wrap leading-relaxed">
                                      {contact.message}
                                    </p>
                                    <p className="text-xs text-[#5f6368] mt-3">
                                      Submitted on {new Date(contact.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>

                {filteredContacts.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-[#5f6368] mx-auto mb-4" />
                    <p className="text-[#5f6368]">No contacts found</p>
                    <button
                      onClick={() => setCreateOpen(true)}
                      className="mt-3 text-sm text-[#1a73e8] hover:underline"
                    >
                      Create your first contact
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </main>

      {/* ── Modals ──────────────────────────────────────── */}

      {/* Create Contact Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Contact">
        <ContactForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Edit Contact Modal */}
      <Modal open={!!editContact} onClose={() => setEditContact(null)} title="Edit Contact">
        {editContact && (
          <ContactForm
            initial={editContact}
            onSubmit={handleEdit}
            onCancel={() => setEditContact(null)}
            isEdit
          />
        )}
      </Modal>

      {/* View Message Modal */}
      <ViewMessageModal
        contact={viewContact}
        open={!!viewContact}
        onClose={() => setViewContact(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        contact={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        deleting={deleting}
      />
    </div>
  )
}

export default Dashboard
