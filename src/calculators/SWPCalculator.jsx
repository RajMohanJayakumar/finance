
import React, { useState, useEffect, useCallback } from 'react'

const countries = {
  'india': { flag: '🇮🇳', name: 'India', currency: '₹', typical_return: 12 },
  'usa': { flag: '🇺🇸', name: 'USA', currency: '$', typical_return: 8 },
  'uk': { flag: '🇬🇧', name: 'UK', currency: '£', typical_return: 7 },
  'canada': { flag: '🇨🇦', name: 'Canada', currency: 'C$', typical_return: 7.5 }
}

export default function SWPCalculator({ onAddToComparison, categoryColor = 'purple' }) {

  const initialInputs = {
    initialInvestment: '',
    monthlyWithdrawal: '',
    annualReturn: '12',
    withdrawalPeriodYears: '20',
    country: 'india'
  }

  const [inputs, setInputs] = useState(initialInputs)

  const [results, setResults] = useState(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState([])
  const [collapsedSections, setCollapsedSections] = useState({
    inputs: false,
    results: false,
    breakdown: true
  })

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }

    if (field === 'country') {
      newInputs.annualReturn = countries[value].typical_return.toString()
    }

    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
    setYearlyBreakdown([])
  }

  const calculateSWP = useCallback(() => {
    const principal = parseFloat(inputs.initialInvestment) || 0
    const monthlyWithdrawal = parseFloat(inputs.monthlyWithdrawal) || 0
    const annualReturn = (parseFloat(inputs.annualReturn) || 0) / 100
    const monthlyReturn = annualReturn / 12
    const totalMonths = (parseFloat(inputs.withdrawalPeriodYears) || 0) * 12

    if (principal === 0 || monthlyWithdrawal === 0 || totalMonths === 0) return

    let remainingBalance = principal
    let totalWithdrawn = 0
    let breakdown = []

    for (let year = 1; year <= Math.ceil(totalMonths / 12); year++) {
      const startBalance = remainingBalance
      let yearWithdrawn = 0
      
      for (let month = 1; month <= 12 && ((year - 1) * 12 + month) <= totalMonths; month++) {
        // Apply monthly return
        remainingBalance = remainingBalance * (1 + monthlyReturn)
        
        // Withdraw monthly amount
        if (remainingBalance >= monthlyWithdrawal) {
          remainingBalance -= monthlyWithdrawal
          yearWithdrawn += monthlyWithdrawal
          totalWithdrawn += monthlyWithdrawal
        } else {
          // Partial withdrawal if balance is less than monthly withdrawal
          yearWithdrawn += remainingBalance
          totalWithdrawn += remainingBalance
          remainingBalance = 0
          break
        }
      }

      breakdown.push({
        year,
        startBalance: startBalance,
        yearWithdrawn: yearWithdrawn,
        endBalance: remainingBalance,
        totalWithdrawn: totalWithdrawn
      })

      if (remainingBalance === 0) break
    }

    const balanceExhaustedYear = breakdown.find(year => year.endBalance === 0)?.year || null

    setResults({
      totalWithdrawn: totalWithdrawn.toFixed(0),
      remainingBalance: remainingBalance.toFixed(0),
      balanceExhaustedYear: balanceExhaustedYear,
      monthlyWithdrawal: monthlyWithdrawal.toFixed(0)
    })

    setYearlyBreakdown(breakdown)
  }, [inputs])

  useEffect(() => {
    if (inputs.initialInvestment && inputs.monthlyWithdrawal && inputs.annualReturn && inputs.withdrawalPeriodYears) {
      calculateSWP()
    }
  }, [calculateSWP])

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const selectedCountry = countries[inputs.country]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            📉 SWP Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plan your systematic withdrawal strategy and see how long your investment will last
          </p>
        </div>

        <div className="space-y-6">
          {/* Calculator Inputs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <button
              onClick={() => toggleSection('inputs')}
              className="w-full p-6 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold text-left flex justify-between items-center"
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
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 bg-white text-lg transition-all"
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
                      💰 Initial Investment ({selectedCountry.currency})
                    </label>
                    <input
                      type="number"
                      value={inputs.initialInvestment}
                      onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-lg transition-all"
                      placeholder="e.g., 1000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      📤 Monthly Withdrawal ({selectedCountry.currency})
                    </label>
                    <input
                      type="number"
                      value={inputs.monthlyWithdrawal}
                      onChange={(e) => handleInputChange('monthlyWithdrawal', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-lg transition-all"
                      placeholder="e.g., 10000"
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
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-lg transition-all"
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      📅 Withdrawal Period (Years)
                    </label>
                    <input
                      type="number"
                      value={inputs.withdrawalPeriodYears}
                      onChange={(e) => handleInputChange('withdrawalPeriodYears', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-lg transition-all"
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleReset}
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:from-gray-600 hover:to-gray-700"
                  >
                    🔄 Reset
                  </button>
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
                <span className="text-xl">📊 Withdrawal Results</span>
                <span className="text-2xl">{collapsedSections.results ? '▼' : '▲'}</span>
              </button>
              {!collapsedSections.results && (
                <div className="p-6">
                  <div className="grid gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-6 border-l-4 border-blue-500">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">💰 Total Withdrawn</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {selectedCountry.currency}{parseInt(results.totalWithdrawn).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border-l-4 border-green-500">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">💼 Remaining Balance</span>
                        <span className="text-2xl font-bold text-green-600">
                          {selectedCountry.currency}{parseInt(results.remainingBalance).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {results.balanceExhaustedYear && (
                      <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-6 border-l-4 border-red-500">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">⚠️ Balance Exhausted</span>
                          <span className="text-2xl font-bold text-red-600">
                            Year {results.balanceExhaustedYear}
                          </span>
                        </div>
                      </div>
                    )}
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
                          <th className="p-4 text-left">Start Balance</th>
                          <th className="p-4 text-left">Year Withdrawn</th>
                          <th className="p-4 text-left">End Balance</th>
                          <th className="p-4 text-left">Total Withdrawn</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {yearlyBreakdown.map((year, index) => (
                          <tr key={index} className="border-b hover:bg-purple-50 transition-colors">
                            <td className="p-4 font-semibold">{year.year}</td>
                            <td className="p-4">{selectedCountry.currency}{year.startBalance?.toLocaleString()}</td>
                            <td className="p-4">{selectedCountry.currency}{year.yearWithdrawn?.toLocaleString()}</td>
                            <td className="p-4 font-semibold text-blue-600">{selectedCountry.currency}{year.endBalance?.toLocaleString()}</td>
                            <td className="p-4 font-semibold text-green-600">{selectedCountry.currency}{year.totalWithdrawn?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
