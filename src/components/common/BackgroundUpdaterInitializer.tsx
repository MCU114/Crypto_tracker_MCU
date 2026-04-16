'use client'

import { useEffect } from 'react'
import { startBackgroundUpdater } from '@/src/lib/backgroundUpdater'

/**
 * Client component that initializes the background updater on app start
 * This ensures the background cache warming starts when the app loads
 */
export default function BackgroundUpdaterInitializer() {
  useEffect(() => {
    // Start the background updater when the app initializes
    startBackgroundUpdater()
  }, [])

  // This component doesn't render anything
  return null
}