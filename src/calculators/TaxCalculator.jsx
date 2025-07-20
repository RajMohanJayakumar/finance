
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'

// Input component with floating label
const FloatingLabelInput = ({ label, value, onChange, type = "number", icon, placeholder, step, min }) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value && value.toString().length > 0

  const handleKeyDown = (e) => {
    // Prevent 'e', 'E', '+', '-' for number inputs to avoid scientific notation
    if (type === 'number') {
      if (['e', 'E', '+', '-'].includes(e.key)) {
        e.preventDefault()
      }
    }
  }

  return (
    <div className="relative">
      {/* Label positioned above the input */}
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        <span className="mr-2">{icon}</span>
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          step={step}
          min={min}
          className="w-full px-4 py-4 text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none"
          style={{
            borderColor: isFocused ? '#EF4444' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? 'rgba(239, 68, 68, 0.1) 0px 0px 0px 4px' : 'none'
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default function TaxCalculator({ onAddToComparison, categoryColor = 'red' }) {
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
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Input Section */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          variants={fadeInUp}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            💼 Income Details
          </h3>

          <div className="space-y-6">
            <CurrencyInput
              label="Annual Gross Income"
              value={inputs.annualIncome}
              onChange={(value) => handleInputChange('annualIncome', value)}
              fieldName="annualIncome"
              icon="₹"
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
                className="w-full px-4 py-4 text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
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
                className="w-full px-4 py-4 text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
                value={inputs.taxRegime}
                onChange={(e) => handleInputChange('taxRegime', e.target.value)}
              >
                <option value="old">Old Tax Regime</option>
                <option value="new">New Tax Regime</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Actions Section */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          variants={fadeInUp}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            🎯 Actions
          </h3>

          <div className="space-y-4">
            {/* Calculate Button */}
            <motion.button
              onClick={calculateTax}
              className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
              style={{ backgroundColor: '#EF4444' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🧮 Calculate Tax
            </motion.button>

            {/* Reset Button */}
            <motion.button
              onClick={handleReset}
              className="w-full py-3 px-6 rounded-xl font-semibold border-2 transition-all duration-300 hover:bg-gray-50 cursor-pointer"
              style={{
                borderColor: '#E5E7EB',
                color: '#6B7280'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Reset
            </motion.button>

            {/* Secondary Actions */}
            {results && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <motion.button
                  onClick={handleAddToComparison}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#EF4444' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#EF4444' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔗 Share
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div
            className="mt-8 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Key Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                    <span className="text-xl">💸</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Total Tax</h4>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#EF4444' }}>
                  {formatCurrency(results.totalTaxWithCess)}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                    <span className="text-xl">💰</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Net Income</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                  {formatCurrency(results.netIncome)}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <span className="text-xl">📊</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Effective Tax Rate</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                  {results.effectiveTaxRate}%
                </p>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Income Breakdown */}
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                  💼 Income Breakdown
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taxBreakdownData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {taxBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Tax Details */}
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                  📋 Tax Breakdown
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Gross Income</span>
                    <span className="font-semibold">{formatCurrency(results.grossIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Income Tax</span>
                    <span className="font-semibold text-red-600">{formatCurrency(results.totalTax)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Health & Education Cess (4%)</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(results.cess)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tax Regime</span>
                    <span className="font-semibold">
                      {inputs.taxRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* PDF Export */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PDFExport
                data={[{
                  calculator: 'Tax Calculator',
                  timestamp: new Date().toISOString(),
                  inputs: {
                    'Annual Income': `₹${inputs.annualIncome}`,
                    'Country': inputs.country === 'india' ? '🇮🇳 India' : inputs.country,
                    'Tax Regime': inputs.taxRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime'
                  },
                  results: {
                    'Total Tax': `₹${results.totalTaxWithCess?.toLocaleString()}`,
                    'Net Income': `₹${results.netIncome?.toLocaleString()}`,
                    'Effective Tax Rate': `${results.effectiveTaxRate}%`
                  }
                }]}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
