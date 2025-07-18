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
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40">
        <div className="relative">
          <button
            onClick={toggleComparisonVisibility}
            className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center space-x-2 sm:space-x-3 group backdrop-blur-xl border border-white/20 cursor-pointer"
          >
            <span className="text-xl sm:text-3xl animate-pulse">📊</span>
            <div className="hidden sm:hidden lg:group-hover:flex flex-col items-start">
              <span className="font-bold text-base sm:text-lg">Compare</span>
              <span className="text-xs sm:text-sm opacity-90">{comparisons.length} calculations</span>
            </div>
            <div className="flex flex-col items-center sm:hidden">
              <span className="font-bold text-xs">Compare</span>
              <span className="text-xs opacity-90">{comparisons.length}</span>
            </div>
            {comparisons.length > 0 && (
              <span className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold shadow-lg animate-bounce">
                {comparisons.length}
              </span>
            )}
          </button>

          {/* Floating particles effect */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse"></div>
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
