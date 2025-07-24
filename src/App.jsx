
import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import './styles/mobile.css'

// Calculator Components
import SIPCalculator from './calculators/SIPCalculator'
import SWPCalculator from './calculators/SWPCalculator'
import EMICalculator from './calculators/EMICalculator'
import FDCalculator from './calculators/FDCalculator'
import RDCalculator from './calculators/RDCalculator'
import PPFCalculator from './calculators/PPFCalculator'
import TaxCalculator from './calculators/TaxCalculator'
import CAGRCalculator from './calculators/CAGRCalculator'
import NPSCalculator from './calculators/NPSCalculator'
import EPFCalculator from './calculators/EPFCalculator'
import GratuityCalculator from './calculators/GratuityCalculator'
import CompoundInterestCalculator from './calculators/CompoundInterestCalculator'
import SimpleInterestCalculator from './calculators/SimpleInterestCalculator'
import InflationCalculator from './calculators/InflationCalculator'

// Components
import Header from './components/Header'
import ComparisonPanel from './components/ComparisonPanel'
import PDFExport from './components/PDFExport'
import FloatingComparisonButton from './components/FloatingComparisonButton'
import Breadcrumb from './components/Breadcrumb'
import SEOAnalytics from './components/SEOAnalytics'
import CalculatorDescription from './components/CalculatorDescription'

// Context
import { ComparisonProvider, useComparison } from './contexts/ComparisonContext'
import { CurrencyProvider } from './contexts/CurrencyContext'

// SEO Hook
import { useSEO } from './hooks/useSEO'

