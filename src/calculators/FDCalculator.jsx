
import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'
import NumberInput from '../components/NumberInput'
import PercentageInput from '../components/PercentageInput'
import CalculatorDropdown from '../components/CalculatorDropdown'
import CalculatorLayout, { InputSection, ResultsSection, ResultCard, GradientResultCard } from '../components/CalculatorLayout'

export default function FDCalculator({ onAddToComparison, categoryColor = 'green' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

  const defaultInputs = {
    principal: '',
    interestRate: '',
    timePeriod: '',
    compoundingFrequency: '4' // Quarterly
  }

  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('fd_', defaultInputs)

  // FD calculation function
  const calculateFD = useCallback(() => {
    const principal = parseFloat(inputs.principal) || 0
    const rate = parseFloat(inputs.interestRate) || 0
    const time = parseFloat(inputs.timePeriod) || 0
    const frequency = parseFloat(inputs.compoundingFrequency) || 4

    if (principal <= 0 || rate <= 0 || time <= 0) {
      setResults(null)
      return
    }

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = principal * Math.pow(1 + (rate / 100) / frequency, frequency * time)
    const totalInterest = maturityAmount - principal
    const effectiveRate = ((maturityAmount / principal) ** (1 / time) - 1) * 100

    setResults({
      maturityAmount,
      totalInterest,
      effectiveRate,
      principal,
      timePeriod: time
    })
  }, [inputs, setResults])

  // Trigger calculation when inputs change
  useEffect(() => {
    calculateFD()
  }, [calculateFD])

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('fd', inputs, results)

    const shareData = {
      title: 'finclamp.com - FD Calculator Results',
      text: `FD Calculation: Principal ${formatCurrency(inputs.principal)}, Maturity: ${formatCurrency(results?.maturityAmount)}`,
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
        calculator: 'FD Calculator',
        inputs: {
          principal: inputs.principal,
          interestRate: `${inputs.interestRate}%`,
          timePeriod: `${inputs.timePeriod} years`,
          compoundingFrequency: getCompoundingLabel(inputs.compoundingFrequency)
        },
        results: {
          maturityAmount: results.maturityAmount,
          totalInterest: results.totalInterest,
          effectiveRate: results.effectiveRate
        }
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  const getCompoundingLabel = (frequency) => {
    const labels = {
      '1': 'Annually',
      '2': 'Semi-annually',
      '4': 'Quarterly',
      '12': 'Monthly',
      '365': 'Daily'
    }
    return labels[frequency] || 'Quarterly'
  }

  // Chart data for comparison visualization
  const chartData = results ? [
    { name: 'Principal', value: results.principal, color: '#10B981' },
    { name: 'Interest', value: results.totalInterest, color: '#34D399' }
  ] : []

  return (
    <CalculatorLayout
      title="FD Calculator"
      description="Calculate your Fixed Deposit maturity amount and returns"
      icon="🏦"
    >
      {/* Input Section */}
      <InputSection title="FD Details" icon="💰" onReset={resetCalculator}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyInput
            label="Principal Amount"
            value={inputs.principal}
            onChange={(value) => handleInputChange('principal', value)}
            placeholder="Enter principal amount"
            icon="💰"
            focusColor="#10B981"
          />

          <PercentageInput
            label="Interest Rate"
            value={inputs.interestRate}
            onChange={(value) => handleInputChange('interestRate', value)}
            placeholder="Enter interest rate"
            icon="📈"
          />

          <NumberInput
            label="Time Period"
            value={inputs.timePeriod}
            onChange={(value) => handleInputChange('timePeriod', value)}
            placeholder="Enter time period"
            icon="⏰"
            suffix="years"
            min={0.5}
            max={50}
            step={0.5}
            showControls={true}
          />

          <CalculatorDropdown
            customConfig={{
              label: "Compounding Frequency",
              icon: "🔄",
              options: [
                { value: '1', label: 'Annually', icon: '📅' },
                { value: '2', label: 'Semi-annually', icon: '📅' },
                { value: '4', label: 'Quarterly', icon: '📅' },
                { value: '12', label: 'Monthly', icon: '📅' },
                { value: '365', label: 'Daily', icon: '📅' }
              ]
            }}
            value={inputs.compoundingFrequency}
            onChange={(value) => handleInputChange('compoundingFrequency', value)}
            category="savings"
            placeholder="Select compounding frequency"
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
        emptyStateMessage="Enter FD details to see calculation"
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
            title="Principal Amount"
            value={formatCurrency(results?.principal)}
            description="Initial amount deposited in FD"
            icon="💵"
          />

          <ResultCard
            title="Total Interest Earned"
            value={formatCurrency(results?.totalInterest)}
            description="Interest earned over the investment period"
            icon="📈"
          />

          <ResultCard
            title="Investment Duration"
            value={`${results?.timePeriod} years`}
            description="Time period for your FD investment"
            icon="⏰"
          />

          <ResultCard
            title="Effective Annual Rate"
            value={`${results?.effectiveRate?.toFixed(2)}%`}
            description={`With ${getCompoundingLabel(inputs.compoundingFrequency)} compounding`}
            icon="🎯"
          />
        </div>

        {/* Comparison Chart */}
        {results && chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Principal vs Interest Breakdown
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </ResultsSection>

      {/* PDF Export */}
      {results && (
        <PDFExport
          calculatorName="FD Calculator"
          inputs={inputs}
          results={results}
        />
      )}
    </CalculatorLayout>
  )
}
