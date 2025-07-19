import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
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
            borderColor: isFocused ? '#F59E0B' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? 'rgba(245, 158, 11, 0.1) 0px 0px 0px 4px' : 'none'
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default function SimpleInterestCalculator({ onAddToComparison, categoryColor = 'yellow' }) {
  const { addToComparison } = useComparison()

  const initialInputs = {
    principal: '',
    interestRate: '',
    timePeriod: '',
    calculationType: 'amount' // amount, principal, rate, time
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

  const calculateSimpleInterest = () => {
    const principal = parseFloat(inputs.principal) || 0
    const interestRate = parseFloat(inputs.interestRate) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 0

    if (inputs.calculationType === 'amount') {
      if (principal <= 0 || interestRate <= 0 || timePeriod <= 0) return
      
      // Calculate Simple Interest: SI = (P × R × T) / 100
      const simpleInterest = (principal * interestRate * timePeriod) / 100
      const amount = principal + simpleInterest
      
      // Generate year-wise breakdown
      const yearlyBreakdown = []
      for (let year = 1; year <= Math.min(timePeriod, 20); year++) {
        const yearlyInterest = (principal * interestRate * year) / 100
        const yearlyAmount = principal + yearlyInterest
        yearlyBreakdown.push({
          year,
          interest: Math.round(yearlyInterest),
          amount: Math.round(yearlyAmount),
          principal: principal
        })
      }

      setResults({
        principal,
        interestRate,
        timePeriod,
        simpleInterest: Math.round(simpleInterest),
        amount: Math.round(amount),
        yearlyBreakdown,
        monthlyInterest: Math.round(simpleInterest / (timePeriod * 12)),
        dailyInterest: Math.round(simpleInterest / (timePeriod * 365))
      })
    }
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'Simple Interest Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Principal Amount': `₹${inputs.principal}`,
          'Interest Rate': `${inputs.interestRate}%`,
          'Time Period': `${inputs.timePeriod} years`
        },
        results: {
          'Final Amount': `₹${results.amount?.toLocaleString()}`,
          'Simple Interest': `₹${results.simpleInterest?.toLocaleString()}`,
          'Monthly Interest': `₹${results.monthlyInterest?.toLocaleString()}`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - Simple Interest Calculator Results',
      text: `Simple Interest: Principal ₹${inputs.principal}, Interest ₹${results?.simpleInterest?.toLocaleString()}`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Calculation link copied to clipboard!')
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
    { name: 'Principal', value: results.principal, color: '#F59E0B' },
    { name: 'Simple Interest', value: results.simpleInterest, color: '#FCD34D' }
  ] : []

  useEffect(() => {
    if (inputs.principal && inputs.interestRate && inputs.timePeriod) {
      calculateSimpleInterest()
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
            📊 Investment Details
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

            {/* Information Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Simple Interest Formula:</h4>
              <p className="text-sm text-yellow-700">SI = (P × R × T) / 100</p>
              <p className="text-xs text-yellow-600 mt-1">
                Where: SI = Simple Interest, P = Principal, R = Rate per annum, T = Time in years
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
                  style={{ backgroundColor: '#F59E0B' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#F59E0B' }}
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                    <span className="text-xl">💰</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Final Amount</h4>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#F59E0B' }}>
                  ₹{results.amount?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FCD34D' }}>
                    <span className="text-xl">📈</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Simple Interest</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#D97706' }}>
                  ₹{results.simpleInterest?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <span className="text-xl">📅</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Monthly Interest</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                  ₹{results.monthlyInterest?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                    <span className="text-xl">📆</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Daily Interest</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                  ₹{results.dailyInterest?.toLocaleString()}
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
                  📈 Year-wise Growth
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={results.yearlyBreakdown?.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Bar dataKey="interest" fill="#F59E0B" name="Interest Earned" />
                  </BarChart>
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
                    <span className="font-semibold">₹{results.principal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold">{results.interestRate}% per annum</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Time Period</span>
                    <span className="font-semibold">{results.timePeriod} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Interest Type</span>
                    <span className="font-semibold">Simple Interest</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Return</span>
                    <span className="font-semibold text-yellow-600">
                      {((results.simpleInterest / results.principal) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Annual Interest</span>
                    <span className="font-semibold">₹{Math.round(results.simpleInterest / results.timePeriod).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Interest per ₹100</span>
                    <span className="font-semibold">₹{((results.interestRate * results.timePeriod)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Maturity Value</span>
                    <span className="font-semibold text-green-600">₹{results.amount?.toLocaleString()}</span>
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
                  calculator: 'Simple Interest Calculator',
                  timestamp: new Date().toISOString(),
                  inputs: {
                    'Principal Amount': `₹${inputs.principal}`,
                    'Interest Rate': `${inputs.interestRate}%`,
                    'Time Period': `${inputs.timePeriod} years`
                  },
                  results: {
                    'Final Amount': `₹${results.amount?.toLocaleString()}`,
                    'Simple Interest': `₹${results.simpleInterest?.toLocaleString()}`,
                    'Monthly Interest': `₹${results.monthlyInterest?.toLocaleString()}`
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
