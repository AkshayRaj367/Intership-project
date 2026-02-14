import React from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Navbar from '@/components/layout/Footer'

const Login: React.FC = () => {
  const { login, loading } = useAuthStore()

  const handleGoogleLogin = () => {
    login()
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
            Welcome to TechFlow
          </h2>
          <p className="mt-2 text-center text-sm text-[#5f6368]">
            Sign in to access your dashboard and manage your account
          </p>
        </motion.div>

        <motion.div
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-[#dadce0]">
            <div className="space-y-6">
              <div>
                <Button
                  onClick={handleGoogleLogin}
                  loading={loading}
                  disabled={loading}
                  className="w-full flex items-center justify-center"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#dadce0]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#5f6368]">
                    Or continue with email
                  </span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-[#5f6368]">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-[#1a73e8] hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#1a73e8] hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1a73e8]">99.9%</div>
                  <div className="text-xs text-[#5f6368]">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#34a853]">24/7</div>
                  <div className="text-xs text-[#5f6368]">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#fbbc05]">SSL</div>
                  <div className="text-xs text-[#5f6368]">Security</div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-[#1a73e8] hover:text-[#1557b0] transition-colors duration-200"
            >
              ← Back to home
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