const calculatorData = {
  loans: {
    title: "Loans",
    icon: "💰",
    color: "blue",
    calculators: [
      { id: 'emi', name: 'EMI Calculator', icon: '🏠', component: EMICalculator, description: 'Calculate loan EMI and repayment schedule' },
      { id: 'mortgage', name: 'Mortgage Calculator', icon: '🏡', component: EMICalculator, description: 'Home loan calculator with advanced features' },
      { id: 'personal-loan', name: 'Personal Loan', icon: '💳', component: EMICalculator, description: 'Personal loan EMI calculator' }
    ]
  },
  savings: {
    title: "Savings",
    icon: "🏦",
    color: "green",
    calculators: [
      { id: 'fd', name: 'Fixed Deposit', icon: '🏦', component: FDCalculator, description: 'Calculate FD maturity amount and returns' },
      { id: 'rd', name: 'Recurring Deposit', icon: '💰', component: RDCalculator, description: 'RD maturity calculator' },
      { id: 'ppf', name: 'PPF Calculator', icon: '🛡️', component: PPFCalculator, description: 'Public Provident Fund calculator' }
    ]
  },
  mutual_funds: {
    title: "Mutual Funds",
    icon: "📈",
    color: "purple",
    calculators: [
      { id: 'sip', name: 'SIP Calculator', icon: '📈', component: SIPCalculator, description: 'Systematic Investment Plan calculator' },
      { id: 'swp', name: 'SWP Calculator', icon: '📉', component: SWPCalculator, description: 'Systematic Withdrawal Plan calculator' },
      { id: 'cagr', name: 'CAGR Calculator', icon: '📊', component: CAGRCalculator, description: 'Compound Annual Growth Rate calculator' }
    ]
  },
  tax: {
    title: "Tax",
    icon: "🧾",
    color: "red",
    calculators: [
      { id: 'income-tax', name: 'Income Tax', icon: '🧾', component: TaxCalculator, description: 'Calculate income tax liability' },
      { id: 'capital-gains', name: 'Capital Gains', icon: '💹', component: TaxCalculator, description: 'Calculate capital gains tax' }
    ]
  },
  retirement: {
    title: "Retirement",
    icon: "🏛️",
    color: "purple",
    calculators: [
      { id: 'nps', name: 'NPS Calculator', icon: '🏛️', component: NPSCalculator, description: 'National Pension Scheme calculator' },
      { id: 'epf', name: 'EPF Calculator', icon: '🏢', component: EPFCalculator, description: 'Employee Provident Fund calculator' },
      { id: 'gratuity', name: 'Gratuity Calculator', icon: '🎁', component: GratuityCalculator, description: 'Gratuity calculation for employees' }
    ]
  },
  general: {
    title: "General",
    icon: "🧮",
    color: "gray",
    calculators: [
      { id: 'compound-interest', name: 'Compound Interest', icon: '🧮', component: CompoundInterestCalculator, description: 'Calculate compound interest and growth' },
      { id: 'simple-interest', name: 'Simple Interest', icon: '📊', component: SimpleInterestCalculator, description: 'Calculate simple interest' },
      { id: 'inflation', name: 'Inflation Calculator', icon: '📈', component: InflationCalculator, description: 'Calculate inflation impact over time' }
    ]
  }
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function App() {
  // Function to detect calculator from URL parameters
  const detectCalculatorFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const paramKeys = Array.from(urlParams.keys())

    // First, check for explicit calculator parameter
    const calculatorParam = urlParams.get('calculator')
    if (calculatorParam) {
      // Map calculator names to tab info
      const calculatorNameMap = {
        'income-tax': { mainTab: 'tax', subTab: 'income-tax' },
        'capital-gains': { mainTab: 'tax', subTab: 'capital-gains' },
        'sip': { mainTab: 'mutual_funds', subTab: 'sip' },
        'swp': { mainTab: 'mutual_funds', subTab: 'swp' },
        'cagr': { mainTab: 'mutual_funds', subTab: 'cagr' },
        'emi': { mainTab: 'loans', subTab: 'emi' },
        'mortgage': { mainTab: 'loans', subTab: 'mortgage' },
        'personal-loan': { mainTab: 'loans', subTab: 'personal-loan' },
        'ppf': { mainTab: 'savings', subTab: 'ppf' },
        'fd': { mainTab: 'savings', subTab: 'fd' },
        'rd': { mainTab: 'savings', subTab: 'rd' },
        'nps': { mainTab: 'retirement', subTab: 'nps' },
        'epf': { mainTab: 'retirement', subTab: 'epf' },
        'gratuity': { mainTab: 'retirement', subTab: 'gratuity' },
        'compound-interest': { mainTab: 'general', subTab: 'compound-interest' },
        'simple-interest': { mainTab: 'general', subTab: 'simple-interest' },
        'inflation': { mainTab: 'general', subTab: 'inflation' }
      }

      if (calculatorNameMap[calculatorParam]) {
        return calculatorNameMap[calculatorParam]
      }
    }

    // Fallback: Map of parameter prefixes to calculator info (for backward compatibility)
    const calculatorMap = {
      'tax_': { mainTab: 'tax', subTab: 'income-tax' },
      'sip_': { mainTab: 'mutual_funds', subTab: 'sip' },
      'swp_': { mainTab: 'mutual_funds', subTab: 'swp' },
      'emi_': { mainTab: 'loans', subTab: 'emi' },
      'ppf_': { mainTab: 'savings', subTab: 'ppf' },
      'fd_': { mainTab: 'savings', subTab: 'fd' },
      'rd_': { mainTab: 'savings', subTab: 'rd' },
      'nps_': { mainTab: 'retirement', subTab: 'nps' },
      'epf_': { mainTab: 'retirement', subTab: 'epf' },
      'cagr_': { mainTab: 'mutual_funds', subTab: 'cagr' },
      'compound_': { mainTab: 'general', subTab: 'compound-interest' },
      'simple_': { mainTab: 'general', subTab: 'simple-interest' },
      'inflation_': { mainTab: 'general', subTab: 'inflation' },
      'gratuity_': { mainTab: 'retirement', subTab: 'gratuity' }
    }

    // Find matching calculator by parameter prefix
    for (const paramKey of paramKeys) {
      for (const [prefix, calculator] of Object.entries(calculatorMap)) {
        if (paramKey.startsWith(prefix)) {
          return calculator
        }
      }
    }

    return null
  }

  const detectedCalculator = detectCalculatorFromURL()

  const [activeMainTab, setActiveMainTab] = useState(detectedCalculator?.mainTab || 'loans')
  const [activeSubTabs, setActiveSubTabs] = useState({
    loans: detectedCalculator?.mainTab === 'loans' ? detectedCalculator.subTab : 'emi',
    savings: detectedCalculator?.mainTab === 'savings' ? detectedCalculator.subTab : 'fd',
    mutual_funds: detectedCalculator?.mainTab === 'mutual_funds' ? detectedCalculator.subTab : 'sip',
    tax: detectedCalculator?.mainTab === 'tax' ? detectedCalculator.subTab : 'income-tax',
    retirement: detectedCalculator?.mainTab === 'retirement' ? detectedCalculator.subTab : 'nps',
    general: detectedCalculator?.mainTab === 'general' ? detectedCalculator.subTab : 'compound-interest'
  })
  const [comparisonData, setComparisonData] = useState([])

  const updateCalculatorInURL = useCallback((calculatorId) => {
    const url = new URL(window.location)

    // Clear all existing calculator-specific input parameters (but keep calculator param)
    const keysToRemove = []
    for (const key of url.searchParams.keys()) {
      if (key.includes('_') || key === 'shared') {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => url.searchParams.delete(key))

    // Set the calculator parameter
    url.searchParams.set('calculator', calculatorId)

    // Update URL without page reload
    window.history.replaceState({}, '', url.toString())
  }, [])

  // Set calculator parameter in URL on initial load if not present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const calculatorParam = urlParams.get('calculator')

    if (!calculatorParam) {
      // Set default calculator parameter
      const currentCalculatorId = activeSubTabs[activeMainTab]
      updateCalculatorInURL(currentCalculatorId)
    }
  }, [updateCalculatorInURL]) // Only depend on the callback
  const [showComparison, setShowComparison] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  // PWA Install functionality
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      setDeferredPrompt(null)
    }
  }

  const addToComparison = (calculatorData) => {
    const newData = {
      id: Date.now(),
      calculator: calculatorData.calculator,
      inputs: calculatorData.inputs,
      results: calculatorData.results,
      timestamp: new Date().toISOString()
    }
    setComparisonData(prev => [...prev, newData])
    setShowComparison(true)
  }

  const removeFromComparison = (id) => {
    setComparisonData(prev => prev.filter(item => item.id !== id))
    if (comparisonData.length <= 1) {
      setShowComparison(false)
    }
  }

  const shareApp = () => {
    const shareData = {
      title: 'FinClamp - Financial Calculator Suite',
      text: 'Complete financial calculator suite for all your financial planning needs!',
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('App link copied to clipboard!')
    }
  }

  const handleSubTabChange = (categoryKey, calculatorId) => {
    setActiveSubTabs(prev => ({ ...prev, [categoryKey]: calculatorId }))
    // Update URL with calculator name
    updateCalculatorInURL(calculatorId)
  }

  const handleMainTabChange = (tabKey) => {
    setActiveMainTab(tabKey)
    // Get the default calculator for this tab and update URL
    const defaultCalculator = calculatorData[tabKey]?.calculators[0]?.id
    if (defaultCalculator) {
      updateCalculatorInURL(defaultCalculator)
    }
  }

  const currentCategory = calculatorData[activeMainTab]
  const currentCalculator = currentCategory?.calculators.find(calc => calc.id === activeSubTabs[activeMainTab])

  // Use SEO hook to update meta tags when calculator changes
  const currentCalculatorId = activeSubTabs[activeMainTab]
  useSEO(currentCalculatorId)

  return (
    <CurrencyProvider>
      <ComparisonProvider>
        <div className="min-h-screen bg-gray-50">
          {/* SEO Analytics Component */}
          <SEOAnalytics calculatorId={currentCalculatorId} />

          <Header />

        <motion.div
          className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            currentCalculator={currentCalculator}
            currentCategory={currentCategory}
          />

          {/* Main Category Tabs */}
          <motion.div
            className="mb-6 sm:mb-8"
            variants={fadeInUp}
          >
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200 w-full max-w-5xl mx-2 sm:mx-0">
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {Object.entries(calculatorData).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => handleMainTabChange(key)}
                      className={`px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 cursor-pointer text-sm ${
                        activeMainTab === key
                          ? 'bg-indigo-500 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="hidden sm:inline">{category.title}</span>
                      <span className="sm:hidden text-xs">{category.title.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sub Category Tabs */}
          <motion.div
            className="mb-6 sm:mb-8"
            variants={fadeInUp}
          >
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-200 w-full max-w-4xl mx-2 sm:mx-0">
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {currentCategory?.calculators.map((calc) => (
                    <button
                      key={calc.id}
                      onClick={() => handleSubTabChange(activeMainTab, calc.id)}
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-xs sm:text-sm cursor-pointer ${
                        activeSubTabs[activeMainTab] === calc.id
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm">{calc.icon}</span>
                      <span className="hidden sm:inline">{calc.name}</span>
                      <span className="sm:hidden text-xs">{calc.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Calculator Content */}
          <AnimatePresence mode="wait">
            {currentCalculator && (
              <motion.div
                key={`${activeMainTab}-${activeSubTabs[activeMainTab]}`}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Calculator Header */}
                <div className="px-6 py-4 bg-indigo-500 text-white border-b border-indigo-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{currentCalculator.icon}</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">{currentCalculator.name}</h1>
                      <p className="text-indigo-100 text-sm">{currentCalculator.description}</p>
                    </div>
                  </div>
                </div>

                {/* Calculator Component */}
                <div className="p-6">
                  <currentCalculator.component
                    onAddToComparison={addToComparison}
                    categoryColor={currentCategory.color}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Calculator Description Section */}
          {currentCalculator && (
            <CalculatorDescription
              calculatorId={currentCalculator.id}
              categoryColor={currentCategory.color}
            />
          )}
        </motion.div>
        {/* Floating Action Buttons */}
        <motion.div
          className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50"
          variants={fadeInUp}
        >
          {comparisonData.length > 0 && (
            <motion.button
              onClick={() => setShowComparison(!showComparison)}
              className="w-14 h-14 rounded-full shadow-xl transition-all transform hover:scale-110 relative cursor-pointer"
              style={{ backgroundColor: '#6366F1' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white text-xl">📊</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {comparisonData.length}
              </span>
            </motion.button>
          )}

          <motion.button
            onClick={shareApp}
            className="w-14 h-14 rounded-full shadow-xl transition-all transform hover:scale-110 cursor-pointer"
            style={{ backgroundColor: '#10B981' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white text-xl">🔗</span>
          </motion.button>

          {deferredPrompt && (
            <motion.button
              onClick={handlePWAInstall}
              className="w-14 h-14 rounded-full shadow-xl transition-all transform hover:scale-110 cursor-pointer"
              style={{ backgroundColor: '#10B981' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white text-xl">📱</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Comparison Panel */}
      <AnimatePresence>
        {showComparison && (
          <ComparisonPanel
            data={comparisonData}
            onRemove={removeFromComparison}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>

        {/* Floating Comparison Button */}
        <FloatingComparisonButton />
      </ComparisonProvider>
    </CurrencyProvider>
  )
}
