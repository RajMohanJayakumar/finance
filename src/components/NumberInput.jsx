import React from 'react'
import { motion } from 'framer-motion'

const NumberInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "0", 
  icon,
  suffix = "",
  min = 0,
  max = 100,
  step = 1,
  showControls = false,
  className = "",
  type = "number"
}) => {
  const handleIncrement = () => {
    const currentValue = parseFloat(value) || 0
    const newValue = Math.min(currentValue + step, max)
    onChange(newValue.toString())
  }

  const handleDecrement = () => {
    const currentValue = parseFloat(value) || 0
    const newValue = Math.max(currentValue - step, min)
    onChange(newValue.toString())
  }

  const handleInputChange = (e) => {
    const inputValue = e.target.value
    // Allow empty string or valid numbers within range
    if (inputValue === '' || (!isNaN(inputValue) && parseFloat(inputValue) >= min && parseFloat(inputValue) <= max)) {
      onChange(inputValue)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`
            w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg font-medium border-2 border-gray-200 rounded-xl
            focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none
            transition-all duration-200 bg-white
            ${showControls ? 'pr-12' : suffix ? 'pr-10 sm:pr-12' : ''}
          `}
        />
        
        {suffix && !showControls && (
          <span className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">
            {suffix}
          </span>
        )}

        {showControls && (
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
            <motion.button
              type="button"
              onClick={handleIncrement}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-6 bg-white text-gray-600 flex items-center justify-center text-xs font-bold hover:bg-gray-50 transition-colors border-b border-gray-200"
            >
              ▲
            </motion.button>
            <motion.button
              type="button"
              onClick={handleDecrement}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-6 bg-white text-gray-600 flex items-center justify-center text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              ▼
            </motion.button>
          </div>
        )}

        {suffix && showControls && (
          <span className="absolute right-14 sm:right-20 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export default NumberInput
