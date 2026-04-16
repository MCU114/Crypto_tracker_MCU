'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { assets, getAssetBySymbol } from '@/data/assets'
import { Asset } from '@/src/types/asset'
import { CryptoPrice } from '@/src/types/market'

interface AssetSelectorProps {
  selectedSymbol: string
  onSymbolChange: (symbol: string) => void
  className?: string
  placeholder?: string
  cryptoData?: CryptoPrice[]
  allowedSymbols?: readonly string[]
}


export default function AssetSelector({
  selectedSymbol,
  onSymbolChange,
  className = '',
  placeholder = 'Add comparison...',
  cryptoData = [],
  allowedSymbols
}: AssetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets)

  // Filter assets by allowedSymbols if provided
  const availableAssets = useMemo(() => {
    if (!allowedSymbols) return assets
    const allowedSet = new Set(allowedSymbols.map(s => s.toUpperCase()))
    return assets.filter(asset => allowedSet.has(asset.symbol.toUpperCase()))
  }, [allowedSymbols])

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedAsset = getAssetBySymbol(selectedSymbol)
  const selectedCrypto = cryptoData.find(crypto => crypto.symbol.toUpperCase() === selectedSymbol.toUpperCase())

  // Filter assets based on search term
  useEffect(() => {
    let filtered = availableAssets

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(asset =>
        asset.symbol.toLowerCase().includes(term) ||
        asset.name.toLowerCase().includes(term)
      )
    }

    setFilteredAssets(filtered)
  }, [searchTerm, availableAssets])

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleAssetSelect = (asset: Asset) => {
    onSymbolChange(asset.symbol)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Selected asset display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px] text-left"
      >
        <div className="flex items-center gap-2 flex-1">
          {!selectedSymbol ? (
            <div className="text-gray-500">
              <div className="font-medium">{placeholder}</div>
            </div>
          ) : (
            <>
              {selectedCrypto ? (
                <img
                  src={selectedCrypto.image}
                  alt={selectedCrypto.name}
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                  {selectedSymbol.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">{selectedAsset?.symbol || selectedSymbol}</div>
                <div className="text-sm text-gray-500 truncate">{selectedAsset?.name}</div>
              </div>
            </>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Asset list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredAssets.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No assets found
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const crypto = cryptoData.find(c => c.symbol.toUpperCase() === asset.symbol.toUpperCase())
                return (
                  <button
                    key={asset.id}
                    onClick={() => handleAssetSelect(asset)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
                      asset.symbol === selectedSymbol ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {crypto ? (
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          {asset.symbol.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{asset.symbol}</div>
                        <div className="text-sm text-gray-500 truncate">{asset.name}</div>
                      </div>
                      {asset.symbol === selectedSymbol && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}