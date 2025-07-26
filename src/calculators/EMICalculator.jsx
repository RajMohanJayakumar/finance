import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

import { Calculator, Home, TrendingUp } from 'lucide-react'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useViewMode } from '../contexts/ViewModeContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'

import PDFExport from '../components/PDFExport'
import ModernInputSection, { ModernInputField, ModernSelectField } from '../components/ModernInputSection'
import ModernResultsSection, { ModernResultGrid, ModernSummaryCard } from '../components/ModernResultsSection'
import BreakdownSection from '../components/BreakdownSection'

export default function EMICalculator({ onAddToComparison, categoryColor = 'blue' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()
  const { isMobile } = useViewMode()



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
    setInputs,
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

  // Layout configuration based on view mode
  const layoutSpacing = isMobile ? 'space-y-4' : 'space-y-8'
  const gridClass = isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-2 gap-8'
  const containerPadding = isMobile ? 'p-4' : 'p-6'

  return (
    <div className={`max-w-7xl mx-auto ${containerPadding} ${layoutSpacing}`}>
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2 flex items-center justify-center gap-3`}>
          <Home className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-blue-600`} />
          EMI Calculator
        </h1>
        <p className="text-gray-600">Calculate your loan EMI and repayment schedule</p>
      </motion.div>

      <div className={`grid ${gridClass}`}>
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()

                    // Update both values at once to avoid race conditions
                    const newInputs = {
                      ...inputs,
                      loanTenure: years.toString(),
                      tenureType: 'years'
                    }

                    // Use setInputs directly to update both at once
                    setInputs(newInputs)

                    // Also update URL
                    const url = new URL(window.location)
                    url.searchParams.set('emi_loanTenure', years.toString())
                    url.searchParams.set('emi_tenureType', 'years')
                    window.history.replaceState({}, '', url.toString())
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    parseInt(inputs.loanTenure) === years && inputs.tenureType === 'years'
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
            <BreakdownSection
              title="Loan Breakdown"
              data={pieData}
              summaryCards={[]}
              chartType="pie"
              categoryColor="blue"
            />
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