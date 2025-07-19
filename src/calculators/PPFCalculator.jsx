import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import PDFExport from '../components/PDFExport'

// Input component with floating label
const FloatingLabelInput = ({ label, value, onChange, type = "number", icon, placeholder, step, min, max }) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value && value.toString().length > 0

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
          step={step}
          min={min}
          max={max}
          className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none"
          style={{
            borderColor: isFocused ? '#7C3AED' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? 'rgba(124, 58, 237, 0.1) 0px 0px 0px 4px' : 'none'
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default function PPFCalculator({ onAddToComparison, categoryColor = 'green' }) {
  const { addToComparison } = useComparison()
  
  const initialInputs = {
    annualDeposit: '',
    timePeriod: '15', // PPF has 15-year lock-in
    interestRate: '7.1', // Current PPF rate
    calculationType: 'maturity'
  }

  const [inputs, setInputs] = useState(initialInputs)
  const [results, setResults] = useState(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState([])

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
    setYearlyBreakdown([])
  }

  const calculatePPF = () => {
    const annualDeposit = parseFloat(inputs.annualDeposit) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 15
    const annualRate = parseFloat(inputs.interestRate) || 7.1

    if (annualDeposit > 0 && timePeriod > 0 && annualRate > 0) {
      // PPF calculation with compound interest
      const rate = annualRate / 100
      let maturityAmount = 0
      let totalInvestment = annualDeposit * timePeriod
      let breakdown = []

      // Calculate year by year
      for (let year = 1; year <= timePeriod; year++) {
        // Each year's deposit earns interest for remaining years
        const yearsRemaining = timePeriod - year + 1
        const yearContribution = annualDeposit * Math.pow(1 + rate, yearsRemaining - 1)
        maturityAmount += yearContribution

        breakdown.push({
          year: year,
          deposit: annualDeposit,
          totalDeposited: annualDeposit * year,
          interestEarned: Math.round(maturityAmount - (annualDeposit * year)),
          balance: Math.round(maturityAmount)
        })
      }

      const totalInterest = maturityAmount - totalInvestment

      setResults({
        maturityAmount: Math.round(maturityAmount),
        totalInvestment: Math.round(totalInvestment),
        totalInterest: Math.round(totalInterest),
        annualDeposit: annualDeposit
      })

      setYearlyBreakdown(breakdown)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - PPF Calculator Results',
      text: `PPF Calculation: Annual Deposit ₹${inputs.annualDeposit}, Maturity ₹${results?.maturityAmount?.toLocaleString()}`,
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
        calculator: 'PPF Calculator',
        inputs: {
          'Annual Deposit': `₹${inputs.annualDeposit}`,
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
    if (inputs.annualDeposit && inputs.interestRate && inputs.timePeriod) {
      calculatePPF()
    }
  }, [inputs])

  const pieData = results ? [
    { name: 'Principal', value: results.totalInvestment, fill: '#10B981' },
    { name: 'Interest', value: results.totalInterest, fill: '#3B82F6' }
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            🛡️ PPF Calculator
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Calculate your Public Provident Fund maturity amount with tax benefits
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
              🛡️ PPF Investment Details
            </h3>

            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>PPF Benefits:</strong> Tax deduction under 80C, tax-free interest, 15-year lock-in period, minimum ₹500 and maximum ₹1.5 lakh per year
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingLabelInput
                  label="Annual Deposit Amount (₹)"
                  value={inputs.annualDeposit}
                  onChange={(value) => handleInputChange('annualDeposit', value)}
                  icon="💰"
                  placeholder="1,50,000"
                  min="500"
                  max="150000"
                />

                <FloatingLabelInput
                  label="Interest Rate (% per annum)"
                  value={inputs.interestRate}
                  onChange={(value) => handleInputChange('interestRate', value)}
                  icon="📈"
                  placeholder="7.1"
                  step="0.1"
                />
              </div>

              <FloatingLabelInput
                label="Investment Period (Years)"
                value={inputs.timePeriod}
                onChange={(value) => handleInputChange('timePeriod', value)}
                icon="⏰"
                placeholder="15"
                min="15"
              />

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800">
                  ⚠️ <strong>Note:</strong> PPF has a mandatory 15-year lock-in period. Partial withdrawals allowed after 7th year.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer"
                >
                  🔄 Reset
                </button>
                <button
                  onClick={calculatePPF}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer"
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
                <h3 className="text-xl font-bold mb-6 text-purple-600">
                  📊 PPF Calculation Results
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl">
                    <p className="text-sm opacity-90">Annual Deposit</p>
                    <p className="text-2xl font-bold">₹{results.annualDeposit?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl">
                    <p className="text-sm opacity-90">Maturity Amount</p>
                    <p className="text-2xl font-bold">₹{results.maturityAmount?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                    <p className="text-sm opacity-90">Total Investment</p>
                    <p className="text-2xl font-bold">₹{results.totalInvestment?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                    <p className="text-sm opacity-90">Total Interest</p>
                    <p className="text-2xl font-bold">₹{results.totalInterest?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Pie Chart */}
                {pieData.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4 text-center">Investment Breakdown</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

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
                      calculator: 'PPF Calculator',
                      timestamp: new Date().toISOString(),
                      inputs: {
                        'Annual Deposit': `₹${inputs.annualDeposit}`,
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
