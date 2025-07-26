
import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator, TrendingUp } from 'lucide-react'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'

import PDFExport from '../components/PDFExport'
import ModernInputSection, { ModernInputField, ModernSelectField } from '../components/ModernInputSection'
import ModernResultsSection, { ModernResultGrid, ModernSummaryCard } from '../components/ModernResultsSection'
import BreakdownSection from '../components/BreakdownSection'

export default function FDCalculator({ onAddToComparison, categoryColor = 'green' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()

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

  // Responsive grid class
  const gridClass = isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <span className="text-4xl">🏦</span>
          FD Calculator
        </h1>
        <p className="text-gray-600">Calculate your Fixed Deposit maturity amount and returns</p>
      </motion.div>

      <div className={`grid ${gridClass}`}>
        {/* Input Section */}
        <ModernInputSection
          title="FD Details"
          icon={Calculator}
          onReset={resetCalculator}
          categoryColor="green"
        >
          <ModernInputField
            label="Principal Amount"
            value={inputs.principal}
            onChange={(value) => handleInputChange('principal', value)}
            type="currency"
            placeholder="Enter principal amount"
            min="0"
            categoryColor="green"
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
            categoryColor="green"
          />

          <ModernInputField
            label="Time Period"
            value={inputs.timePeriod}
            onChange={(value) => handleInputChange('timePeriod', value)}
            type="number"
            placeholder="Enter time period"
            suffix="years"
            min="0.5"
            max="50"
            step="0.5"
            categoryColor="green"
          />

          <ModernSelectField
            label="Compounding Frequency"
            value={inputs.compoundingFrequency}
            onChange={(value) => handleInputChange('compoundingFrequency', value)}
            options={[
              { value: '1', label: 'Annually' },
              { value: '2', label: 'Semi-annually' },
              { value: '4', label: 'Quarterly' },
              { value: '12', label: 'Monthly' },
              { value: '365', label: 'Daily' }
            ]}
            categoryColor="green"
          />
        </ModernInputSection>

        {/* Results Section */}
        <ModernResultsSection
          title="Results"
          icon={TrendingUp}
          results={results}
          onShare={shareCalculation}
          onAddToComparison={handleAddToComparison}
          categoryColor="green"
          emptyStateMessage="Enter FD details to see calculation"
        >
          {/* Main Result */}
          <ModernSummaryCard
            title="Maturity Amount"
            items={[
              { label: 'Total Amount', value: results?.maturityAmount, type: 'currency' }
            ]}
            categoryColor="green"
            className="mb-6"
          />

          {/* Key Metrics */}
          <ModernResultGrid
            results={[
              { label: 'Principal Amount', value: results?.principal, type: 'currency' },
              { label: 'Total Interest Earned', value: results?.totalInterest, type: 'currency' },
              { label: 'Investment Duration', value: `${results?.timePeriod} years`, type: 'text' },
              { label: 'Effective Annual Rate', value: results?.effectiveRate?.toFixed(2), type: 'percentage' }
            ]}
            categoryColor="green"
          />

          {/* FD Breakdown Chart */}
          {results && chartData.length > 0 && (
            <BreakdownSection
              title="Principal vs Interest Breakdown"
              data={chartData.map(item => ({
                name: item.name,
                value: item.value,
                color: item.name === 'Principal' ? '#10B981' : '#34D399'
              }))}
              summaryCards={[]}
              chartType="bar"
              categoryColor="green"
            />
          )}
        </ModernResultsSection>
      </div>

      {/* PDF Export */}
      {results && (
        <PDFExport
          calculatorName="FD Calculator"
          inputs={inputs}
          results={results}
        />
      )}
    </div>
  )
}
