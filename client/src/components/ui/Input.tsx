import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { InputProps } from '@/types'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    placeholder, 
    type = 'text', 
    value, 
    onChange, 
    error, 
    disabled = false, 
    required = false, 
    className, 
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[#202124] mb-1"
          >
            {label}
            {required && <span className="text-[#d93025] ml-1">*</span>}
          </label>
        )}
        
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              'w-full px-3 py-2 border rounded-lg text-base transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error 
                ? 'border-[#d93025] focus:ring-[#d93025]' 
                : 'border-[#dadce0] hover:border-[#1a73e8]',
              className
            )}
            {...props}
          />
        </motion.div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-[#d93025] flex items-center gap-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
