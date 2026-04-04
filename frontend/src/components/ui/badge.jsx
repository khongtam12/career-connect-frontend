import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

/**
 * Badge — Phase 2 UI Primitive
 * Compact label for status, counts, tags.
 */
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'rounded-full font-medium',
    'border transition-colors duration-150',
    'select-none',
  ],
  {
    variants: {
      variant: {
        default:     'bg-primary/10 text-primary border-primary/20',
        secondary:   'bg-secondary text-secondary-foreground border-border',
        outline:     'bg-transparent text-foreground border-border',
        success:     'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning:     'bg-amber-50 text-amber-700 border-amber-200',
        destructive: 'bg-red-50 text-red-700 border-red-200',
        muted:       'bg-muted text-muted-foreground border-border/50',
      },
      size: {
        sm:      'text-xs  px-2   py-0.5',
        default: 'text-xs  px-2.5 py-1',
        md:      'text-sm  px-3   py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Badge({ className, variant, size, ...props }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
