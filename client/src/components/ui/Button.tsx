import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ButtonProps } from '@/types'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled = false, 
    className, 
    onClick,
    type = 'button',
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-[#1a73e8] text-white hover:bg-[#1557b0] focus:ring-[#1a73e8] shadow-sm hover:shadow-md',
      secondary: 'bg-white text-[#202124] border border-[#dadce0] hover:bg-[#f8f9fa] focus:ring-[#1a73e8] shadow-sm hover:shadow-md',
      outline: 'border border-[#1a73e8] text-[#1a73e8] hover:bg-[#1a73e8] hover:text-white focus:ring-[#1a73e8]',
      ghost: 'text-[#1a73e8] hover:bg-[#e8f0fe] focus:ring-[#1a73e8]',
      destructive: 'bg-[#d93025] text-white hover:bg-[#b52b21] focus:ring-[#d93025] shadow-sm hover:shadow-md',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
