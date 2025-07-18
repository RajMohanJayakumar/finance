
import React, { useState, useEffect } from 'react'
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
    calculationType: 'monthly' // monthly or maturity
  })

  const [results, setResults] = useState(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState([])
  const [activeTab, setActiveTab] = useState('calculator')
  const [showTooltip, setShowTooltip] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const newInputs = { ...inputs }

    Object.keys(inputs).forEach(key => {
      const value = urlParams.get(key)
      if (value) newInputs[key] = value
    })

    setInputs(newInputs)
  }, [location.search])

  const updateURL = (newInputs) => {
    const params = new URLSearchParams()
    Object.entries(newInputs).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })

    const newURL = `${location.pathname}?${params.toString()}`
    navigate(newURL, { replace: true })
  }

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    
    // Auto-fill typical return rate when country changes
    if (field === 'country') {
      newInputs.annualReturn = countries[value].typical_return.toString()
    }
    
    // Clear opposite calculation field
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

  const calculateSIP = () => {
    const r = (parseFloat(inputs.annualReturn) || 0) / 100 / 12 // Monthly rate
    const totalMonths = (parseFloat(inputs.timePeriodYears) || 0) * 12 + (parseFloat(inputs.timePeriodMonths) || 0)
    const stepUp = (parseFloat(inputs.stepUpPercentage) || 0) / 100

    if (totalMonths === 0 || r === 0) return

    let breakdown = []
    let totalInvested = 0
    let futureValue = 0

    if (inputs.calculationType === 'monthly') {
      let monthlyInvestment = parseFloat(inputs.monthlyInvestment) || 0
      
      if (stepUp === 0) {
        // Simple SIP calculation
        futureValue = monthlyInvestment * (((1 + r) ** totalMonths - 1) / r) * (1 + r)
        totalInvested = monthlyInvestment * totalMonths
      } else {
        // Step-up SIP calculation
        let currentMonthly = monthlyInvestment
        for (let year = 1; year <= Math.ceil(totalMonths / 12); year++) {
          const monthsInYear = Math.min(12, totalMonths - (year - 1) * 12)
          const yearInvested = currentMonthly * monthsInYear
          totalInvested += yearInvested
          
          // Calculate future value for this year's investment
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
        // Reverse calculation for simple SIP
        const monthlyInvestment = targetFV / (((1 + r) ** totalMonths - 1) / r * (1 + r))
        totalInvested = monthlyInvestment * totalMonths
        futureValue = targetFV
        
        // Auto-fill monthly investment
        setInputs(prev => ({ ...prev, monthlyInvestment: monthlyInvestment.toFixed(0) }))
      } else {
        // For step-up SIP with target amount, we need iterative calculation
        // This is a simplified approach
        let estimatedMonthly = targetFV / (totalMonths * 1.5) // Rough estimate
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
  }

  useEffect(() => {
    if ((inputs.monthlyInvestment || inputs.maturityAmount) && inputs.annualReturn && inputs.timePeriodYears) {
      calculateSIP()
    }
  }, [inputs])

  const downloadPDF = () => {
    // Simple implementation - in a real app, you'd use a PDF library
    const content = `
SIP Calculator Results
Country: ${countries[inputs.country].name}
Monthly Investment: ${countries[inputs.country].currency}${results?.monthlyInvestment}
Time Period: ${inputs.timePeriodYears} years ${inputs.timePeriodMonths} months
Expected Return: ${inputs.annualReturn}%
Step-up: ${inputs.stepUpPercentage}%

Results:
Total Investment: ${countries[inputs.country].currency}${results?.totalInvested}
Wealth Gained: ${countries[inputs.country].currency}${results?.totalGains}
Maturity Amount: ${countries[inputs.country].currency}${results?.futureValue}
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sip-calculation.txt'
    a.click()
  }

  const selectedCountry = countries[inputs.country]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            💰 SIP Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plan your systematic investment journey with advanced calculations and country-specific insights
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-6 py-2 rounded-full transition-all ${
                activeTab === 'calculator' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              🧮 Calculator
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-6 py-2 rounded-full transition-all ${
                activeTab === 'breakdown' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              📊 Breakdown
            </button>
          </div>
        </div>

        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="calculator-card rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                ⚙️ Calculator Inputs
                <div className="tooltip">
                  <span className="text-blue-500 cursor-help text-lg">ℹ️</span>
                  <span className="tooltiptext">
                    SIP Formula: FV = PMT × [((1+r)^n - 1) / r] × (1+r)
                  </span>
                </div>
              </h2>

              {/* Country Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  🌍 Country
                </label>
                <select 
                  value={inputs.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl input-focus bg-white text-lg"
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
                    className="w-full p-4 border-2 border-gray-200 rounded-xl input-focus text-lg"
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
                    className="w-full p-4 border-2 border-gray-200 rounded-xl input-focus text-lg"
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
                    className="w-full p-4 border-2 border-gray-200 rounded-xl input-focus text-lg"
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
                    className="w-full p-4 border-2 border-gray-200 rounded-xl input-focus text-lg"
                    placeholder="0"
                    max="11"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">
                    📈 Expected Annual Return (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.annualReturn}
                    onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl input-focus text-lg"
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
                    className="w-full p-4 border-2 border-gray-200 rounded-xl input-focus text-lg"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div className="space-y-6">
                <div className="result-card rounded-2xl p-6 lg:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-blue-700">📊 Investment Results</h2>
                  
                  <div className="grid gap-4">
                    <div className="investment-card rounded-xl p-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">💰 Total Investment</span>
                        <span className="text-2xl font-bold text-orange-600">
                          {selectedCountry.currency}{parseInt(results.totalInvested).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="wealth-card rounded-xl p-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">📈 Wealth Gained</span>
                        <span className="text-2xl font-bold text-green-600">
                          {selectedCountry.currency}{parseInt(results.totalGains).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">🎯 Maturity Amount</span>
                        <span className="text-3xl font-bold">
                          {selectedCountry.currency}{parseInt(results.futureValue).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={downloadPDF}
                      className="flex-1 btn-primary text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      📁 Download PDF
                    </button>
                    <button
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      📋 Add to Compare
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'breakdown' && results && yearlyBreakdown.length > 0 && (
          <div className="calculator-card rounded-2xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-6">📆 Year-wise Investment Breakdown</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full breakdown-table">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
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
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
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

      {/* Floating Help Button */}
      <button className="floating-button w-16 h-16 rounded-full text-white font-bold text-xl shadow-lg">
        💡
      </button>
    </div>
  )
}
