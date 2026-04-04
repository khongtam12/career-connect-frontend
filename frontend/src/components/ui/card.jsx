import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

/**
 * Card — Phase 2 UI Primitive
 * Zero inline styles. Tailwind + cva variants.
 */
const cardVariants = cva(
  'rounded-2xl border text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default:  'bg-card border-border shadow-soft-sm',
        flat:     'bg-secondary border-border/50',
        glass:    'glass shadow-soft-sm',
        elevated: 'bg-card border-border shadow-soft-md',
        ghost:    'bg-transparent border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Card({ className, variant, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col gap-1.5 px-7 pt-7', className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn('font-semibold leading-tight tracking-tight text-foreground', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground leading-relaxed', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-7 py-5', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-7 pb-7 pt-0 gap-3', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
}
