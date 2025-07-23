
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'
import CalculatorDropdown from '../components/CalculatorDropdown'



function TaxCalculator({ onAddToComparison, categoryColor = 'red' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  
  const defaultInputs = {
    annualIncome: '',
    country: 'india',
    taxRegime: 'old',
    deductions: '',
    pfContribution: '',
    pfFrequency: 'monthly'
  }

  // Use calculator state hook for consistent state management
  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('tax_', defaultInputs)

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

  const handleReset = () => {
    resetCalculator()
  }



  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'Tax Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Annual Income': formatCurrency(results.grossIncome),
          'Monthly Income': formatCurrency(results.monthlyIncome),
          'PF Contribution': `${formatCurrency(inputs.pfFrequency === 'monthly' ? (results.pfContribution / 12) : results.pfContribution)} (${inputs.pfFrequency})`,
          'PF Annual': formatCurrency(results.pfContribution),
          'Total Deductions': formatCurrency(results.totalDeductions),
          'Country': inputs.country === 'india' ? '🇮🇳 India' : inputs.country,
          'Tax Regime': inputs.taxRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime'
        },
        results: {
          'Tax Payable': formatCurrency(results.taxPayable),
          'Net Income': formatCurrency(results.netIncome),
          'Monthly Take Home': formatCurrency(results.monthlyNetIncome),
          'Effective Tax Rate': `${results.effectiveTaxRate}%`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareableURL = generateShareableURL('tax', inputs, results)
    const shareData = {
      title: 'finclamp.com - Tax Calculator Results',
      text: `Tax Calculation (${inputs.taxRegime === 'old' ? 'Old' : 'New'} Regime): Annual Income ${formatCurrency(results?.grossIncome)}, Monthly ${formatCurrency(results?.monthlyIncome)}, Tax ${formatCurrency(results?.taxPayable)}, Take Home ${formatCurrency(results?.netIncome)}`,
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard! Your friend can use this link to see the same calculation.')
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
    const grossIncome = parseFloat(inputs.annualIncome) || 0
    const pfInput = parseFloat(inputs.pfContribution) || 0
    const pfContribution = inputs.pfFrequency === 'monthly' ? pfInput * 12 : pfInput
    const otherDeductions = inputs.taxRegime === 'old' ? (parseFloat(inputs.deductions) || 0) : 0
    const totalDeductions = pfContribution + otherDeductions
    const taxableIncome = Math.max(0, grossIncome - totalDeductions)
    const slabs = taxSlabs[inputs.country][inputs.taxRegime]

    let totalTax = 0
    let taxBreakdown = []

    for (let slab of slabs) {
      if (taxableIncome > slab.min) {
        const taxableInThisSlab = Math.min(taxableIncome, slab.max) - slab.min
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
    const netIncome = grossIncome - pfContribution - totalTaxWithCess

    setResults({
      grossIncome: grossIncome,
      monthlyIncome: Math.round(grossIncome / 12),
      taxableIncome: taxableIncome,
      pfContribution: pfContribution,
      otherDeductions: otherDeductions,
      totalDeductions: totalDeductions,
      totalTax: Math.round(totalTax),
      cess: Math.round(cess),
      taxPayable: Math.round(totalTaxWithCess),
      netIncome: Math.round(netIncome),
      monthlyNetIncome: Math.round(netIncome / 12),
      effectiveTaxRate: grossIncome > 0 ? ((totalTaxWithCess / grossIncome) * 100).toFixed(2) : '0.00',
      taxBreakdown
    })
  }

  // Auto-calculate when inputs change
  useEffect(() => {
    if (inputs.annualIncome && inputs.country && inputs.taxRegime) {
      calculateTax()
    } else {
      setResults(null)
    }
  }, [inputs.annualIncome, inputs.country, inputs.taxRegime, inputs.deductions, inputs.pfContribution, inputs.pfFrequency])

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
            <CalculatorDropdown
              configKey="COUNTRIES"
              value={inputs.country}
              onChange={(value) => handleInputChange('country', value)}
              category="tax"
              placeholder="Select country"
            />

            {/* Tax Regime Selection */}
            <CalculatorDropdown
              configKey="TAX_REGIME"
              value={inputs.taxRegime}
              onChange={(value) => handleInputChange('taxRegime', value)}
              category="tax"
              placeholder="Select tax regime"
            />

            {/* PF Contribution - Available for both regimes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏦 PF Contribution
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.pfContribution}
                  onChange={(e) => handleInputChange('pfContribution', e.target.value)}
                  placeholder={`Enter ${inputs.pfFrequency} PF contribution`}
                  className="w-full pl-4 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  min="0"
                />
                <select
                  value={inputs.pfFrequency}
                  onChange={(e) => handleInputChange('pfFrequency', e.target.value)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            {/* Deductions - Only for Old Regime */}
            {inputs.taxRegime === 'old' && (
              <CurrencyInput
                label="Other Deductions (80C, 80D, etc.)"
                value={inputs.deductions}
                onChange={(value) => handleInputChange('deductions', value)}
                fieldName="deductions"
                icon="💰"
                placeholder="Enter other deductions"
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
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
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
                  {formatCurrency(results.taxPayable)}
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
                  {formatCurrency(results.netIncome)}
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

              {/* Monthly Income */}
              <motion.div
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📅</span>
                  <h4 className="font-semibold text-base text-gray-700">Monthly Income</h4>
                </div>
                <p className="text-2xl font-bold text-orange-600 leading-tight">
                  {formatCurrency(results.monthlyIncome)}
                </p>
              </motion.div>

              {/* Monthly Take Home */}
              <motion.div
                className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💳</span>
                  <h4 className="font-semibold text-base text-gray-700">Monthly Take Home</h4>
                </div>
                <p className="text-2xl font-bold text-teal-600 leading-tight">
                  {formatCurrency(results.monthlyNetIncome)}
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
                    <span className="font-semibold text-blue-600 text-sm">{formatCurrency(results.grossIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Monthly Income</span>
                    <span className="font-semibold text-blue-600 text-sm">{formatCurrency(results.monthlyIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">PF Contribution ({inputs.pfFrequency})</span>
                    <span className="font-semibold text-sm">
                      {formatCurrency(inputs.pfFrequency === 'monthly' ? (results.pfContribution / 12) : results.pfContribution)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">PF Contribution (Annual)</span>
                    <span className="font-semibold text-sm">{formatCurrency(results.pfContribution)}</span>
                  </div>
                  {inputs.taxRegime === 'old' && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Other Deductions</span>
                      <span className="font-semibold text-sm">{formatCurrency(results.otherDeductions)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Total Deductions</span>
                    <span className="font-semibold text-green-600 text-sm">-{formatCurrency(results.totalDeductions)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Taxable Income</span>
                    <span className="font-semibold text-purple-600 text-sm">{formatCurrency(results.taxableIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Tax Payable</span>
                    <span className="font-semibold text-red-600 text-sm">-{formatCurrency(results.taxPayable)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Tax Regime</span>
                    <span className="font-semibold text-sm">{inputs.taxRegime === 'old' ? 'Old' : 'New'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Effective Tax Rate</span>
                    <span className="font-semibold text-sm">{results.effectiveTaxRate}%</span>
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
                {results.taxBreakdown && results.taxBreakdown.length > 0 ? (
                  <div className="space-y-3">
                    {results.taxBreakdown.map((slab, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">{slab.range}</div>
                          <div className="text-xs text-gray-500">Rate: {slab.rate}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-800">
                            {formatCurrency(slab.tax)}
                          </div>
                          <div className="text-xs text-gray-500">
                            on {formatCurrency(slab.taxableAmount)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total Tax (incl. 4% cess)</span>
                        <span className="text-red-600">{formatCurrency(results.taxPayable)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📈</div>
                    <p className="text-gray-500 text-sm">No tax breakdown available</p>
                  </div>
                )}
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
