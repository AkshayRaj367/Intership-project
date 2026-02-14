import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const Navbar: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '#features' },
    { label: 'Contact', to: '#contact' },
  ]

  const handleLogin = () => {
    login()
  }

  const handleLogout = async () => {
    await logout()
    setIsProfileDropdownOpen(false)
  }

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-[#dadce0]'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-semibold text-[#202124]">
                  TechFlow
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="text-[#5f6368] hover:text-[#1a73e8] transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#f8f9fa] transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-[#1a73e8] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-[#202124] font-medium">
                      {user.name}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-[#5f6368] transition-transform duration-200',
                        isProfileDropdownOpen && 'rotate-180'
                      )}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#dadce0] py-2"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to="/"
                          className="flex items-center space-x-2 px-4 py-2 text-[#202124] hover:bg-[#f8f9fa] transition-colors duration-200"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Home</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-[#d93025] hover:bg-[#fef2f2] transition-colors duration-200 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/register"
                    className="text-[#5f6368] hover:text-[#1a73e8] transition-colors duration-200 font-medium"
                  >
                    Sign up
                  </Link>
                  <Button
                    onClick={handleLogin}
                    className="flex items-center space-x-2"
                  >
                    <span>Sign up/Login</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-[#5f6368] hover:bg-[#f8f9fa] transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-white border-t border-[#dadce0]"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="block text-[#5f6368] hover:text-[#1a73e8] transition-colors duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {!isAuthenticated ? (
                  <Button
                    onClick={handleLogin}
                    className="w-full justify-center"
                  >
                    Sign up/Login
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-[#f8f9fa] rounded-lg">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-[#1a73e8] rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="text-[#202124] font-medium">
                        {user.name}
                      </span>
                    </div>
                    <Link
                      to="/"
                      className="block text-[#202124] hover:bg-[#f8f9fa] transition-colors duration-200 font-medium p-3 rounded-lg"
                    >
                      Home
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-[#d93025] hover:bg-[#fef2f2] transition-colors duration-200 font-medium p-3 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
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
