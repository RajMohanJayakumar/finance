import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'
import CalculatorLayout, { InputSection, ResultsSection, ResultCard, GradientResultCard } from '../components/CalculatorLayout'

export default function RDCalculator({ onAddToComparison, categoryColor = 'green' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

  const defaultInputs = {
    monthlyDeposit: '',
    interestRate: '',
    timePeriod: ''
  }

  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('rd_', defaultInputs)

  const [yearlyBreakdown, setYearlyBreakdown] = useState([])

  // RD calculation function
  const calculateRD = useCallback(() => {
    const monthlyDeposit = parseFloat(inputs.monthlyDeposit) || 0
    const annualRate = parseFloat(inputs.interestRate) || 0
    const timePeriod = parseFloat(inputs.timePeriod) || 0

    if (monthlyDeposit <= 0 || annualRate <= 0 || timePeriod <= 0) {
      setResults(null)
      setYearlyBreakdown([])
      return
    }

    const months = timePeriod * 12
    const monthlyRate = annualRate / 100 / 12

    // RD Formula: M = P * [((1 + r)^n - 1) / r] * (1 + r)
    const maturityAmount = monthlyDeposit *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))

    const totalDeposits = monthlyDeposit * months
    const totalInterest = maturityAmount - totalDeposits

    // Generate yearly breakdown
    const breakdown = []
    for (let year = 1; year <= timePeriod; year++) {
      const monthsCompleted = year * 12
      const depositsToDate = monthlyDeposit * monthsCompleted

      // Calculate RD value at end of this year
      const rdValue = monthlyDeposit *
        (((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * (1 + monthlyRate))

      breakdown.push({
        year,
        deposits: monthlyDeposit * 12,
        totalDeposits: depositsToDate,
        value: Math.round(rdValue),
        interest: Math.round(rdValue - depositsToDate)
      })
    }

    setResults({
      maturityAmount: Math.round(maturityAmount),
      totalDeposits: Math.round(totalDeposits),
      totalInterest: Math.round(totalInterest),
      timePeriod,
      months
    })

    setYearlyBreakdown(breakdown)
  }, [inputs, setResults])

  // Trigger calculation when inputs change
  useEffect(() => {
    if (inputs.monthlyDeposit && inputs.interestRate && inputs.timePeriod) {
      const timeoutId = setTimeout(() => {
        calculateRD()
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [
    inputs.monthlyDeposit,
    inputs.interestRate,
    inputs.timePeriod
  ])

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('rd', inputs, results)

    const shareData = {
      title: 'finclamp.com - RD Calculator Results',
      text: `RD Calculation: Monthly Deposit ${formatCurrency(inputs.monthlyDeposit)}, Maturity: ${formatCurrency(results?.maturityAmount)}`,
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
        calculator: 'RD Calculator',
        inputs: {
          monthlyDeposit: inputs.monthlyDeposit,
          interestRate: `${inputs.interestRate}%`,
          timePeriod: `${inputs.timePeriod} years`
        },
        results: {
          maturityAmount: results.maturityAmount,
          totalDeposits: results.totalDeposits,
          totalInterest: results.totalInterest
        }
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  // Use yearly breakdown for chart data
  const chartData = yearlyBreakdown

  return (
    <CalculatorLayout
      title="RD Calculator"
      description="Calculate your Recurring Deposit maturity amount and returns"
      icon="🏦"
    >
      {/* Input Section */}
      <InputSection title="RD Details" icon="💰" onReset={resetCalculator}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyInput
            label="Monthly Deposit"
            value={inputs.monthlyDeposit}
            onChange={(value) => handleInputChange('monthlyDeposit', value)}
            placeholder="Enter monthly deposit"
            icon="💰"
            focusColor="#10B981"
          />

          <CurrencyInput
            label="Interest Rate"
            value={inputs.interestRate}
            onChange={(value) => handleInputChange('interestRate', value)}
            placeholder="Enter interest rate"
            icon="📈"
            suffix="%"
            focusColor="#10B981"
          />

          <CurrencyInput
            label="Time Period"
            value={inputs.timePeriod}
            onChange={(value) => handleInputChange('timePeriod', value)}
            placeholder="Enter time period"
            icon="⏰"
            suffix="years"
            focusColor="#10B981"
          />
        </div>
      </InputSection>

      {/* Results Section */}
      <ResultsSection
        title="Results"
        icon="📊"
        results={results}
        onShare={shareCalculation}
        onAddToComparison={handleAddToComparison}
        emptyStateMessage="Enter RD details to see calculation"
      >
        {/* Main Result */}
        <div className="mb-8">
          <GradientResultCard
            title="Maturity Amount"
            value={formatCurrency(results?.maturityAmount)}
            gradient="from-green-500 to-emerald-500"
            icon="💰"
          />
        </div>

        {/* Key Metrics - 2 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ResultCard
            title="Total Deposits"
            value={formatCurrency(results?.totalDeposits)}
            description="Total amount you will deposit over the investment period"
            icon="💵"
          />

          <ResultCard
            title="Total Interest Earned"
            value={formatCurrency(results?.totalInterest)}
            description="Interest earned on your recurring deposits"
            icon="📈"
          />

          <ResultCard
            title="Investment Duration"
            value={`${results?.timePeriod} years (${results?.months} months)`}
            description="Total time period for your RD investment"
            icon="⏰"
          />

          <ResultCard
            title="Monthly Deposit"
            value={formatCurrency(inputs.monthlyDeposit)}
            description="Fixed amount deposited every month"
            icon="🏦"
          />
        </div>

        {/* Growth Chart */}
        {results && chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📈</span>
              RD Growth Over Time
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value, true)}
                    label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(value), name === 'totalDeposits' ? 'Total Deposits' : 'RD Value']}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalDeposits"
                    stroke="#6B7280"
                    strokeWidth={2}
                    name="Total Deposits"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="RD Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </ResultsSection>

      {/* PDF Export */}
      {results && (
        <PDFExport
          calculatorName="RD Calculator"
          inputs={inputs}
          results={results}
        />
      )}
    </CalculatorLayout>
  )
}
