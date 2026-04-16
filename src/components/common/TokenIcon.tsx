'use client'

import clsx from 'clsx'

interface TokenIconProps {
  label: string
  size?: number
  className?: string
}

export default function TokenIcon({ label, size = 40, className }: TokenIconProps) {
  // Simple initials-based icon with subtle gradient background.
  const initials = label
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)

  const gradient = 'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400'

  return (
    <div
      className={clsx('flex items-center justify-center rounded-full text-white font-semibold', gradient, className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className="text-sm">{initials}</span>
    </div>
  )
}

