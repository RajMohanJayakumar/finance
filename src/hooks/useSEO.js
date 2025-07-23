import { useEffect } from 'react'
import { updateSEO, generateBreadcrumbData } from '../utils/seo'

// Custom hook for managing SEO
export const useSEO = (calculatorId) => {
  useEffect(() => {
    if (calculatorId) {
      // Update all SEO elements when calculator changes
      updateSEO(calculatorId)
      
      // Add breadcrumb structured data
      const breadcrumbData = generateBreadcrumbData(calculatorId)
      
      // Remove existing breadcrumb script
      const existingBreadcrumb = document.querySelector('script[data-type="breadcrumb"]')
      if (existingBreadcrumb) {
        existingBreadcrumb.remove()
      }
      
      // Add new breadcrumb script
      const breadcrumbScript = document.createElement('script')
      breadcrumbScript.type = 'application/ld+json'
      breadcrumbScript.setAttribute('data-type', 'breadcrumb')
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData, null, 2)
      document.head.appendChild(breadcrumbScript)
    }
  }, [calculatorId])
}

// Hook for updating SEO when URL parameters change
export const useDynamicSEO = (calculatorId, inputs = {}) => {
  useEffect(() => {
    if (calculatorId) {
      updateSEO(calculatorId)
      
      // Update URL for better sharing
      const url = new URL(window.location)
      url.searchParams.set('calculator', calculatorId)
      
      // Add input parameters for sharing
      Object.entries(inputs).forEach(([key, value]) => {
        if (value && value !== '') {
          url.searchParams.set(`${calculatorId}_${key}`, value)
        }
      })
      
      // Update URL without page reload
      window.history.replaceState({}, '', url.toString())
    }
  }, [calculatorId, inputs])
}

export default useSEO
