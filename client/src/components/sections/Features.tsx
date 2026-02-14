import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Zap, Shield, Globe, Headphones, Cpu, Lock } from 'lucide-react'
import Card from '@/components/ui/Card'

const Features: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience blazing-fast performance with our optimized infrastructure and cutting-edge technology.',
      color: 'text-[#fbbc05]',
      bgColor: 'bg-[#fef7e0]',
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      description: 'Enterprise-grade security with end-to-end encryption and advanced threat protection.',
      color: 'text-[#34a853]',
      bgColor: 'bg-[#e6f4ea]',
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Deploy worldwide with our distributed network and automatic scaling capabilities.',
      color: 'text-[#1a73e8]',
      bgColor: 'bg-[#e8f0fe]',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock expert support to help you succeed at every step of your journey.',
      color: 'text-[#ea4335]',
      bgColor: 'bg-[#fce8e6]',
    },
    {
      icon: Cpu,
      title: 'Smart Analytics',
      description: 'Powerful insights and analytics to help you make data-driven decisions.',
      color: 'text-[#9333ea]',
      bgColor: 'bg-[#f3e8ff]',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data is yours. We never sell or share your information with third parties.',
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
    <section id="features" className="py-20 bg-[#f8f9fa]">
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
            className="text-4xl font-bold text-[#202124] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Powerful Features for
            <span className="text-[#1a73e8]"> Modern Teams</span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-[#5f6368] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Everything you need to build, deploy, and scale amazing products. 
            Our platform is designed to grow with your business.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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
              Ready to Get Started?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join thousands of teams already using TechFlow to build amazing products. 
              Start your free trial today.
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
