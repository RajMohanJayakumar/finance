
import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const countries = {
  'india': { flag: '🇮🇳', name: 'India', currency: '₹', typical_return: 12 },
  'usa': { flag: '🇺🇸', name: 'USA', currency: '$', typical_return: 8 },
  'uk': { flag: '🇬🇧', name: 'UK', currency: '£', typical_return: 7 },
  'canada': { flag: '🇨🇦', name: 'Canada', currency: 'C$', typical_return: 7.5 }
}

export default function SIPCalculator() {
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
    const r = (parseFloat(inputs.annualReturn) || 0) / 100 / 12
    const totalMonths = (parseFloat(inputs.timePeriodYears) || 0) * 12 + (parseFloat(inputs.timePeriodMonths) || 0)
    const stepUp = (parseFloat(inputs.stepUpPercentage) || 0) / 100

    if (totalMonths === 0 || r === 0) return

    let breakdown = []
    let totalInvested = 0
    let futureValue = 0

    if (inputs.calculationType === 'monthly') {
      let monthlyInvestment = parseFloat(inputs.monthlyInvestment) || 0
      
      if (stepUp === 0) {
        futureValue = monthlyInvestment * (((1 + r) ** totalMonths - 1) / r) * (1 + r)
        totalInvested = monthlyInvestment * totalMonths
      } else {
        let currentMonthly = monthlyInvestment
        for (let year = 1; year <= Math.ceil(totalMonths / 12); year++) {
          const monthsInYear = Math.min(12, totalMonths - (year - 1) * 12)
          const yearInvested = currentMonthly * monthsInYear
          totalInvested += yearInvested
          
          const remainingMonths = totalMonths - (year - 1) * 12
          const yearFV = currentMonthly * (((1 + r) ** remainingMonths - 1) / r) * (1 + r)
          futureValue += yearFV
          
          breakdown.push({
            year,
            monthlyAmount: currentMonthly,
            yearlyInvestment: yearInvested,
            cumulativeInvestment: totalInvested,
            yearEndValue: futureValue
          })
          
          currentMonthly = currentMonthly * (1 + stepUp)
        }
      }
    } else if (inputs.calculationType === 'maturity') {
      const targetFV = parseFloat(inputs.maturityAmount) || 0
      
      if (stepUp === 0) {
        const monthlyInvestment = targetFV / (((1 + r) ** totalMonths - 1) / r * (1 + r))
        totalInvested = monthlyInvestment * totalMonths
        futureValue = targetFV
        
        setInputs(prev => ({ ...prev, monthlyInvestment: monthlyInvestment.toFixed(0) }))
      } else {
        let estimatedMonthly = targetFV / (totalMonths * 1.5)
        totalInvested = estimatedMonthly * totalMonths
        futureValue = targetFV
        
        setInputs(prev => ({ ...prev, monthlyInvestment: estimatedMonthly.toFixed(0) }))
      }
    }

    const totalGains = futureValue - totalInvested

    setResults({
      futureValue: futureValue.toFixed(0),
      totalInvested: totalInvested.toFixed(0),
      totalGains: totalGains.toFixed(0),
      monthlyInvestment: inputs.monthlyInvestment || (futureValue / totalMonths * r).toFixed(0)
    })

    setYearlyBreakdown(breakdown)
  }, [inputs])

  useEffect(() => {
    if ((inputs.monthlyInvestment || inputs.maturityAmount) && inputs.annualReturn && inputs.timePeriodYears) {
      calculateSIP()
    }
  }, [inputs.monthlyInvestment, inputs.maturityAmount, inputs.annualReturn, inputs.timePeriodYears, inputs.timePeriodMonths, inputs.stepUpPercentage, inputs.calculationType])

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
        futureValue: results.futureValue,
        totalInvested: results.totalInvested,
        totalGains: results.totalGains,
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

  const shareCalculation = () => {
    const shareData = {
      title: 'SIP Calculator Result',
      text: `My SIP calculation: Monthly: ${countries[inputs.country].currency}${results?.monthlyInvestment}, Returns: ${inputs.annualReturn}%, Maturity: ${countries[inputs.country].currency}${results?.futureValue}`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
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
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <button
              onClick={() => toggleSection('inputs')}
              className="w-full p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-left flex justify-between items-center"
            >
              <span className="text-xl">⚙️ Calculator Inputs</span>
              <span className="text-2xl">{collapsedSections.inputs ? '▼' : '▲'}</span>
            </button>
            {!collapsedSections.inputs && (
              <div className="p-6">
                {/* Country Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3 text-gray-700">
                    🌍 Country
                  </label>
                  <select 
                    value={inputs.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white text-lg transition-all"
                  >
                    {Object.entries(countries).map(([key, country]) => (
                      <option key={key} value={key}>
                        {country.flag} {country.name} (Typical: {country.typical_return}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Investment Inputs */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      💵 Monthly Investment ({selectedCountry.currency})
                    </label>
                    <input
                      type="number"
                      value={inputs.monthlyInvestment}
                      onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg transition-all"
                      placeholder="e.g., 5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      🎯 Target Amount ({selectedCountry.currency})
                    </label>
                    <input
                      type="number"
                      value={inputs.maturityAmount}
                      onChange={(e) => handleInputChange('maturityAmount', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg transition-all"
                      placeholder="e.g., 1000000"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      📅 Duration (Years)
                    </label>
                    <input
                      type="number"
                      value={inputs.timePeriodYears}
                      onChange={(e) => handleInputChange('timePeriodYears', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg transition-all"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      📅 Extra Months
                    </label>
                    <input
                      type="number"
                      value={inputs.timePeriodMonths}
                      onChange={(e) => handleInputChange('timePeriodMonths', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg transition-all"
                      placeholder="0"
                      max="11"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      📈 Expected Annual Return (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.annualReturn}
                      onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg transition-all"
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      🎚️ Yearly Step-up (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.stepUpPercentage}
                      onChange={(e) => handleInputChange('stepUpPercentage', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          {results && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection('results')}
                className="w-full p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-left flex justify-between items-center"
              >
                <span className="text-xl">📊 Investment Results</span>
                <span className="text-2xl">{collapsedSections.results ? '▼' : '▲'}</span>
              </button>
              {!collapsedSections.results && (
                <div className="p-6">
                  <div className="grid gap-4 mb-6">
                    <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-6 border-l-4 border-orange-500">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">💰 Total Investment</span>
                        <span className="text-2xl font-bold text-orange-600">
                          {selectedCountry.currency}{parseInt(results.totalInvested).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border-l-4 border-green-500">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">📈 Wealth Gained</span>
                        <span className="text-2xl font-bold text-green-600">
                          {selectedCountry.currency}{parseInt(results.totalGains).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">🎯 Maturity Amount</span>
                        <span className="text-3xl font-bold">
                          {selectedCountry.currency}{parseInt(results.futureValue).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={addToCompare}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      📋 Add to Compare
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Year-wise Breakdown */}
          {results && yearlyBreakdown.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection('breakdown')}
                className="w-full p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-left flex justify-between items-center"
              >
                <span className="text-xl">📆 Year-wise Breakdown</span>
                <span className="text-2xl">{collapsedSections.breakdown ? '▼' : '▲'}</span>
              </button>
              {!collapsedSections.breakdown && (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full rounded-xl overflow-hidden">
                      <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                        <tr>
                          <th className="p-4 text-left">Year</th>
                          <th className="p-4 text-left">Monthly Amount</th>
                          <th className="p-4 text-left">Yearly Investment</th>
                          <th className="p-4 text-left">Cumulative Investment</th>
                          <th className="p-4 text-left">Portfolio Value</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {yearlyBreakdown.map((year, index) => (
                          <tr key={index} className="border-b hover:bg-purple-50 transition-colors">
                            <td className="p-4 font-semibold">{year.year}</td>
                            <td className="p-4">{selectedCountry.currency}{year.monthlyAmount?.toLocaleString()}</td>
                            <td className="p-4">{selectedCountry.currency}{year.yearlyInvestment?.toLocaleString()}</td>
                            <td className="p-4">{selectedCountry.currency}{year.cumulativeInvestment?.toLocaleString()}</td>
                            <td className="p-4 font-semibold text-green-600">{selectedCountry.currency}{year.yearEndValue?.toLocaleString()}</td>
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
