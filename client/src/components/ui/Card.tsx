import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CardProps } from '@/types'

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false, 
  glass = false 
}) => {
  const baseStyles = 'rounded-lg border transition-all duration-300'
  
  const variantStyles = glass
    ? 'bg-white/80 backdrop-blur-md border-white/20 shadow-lg'
    : 'bg-white border-[#dadce0] shadow-sm'
  
  const hoverStyles = hover
    ? 'hover:shadow-lg hover:-translate-y-1 hover:border-[#1a73e8]'
    : ''

  return (
    <motion.div
      className={cn(
        baseStyles,
        variantStyles,
        hoverStyles,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02 } : {}}
    >
      {children}
    </motion.div>
  )
}

export const CardHeader: React.FC<{ 
  children: React.ReactNode
  className?: string 
}> = ({ children, className }) => (
  <div className={cn('p-6 pb-4', className)}>
    {children}
  </div>
)

export const CardContent: React.FC<{ 
  children: React.ReactNode
  className?: string 
}> = ({ children, className }) => (
  <div className={cn('p-6 pt-0', className)}>
    {children}
  </div>
)

export const CardFooter: React.FC<{ 
  children: React.ReactNode
  className?: string 
}> = ({ children, className }) => (
  <div className={cn('p-6 pt-4 border-t border-[#dadce0]', className)}>
    {children}
  </div>
)

export default Card
