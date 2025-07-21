import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'

function NPSCalculator({ onAddToComparison, categoryColor = 'purple' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

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
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Content - Single Row Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">

        {/* Left Column - NPS Details */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>
              🏛️ NPS Details
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
              label="Monthly Contribution"
              value={inputs.monthlyContribution}
              onChange={(value) => handleInputChange('monthlyContribution', value)}
              fieldName="monthlyContribution"
              icon="💰"
              placeholder="Enter monthly contribution"
              min="500"
              focusColor="#8B5CF6"
            />

            <CurrencyInput
              label="Current Age"
              value={inputs.currentAge}
              onChange={(value) => handleInputChange('currentAge', value)}
              fieldName="currentAge"
              icon="👤"
              placeholder="Enter your current age"
              min="18"
              max="65"
              focusColor="#8B5CF6"
            />

            <CurrencyInput
              label="Retirement Age"
              value={inputs.retirementAge}
              onChange={(value) => handleInputChange('retirementAge', value)}
              fieldName="retirementAge"
              icon="🎯"
              placeholder="Enter retirement age"
              min="60"
              max="75"
              focusColor="#8B5CF6"
            />

            <CurrencyInput
              label="Expected Annual Return (%)"
              value={inputs.expectedReturn}
              onChange={(value) => handleInputChange('expectedReturn', value)}
              fieldName="expectedReturn"
              icon="📈"
              placeholder="Enter expected return"
              step="0.1"
              min="1"
              max="15"
              focusColor="#8B5CF6"
            />

            <CurrencyInput
              label="Annuity Return (%)"
              value={inputs.annuityReturn}
              onChange={(value) => handleInputChange('annuityReturn', value)}
              fieldName="annuityReturn"
              icon="💰"
              placeholder="Enter annuity return"
              step="0.1"
              min="1"
              max="10"
              focusColor="#8B5CF6"
            />

            {/* Quick Actions */}
            {results && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <motion.button
                  onClick={handleAddToComparison}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer text-sm"
                  style={{ backgroundColor: '#8B5CF6' }}
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
            � NPS Results
          </h3>

          {results ? (
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💰</span>
                  <h4 className="font-semibold text-base text-gray-700">Corpus at 60</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600 leading-tight">
                  {formatCurrency(results.corpusAt60)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🏦</span>
                  <h4 className="font-semibold text-base text-gray-700">Total Investment</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 leading-tight">
                  {formatCurrency(results.totalInvestment)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-semibold text-base text-gray-700">Monthly Pension</h4>
                </div>
                <p className="text-2xl font-bold text-green-600 leading-tight">
                  {formatCurrency(results.monthlyPension)}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💎</span>
                  <h4 className="font-semibold text-base text-gray-700">Lump Sum</h4>
                </div>
                <p className="text-2xl font-bold text-orange-600 leading-tight">
                  {formatCurrency(results.lumpSum)}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">Enter NPS details to see results</p>
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
              {/* NPS Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold mb-4 text-gray-800">
                  💼 NPS Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Monthly Contribution</span>
                    <span className="font-semibold text-purple-600 text-sm">{formatCurrency(inputs.monthlyContribution)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Years to Retirement</span>
                    <span className="font-semibold text-sm">{inputs.retirementAge - inputs.currentAge} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Expected Return</span>
                    <span className="font-semibold text-sm">{inputs.expectedReturn}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Growth Multiplier</span>
                    <span className="font-semibold text-purple-600 text-sm">
                      {(parseFloat(results.corpusAt60) / parseFloat(results.totalInvestment)).toFixed(1)}x
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
                  📊 Growth Visualization
                </h4>
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-500 text-sm">NPS growth chart</p>
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
                      calculator: 'NPS Calculator',
                      timestamp: new Date().toISOString(),
                      inputs: {
                        'Monthly Contribution': formatCurrency(inputs.monthlyContribution),
                        'Current Age': `${inputs.currentAge} years`,
                        'Retirement Age': `${inputs.retirementAge} years`,
                        'Expected Return': `${inputs.expectedReturn}% p.a.`,
                        'Annuity Return': `${inputs.annuityReturn}% p.a.`
                      },
                      results: {
                        'Corpus at 60': formatCurrency(results.corpusAt60),
                        'Total Investment': formatCurrency(results.totalInvestment),
                        'Monthly Pension': formatCurrency(results.monthlyPension),
                        'Lump Sum': formatCurrency(results.lumpSum)
                      }
                    }]}
                    title="NPS Calculator Results"
                    calculatorType="NPS"
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                    style={{ backgroundColor: '#8B5CF6' }}
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

export default NPSCalculator
