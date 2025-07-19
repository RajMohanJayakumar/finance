import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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
            borderColor: isFocused ? '#8B5CF6' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? 'rgba(139, 92, 246, 0.1) 0px 0px 0px 4px' : 'none'
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default function NPSCalculator({ onAddToComparison, categoryColor = 'purple' }) {
  const { addToComparison } = useComparison()

  const initialInputs = {
    monthlyContribution: '',
    currentAge: '',
    retirementAge: '60',
    expectedReturn: '10',
    annuityReturn: '6'
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

  const calculateNPS = () => {
    const monthlyContribution = parseFloat(inputs.monthlyContribution) || 0
    const currentAge = parseFloat(inputs.currentAge) || 0
    const retirementAge = parseFloat(inputs.retirementAge) || 60
    const expectedReturn = parseFloat(inputs.expectedReturn) || 10
    const annuityReturn = parseFloat(inputs.annuityReturn) || 6

    if (monthlyContribution <= 0 || currentAge <= 0 || retirementAge <= currentAge) return

    const investmentPeriod = retirementAge - currentAge
    const totalMonths = investmentPeriod * 12
    const monthlyReturn = expectedReturn / 100 / 12

    // Calculate maturity amount using SIP formula
    const maturityAmount = monthlyContribution * (((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) * (1 + monthlyReturn))
    const totalInvestment = monthlyContribution * totalMonths

    // NPS rules: 60% can be withdrawn, 40% must be used for annuity
    const lumpSumWithdrawal = maturityAmount * 0.6
    const annuityAmount = maturityAmount * 0.4

    // Calculate monthly pension from annuity
    const monthlyPension = (annuityAmount * annuityReturn / 100) / 12

    setResults({
      maturityAmount: Math.round(maturityAmount),
      totalInvestment: Math.round(totalInvestment),
      totalGains: Math.round(maturityAmount - totalInvestment),
      lumpSumWithdrawal: Math.round(lumpSumWithdrawal),
      annuityAmount: Math.round(annuityAmount),
      monthlyPension: Math.round(monthlyPension),
      investmentPeriod
    })
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'NPS Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Monthly Contribution': `₹${inputs.monthlyContribution}`,
          'Current Age': `${inputs.currentAge} years`,
          'Retirement Age': `${inputs.retirementAge} years`,
          'Expected Return': `${inputs.expectedReturn}%`
        },
        results: {
          'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
          'Lump Sum Withdrawal': `₹${results.lumpSumWithdrawal?.toLocaleString()}`,
          'Monthly Pension': `₹${results.monthlyPension?.toLocaleString()}`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'finclamp.com - NPS Calculator Results',
      text: `NPS Calculation: Monthly ₹${inputs.monthlyContribution}, Maturity ₹${results?.maturityAmount?.toLocaleString()}`,
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
  const pieChartData = results ? [
    { name: 'Lump Sum (60%)', value: results.lumpSumWithdrawal, color: '#8B5CF6' },
    { name: 'Annuity (40%)', value: results.annuityAmount, color: '#A78BFA' }
  ] : []

  useEffect(() => {
    if (inputs.monthlyContribution && inputs.currentAge && inputs.retirementAge) {
      calculateNPS()
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
            🏛️ NPS Details
          </h3>

          <div className="space-y-6">
            <FloatingLabelInput
              label="Monthly Contribution"
              value={inputs.monthlyContribution}
              onChange={(value) => handleInputChange('monthlyContribution', value)}
              icon="₹"
              placeholder="Enter monthly contribution"
              min="500"
            />

            <FloatingLabelInput
              label="Current Age"
              value={inputs.currentAge}
              onChange={(value) => handleInputChange('currentAge', value)}
              icon="👤"
              placeholder="Enter your current age"
              min="18"
              max="65"
            />

            <FloatingLabelInput
              label="Retirement Age"
              value={inputs.retirementAge}
              onChange={(value) => handleInputChange('retirementAge', value)}
              icon="🎯"
              placeholder="Enter retirement age"
              min="60"
              max="75"
            />

            <FloatingLabelInput
              label="Expected Annual Return (%)"
              value={inputs.expectedReturn}
              onChange={(value) => handleInputChange('expectedReturn', value)}
              icon="📈"
              placeholder="Expected return rate"
              step="0.1"
              min="1"
              max="15"
            />

            <FloatingLabelInput
              label="Annuity Return (%)"
              value={inputs.annuityReturn}
              onChange={(value) => handleInputChange('annuityReturn', value)}
              icon="💰"
              placeholder="Annuity return rate"
              step="0.1"
              min="1"
              max="10"
            />
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

            {results && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <motion.button
                  onClick={handleAddToComparison}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#8B5CF6' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#8B5CF6' }}
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EDE9FE' }}>
                    <span className="text-xl">💰</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Maturity Amount</h4>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#8B5CF6' }}>
                  ₹{results.maturityAmount?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <span className="text-xl">💵</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Lump Sum (60%)</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                  ₹{results.lumpSumWithdrawal?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                    <span className="text-xl">🏦</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Monthly Pension</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                  ₹{results.monthlyPension?.toLocaleString()}
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
                  💼 Withdrawal Breakdown
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
                  📋 Investment Summary
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Investment Period</span>
                    <span className="font-semibold">{results.investmentPeriod} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Investment</span>
                    <span className="font-semibold">₹{results.totalInvestment?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Gains</span>
                    <span className="font-semibold text-green-600">₹{results.totalGains?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Annuity Amount (40%)</span>
                    <span className="font-semibold text-purple-600">₹{results.annuityAmount?.toLocaleString()}</span>
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
                  calculator: 'NPS Calculator',
                  timestamp: new Date().toISOString(),
                  inputs: {
                    'Monthly Contribution': `₹${inputs.monthlyContribution}`,
                    'Current Age': `${inputs.currentAge} years`,
                    'Retirement Age': `${inputs.retirementAge} years`,
                    'Expected Return': `${inputs.expectedReturn}%`
                  },
                  results: {
                    'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
                    'Lump Sum Withdrawal': `₹${results.lumpSumWithdrawal?.toLocaleString()}`,
                    'Monthly Pension': `₹${results.monthlyPension?.toLocaleString()}`
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
