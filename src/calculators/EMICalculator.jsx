
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'



export default function EMICalculator({ onAddToComparison, categoryColor = 'blue' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

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
    if (Object.keys(inputs).length === 0 || !inputs.principal) {
      setInputs(prev => ({ ...initialInputs, ...prev }))
    }
  }, [inputs])

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
          'Loan Amount': formatCurrency(inputs.principal),
          'Interest Rate': `${inputs.interestRate}%`,
          'Tenure': `${inputs.tenure} years`
        },
        results: {
          'EMI': formatCurrency(results.emi),
          'Total Amount': formatCurrency(results.totalAmount),
          'Total Interest': formatCurrency(results.totalInterest)
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
      text: `EMI Calculation: Loan Amount ${formatCurrency(inputs.principal)}, EMI ${formatCurrency(results?.emi)}`,
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
      // Clean and parse inputs, handling large numbers
      const principalStr = inputs.principal.toString().replace(/[^\d.]/g, '')
      const P = parseFloat(principalStr) || 0
      const r = (parseFloat(inputs.interestRate) || 0) / 100 / 12 // Monthly rate
      const n = (parseFloat(inputs.tenure) || 0) * 12 // Total months

      // Check for very large numbers that might cause precision issues
      if (P > Number.MAX_SAFE_INTEGER) {
        alert('Principal amount is too large. Please enter a smaller value.')
        return
      }

      // EMI = P × R × (1+R)^N / [(1+R)^N – 1]
      const emi = r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n
      const totalAmount = emi * n
      const totalInterest = totalAmount - P

      setResults({
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        principal: Math.round(P)
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

  // Auto-calculate when inputs change
  useEffect(() => {
    if (inputs.principal && inputs.interestRate && inputs.tenure) {
      calculateEMI()
    }
  }, [inputs.principal, inputs.interestRate, inputs.tenure, inputs.calculationType])

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Content - Single Row Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">

        {/* Left Column - Loan Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              💰 Loan Details
            </h3>
            <motion.button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Reset Calculator"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.button>
          </div>

          <div className="space-y-5">
            <CurrencyInput
              label="Loan Amount"
              value={inputs.principal}
              onChange={(value) => handleInputChange('principal', value)}
              fieldName="principal"
              icon="💰"
              placeholder="Enter loan amount"
              min="0"
              focusColor="#6366F1"
            />

            <CurrencyInput
              label="Interest Rate (% per annum)"
              value={inputs.interestRate}
              onChange={(value) => handleInputChange('interestRate', value)}
              fieldName="interestRate"
              icon="📈"
              placeholder="Enter interest rate"
              step="0.1"
              min="0"
              focusColor="#6366F1"
            />

            <CurrencyInput
              label="Loan Tenure (Years)"
              value={inputs.tenure}
              onChange={(value) => handleInputChange('tenure', value)}
              fieldName="tenure"
              icon="📅"
              placeholder="Enter tenure in years"
              min="1"
              focusColor="#6366F1"
            />

            {/* Quick Actions */}
            {results && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <motion.button
                  onClick={handleAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#10B981' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#6366F1' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔗 Share
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column - Expanded Results */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            📊 Results
          </h3>

          {results ? (
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Monthly EMI</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 leading-tight">
                  {formatCurrency(results.emi)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🏦</span>
                  <h4 className="font-semibold text-base text-gray-700">Principal</h4>
                </div>
                <p className="text-2xl font-bold text-green-600 leading-tight">
                  {formatCurrency(results.principal)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-semibold text-base text-gray-700">Total Interest</h4>
                </div>
                <p className="text-2xl font-bold text-orange-600 leading-tight">
                  {formatCurrency(results.totalInterest)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💎</span>
                  <h4 className="font-semibold text-base text-gray-700">Total Amount</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600 leading-tight">
                  {formatCurrency(results.totalAmount)}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">Enter loan details to see results</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Detailed Charts and Information - Below Main Content */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-4 space-y-4"
          >

            {/* Detailed Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Detailed Breakdown */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 Loan Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Monthly EMI</span>
                    <span className="font-semibold text-blue-600 text-sm">{formatCurrency(results.emi)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Total Payments</span>
                    <span className="font-semibold text-sm">{parseInt(inputs.tenure) * 12} months</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Interest Rate</span>
                    <span className="font-semibold text-sm">{inputs.interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Interest vs Principal</span>
                    <span className="font-semibold text-orange-600 text-sm">
                      {((parseFloat(results.totalInterest) / parseFloat(results.principal)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Pie Chart */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  📊 Amount Breakdown
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Principal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm text-gray-600">Interest</span>
                  </div>
                </div>
              </motion.div>

              {/* Actions & Export */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  🎯 Quick Actions
                </h4>
                <div className="space-y-4">
                  <PDFExport
                    data={[{
                      calculator: 'EMI Calculator',
                      timestamp: new Date().toISOString(),
                      inputs: {
                        'Loan Amount': formatCurrency(inputs.principal),
                        'Interest Rate': `${inputs.interestRate}%`,
                        'Tenure': `${inputs.tenure} years`
                      },
                      results: {
                        'Monthly EMI': formatCurrency(results.emi),
                        'Total Amount': formatCurrency(results.totalAmount),
                        'Total Interest': formatCurrency(results.totalInterest)
                      }
                    }]}
                    title="EMI Calculator Results"
                    calculatorType="EMI"
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                    style={{ backgroundColor: '#EF4444' }}
                    buttonContent={
                      <>
                        <span className="text-lg mr-2">📄</span>
                        <span>Export PDF</span>
                      </>
                    }
                  />

                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                      💡 All calculations are approximate and for reference only
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
