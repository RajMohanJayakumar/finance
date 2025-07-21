import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PDFExport from '../components/PDFExport'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { generateShareableURL } from '../hooks/useURLState'
import CurrencyInput from '../components/CurrencyInput'

export default function SIPCalculator({ onAddToComparison, categoryColor = 'purple' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

  // Default values
  const defaultInputs = {
    monthlyInvestment: '',
    maturityAmount: '',
    lumpSumAmount: '',
    annualReturn: '12',
    timePeriodYears: '10',
    timePeriodMonths: '0',
    stepUpPercentage: '0',
    stepUpType: 'percentage',
    calculationType: 'monthly'
  }

  // State management
  const [inputs, setInputs] = useState(defaultInputs)
  const [results, setResults] = useState(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState([])
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  // URL parameter management
  const updateURL = useCallback((newInputs) => {
    const url = new URL(window.location)
    
    // Preserve calculator parameter
    const calculatorParam = url.searchParams.get('calculator')
    
    // Remove existing sip_ parameters
    const keysToRemove = []
    for (const key of url.searchParams.keys()) {
      if (key.startsWith('sip_')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => url.searchParams.delete(key))
    
    // Restore calculator parameter
    if (calculatorParam) {
      url.searchParams.set('calculator', calculatorParam)
    }
    
    // Add new parameters (only non-empty values)
    Object.entries(newInputs).forEach(([key, value]) => {
      if (value && value !== '' && value !== '0') {
        url.searchParams.set(`sip_${key}`, value)
      }
    })
    
    window.history.replaceState({}, '', url.toString())
  }, [])

  // Read URL parameters
  const readURLParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const params = {}
    
    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith('sip_')) {
        const cleanKey = key.replace('sip_', '')
        params[cleanKey] = value
      }
    }
    
    return params
  }, [])

  // Initialize from URL on mount
  useEffect(() => {
    const urlParams = readURLParams()
    if (Object.keys(urlParams).length > 0) {
      const initialInputs = { ...defaultInputs, ...urlParams }
      setInputs(initialInputs)
    }
  }, [])

  // Listen for browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = readURLParams()
      if (Object.keys(urlParams).length > 0) {
        const newInputs = { ...defaultInputs, ...urlParams }
        setInputs(newInputs)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handleInstallClick = async () => {
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

  // Handle input changes with URL updates
  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }

    // Handle calculation type switching
    if (field === 'monthlyInvestment' && value) {
      newInputs.maturityAmount = ''
      newInputs.calculationType = 'monthly'
    } else if (field === 'maturityAmount' && value) {
      newInputs.monthlyInvestment = ''
      newInputs.calculationType = 'maturity'
    }

    // Handle step-up type switching - clear value when switching types
    if (field === 'stepUpType') {
      newInputs.stepUpPercentage = '0'
    }

    // Update state and URL
    setInputs(newInputs)
    updateURL(newInputs)
  }

  // SIP calculation function
  const calculateSIP = useCallback(() => {
    const monthlyInv = parseFloat(inputs.monthlyInvestment) || 0
    const maturityAmt = parseFloat(inputs.maturityAmount) || 0
    const lumpSum = parseFloat(inputs.lumpSumAmount) || 0
    const annualRate = parseFloat(inputs.annualReturn) || 12
    const years = parseInt(inputs.timePeriodYears) || 0
    const months = parseInt(inputs.timePeriodMonths) || 0
    const stepUpPercent = parseFloat(inputs.stepUpPercentage) || 0
    const stepUpType = inputs.stepUpType || 'percentage'

    // Calculate total months
    const totalMonths = (years * 12) + months

    if (totalMonths <= 0 || annualRate <= 0) {
      setResults(null)
      setYearlyBreakdown([])
      return
    }

    const monthlyRate = annualRate / 100 / 12
    let calculatedMonthlyInvestment = monthlyInv
    let calculatedMaturityAmount = maturityAmt

    // Calculate based on type
    if (inputs.calculationType === 'maturity' && maturityAmt > 0) {
      // Calculate required monthly investment for target maturity
      if (stepUpPercent > 0) {
        // Complex calculation for step-up SIP to reach target
        calculatedMonthlyInvestment = maturityAmt / (totalMonths * (1 + monthlyRate) ** (totalMonths / 2))
      } else {
        // Simple SIP calculation
        const futureValueFactor = ((1 + monthlyRate) ** totalMonths - 1) / monthlyRate
        calculatedMonthlyInvestment = maturityAmt / futureValueFactor
      }
    } else if (calculatedMonthlyInvestment > 0) {
      // Calculate maturity amount from monthly investment
      if (stepUpPercent > 0) {
        // Step-up SIP calculation
        let totalAmount = 0
        let currentMonthlyInv = calculatedMonthlyInvestment
        
        for (let month = 1; month <= totalMonths; month++) {
          totalAmount += currentMonthlyInv * ((1 + monthlyRate) ** (totalMonths - month + 1))
          
          // Increase investment annually
          if (month % 12 === 0) {
            if (stepUpType === 'percentage') {
              currentMonthlyInv = currentMonthlyInv * (1 + stepUpPercent / 100)
            } else {
              currentMonthlyInv = currentMonthlyInv + stepUpPercent
            }
          }
        }
        calculatedMaturityAmount = totalAmount
      } else {
        // Simple SIP calculation
        const futureValueFactor = ((1 + monthlyRate) ** totalMonths - 1) / monthlyRate
        calculatedMaturityAmount = calculatedMonthlyInvestment * futureValueFactor
      }
    }

    // Add lump sum if provided
    if (lumpSum > 0) {
      calculatedMaturityAmount += lumpSum * ((1 + monthlyRate) ** totalMonths)
    }

    const totalInvestment = calculatedMonthlyInvestment * totalMonths + lumpSum
    const totalReturns = calculatedMaturityAmount - totalInvestment
    const absoluteReturn = totalReturns
    const annualizedReturn = totalMonths > 0 ? 
      (Math.pow(calculatedMaturityAmount / totalInvestment, 12 / totalMonths) - 1) * 100 : 0

    // Generate yearly breakdown
    const breakdown = []
    let cumulativeInvestment = lumpSum
    let cumulativeValue = lumpSum
    let currentMonthlyInv = calculatedMonthlyInvestment

    for (let year = 1; year <= years + (months > 0 ? 1 : 0); year++) {
      const monthsInThisYear = year <= years ? 12 : months
      if (monthsInThisYear === 0) break

      let yearlyInvestment = 0
      for (let month = 1; month <= monthsInThisYear; month++) {
        yearlyInvestment += currentMonthlyInv
        cumulativeValue += currentMonthlyInv
        cumulativeValue *= (1 + monthlyRate)
      }

      cumulativeInvestment += yearlyInvestment

      // Step-up at year end
      if (stepUpPercent > 0 && year < years + (months > 0 ? 1 : 0)) {
        if (stepUpType === 'percentage') {
          currentMonthlyInv = currentMonthlyInv * (1 + stepUpPercent / 100)
        } else {
          currentMonthlyInv = currentMonthlyInv + stepUpPercent
        }
      }

      breakdown.push({
        year,
        investment: cumulativeInvestment,
        value: cumulativeValue,
        returns: cumulativeValue - cumulativeInvestment
      })
    }

    setResults({
      monthlyInvestment: calculatedMonthlyInvestment,
      maturityAmount: calculatedMaturityAmount,
      totalInvestment,
      totalReturns,
      absoluteReturn,
      annualizedReturn,
      wealthGained: totalReturns
    })

    setYearlyBreakdown(breakdown)
  }, [inputs])

  // Trigger calculation when inputs change
  useEffect(() => {
    if ((inputs.monthlyInvestment || inputs.maturityAmount) &&
        inputs.annualReturn &&
        (inputs.timePeriodYears || inputs.timePeriodMonths)) {
      const timeoutId = setTimeout(() => {
        calculateSIP()
      }, 100)
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
    calculateSIP
  ])

  // Share calculation
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

  // Add to comparison
  const handleAddToComparison = () => {
    if (results && addToComparison) {
      const comparisonData = {
        calculator: 'SIP Calculator',
        inputs: {
          monthlyInvestment: inputs.monthlyInvestment,
          annualReturn: inputs.annualReturn,
          timePeriod: `${inputs.timePeriodYears} years ${inputs.timePeriodMonths} months`,
          stepUp: inputs.stepUpPercentage > 0 ? `${inputs.stepUpPercentage}${inputs.stepUpType === 'percentage' ? '%' : ' ₹'}` : 'None'
        },
        results: {
          maturityAmount: results.maturityAmount,
          totalInvestment: results.totalInvestment,
          totalReturns: results.totalReturns
        }
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        className="text-center"
        {...fadeInUp}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">SIP Calculator</h1>
        <p className="text-gray-600">Calculate your Systematic Investment Plan returns</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          {...fadeInUp}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            📊 Investment Details
          </h2>

          <div className="space-y-4">
            {/* Monthly Investment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Investment
              </label>
              <CurrencyInput
                value={inputs.monthlyInvestment}
                onChange={(value) => handleInputChange('monthlyInvestment', value)}
                placeholder="Enter monthly investment amount"
                disabled={inputs.calculationType === 'maturity'}
              />
            </div>

            {/* Expected Annual Return */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                value={inputs.annualReturn}
                onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12"
                step="0.1"
                min="0"
                max="50"
              />
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Period
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Years</label>
                  <input
                    type="number"
                    value={inputs.timePeriodYears}
                    onChange={(e) => handleInputChange('timePeriodYears', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10"
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Months</label>
                  <input
                    type="number"
                    value={inputs.timePeriodMonths}
                    onChange={(e) => handleInputChange('timePeriodMonths', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    max="11"
                  />
                </div>
              </div>
            </div>

            {/* Lump Sum Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lump Sum Amount (Optional)
              </label>
              <CurrencyInput
                value={inputs.lumpSumAmount}
                onChange={(value) => handleInputChange('lumpSumAmount', value)}
                placeholder="Enter lump sum amount"
              />
            </div>

            {/* Step-up SIP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Step-up
              </label>
              <div className="space-y-2">
                <select
                  value={inputs.stepUpType}
                  onChange={(e) => handleInputChange('stepUpType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="amount">Fixed Amount (₹)</option>
                </select>

                {inputs.stepUpType === 'percentage' ? (
                  <input
                    type="number"
                    value={inputs.stepUpPercentage}
                    onChange={(e) => handleInputChange('stepUpPercentage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter step-up percentage"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                ) : (
                  <CurrencyInput
                    value={inputs.stepUpPercentage}
                    onChange={(value) => handleInputChange('stepUpPercentage', value)}
                    placeholder="Enter step-up amount"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          {...fadeInUp}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            📈 Results
          </h2>

          {results ? (
            <div className="space-y-4">
              {/* Key Results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Monthly Amount</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {formatCurrency(results.monthlyInvestment)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Total Investment</p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatCurrency(results.totalInvestment)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Wealth Gained</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {formatCurrency(results.wealthGained)}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Monthly SIP</p>
                  <p className="text-2xl font-bold text-orange-800">
                    {formatCurrency(results.monthlyInvestment)}
                  </p>
                </div>
              </div>

              {/* Maturity Amount - Highlighted */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-lg text-white text-center">
                <p className="text-lg font-medium opacity-90">Maturity Amount</p>
                <p className="text-4xl font-bold">
                  {formatCurrency(results.maturityAmount)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
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
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500">Enter investment details to see results</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Investment Summary */}
      {results && (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          {...fadeInUp}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Investment Summary</h3>

          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Monthly SIP</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(results.monthlyInvestment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Investment</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(results.totalInvestment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Returns</p>
              <p className="text-xl font-bold text-purple-600">
                {formatCurrency(results.totalReturns)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Wealth Gained</p>
              <p className="text-xl font-bold text-orange-600">
                {results.totalReturns > 0 ? '+' : ''}{((results.totalReturns / results.totalInvestment) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Growth Visualization */}
      {yearlyBreakdown.length > 0 && (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          {...fadeInUp}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Visualization</h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                <Tooltip
                  formatter={(value, name) => [formatCurrency(value), name]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="investment"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Total Investment"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Portfolio Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* PDF Export */}
      {results && (
        <PDFExport
          calculatorName="SIP Calculator"
          inputs={inputs}
          results={results}
          yearlyBreakdown={yearlyBreakdown}
        />
      )}

      {/* PWA Install Button */}
      {deferredPrompt && (
        <motion.button
          onClick={handleInstallClick}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📱 Install App
        </motion.button>
      )}
    </div>
  )
}
