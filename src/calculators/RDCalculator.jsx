import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'
import CalculatorDropdown from '../components/CalculatorDropdown'

function RDCalculator({ onAddToComparison, categoryColor = 'green' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  
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

        {/* Main Content - Single Row Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">

          {/* Left Column - RD Details */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
                💰 Recurring Deposit Details
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
                  label="Monthly Deposit Amount"
                  value={inputs.monthlyDeposit}
                  onChange={(value) => handleInputChange('monthlyDeposit', value)}
                  fieldName="monthlyDeposit"
                  icon="💰"
                  placeholder="Enter monthly deposit"
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
                  placeholder="Enter target amount"
                  min="0"
                  focusColor="#10B981"
                />
              )}

              <CurrencyInput
                label="Annual Interest Rate (%)"
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
                icon="⏰"
                placeholder="Enter time period"
                min="1"
                focusColor="#10B981"
              />

              {/* Calculation Type */}
              <CalculatorDropdown
                configKey="CALCULATION_TYPES.RD"
                value={inputs.calculationType}
                onChange={(value) => handleInputChange('calculationType', value)}
                category="savings"
                placeholder="Select calculation type"
              />

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>RD Benefits:</strong> Fixed returns, disciplined savings, flexible tenure
                </p>
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
              📊 RD Results
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
                    <h4 className="font-semibold text-base text-gray-700">Total Deposits</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 leading-tight">
                    {formatCurrency(results.totalDeposits)}
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
                    <span className="text-2xl">💎</span>
                    <h4 className="font-semibold text-base text-gray-700">Monthly Deposit</h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 leading-tight">
                    {formatCurrency(results.monthlyDeposit || inputs.monthlyDeposit)}
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500 text-lg">Enter RD details to see results</p>
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
                {/* RD Summary */}
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="text-lg font-bold mb-4 text-gray-800">
                    💼 RD Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Monthly Deposit</span>
                      <span className="font-semibold text-green-600 text-sm">{formatCurrency(results.monthlyDeposit || inputs.monthlyDeposit)}</span>
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
                      <span className="text-gray-600 text-sm">Growth Multiplier</span>
                      <span className="font-semibold text-green-600 text-sm">
                        {(parseFloat(results.maturityAmount) / parseFloat(results.totalDeposits)).toFixed(1)}x
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
                    📊 Growth Visualization
                  </h4>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📈</div>
                    <p className="text-gray-500 text-sm">RD growth chart</p>
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
                        calculator: 'RD Calculator',
                        timestamp: new Date().toISOString(),
                        inputs: {
                          'Monthly Deposit': formatCurrency(results.monthlyDeposit || inputs.monthlyDeposit),
                          'Interest Rate': `${inputs.interestRate}% p.a.`,
                          'Time Period': `${inputs.timePeriod} years`
                        },
                        results: {
                          'Maturity Amount': formatCurrency(results.maturityAmount),
                          'Total Deposits': formatCurrency(results.totalDeposits),
                          'Interest Earned': formatCurrency(results.interestEarned)
                        }
                      }]}
                      title="RD Calculator Results"
                      calculatorType="RD"
                      className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                      style={{ backgroundColor: '#10B981' }}
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
      </div>
    </div>
  )
}

export default RDCalculator
