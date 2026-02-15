import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Rocket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/contexts/AuthContext'

const Hero: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1.0],
      },
    },
  }

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/register')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-white via-[#f8f9fa] to-[#e8f0fe] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#1a73e8] rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={floatingVariants.floating}
          transition={{ delay: 0 }}
        />
        <motion.div
          className="absolute top-40 right-10 w-96 h-96 bg-[#34a853] rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={floatingVariants.floating}
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-[#fbbc05] rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={floatingVariants.floating}
          transition={{ delay: 2 }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-sm font-medium mb-6"
              variants={itemVariants}
            >
              <Zap className="w-4 h-4 mr-2" />
              Contact Management Made Simple
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#202124] mb-6 leading-tight"
              variants={itemVariants}
            >
              Manage Your
              <span className="text-[#1a73e8]"> Contacts </span>
              <br />
              In Real Time
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-[#5f6368] mb-8 max-w-2xl"
              variants={itemVariants}
            >
              TechFlow helps you collect, organize, and respond to customer inquiries 
              through a real-time dashboard. Track every contact, monitor your response 
              rate, and never miss a message.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              variants={itemVariants}
            >
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="flex items-center justify-center"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const element = document.getElementById('features')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <div className="flex items-center text-[#5f6368]">
                <Shield className="w-5 h-5 text-[#34a853] mr-2" />
                <span className="font-medium">Secure Auth</span>
              </div>
              <div className="flex items-center text-[#5f6368]">
                <Rocket className="w-5 h-5 text-[#1a73e8] mr-2" />
                <span className="font-medium">Real-Time Updates</span>
              </div>
              <div className="flex items-center text-[#5f6368]">
                <Zap className="w-5 h-5 text-[#fbbc05] mr-2" />
                <span className="font-medium">CSV Export</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Illustration (hidden on mobile) */}
          <motion.div
            className="relative hidden lg:block"
            variants={itemVariants}
          >
            <motion.div
              className="relative z-10"
              animate={{
                y: [-20, 20, -20],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Main Hero Graphic */}
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-[#1a73e8] to-[#4285f4] rounded-3xl shadow-2xl flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <motion.div
                      className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Rocket className="w-12 h-12 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">TechFlow</h3>
                    <p className="text-white/80">Contact Manager</p>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-[#dadce0]"
                  animate={{
                    y: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#34a853] rounded-full"></div>
                    <span className="text-sm font-medium text-[#202124]">Active</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-[#dadce0]"
                  animate={{
                    y: [10, -10, 10],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#1a73e8]">99.9%</div>
                    <div className="text-xs text-[#5f6368]">Uptime</div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -left-8 bg-white rounded-xl shadow-lg p-4 border border-[#dadce0]"
                  animate={{
                    x: [10, -10, 10],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.5,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#34a853]" />
                    <span className="text-xs font-medium text-[#202124]">Secured</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-6 h-10 border-2 border-[#1a73e8] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#1a73e8] rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
