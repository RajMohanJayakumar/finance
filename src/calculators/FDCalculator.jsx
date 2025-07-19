
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import PDFExport from '../components/PDFExport'

// Input component with floating label
const FloatingLabelInput = ({ label, value, onChange, type = "number", icon, placeholder, step, min }) => {
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

export default function FDCalculator({ onAddToComparison, categoryColor = 'green' }) {
  const { addToComparison } = useComparison()
  
  const initialInputs = {
    principal: '',
    interestRate: '',
    timePeriod: '',
    compoundingFrequency: '4', // Quarterly
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

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'Fixed Deposit Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Principal Amount': `₹${inputs.principal}`,
          'Interest Rate': `${inputs.interestRate}%`,
          'Time Period': `${inputs.timePeriod} years`,
          'Compounding': inputs.compoundingFrequency === '1' ? 'Annually' :
                        inputs.compoundingFrequency === '2' ? 'Semi-annually' :
                        inputs.compoundingFrequency === '4' ? 'Quarterly' : 'Monthly'
        },
        results: {
          'Maturity Amount': `₹${results.maturityAmount}`,
          'Interest Earned': `₹${results.interestEarned}`,
          'Total Return': `${((results.maturityAmount - results.principal) / results.principal * 100).toFixed(2)}%`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - FD Calculator Results',
      text: `FD Calculation: Principal ₹${inputs.principal}, Maturity ₹${results?.maturityAmount}`,
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

  const calculateFD = () => {
    if (inputs.calculationType === 'maturity') {
      const P = parseFloat(inputs.principal) || 0
      const r = (parseFloat(inputs.interestRate) || 0) / 100
      const t = parseFloat(inputs.timePeriod) || 0
      const n = parseFloat(inputs.compoundingFrequency) || 1

      if (P > 0 && r > 0 && t > 0) {
        const maturityAmount = P * Math.pow((1 + r / n), n * t)
        const interestEarned = maturityAmount - P

        setResults({
          principal: P.toFixed(2),
          maturityAmount: maturityAmount.toFixed(2),
          interestEarned: interestEarned.toFixed(2),
          timePeriod: t
        })
      }
    } else if (inputs.calculationType === 'reverse-maturity') {
      const A = parseFloat(inputs.maturityAmount) || 0
      const r = (parseFloat(inputs.interestRate) || 0) / 100
      const t = parseFloat(inputs.timePeriod) || 0
      const n = parseFloat(inputs.compoundingFrequency) || 1

      if (A > 0 && r > 0 && t > 0) {
        const principal = A / Math.pow((1 + r / n), n * t)
        const interestEarned = A - principal

        setResults({
          principal: principal.toFixed(2),
          maturityAmount: A.toFixed(2),
          interestEarned: interestEarned.toFixed(2),
          timePeriod: t
        })
      }
    }
  }

  useEffect(() => {
    if (inputs.principal || inputs.maturityAmount) {
      calculateFD()
    }
  }, [inputs])

  // Chart data for visualization
  const pieChartData = results ? [
    { name: 'Principal', value: parseFloat(results.principal), color: '#10B981' },
    { name: 'Interest', value: parseFloat(results.interestEarned), color: '#34D399' }
  ] : []

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
            🏦 Fixed Deposit Details
          </h3>

          <div className="space-y-6">
            {/* Calculation Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <span className="mr-2">⚙️</span>
                Calculation Type
              </label>
              <select
                value={inputs.calculationType}
                onChange={(e) => handleInputChange('calculationType', e.target.value)}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 cursor-pointer"
              >
                <option value="maturity">Calculate Maturity Amount</option>
                <option value="reverse-maturity">Calculate Principal Required</option>
              </select>
            </div>

            {/* Dynamic Input Field */}
            {inputs.calculationType === 'maturity' ? (
              <FloatingLabelInput
                label="Principal Amount"
                value={inputs.principal}
                onChange={(value) => handleInputChange('principal', value)}
                icon="₹"
                placeholder="Enter principal amount"
                min="0"
              />
            ) : (
              <FloatingLabelInput
                label="Target Maturity Amount"
                value={inputs.maturityAmount}
                onChange={(value) => handleInputChange('maturityAmount', value)}
                icon="🎯"
                placeholder="Enter target maturity amount"
                min="0"
              />
            )}

            <FloatingLabelInput
              label="Interest Rate (% per annum)"
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
              min="1"
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
                className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 cursor-pointer"
              >
                <option value="1">Annually</option>
                <option value="2">Semi-annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
              </select>
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
            {/* Reset Button */}
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

            {/* Secondary Actions */}
            {results && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <motion.button
                  onClick={handleAddToComparison}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#10B981' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#10B981' }}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                    <span className="text-xl">💰</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Maturity Amount</h4>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#10B981' }}>
                  ₹{parseFloat(results.maturityAmount).toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <span className="text-xl">📈</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Interest Earned</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                  ₹{parseFloat(results.interestEarned).toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F3F4F6' }}>
                    <span className="text-xl">🏦</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Principal</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#6B7280' }}>
                  ₹{parseFloat(results.principal).toLocaleString()}
                </p>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                  💼 Investment Breakdown
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

              {/* Summary Card */}
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                  📋 Investment Summary
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Investment Period</span>
                    <span className="font-semibold">{inputs.timePeriod} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold">{inputs.interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Compounding</span>
                    <span className="font-semibold">
                      {inputs.compoundingFrequency === '1' ? 'Annually' :
                       inputs.compoundingFrequency === '2' ? 'Semi-annually' :
                       inputs.compoundingFrequency === '4' ? 'Quarterly' : 'Monthly'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Return</span>
                    <span className="font-semibold text-green-600">
                      {((parseFloat(results.maturityAmount) - parseFloat(results.principal)) / parseFloat(results.principal) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* PDF Export */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PDFExport
                data={[{
                  calculator: 'Fixed Deposit Calculator',
                  timestamp: new Date().toISOString(),
                  inputs: {
                    'Principal Amount': `₹${inputs.principal}`,
                    'Interest Rate': `${inputs.interestRate}%`,
                    'Time Period': `${inputs.timePeriod} years`,
                    'Compounding': inputs.compoundingFrequency === '1' ? 'Annually' :
                                  inputs.compoundingFrequency === '2' ? 'Semi-annually' :
                                  inputs.compoundingFrequency === '4' ? 'Quarterly' : 'Monthly'
                  },
                  results: {
                    'Maturity Amount': `₹${results.maturityAmount}`,
                    'Interest Earned': `₹${results.interestEarned}`,
                    'Total Return': `${((parseFloat(results.maturityAmount) - parseFloat(results.principal)) / parseFloat(results.principal) * 100).toFixed(2)}%`
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
