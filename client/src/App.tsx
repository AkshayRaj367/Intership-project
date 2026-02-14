import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { useAuthStore } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

function App() {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/login" 
            element={
              user ? <Home /> : <Login />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Home /> : <Login />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
