import React from 'react'
import { useComparison } from '../contexts/ComparisonContext'
import ComparisonPanel from './ComparisonPanel'

export default function FloatingComparisonButton() {
  const { 
    comparisons, 
    isComparisonVisible, 
    toggleComparisonVisibility,
    removeFromComparison,
    clearComparisons
  } = useComparison()

  if (comparisons.length === 0) return null

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="relative">
          <button
            onClick={toggleComparisonVisibility}
            className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white p-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center space-x-3 group backdrop-blur-xl border border-white/20"
          >
            <span className="text-3xl animate-pulse">📊</span>
            <div className="hidden group-hover:flex flex-col items-start">
              <span className="font-bold text-lg">Compare</span>
              <span className="text-sm opacity-90">{comparisons.length} calculations</span>
            </div>
            {comparisons.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg animate-bounce">
                {comparisons.length}
              </span>
            )}
          </button>

          {/* Floating particles effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse"></div>
        </div>
      </div>

      {/* Comparison Panel */}
      {isComparisonVisible && (
        <ComparisonPanel 
          data={comparisons}
          onRemove={removeFromComparison}
          onClose={toggleComparisonVisibility}
        />
      )}
    </>
  )
}
