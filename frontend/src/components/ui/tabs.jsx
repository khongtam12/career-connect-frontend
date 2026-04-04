'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Tabs — Phase 2 UI Primitive
 * Lightweight tab component. Zero inline styles.
 *
 * Usage:
 *   <Tabs value={tab} onValueChange={setTab}>
 *     <TabsList>
 *       <TabsTrigger value="form">Form</TabsTrigger>
 *       <TabsTrigger value="ai">AI</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="form">...</TabsContent>
 *     <TabsContent value="ai">...</TabsContent>
 *   </Tabs>
 */

const TabsContext = React.createContext({ value: '', onValueChange: () => {} })

function Tabs({ value, onValueChange, defaultValue, className, children, ...props }) {
  const [internal, setInternal] = React.useState(defaultValue ?? '')
  const controlled = value !== undefined

  const current = controlled ? value : internal
  const change = controlled ? onValueChange : setInternal

  return (
    <TabsContext.Provider value={{ value: current, onValueChange: change }}>
      <div data-slot="tabs" className={cn('flex flex-col', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn(
        'flex items-center gap-0 border-b border-border',
        'bg-transparent',
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ value, className, children, ...props }) {
  const ctx = React.useContext(TabsContext)
  const isActive = ctx.value === value

  return (
    <button
      data-slot="tabs-trigger"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        // Base
        'relative inline-flex items-center gap-2 px-4 py-2.5',
        'text-sm font-medium whitespace-nowrap',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        'border-b-2 -mb-px', // underline trick
        // States
        isActive
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, className, ...props }) {
  const ctx = React.useContext(TabsContext)
  if (ctx.value !== value) return null

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      className={cn('flex-1 outline-none animate-fade-in', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
