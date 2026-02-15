import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Footer: React.FC = () => {
  const navigate = useNavigate()

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const footerLinks = {
    product: [
      { label: 'Features', href: '#features', isSection: true },
      { label: 'Pricing', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
    resources: [
      { label: 'Help Center', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'Partners', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'GDPR', href: '#' },
    ],
  }

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <footer className="bg-[#202124] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <motion.div
                className="flex items-center space-x-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-semibold">TechFlow</span>
              </motion.div>
              
              <motion.p
                className="text-[#9aa0a6] mb-6 max-w-xs"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Building the future of enterprise software with modern technology and exceptional design.
              </motion.p>

              {/* Social Links */}
              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-[#5f6368] rounded-lg flex items-center justify-center hover:bg-[#1a73e8] transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Link Sections */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * categoryIndex }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold mb-4 capitalize">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {links.map((link: any, linkIndex: number) => (
                    <li key={link.label}>
                      {link.isSection ? (
                        <motion.button
                          onClick={() => scrollToSection(link.href.replace('#', ''))}
                          className="text-[#9aa0a6] hover:text-white transition-colors duration-200 cursor-pointer"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.label}
                        </motion.button>
                      ) : (
                        <motion.a
                          href={link.href}
                          className="text-[#9aa0a6] hover:text-white transition-colors duration-200"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.label}
                        </motion.a>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#5f6368]">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 text-[#9aa0a6]">
              <span>© {new Date().getFullYear()} TechFlow.</span>
              <span>All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-2 text-[#9aa0a6]">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-[#ea4335] fill-current" />
              </motion.div>
              <span>by the TechFlow team</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
