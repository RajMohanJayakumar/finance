
import React, { useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import './App.css'

// Calculator Components
import SIPCalculator from './calculators/SIPCalculator'
import SWPCalculator from './calculators/SWPCalculator'
import EMICalculator from './calculators/EMICalculator'
import FDCalculator from './calculators/FDCalculator'
import TaxCalculator from './calculators/TaxCalculator'
import CAGRCalculator from './calculators/CAGRCalculator'

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
  }
}

export default function App() {
  const [mainTabIndex, setMainTabIndex] = useState(0)
  const [subTabIndexes, setSubTabIndexes] = useState({ loans: 0, savings: 0, mutual_funds: 0, tax: 0 })
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

  const handleSubTabChange = (categoryKey, index) => {
    setSubTabIndexes(prev => ({ ...prev, [categoryKey]: index }))
  }

  return (
    <ComparisonProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-5 blur-3xl"></div>
        </div>
      <Header />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Tabs */}
        <Tabs 
          selectedIndex={mainTabIndex} 
          onSelect={setMainTabIndex}
          className="apple-tabs"
        >
          <div className="mb-8">
            <TabList className="flex justify-center space-x-3 bg-white/90 backdrop-blur-xl p-3 rounded-3xl shadow-2xl border border-white/20 max-w-3xl mx-auto">
              {Object.entries(calculatorData).map(([key, category]) => (
                <Tab
                  key={key}
                  className={`px-8 py-4 rounded-2xl font-bold transition-all duration-500 cursor-pointer outline-none transform hover:scale-105 ${
                    category.color === 'blue' ? 'focus:bg-gradient-to-r focus:from-blue-500 focus:to-blue-600 focus:text-white focus:shadow-xl react-tabs__tab--selected:bg-gradient-to-r react-tabs__tab--selected:from-blue-500 react-tabs__tab--selected:to-blue-600 react-tabs__tab--selected:text-white react-tabs__tab--selected:shadow-xl' :
                    category.color === 'green' ? 'focus:bg-gradient-to-r focus:from-emerald-500 focus:to-emerald-600 focus:text-white focus:shadow-xl react-tabs__tab--selected:bg-gradient-to-r react-tabs__tab--selected:from-emerald-500 react-tabs__tab--selected:to-emerald-600 react-tabs__tab--selected:text-white react-tabs__tab--selected:shadow-xl' :
                    category.color === 'purple' ? 'focus:bg-gradient-to-r focus:from-purple-500 focus:to-purple-600 focus:text-white focus:shadow-xl react-tabs__tab--selected:bg-gradient-to-r react-tabs__tab--selected:from-purple-500 react-tabs__tab--selected:to-purple-600 react-tabs__tab--selected:text-white react-tabs__tab--selected:shadow-xl' :
                    'focus:bg-gradient-to-r focus:from-red-500 focus:to-red-600 focus:text-white focus:shadow-xl react-tabs__tab--selected:bg-gradient-to-r react-tabs__tab--selected:from-red-500 react-tabs__tab--selected:to-red-600 react-tabs__tab--selected:text-white react-tabs__tab--selected:shadow-xl'
                  } hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 text-gray-700 hover:text-gray-800 hover:shadow-lg`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-xl">{category.icon}</span>
                    <span>{category.title}</span>
                  </span>
                </Tab>
              ))}
            </TabList>
          </div>

          {/* Sub Tabs and Calculator Content */}
          {Object.entries(calculatorData).map(([categoryKey, category], categoryIndex) => (
            <TabPanel key={categoryKey}>
              <Tabs 
                selectedIndex={subTabIndexes[categoryKey]} 
                onSelect={(index) => handleSubTabChange(categoryKey, index)}
                className="sub-tabs"
              >
                <div className="mb-6">
                  <TabList className="flex justify-center flex-wrap gap-4 mb-8">
                    {category.calculators.map((calc, index) => (
                      <Tab
                        key={calc.id}
                        className={`group flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 cursor-pointer outline-none border-2 border-transparent transform hover:scale-105 ${
                          category.color === 'blue' ? 'hover:border-blue-300 hover:shadow-blue-200/50 react-tabs__tab--selected:bg-gradient-to-r react-tabs__tab--selected:from-blue-500 react-tabs__tab--selected:to-blue-600 react-tabs__tab--selected:border-blue-500 react-tabs__tab--selected:text-white react-tabs__tab--selected:shadow-xl react-tabs__tab--selected:shadow-blue-500/30' :
                          category.color === 'green' ? 'hover:border-emerald-300 hover:shadow-emerald-200/50 react-tabs__tab--selected:bg-gradient-to-r react-tabs__tab--selected:from-emerald-500 react-tabs__tab--selected:to-emerald-600 react-tabs__tab--selected:border-emerald-500 react-tabs__tab--selected:text-white react-tabs__tab--selected:shadow-xl react-tabs__tab--selected:shadow-emerald-500/30' :
                          category.color === 'purple' ? 'hover:border-purple-300 hover:shadow-purple-200/50 react-tabs__tab--selected:bg-gradient-to-r react-tabs__tab--selected:from-purple-500 react-tabs__tab--selected:to-purple-600 react-tabs__tab--selected:border-purple-500 react-tabs__tab--selected:text-white react-tabs__tab--selected:shadow-xl react-tabs__tab--selected:shadow-purple-500/30' :
                          'hover:border-red-300 hover:shadow-red-200/50 react-tabs__tab--selected:bg-gradient-to-r react-tabs__tab--selected:from-red-500 react-tabs__tab--selected:to-red-600 react-tabs__tab--selected:border-red-500 react-tabs__tab--selected:text-white react-tabs__tab--selected:shadow-xl react-tabs__tab--selected:shadow-red-500/30'
                        } bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl text-gray-700 hover:bg-white`}
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">{calc.icon}</span>
                        <div className="flex flex-col">
                          <span className="font-bold">{calc.name}</span>
                          <span className="text-xs opacity-70 font-normal">{calc.description}</span>
                        </div>
                      </Tab>
                    ))}
                  </TabList>
                </div>

                {category.calculators.map((calc, calcIndex) => (
                  <TabPanel key={calc.id}>
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
                      {/* Decorative Elements */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                      <div className={`relative p-8 ${
                        category.color === 'blue' ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700' :
                        category.color === 'green' ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700' :
                        category.color === 'purple' ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700' :
                        'bg-gradient-to-br from-red-500 via-red-600 to-red-700'
                      } text-white overflow-hidden`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12"></div>
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <h2 className="text-3xl font-bold flex items-center space-x-3 mb-2">
                              <span className="text-4xl">{calc.icon}</span>
                              <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">{calc.name}</span>
                            </h2>
                            <p className="text-white/90 text-lg font-medium">{calc.description}</p>
                            <div className="mt-3 flex items-center space-x-2">
                              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                              <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 bg-gradient-to-br from-gray-50/50 to-white/80 backdrop-blur-sm">
                        <calc.component 
                          onAddToComparison={addToComparison}
                          categoryColor={category.color}
                        />
                      </div>
                    </div>
                  </TabPanel>
                ))}
              </Tabs>
            </TabPanel>
          ))}
        </Tabs>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
          {comparisonData.length > 0 && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110 relative"
            >
              📊
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {comparisonData.length}
              </span>
            </button>
          )}
          
          <button
            onClick={shareApp}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110"
          >
            🔗
          </button>
          
          {deferredPrompt && (
            <button
              onClick={handlePWAInstall}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110"
            >
              📱
            </button>
          )}
        </div>
      </div>

      {/* Comparison Panel */}
      {showComparison && (
        <ComparisonPanel
          data={comparisonData}
          onRemove={removeFromComparison}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Floating Comparison Button */}
      <FloatingComparisonButton />
      </div>
    </ComparisonProvider>
  )
}
