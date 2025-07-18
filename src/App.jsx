
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import './styles/mobile.css'

// Calculator Components
import SIPCalculator from './calculators/SIPCalculator'
import SWPCalculator from './calculators/SWPCalculator'
import EMICalculator from './calculators/EMICalculator'
import FDCalculator from './calculators/FDCalculator'
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

// Context
import { ComparisonProvider, useComparison } from './contexts/ComparisonContext'

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
      { id: 'rd', name: 'Recurring Deposit', icon: '💰', component: FDCalculator, description: 'RD maturity calculator' },
      { id: 'ppf', name: 'PPF Calculator', icon: '🛡️', component: FDCalculator, description: 'Public Provident Fund calculator' }
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
  const [activeMainTab, setActiveMainTab] = useState('loans')
  const [activeSubTabs, setActiveSubTabs] = useState({
    loans: 'emi',
    savings: 'fd',
    mutual_funds: 'sip',
    tax: 'income-tax',
    retirement: 'nps',
    general: 'compound-interest'
  })
  const [comparisonData, setComparisonData] = useState([])
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
      title: 'Universal Finance Calculator',
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
  }

  const currentCategory = calculatorData[activeMainTab]
  const currentCalculator = currentCategory?.calculators.find(calc => calc.id === activeSubTabs[activeMainTab])

  return (
    <ComparisonProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
        <Header />

        <motion.div
          className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Main Category Tabs */}
          <motion.div
            className="mb-6 sm:mb-8"
            variants={fadeInUp}
          >
            <div className="flex justify-center">
              <div className="bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-lg border border-gray-200 w-full max-w-5xl mx-2 sm:mx-0">
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {Object.entries(calculatorData).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setActiveMainTab(key)}
                      className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-1 sm:space-x-2 cursor-pointer text-xs sm:text-sm lg:text-base ${
                        activeMainTab === key
                          ? 'text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor: activeMainTab === key ? '#6366F1' : 'transparent'
                      }}
                    >
                      <span className="text-sm sm:text-lg">{category.icon}</span>
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
              <div className="bg-white rounded-lg sm:rounded-xl p-1.5 shadow-md border border-gray-100 w-full max-w-4xl mx-2 sm:mx-0">
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {currentCategory?.calculators.map((calc) => (
                    <button
                      key={calc.id}
                      onClick={() => handleSubTabChange(activeMainTab, calc.id)}
                      className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm cursor-pointer ${
                        activeSubTabs[activeMainTab] === calc.id
                          ? 'text-white shadow-md'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor: activeSubTabs[activeMainTab] === calc.id ? '#10B981' : 'transparent'
                      }}
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
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0px 25px 50px -12px' }}
              >
                {/* Calculator Header */}
                <div
                  className="px-8 py-6 text-white relative overflow-hidden"
                  style={{ backgroundColor: '#6366F1' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{currentCalculator.icon}</span>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">{currentCalculator.name}</h1>
                        <p className="text-white/80 text-sm">{currentCalculator.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculator Component */}
                <div className="p-8">
                  <currentCalculator.component
                    onAddToComparison={addToComparison}
                    categoryColor={currentCategory.color}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
  )
}
