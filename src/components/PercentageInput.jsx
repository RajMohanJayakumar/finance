import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PercentageInput = ({
  label,
  value,
  onChange,
  placeholder = "0",
  icon,
  options = [],
  className = "",
  showDropdown = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  // Sync internal state with prop value
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
  }

  const handleOptionSelect = (option) => {
    setInputValue(option.value)
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </label>
      
      <div className="relative">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          min="0"
          step="0.1"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg font-medium border-2 border-gray-200 rounded-xl
                   focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none
                   transition-all duration-200 bg-white pr-12 sm:pr-16"
        />
        
        <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 sm:gap-2">
          <span className="text-gray-500 font-medium text-sm sm:text-base">%</span>

          {showDropdown && options.length > 0 && (
            <motion.button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          )}
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto"
            >
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-500">{option.description}</div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PercentageInput
