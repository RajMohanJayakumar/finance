import React from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { useViewMode } from '../contexts/ViewModeContext'

const SimpleViewModeToggle = () => {
  const { viewMode, toggleViewMode, isAutoDetect } = useViewMode()

  return (
    <button
      onClick={toggleViewMode}
      className="flex items-center space-x-2 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:bg-white/80 transition-all duration-200 text-sm font-medium text-gray-700 cursor-pointer"
      title={`Switch to ${viewMode === 'desktop' ? 'mobile' : 'desktop'} view`}
    >
      {viewMode === 'desktop' ? (
        <>
          <Monitor className="w-4 h-4" />
          <span className="hidden sm:inline">Desktop</span>
        </>
      ) : (
        <>
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">Mobile</span>
        </>
      )}
      
      {/* Auto indicator */}
      {isAutoDetect && (
        <div className="w-2 h-2 bg-green-500 rounded-full" title="Auto-detect mode" />
      )}
    </button>
  )
}

export default SimpleViewModeToggle
