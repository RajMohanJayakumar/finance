
import React, { useState } from 'react'
import './App.css'

// Calculator Components
import SIPCalculator from './calculators/SIPCalculator'
import SWPCalculator from './calculators/SWPCalculator'
import EMICalculator from './calculators/EMICalculator'
import FDCalculator from './calculators/FDCalculator'
import TaxCalculator from './calculators/TaxCalculator'
import CAGRCalculator from './calculators/CAGRCalculator'

const calculators = {
  loans: [
    { id: 'emi', name: 'EMI Calculator', description: 'Calculate loan EMI and reverse EMI', icon: '🏠', component: EMICalculator },
    { id: 'mortgage', name: 'Mortgage Calculator', description: 'Home loan calculator', icon: '🏡', component: EMICalculator },
    { id: 'personal-loan', name: 'Personal Loan', description: 'Personal loan calculator', icon: '💳', component: EMICalculator }
  ],
  savings: [
    { id: 'fd', name: 'Fixed Deposit', description: 'FD maturity calculator', icon: '🏦', component: FDCalculator },
    { id: 'rd', name: 'Recurring Deposit', description: 'RD maturity calculator', icon: '💰', component: FDCalculator },
    { id: 'ppf', name: 'PPF Calculator', description: 'Public Provident Fund calculator', icon: '🛡️', component: FDCalculator }
  ],
  mutual_funds: [
    { id: 'sip', name: 'SIP Calculator', description: 'Systematic Investment Plan calculator', icon: '📈', component: SIPCalculator },
    { id: 'swp', name: 'SWP Calculator', description: 'Systematic Withdrawal Plan calculator', icon: '📉', component: SWPCalculator },
    { id: 'cagr', name: 'CAGR Calculator', description: 'Compound Annual Growth Rate calculator', icon: '📊', component: CAGRCalculator }
  ],
  tax: [
    { id: 'income-tax', name: 'Income Tax Calculator', description: 'Calculate income tax liability', icon: '🧾', component: TaxCalculator },
    { id: 'capital-gains', name: 'Capital Gains Tax', description: 'Calculate capital gains tax', icon: '💹', component: TaxCalculator }
  ]
}

function Header() {
  return (
    <header className="header-gradient text-white p-6 shadow-2xl">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
          💰 Universal Finance Calculator
        </h1>
        <p className="text-slate-100 text-lg">Your one-stop solution for all financial calculations</p>
      </div>
    </header>
  )
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCalculator, setActiveCalculator] = useState(null)
  const [collapsedCategories, setCollapsedCategories] = useState({
    loans: false,
    savings: false,
    mutual_funds: false,
    tax: false
  })
  const [shareUrl, setShareUrl] = useState('')
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

  const generateShareUrl = () => {
    const currentUrl = window.location.origin
    setShareUrl(currentUrl)
    navigator.clipboard.writeText(currentUrl)
  }

  const toggleCategory = (category) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const openCalculator = (calculator) => {
    setActiveCalculator(calculator)
  }

  const closeCalculator = () => {
    setActiveCalculator(null)
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'Universal Finance Calculator',
      text: 'Check out this comprehensive financial calculator suite!',
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (activeCalculator) {
    const CalculatorComponent = activeCalculator.component
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-zinc-50">
        <Header />
        <div className="max-w-7xl mx-auto p-4">
          <div className="mb-6">
            <button
              onClick={closeCalculator}
              className="bg-gradient-to-r from-slate-600 to-stone-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-slate-700 hover:to-stone-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              ← Back to Calculators
            </button>
          </div>
          <CalculatorComponent />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-zinc-50">
      <Header />
      
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-600 to-stone-600 bg-clip-text text-transparent mb-6">
            Choose Your Calculator
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Calculate loans, savings, mutual funds, and taxes with our comprehensive financial tools
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search calculators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-6 py-4 border-2 border-slate-200 rounded-2xl w-80 text-lg input-focus bg-white"
              />
            </div>
            <button
              onClick={generateShareUrl}
              className="btn-primary text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2"
            >
              🔗 Share App
            </button>
            {deferredPrompt && (
              <button
                onClick={handlePWAInstall}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
              >
                📱 Install App
              </button>
            )}
          </div>
          
          {shareUrl && (
            <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-700 px-6 py-4 rounded-2xl mb-8 max-w-2xl mx-auto">
              ✅ URL copied to clipboard: {shareUrl}
            </div>
          )}
        </div>

        <div className="grid gap-6">
          {Object.entries(calculators).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-6 bg-gradient-to-r from-slate-600 to-stone-600 text-white font-semibold text-left flex justify-between items-center hover:from-slate-700 hover:to-stone-700 transition-all"
              >
                <span className="text-2xl capitalize">
                  {category.replace('_', ' ')} Calculators
                </span>
                <span className="text-2xl">
                  {collapsedCategories[category] ? '▼' : '▲'}
                </span>
              </button>
              
              {!collapsedCategories[category] && (
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items
                      .filter(item => 
                        searchTerm === '' || 
                        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(item => (
                      <button
                        key={item.id}
                        onClick={() => openCalculator(item)}
                        className="block p-6 border-2 border-slate-200 rounded-2xl hover:border-slate-300 card-hover transition-all bg-white text-left w-full"
                      >
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h4 className="font-bold text-xl mb-3 text-slate-800">{item.name}</h4>
                        <p className="text-slate-600">{item.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center mt-8">
          <h3 className="text-xl font-bold mb-4 text-slate-800">📤 Share This App</h3>
          <button
            onClick={shareCalculation}
            className="bg-gradient-to-r from-slate-600 to-stone-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-slate-700 hover:to-stone-700 transition-all transform hover:scale-105 shadow-lg"
          >
            🔗 Share with Friends
          </button>
        </div>
      </div>
    </div>
  )
}
