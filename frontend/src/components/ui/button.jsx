import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Button — Phase 2 UI Primitive
 * Zero inline styles. All variants via Tailwind + cva.
 */
const buttonVariants = cva(
  // Base
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium text-sm rounded-xl',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40 disabled:select-none',
    'select-none cursor-pointer',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'shadow-soft-sm',
          'hover:brightness-110 hover:shadow-soft-md hover:-translate-y-px',
          'active:translate-y-0 active:brightness-95',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-slate-200 hover:-translate-y-px',
          'active:translate-y-0',
        ],
        outline: [
          'border border-border bg-transparent text-foreground',
          'hover:bg-secondary hover:border-slate-300 hover:-translate-y-px',
          'active:translate-y-0',
        ],
        ghost: [
          'bg-transparent text-muted-foreground',
          'hover:bg-secondary hover:text-foreground',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground',
          'shadow-soft-sm',
          'hover:brightness-110 hover:-translate-y-px',
          'active:translate-y-0',
        ],
        // "Soft" – subtle colored background
        soft: [
          'bg-accent text-accent-foreground',
          'hover:bg-primary/15 hover:-translate-y-px',
          'active:translate-y-0',
        ],
        // Dashed border — for "Add item" buttons
        dashed: [
          'border border-dashed border-primary/40 bg-primary/5 text-primary',
          'hover:border-primary/70 hover:bg-primary/10',
          'w-full',
        ],
        // Link style
        link: [
          'bg-transparent text-primary underline-offset-4',
          'hover:underline',
          'p-0 h-auto',
        ],
      },
      size: {
        xs:      'h-7  px-3   text-xs  gap-1.5',
        sm:      'h-8  px-3.5 text-xs  gap-1.5',
        default: 'h-9  px-4   text-sm  gap-2',
        md:      'h-10 px-5   text-sm  gap-2',
        lg:      'h-11 px-6   text-base gap-2.5',
        xl:      'h-12 px-7   text-base gap-3',
        icon:    'size-9  p-0',
        'icon-sm': 'size-8  p-0',
        'icon-xs': 'size-7  p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
