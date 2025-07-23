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
 * Generate shareable URL for calculator results
 */
export const generateCalculatorShareURL = (calculatorType, inputs, results) => {
  const baseURL = window.location.origin + window.location.pathname
  const params = new URLSearchParams()
  
  // Add calculator type
  params.set('calculator', calculatorType)
  
  // Add input parameters
  Object.entries(inputs).forEach(([key, value]) => {
    if (value && value !== '' && value !== '0') {
      params.set(`${calculatorType}_${key}`, value)
    }
  })
  
  return `${baseURL}?${params.toString()}`
}
