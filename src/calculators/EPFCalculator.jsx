import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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
            borderColor: isFocused ? '#059669' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            boxShadow: isFocused ? 'rgba(5, 150, 105, 0.1) 0px 0px 0px 4px' : 'none'
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default function EPFCalculator({ onAddToComparison, categoryColor = 'green' }) {
  const { addToComparison } = useComparison()

  const initialInputs = {
    basicSalary: '',
    currentAge: '',
    retirementAge: '58',
    employeeContribution: '12',
    employerContribution: '12',
    salaryIncrement: '5',
    interestRate: '8.5'
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

  const calculateEPF = () => {
    const basicSalary = parseFloat(inputs.basicSalary) || 0
    const currentAge = parseFloat(inputs.currentAge) || 0
    const retirementAge = parseFloat(inputs.retirementAge) || 58
    const employeeContribution = parseFloat(inputs.employeeContribution) || 12
    const employerContribution = parseFloat(inputs.employerContribution) || 12
    const salaryIncrement = parseFloat(inputs.salaryIncrement) || 5
    const interestRate = parseFloat(inputs.interestRate) || 8.5

    if (basicSalary <= 0 || currentAge <= 0 || retirementAge <= currentAge) return

    const yearsToRetirement = retirementAge - currentAge
    let totalEmployeeContribution = 0
    let totalEmployerContribution = 0
    let currentSalary = basicSalary

    // Calculate year-wise contributions with salary increment
    for (let year = 0; year < yearsToRetirement; year++) {
      const yearlyEmployeeContribution = (currentSalary * 12 * employeeContribution) / 100
      const yearlyEmployerContribution = (currentSalary * 12 * employerContribution) / 100
      
      totalEmployeeContribution += yearlyEmployeeContribution
      totalEmployerContribution += yearlyEmployerContribution
      
      // Apply salary increment for next year
      currentSalary = currentSalary * (1 + salaryIncrement / 100)
    }

    const totalContribution = totalEmployeeContribution + totalEmployerContribution
    
    // Calculate maturity amount with compound interest
    const monthlyInterestRate = interestRate / 100 / 12
    const totalMonths = yearsToRetirement * 12
    
    // Using compound interest formula for EPF
    const maturityAmount = totalContribution * Math.pow(1 + interestRate / 100, yearsToRetirement)
    const totalInterest = maturityAmount - totalContribution

    setResults({
      maturityAmount: Math.round(maturityAmount),
      totalEmployeeContribution: Math.round(totalEmployeeContribution),
      totalEmployerContribution: Math.round(totalEmployerContribution),
      totalContribution: Math.round(totalContribution),
      totalInterest: Math.round(totalInterest),
      yearsToRetirement
    })
  }

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        id: Date.now(),
        calculator: 'EPF Calculator',
        timestamp: new Date().toISOString(),
        inputs: {
          'Basic Salary': `₹${inputs.basicSalary}`,
          'Current Age': `${inputs.currentAge} years`,
          'Retirement Age': `${inputs.retirementAge} years`,
          'Employee Contribution': `${inputs.employeeContribution}%`
        },
        results: {
          'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
          'Total Contribution': `₹${results.totalContribution?.toLocaleString()}`,
          'Total Interest': `₹${results.totalInterest?.toLocaleString()}`
        }
      }
      addToComparison(comparisonData)
    }
  }

  const shareCalculation = () => {
    const shareData = {
      title: 'EPF Calculator Results',
      text: `EPF Calculation: Salary ₹${inputs.basicSalary}, Maturity ₹${results?.maturityAmount?.toLocaleString()}`,
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
    { name: 'Employee Contribution', value: results.totalEmployeeContribution, color: '#059669' },
    { name: 'Employer Contribution', value: results.totalEmployerContribution, color: '#34D399' },
    { name: 'Interest Earned', value: results.totalInterest, color: '#6EE7B7' }
  ] : []

  useEffect(() => {
    if (inputs.basicSalary && inputs.currentAge && inputs.retirementAge) {
      calculateEPF()
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
            🏢 EPF Details
          </h3>

          <div className="space-y-6">
            <FloatingLabelInput
              label="Basic Salary (Monthly)"
              value={inputs.basicSalary}
              onChange={(value) => handleInputChange('basicSalary', value)}
              icon="₹"
              placeholder="Enter basic salary"
              min="0"
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
              min="50"
              max="65"
            />

            <div className="grid grid-cols-2 gap-4">
              <FloatingLabelInput
                label="Employee Contribution (%)"
                value={inputs.employeeContribution}
                onChange={(value) => handleInputChange('employeeContribution', value)}
                icon="👨‍💼"
                placeholder="12%"
                step="0.1"
                min="0"
                max="12"
              />

              <FloatingLabelInput
                label="Employer Contribution (%)"
                value={inputs.employerContribution}
                onChange={(value) => handleInputChange('employerContribution', value)}
                icon="🏢"
                placeholder="12%"
                step="0.1"
                min="0"
                max="12"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FloatingLabelInput
                label="Annual Salary Increment (%)"
                value={inputs.salaryIncrement}
                onChange={(value) => handleInputChange('salaryIncrement', value)}
                icon="📈"
                placeholder="5%"
                step="0.1"
                min="0"
                max="20"
              />

              <FloatingLabelInput
                label="Interest Rate (%)"
                value={inputs.interestRate}
                onChange={(value) => handleInputChange('interestRate', value)}
                icon="💹"
                placeholder="8.5%"
                step="0.1"
                min="1"
                max="15"
              />
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

            {results && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <motion.button
                  onClick={handleAddToComparison}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#059669' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📊 Compare
                </motion.button>

                <motion.button
                  onClick={shareCalculation}
                  className="py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: '#059669' }}
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                    <span className="text-xl">💰</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Maturity Amount</h4>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#059669' }}>
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
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Total Contribution</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                  ₹{results.totalContribution?.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                    <span className="text-xl">📈</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: '#6B7280' }}>Interest Earned</h4>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                  ₹{results.totalInterest?.toLocaleString()}
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
                  💼 Contribution Breakdown
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
                    <span className="text-gray-600">Service Period</span>
                    <span className="font-semibold">{results.yearsToRetirement} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Employee Contribution</span>
                    <span className="font-semibold">₹{results.totalEmployeeContribution?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Employer Contribution</span>
                    <span className="font-semibold">₹{results.totalEmployerContribution?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Return</span>
                    <span className="font-semibold text-green-600">
                      {((results.totalInterest / results.totalContribution) * 100).toFixed(2)}%
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
                  calculator: 'EPF Calculator',
                  timestamp: new Date().toISOString(),
                  inputs: {
                    'Basic Salary': `₹${inputs.basicSalary}`,
                    'Current Age': `${inputs.currentAge} years`,
                    'Retirement Age': `${inputs.retirementAge} years`,
                    'Employee Contribution': `${inputs.employeeContribution}%`
                  },
                  results: {
                    'Maturity Amount': `₹${results.maturityAmount?.toLocaleString()}`,
                    'Total Contribution': `₹${results.totalContribution?.toLocaleString()}`,
                    'Total Interest': `₹${results.totalInterest?.toLocaleString()}`
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
