import React from 'react'
import { motion } from 'framer-motion'
import { Calculator, RotateCcw } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'

const ModernInputSection = ({
  title = "Input Details",
  icon: IconComponent = Calculator,
  children,
  onReset,
  categoryColor = 'blue',
  className = ""
}) => {
  const { viewMode, isMobile } = useViewMode()

  const fadeInUp = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay: 0.1 }
  }

  // Responsive styling based on view mode
  const responsivePadding = isMobile ? 'p-3' : 'p-6'
  const responsiveSpacing = isMobile ? 'space-y-3' : 'space-y-6'
  const responsiveRounding = isMobile ? 'rounded-lg' : 'rounded-xl'
  const responsiveShadow = isMobile ? 'shadow-md' : 'shadow-lg'

  return (
    <motion.div
      className={`bg-white ${responsiveRounding} ${responsiveShadow} ${responsivePadding} ${className}`}
      {...fadeInUp}
    >
      <div className={`flex items-center justify-between ${isMobile ? 'mb-4' : 'mb-6'}`}>
        <div className="flex items-center gap-3">
          <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-${categoryColor}-100 rounded-lg`}>
            <IconComponent className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-${categoryColor}-600`} />
          </div>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900`}>{title}</h2>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className={`flex items-center gap-2 px-3 py-2 text-sm text-${categoryColor}-600 hover:text-${categoryColor}-700 hover:bg-${categoryColor}-50 rounded-lg transition-colors cursor-pointer`}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      <div className={responsiveSpacing}>
        {children}
      </div>
    </motion.div>
  )
}

// Modern Input Field Component
const ModernInputField = ({ 
  label, 
  value, 
  onChange, 
  type = "number",
  placeholder = "",
  prefix = "",
  suffix = "",
  min,
  max,
  step,
  categoryColor = 'blue',
  className = "",
  ...props
}) => {
  const { currentFormat } = useCurrency()
  
  // Use currency symbol as prefix if type is currency
  const displayPrefix = type === 'currency' ? currentFormat.symbol : prefix

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {displayPrefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {displayPrefix}
          </span>
        )}
        <input
          type={type === 'currency' ? 'number' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${displayPrefix ? 'pl-8' : 'pl-4'} ${suffix ? 'pr-8' : 'pr-4'} py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-${categoryColor}-500 focus:border-transparent`}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

// Modern Select Field Component
const ModernSelectField = ({ 
  label, 
  value, 
  onChange, 
  options = [],
  categoryColor = 'blue',
  className = "",
  ...props
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${categoryColor}-500 focus:border-transparent transition-colors bg-white`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Modern Button Group Component
const ModernButtonGroup = ({ 
  label, 
  value, 
  onChange, 
  options = [],
  categoryColor = 'blue',
  className = ""
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              value === option.value
                ? `bg-${categoryColor}-600 text-white`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// Modern Range Input Component
const ModernRangeField = ({ 
  label, 
  value, 
  onChange, 
  min = 0,
  max = 100,
  step = 1,
  suffix = "",
  categoryColor = 'blue',
  className = ""
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm font-semibold text-gray-900">
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-${categoryColor}`}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  )
}

// Modern Checkbox Component
const ModernCheckbox = ({ 
  label, 
  checked, 
  onChange, 
  categoryColor = 'blue',
  className = ""
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`w-4 h-4 text-${categoryColor}-600 bg-gray-100 border-gray-300 rounded focus:ring-${categoryColor}-500 focus:ring-2`}
      />
      <label className="ml-2 text-sm text-gray-700">
        {label}
      </label>
    </div>
  )
}

// Export all components
export default ModernInputSection
export { 
  ModernInputField, 
  ModernSelectField, 
  ModernButtonGroup, 
  ModernRangeField, 
  ModernCheckbox 
}
