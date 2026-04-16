'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Timeframe, TIMEFRAME_CONFIGS } from '@/src/types/chart'

interface TimeframeSelectorProps {
  selectedTimeframe: Timeframe
  onTimeframeChange: (timeframe: Timeframe) => void
  timeframes?: Timeframe[]
  storageKey?: string
  enablePersistence?: boolean
  className?: string
}

const TIMEFRAME_ORDER: Timeframe[] = ['1m', '5m', '15m', '1H', '4H', '1D', '1W', '1M']

export default function TimeframeSelector({
  selectedTimeframe,
  onTimeframeChange,
  timeframes,
  storageKey = 'chart-timeframe',
  enablePersistence = true,
  className = ''
}: TimeframeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const allowedTimeframes = useMemo(() => (timeframes?.length ? timeframes : TIMEFRAME_ORDER), [timeframes])
  const allowedKey = useMemo(() => allowedTimeframes.join('|'), [allowedTimeframes])
  const restoreKeyRef = useRef<string | null>(null)

  // Load last selected timeframe from localStorage once per allowed timeframe set.
  useEffect(() => {
    if (!enablePersistence) return
    if (restoreKeyRef.current === allowedKey) return
    restoreKeyRef.current = allowedKey

    const savedTimeframe = localStorage.getItem(storageKey) as Timeframe
    if (savedTimeframe && allowedTimeframes.includes(savedTimeframe) && savedTimeframe !== selectedTimeframe) {
      onTimeframeChange(savedTimeframe)
    }
  }, [onTimeframeChange, allowedKey, allowedTimeframes, selectedTimeframe, storageKey, enablePersistence])

  // Save timeframe to localStorage when it changes
  useEffect(() => {
    if (!enablePersistence) return
    localStorage.setItem(storageKey, selectedTimeframe)
  }, [selectedTimeframe, storageKey, enablePersistence])

  const handleTimeframeSelect = (timeframe: Timeframe) => {
    onTimeframeChange(timeframe)
    setIsOpen(false)
  }

  const currentConfig = TIMEFRAME_CONFIGS[selectedTimeframe]

  return (
    <div className={`relative ${className}`}>
      {/* Compact selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
      >
        <span>{currentConfig.label}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1">
            {allowedTimeframes.map((timeframe) => {
              const config = TIMEFRAME_CONFIGS[timeframe]
              return (
                <button
                  key={timeframe}
                  onClick={() => handleTimeframeSelect(timeframe)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
                    timeframe === selectedTimeframe
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{config.label}</span>
                    {timeframe === selectedTimeframe && (
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}