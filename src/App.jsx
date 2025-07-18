
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

// Calculator Components
import SIPCalculator from './calculators/SIPCalculator'
import EMICalculator from './calculators/EMICalculator'
import FDCalculator from './calculators/FDCalculator'
import TaxCalculator from './calculators/TaxCalculator'
import CAGRCalculator from './calculators/CAGRCalculator'

const calculatorCategories = {
  'mutual-funds': {
    name: 'Mutual Funds',
    icon: '📈',
    calculators: [
      { id: 'sip', name: 'SIP Calculator', component: SIPCalculator },
      { id: 'swp', name: 'SWP Calculator', component: SIPCalculator },
    ]
  },
  'loans': {
    name: 'Loans',
    icon: '🏠',
    calculators: [
      { id: 'emi', name: 'EMI Calculator', component: EMICalculator },
      { id: 'mortgage', name: 'Mortgage Calculator', component: EMICalculator },
    ]
  },
  'savings': {
    name: 'Savings',
    icon: '💰',
    calculators: [
      { id: 'fd', name: 'Fixed Deposit', component: FDCalculator },
      { id: 'rd', name: 'Recurring Deposit', component: FDCalculator },
    ]
  },
  'tax': {
    name: 'Tax',
    icon: '🧾',
    calculators: [
      { id: 'income-tax', name: 'Income Tax', component: TaxCalculator },
    ]
  },
  'general': {
    name: 'General Tools',
    icon: '🔧',
    calculators: [
      { id: 'cagr', name: 'CAGR Calculator', component: CAGRCalculator },
      { id: 'roi', name: 'ROI Calculator', component: CAGRCalculator },
    ]
  }
}

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto">
        <Link to="/" className="text-2xl font-bold">
          💰 Universal Finance Calculator
        </Link>
        <p className="text-blue-100 mt-1">Professional Financial Planning Tools</p>
      </div>
    </header>
  )
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const allCalculators = Object.entries(calculatorCategories).flatMap(([categoryId, category]) =>
    category.calculators.map(calc => ({
      ...calc,
      categoryId,
      categoryName: category.name,
      categoryIcon: category.icon
    }))
  )

  const filteredCalculators = allCalculators.filter(calc => {
    const matchesSearch = calc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || calc.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search calculators..."
            className="flex-1 p-3 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-3 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {Object.entries(calculatorCategories).map(([id, category]) => (
              <option key={id} value={id}>{category.icon} {category.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCalculators.map(calc => (
          <Link
            key={`${calc.categoryId}-${calc.id}`}
            to={`/calculator/${calc.categoryId}/${calc.id}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border"
          >
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{calc.categoryIcon}</span>
              <div>
                <h3 className="text-lg font-semibold">{calc.name}</h3>
                <p className="text-gray-600 text-sm">{calc.categoryName}</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              Calculate and plan your {calc.name.toLowerCase()} with precision
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

function CalculatorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathParts = location.pathname.split('/')
  const categoryId = pathParts[2]
  const calculatorId = pathParts[3]

  const category = calculatorCategories[categoryId]
  const calculator = category?.calculators.find(c => c.id === calculatorId)

  if (!calculator) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Calculator Not Found</h2>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const CalculatorComponent = calculator.component

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 mb-2"
        >
          ← Back to Calculators
        </button>
        <h1 className="text-3xl font-bold flex items-center">
          <span className="mr-3">{category.icon}</span>
          {calculator.name}
        </h1>
      </div>
      <CalculatorComponent />
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
