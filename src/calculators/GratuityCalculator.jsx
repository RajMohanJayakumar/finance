import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import PDFExport from '../components/PDFExport'

// Input component with floating label
const FloatingLabelInput = ({ label, value, onChange, type = "number", icon, placeholder, step, min }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
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
          step={step}
          min={min}
          className="w-full px-4 py-4 text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none"
          style={{
            borderColor: isFocused ? '#DC2626' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? 'rgba(220, 38, 38, 0.1) 0px 0px 0px 4px' : 'none'
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default function GratuityCalculator({ onAddToComparison, categoryColor = 'red' }) {
  const { addToComparison } = useComparison()

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
            🎁 Gratuity Details
          </h3>

          <div className="space-y-6">
            <FloatingLabelInput
              label="Last Drawn Salary (Monthly)"
              value={inputs.lastDrawnSalary}
              onChange={(value) => handleInputChange('lastDrawnSalary', value)}
              icon="₹"
              placeholder="Enter last drawn salary"
              min="0"
            />

            <div className="grid grid-cols-2 gap-4">
              <FloatingLabelInput
                label="Years of Service"
                value={inputs.yearsOfService}
                onChange={(value) => handleInputChange('yearsOfService', value)}
                icon="📅"
                placeholder="Years"
                min="0"
                max="50"
              />

              <FloatingLabelInput
                label="Additional Months"
                value={inputs.monthsOfService}
                onChange={(value) => handleInputChange('monthsOfService', value)}
                icon="📆"
                placeholder="Months"
                min="0"
                max="11"
              />
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <span className="mr-2">🏢</span>
                Organization Type
              </label>
              <select
                value={inputs.organizationType}
                onChange={(e) => handleInputChange('organizationType', e.target.value)}
                className="w-full px-4 py-4 text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
              >
                <option value="covered">Covered under Gratuity Act</option>
                <option value="non-covered">Not covered under Gratuity Act</option>
              </select>
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Gratuity Rules:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Minimum 5 years of service required</li>
                <li>• 15 days salary for each year of service</li>
                <li>• Maximum limit: ₹20 lakhs (covered organizations)</li>
                <li>• Tax-free up to ₹20 lakhs (covered) / ₹10 lakhs (non-covered)</li>
              </ul>
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

            {results && results.isEligible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <motion.button
                  onClick={handleAddToComparison}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#DC2626' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#DC2626' }}
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
            {!results.isEligible ? (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Not Eligible for Gratuity</h3>
                <p className="text-red-600">{results.reason}</p>
                <p className="text-sm text-red-500 mt-2">
                  Current service period: {results.totalServiceYears} years
                </p>
              </motion.div>
            ) : (
              <>
                {/* Key Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                        <span className="text-xl">🎁</span>
                      </div>
                      <h4 className="font-semibold" style={{ color: '#6B7280' }}>Gratuity Amount</h4>
                    </div>
                    <p className="text-3xl font-bold" style={{ color: '#DC2626' }}>
                      ₹{results.gratuityAmount?.toLocaleString()}
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                        <span className="text-xl">💚</span>
                      </div>
                      <h4 className="font-semibold" style={{ color: '#6B7280' }}>Tax Free Amount</h4>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                      ₹{results.taxFreeAmount?.toLocaleString()}
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                        <span className="text-xl">💸</span>
                      </div>
                      <h4 className="font-semibold" style={{ color: '#6B7280' }}>Taxable Amount</h4>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                      ₹{results.taxableAmount?.toLocaleString()}
                    </p>
                  </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                      💼 Tax Breakdown
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                        <Bar dataKey="amount" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                      📋 Calculation Summary
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Service Period</span>
                        <span className="font-semibold">{results.totalServiceYears} years</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Organization Type</span>
                        <span className="font-semibold">
                          {results.organizationType === 'covered' ? 'Covered' : 'Non-covered'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Formula Used</span>
                        <span className="font-semibold text-sm">
                          {results.organizationType === 'covered' ? '(Salary × 15 × Years) / 26' : '(Salary × 15 × Years) / 30'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Tax Status</span>
                        <span className="font-semibold text-green-600">
                          {results.taxableAmount > 0 ? 'Partially Taxable' : 'Tax Free'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <PDFExport
                    data={[{
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
                    }]}
                  />
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
