import React, { useState } from 'react'
import { useCurrency } from '../contexts/CurrencyContext'

const CurrencyInput = ({
  label,
  value,
  onChange,
  fieldName,
  type = "text",
  icon,
  placeholder,
  step,
  min,
  focusColor = '#6366F1'
}) => {
  const { formatCurrency, unformatCurrency, shouldFormatAsCurrency, getDisplayValue } = useCurrency()
  const [isFocused, setIsFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState(getDisplayValue(value, fieldName))

  const handleInputChange = (inputValue) => {
    if (shouldFormatAsCurrency(fieldName)) {
      // Remove formatting for storage
      const cleanValue = unformatCurrency(inputValue)

      // Update display value with formatting (no symbol in input)
      setDisplayValue(formatCurrency(cleanValue, { noSymbol: true }))

      // Store clean value
      onChange(cleanValue)
    } else {
      setDisplayValue(inputValue)
      onChange(inputValue)
    }
  }

  const handleKeyDown = (e) => {
    // Prevent 'e', 'E', '+', '-' for number inputs to avoid scientific notation
    if (shouldFormatAsCurrency(fieldName) || type === 'number') {
      if (['e', 'E', '+', '-'].includes(e.key)) {
        e.preventDefault()
      }
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Update display value when focused
    setDisplayValue(getDisplayValue(value, fieldName))
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Ensure proper formatting on blur
    if (shouldFormatAsCurrency(fieldName) && value) {
      setDisplayValue(formatCurrency(value, { noSymbol: true }))
    }
  }

  // Update display value when value prop changes
  React.useEffect(() => {
    setDisplayValue(getDisplayValue(value, fieldName))
  }, [value, fieldName, getDisplayValue])

  return (
    <div className="relative">
      {/* Label positioned above the input */}
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        <span className="mr-2">{icon}</span>
        {label}
      </label>

      <div className="relative">
        <input
          type={shouldFormatAsCurrency(fieldName) ? "text" : type}
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          step={step}
          min={min}
          className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none"
          style={{
            borderColor: isFocused ? focusColor : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? `${focusColor}1A 0px 0px 0px 4px` : 'none'
          }}
          placeholder={placeholder}
          inputMode={shouldFormatAsCurrency(fieldName) ? "numeric" : "text"}
        />
      </div>
    </div>
  )
}

export default CurrencyInput
