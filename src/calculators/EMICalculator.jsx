import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'
import UnifiedNumberInput from '../components/UnifiedNumberInput'
import InputWithDropdown from '../components/InputWithDropdown'
import PercentageInput from '../components/PercentageInput'
import CalculatorDropdown from '../components/CalculatorDropdown'
import CalculatorLayout, { InputSection, ResultsSection, ResultCard, GradientResultCard } from '../components/CalculatorLayout'

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
      tenureInMonths
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

  return (
    <CalculatorLayout
      title="EMI Calculator"
      description="Calculate your loan EMI and repayment schedule"
      icon="🏠"
    >
      {/* Input Section */}
      <InputSection title="Loan Details" icon="💰" onReset={resetCalculator}>
        <CurrencyInput
          label="Loan Amount"
          value={inputs.loanAmount}
          onChange={(value) => handleInputChange('loanAmount', value)}
          fieldName="loanAmount"
          icon="💰"
          placeholder="Enter loan amount"
          min="0"
          focusColor="#3B82F6"
        />

        <PercentageInput
          label="Interest Rate"
          value={inputs.interestRate}
          onChange={(value) => handleInputChange('interestRate', value)}
          icon="📈"
          placeholder="Enter interest rate"
        />

        <InputWithDropdown
          label="Loan Tenure"
          icon="📅"
          inputValue={inputs.loanTenure}
          onInputChange={(value) => handleInputChange('loanTenure', value)}
          dropdownValue={inputs.tenureType}
          onDropdownChange={(value) => handleInputChange('tenureType', value)}
          inputProps={{
            placeholder: "Enter tenure",
            min: 1,
            max: 50,
            step: 1
          }}
          dropdownProps={{
            customConfig: {
              label: "Tenure Type",
              icon: "⏰",
              options: [
                { value: 'years', label: 'Years', icon: '📅' },
                { value: 'months', label: 'Months', icon: '📆' }
              ]
            },
            category: "loans",
            placeholder: "Select tenure type"
          }}
        />
      </InputSection>

      {/* Results Section */}
      <ResultsSection
        title="Results"
        icon="📊"
        results={results}
        onShare={shareCalculation}
        onAddToComparison={handleAddToComparison}
        emptyStateMessage="Enter loan details to see EMI calculation"
      >
        {/* Main Result */}
        <div className="mb-8">
          <GradientResultCard
            label="Monthly EMI"
            value={results?.emi}
            gradient="from-blue-500 to-purple-600"
            icon="💳"
          />
        </div>

        {/* Key Metrics - 2 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ResultCard
            label="Principal Amount"
            value={results?.principal}
            description="Original loan amount borrowed"
            icon="🏦"
            color="purple"
          />

          <ResultCard
            label="Total Interest"
            value={results?.totalInterest}
            description="Total interest paid over loan tenure"
            icon="📈"
            color="orange"
          />

          <ResultCard
            label="Total Amount Payable"
            value={results?.totalAmount}
            description="Principal + Total Interest"
            icon="💰"
            color="green"
          />

          <ResultCard
            label="Loan Tenure"
            value={`${inputs.tenureType === 'years' ? inputs.loanTenure + ' years' : inputs.loanTenure + ' months'}`}
            description="Duration of the loan repayment"
            icon="⏰"
            color="blue"
          />
        </div>
      </ResultsSection>

      {/* Loan Breakdown */}
      {results && (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Breakdown</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Summary */}
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-semibold">{formatCurrency(results.principal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(results.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly EMI:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(results.emi)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Tenure:</span>
                  <span className="font-semibold">{results.tenureInMonths} months</span>
                </div>
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
                  <span className="text-sm">Principal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm">Interest</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* PDF Export */}
      {results && (
        <PDFExport
          calculatorName="EMI Calculator"
          inputs={inputs}
          results={results}
        />
      )}
    </CalculatorLayout>
  )
}