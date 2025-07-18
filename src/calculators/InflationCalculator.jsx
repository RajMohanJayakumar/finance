import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
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
            borderColor: isFocused ? '#EF4444' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? 'rgba(239, 68, 68, 0.1) 0px 0px 0px 4px' : 'none'
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default function InflationCalculator({ onAddToComparison, categoryColor = 'red' }) {
  const { addToComparison } = useComparison()

  const initialInputs = {
    currentAmount: '',
    inflationRate: '6',
    timePeriod: '',
    calculationType: 'future' // future, present, rate
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

  const calculateInflation = () => {
    const currentAmount = parseFloat(inputs.currentAmount) || 0
    const inflationRate = parseFloat(inputs.inflationRate) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 0

    if (currentAmount <= 0 || inflationRate < 0 || timePeriod <= 0) return

    // Future Value calculation: FV = PV × (1 + r)^n
    const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, timePeriod)
    const totalInflation = futureValue - currentAmount
    const purchasingPowerLoss = ((futureValue - currentAmount) / currentAmount) * 100

    // Calculate what current amount will be worth in future (purchasing power)
    const realValue = currentAmount / Math.pow(1 + inflationRate / 100, timePeriod)

    // Generate year-wise breakdown
    const yearlyBreakdown = []
    for (let year = 1; year <= Math.min(timePeriod, 20); year++) {
      const yearlyFutureValue = currentAmount * Math.pow(1 + inflationRate / 100, year)
      const yearlyRealValue = currentAmount / Math.pow(1 + inflationRate / 100, year)
      const yearlyInflation = yearlyFutureValue - currentAmount
      
      yearlyBreakdown.push({
        year,
        futureValue: Math.round(yearlyFutureValue),
        realValue: Math.round(yearlyRealValue),
        inflation: Math.round(yearlyInflation),
        purchasingPower: Math.round(((currentAmount / yearlyFutureValue) * 100))
      })
    }

    // Calculate equivalent purchasing power examples
    const commonItems = [
      { item: 'Coffee', currentPrice: 100 },
      { item: 'Movie Ticket', currentPrice: 300 },
      { item: 'Petrol (1L)', currentPrice: 100 },
      { item: 'Bread', currentPrice: 50 },
      { item: 'Milk (1L)', currentPrice: 60 }
    ]

    const inflatedPrices = commonItems.map(item => ({
      ...item,
      futurePrice: Math.round(item.currentPrice * Math.pow(1 + inflationRate / 100, timePeriod))
    }))

    setResults({
      currentAmount,
      futureValue: Math.round(futureValue),
      totalInflation: Math.round(totalInflation),
      purchasingPowerLoss: purchasingPowerLoss.toFixed(2),
      realValue: Math.round(realValue),
      yearlyBreakdown,
      inflatedPrices,
      averageAnnualIncrease: Math.round(totalInflation / timePeriod)
    })
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'Inflation Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Current Amount': `₹${inputs.currentAmount}`,
          'Inflation Rate': `${inputs.inflationRate}%`,
          'Time Period': `${inputs.timePeriod} years`
        },
        results: {
          'Future Value': `₹${results.futureValue?.toLocaleString()}`,
          'Total Inflation': `₹${results.totalInflation?.toLocaleString()}`,
          'Purchasing Power Loss': `${results.purchasingPowerLoss}%`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'Inflation Calculator Results',
      text: `Inflation Impact: ₹${inputs.currentAmount} today = ₹${results?.futureValue?.toLocaleString()} in ${inputs.timePeriod} years`,
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

  useEffect(() => {
    if (inputs.currentAmount && inputs.inflationRate && inputs.timePeriod) {
      calculateInflation()
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
            📈 Inflation Details
          </h3>

          <div className="space-y-6">
            <FloatingLabelInput
              label="Current Amount"
              value={inputs.currentAmount}
              onChange={(value) => handleInputChange('currentAmount', value)}
              icon="₹"
              placeholder="Enter current amount"
              min="0"
            />

            <FloatingLabelInput
              label="Expected Inflation Rate (%)"
              value={inputs.inflationRate}
              onChange={(value) => handleInputChange('inflationRate', value)}
              icon="📊"
              placeholder="Enter inflation rate"
              step="0.1"
              min="0"
            />

            <FloatingLabelInput
              label="Time Period (Years)"
              value={inputs.timePeriod}
              onChange={(value) => handleInputChange('timePeriod', value)}
              icon="📅"
              placeholder="Enter time period"
              step="1"
              min="1"
            />

            {/* Information Box */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-semibold text-red-800 mb-2">💡 About Inflation:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Inflation reduces purchasing power over time</li>
                <li>• India's average inflation: ~6% per year</li>
                <li>• Formula: Future Value = Present Value × (1 + r)^n</li>
                <li>• Higher inflation = Lower purchasing power</li>
              </ul>
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
                  style={{ backgroundColor: '#EF4444' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#EF4444' }}
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                    <span className="text-xl">💰</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Future Value</h4>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#EF4444' }}>
                  ₹{results.futureValue?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                    <span className="text-xl">📈</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Total Inflation</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                  ₹{results.totalInflation?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <span className="text-xl">📉</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Power Loss</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                  {results.purchasingPowerLoss}%
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                    <span className="text-xl">💵</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Real Value</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                  ₹{results.realValue?.toLocaleString()}
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
                  📈 Inflation Impact Over Time
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.yearlyBreakdown?.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="futureValue" stroke="#EF4444" strokeWidth={3} name="Future Value" />
                    <Line type="monotone" dataKey="realValue" stroke="#10B981" strokeWidth={2} name="Real Value" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                  🛒 Price Impact Examples
                </h4>
                <div className="space-y-4">
                  {results.inflatedPrices?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <span className="font-medium">{item.item}</span>
                        <div className="text-sm text-gray-500">Today: ₹{item.currentPrice}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-red-600">₹{item.futurePrice}</span>
                        <div className="text-sm text-gray-500">
                          +{Math.round(((item.futurePrice - item.currentPrice) / item.currentPrice) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                📋 Inflation Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Current Amount</span>
                    <span className="font-semibold">₹{results.currentAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Inflation Rate</span>
                    <span className="font-semibold">{inputs.inflationRate}% per annum</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Time Period</span>
                    <span className="font-semibold">{inputs.timePeriod} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Average Annual Increase</span>
                    <span className="font-semibold">₹{results.averageAnnualIncrease?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Cumulative Inflation</span>
                    <span className="font-semibold text-red-600">
                      {((results.futureValue - results.currentAmount) / results.currentAmount * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Money Multiplier</span>
                    <span className="font-semibold">{(results.futureValue / results.currentAmount).toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Purchasing Power</span>
                    <span className="font-semibold text-green-600">
                      {(100 - parseFloat(results.purchasingPowerLoss)).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Real Value Today</span>
                    <span className="font-semibold text-blue-600">₹{results.realValue?.toLocaleString()}</span>
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
                  calculator: 'Inflation Calculator',
                  timestamp: new Date().toISOString(),
                  inputs: {
                    'Current Amount': `₹${inputs.currentAmount}`,
                    'Inflation Rate': `${inputs.inflationRate}%`,
                    'Time Period': `${inputs.timePeriod} years`
                  },
                  results: {
                    'Future Value': `₹${results.futureValue?.toLocaleString()}`,
                    'Total Inflation': `₹${results.totalInflation?.toLocaleString()}`,
                    'Purchasing Power Loss': `${results.purchasingPowerLoss}%`
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
