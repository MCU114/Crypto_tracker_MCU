'use client'

import { useToast } from '@/src/hooks/useToast'
import { ToastContainer } from '@/src/components/common/Toast'

export function ToastWrapper() {
  const { toasts, removeToast } = useToast()
  return <ToastContainer toasts={toasts} removeToast={removeToast} />
}