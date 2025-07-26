import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator, Home, TrendingUp } from 'lucide-react'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'

import PDFExport from '../components/PDFExport'
import ModernInputSection, { ModernInputField, ModernSelectField } from '../components/ModernInputSection'
import ModernResultsSection, { ModernResultGrid, ModernSummaryCard } from '../components/ModernResultsSection'

export default function EMICalculator({ onAddToComparison, categoryColor = 'blue' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()



  // Default values
  const defaultInputs = {
    loanAmount: '',
    interestRate: '',
    loanTenure: '',
    tenureType: 'years'
  }

  // State management with URL synchronization
  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('emi_', defaultInputs)



  // EMI calculation function
  const calculateEMI = useCallback(() => {
    const principal = parseFloat(inputs.loanAmount) || 0
    const annualRate = parseFloat(inputs.interestRate) || 0
    const tenure = parseFloat(inputs.loanTenure) || 0
    const tenureType = inputs.tenureType || 'years'

    if (principal <= 0 || annualRate < 0 || tenure <= 0) {
      setResults(null)
      return
    }

    // Convert tenure to months if needed
    const tenureInMonths = tenureType === 'years' ? tenure * 12 : tenure
    const monthlyRate = annualRate / 100 / 12

    let emi, totalAmount, totalInterest

    if (annualRate === 0) {
      // Handle zero interest rate case
      emi = principal / tenureInMonths
      totalAmount = principal
      totalInterest = 0
    } else {
      // Calculate EMI using formula: P * r * (1+r)^n / ((1+r)^n - 1)
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
                  (Math.pow(1 + monthlyRate, tenureInMonths) - 1)
      totalAmount = emi * tenureInMonths
      totalInterest = totalAmount - principal
    }

    setResults({
      emi,
      totalAmount,
      totalInterest,
      principal,
      tenureInMonths,
      interestRate: annualRate
    })


  }, [inputs, setResults])

  // Trigger calculation when inputs change
  useEffect(() => {
    calculateEMI()
  }, [calculateEMI])

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('emi', inputs, results)

    const shareData = {
      title: 'finclamp.com - EMI Calculator Results',
      text: `EMI Calculation: Loan Amount ${formatCurrency(inputs.loanAmount)}, EMI: ${formatCurrency(results?.emi)}`,
      url: shareableURL
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Shareable link copied to clipboard! Your friend can use this link to see the same calculation.')
    }
  }

  // Add to comparison
  const handleAddToComparison = () => {
    if (results && addToComparison) {
      const comparisonData = {
        calculator: 'EMI Calculator',
        inputs: {
          loanAmount: inputs.loanAmount,
          interestRate: inputs.interestRate,
          loanTenure: `${inputs.loanTenure} ${inputs.tenureType}`,
        },
        results: {
          emi: results.emi,
          totalAmount: results.totalAmount,
          totalInterest: results.totalInterest
        }
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  // Pie chart data - safely handle null results
  const pieData = results ? [
    { name: 'Principal', value: results.principal, color: '#3B82F6' },
    { name: 'Interest', value: results.totalInterest, color: '#EF4444' }
  ] : []

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Home className="w-8 h-8 text-blue-600" />
          EMI Calculator
        </h1>
        <p className="text-gray-600">Calculate your loan EMI and repayment schedule</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <ModernInputSection
          title="Loan Details"
          icon={Calculator}
          onReset={resetCalculator}
          categoryColor="blue"
        >
          <ModernInputField
            label="Loan Amount"
            value={inputs.loanAmount}
            onChange={(value) => handleInputChange('loanAmount', value)}
            type="currency"
            placeholder="Enter loan amount"
            min="0"
            categoryColor="blue"
          />

          <ModernInputField
            label="Interest Rate"
            value={inputs.interestRate}
            onChange={(value) => handleInputChange('interestRate', value)}
            type="number"
            placeholder="Enter interest rate"
            suffix="%"
            min="0"
            max="50"
            step="0.1"
            categoryColor="blue"
          />

          <div className="grid grid-cols-2 gap-4">
            <ModernInputField
              label="Loan Tenure"
              value={inputs.loanTenure}
              onChange={(value) => handleInputChange('loanTenure', value)}
              type="number"
              placeholder="Enter tenure"
              min="1"
              max="50"
              categoryColor="blue"
            />

            <ModernSelectField
              label="Tenure Type"
              value={inputs.tenureType}
              onChange={(value) => handleInputChange('tenureType', value)}
              options={[
                { value: 'years', label: 'Years' },
                { value: 'months', label: 'Months' }
              ]}
              categoryColor="blue"
            />
          </div>

          {/* Quick Tenure Buttons */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Select (Years)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((years) => (
                <button
                  key={years}
                  onClick={() => {
                    handleInputChange('loanTenure', years.toString())
                    handleInputChange('tenureType', 'years')
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    inputs.loanTenure === years.toString() && inputs.tenureType === 'years'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  {years}Y
                </button>
              ))}
            </div>
          </div>
        </ModernInputSection>

        {/* Results Section */}
        <ModernResultsSection
          title="Results"
          icon={TrendingUp}
          results={results}
          onShare={shareCalculation}
          onAddToComparison={handleAddToComparison}
          categoryColor="blue"
          emptyStateMessage="Enter loan details to see EMI calculation"
        >
          {/* Main Result */}
          <ModernSummaryCard
            title="Monthly EMI"
            items={[
              { label: 'EMI Amount', value: results?.emi, type: 'currency' }
            ]}
            categoryColor="blue"
            className="mb-6"
          />

          {/* Key Metrics */}
          <ModernResultGrid
            results={[
              { label: 'Principal Amount', value: results?.principal, type: 'currency' },
              { label: 'Total Interest', value: results?.totalInterest, type: 'currency' },
              { label: 'Total Amount Payable', value: results?.totalAmount, type: 'currency', highlight: true },
              { label: 'Interest Rate', value: results?.interestRate, type: 'percentage' }
            ]}
            categoryColor="blue"
          />


          {/* Loan Breakdown Chart */}
          {results && (
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-blue-800 mb-4">Loan Breakdown</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Loan Amount:</span>
                    <span className="font-semibold text-blue-800">{formatCurrency(results.principal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Interest:</span>
                    <span className="font-semibold text-blue-800">{formatCurrency(results.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Amount:</span>
                    <span className="font-semibold text-blue-800">{formatCurrency(results.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Monthly EMI:</span>
                    <span className="font-semibold text-blue-800">{formatCurrency(results.emi)}</span>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div className="flex justify-center gap-4 mt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                      <span className="text-sm text-blue-700">Principal</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                      <span className="text-sm text-blue-700">Interest</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </ModernResultsSection>
      </div>

      {/* PDF Export */}
      {results && (
        <PDFExport
          calculatorName="EMI Calculator"
          inputs={inputs}
          results={results}
        />
      )}
    </div>
  )
}