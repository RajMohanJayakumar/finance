import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'

function PPFCalculator({ onAddToComparison, categoryColor = 'green' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  
  const initialInputs = {
    annualDeposit: '',
    timePeriod: '15', // PPF has 15-year lock-in
    interestRate: '7.1', // Current PPF rate
    calculationType: 'maturity'
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('ppf_')
  const [results, setResults] = useState(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState([])

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
    setYearlyBreakdown([])
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const calculatePPF = () => {
    const annualDeposit = parseFloat(inputs.annualDeposit) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 15
    const annualRate = parseFloat(inputs.interestRate) || 7.1

    if (annualDeposit > 0 && timePeriod > 0 && annualRate > 0) {
      // PPF calculation with compound interest
      const rate = annualRate / 100
      let totalInvestment = annualDeposit * timePeriod
      let breakdown = []
      let cumulativeBalance = 0

      // Calculate year by year with proper compounding
      for (let year = 1; year <= timePeriod; year++) {
        // Add this year's deposit
        cumulativeBalance += annualDeposit

        // Apply interest on the entire balance
        cumulativeBalance = cumulativeBalance * (1 + rate)

        breakdown.push({
          year: year,
          deposit: annualDeposit,
          totalDeposited: annualDeposit * year,
          interestEarned: Math.round(cumulativeBalance - (annualDeposit * year)),
          balance: Math.round(cumulativeBalance)
        })
      }

      const maturityAmount = cumulativeBalance
      const totalInterest = maturityAmount - totalInvestment

      setResults({
        maturityAmount: Math.round(maturityAmount),
        totalInvestment: Math.round(totalInvestment),
        totalInterest: Math.round(totalInterest),
        annualDeposit: annualDeposit
      })

      setYearlyBreakdown(breakdown)
    } else {
      setResults(null)
      setYearlyBreakdown([])
    }
  }

  const shareCalculation = () => {
    const shareableURL = generateShareableURL('ppf', inputs, results)
    const shareData = {
      title: 'finclamp.com - PPF Calculator Results',
      text: `PPF Calculation: Annual Deposit ${formatCurrency(inputs.annualDeposit)}, Maturity ${formatCurrency(results?.maturityAmount)}`,
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard! Your friend can use this link to see the same calculation.')
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

        {/* Main Content - Single Row Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">

          {/* Left Column - PPF Details */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
                🛡️ PPF Investment Details
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
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>PPF Benefits:</strong> Tax deduction under 80C, tax-free interest, 15-year lock-in period
                </p>
              </div>

              <CurrencyInput
                label="Annual Deposit Amount"
                value={inputs.annualDeposit}
                onChange={(value) => handleInputChange('annualDeposit', value)}
                fieldName="annualDeposit"
                icon="💰"
                placeholder="Enter annual deposit"
                min="500"
                focusColor="#7C3AED"
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
                focusColor="#7C3AED"
              />

              <CurrencyInput
                label="Investment Period (Years)"
                value={inputs.timePeriod}
                onChange={(value) => handleInputChange('timePeriod', value)}
                fieldName="timePeriod"
                icon="⏰"
                placeholder="Enter investment period"
                min="15"
                focusColor="#7C3AED"
              />

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800">
                  ⚠️ <strong>Note:</strong> PPF has a mandatory 15-year lock-in period
                </p>
              </div>

              {/* Quick Actions */}
              {results && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <motion.button
                    onClick={handleAddToComparison}
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                    style={{ backgroundColor: '#7C3AED' }}
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
              📊 PPF Results
            </h3>

            {results ? (
              <>
                {/* Main Result */}
                <div className="mb-8">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-lg text-white text-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-2xl mr-2">💰</span>
                      <p className="text-lg font-medium opacity-90">Maturity Amount</p>
                    </div>
                    <p className="text-4xl font-bold">
                      {formatCurrency(results.maturityAmount)}
                    </p>
                  </motion.div>
                </div>

                {/* Key Metrics - 2 per row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="p-6 rounded-lg border bg-blue-50 text-blue-600 border-blue-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium opacity-80">Total Investment</p>
                      <span className="text-lg">🏦</span>
                    </div>
                    <p className="font-bold text-2xl text-blue-600 mb-2">
                      {formatCurrency(results.totalInvestment)}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">Total amount deposited over {inputs.timePeriod} years</p>
                  </motion.div>

                  <motion.div
                    className="p-6 rounded-lg border bg-green-50 text-green-600 border-green-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium opacity-80">Total Interest Earned</p>
                      <span className="text-lg">📈</span>
                    </div>
                    <p className="font-bold text-2xl text-green-600 mb-2">
                      {formatCurrency(results.totalInterest)}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">Interest earned through compound growth</p>
                  </motion.div>

                  <motion.div
                    className="p-6 rounded-lg border bg-orange-50 text-orange-600 border-orange-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium opacity-80">Annual Deposit</p>
                      <span className="text-lg">💎</span>
                    </div>
                    <p className="font-bold text-2xl text-orange-600 mb-2">
                      {formatCurrency(inputs.annualDeposit)}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">Fixed amount deposited every year</p>
                  </motion.div>

                  <motion.div
                    className="p-6 rounded-lg border bg-purple-50 text-purple-600 border-purple-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium opacity-80">Growth Multiplier</p>
                      <span className="text-lg">🚀</span>
                    </div>
                    <p className="font-bold text-2xl text-purple-600 mb-2">
                      {(parseFloat(results.maturityAmount) / parseFloat(results.totalInvestment)).toFixed(1)}x
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">How much your money will grow</p>
                  </motion.div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500 text-lg">Enter PPF details to see results</p>
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
                {/* PPF Summary */}
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="text-lg font-bold mb-4 text-gray-800">
                    💼 PPF Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Annual Deposit</span>
                      <span className="font-semibold text-purple-600 text-sm">{formatCurrency(inputs.annualDeposit)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Interest Rate</span>
                      <span className="font-semibold text-sm">{inputs.interestRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Investment Period</span>
                      <span className="font-semibold text-sm">{inputs.timePeriod} years</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 text-sm">Growth Multiplier</span>
                      <span className="font-semibold text-green-600 text-sm">
                        {(parseFloat(results.maturityAmount) / parseFloat(results.totalInvestment)).toFixed(1)}x
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Growth Chart */}
                {yearlyBreakdown.length > 0 && (
                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="text-lg font-bold mb-4 text-gray-800">
                      📊 PPF Growth Visualization
                    </h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={yearlyBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                          <Tooltip
                            formatter={(value, name) => [formatCurrency(value), name]}
                            labelFormatter={(label) => `Year ${label}`}
                          />
                          <Line
                            type="monotone"
                            dataKey="totalDeposited"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            name="Total Deposited"
                          />
                          <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="#10B981"
                            strokeWidth={2}
                            name="PPF Balance"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

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
                        calculator: 'PPF Calculator',
                        timestamp: new Date().toISOString(),
                        inputs: {
                          'Annual Deposit': formatCurrency(inputs.annualDeposit),
                          'Interest Rate': `${inputs.interestRate}% p.a.`,
                          'Investment Period': `${inputs.timePeriod} years`
                        },
                        results: {
                          'Maturity Amount': formatCurrency(results.maturityAmount),
                          'Total Investment': formatCurrency(results.totalInvestment),
                          'Total Interest': formatCurrency(results.totalInterest)
                        }
                      }]}
                      title="PPF Calculator Results"
                      calculatorType="PPF"
                      className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                      style={{ backgroundColor: '#7C3AED' }}
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

export default PPFCalculator
