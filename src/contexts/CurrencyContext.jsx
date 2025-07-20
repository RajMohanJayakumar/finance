import React, { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

// Currency format configurations
export const CURRENCY_FORMATS = {
  'indian': {
    name: 'Indian (₹1,00,000)',
    symbol: '₹',
    separator: ',',
    pattern: 'indian', // Special Indian numbering system
    locale: 'en-IN'
  },
  'international': {
    name: 'International ($1,000,000)',
    symbol: '$',
    separator: ',',
    pattern: 'international',
    locale: 'en-US'
  },
  'european': {
    name: 'European (€1.000.000)',
    symbol: '€',
    separator: '.',
    pattern: 'european',
    locale: 'de-DE'
  },
  'minimal': {
    name: 'Minimal (1,000,000)',
    symbol: '',
    separator: ',',
    pattern: 'international',
    locale: 'en-US'
  }
}

export const CurrencyProvider = ({ children }) => {
  const [currencyFormat, setCurrencyFormat] = useState('minimal')

  // Load saved format from localStorage
  useEffect(() => {
    const savedFormat = localStorage.getItem('finclamp-currency-format')
    if (savedFormat && CURRENCY_FORMATS[savedFormat]) {
      setCurrencyFormat(savedFormat)
    }
  }, [])

  // Save format to localStorage
  const updateCurrencyFormat = (format) => {
    setCurrencyFormat(format)
    localStorage.setItem('finclamp-currency-format', format)
  }

  // Format number according to selected format
  const formatCurrency = (value, options = {}) => {
    if (!value && value !== 0) return ''

    const format = CURRENCY_FORMATS[currencyFormat]

    // Handle string values that might contain formatting
    let cleanValue = value.toString().replace(/[^\d.]/g, '')

    if (!cleanValue) return ''

    // For very large numbers, avoid parseFloat precision issues
    let number
    if (cleanValue.length > 15) {
      // For very large numbers, work with string manipulation
      number = cleanValue
    } else {
      number = parseFloat(cleanValue)
      if (isNaN(number)) return ''
    }

    let formattedValue = ''

    if (format.pattern === 'indian') {
      // Indian numbering system (lakhs, crores)
      formattedValue = typeof number === 'string' ? formatLargeIndianNumber(number) : formatIndianNumber(number)
    } else if (format.pattern === 'european') {
      // European format with dots as thousand separators
      formattedValue = typeof number === 'string' ? formatLargeNumber(number, '.') : number.toLocaleString('de-DE')
    } else {
      // International format
      formattedValue = typeof number === 'string' ? formatLargeNumber(number, ',') : number.toLocaleString('en-US')
    }

    // Add symbol if not minimal format and not disabled
    if (format.symbol && !options.noSymbol) {
      return `${format.symbol}${formattedValue}`
    }

    return formattedValue
  }

  // Remove formatting to get clean number
  const unformatCurrency = (formattedValue) => {
    if (!formattedValue) return ''
    
    // Remove all non-numeric characters except decimal point
    return formattedValue.toString().replace(/[^\d.]/g, '')
  }

  // Format number in Indian style (lakhs, crores)
  const formatIndianNumber = (number) => {
    const numStr = number.toString()
    const parts = numStr.split('.')
    let integerPart = parts[0]
    const decimalPart = parts[1] ? `.${parts[1]}` : ''

    // Indian numbering: first 3 digits, then groups of 2
    if (integerPart.length <= 3) {
      return number.toLocaleString('en-IN')
    }

    const lastThree = integerPart.slice(-3)
    const remaining = integerPart.slice(0, -3)

    const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree

    return formatted + decimalPart
  }

  // Format large numbers as strings to avoid precision issues
  const formatLargeNumber = (numberStr, separator = ',') => {
    const parts = numberStr.split('.')
    let integerPart = parts[0]
    const decimalPart = parts[1] ? `.${parts[1]}` : ''

    // Add separators every 3 digits from right
    const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)

    return formatted + decimalPart
  }

  // Format large numbers in Indian style as strings
  const formatLargeIndianNumber = (numberStr) => {
    const parts = numberStr.split('.')
    let integerPart = parts[0]
    const decimalPart = parts[1] ? `.${parts[1]}` : ''

    if (integerPart.length <= 3) {
      return numberStr
    }

    const lastThree = integerPart.slice(-3)
    const remaining = integerPart.slice(0, -3)

    const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree

    return formatted + decimalPart
  }

  // Get display value for inputs
  const getDisplayValue = (value, fieldName) => {
    if (shouldFormatAsCurrency(fieldName) && value) {
      return formatCurrency(value, { noSymbol: true })
    }
    return value || ''
  }

  // Check if field should be formatted as currency
  const shouldFormatAsCurrency = (fieldName) => {
    const currencyFields = [
      'principal',
      'monthlyInvestment',
      'lumpSumAmount',
      'maturityAmount',
      'emi',
      'currentAmount',
      'beginningValue',
      'endingValue',
      'monthlyContribution',
      'annualIncome',
      'targetAmount',
      'monthlyDeposit',
      'monthlyWithdrawal',
      'investmentAmount',
      'salary',
      'bonus',
      'otherIncome',
      'basicSalary',
      'annualDeposit',
      'lastDrawnSalary'
    ]

    return currencyFields.includes(fieldName)
  }

  const value = {
    currencyFormat,
    updateCurrencyFormat,
    formatCurrency,
    unformatCurrency,
    getDisplayValue,
    shouldFormatAsCurrency,
    currentFormat: CURRENCY_FORMATS[currencyFormat]
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}
