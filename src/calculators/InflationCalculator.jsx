import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'

function InflationCalculator({ onAddToComparison, categoryColor = 'red' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

  const initialInputs = {
    currentAmount: '',
    inflationRate: '6',
    timePeriod: '',
    calculationType: 'future' // future, present, rate
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('inflation_')
  const [results, setResults] = useState(null)

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setInputs(prev => ({ ...initialInputs, ...prev }))
    }
  }, [])

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname + '?calculator=inflation')
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
      title: 'finclamp.com - Inflation Calculator Results',
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
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Content - Single Row Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">

        {/* Left Column - Inflation Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              📈 Inflation Details
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

          <div className="space-y-6">
            <CurrencyInput
              label="Current Amount"
              value={inputs.currentAmount}
              onChange={(value) => handleInputChange('currentAmount', value)}
              fieldName="currentAmount"
              icon="₹"
              placeholder="Enter current amount"
              min="0"
              focusColor="#EF4444"
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

            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <p className="text-sm text-red-800">
                💡 <strong>Inflation reduces purchasing power over time</strong>
              </p>
            </div>

            {/* Quick Actions */}
            {results && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <motion.button
                  onClick={handleAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#EF4444' }}
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
            📊 Inflation Results
          </h3>

          {results ? (
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Future Value</h4>
                </div>
                <p className="text-2xl font-bold text-red-600 leading-tight">
                  {formatCurrency(results.futureValue)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🏦</span>
                  <h4 className="font-semibold text-base text-gray-700">Current Value</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 leading-tight">
                  {formatCurrency(inputs.currentAmount)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-semibold text-base text-gray-700">Inflation Impact</h4>
                </div>
                <p className="text-2xl font-bold text-orange-600 leading-tight">
                  {formatCurrency(results.inflationImpact)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📅</span>
                  <h4 className="font-semibold text-base text-gray-700">Time Period</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600 leading-tight">
                  {inputs.timePeriod} Years
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">Enter inflation details to see results</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Detailed Analysis Section - Below Main Content */}
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
              {/* Inflation Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 Inflation Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Current Amount</span>
                    <span className="font-semibold text-red-600 text-sm">{formatCurrency(inputs.currentAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Inflation Rate</span>
                    <span className="font-semibold text-sm">{inputs.inflationRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Time Period</span>
                    <span className="font-semibold text-sm">{inputs.timePeriod} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Purchasing Power Loss</span>
                    <span className="font-semibold text-red-600 text-sm">
                      {((parseFloat(results.inflationImpact) / parseFloat(inputs.currentAmount)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Chart Placeholder */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  📊 Inflation Impact
                </h4>
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-500 text-sm">Inflation visualization</p>
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
                      calculator: 'Inflation Calculator',
                      timestamp: new Date().toISOString(),
                      inputs: {
                        'Current Amount': formatCurrency(inputs.currentAmount),
                        'Inflation Rate': `${inputs.inflationRate}% p.a.`,
                        'Time Period': `${inputs.timePeriod} years`
                      },
                      results: {
                        'Future Value': formatCurrency(results.futureValue),
                        'Inflation Impact': formatCurrency(results.inflationImpact),
                        'Purchasing Power Loss': `${((parseFloat(results.inflationImpact) / parseFloat(inputs.currentAmount)) * 100).toFixed(1)}%`
                      }
                    }]}
                    title="Inflation Calculator Results"
                    calculatorType="Inflation"
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

export default InflationCalculator
