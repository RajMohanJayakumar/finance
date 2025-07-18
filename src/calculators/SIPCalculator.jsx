import React, { useState, useEffect, useCallback } from 'react'

export default function SIPCalculator({ onAddToComparison, categoryColor = 'purple' }) {

  const [inputs, setInputs] = useState({
    monthlyInvestment: '',
    maturityAmount: '',
    lumpSumAmount: '',
    annualReturn: '12',
    timePeriod: '10',
    timePeriodUnit: 'years', // 'months' or 'years'
    stepUpPercentage: '0',
    calculationType: 'monthly'
  })

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

  // Placeholder for future URL functionality
  const updateURL = useCallback((newInputs) => {
    // URL update functionality can be added here if needed
  }, [])

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
    updateURL(newInputs)
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
    if (results && onAddToComparison) {
      onAddToComparison({
        calculator: 'SIP Calculator',
        inputs: {
          ...inputs,
          currency: '₹'
        },
        results: {
          'Maturity Amount (₹)': results.maturityAmount?.toLocaleString() || 'N/A',
          'Total Investment (₹)': results.totalInvestment?.toLocaleString() || 'N/A',
          'Wealth Gained (₹)': results.wealthGained?.toLocaleString() || 'N/A'
        }
      })
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'SIP Calculator Results',
      text: `SIP Calculation: Monthly Investment ₹${inputs.monthlyInvestment} for ${inputs.timePeriod} ${inputs.timePeriodUnit}`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(JSON.stringify(results))
      alert('Results copied to clipboard!')
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
          {/* Basic Inputs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <button
              onClick={() => toggleSection('inputs')}
              className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between hover:from-gray-100 hover:to-gray-200 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-800">📊 Calculator Inputs</h3>
              <span className="text-2xl">{collapsedSections.inputs ? '▼' : '▲'}</span>
            </button>

            {!collapsedSections.inputs && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Annual Return (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.annualReturn}
                      onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Typical mutual fund returns: 10-15%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Investment (₹)
                    </label>
                    <input
                      type="number"
                      value={inputs.monthlyInvestment}
                      onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                      placeholder="Enter monthly amount"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OR Target Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={inputs.maturityAmount}
                      onChange={(e) => handleInputChange('maturityAmount', e.target.value)}
                      placeholder="Enter target amount"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lump Sum Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={inputs.lumpSumAmount}
                      onChange={(e) => handleInputChange('lumpSumAmount', e.target.value)}
                      placeholder="Enter lump sum amount (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Initial one-time investment amount
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Period
                    </label>
                    <input
                      type="number"
                      value={inputs.timePeriod}
                      onChange={(e) => handleInputChange('timePeriod', e.target.value)}
                      placeholder="Enter duration"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Period Unit
                    </label>
                    <select
                      value={inputs.timePeriodUnit}
                      onChange={(e) => handleInputChange('timePeriodUnit', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="years">Years</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Options */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <button
              onClick={() => toggleSection('advanced')}
              className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between hover:from-gray-100 hover:to-gray-200 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-800">⚙️ Advanced Options</h3>
              <span className="text-2xl">{collapsedSections.advanced ? '▼' : '▲'}</span>
            </button>

            {!collapsedSections.advanced && (
              <div className="p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Step-up (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.stepUpPercentage}
                    onChange={(e) => handleInputChange('stepUpPercentage', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Increase investment amount by this percentage every year
                  </p>
                </div>
              </div>
            )}
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

                  <button
                    onClick={handleAddToComparison}
                    className={`w-full bg-gradient-to-r ${colorClasses[categoryColor]} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all`}
                  >
                    📊 Add to Comparison
                  </button>
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