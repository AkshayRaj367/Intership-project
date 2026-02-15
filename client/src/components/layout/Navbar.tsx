import * as React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const scrollToSection = useCallback((sectionId: string) => {
    const scroll = () => {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }

    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation and render
      setTimeout(scroll, 300)
    } else {
      scroll()
    }
    setIsMobileMenuOpen(false)
  }, [location.pathname, navigate])

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false)
    await logout()
  }

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#e8eaed]'
            : 'bg-white/80 backdrop-blur-sm'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center group-hover:shadow-md transition-shadow duration-200">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-semibold text-[#202124]">
                TechFlow
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => {
                  if (location.pathname !== '/') {
                    navigate('/')
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                  setIsMobileMenuOpen(false)
                }}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  location.pathname === '/'
                    ? 'text-[#1a73e8] bg-[#e8f0fe]'
                    : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
                )}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="px-3 py-2 rounded-md text-sm font-medium text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors duration-200"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-3 py-2 rounded-md text-sm font-medium text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors duration-200"
              >
                Contact
              </button>
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#f1f3f4] transition-colors duration-200"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-[#e8eaed]"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-[#1a73e8] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-[#202124] max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-[#5f6368] transition-transform duration-200',
                        isProfileDropdownOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e8eaed] py-1 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="px-4 py-3 border-b border-[#e8eaed]">
                          <p className="text-sm font-medium text-[#202124] truncate">{user.name}</p>
                          <p className="text-xs text-[#5f6368] truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#202124] hover:bg-[#f1f3f4] transition-colors duration-200"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#5f6368]" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#d93025] hover:bg-[#fce8e6] transition-colors duration-200 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-[#1a73e8] hover:bg-[#e8f0fe] rounded-md transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#5f6368] hover:bg-[#f1f3f4] transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-white border-t border-[#e8eaed] shadow-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-3 space-y-1">
                <button
                  className={cn(
                    'block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200',
                    location.pathname === '/'
                      ? 'text-[#1a73e8] bg-[#e8f0fe]'
                      : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                  )}
                  onClick={() => {
                    if (location.pathname !== '/') {
                      navigate('/')
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#5f6368] hover:bg-[#f1f3f4] transition-colors duration-200"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#5f6368] hover:bg-[#f1f3f4] transition-colors duration-200"
                >
                  Contact
                </button>
                
                <div className="pt-3 mt-2 border-t border-[#e8eaed]">
                  {isAuthenticated && user ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-3 py-2.5">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-[#1a73e8] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#202124] truncate">{user.name}</p>
                          <p className="text-xs text-[#5f6368] truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#202124] hover:bg-[#f1f3f4] transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#5f6368]" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#d93025] hover:bg-[#fce8e6] transition-colors duration-200 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/login"
                        className="block px-3 py-2.5 rounded-lg text-sm font-medium text-center text-[#1a73e8] border border-[#1a73e8] hover:bg-[#e8f0fe] transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-3 py-2.5 rounded-lg text-sm font-medium text-center text-white bg-[#1a73e8] hover:bg-[#1557b0] transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}

export default Navbar
