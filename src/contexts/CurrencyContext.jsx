import { createContext, useContext, useCallback, useState } from 'react'

const CurrencyContext = createContext()

// Currency format configurations
export const CURRENCY_FORMATS = {
  indian: {
    name: 'Indian (₹1,23,456)',
    symbol: '₹',
    locale: 'en-IN',
    separator: ',',
    decimal: '.',
    precision: 0
  },
  us: {
    name: 'US Dollar ($123,456)',
    symbol: '$',
    locale: 'en-US',
    separator: ',',
    decimal: '.',
    precision: 0
  },
  european: {
    name: 'European (€123.456)',
    symbol: '€',
    locale: 'de-DE',
    separator: '.',
    decimal: ',',
    precision: 0
  },
  compact: {
    name: 'Compact (₹1.2L)',
    symbol: '₹',
    locale: 'en-IN',
    separator: ',',
    decimal: '.',
    precision: 1,
    compact: true
  }
}

// List of fields that should be formatted as currency
const currencyFields = [
  'loanAmount', 'monthlyPayment', 'totalInterest', 'totalPayment',
  'monthlyInvestment', 'lumpSumAmount', 'totalInvestment', 'maturityAmount', 'totalReturns',
  'principal', 'interest', 'amount', 'finalAmount',
  'initialInvestment', 'monthlyWithdrawal', 'remainingBalance', 'totalWithdrawn',
  'beginningValue', 'endingValue', 'netProfit', 'totalReturns',
  'currentValue', 'futureValue', 'presentValue',
  'salary', 'bonus', 'deductions', 'netSalary',
  'income', 'expenses', 'savings', 'investment',
  'annualIncome', 'basicSalary', 'lastDrawnSalary', 'monthlyContribution'
]

// Helper function to format numbers in Indian style (lakhs/crores)
const formatIndianNumber = (num) => {
  if (num >= 10000000) { // 1 crore
    return (num / 10000000).toFixed(2) + ' Cr'
  } else if (num >= 100000) { // 1 lakh
    return (num / 100000).toFixed(2) + ' L'
  } else if (num >= 1000) { // 1 thousand
    return (num / 1000).toFixed(2) + ' K'
  }
  return num.toLocaleString('en-IN')
}

// Helper function to format large numbers
const formatLargeNumber = (num) => {
  if (num >= 1000000000) { // 1 billion
    return (num / 1000000000).toFixed(2) + 'B'
  } else if (num >= 1000000) { // 1 million
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) { // 1 thousand
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toLocaleString()
}

// Helper function to format large numbers in Indian style
const formatLargeIndianNumber = (num) => {
  if (num >= 10000000) { // 1 crore
    return (num / 10000000).toFixed(1) + ' Cr'
  } else if (num >= 100000) { // 1 lakh
    return (num / 100000).toFixed(1) + ' L'
  } else if (num >= 1000) { // 1 thousand
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString('en-IN')
}

export const CurrencyProvider = ({ children }) => {
  // Currency format state
  const [currencyFormat, setCurrencyFormat] = useState('indian')

  // Get current format configuration
  const currentFormat = CURRENCY_FORMATS[currencyFormat] || CURRENCY_FORMATS.indian

  // Update currency format
  const updateCurrencyFormat = useCallback((format) => {
    if (CURRENCY_FORMATS[format]) {
      setCurrencyFormat(format)
    }
  }, [])

  // Format currency with current format
  const formatCurrency = useCallback((value, options = {}) => {
    const {
      noSymbol = false,
      compact = false,
      decimals = currentFormat.precision
    } = options

    if (!value || isNaN(value)) return noSymbol ? '0' : `${currentFormat.symbol}0`

    const numValue = parseFloat(value)

    if (compact || currentFormat.compact) {
      const formatted = formatLargeIndianNumber(numValue)
      return noSymbol ? formatted : `${currentFormat.symbol}${formatted}`
    }

    const formatted = numValue.toLocaleString(currentFormat.locale, {
      maximumFractionDigits: decimals
    })

    return noSymbol ? formatted : `${currentFormat.symbol}${formatted}`
  }, [currentFormat])

  // Remove currency formatting and return number
  const unformatCurrency = useCallback((value) => {
    if (!value) return ''

    // Remove currency symbol, commas, and other formatting
    const cleaned = value.toString()
      .replace(/₹/g, '')
      .replace(/,/g, '')
      .replace(/\s/g, '')
      .replace(/[^\d.-]/g, '')

    return cleaned
  }, [])

  // Check if field should be formatted as currency
  const shouldFormatAsCurrency = useCallback((fieldName) => {
    return currencyFields.includes(fieldName)
  }, [])

  // Get display value for inputs
  const getDisplayValue = useCallback((value, fieldName) => {
    if (shouldFormatAsCurrency(fieldName) && value) {
      return formatCurrency(value, { noSymbol: true })
    }
    return value || ''
  }, [formatCurrency, shouldFormatAsCurrency])

  const value = {
    formatCurrency,
    unformatCurrency,
    shouldFormatAsCurrency,
    getDisplayValue,
    currencyFormat,
    updateCurrencyFormat,
    currentFormat
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}