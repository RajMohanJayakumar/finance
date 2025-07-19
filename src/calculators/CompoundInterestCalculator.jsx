import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import PDFExport from '../components/PDFExport'

// Input component with floating label
const FloatingLabelInput = ({ label, value, onChange, type = "number", icon, placeholder, step, min }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
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
          className="w-full px-4 py-4 text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none"
          style={{
            borderColor: isFocused ? '#3B82F6' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? 'rgba(59, 130, 246, 0.1) 0px 0px 0px 4px' : 'none'
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default function CompoundInterestCalculator({ onAddToComparison, categoryColor = 'blue' }) {
  const { addToComparison } = useComparison()

  const initialInputs = {
    principal: '',
    interestRate: '',
    timePeriod: '',
    compoundingFrequency: '1' // 1=annually, 2=semi-annually, 4=quarterly, 12=monthly, 365=daily
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

  const calculateCompoundInterest = () => {
    const principal = parseFloat(inputs.principal) || 0
    const interestRate = parseFloat(inputs.interestRate) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 0
    const compoundingFrequency = parseFloat(inputs.compoundingFrequency) || 1

    if (principal <= 0 || interestRate <= 0 || timePeriod <= 0) return

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const rate = interestRate / 100
    const amount = principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * timePeriod)
    const compoundInterest = amount - principal

    // Calculate simple interest for comparison
    const simpleInterest = principal * rate * timePeriod
    const simpleAmount = principal + simpleInterest

    // Generate year-wise breakdown
    const yearlyBreakdown = []
    for (let year = 1; year <= Math.min(timePeriod, 20); year++) {
      const yearlyAmount = principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * year)
      const yearlySimpleAmount = principal + (principal * rate * year)
      yearlyBreakdown.push({
        year,
        compound: Math.round(yearlyAmount),
        simple: Math.round(yearlySimpleAmount),
        difference: Math.round(yearlyAmount - yearlySimpleAmount)
      })
    }

    setResults({
      amount: Math.round(amount),
      compoundInterest: Math.round(compoundInterest),
      simpleInterest: Math.round(simpleInterest),
      simpleAmount: Math.round(simpleAmount),
      difference: Math.round(compoundInterest - simpleInterest),
      yearlyBreakdown,
      effectiveRate: ((amount / principal) ** (1 / timePeriod) - 1) * 100
    })
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'Compound Interest Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Principal Amount': `₹${inputs.principal}`,
          'Interest Rate': `${inputs.interestRate}%`,
          'Time Period': `${inputs.timePeriod} years`,
          'Compounding': getCompoundingText(inputs.compoundingFrequency)
        },
        results: {
          'Final Amount': `₹${results.amount?.toLocaleString()}`,
          'Compound Interest': `₹${results.compoundInterest?.toLocaleString()}`,
          'Advantage over Simple Interest': `₹${results.difference?.toLocaleString()}`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - Compound Interest Calculator Results',
      text: `Compound Interest: Principal ₹${inputs.principal}, Final Amount ₹${results?.amount?.toLocaleString()}`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Calculation link copied to clipboard!')
    }
  }

  const getCompoundingText = (frequency) => {
    switch (frequency) {
      case '1': return 'Annually'
      case '2': return 'Semi-annually'
      case '4': return 'Quarterly'
      case '12': return 'Monthly'
      case '365': return 'Daily'
      default: return 'Annually'
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

  // Chart data
  const pieChartData = results ? [
    { name: 'Principal', value: parseFloat(inputs.principal), color: '#3B82F6' },
    { name: 'Compound Interest', value: results.compoundInterest, color: '#10B981' }
  ] : []

  useEffect(() => {
    if (inputs.principal && inputs.interestRate && inputs.timePeriod) {
      calculateCompoundInterest()
    }
  }, [inputs])

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Input Section */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          variants={fadeInUp}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            🧮 Investment Details
          </h3>

          <div className="space-y-6">
            <FloatingLabelInput
              label="Principal Amount"
              value={inputs.principal}
              onChange={(value) => handleInputChange('principal', value)}
              icon="₹"
              placeholder="Enter principal amount"
              min="0"
            />

            <FloatingLabelInput
              label="Annual Interest Rate (%)"
              value={inputs.interestRate}
              onChange={(value) => handleInputChange('interestRate', value)}
              icon="📈"
              placeholder="Enter interest rate"
              step="0.1"
              min="0"
            />

            <FloatingLabelInput
              label="Time Period (Years)"
              value={inputs.timePeriod}
              onChange={(value) => handleInputChange('timePeriod', value)}
              icon="📅"
              placeholder="Enter time period"
              step="0.1"
              min="0"
            />

            {/* Compounding Frequency */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <span className="mr-2">🔄</span>
                Compounding Frequency
              </label>
              <select
                value={inputs.compoundingFrequency}
                onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
                className="w-full px-4 py-4 text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="1">Annually</option>
                <option value="2">Semi-annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
              </select>
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Compound Interest Formula:</h4>
              <p className="text-sm text-blue-700">A = P(1 + r/n)^(nt)</p>
              <p className="text-xs text-blue-600 mt-1">
                Where: A = Final Amount, P = Principal, r = Rate, n = Compounding frequency, t = Time
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions Section */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          variants={fadeInUp}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            🎯 Actions
          </h3>

          <div className="space-y-4">
            <motion.button
              onClick={handleReset}
              className="w-full py-3 px-6 rounded-xl font-semibold border-2 transition-all duration-300 hover:bg-gray-50 cursor-pointer"
              style={{
                borderColor: '#E5E7EB',
                color: '#6B7280'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Reset
            </motion.button>

            {results && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <motion.button
                  onClick={handleAddToComparison}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#3B82F6' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#3B82F6' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔗 Share
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div
            className="mt-8 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Key Results */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <span className="text-xl">💰</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Final Amount</h4>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#3B82F6' }}>
                  ₹{results.amount?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                    <span className="text-xl">📈</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Compound Interest</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                  ₹{results.compoundInterest?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                    <span className="text-xl">📊</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Simple Interest</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                  ₹{results.simpleInterest?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EDE9FE' }}>
                    <span className="text-xl">⚡</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Advantage</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>
                  ₹{results.difference?.toLocaleString()}
                </p>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                  💼 Amount Breakdown
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                  📈 Growth Comparison
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.yearlyBreakdown?.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="compound" stroke="#10B981" strokeWidth={3} name="Compound Interest" />
                    <Line type="monotone" dataKey="simple" stroke="#F59E0B" strokeWidth={2} name="Simple Interest" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Summary */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                📋 Investment Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Principal Amount</span>
                    <span className="font-semibold">₹{parseFloat(inputs.principal)?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold">{inputs.interestRate}% per annum</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Time Period</span>
                    <span className="font-semibold">{inputs.timePeriod} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Compounding</span>
                    <span className="font-semibold">{getCompoundingText(inputs.compoundingFrequency)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Effective Annual Rate</span>
                    <span className="font-semibold">{results.effectiveRate?.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Return</span>
                    <span className="font-semibold text-green-600">
                      {((results.amount - parseFloat(inputs.principal)) / parseFloat(inputs.principal) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Compound vs Simple</span>
                    <span className="font-semibold text-purple-600">
                      {((results.difference / results.simpleInterest) * 100).toFixed(2)}% more
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PDFExport
                data={[{
                  calculator: 'Compound Interest Calculator',
                  timestamp: new Date().toISOString(),
                  inputs: {
                    'Principal Amount': `₹${inputs.principal}`,
                    'Interest Rate': `${inputs.interestRate}%`,
                    'Time Period': `${inputs.timePeriod} years`,
                    'Compounding': getCompoundingText(inputs.compoundingFrequency)
                  },
                  results: {
                    'Final Amount': `₹${results.amount?.toLocaleString()}`,
                    'Compound Interest': `₹${results.compoundInterest?.toLocaleString()}`,
                    'Advantage over Simple Interest': `₹${results.difference?.toLocaleString()}`
                  }
                }]}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
