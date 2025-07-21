
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PDFExport from '../components/PDFExport'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import CurrencyInput from '../components/CurrencyInput'

const countries = {
  'india': { flag: '🇮🇳', name: 'India', currency: '₹', typical_return: 12 },
  'usa': { flag: '🇺🇸', name: 'USA', currency: '$', typical_return: 8 },
  'uk': { flag: '🇬🇧', name: 'UK', currency: '£', typical_return: 7 },
  'canada': { flag: '🇨🇦', name: 'Canada', currency: 'C$', typical_return: 7.5 }
}

export default function SWPCalculator({ onAddToComparison, categoryColor = 'purple' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

  const initialInputs = {
    initialInvestment: '',
    monthlyWithdrawal: '',
    annualReturn: '12',
    withdrawalPeriodYears: '20',
    country: 'india'
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('swp_')
  const { getShareableURL } = generateShareableURL('swp_')

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0 || (!inputs.initialInvestment && !inputs.monthlyWithdrawal)) {
      setInputs(prev => ({ ...initialInputs, ...prev }))
    }
  }, [])

  const [results, setResults] = useState(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState([])
  const [deferredPrompt, setDeferredPrompt] = useState(null)

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

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        type: 'SWP',
        name: `SWP - ${formatCurrency(inputs.initialInvestment)} Initial`,
        inputs: {
          'Initial Investment': formatCurrency(inputs.initialInvestment),
          'Monthly Withdrawal': formatCurrency(inputs.monthlyWithdrawal),
          'Withdrawal Period': `${inputs.withdrawalPeriodYears} years`,
          'Expected Annual Return': `${inputs.annualReturn}%`,
          'Country': `${selectedCountry.flag} ${selectedCountry.name}`
        },
        results: {
          'Total Withdrawn': formatCurrency(results.totalWithdrawn),
          'Remaining Balance': formatCurrency(results.remainingBalance),
          'Balance Exhausted': results.balanceExhaustedYear ? `Year ${results.balanceExhaustedYear}` : 'Never'
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
      title: 'finclamp.com - SWP Calculator Results',
      text: `SWP Calculation: Initial Investment ${formatCurrency(inputs.initialInvestment)}, Monthly Withdrawal ${formatCurrency(inputs.monthlyWithdrawal)} for ${inputs.withdrawalPeriodYears} years. Remaining Balance: ${formatCurrency(results?.remainingBalance)}`,
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard! Your friend can use this link to see the same calculation.')
    }
  }

  const selectedCountry = countries[inputs.country] || countries['india']

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
              📉 SWP Details
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
            {/* Country Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <span className="mr-2">🌍</span>
                Country
              </label>
              <select
                value={inputs.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none"
                style={{
                  borderColor: '#E5E7EB',
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'none'
                }}
              >
                {Object.entries(countries).map(([key, country]) => (
                  <option key={key} value={key}>
                    {country.flag} {country.name} (Typical: {country.typical_return}%)
                  </option>
                ))}
              </select>
            </div>

            <CurrencyInput
              label="Initial Investment"
              value={inputs.initialInvestment}
              onChange={(value) => handleInputChange('initialInvestment', value)}
              fieldName="initialInvestment"
              icon="💰"
              placeholder="Enter initial investment"
              min="0"
              focusColor="#EC4899"
            />

            <CurrencyInput
              label="Monthly Withdrawal"
              value={inputs.monthlyWithdrawal}
              onChange={(value) => handleInputChange('monthlyWithdrawal', value)}
              fieldName="monthlyWithdrawal"
              icon="📤"
              placeholder="Enter monthly withdrawal"
              min="0"
              focusColor="#EC4899"
            />

            <CurrencyInput
              label="Expected Annual Return (%)"
              value={inputs.annualReturn}
              onChange={(value) => handleInputChange('annualReturn', value)}
              fieldName="annualReturn"
              icon="📈"
              placeholder="Enter expected return"
              step="0.1"
              min="0"
              focusColor="#EC4899"
            />

            <CurrencyInput
              label="Withdrawal Period (Years)"
              value={inputs.withdrawalPeriodYears}
              onChange={(value) => handleInputChange('withdrawalPeriodYears', value)}
              fieldName="withdrawalPeriodYears"
              icon="📅"
              placeholder="Enter withdrawal period"
              min="1"
              focusColor="#EC4899"
            />

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
                  style={{ backgroundColor: '#EC4899' }}
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
                className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Total Withdrawn</h4>
                </div>
                <p className="text-2xl font-bold text-pink-600 leading-tight">
                  {formatCurrency(results.totalWithdrawn)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💼</span>
                  <h4 className="font-semibold text-base text-gray-700">Remaining Balance</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 leading-tight">
                  {formatCurrency(results.remainingBalance)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 col-span-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">⏰</span>
                  <h4 className="font-semibold text-base text-gray-700">Balance Status</h4>
                </div>
                <p className="text-lg font-bold text-orange-600 leading-tight">
                  {results.balanceExhaustedYear
                    ? `Balance exhausted in Year ${results.balanceExhaustedYear}`
                    : 'Balance lasts beyond withdrawal period'}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📉</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">SWP Calculator</h4>
              <p className="text-gray-500">Enter your investment details to see withdrawal projections</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Yearly Breakdown Table */}
      {yearlyBreakdown.length > 0 && (
        <motion.div
          className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            📈 Yearly Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Year</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Start Balance</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Withdrawn</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">End Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearlyBreakdown.map((year, index) => (
                  <motion.tr
                    key={index}
                    className={`border-b border-gray-100 ${year.endBalance === 0 ? 'bg-red-50' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="py-3 px-2 font-medium">{year.year}</td>
                    <td className="py-3 px-2 text-right">{formatCurrency(year.startBalance)}</td>
                    <td className="py-3 px-2 text-right text-red-600">{formatCurrency(year.yearWithdrawn)}</td>
                    <td className="py-3 px-2 text-right font-semibold">{formatCurrency(year.endBalance)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* PDF Export */}
      {results && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <PDFExport
            calculatorName="SWP Calculator"
            inputs={{
              'Initial Investment': formatCurrency(inputs.initialInvestment),
              'Monthly Withdrawal': formatCurrency(inputs.monthlyWithdrawal),
              'Withdrawal Period': `${inputs.withdrawalPeriodYears} years`,
              'Expected Annual Return': `${inputs.annualReturn}%`,
              'Country': `${selectedCountry.flag} ${selectedCountry.name}`
            }}
            results={{
              'Total Withdrawn': formatCurrency(results.totalWithdrawn),
              'Remaining Balance': formatCurrency(results.remainingBalance),
              'Balance Status': results.balanceExhaustedYear
                ? `Exhausted in Year ${results.balanceExhaustedYear}`
                : 'Lasts beyond withdrawal period'
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
