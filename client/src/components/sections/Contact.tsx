import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { contactApi } from '@/lib/api'
import { toast } from 'sonner'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.enum(['general', 'demo', 'support', 'partnership'], {
    required_error: 'Please select a subject',
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message cannot exceed 1000 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const Contact: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      await contactApi.submit(data)
      setIsSubmitted(true)
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      reset()
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@techflow.com',
      description: 'Send us an email anytime',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm',
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'San Francisco, CA',
      description: 'Come say hello at our office',
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
    <section id="contact" className="py-20 bg-white">
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
            Get in
            <span className="text-[#1a73e8]"> Touch</span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-[#5f6368] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Have a question? Want to see a demo? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <Card className="p-8">
              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 bg-[#e6f4ea] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-[#34a853]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#202124] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[#5f6368]">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <Input
                      label="Name"
                      placeholder="John Doe"
                      {...register('name')}
                      error={errors.name?.message}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Input
                      label="Email"
                      type="email"
                      placeholder="john@example.com"
                      {...register('email')}
                      error={errors.email?.message}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#202124]">
                        Subject <span className="text-[#d93025]">*</span>
                      </label>
                      <select
                        {...register('subject')}
                        className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="demo">Request a Demo</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership Opportunity</option>
                      </select>
                      {errors.subject?.message && (
                        <p className="text-sm text-[#d93025]">{errors.subject.message}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#202124]">
                        Message <span className="text-[#d93025]">*</span>
                      </label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        placeholder="Tell us more about your needs..."
                        className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent resize-none"
                      />
                      {errors.message?.message && (
                        <p className="text-sm text-[#d93025]">{errors.message.message}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </form>
              )}
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            ref={ref}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div>
              <h3 className="text-2xl font-semibold text-[#202124] mb-6">
                Other Ways to Reach Us
              </h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-[#e8f0fe] rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-[#1a73e8]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-[#202124] mb-1">
                        {info.title}
                      </h4>
                      <p className="text-[#1a73e8] font-medium mb-1">
                        {info.content}
                      </p>
                      <p className="text-[#5f6368] text-sm">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-[#202124] mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-[#202124] mb-2">
                    What industries do you serve?
                  </h4>
                  <p className="text-[#5f6368] text-sm">
                    We work with companies across all industries, from startups to Fortune 500 companies.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-[#202124] mb-2">
                    How quickly can I get started?
                  </h4>
                  <p className="text-[#5f6368] text-sm">
                    You can start immediately! Sign up for a free trial and be up and running in minutes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-[#202124] mb-2">
                    Do you offer custom solutions?
                  </h4>
                  <p className="text-[#5f6368] text-sm">
                    Yes! We offer custom enterprise solutions tailored to your specific needs.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
