'use client'

import { ReactNode } from 'react'

interface PageToolbarProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
  className?: string
}

export default function PageToolbar({ left, center, right, className = '' }: PageToolbarProps) {
  return (
    <div className={`w-full px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col gap-3 sm:flex-row sm:items-end ${className}`}>
      {(left || center) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4 sm:flex-1">
          {left && (
            <div className="flex flex-wrap items-center gap-3">
              {left}
            </div>
          )}

          {center && (
            <div className="w-full sm:w-auto">
              {center}
            </div>
          )}
        </div>
      )}

      {right && (
        <div className="flex items-center gap-3 sm:ml-auto">
          {right}
        </div>
      )}
    </div>
  )
}