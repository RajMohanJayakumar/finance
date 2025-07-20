import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import PDFExport from '../components/PDFExport'

// Input component with floating label
const FloatingLabelInput = ({ label, value, onChange, type = "number", icon, placeholder, step, min }) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value && value.toString().length > 0

  const handleKeyDown = (e) => {
    // Prevent 'e', 'E', '+', '-' for number inputs to avoid scientific notation
    if (type === 'number') {
      if (['e', 'E', '+', '-'].includes(e.key)) {
        e.preventDefault()
      }
    }
  }

  return (
    <div className="relative">
      {/* Label positioned above the input */}
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        <span className="mr-2">{icon}</span>
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          step={step}
          min={min}
          className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none"
          style={{
            borderColor: isFocused ? '#10B981' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? 'rgba(16, 185, 129, 0.1) 0px 0px 0px 4px' : 'none'
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default function RDCalculator({ onAddToComparison, categoryColor = 'green' }) {
  const { addToComparison } = useComparison()
  
  const initialInputs = {
    monthlyDeposit: '',
    interestRate: '',
    timePeriod: '',
    maturityAmount: '',
    calculationType: 'maturity' // maturity, reverse-maturity
  }

  const [inputs, setInputs] = useState(initialInputs)
  const [results, setResults] = useState(null)

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
  }

  const calculateRD = () => {
    const monthlyDeposit = parseFloat(inputs.monthlyDeposit) || 0
    const annualRate = parseFloat(inputs.interestRate) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 0
    const targetAmount = parseFloat(inputs.maturityAmount) || 0

    if (inputs.calculationType === 'maturity' && monthlyDeposit > 0 && annualRate > 0 && timePeriod > 0) {
      // Calculate maturity amount for RD
      const monthlyRate = annualRate / (12 * 100)
      const totalMonths = timePeriod * 12
      
      // RD Formula: M = P * [(1 + r)^n - 1] / r * (1 + r)
      const maturityAmount = monthlyDeposit * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))
      const totalInvestment = monthlyDeposit * totalMonths
      const totalInterest = maturityAmount - totalInvestment

      setResults({
        maturityAmount: Math.round(maturityAmount),
        totalInvestment: Math.round(totalInvestment),
        totalInterest: Math.round(totalInterest),
        monthlyDeposit: monthlyDeposit
      })
    } else if (inputs.calculationType === 'reverse-maturity' && targetAmount > 0 && annualRate > 0 && timePeriod > 0) {
      // Calculate required monthly deposit for target amount
      const monthlyRate = annualRate / (12 * 100)
      const totalMonths = timePeriod * 12
      
      const requiredMonthlyDeposit = targetAmount / (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))
      const totalInvestment = requiredMonthlyDeposit * totalMonths
      const totalInterest = targetAmount - totalInvestment

      setResults({
        maturityAmount: targetAmount,
        totalInvestment: Math.round(totalInvestment),
        totalInterest: Math.round(totalInterest),
        monthlyDeposit: Math.round(requiredMonthlyDeposit)
      })
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - RD Calculator Results',
      text: `RD Calculation: Monthly Deposit ₹${inputs.monthlyDeposit}, Maturity ₹${results?.maturityAmount}`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Calculation link copied to clipboard!')
    }
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        calculator: 'RD Calculator',
        inputs: {
          'Monthly Deposit': `₹${inputs.monthlyDeposit || results.monthlyDeposit}`,
          'Interest Rate': `${inputs.interestRate}%`,
          'Time Period': `${inputs.timePeriod} years`
        },
        results: {
          'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
          'Total Investment': `₹${results.totalInvestment?.toLocaleString()}`,
          'Total Interest': `₹${results.totalInterest?.toLocaleString()}`
        },
        timestamp: new Date().toISOString()
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  // Animation variants
  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }

  useEffect(() => {
    if (inputs.monthlyDeposit && inputs.interestRate && inputs.timePeriod) {
      calculateRD()
    }
  }, [inputs])

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            💰 Recurring Deposit Calculator
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Calculate your RD maturity amount and plan your monthly savings
          </p>
        </div>

        <motion.div
          className="space-y-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Calculator Inputs */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            variants={fadeInUp}
          >
            <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
              💰 Recurring Deposit Details
            </h3>

            <div className="space-y-6">
              {/* Calculation Type */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  🧮 Calculation Type
                </label>
                <select
                  value={inputs.calculationType}
                  onChange={(e) => handleInputChange('calculationType', e.target.value)}
                  className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg cursor-pointer"
                >
                  <option value="maturity">Calculate Maturity Amount</option>
                  <option value="reverse-maturity">Calculate Required Monthly Deposit</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputs.calculationType === 'maturity' ? (
                  <FloatingLabelInput
                    label="Monthly Deposit Amount (₹)"
                    value={inputs.monthlyDeposit}
                    onChange={(value) => handleInputChange('monthlyDeposit', value)}
                    icon="💰"
                    placeholder="5,000"
                  />
                ) : (
                  <FloatingLabelInput
                    label="Target Maturity Amount (₹)"
                    value={inputs.maturityAmount}
                    onChange={(value) => handleInputChange('maturityAmount', value)}
                    icon="🎯"
                    placeholder="5,00,000"
                  />
                )}

                <FloatingLabelInput
                  label="Annual Interest Rate (%)"
                  value={inputs.interestRate}
                  onChange={(value) => handleInputChange('interestRate', value)}
                  icon="📈"
                  placeholder="6.5"
                  step="0.1"
                />
              </div>

              <FloatingLabelInput
                label="Time Period (Years)"
                value={inputs.timePeriod}
                onChange={(value) => handleInputChange('timePeriod', value)}
                icon="⏰"
                placeholder="5"
              />

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer"
                >
                  🔄 Reset
                </button>
                <button
                  onClick={calculateRD}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer"
                >
                  📊 Calculate
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h3 className="text-xl font-bold mb-6 text-green-600">
                  📊 RD Calculation Results
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl">
                    <p className="text-sm opacity-90">Monthly Deposit</p>
                    <p className="text-2xl font-bold">₹{results.monthlyDeposit?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                    <p className="text-sm opacity-90">Maturity Amount</p>
                    <p className="text-2xl font-bold">₹{results.maturityAmount?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                    <p className="text-sm opacity-90">Total Investment</p>
                    <p className="text-2xl font-bold">₹{results.totalInvestment?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                    <p className="text-sm opacity-90">Total Interest</p>
                    <p className="text-2xl font-bold">₹{results.totalInterest?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={handleAddToComparison}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer"
                  >
                    📊 Add to Compare
                  </button>
                  <button
                    onClick={shareCalculation}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer"
                  >
                    🔗 Share
                  </button>
                  <PDFExport
                    data={[{
                      calculator: 'RD Calculator',
                      timestamp: new Date().toISOString(),
                      inputs: {
                        'Monthly Deposit': `₹${inputs.monthlyDeposit || results.monthlyDeposit}`,
                        'Interest Rate': `${inputs.interestRate}%`,
                        'Time Period': `${inputs.timePeriod} years`
                      },
                      results: {
                        'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
                        'Total Investment': `₹${results.totalInvestment?.toLocaleString()}`,
                        'Total Interest': `₹${results.totalInterest?.toLocaleString()}`
                      }
                    }]}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
