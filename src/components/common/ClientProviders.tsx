'use client'

import { ReactNode } from 'react'
import BackgroundUpdaterInitializer from '@/src/components/common/BackgroundUpdaterInitializer'
import { ToastProvider } from '@/src/hooks/useToast'
import { ToastWrapper } from '@/src/components/common/ToastWrapper'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ToastProvider>
      <BackgroundUpdaterInitializer />
      {children}
      <ToastWrapper />
    </ToastProvider>
  )
}