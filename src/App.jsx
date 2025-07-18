
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

// Calculator Components
import SIPCalculator from './calculators/SIPCalculator'
import EMICalculator from './calculators/EMICalculator'
import FDCalculator from './calculators/FDCalculator'
import TaxCalculator from './calculators/TaxCalculator'
import CAGRCalculator from './calculators/CAGRCalculator'

const calculators = {
  loans: [
    { id: 'emi', name: 'EMI Calculator', description: 'Calculate loan EMI and reverse EMI' },
    { id: 'mortgage', name: 'Mortgage Calculator', description: 'Home loan calculator' },
    { id: 'personal-loan', name: 'Personal Loan', description: 'Personal loan calculator' }
  ],
  savings: [
    { id: 'fd', name: 'Fixed Deposit', description: 'FD maturity calculator' },
    { id: 'rd', name: 'Recurring Deposit', description: 'RD maturity calculator' },
    { id: 'ppf', name: 'PPF Calculator', description: 'Public Provident Fund calculator' }
  ],
  mutual_funds: [
    { id: 'sip', name: 'SIP Calculator', description: 'Systematic Investment Plan calculator' },
    { id: 'swp', name: 'SWP Calculator', description: 'Systematic Withdrawal Plan calculator' },
    { id: 'cagr', name: 'CAGR Calculator', description: 'Compound Annual Growth Rate calculator' }
  ],
  tax: [
    { id: 'income-tax', name: 'Income Tax Calculator', description: 'Calculate income tax liability' },
    { id: 'capital-gains', name: 'Capital Gains Tax', description: 'Calculate capital gains tax' }
  ]
}

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-2xl font-bold">Universal Finance Calculator</Link>
        <p className="text-blue-100 mt-1">Your one-stop solution for all financial calculations</p>
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Universal Finance Calculator</h1>
        <p className="text-gray-600 mb-6">Calculate loans, savings, mutual funds, and taxes with our comprehensive financial tools</p>
        
        <div className="flex justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search calculators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg w-64"
          />
          <button
            onClick={generateShareUrl}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Share App
          </button>
        </div>
        
        {shareUrl && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            URL copied to clipboard: {shareUrl}
          </div>
        )}
      </div>

      <div className="grid gap-8">
        {Object.entries(calculators).map(([category, items]) => (
          <div key={category} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 capitalize">{category.replace('_', ' ')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
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
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Calculator Coming Soon</h2>
            <p className="text-gray-600 mb-6">This calculator is under development.</p>
            <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
          </div>
        )
    }
  }

  return (
    <div>
      <div className="bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
      {renderCalculator()}
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator/:category/:id" element={<CalculatorPage />} />
        </Routes>
      </div>
    </Router>
  )
}
