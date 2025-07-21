
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'

function FDCalculator({ onAddToComparison, categoryColor = 'green' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  
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
          'Principal Amount': formatCurrency(inputs.principal),
          'Interest Rate': `${inputs.interestRate}%`,
          'Time Period': `${inputs.timePeriod} years`,
          'Compounding': inputs.compoundingFrequency === '1' ? 'Annually' :
                        inputs.compoundingFrequency === '2' ? 'Semi-annually' :
                        inputs.compoundingFrequency === '4' ? 'Quarterly' : 'Monthly'
        },
        results: {
          'Maturity Amount': formatCurrency(results.maturityAmount),
          'Interest Earned': formatCurrency(results.interestEarned),
          'Total Return': `${((results.maturityAmount - results.principal) / results.principal * 100).toFixed(2)}%`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - FD Calculator Results',
      text: `FD Calculation: Principal ${formatCurrency(inputs.principal)}, Maturity ${formatCurrency(results?.maturityAmount)}`,
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
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Content - Single Row Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">

        {/* Left Column - FD Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              🏦 Fixed Deposit Details
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
            {/* Dynamic Input Field */}
            {inputs.calculationType === 'maturity' ? (
              <CurrencyInput
                label="Principal Amount"
                value={inputs.principal}
                onChange={(value) => handleInputChange('principal', value)}
                fieldName="principal"
                icon="💰"
                placeholder="Enter principal amount"
                min="0"
                focusColor="#10B981"
              />
            ) : (
              <CurrencyInput
                label="Target Maturity Amount"
                value={inputs.maturityAmount}
                onChange={(value) => handleInputChange('maturityAmount', value)}
                fieldName="maturityAmount"
                icon="🎯"
                placeholder="Enter target maturity amount"
                min="0"
                focusColor="#10B981"
              />
            )}

            <CurrencyInput
              label="Interest Rate (% per annum)"
              value={inputs.interestRate}
              onChange={(value) => handleInputChange('interestRate', value)}
              fieldName="interestRate"
              icon="📈"
              placeholder="Enter interest rate"
              step="0.1"
              min="0"
              focusColor="#10B981"
            />

            <CurrencyInput
              label="Time Period (Years)"
              value={inputs.timePeriod}
              onChange={(value) => handleInputChange('timePeriod', value)}
              fieldName="timePeriod"
              icon="📅"
              placeholder="Enter time period"
              min="1"
              focusColor="#10B981"
            />

            {/* Calculation Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <span className="mr-2">⚙️</span>
                Calculation Type
              </label>
              <select
                value={inputs.calculationType}
                onChange={(e) => handleInputChange('calculationType', e.target.value)}
                className="w-full px-3 py-3 text-base font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 cursor-pointer"
              >
                <option value="maturity">Calculate Maturity Amount</option>
                <option value="reverse-maturity">Calculate Principal Required</option>
              </select>
            </div>

            {/* Compounding Frequency */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <span className="mr-2">🔄</span>
                Compounding Frequency
              </label>
              <select
                value={inputs.compoundingFrequency}
                onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
                className="w-full px-3 py-3 text-base font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 cursor-pointer"
              >
                <option value="1">Annually</option>
                <option value="2">Semi-annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
              </select>
            </div>

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
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Maturity Amount</h4>
                </div>
                <p className="text-2xl font-bold text-green-600 leading-tight">
                  {formatCurrency(results.maturityAmount)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🏦</span>
                  <h4 className="font-semibold text-base text-gray-700">Principal</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 leading-tight">
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
                  <h4 className="font-semibold text-base text-gray-700">Interest Earned</h4>
                </div>
                <p className="text-2xl font-bold text-orange-600 leading-tight">
                  {formatCurrency(results.interestEarned)}
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
                  {results.timePeriod} Years
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">Enter FD details to see results</p>
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
              {/* FD Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 FD Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Principal Amount</span>
                    <span className="font-semibold text-green-600 text-sm">{formatCurrency(results.principal)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Interest Rate</span>
                    <span className="font-semibold text-sm">{inputs.interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Time Period</span>
                    <span className="font-semibold text-sm">{inputs.timePeriod} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Growth Rate</span>
                    <span className="font-semibold text-orange-600 text-sm">
                      {((parseFloat(results.maturityAmount) / parseFloat(results.principal) - 1) * 100).toFixed(1)}%
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
                  📊 Amount Breakdown
                </h4>
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-500 text-sm">Growth visualization</p>
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
                      calculator: 'FD Calculator',
                      timestamp: new Date().toISOString(),
                      inputs: {
                        'Principal Amount': formatCurrency(inputs.principal),
                        'Interest Rate': `${inputs.interestRate}%`,
                        'Time Period': `${inputs.timePeriod} years`,
                        'Compounding': inputs.compoundingFrequency === '1' ? 'Annually' :
                                      inputs.compoundingFrequency === '2' ? 'Semi-annually' :
                                      inputs.compoundingFrequency === '4' ? 'Quarterly' : 'Monthly'
                      },
                      results: {
                        'Maturity Amount': formatCurrency(results.maturityAmount),
                        'Interest Earned': formatCurrency(results.interestEarned),
                        'Principal': formatCurrency(results.principal)
                      }
                    }]}
                    title="FD Calculator Results"
                    calculatorType="FD"
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

export default FDCalculator
