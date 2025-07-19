
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
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
            borderColor: isFocused ? '#6366F1' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? 'rgba(99, 102, 241, 0.1) 0px 0px 0px 4px' : 'none'
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default function EMICalculator({ onAddToComparison, categoryColor = 'blue' }) {
  const { addToComparison } = useComparison()

  const initialInputs = {
    principal: '',
    interestRate: '',
    tenure: '',
    emi: '',
    calculationType: 'emi' // emi, reverse-emi
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('emi_')

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setInputs(initialInputs)
    }
  }, [])

  const [results, setResults] = useState(null)

  // Removed URL parameter handling since we're using tabs instead of routes

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
        calculator: 'EMI Calculator',
        inputs: {
          'Loan Amount': `₹${inputs.principal}`,
          'Interest Rate': `${inputs.interestRate}%`,
          'Tenure': `${inputs.tenure} years`
        },
        results: {
          'EMI': `₹${results.emi?.toLocaleString()}`,
          'Total Amount': `₹${results.totalAmount?.toLocaleString()}`,
          'Total Interest': `₹${results.totalInterest?.toLocaleString()}`
        }
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  const shareCalculation = () => {
    const shareableURL = generateShareableURL('emi', inputs, results)
    const shareData = {
      title: 'finclamp.com - EMI Calculator Results',
      text: `EMI Calculation: Loan Amount ₹${inputs.principal}, EMI ₹${results?.emi?.toLocaleString()}`,
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard!')
    }
  }

  const calculateEMI = () => {
    if (inputs.calculationType === 'emi') {
      const P = parseFloat(inputs.principal) || 0
      const r = (parseFloat(inputs.interestRate) || 0) / 100 / 12 // Monthly rate
      const n = (parseFloat(inputs.tenure) || 0) * 12 // Total months

      // EMI = P × R × (1+R)^N / [(1+R)^N – 1]
      const emi = r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n
      const totalAmount = emi * n
      const totalInterest = totalAmount - P

      setResults({
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        principal: P
      })
    }
  }

  // Prepare chart data
  const pieChartData = results ? [
    { name: 'Principal', value: results.principal, color: '#6366F1' },
    { name: 'Interest', value: results.totalInterest, color: '#10B981' }
  ] : []

  const barChartData = results ? [
    { name: 'Principal', amount: results.principal },
    { name: 'Interest', amount: results.totalInterest },
    { name: 'Total', amount: results.totalAmount }
  ] : []

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Input Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {/* Loan Details Card */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          variants={{
            hidden: { opacity: 0, x: -20 },
            show: { opacity: 1, x: 0 }
          }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            💰 Loan Details
          </h3>

          <div className="space-y-6">
            <FloatingLabelInput
              label="Loan Amount"
              value={inputs.principal}
              onChange={(value) => handleInputChange('principal', value)}
              icon="₹"
              placeholder="Enter loan amount"
              min="0"
            />

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
              label="Loan Tenure (Years)"
              value={inputs.tenure}
              onChange={(value) => handleInputChange('tenure', value)}
              icon="📅"
              placeholder="Enter tenure in years"
              min="1"
            />
          </div>
        </motion.div>

        {/* Action Buttons Card */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          variants={{
            hidden: { opacity: 0, x: 20 },
            show: { opacity: 1, x: 0 }
          }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            🎯 Actions
          </h3>

          <div className="space-y-4">
            {/* Calculate Button */}
            <motion.button
              onClick={calculateEMI}
              className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
              style={{ backgroundColor: '#6366F1' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📊 Calculate EMI
            </motion.button>

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* EMI Results Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
                    <span className="text-xl">💰</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Monthly EMI</h4>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#6366F1' }}>
                  ₹{results.emi.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
                    <span className="text-xl">🏦</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Principal</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                  ₹{results.principal.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
                    <span className="text-xl">📈</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Total Interest</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                  ₹{results.totalInterest.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
                    <span className="text-xl">💎</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Total Amount</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>
                  ₹{results.totalAmount.toLocaleString()}
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
                  💼 Loan Breakdown
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

              {/* Bar Chart */}
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                  📊 Amount Comparison
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Bar dataKey="amount" fill="#6366F1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
                  calculator: 'EMI Calculator',
                  timestamp: new Date().toISOString(),
                  inputs: {
                    'Loan Amount': `₹${inputs.principal}`,
                    'Interest Rate': `${inputs.interestRate}%`,
                    'Tenure': `${inputs.tenure} years`
                  },
                  results: {
                    'Monthly EMI': `₹${results.emi?.toLocaleString()}`,
                    'Total Amount': `₹${results.totalAmount?.toLocaleString()}`,
                    'Total Interest': `₹${results.totalInterest?.toLocaleString()}`
                  }
                }]}
                title="EMI Calculator Results"
                calculatorType="EMI"
                className="px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#EF4444' }}
                buttonContent={
                  <>
                    <span className="text-xl mr-2">📄</span>
                    <span>Export Colorful PDF</span>
                  </>
                }
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
