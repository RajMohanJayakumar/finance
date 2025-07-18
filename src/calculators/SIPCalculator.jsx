import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const countries = {
  'india': { flag: '🇮🇳', name: 'India', currency: '₹', typical_return: 12 },
  'usa': { flag: '🇺🇸', name: 'USA', currency: '$', typical_return: 8 },
  'uk': { flag: '🇬🇧', name: 'UK', currency: '£', typical_return: 7 },
  'canada': { flag: '🇨🇦', name: 'Canada', currency: 'C$', typical_return: 7.5 }
}

export default function SIPCalculator({ onAddToComparison, categoryColor = 'purple' }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [inputs, setInputs] = useState({
    monthlyInvestment: '',
    maturityAmount: '',
    annualReturn: '12',
    timePeriodYears: '10',
    timePeriodMonths: '0',
    stepUpPercentage: '0',
    country: 'india',
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

  const updateURL = useCallback((newInputs) => {
    const params = new URLSearchParams()
    Object.entries(newInputs).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })

    const newURL = `${location.pathname}?${params.toString()}`
    navigate(newURL, { replace: true })
  }, [location.pathname, navigate])

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }

    if (field === 'country') {
      newInputs.annualReturn = countries[value].typical_return.toString()
    }

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
    const rate = parseFloat(inputs.annualReturn) / 100 / 12
    const years = parseInt(inputs.timePeriodYears) || 0
    const months = parseInt(inputs.timePeriodMonths) || 0
    const totalMonths = years * 12 + months
    const stepUp = parseFloat(inputs.stepUpPercentage) / 100

    if (totalMonths <= 0) return

    let calculatedResults = {}
    let breakdown = []
   if (inputs.calculationType === 'monthly' && monthly > 0) {
      // Calculate maturity amount from monthly investment
      let futureValue = 0
      let totalInvested = 0
      let currentMonthly = monthly

      for (let year = 1; year <= Math.ceil(totalMonths / 12); year++) {
        let yearlyInvested = 0
        let yearlyValue = 0

        for (let month = 1; month <= Math.min(12, totalMonths - (year-1)*12); month++) {
          if ((year - 1) * 12 + month > totalMonths) break

          totalInvested += currentMonthly
          yearlyInvested += currentMonthly

          const remainingMonths = totalMonths - ((year - 1) * 12 + month) + 1
          const monthlyGrowth = currentMonthly * Math.pow(1 + rate, remainingMonths -1);
          futureValue += monthlyGrowth
          yearlyValue += monthlyGrowth
        }

        breakdown.push({
          year,
          yearlyInvestment: yearlyInvested,
          yearEndValue: futureValue,
          totalInvested
        })

        currentMonthly *= (1 + stepUp)
      }

      calculatedResults = {
        maturityAmount: futureValue,
        totalInvestment: totalInvested,
        wealthGained: futureValue - totalInvested
      }
    } else if (inputs.calculationType === 'maturity' && targetAmount > 0) {
      // Calculate required monthly investment from target amount
      if (stepUp === 0) {
        const monthlyRequired = targetAmount / (((Math.pow(1 + rate, totalMonths) - 1) / rate) * (1 + rate))
        calculatedResults = {
          monthlyInvestment: monthlyRequired,
          totalInvestment: monthlyRequired * totalMonths,
          wealthGained: targetAmount - (monthlyRequired * totalMonths)
        }
           setInputs(prev => ({ ...prev, monthlyInvestment: monthlyRequired.toFixed(0) }))
      } else {
        let estimatedMonthly = targetAmount / (totalMonths * 1.5)
        calculatedResults = {
          monthlyInvestment: estimatedMonthly,
          totalInvestment: estimatedMonthly * totalMonths,
          wealthGained: targetAmount - (estimatedMonthly * totalMonths)
        }
         setInputs(prev => ({ ...prev, monthlyInvestment: estimatedMonthly.toFixed(0) }))

      }
    }


    setResults(calculatedResults)
    setYearlyBreakdown(breakdown)
  }, [inputs])

  useEffect(() => {
    if ((inputs.monthlyInvestment || inputs.maturityAmount) && inputs.annualReturn && inputs.timePeriodYears) {
      calculateSIP()
    }
  }, [calculateSIP, inputs.monthlyInvestment, inputs.maturityAmount, inputs.annualReturn, inputs.timePeriodYears, inputs.timePeriodMonths, inputs.stepUpPercentage, inputs.calculationType])

  const addToCompare = () => {
    if (results) {
      const comparison = {
        id: Date.now(),
        monthlyInvestment: inputs.monthlyInvestment || results.monthlyInvestment,
        annualReturn: inputs.annualReturn,
        timePeriodYears: inputs.timePeriodYears,
        timePeriodMonths: inputs.timePeriodMonths,
        stepUpPercentage: inputs.stepUpPercentage,
        country: inputs.country,
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
          currency: countries[inputs.country].currency
        },
        results: {
          [`Maturity Amount (${countries[inputs.country].currency})`]: results.maturityAmount?.toLocaleString() || 'N/A',
          [`Total Investment (${countries[inputs.country].currency})`]: results.totalInvestment?.toLocaleString() || 'N/A',
          [`Wealth Gained (${countries[inputs.country].currency})`]: results.wealthGained?.toLocaleString() || 'N/A'
        }
      })
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'SIP Calculator Results',
      text: `SIP Calculation: Monthly Investment ${countries[inputs.country].currency}${inputs.monthlyInvestment} for ${inputs.timePeriodYears} years`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(JSON.stringify(results))
      alert('Results copied to clipboard!')
    }
  }

  const selectedCountry = countries[inputs.country]

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
          {/* Calculator Inputs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <button
              onClick={() => toggleSection('inputs')}
              className={`w-full p-6 bg-gradient-to-r ${
                categoryColor === 'purple' ? 'from-purple-500 to-purple-600' : 
                categoryColor === 'blue' ? 'from-blue-500 to-blue-600' :
                'from-gray-500 to-gray-600'
              } text-white font-semibold text-left flex justify-between items-center hover:from-purple-600 hover:to-purple-700 transition-all`}
            >
              <span className="text-xl">⚙️ Calculator Inputs</span>
              <span className="text-2xl">{collapsedSections.inputs ? '▼' : '▲'}</span>
            </button>

            {!collapsedSections.inputs && (
              <div className="p-6 space-y-6">
                {/* Country Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">
                    🌍 Country
                  </label>
                  <select 
                    value={inputs.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-lg transition-all"
                  >
                    {Object.entries(countries).map(([key, country]) => (
                      <option key={key} value={key}>
                        {country.flag} {country.name} (Typical: {country.typical_return}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calculation Type */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">
                    🔄 Calculation Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('calculationType', 'monthly')}
                      className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                        inputs.calculationType === 'monthly'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      💰 Calculate Maturity Amount
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('calculationType', 'maturity')}
                      className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                        inputs.calculationType === 'maturity'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      🎯 Calculate Required Investment
                    </button>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  {inputs.calculationType === 'monthly' ? (
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-700">
                        💵 Monthly Investment ({selectedCountry.currency})
                      </label>
                      <input
                        type="number"
                        value={inputs.monthlyInvestment}
                        onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                        placeholder="Enter monthly investment"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-lg transition-all"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-700">
                        🎯 Target Maturity Amount ({selectedCountry.currency})
                      </label>
                      <input
                        type="number"
                        value={inputs.maturityAmount}
                        onChange={(e) => handleInputChange('maturityAmount', e.target.value)}
                        placeholder="Enter target amount"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-lg transition-all"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      📈 Expected Annual Return (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.annualReturn}
                      onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                      placeholder="Enter expected return"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-lg transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      📅 Investment Duration (Years)
                    </label>
                    <input
                      type="number"
                      value={inputs.timePeriodYears}
                      onChange={(e) => handleInputChange('timePeriodYears', e.target.value)}
                      placeholder="Enter years"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-lg transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      📅 Additional Months
                    </label>
                    <input
                      type="number"
                      value={inputs.timePeriodMonths}
                      onChange={(e) => handleInputChange('timePeriodMonths', e.target.value)}
                      placeholder="0"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-lg transition-all"
                    />
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="border-t pt-6">
                  <button
                    onClick={() => toggleSection('advanced')}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold mb-4"
                  >
                    <span>{collapsedSections.advanced ? '▶' : '▼'}</span>
                    <span>🎚️ Advanced Options</span>
                  </button>

                  {!collapsedSections.advanced && (
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-700">
                        📈 Yearly Step-up (%)
                      </label>
                      <input
                        type="number"
                        value={inputs.stepUpPercentage}
                        onChange={(e) => handleInputChange('stepUpPercentage', e.target.value)}
                        placeholder="0"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-lg transition-all"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        💡 Increase your monthly investment by this percentage each year
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          {results && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection('results')}
                className="w-full p-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-left flex justify-between items-center hover:from-green-600 hover:to-green-700 transition-all"
              >
                <span className="text-xl">💡 Results</span>
                <span className="text-2xl">{collapsedSections.results ? '▼' : '▲'}</span>
              </button>

              {!collapsedSections.results && (
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-l-4 border-blue-500">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">💰 Maturity Amount</h3>
                      <p className="text-3xl font-bold text-blue-900">
                        {selectedCountry.currency}{results.maturityAmount?.toLocaleString() || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border-l-4 border-yellow-500">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">💵 Total Investment</h3>
                      <p className="text-3xl font-bold text-yellow-900">
                        {selectedCountry.currency}{results.totalInvestment?.toLocaleString() || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-l-4 border-green-500">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">📈 Wealth Gained</h3>
                      <p className="text-3xl font-bold text-green-900">
                        {selectedCountry.currency}{results.wealthGained?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={handleAddToComparison}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                      <span>📊</span>
                      <span>Add to Compare</span>
                    </button>

                    <button
                      onClick={shareCalculation}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                      <span>🔗</span>
                      <span>Share Results</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Year-wise Breakdown */}
          {yearlyBreakdown.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection('breakdown')}
                className="w-full p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold text-left flex justify-between items-center hover:from-indigo-600 hover:to-indigo-700 transition-all"
              >
                <span className="text-xl">📊 Year-wise Breakdown</span>
                <span className="text-2xl">{collapsedSections.breakdown ? '▼' : '▲'}</span>
              </button>

              {!collapsedSections.breakdown && (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Year</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Yearly Investment</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Year End Value</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Total Invested</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearlyBreakdown.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-3">{row.year}</td>
                            <td className="border border-gray-200 px-4 py-3">
                              {selectedCountry.currency}{row.yearlyInvestment?.toLocaleString()}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 font-semibold text-green-600">
                              {selectedCountry.currency}{row.yearEndValue?.toLocaleString()}
                            </td>
                            <td className="border border-gray-200 px-4 py-3">
                              {selectedCountry.currency}{row.totalInvested?.toLocaleString()}
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
                            <span className="font-semibold">{countries[comp.country].currency}{comp.monthlyInvestment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span>{comp.timePeriodYears}y {comp.timePeriodMonths}m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Return:</span>
                            <span>{comp.annualReturn}%</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Maturity:</span>
                            <span className="font-bold text-green-600">{countries[comp.country].currency}{parseInt(comp.futureValue).toLocaleString()}</span>
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