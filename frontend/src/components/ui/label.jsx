import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Label — Phase 2 UI Primitive
 * Accessible form label with consistent typography.
 */
function Label({ className, required, children, ...props }) {
  return (
    <label
      data-slot="label"
      className={cn(
        'block text-xs font-semibold text-foreground/80 mb-1.5',
        'leading-none select-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-destructive" aria-label="required">*</span>
      )}
    </label>
  )
}

/**
 * FormField — wraps Label + Input + optional hint/error
 */
function FormField({ label, required, hint, error, className, children, ...props }) {
  return (
    <div data-slot="form-field" className={cn('flex flex-col', className)} {...props}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  )
}

export { Label, FormField }
