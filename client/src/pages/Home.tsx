import React from 'react'
import { motion } from 'framer-motion'
import Hero from '@/components/sections/Hero'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Features from '@/components/sections/Features'
import Contact from '@/components/sections/Contact'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default Home
