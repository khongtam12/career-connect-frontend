import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

/**
 * Input — Phase 2 UI Primitive
 * Zero inline styles. Tailwind-only.
 */
const inputVariants = cva(
  [
    // Base
    'flex w-full min-w-0 bg-white text-foreground',
    'placeholder:text-muted-foreground/60',
    'border border-input rounded-xl',
    'text-sm font-normal',
    'transition-all duration-150 ease-out',
    'outline-none',
    // Focus
    'focus:ring-2 focus:ring-ring/30 focus:border-primary',
    // Disabled
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
    // File input
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    // Invalid
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
  ],
  {
    variants: {
      size: {
        sm:      'h-8   px-3   text-xs',
        default: 'h-10  px-3.5 text-sm',
        md:      'h-11  px-4   text-sm',
        lg:      'h-12  px-4   text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

function Input({ className, type, inputSize = 'default', ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size: inputSize }), className)}
      {...props}
    />
  )
}

/**
 * Textarea — companion to Input, consistent styling
 */
function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex w-full min-w-0 bg-white text-foreground',
        'placeholder:text-muted-foreground/60',
        'border border-input rounded-xl',
        'px-3.5 py-2.5 text-sm',
        'resize-y leading-relaxed',
        'transition-all duration-150 ease-out',
        'outline-none',
        'focus:ring-2 focus:ring-ring/30 focus:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
        'aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  )
}

export { Input, Textarea, inputVariants }
