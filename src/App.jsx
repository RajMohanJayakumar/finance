
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
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
    { id: 'emi', name: 'EMI Calculator', description: 'Calculate loan EMI and reverse EMI', icon: '🏠' },
    { id: 'mortgage', name: 'Mortgage Calculator', description: 'Home loan calculator', icon: '🏡' },
    { id: 'personal-loan', name: 'Personal Loan', description: 'Personal loan calculator', icon: '💳' }
  ],
  savings: [
    { id: 'fd', name: 'Fixed Deposit', description: 'FD maturity calculator', icon: '🏦' },
    { id: 'rd', name: 'Recurring Deposit', description: 'RD maturity calculator', icon: '💰' },
    { id: 'ppf', name: 'PPF Calculator', description: 'Public Provident Fund calculator', icon: '🛡️' }
  ],
  mutual_funds: [
    { id: 'sip', name: 'SIP Calculator', description: 'Systematic Investment Plan calculator', icon: '📈' },
    { id: 'swp', name: 'SWP Calculator', description: 'Systematic Withdrawal Plan calculator', icon: '📉' },
    { id: 'cagr', name: 'CAGR Calculator', description: 'Compound Annual Growth Rate calculator', icon: '📊' }
  ],
  tax: [
    { id: 'income-tax', name: 'Income Tax Calculator', description: 'Calculate income tax liability', icon: '🧾' },
    { id: 'capital-gains', name: 'Capital Gains Tax', description: 'Calculate capital gains tax', icon: '💹' }
  ]
}

function Header() {
  return (
    <header className="header-gradient text-white p-6 shadow-2xl">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="block">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
            💰 Universal Finance Calculator
          </h1>
          <p className="text-blue-100 text-lg">Your one-stop solution for all financial calculations</p>
        </Link>
      </div>
    </header>
  )
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [shareUrl, setShareUrl] = useState('')

  const generateShareUrl = () => {
    const currentUrl = window.location.origin
    setShareUrl(currentUrl)
    navigator.clipboard.writeText(currentUrl)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Choose Your Calculator
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Calculate loans, savings, mutual funds, and taxes with our comprehensive financial tools
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search calculators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-6 py-4 border-2 border-gray-200 rounded-2xl w-80 text-lg input-focus"
              />
            </div>
            <button
              onClick={generateShareUrl}
              className="btn-primary text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2"
            >
              🔗 Share App
            </button>
          </div>
          
          {shareUrl && (
            <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-2xl mb-8 max-w-2xl mx-auto">
              ✅ URL copied to clipboard: {shareUrl}
            </div>
          )}
        </div>

        <div className="grid gap-8">
          {Object.entries(calculators).map(([category, items]) => (
            <div key={category} className="calculator-card rounded-2xl p-8">
              <h3 className="text-3xl font-bold mb-6 capitalize text-gray-800">
                {category.replace('_', ' ')} Calculators
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items
                  .filter(item => 
                    searchTerm === '' || 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(item => (
                  <Link
                    key={item.id}
                    to={`/calculator/${category}/${item.id}`}
                    className="block p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-300 card-hover transition-all bg-white"
                  >
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h4 className="font-bold text-xl mb-3 text-gray-800">{item.name}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CalculatorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathParts = location.pathname.split('/')
  const category = pathParts[2]
  const id = pathParts[3]

  const renderCalculator = () => {
    switch(id) {
      case 'sip':
        return <SIPCalculator />
      case 'swp':
        return <SWPCalculator />
      case 'emi':
      case 'mortgage':
      case 'personal-loan':
        return <EMICalculator />
      case 'fd':
      case 'rd':
      case 'ppf':
        return <FDCalculator />
      case 'income-tax':
      case 'capital-gains':
        return <TaxCalculator />
      case 'cagr':
        return <CAGRCalculator />
      default:
        return (
          <div className="max-w-4xl mx-auto p-8 text-center">
            <div className="text-8xl mb-6">🚧</div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Calculator Coming Soon</h2>
            <p className="text-xl text-gray-600 mb-8">This calculator is under development.</p>
            <Link to="/" className="btn-primary text-white px-8 py-4 rounded-2xl font-semibold">
              ← Back to Home
            </Link>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
      {renderCalculator()}
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator/:category/:id" element={<CalculatorPage />} />
        </Routes>
      </div>
    </Router>
  )
}
