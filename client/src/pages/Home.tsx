import React from 'react'
import { motion } from 'framer-motion'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import Contact from '@/components/sections/Contact'

const Home: React.FC = () => {
  return (
    <div className="bg-white">
      <main>
        <Hero />
        <Features />
        <Contact />
      </main>
    </div>
  )
}

export default Home
