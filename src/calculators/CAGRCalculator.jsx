import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PDFExport from '../components/PDFExport'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useURLStateObject, generateShareableURL } from '../hooks/useURLState'
import CurrencyInput from '../components/CurrencyInput'
import CalculatorDropdown from '../components/CalculatorDropdown'

export default function CAGRCalculator({ onAddToComparison, categoryColor = 'purple' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

  const initialInputs = {
    beginningValue: '',
    endingValue: '',
    numberOfYears: '',
    calculationType: 'cagr'
  }

  // Use URL state management for inputs
  const [inputs, setInputs] = useURLStateObject('cagr_')
  const { getShareableURL } = generateShareableURL('cagr_')

  // Initialize inputs with defaults if empty
  useEffect(() => {
    if (Object.keys(inputs).length === 0 || (!inputs.beginningValue && !inputs.endingValue)) {
      setInputs(prev => ({ ...initialInputs, ...prev }))
    }
  }, [])

  const [results, setResults] = useState(null)

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
  }

  const calculate = useCallback(() => {
    const beginningValue = parseFloat(inputs.beginningValue) || 0
    const endingValue = parseFloat(inputs.endingValue) || 0
    const numberOfYears = parseFloat(inputs.numberOfYears) || 0

    if (beginningValue === 0 || endingValue === 0 || numberOfYears === 0) return

    if (inputs.calculationType === 'cagr') {
      // CAGR = (Ending Value / Beginning Value)^(1/n) – 1
      const cagr = Math.pow(endingValue / beginningValue, 1 / numberOfYears) - 1
      const totalReturns = endingValue - beginningValue
      const totalReturnPercentage = ((endingValue - beginningValue) / beginningValue) * 100

      setResults({
        cagr: (cagr * 100).toFixed(2),
        totalReturns: Math.round(totalReturns),
        totalReturnPercentage: totalReturnPercentage.toFixed(2),
        beginningValue,
        endingValue,
        numberOfYears
      })
    } else if (inputs.calculationType === 'roi') {
      // ROI = (Net Profit / Cost of Investment) × 100
      const roi = ((endingValue - beginningValue) / beginningValue) * 100
      const netProfit = endingValue - beginningValue

      setResults({
        roi: roi.toFixed(2),
        netProfit: Math.round(netProfit),
        investment: beginningValue,
        finalValue: endingValue
      })
    }
  }, [inputs])

  // Auto-calculate when inputs change
  useEffect(() => {
    if (inputs.beginningValue && inputs.endingValue && inputs.numberOfYears) {
      calculate()
    }
  }, [calculate])

  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        type: inputs.calculationType === 'cagr' ? 'CAGR' : 'ROI',
        name: `${inputs.calculationType.toUpperCase()} - ${formatCurrency(inputs.beginningValue)} to ${formatCurrency(inputs.endingValue)}`,
        inputs: {
          'Beginning Value': formatCurrency(inputs.beginningValue),
          'Ending Value': formatCurrency(inputs.endingValue),
          'Number of Years': `${inputs.numberOfYears} years`,
          'Calculation Type': inputs.calculationType.toUpperCase()
        },
        results: inputs.calculationType === 'cagr' ? {
          'CAGR': `${results.cagr}%`,
          'Total Returns': formatCurrency(results.totalReturns),
          'Total Return %': `${results.totalReturnPercentage}%`
        } : {
          'ROI': `${results.roi}%`,
          'Net Profit': formatCurrency(results.netProfit),
          'Final Value': formatCurrency(results.finalValue)
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
      title: `finclamp.com - ${inputs.calculationType.toUpperCase()} Calculator Results`,
      text: `${inputs.calculationType.toUpperCase()} Calculation: ${formatCurrency(inputs.beginningValue)} to ${formatCurrency(inputs.endingValue)} over ${inputs.numberOfYears} years. ${inputs.calculationType === 'cagr' ? `CAGR: ${results?.cagr}%` : `ROI: ${results?.roi}%`}`,
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard! Your friend can use this link to see the same calculation.')
    }
  }

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
              📈 {inputs.calculationType === 'cagr' ? 'CAGR' : 'ROI'} Details
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
            {/* Calculation Type */}
            <CalculatorDropdown
              configKey="CALCULATION_TYPES.CAGR"
              value={inputs.calculationType}
              onChange={(value) => handleInputChange('calculationType', value)}
              category="mutual_funds"
              placeholder="Select calculation type"
            />

            <CurrencyInput
              label={inputs.calculationType === 'cagr' ? 'Beginning Value' : 'Initial Investment'}
              value={inputs.beginningValue}
              onChange={(value) => handleInputChange('beginningValue', value)}
              fieldName="beginningValue"
              icon="💰"
              placeholder="Enter beginning value"
              min="0"
              focusColor="#8B5CF6"
            />

            <CurrencyInput
              label={inputs.calculationType === 'cagr' ? 'Ending Value' : 'Final Value'}
              value={inputs.endingValue}
              onChange={(value) => handleInputChange('endingValue', value)}
              fieldName="endingValue"
              icon="🎯"
              placeholder="Enter ending value"
              min="0"
              focusColor="#8B5CF6"
            />

            {inputs.calculationType === 'cagr' && (
              <CurrencyInput
                label="Number of Years"
                value={inputs.numberOfYears}
                onChange={(value) => handleInputChange('numberOfYears', value)}
                fieldName="numberOfYears"
                icon="📅"
                placeholder="Enter number of years"
                min="1"
                focusColor="#8B5CF6"
              />
            )}

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

        {/* Right Column - Expanded Results */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1F2937' }}>
            📊 {inputs.calculationType === 'cagr' ? 'CAGR' : 'ROI'} Results
          </h3>

          {results ? (
            <div className="grid grid-cols-1 gap-6">
              {inputs.calculationType === 'cagr' && (
                <>
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">📈</span>
                      <h4 className="font-semibold text-base text-gray-700">CAGR</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600 leading-tight">
                      {results.cagr}% per annum
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">💰</span>
                      <h4 className="font-semibold text-base text-gray-700">Total Returns</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 leading-tight">
                      {formatCurrency(results.totalReturns)}
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">📊</span>
                      <h4 className="font-semibold text-base text-gray-700">Total Return %</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 leading-tight">
                      {results.totalReturnPercentage}%
                    </p>
                  </motion.div>
                </>
              )}

              {inputs.calculationType === 'roi' && (
                <>
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">📈</span>
                      <h4 className="font-semibold text-base text-gray-700">ROI</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600 leading-tight">
                      {results.roi}%
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">💰</span>
                      <h4 className="font-semibold text-base text-gray-700">Net Profit</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 leading-tight">
                      {formatCurrency(results.netProfit)}
                    </p>
                  </motion.div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                {inputs.calculationType === 'cagr' ? 'CAGR Calculator' : 'ROI Calculator'}
              </h4>
              <p className="text-gray-500">Enter your investment details to see the analysis</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* PDF Export */}
      {results && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <PDFExport
            calculatorName={`${inputs.calculationType.toUpperCase()} Calculator`}
            inputs={{
              'Beginning Value': formatCurrency(inputs.beginningValue),
              'Ending Value': formatCurrency(inputs.endingValue),
              ...(inputs.calculationType === 'cagr' && { 'Number of Years': `${inputs.numberOfYears} years` }),
              'Calculation Type': inputs.calculationType.toUpperCase()
            }}
            results={inputs.calculationType === 'cagr' ? {
              'CAGR': `${results.cagr}% per annum`,
              'Total Returns': formatCurrency(results.totalReturns),
              'Total Return Percentage': `${results.totalReturnPercentage}%`
            } : {
              'ROI': `${results.roi}%`,
              'Net Profit': formatCurrency(results.netProfit),
              'Final Value': formatCurrency(results.finalValue)
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
