
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'



function TaxCalculator({ onAddToComparison, categoryColor = 'red' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  
  const initialInputs = {
    annualIncome: '',
    country: 'india',
    taxRegime: 'old'
  }

  const [inputs, setInputs] = useState(initialInputs)
  
  const [results, setResults] = useState(null)

  const taxSlabs = {
    india: {
      old: [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: Infinity, rate: 30 }
      ],
      new: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 600000, rate: 5 },
        { min: 600000, max: 900000, rate: 10 },
        { min: 900000, max: 1200000, rate: 15 },
        { min: 1200000, max: 1500000, rate: 20 },
        { min: 1500000, max: Infinity, rate: 30 }
      ]
    }
  }

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'Tax Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Annual Income': `₹${inputs.annualIncome}`,
          'Country': inputs.country === 'india' ? '🇮🇳 India' : inputs.country,
          'Tax Regime': inputs.taxRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime'
        },
        results: {
          'Tax Payable': `₹${results.taxPayable?.toLocaleString()}`,
          'Net Income': `₹${results.netIncome?.toLocaleString()}`,
          'Effective Tax Rate': `${results.effectiveTaxRate?.toFixed(2)}%`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - Tax Calculator Results',
      text: `Tax Calculation: Income ₹${inputs.annualIncome}, Tax ₹${results?.taxPayable?.toLocaleString()}`,
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

  const calculateTax = () => {
    const income = parseFloat(inputs.annualIncome) || 0
    const slabs = taxSlabs[inputs.country][inputs.taxRegime]
    
    let totalTax = 0
    let taxBreakdown = []

    for (let slab of slabs) {
      if (income > slab.min) {
        const taxableInThisSlab = Math.min(income, slab.max) - slab.min
        const taxInThisSlab = (taxableInThisSlab * slab.rate) / 100
        totalTax += taxInThisSlab

        if (taxableInThisSlab > 0) {
          taxBreakdown.push({
            range: `₹${slab.min.toLocaleString()} - ${slab.max === Infinity ? '∞' : '₹' + slab.max.toLocaleString()}`,
            rate: slab.rate,
            taxableAmount: taxableInThisSlab,
            tax: taxInThisSlab
          })
        }
      }
    }

    // Add cess (4% on total tax for India)
    const cess = totalTax * 0.04
    const totalTaxWithCess = totalTax + cess
    const netIncome = income - totalTaxWithCess

    setResults({
      grossIncome: income,
      totalTax: Math.round(totalTax),
      cess: Math.round(cess),
      totalTaxWithCess: Math.round(totalTaxWithCess),
      netIncome: Math.round(netIncome),
      effectiveTaxRate: ((totalTaxWithCess / income) * 100).toFixed(2),
      taxBreakdown
    })
  }

  // Chart data for visualization
  const taxBreakdownData = results ? [
    { name: 'Net Income', value: results.netIncome, color: '#10B981' },
    { name: 'Tax Payable', value: results.taxPayable, color: '#EF4444' }
  ] : []

  const taxSlabData = results && results.taxBreakdown ?
    results.taxBreakdown.map((slab, index) => ({
      slab: `${slab.min === 0 ? '0' : (slab.min/100000).toFixed(0)}L - ${slab.max === Infinity ? '∞' : (slab.max/100000).toFixed(0)}L`,
      rate: slab.rate,
      tax: slab.tax || 0
    })) : []

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Content - Single Row Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">

        {/* Left Column - Income Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              💼 Income Details
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
              label="Annual Gross Income"
              value={inputs.annualIncome}
              onChange={(value) => handleInputChange('annualIncome', value)}
              fieldName="annualIncome"
              icon="💰"
              placeholder="Enter your annual income"
              min="0"
              focusColor="#EF4444"
            />

            {/* Country Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <span className="mr-2">🌍</span>
                Country
              </label>
              <select
                className="w-full px-3 py-3 text-base font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
                value={inputs.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              >
                <option value="india">🇮🇳 India</option>
              </select>
            </div>

            {/* Tax Regime Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <span className="mr-2">⚖️</span>
                Tax Regime (India)
              </label>
              <select
                className="w-full px-3 py-3 text-base font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
                value={inputs.taxRegime}
                onChange={(e) => handleInputChange('taxRegime', e.target.value)}
              >
                <option value="old">Old Tax Regime</option>
                <option value="new">New Tax Regime</option>
              </select>
            </div>

            {/* Deductions - Only for Old Regime */}
            {inputs.taxRegime === 'old' && (
              <CurrencyInput
                label="Total Deductions (80C, 80D, etc.)"
                value={inputs.deductions}
                onChange={(value) => handleInputChange('deductions', value)}
                fieldName="deductions"
                icon="💰"
                placeholder="Enter total deductions"
                min="0"
                focusColor="#EF4444"
              />
            )}

            {/* Quick Actions */}
            {results && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <motion.button
                  onClick={handleAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#EF4444' }}
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
            📊 Tax Results
          </h3>

          {results ? (
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💸</span>
                  <h4 className="font-semibold text-base text-gray-700">Total Tax</h4>
                </div>
                <p className="text-2xl font-bold text-red-600 leading-tight">
                  {formatCurrency(results.totalTax)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Take Home</h4>
                </div>
                <p className="text-2xl font-bold text-green-600 leading-tight">
                  {formatCurrency(results.takeHome)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-semibold text-base text-gray-700">Tax Rate</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 leading-tight">
                  {results.effectiveTaxRate}%
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🏦</span>
                  <h4 className="font-semibold text-base text-gray-700">Taxable Income</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600 leading-tight">
                  {formatCurrency(results.taxableIncome)}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">Enter income details to see tax calculation</p>
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
              {/* Tax Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 Tax Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Gross Income</span>
                    <span className="font-semibold text-blue-600 text-sm">{formatCurrency(inputs.annualIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Tax Regime</span>
                    <span className="font-semibold text-sm">{inputs.taxRegime === 'old' ? 'Old' : 'New'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Effective Tax Rate</span>
                    <span className="font-semibold text-sm">{results.effectiveTaxRate}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Tax Savings</span>
                    <span className="font-semibold text-green-600 text-sm">
                      {inputs.taxRegime === 'old' ? formatCurrency(inputs.deductions || 0) : 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Tax Breakdown Chart */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  📊 Tax Breakdown
                </h4>
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-500 text-sm">Tax slab visualization</p>
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
                      calculator: 'Tax Calculator',
                      timestamp: new Date().toISOString(),
                      inputs: {
                        'Annual Income': formatCurrency(inputs.annualIncome),
                        'Tax Regime': inputs.taxRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime',
                        'Deductions': inputs.taxRegime === 'old' ? formatCurrency(inputs.deductions || 0) : 'N/A',
                        'Country': '🇮🇳 India'
                      },
                      results: {
                        'Total Tax': formatCurrency(results.totalTax),
                        'Take Home': formatCurrency(results.takeHome),
                        'Taxable Income': formatCurrency(results.taxableIncome),
                        'Effective Tax Rate': `${results.effectiveTaxRate}%`
                      }
                    }]}
                    title="Tax Calculator Results"
                    calculatorType="Tax"
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
                      💡 Tax calculations are approximate and for reference only
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

export default TaxCalculator
