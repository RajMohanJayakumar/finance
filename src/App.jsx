
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

const calculatorData = {
  loans: {
    title: "💰 Loans",
    color: "blue",
    calculators: [
      { id: 'emi', name: 'EMI Calculator', icon: '🏠', component: EMICalculator, description: 'Calculate loan EMI and repayment schedule' },
      { id: 'mortgage', name: 'Mortgage Calculator', icon: '🏡', component: EMICalculator, description: 'Home loan calculator with advanced features' },
      { id: 'personal-loan', name: 'Personal Loan', icon: '💳', component: EMICalculator, description: 'Personal loan EMI calculator' }
    ]
  },
  savings: {
    title: "🏦 Savings",
    color: "green", 
    calculators: [
      { id: 'fd', name: 'Fixed Deposit', icon: '🏦', component: FDCalculator, description: 'Calculate FD maturity amount and returns' },
      { id: 'rd', name: 'Recurring Deposit', icon: '💰', component: FDCalculator, description: 'RD maturity calculator' },
      { id: 'ppf', name: 'PPF Calculator', icon: '🛡️', component: FDCalculator, description: 'Public Provident Fund calculator' }
    ]
  },
  mutual_funds: {
    title: "📈 Mutual Funds", 
    color: "purple",
    calculators: [
      { id: 'sip', name: 'SIP Calculator', icon: '📈', component: SIPCalculator, description: 'Systematic Investment Plan calculator' },
      { id: 'swp', name: 'SWP Calculator', icon: '📉', component: SWPCalculator, description: 'Systematic Withdrawal Plan calculator' },
      { id: 'cagr', name: 'CAGR Calculator', icon: '📊', component: CAGRCalculator, description: 'Compound Annual Growth Rate calculator' }
    ]
  },
  tax: {
    title: "🧾 Tax",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Tabs */}
        <Tabs 
          selectedIndex={mainTabIndex} 
          onSelect={setMainTabIndex}
          className="apple-tabs"
        >
          <div className="mb-8">
            <TabList className="flex justify-center space-x-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-200/50 max-w-2xl mx-auto">
              {Object.entries(calculatorData).map(([key, category]) => (
                <Tab 
                  key={key}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer outline-none ${
                    category.color === 'blue' ? 'focus:bg-blue-500 focus:text-white react-tabs__tab--selected:bg-blue-500 react-tabs__tab--selected:text-white' :
                    category.color === 'green' ? 'focus:bg-green-500 focus:text-white react-tabs__tab--selected:bg-green-500 react-tabs__tab--selected:text-white' :
                    category.color === 'purple' ? 'focus:bg-purple-500 focus:text-white react-tabs__tab--selected:bg-purple-500 react-tabs__tab--selected:text-white' :
                    'focus:bg-red-500 focus:text-white react-tabs__tab--selected:bg-red-500 react-tabs__tab--selected:text-white'
                  } hover:bg-gray-100 text-gray-600`}
                >
                  {category.title}
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
                  <TabList className="flex justify-center flex-wrap gap-3 mb-8">
                    {category.calculators.map((calc, index) => (
                      <Tab 
                        key={calc.id}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer outline-none border-2 border-transparent ${
                          category.color === 'blue' ? 'hover:border-blue-200 react-tabs__tab--selected:bg-blue-50 react-tabs__tab--selected:border-blue-500 react-tabs__tab--selected:text-blue-700' :
                          category.color === 'green' ? 'hover:border-green-200 react-tabs__tab--selected:bg-green-50 react-tabs__tab--selected:border-green-500 react-tabs__tab--selected:text-green-700' :
                          category.color === 'purple' ? 'hover:border-purple-200 react-tabs__tab--selected:bg-purple-50 react-tabs__tab--selected:border-purple-500 react-tabs__tab--selected:text-purple-700' :
                          'hover:border-red-200 react-tabs__tab--selected:bg-red-50 react-tabs__tab--selected:border-red-500 react-tabs__tab--selected:text-red-700'
                        } bg-white shadow-sm hover:shadow-md text-gray-600`}
                      >
                        <span className="text-lg">{calc.icon}</span>
                        <span>{calc.name}</span>
                      </Tab>
                    ))}
                  </TabList>
                </div>

                {category.calculators.map((calc, calcIndex) => (
                  <TabPanel key={calc.id}>
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
                      <div className={`p-6 ${
                        category.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        category.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        category.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      } text-white`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold flex items-center space-x-2">
                              <span>{calc.icon}</span>
                              <span>{calc.name}</span>
                            </h2>
                            <p className="text-white/90 mt-1">{calc.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
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
    </div>
  )
}
