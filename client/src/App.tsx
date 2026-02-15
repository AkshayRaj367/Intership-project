import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import AuthCallback from '@/components/auth/AuthCallback'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuthStore } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const AUTH_PATHS = ['/login', '/register', '/auth-callback']

function App() {
  const { user, loading } = useAuthStore()
  const location = useLocation()
  const isAuthPage = AUTH_PATHS.includes(location.pathname)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/auth-callback" element={<AuthCallback />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

export default App
