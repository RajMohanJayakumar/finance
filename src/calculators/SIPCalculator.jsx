import React, { useState, useEffect, useCallback } from 'react'
import PDFExport from '../components/PDFExport'
import { useComparison } from '../contexts/ComparisonContext'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'

export default function SIPCalculator({ onAddToComparison, categoryColor = 'purple' }) {
  const { addToComparison } = useComparison()

  const initialInputs = {
    monthlyInvestment: '',
    maturityAmount: '',
    lumpSumAmount: '',
    annualReturn: '12',
    timePeriod: '10',
    timePeriodUnit: 'years', // 'months' or 'years'
    stepUpPercentage: '0',
    calculationType: 'monthly'
  }

  // Use URL state management for inputs
  const [inputs, setInputs, updateInputKey] = useURLStateObject('sip_')

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setInputs(initialInputs)
    }
  }, [])

  const [results, setResults] = useState(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState([])
  const [activeTab, setActiveTab] = useState('calculator')
  const [comparisons, setComparisons] = useState([])
  const [collapsedSections, setCollapsedSections] = useState({
    inputs: false,
    advanced: true,
    results: false,
    breakdown: true,
    compare: true
  })
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
      const { outcome } = await deferredPrompt.userChoice
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
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
    setYearlyBreakdown([])
    setComparisons([])
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const calculateSIP = useCallback(() => {
    const monthly = parseFloat(inputs.monthlyInvestment) || 0
    const targetAmount = parseFloat(inputs.maturityAmount) || 0
    const lumpSum = parseFloat(inputs.lumpSumAmount) || 0
    const rate = parseFloat(inputs.annualReturn) / 100 / 12
    const timePeriodValue = parseInt(inputs.timePeriod) || 0
    const totalMonths = inputs.timePeriodUnit === 'years' ? timePeriodValue * 12 : timePeriodValue
    const years = Math.floor(totalMonths / 12)
    const stepUp = parseFloat(inputs.stepUpPercentage) / 100

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
        let yearStartValue = futureValue

        for (let month = 1; month <= 12; month++) {
          futureValue = (futureValue + currentMonthlyInvestment) * (1 + rate)
          yearlyInvestment += currentMonthlyInvestment
          totalInvestment += currentMonthlyInvestment
        }

        // Apply step-up at year end
        currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUp)

        breakdown.push({
          year,
          yearlyInvestment: Math.round(yearlyInvestment),
          yearEndValue: Math.round(futureValue),
          totalInvestment: Math.round(totalInvestment)
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
  }, [
    inputs.monthlyInvestment,
    inputs.maturityAmount,
    inputs.lumpSumAmount,
    inputs.annualReturn,
    inputs.timePeriod,
    inputs.timePeriodUnit,
    inputs.stepUpPercentage,
    inputs.calculationType
  ])

  useEffect(() => {
    if ((inputs.monthlyInvestment || inputs.maturityAmount) && inputs.annualReturn && inputs.timePeriod) {
      calculateSIP()
    }
  }, [
    inputs.monthlyInvestment,
    inputs.maturityAmount,
    inputs.lumpSumAmount,
    inputs.annualReturn,
    inputs.timePeriod,
    inputs.timePeriodUnit,
    inputs.stepUpPercentage,
    inputs.calculationType
  ])

  const addToCompare = () => {
    if (results) {
      const comparison = {
        id: Date.now(),
        monthlyInvestment: inputs.monthlyInvestment || results.monthlyInvestment,
        lumpSumAmount: inputs.lumpSumAmount,
        annualReturn: inputs.annualReturn,
        timePeriod: inputs.timePeriod,
        timePeriodUnit: inputs.timePeriodUnit,
        stepUpPercentage: inputs.stepUpPercentage,
        futureValue: results.maturityAmount,
        totalInvested: results.totalInvestment,
        totalGains: results.wealthGained,
        timestamp: new Date().toLocaleString()
      }
      setComparisons(prev => [...prev, comparison])
      setCollapsedSections(prev => ({ ...prev, compare: false }))
    }
  }

  const removeFromCompare = (id) => {
    setComparisons(prev => prev.filter(comp => comp.id !== id))
  }

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        calculator: 'SIP Calculator',
        inputs: {
          'Monthly Investment': `₹${inputs.monthlyInvestment || results.monthlyInvestment}`,
          'Lump Sum Amount': inputs.lumpSumAmount ? `₹${inputs.lumpSumAmount}` : 'None',
          'Investment Period': `${inputs.timePeriod} ${inputs.timePeriodUnit}`,
          'Expected Annual Return': `${inputs.annualReturn}%`,
          'Step Up Percentage': `${inputs.stepUpPercentage}%`
        },
        results: {
          'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
          'Total Investment': `₹${results.totalInvestment?.toLocaleString()}`,
          'Wealth Gained': `₹${results.wealthGained?.toLocaleString()}`
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
    const shareData = {
      title: 'SIP Calculator Results',
      text: `SIP Calculation: Monthly Investment ₹${inputs.monthlyInvestment} for ${inputs.timePeriod} ${inputs.timePeriodUnit}. Maturity Amount: ₹${results?.maturityAmount?.toLocaleString()}`,
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard! Your friend can use this link to see the same calculation.')
    }
  }

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            💰 SIP Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plan your systematic investment journey with advanced calculations
          </p>
        </div>

        {/* PWA Install Button */}
        {deferredPrompt && (
          <div className="text-center mb-6">
            <button
              onClick={handlePWAInstall}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              📱 Install App
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* Premium Calculator Inputs */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
            <button
              onClick={() => toggleSection('inputs')}
              className="w-full p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-between hover:from-indigo-100 hover:via-purple-100 hover:to-pink-100 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Investment Parameters
                </h3>
              </div>
              <span className="text-2xl text-gray-400">{collapsedSections.inputs ? '▼' : '▲'}</span>
            </button>

            {!collapsedSections.inputs && (
              <div className="p-8 space-y-8">
                {/* Expected Return - Full Width */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-bold text-gray-800 mb-3">
                    <span className="text-lg">📈</span>
                    <span>Expected Annual Return (%)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.annualReturn}
                      onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                      className="w-full px-6 py-4 text-lg font-semibold border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg"
                      placeholder="12.0"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
                      %
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-xl border border-blue-200">
                    💡 <strong>Tip:</strong> Typical mutual fund returns range from 10-15% annually
                  </p>
                </div>

                {/* Investment Amount Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-sm font-bold text-gray-800">
                      <span className="text-lg">💰</span>
                      <span>Monthly Investment (₹)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={inputs.monthlyInvestment}
                        onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                        placeholder="10,000"
                        className="w-full px-6 py-4 text-lg font-semibold border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                        ₹
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-sm font-bold text-gray-800">
                      <span className="text-lg">🎯</span>
                      <span>OR Target Amount (₹)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={inputs.maturityAmount}
                        onChange={(e) => handleInputChange('maturityAmount', e.target.value)}
                        placeholder="1,00,00,000"
                        className="w-full px-6 py-4 text-lg font-semibold border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                        ₹
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lump Sum - Full Width */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-bold text-gray-800">
                    <span className="text-lg">💎</span>
                    <span>Lump Sum Amount (₹) - Optional</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.lumpSumAmount}
                      onChange={(e) => handleInputChange('lumpSumAmount', e.target.value)}
                      placeholder="50,000"
                      className="w-full px-6 py-4 text-lg font-semibold border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                      ₹
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    💡 <strong>One-time investment:</strong> Add an initial lump sum to boost your returns
                  </p>
                </div>

                {/* Time Period Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-sm font-bold text-gray-800">
                      <span className="text-lg">⏰</span>
                      <span>Investment Period</span>
                    </label>
                    <input
                      type="number"
                      value={inputs.timePeriod}
                      onChange={(e) => handleInputChange('timePeriod', e.target.value)}
                      placeholder="10"
                      className="w-full px-6 py-4 text-lg font-semibold border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-sm font-bold text-gray-800">
                      <span className="text-lg">📅</span>
                      <span>Period Unit</span>
                    </label>
                    <select
                      value={inputs.timePeriodUnit}
                      onChange={(e) => handleInputChange('timePeriodUnit', e.target.value)}
                      className="w-full px-6 py-4 text-lg font-semibold border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg cursor-pointer"
                    >
                      <option value="years">Years</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>

                {/* Annual Step-up - Integrated into main flow */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-bold text-gray-800">
                    <span className="text-lg">📈</span>
                    <span>Annual Step-up (%)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.stepUpPercentage}
                      onChange={(e) => handleInputChange('stepUpPercentage', e.target.value)}
                      placeholder="5.0"
                      className="w-full px-6 py-4 text-lg font-semibold border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
                      %
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <span className="font-semibold text-emerald-700">💡 Smart Strategy:</span> Increase your investment amount by this percentage every year to beat inflation and accelerate wealth creation
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Always Visible */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white py-4 px-6 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="text-xl">🔄</span>
                  <span>Reset Calculator</span>
                </button>

                <button
                  onClick={handleAddToComparison}
                  disabled={!results}
                  className={`flex items-center justify-center space-x-2 bg-gradient-to-r ${
                    results
                      ? `${colorClasses[categoryColor]} hover:shadow-xl transform hover:scale-105`
                      : 'from-gray-300 to-gray-400 cursor-not-allowed'
                  } text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-lg flex-1`}
                >
                  <span className="text-xl">📊</span>
                  <span>Add to Comparison</span>
                </button>

                {results && (
                  <>
                    <button
                      onClick={shareCalculation}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="text-xl">🔗</span>
                      <span>Share</span>
                    </button>

                    <PDFExport
                      data={[{
                        calculator: 'SIP Calculator',
                        timestamp: new Date().toISOString(),
                        inputs: {
                          'Monthly Investment': `₹${inputs.monthlyInvestment || results.monthlyInvestment}`,
                          'Lump Sum Amount': inputs.lumpSumAmount ? `₹${inputs.lumpSumAmount}` : 'None',
                          'Investment Period': `${inputs.timePeriod} ${inputs.timePeriodUnit}`,
                          'Expected Annual Return': `${inputs.annualReturn}%`,
                          'Step Up Percentage': `${inputs.stepUpPercentage}%`
                        },
                        results: {
                          'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
                          'Total Investment': `₹${results.totalInvestment?.toLocaleString()}`,
                          'Wealth Gained': `₹${results.wealthGained?.toLocaleString()}`
                        }
                      }]}
                      title="SIP Calculator Results"
                      calculatorType="SIP"
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                      buttonContent={
                        <>
                          <span className="text-xl">📄</span>
                          <span>PDF</span>
                        </>
                      }
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
              <button
                onClick={() => toggleSection('results')}
                className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between hover:from-gray-100 hover:to-gray-200 transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-800">💰 Results</h3>
                <span className="text-2xl">{collapsedSections.results ? '▼' : '▲'}</span>
              </button>

              {!collapsedSections.results && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className={`bg-gradient-to-r ${colorClasses[categoryColor]} text-white p-4 rounded-xl`}>
                      <p className="text-sm opacity-90">Monthly Investment</p>
                      <p className="text-2xl font-bold">
                        ₹{results.monthlyInvestment?.toLocaleString()}
                      </p>
                    </div>
                    {results.lumpSumAmount > 0 && (
                      <div className={`bg-gradient-to-r ${colorClasses[categoryColor]} text-white p-4 rounded-xl`}>
                        <p className="text-sm opacity-90">Lump Sum</p>
                        <p className="text-2xl font-bold">
                          ₹{results.lumpSumAmount?.toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div className={`bg-gradient-to-r ${colorClasses[categoryColor]} text-white p-4 rounded-xl`}>
                      <p className="text-sm opacity-90">Maturity Amount</p>
                      <p className="text-2xl font-bold">
                        ₹{results.maturityAmount?.toLocaleString()}
                      </p>
                    </div>
                    <div className={`bg-gradient-to-r ${colorClasses[categoryColor]} text-white p-4 rounded-xl`}>
                      <p className="text-sm opacity-90">Wealth Gained</p>
                      <p className="text-2xl font-bold">
                        ₹{results.wealthGained?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-4">
                    {/* Primary Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleReset}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white py-4 px-6 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <span className="text-xl">🔄</span>
                        <span>Reset Calculator</span>
                      </button>

                      <button
                        onClick={handleAddToComparison}
                        disabled={!results}
                        className={`flex items-center justify-center space-x-2 bg-gradient-to-r ${
                          results
                            ? `${colorClasses[categoryColor]} hover:shadow-xl transform hover:scale-105`
                            : 'from-gray-300 to-gray-400 cursor-not-allowed'
                        } text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-lg flex-1`}
                      >
                        <span className="text-xl">📊</span>
                        <span>Add to Comparison</span>
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    {results && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={shareCalculation}
                          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                          <span className="text-lg">🔗</span>
                          <span>Share Results</span>
                        </button>

                        <PDFExport
                          data={[{
                            calculator: 'SIP Calculator',
                            timestamp: new Date().toISOString(),
                            inputs: {
                              'Monthly Investment': `₹${inputs.monthlyInvestment || results.monthlyInvestment}`,
                              'Lump Sum Amount': inputs.lumpSumAmount ? `₹${inputs.lumpSumAmount}` : 'None',
                              'Investment Period': `${inputs.timePeriod} ${inputs.timePeriodUnit}`,
                              'Expected Annual Return': `${inputs.annualReturn}%`,
                              'Step Up Percentage': `${inputs.stepUpPercentage}%`
                            },
                            results: {
                              'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
                              'Total Investment': `₹${results.totalInvestment?.toLocaleString()}`,
                              'Wealth Gained': `₹${results.wealthGained?.toLocaleString()}`
                            }
                          }]}
                          title="SIP Calculator Results"
                          calculatorType="SIP"
                          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg w-full"
                          buttonContent={
                            <>
                              <span className="text-lg">📄</span>
                              <span>Export PDF</span>
                            </>
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Year-wise Breakdown */}
          {yearlyBreakdown.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
              <button
                onClick={() => toggleSection('breakdown')}
                className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between hover:from-gray-100 hover:to-gray-200 transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-800">📈 Year-wise Breakdown</h3>
                <span className="text-2xl">{collapsedSections.breakdown ? '▼' : '▲'}</span>
              </button>

              {!collapsedSections.breakdown && (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Year</th>
                          <th className="text-right py-2">Yearly Investment</th>
                          <th className="text-right py-2">Year End Value</th>
                          <th className="text-right py-2">Total Investment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearlyBreakdown.map((year, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{year.year}</td>
                            <td className="text-right py-2">
                              ₹{year.yearlyInvestment.toLocaleString()}
                            </td>
                            <td className="text-right py-2">
                              ₹{year.yearEndValue.toLocaleString()}
                            </td>
                            <td className="text-right py-2">
                              ₹{year.totalInvestment.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Compare Section */}
          {comparisons.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection('compare')}
                className="w-full p-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold text-left flex justify-between items-center"
              >
                <span className="text-xl">📊 Compare Calculations ({comparisons.length})</span>
                <span className="text-2xl">{collapsedSections.compare ? '▼' : '▲'}</span>
              </button>
              {!collapsedSections.compare && (
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comparisons.map((comp, index) => (
                      <div key={comp.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-lg text-gray-800">Calculation #{index + 1}</h4>
                          <button
                            onClick={() => removeFromCompare(comp.id)}
                            className="text-red-500 hover:text-red-700 text-xl"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Monthly:</span>
                            <span className="font-semibold">₹{comp.monthlyInvestment}</span>
                          </div>
                          {comp.lumpSumAmount > 0 && (
                            <div className="flex justify-between">
                              <span>Lump Sum:</span>
                              <span className="font-semibold">₹{comp.lumpSumAmount}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span>{comp.timePeriod} {comp.timePeriodUnit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Return:</span>
                            <span>{comp.annualReturn}%</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Maturity:</span>
                            <span className="font-bold text-green-600">₹{parseInt(comp.futureValue).toLocaleString()}</span>
                          </div>
                          <div className="text-xs text-gray-500">{comp.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Share Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📤 Share Your Calculation</h3>
            <button
              onClick={shareCalculation}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🔗 Share Results
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}