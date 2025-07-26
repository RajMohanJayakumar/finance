import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for calculator state management with URL synchronization
 * Provides consistent state management across all calculators
 */
export const useCalculatorState = (prefix, defaultInputs = {}) => {
  const [inputs, setInputs] = useState(defaultInputs)
  const [results, setResults] = useState(null)

  // URL parameter management
  const updateURL = useCallback((newInputs) => {
    const url = new URL(window.location)
    
    // Preserve calculator parameter
    const calculatorParam = url.searchParams.get('calculator')
    
    // Remove existing parameters with the prefix
    const keysToRemove = []
    for (const key of url.searchParams.keys()) {
      if (key.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => url.searchParams.delete(key))
    
    // Restore calculator parameter
    if (calculatorParam) {
      url.searchParams.set('calculator', calculatorParam)
    }
    
    // Add new parameters (only non-empty values)
    Object.entries(newInputs).forEach(([key, value]) => {
      if (value && value !== '' && value !== '0') {
        url.searchParams.set(`${prefix}${key}`, value)
      }
    })
    
    window.history.replaceState({}, '', url.toString())
  }, [prefix])

  // Read URL parameters
  const readURLParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const params = {}
    
    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith(prefix)) {
        const cleanKey = key.replace(prefix, '')
        params[cleanKey] = value
      }
    }
    
    return params
  }, [prefix])

  // Initialize from URL on mount
  useEffect(() => {
    const urlParams = readURLParams()
    if (Object.keys(urlParams).length > 0) {
      const initialInputs = { ...defaultInputs, ...urlParams }
      setInputs(initialInputs)
    } else {
      // Set default inputs if no URL params
      setInputs(defaultInputs)
    }
  }, [readURLParams, prefix])

  // Listen for browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = readURLParams()
      if (Object.keys(urlParams).length > 0) {
        const newInputs = { ...defaultInputs, ...urlParams }
        setInputs(newInputs)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [readURLParams])

  // Handle input changes with URL updates
  const handleInputChange = useCallback((field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
    updateURL(newInputs)
  }, [inputs, updateURL])

  // Reset function
  const resetCalculator = useCallback(() => {
    setInputs(defaultInputs)
    setResults(null)
    updateURL(defaultInputs)
  }, [updateURL])

  return {
    inputs,
    setInputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator,
    updateURL
  }
}

/**
 * Generate shareable URL for calculator results using new format
 */
export const generateCalculatorShareURL = (calculatorType, inputs, results) => {
  const baseURL = window.location.origin + window.location.pathname
  const params = new URLSearchParams()

  // Map calculator types to categories
  const calculatorCategoryMap = {
    'emi': 'loans',
    'mortgage': 'loans',
    'personal-loan': 'loans',
    'fd': 'savings',
    'rd': 'savings',
    'ppf': 'savings',
    'sip': 'mutual_funds',
    'swp': 'mutual_funds',
    'cagr': 'mutual_funds',
    'income-tax': 'tax',
    'capital-gains': 'tax',
    'nps': 'retirement',
    'epf': 'retirement',
    'gratuity': 'retirement',
    'budget-planner': 'personal_finance',
    'savings-goal': 'personal_finance',
    'stock-average': 'personal_finance',
    'net-worth': 'personal_finance',
    'bill-split': 'lifestyle',
    'tip': 'lifestyle',
    'subscription': 'lifestyle',
    'daily-interest': 'lifestyle',
    'monthly-expense': 'lifestyle',
    'upi-spending': 'lifestyle',
    'grocery-budget': 'lifestyle',
    'commute-cost': 'lifestyle',
    'wfh-savings': 'lifestyle',
    'habit-cost': 'lifestyle',
    'freelancer-tax': 'business',
    'discount': 'general',
    'fuel-cost': 'general',
    'compound-interest': 'general',
    'simple-interest': 'general',
    'inflation': 'general',
    'finance-quest': 'games'
  }

  const category = calculatorCategoryMap[calculatorType] || 'general'

  // Use new URL format: ?category=games&in=finance-quest
  params.set('category', category)
  params.set('in', calculatorType)

  // Add input parameters
  Object.entries(inputs).forEach(([key, value]) => {
    if (value && value !== '' && value !== '0') {
      params.set(`${calculatorType}_${key}`, value)
    }
  })

  return `${baseURL}?${params.toString()}`
}
