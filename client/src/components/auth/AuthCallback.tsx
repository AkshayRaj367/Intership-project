import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginWithToken } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      toast.error('Authentication failed. Please try again.')
      navigate('/login', { replace: true })
      return
    }

    if (token) {
      loginWithToken(token)
        .then(() => {
          toast.success('Signed in successfully!')
          navigate('/dashboard', { replace: true })
        })
        .catch(() => {
          toast.error('Authentication failed. Please try again.')
          navigate('/login', { replace: true })
        })
    } else {
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate, loginWithToken])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-[#5f6368]">Completing sign in...</p>
      </div>
    </div>
  )
}

export default AuthCallback
