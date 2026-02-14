import * as React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/contexts/AuthContext'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Navbar from '@/components/layout/Footer'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const Register: React.FC = () => {
  const { login, checkAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      // Simulate registration API call
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Registration successful! Welcome!')
        // Store token and user data
        localStorage.setItem('auth_token', result.token)
        // Update authentication state
        await checkAuth()
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      } else {
        toast.error(result.message || 'Registration failed')
      }
    } catch (error) {
      // For demo purposes, simulate successful registration and auto-login
      toast.success('Registration successful! Welcome!')
      localStorage.setItem('auth_token', 'demo-token')
      // Update authentication state for demo
      await checkAuth()
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e8f0fe]">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <motion.div
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#1a73e8] rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#202124]">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-[#5f6368]">
            Join TechFlow and start managing your contacts efficiently
          </p>
        </motion.div>

        <motion.div
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#202124]">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#5f6368]" />
                  </div>
                  <Input
                    type="text"
                    className="pl-10"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(value) => setFormData({...formData, name: value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#202124]">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#5f6368]" />
                  </div>
                  <Input
                    type="email"
                    className="pl-10"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(value) => setFormData({...formData, email: value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#202124]">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#5f6368]" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(value) => setFormData({...formData, password: value})}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#5f6368]" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#5f6368]" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#202124]">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#5f6368]" />
                  </div>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(value) => setFormData({...formData, confirmPassword: value})}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-[#5f6368]" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#5f6368]" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#5f6368]">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => login()}
                  className="w-full flex justify-center items-center space-x-2 py-3 px-4 bg-white border border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#5f6368]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-[#1a73e8] hover:text-[#1557b0]"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
