import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PDFExport from '../components/PDFExport'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import CurrencyInput from '../components/CurrencyInput'

export default function SIPCalculator({ onAddToComparison, categoryColor = 'purple' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

  const initialInputs = {
    monthlyInvestment: '',
    maturityAmount: '',
    lumpSumAmount: '',
    annualReturn: '12',
    timePeriodYears: '10',
    timePeriodMonths: '0',
    stepUpPercentage: '0',
    stepUpType: 'percentage', // 'percentage' or 'amount'
    calculationType: 'monthly'
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('sip_')
  const [urlKey, setUrlKey] = useState(0)

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setInputs(initialInputs)
    } else {
      // Ensure required fields have default values
      const updatedInputs = { ...inputs }
      let needsUpdate = false

      if (!updatedInputs.timePeriodYears && !updatedInputs.timePeriod) {
        updatedInputs.timePeriodYears = '10'
        needsUpdate = true
      }
      if (!updatedInputs.timePeriodMonths) {
        updatedInputs.timePeriodMonths = '0'
        needsUpdate = true
      }
      if (!updatedInputs.annualReturn) {
        updatedInputs.annualReturn = '12'
        needsUpdate = true
      }
      if (!updatedInputs.stepUpPercentage) {
        updatedInputs.stepUpPercentage = '0'
        needsUpdate = true
      }
      if (!updatedInputs.stepUpType) {
        updatedInputs.stepUpType = 'percentage'
        needsUpdate = true
      }

      if (needsUpdate) {
        setInputs(updatedInputs)
      }
    }
  }, [setInputs]) // Add setInputs dependency

  // Listen for URL changes and force re-render
  useEffect(() => {
    const handleURLChange = () => {
      setUrlKey(prev => prev + 1)

      // Parse URL parameters manually and update inputs
      const urlParams = new URLSearchParams(window.location.search)
      const newInputs = {}

      for (const [key, value] of urlParams.entries()) {
        if (key.startsWith('sip_')) {
          const cleanKey = key.replace('sip_', '')
          newInputs[cleanKey] = value
        }
      }

      if (Object.keys(newInputs).length > 0) {
        setInputs(newInputs)
        setTimeout(() => {
          calculateSIP()
        }, 100)
      }
    }

    // Listen for programmatic URL changes
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args)
      handleURLChange()
    }

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args)
      handleURLChange()
    }

    window.addEventListener('popstate', handleURLChange)

    return () => {
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
      window.removeEventListener('popstate', handleURLChange)
    }
  }, [])

  const [results, setResults] = useState(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState([])
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  // Component initialization
  useEffect(() => {
    // Initialize component
  }, [])

  // PWA Install functionality
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
    }
  }

  // Generate shareable URL
  const getShareableURL = useCallback(() => {
    return generateShareableURL('sip', inputs, results)
  }, [inputs, results])

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }

    if (field === 'monthlyInvestment' && value) {
      newInputs.maturityAmount = ''
      newInputs.calculationType = 'monthly'
    } else if (field === 'maturityAmount' && value) {
      newInputs.monthlyInvestment = ''
      newInputs.calculationType = 'maturity'
    }

    setInputs(newInputs)

    // Immediately trigger calculation for time period changes
    if (field === 'timePeriodMonths' || field === 'timePeriodYears') {
      setTimeout(() => {
        calculateSIP()
      }, 50)
    }
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const calculateSIP = () => {
    const monthly = parseFloat(inputs.monthlyInvestment) || 0
    const targetAmount = parseFloat(inputs.maturityAmount) || 0
    const lumpSum = parseFloat(inputs.lumpSumAmount) || 0
    const rate = parseFloat(inputs.annualReturn) / 100 / 12
    const inputYears = parseInt(inputs.timePeriodYears) || 0
    const inputMonths = parseInt(inputs.timePeriodMonths) || 0
    const totalMonths = inputYears * 12 + inputMonths
    const years = Math.floor(totalMonths / 12)
    const stepUpValue = parseFloat(inputs.stepUpPercentage) || 0

    if (totalMonths <= 0 || rate < 0) return

    let calculatedResults = {}
    let breakdown = []

    if (inputs.calculationType === 'monthly' && monthly > 0) {
      // Calculate future value from monthly investment + lump sum
      let futureValue = lumpSum // Start with lump sum
      let totalInvestment = lumpSum
      let currentMonthlyInvestment = monthly

      for (let year = 1; year <= years; year++) {
        let yearlyInvestment = 0

        for (let month = 1; month <= 12; month++) {
          futureValue = (futureValue + currentMonthlyInvestment) * (1 + rate)
          yearlyInvestment += currentMonthlyInvestment
          totalInvestment += currentMonthlyInvestment
        }

        // Apply step-up at year end
        if (inputs.stepUpType === 'percentage') {
          currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpValue / 100)
        } else {
          currentMonthlyInvestment = currentMonthlyInvestment + stepUpValue
        }

        breakdown.push({
          year,
          yearlyInvestment: Math.round(yearlyInvestment),
          yearEndValue: Math.round(futureValue),
          totalInvested: Math.round(totalInvestment)
        })
      }

      calculatedResults = {
        monthlyInvestment: monthly,
        lumpSumAmount: lumpSum,
        maturityAmount: Math.round(futureValue),
        totalInvestment: Math.round(totalInvestment),
        wealthGained: Math.round(futureValue - totalInvestment)
      }
    } else if (inputs.calculationType === 'maturity' && targetAmount > 0) {
      // Calculate required monthly investment for target amount
      // Simplified calculation without step-up for reverse calculation
      const monthlyRequired = targetAmount / (((Math.pow(1 + rate, totalMonths) - 1) / rate) * (1 + rate))
      const totalInvestment = monthlyRequired * totalMonths

      calculatedResults = {
        monthlyInvestment: Math.round(monthlyRequired),
        maturityAmount: targetAmount,
        totalInvestment: Math.round(totalInvestment),
        wealthGained: Math.round(targetAmount - totalInvestment)
      }

      // Generate breakdown for required monthly investment
      let investmentSoFar = 0
      let valueSoFar = 0

      for (let year = 1; year <= years; year++) {
        let yearlyInvestment = monthlyRequired * 12
        investmentSoFar += yearlyInvestment

        // Calculate value at end of year
        for (let month = 1; month <= 12; month++) {
          valueSoFar = (valueSoFar + monthlyRequired) * (1 + rate)
        }

        breakdown.push({
          year,
          yearlyInvestment: Math.round(yearlyInvestment),
          yearEndValue: Math.round(valueSoFar),
          totalInvestment: Math.round(investmentSoFar)
        })
      }
    }

    setResults(calculatedResults)
    setYearlyBreakdown(breakdown)
  }

  // Trigger calculation whenever inputs change
  useEffect(() => {
    // Only calculate if we have meaningful inputs
    if ((inputs.monthlyInvestment || inputs.maturityAmount) &&
        inputs.annualReturn &&
        (inputs.timePeriodYears || inputs.timePeriodMonths)) {
      // Use a small delay to ensure state has updated
      const timeoutId = setTimeout(() => {
        calculateSIP()
      }, 10)
      return () => clearTimeout(timeoutId)
    }
  }, [
    inputs.monthlyInvestment,
    inputs.maturityAmount,
    inputs.lumpSumAmount,
    inputs.annualReturn,
    inputs.timePeriodYears,
    inputs.timePeriodMonths,
    inputs.stepUpPercentage,
    inputs.stepUpType,
    inputs.calculationType,
    urlKey
  ])





  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        calculator: 'SIP Calculator',
        inputs: {
          'Monthly Investment': `₹${inputs.monthlyInvestment || results.monthlyInvestment}`,
          'Lump Sum Amount': inputs.lumpSumAmount ? `₹${inputs.lumpSumAmount}` : 'None',
          'Investment Period': `${inputs.timePeriodYears} years ${inputs.timePeriodMonths} months`,
          'Expected Annual Return': `${inputs.annualReturn}%`,
          'Step Up': inputs.stepUpType === 'percentage' ? `${inputs.stepUpPercentage}%` : `₹${inputs.stepUpPercentage}`
        },
        results: {
          'Maturity Amount': formatCurrency(results.maturityAmount),
          'Total Investment': formatCurrency(results.totalInvestment),
          'Wealth Gained': formatCurrency(results.wealthGained)
        }
      }

      // Use new comparison context
      addToComparison(comparisonData)

      // Also call the legacy prop if provided for backward compatibility
      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  const shareCalculation = () => {
    const shareableURL = getShareableURL()

    // Calculate total time period for display
    const totalYears = parseInt(inputs.timePeriodYears || 0)
    const totalMonths = parseInt(inputs.timePeriodMonths || 0)
    let timePeriodText = ''

    if (totalYears > 0 && totalMonths > 0) {
      timePeriodText = `${totalYears} years ${totalMonths} months`
    } else if (totalYears > 0) {
      timePeriodText = `${totalYears} years`
    } else if (totalMonths > 0) {
      timePeriodText = `${totalMonths} months`
    }

    const shareData = {
      title: 'finclamp.com - SIP Calculator Results',
      text: `SIP Calculation: Monthly Investment ${formatCurrency(inputs.monthlyInvestment)} for ${timePeriodText}. Maturity Amount: ${formatCurrency(results?.maturityAmount)}`,
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard! Your friend can use this link to see the same calculation.')
    }
  }



  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* PWA Install Button */}
      {deferredPrompt && (
        <div className="text-center mb-6">
          <button
            onClick={handlePWAInstall}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer"
          >
            📱 Install App
          </button>
        </div>
      )}

      {/* Main Content - Single Row Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">

        {/* Left Column - Investment Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              💰 Investment Details
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
              label="Monthly Investment"
              value={inputs.monthlyInvestment}
              onChange={(value) => handleInputChange('monthlyInvestment', value)}
              fieldName="monthlyInvestment"
              icon="💰"
              placeholder="Enter monthly investment"
              min="0"
              focusColor="#6366F1"
            />

            {/* Expected Annual Return with Increment/Decrement */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>📈</span>
                Expected Annual Return (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.annualReturn || ''}
                  onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                  placeholder="Enter expected return"
                  step="0.1"
                  min="0"
                  className="w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute right-1 top-1 bottom-1 flex flex-col">
                  <button
                    type="button"
                    onClick={() => {
                      const current = parseFloat(inputs.annualReturn) || 0
                      handleInputChange('annualReturn', (current + 0.5).toFixed(1))
                    }}
                    className="flex-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-t text-xs font-bold text-gray-600 transition-colors"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const current = parseFloat(inputs.annualReturn) || 0
                      handleInputChange('annualReturn', Math.max(0, current - 0.5).toFixed(1))
                    }}
                    className="flex-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-b text-xs font-bold text-gray-600 transition-colors"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>

            {/* Investment Period - Years and Months */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>📅</span>
                Investment Period
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Years Input with Increment/Decrement */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-600 font-medium">Years</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.timePeriodYears || ''}
                      onChange={(e) => handleInputChange('timePeriodYears', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute right-1 top-1 bottom-1 flex flex-col">
                      <button
                        type="button"
                        onClick={() => handleInputChange('timePeriodYears', Math.max(0, (parseInt(inputs.timePeriodYears) || 0) + 1).toString())}
                        className="flex-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-t text-xs font-bold text-gray-600 transition-colors"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('timePeriodYears', Math.max(0, (parseInt(inputs.timePeriodYears) || 0) - 1).toString())}
                        className="flex-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-b text-xs font-bold text-gray-600 transition-colors"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>

                {/* Months Input with Increment/Decrement */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-600 font-medium">Months</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.timePeriodMonths || ''}
                      onChange={(e) => {
                        let value = parseInt(e.target.value) || 0

                        // If months > 11, convert to years and months
                        if (value > 11) {
                          const additionalYears = Math.floor(value / 12)
                          const remainingMonths = value % 12
                          const currentYears = parseInt(inputs.timePeriodYears) || 0

                          handleInputChange('timePeriodYears', (currentYears + additionalYears).toString())
                          handleInputChange('timePeriodMonths', remainingMonths.toString())
                        } else {
                          value = Math.max(0, value)
                          handleInputChange('timePeriodMonths', value.toString())
                        }
                      }}
                      placeholder="0"
                      min="0"
                      max="11"
                      className="w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute right-1 top-1 bottom-1 flex flex-col">
                      <button
                        type="button"
                        onClick={() => {
                          const currentMonths = parseInt(inputs.timePeriodMonths) || 0
                          const newMonths = currentMonths >= 11 ? 0 : currentMonths + 1
                          handleInputChange('timePeriodMonths', newMonths.toString())
                        }}
                        className="flex-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-t text-xs font-bold text-gray-600 transition-colors"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentMonths = parseInt(inputs.timePeriodMonths) || 0
                          const newMonths = currentMonths <= 0 ? 11 : currentMonths - 1
                          handleInputChange('timePeriodMonths', newMonths.toString())
                        }}
                        className="flex-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-b text-xs font-bold text-gray-600 transition-colors"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CurrencyInput
              label="Lump Sum Amount (Optional)"
              value={inputs.lumpSumAmount}
              onChange={(value) => handleInputChange('lumpSumAmount', value)}
              fieldName="lumpSumAmount"
              icon="💎"
              placeholder="Enter lump sum amount"
              min="0"
              focusColor="#6366F1"
            />

            {/* Annual Step-up with embedded type selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>📈</span>
                Annual Step-up
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.stepUpPercentage}
                  onChange={(e) => handleInputChange('stepUpPercentage', e.target.value)}
                  placeholder={`Enter step-up ${inputs.stepUpType === 'percentage' ? 'percentage' : 'amount'}`}
                  step={inputs.stepUpType === 'percentage' ? '0.1' : '100'}
                  min="0"
                  className="w-full pl-4 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <select
                  value={inputs.stepUpType}
                  onChange={(e) => {
                    // Clear the value when switching types
                    handleInputChange('stepUpPercentage', '')
                    handleInputChange('stepUpType', e.target.value)
                  }}
                  className="absolute right-1 top-1 bottom-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="percentage">Percent</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
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
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Maturity Amount</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600 leading-tight">
                  {formatCurrency(results.maturityAmount)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🏦</span>
                  <h4 className="font-semibold text-base text-gray-700">Total Investment</h4>
                </div>
                <p className="text-2xl font-bold text-green-600 leading-tight">
                  {formatCurrency(results.totalInvestment)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-semibold text-base text-gray-700">Wealth Gained</h4>
                </div>
                <p className="text-2xl font-bold text-orange-600 leading-tight">
                  {formatCurrency(results.wealthGained)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💎</span>
                  <h4 className="font-semibold text-base text-gray-700">Monthly SIP</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 leading-tight">
                  {formatCurrency(results.monthlyInvestment || inputs.monthlyInvestment)}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">Enter investment details to see results</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Investment Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 Investment Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Monthly SIP</span>
                    <span className="font-semibold text-purple-600 text-sm">{formatCurrency(results.monthlyInvestment || inputs.monthlyInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Investment Period</span>
                    <span className="font-semibold text-sm">
                      {inputs.timePeriodYears || 0} years {inputs.timePeriodMonths || 0} months
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Expected Return</span>
                    <span className="font-semibold text-sm">{inputs.annualReturn}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Wealth Multiplier</span>
                    <span className="font-semibold text-orange-600 text-sm">
                      {(parseFloat(results.maturityAmount) / parseFloat(results.totalInvestment)).toFixed(1)}x
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Growth Chart */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  📊 Growth Visualization
                </h4>
                {yearlyBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={yearlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="year"
                        label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis
                        tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                        label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        formatter={(value, name) => [formatCurrency(value), name]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="yearEndValue"
                        stroke="#6366F1"
                        strokeWidth={3}
                        name="Portfolio Value"
                        dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="totalInvested"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Total Invested"
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📈</div>
                    <p className="text-gray-500 text-sm">Enter investment details to see growth chart</p>
                  </div>
                )}
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
                      calculator: 'SIP Calculator',
                      timestamp: new Date().toISOString(),
                      inputs: {
                        'Monthly Investment': `₹${inputs.monthlyInvestment || results.monthlyInvestment}`,
                        'Lump Sum Amount': inputs.lumpSumAmount ? `₹${inputs.lumpSumAmount}` : 'None',
                        'Investment Period': `${inputs.timePeriodYears} years ${inputs.timePeriodMonths} months`,
                        'Expected Annual Return': `${inputs.annualReturn}%`,
                        'Step Up': inputs.stepUpType === 'percentage' ? `${inputs.stepUpPercentage}%` : `₹${inputs.stepUpPercentage}`
                      },
                      results: {
                        'Maturity Amount': formatCurrency(results.maturityAmount),
                        'Total Investment': formatCurrency(results.totalInvestment),
                        'Wealth Gained': formatCurrency(results.wealthGained)
                      }
                    }]}
                    title="SIP Calculator Results"
                    calculatorType="SIP"
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
