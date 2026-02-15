import React, { forwardRef, useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

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
    const autoId = useId()
    const inputId = id || autoId

    return (
      <div className="space-y-1.5">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[#202124]"
          >
            {label}
            {required && <span className="text-[#d93025] ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'w-full px-3 py-2.5 border rounded-lg text-sm transition-all duration-200 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 focus:border-[#1a73e8]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'placeholder:text-[#9aa0a6]',
            error 
              ? 'border-[#d93025] focus:ring-[#d93025]/30 focus:border-[#d93025]' 
              : 'border-[#dadce0] hover:border-[#bdc1c6]',
            className
          )}
          {...props}
        />
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-[#d93025] mt-1"
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
