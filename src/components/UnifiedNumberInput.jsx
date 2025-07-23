import { motion } from 'framer-motion'

export default function UnifiedNumberInput({
  label,
  value,
  onChange,
  icon,
  placeholder = "0",
  min = 0,
  max = 100,
  step = 1,
  showControls = true,
  suffix,
  disabled = false,
  className = "",
  focusColor = "#3B82F6"
}) {
  const handleInputChange = (e) => {
    const newValue = e.target.value
    if (newValue === '' || (!isNaN(newValue) && newValue >= min && newValue <= max)) {
      onChange(newValue)
    }
  }

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

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleIncrement()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleDecrement()
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
          type="number"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`
            w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg font-medium border-2 border-gray-200 rounded-xl
            focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none
            transition-all duration-200 bg-white disabled:bg-gray-50 disabled:text-gray-500
            ${showControls ? 'pr-12' : suffix ? 'pr-10 sm:pr-12' : ''}
          `}
          style={{
            '--focus-color': focusColor
          }}
        />
        
        {suffix && !showControls && (
          <span className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">
            {suffix}
          </span>
        )}

        {showControls && !disabled && (
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
            <motion.button
              type="button"
              onClick={handleIncrement}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-6 bg-white text-gray-600 flex items-center justify-center text-xs font-bold hover:bg-gray-50 transition-colors border-b border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={parseFloat(value) >= max}
            >
              ▲
            </motion.button>
            <motion.button
              type="button"
              onClick={handleDecrement}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-6 bg-white text-gray-600 flex items-center justify-center text-xs font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={parseFloat(value) <= min}
            >
              ▼
            </motion.button>
          </div>
        )}

        {suffix && showControls && (
          <span className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
