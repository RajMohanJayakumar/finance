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

      // Map calculator types to categories for new URL format
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

      // Update URL for better sharing using new format
      const url = new URL(window.location)
      const category = calculatorCategoryMap[calculatorId] || 'general'

      // Clear old parameters and set new format
      url.searchParams.delete('calculator')
      url.searchParams.set('category', category)
      url.searchParams.set('in', calculatorId)

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
