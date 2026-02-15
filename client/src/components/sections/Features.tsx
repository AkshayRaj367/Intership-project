import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MessageSquare, BarChart3, Globe, UserCheck, Download, Shield } from 'lucide-react'
import Card from '@/components/ui/Card'

const Features: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: MessageSquare,
      title: 'Contact Forms',
      description: 'Collect customer inquiries through a clean, validated contact form — every submission is saved and tracked automatically.',
      color: 'text-[#1a73e8]',
      bgColor: 'bg-[#e8f0fe]',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Dashboard',
      description: 'See new contacts appear instantly via WebSocket. Monitor stats like total, new, read, and replied — all live.',
      color: 'text-[#34a853]',
      bgColor: 'bg-[#e6f4ea]',
    },
    {
      icon: UserCheck,
      title: 'Google & Email Auth',
      description: 'Sign up with email/password or one-click Google OAuth. JWT-based sessions keep your account secure.',
      color: 'text-[#fbbc05]',
      bgColor: 'bg-[#fef7e0]',
    },
    {
      icon: Globe,
      title: 'Status Management',
      description: 'Mark contacts as new, read, replied, or archived. Filter and search to find exactly what you need.',
      color: 'text-[#ea4335]',
      bgColor: 'bg-[#fce8e6]',
    },
    {
      icon: Download,
      title: 'CSV Export',
      description: 'Export your entire contact list to CSV with one click — ready for spreadsheets, CRMs, or further analysis.',
      color: 'text-[#9333ea]',
      bgColor: 'bg-[#f3e8ff]',
    },
    {
      icon: Shield,
      title: 'Secure & Rate-Limited',
      description: 'Built with Helmet, CORS, input sanitization, and rate limiting to protect against abuse and attacks.',
      color: 'text-[#0f9d58]',
      bgColor: 'bg-[#e6f4ea]',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section id="features" className="py-12 sm:py-20 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-[#202124] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything You Need to
            <span className="text-[#1a73e8]"> Manage Contacts</span>
          </motion.h2>
          
          <motion.p
            className="text-lg sm:text-xl text-[#5f6368] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From collecting inquiries to tracking responses — TechFlow gives you 
            a complete toolkit to stay on top of every customer conversation.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              custom={index}
            >
              <Card 
                hover={true}
                className="h-full p-8 text-center group"
              >
                <motion.div
                  className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-[#202124] mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-[#5f6368] leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-[#1a73e8] to-[#4285f4] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Streamline Your Contacts?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Create a free account, set up your contact form, and start receiving 
              inquiries on your real-time dashboard in under a minute.
            </p>
            <motion.button
              className="bg-white text-[#1a73e8] px-6 py-3 rounded-lg font-semibold hover:bg-[#f8f9fa] transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById('contact')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
