import { useState, useEffect, useCallback } from 'react'

export const useURLState = (key, defaultValue = '') => {
  // Get initial value from URL
  const getInitialValue = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const value = urlParams.get(key)
    return value !== null ? value : defaultValue
  }

  const [state, setState] = useState(getInitialValue)

  // Update URL when state changes
  const updateURL = useCallback((newValue) => {
    const url = new URL(window.location)
    
    if (newValue && newValue !== defaultValue) {
      url.searchParams.set(key, newValue)
    } else {
      url.searchParams.delete(key)
    }
    
    // Update URL without page reload
    window.history.replaceState({}, '', url.toString())
  }, [key, defaultValue])

  // Update state and URL
  const setValue = useCallback((newValue) => {
    setState(newValue)
    updateURL(newValue)
  }, [updateURL])

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setState(getInitialValue())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [key, defaultValue])

  return [state, setValue]
}

export const useURLStateObject = (prefix = '') => {
  // Get all URL parameters with the given prefix
  const getURLParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const params = {}
    
    for (const [key, value] of urlParams.entries()) {
      if (!prefix || key.startsWith(prefix)) {
        const cleanKey = prefix ? key.replace(prefix, '') : key
        params[cleanKey] = value
      }
    }
    
    return params
  }, [prefix])

  const [state, setState] = useState(getURLParams)

  // Update URL with object state
  const updateURL = useCallback((newState) => {
    const url = new URL(window.location)
    
    // Remove existing parameters with prefix
    const keysToRemove = []
    for (const key of url.searchParams.keys()) {
      if (!prefix || key.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => url.searchParams.delete(key))
    
    // Add new parameters
    Object.entries(newState).forEach(([key, value]) => {
      if (value && value !== '') {
        const paramKey = prefix ? `${prefix}${key}` : key
        url.searchParams.set(paramKey, value)
      }
    })
    
    window.history.replaceState({}, '', url.toString())
  }, [prefix])

  // Update state and URL
  const setStateAndURL = useCallback((newState) => {
    setState(newState)
    updateURL(newState)
  }, [updateURL])

  // Update specific key
  const updateKey = useCallback((key, value) => {
    const newState = { ...state, [key]: value }
    setStateAndURL(newState)
  }, [state, setStateAndURL])

  // Listen for URL changes
  useEffect(() => {
    const handlePopState = () => {
      setState(getURLParams())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [getURLParams])

  return [state, setStateAndURL, updateKey]
}

// Utility function to generate shareable URL
export const generateShareableURL = (calculatorType, inputs, results) => {
  const url = new URL(window.location.origin + window.location.pathname)
  
  // Add calculator type
  url.searchParams.set('calc', calculatorType)
  
  // Add inputs with prefix
  Object.entries(inputs).forEach(([key, value]) => {
    if (value && value !== '') {
      url.searchParams.set(`i_${key}`, value)
    }
  })
  
  // Add timestamp for tracking
  url.searchParams.set('shared', Date.now().toString())
  
  return url.toString()
}
