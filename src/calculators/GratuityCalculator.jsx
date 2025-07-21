import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'

function GratuityCalculator({ onAddToComparison, categoryColor = 'red' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

  const initialInputs = {
    lastDrawnSalary: '',
    yearsOfService: '',
    monthsOfService: '',
    organizationType: 'covered' // covered or non-covered under Gratuity Act
  }

  const [inputs, setInputs] = useState(initialInputs)
  const [results, setResults] = useState(null)

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
  }

  const calculateGratuity = () => {
    const lastDrawnSalary = parseFloat(inputs.lastDrawnSalary) || 0
    const yearsOfService = parseFloat(inputs.yearsOfService) || 0
    const monthsOfService = parseFloat(inputs.monthsOfService) || 0
    const organizationType = inputs.organizationType

    if (lastDrawnSalary <= 0 || (yearsOfService === 0 && monthsOfService === 0)) return

    // Convert total service to years (including months)
    const totalServiceYears = yearsOfService + (monthsOfService / 12)

    // Minimum service period check
    if (totalServiceYears < 5) {
      setResults({
        gratuityAmount: 0,
        totalServiceYears: totalServiceYears.toFixed(2),
        isEligible: false,
        reason: 'Minimum 5 years of service required for gratuity eligibility'
      })
      return
    }

    let gratuityAmount = 0

    if (organizationType === 'covered') {
      // For organizations covered under Gratuity Act
      // Formula: (Last drawn salary × 15 × Years of service) / 26
      // 15 days salary for each year of service
      gratuityAmount = (lastDrawnSalary * 15 * Math.floor(totalServiceYears)) / 26
      
      // Maximum limit as per Gratuity Act (₹20 lakhs as of 2018)
      const maxGratuity = 2000000 // ₹20 lakhs
      if (gratuityAmount > maxGratuity) {
        gratuityAmount = maxGratuity
      }
    } else {
      // For organizations not covered under Gratuity Act
      // Formula: (Last drawn salary × 15 × Years of service) / 30
      gratuityAmount = (lastDrawnSalary * 15 * Math.floor(totalServiceYears)) / 30
    }

    // Calculate tax implications (gratuity is tax-free up to certain limits)
    const taxFreeLimit = organizationType === 'covered' ? 2000000 : 1000000
    const taxableAmount = Math.max(0, gratuityAmount - taxFreeLimit)

    setResults({
      gratuityAmount: Math.round(gratuityAmount),
      totalServiceYears: totalServiceYears.toFixed(2),
      isEligible: true,
      taxFreeAmount: Math.min(gratuityAmount, taxFreeLimit),
      taxableAmount: Math.round(taxableAmount),
      organizationType
    })
  }

  const handleAddToComparison = () => {
    if (results && results.isEligible) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'Gratuity Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Last Drawn Salary': `₹${inputs.lastDrawnSalary}`,
          'Years of Service': `${inputs.yearsOfService} years ${inputs.monthsOfService} months`,
          'Organization Type': inputs.organizationType === 'covered' ? 'Covered under Gratuity Act' : 'Not covered under Gratuity Act'
        },
        results: {
          'Gratuity Amount': `₹${results.gratuityAmount?.toLocaleString()}`,
          'Tax Free Amount': `₹${results.taxFreeAmount?.toLocaleString()}`,
          'Taxable Amount': `₹${results.taxableAmount?.toLocaleString()}`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - Gratuity Calculator Results',
      text: `Gratuity Calculation: Salary ₹${inputs.lastDrawnSalary}, Gratuity ₹${results?.gratuityAmount?.toLocaleString()}`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Calculation link copied to clipboard!')
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

  // Chart data
  const chartData = results && results.isEligible ? [
    { name: 'Tax Free Amount', amount: results.taxFreeAmount, color: '#10B981' },
    { name: 'Taxable Amount', amount: results.taxableAmount, color: '#EF4444' }
  ] : []

  useEffect(() => {
    if (inputs.lastDrawnSalary && (inputs.yearsOfService || inputs.monthsOfService)) {
      calculateGratuity()
    }
  }, [inputs])

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Content - Single Row Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">

        {/* Left Column - Gratuity Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              🎁 Gratuity Details
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
              label="Last Drawn Salary (Monthly)"
              value={inputs.lastDrawnSalary}
              onChange={(value) => handleInputChange('lastDrawnSalary', value)}
              fieldName="lastDrawnSalary"
              icon="💰"
              placeholder="Enter last drawn salary"
              min="0"
              focusColor="#DC2626"
            />

            <CurrencyInput
              label="Years of Service"
              value={inputs.yearsOfService}
              onChange={(value) => handleInputChange('yearsOfService', value)}
              fieldName="yearsOfService"
              icon="📅"
              placeholder="Enter years of service"
              min="0"
              max="50"
              focusColor="#DC2626"
            />

            <CurrencyInput
              label="Additional Months"
              value={inputs.monthsOfService}
              onChange={(value) => handleInputChange('monthsOfService', value)}
              fieldName="monthsOfService"
              icon="📆"
              placeholder="Enter additional months"
              min="0"
              max="11"
              focusColor="#DC2626"
            />

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <span className="mr-2">🏢</span>
                Organization Type
              </label>
              <select
                value={inputs.organizationType}
                onChange={(e) => handleInputChange('organizationType', e.target.value)}
                className="w-full px-3 py-3 text-base font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
              >
                <option value="covered">Covered under Gratuity Act</option>
                <option value="non-covered">Not covered under Gratuity Act</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Gratuity Eligibility:</strong> Minimum 5 years of continuous service required
              </p>
            </div>

            {/* Quick Actions */}
            {results && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <motion.button
                  onClick={handleAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#DC2626' }}
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
            📊 Gratuity Results
          </h3>

          {results ? (
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Gratuity Amount</h4>
                </div>
                <p className="text-2xl font-bold text-red-600 leading-tight">
                  {formatCurrency(results.gratuityAmount)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">✅</span>
                  <h4 className="font-semibold text-base text-gray-700">Eligibility</h4>
                </div>
                <p className="text-2xl font-bold text-green-600 leading-tight">
                  {results.isEligible ? 'Eligible' : 'Not Eligible'}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📅</span>
                  <h4 className="font-semibold text-base text-gray-700">Service Period</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 leading-tight">
                  {inputs.yearsOfService} Years {inputs.monthsOfService} Months
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💼</span>
                  <h4 className="font-semibold text-base text-gray-700">Last Salary</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600 leading-tight">
                  {formatCurrency(inputs.lastDrawnSalary)}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">Enter gratuity details to see results</p>
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
              {/* Gratuity Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 Gratuity Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Last Salary</span>
                    <span className="font-semibold text-red-600 text-sm">{formatCurrency(inputs.lastDrawnSalary)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Service Period</span>
                    <span className="font-semibold text-sm">{inputs.yearsOfService} years {inputs.monthsOfService} months</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Organization Type</span>
                    <span className="font-semibold text-sm">{inputs.organizationType === 'covered' ? 'Covered' : 'Not Covered'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Eligibility</span>
                    <span className={`font-semibold text-sm ${results.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                      {results.isEligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Chart Placeholder */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  📊 Calculation Breakdown
                </h4>
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-500 text-sm">Gratuity calculation details</p>
                </div>
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
                      calculator: 'Gratuity Calculator',
                      timestamp: new Date().toISOString(),
                      inputs: {
                        'Last Drawn Salary': formatCurrency(inputs.lastDrawnSalary),
                        'Years of Service': `${inputs.yearsOfService} years`,
                        'Additional Months': `${inputs.monthsOfService} months`,
                        'Organization Type': inputs.organizationType === 'covered' ? 'Covered under Gratuity Act' : 'Not covered under Gratuity Act'
                      },
                      results: {
                        'Gratuity Amount': formatCurrency(results.gratuityAmount),
                        'Eligibility': results.isEligible ? 'Eligible' : 'Not Eligible',
                        'Service Period': `${inputs.yearsOfService} years ${inputs.monthsOfService} months`
                      }
                    }]}
                    title="Gratuity Calculator Results"
                    calculatorType="Gratuity"
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                    style={{ backgroundColor: '#DC2626' }}
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

export default GratuityCalculator
