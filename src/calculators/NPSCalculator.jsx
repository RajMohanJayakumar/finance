import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import PDFExport from '../components/PDFExport'
import CurrencyInput from '../components/CurrencyInput'
import NumberInput from '../components/NumberInput'
import PercentageInput from '../components/PercentageInput'
import CalculatorDropdown from '../components/CalculatorDropdown'
import CalculatorLayout, { InputSection, ResultsSection, ResultCard, GradientResultCard } from '../components/CalculatorLayout'

export default function NPSCalculator({ onAddToComparison, categoryColor = 'purple' }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

  const defaultInputs = {
    monthlyContribution: '',
    currentAge: '',
    retirementAge: '60',
    expectedReturn: '10',
    annuityReturn: '6'
  }

  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('nps_', defaultInputs)

  // NPS calculation function
  const calculateNPS = useCallback(() => {
    const monthlyContribution = parseFloat(inputs.monthlyContribution) || 0
    const currentAge = parseFloat(inputs.currentAge) || 0
    const retirementAge = parseFloat(inputs.retirementAge) || 60
    const expectedReturn = parseFloat(inputs.expectedReturn) || 10
    const annuityReturn = parseFloat(inputs.annuityReturn) || 6

    if (monthlyContribution <= 0 || currentAge <= 0 || retirementAge <= currentAge) {
      setResults(null)
      return
    }

    const investmentPeriod = retirementAge - currentAge
    const totalMonths = investmentPeriod * 12
    const monthlyRate = expectedReturn / 100 / 12

    // Calculate corpus at retirement using SIP formula
    const corpus = monthlyContribution * 
      (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))

    // 60% of corpus goes to annuity (mandatory)
    const annuityAmount = corpus * 0.6
    const lumpSum = corpus * 0.4

    // Calculate monthly pension from annuity
    const annuityMonthlyRate = annuityReturn / 100 / 12
    const pensionYears = 25 // Assuming 25 years of pension
    const pensionMonths = pensionYears * 12
    
    const monthlyPension = (annuityAmount * annuityMonthlyRate) / 
      (1 - Math.pow(1 + annuityMonthlyRate, -pensionMonths))

    const totalInvestment = monthlyContribution * totalMonths

    setResults({
      corpus,
      totalInvestment,
      lumpSum,
      annuityAmount,
      monthlyPension,
      investmentPeriod,
      totalMonths
    })
  }, [inputs, setResults])

  // Trigger calculation when inputs change
  useEffect(() => {
    calculateNPS()
  }, [inputs, calculateNPS])

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('nps', inputs, results)

    const shareData = {
      title: 'finclamp.com - NPS Calculator Results',
      text: `NPS Calculation: Monthly Contribution ${formatCurrency(inputs.monthlyContribution)}, Corpus: ${formatCurrency(results?.corpus)}`,
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
        calculator: 'NPS Calculator',
        inputs: {
          monthlyContribution: inputs.monthlyContribution,
          currentAge: inputs.currentAge,
          retirementAge: inputs.retirementAge,
          expectedReturn: `${inputs.expectedReturn}%`,
        },
        results: {
          corpus: results.corpus,
          lumpSum: results.lumpSum,
          monthlyPension: results.monthlyPension
        }
      }

      addToComparison(comparisonData)

      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  // Chart data for growth visualization
  const chartData = results ? (() => {
    const data = []
    const years = results.investmentPeriod
    const monthlyContribution = parseFloat(inputs.monthlyContribution)
    const monthlyRate = parseFloat(inputs.expectedReturn) / 100 / 12
    const currentAge = parseFloat(inputs.currentAge) || 0

    for (let year = 1; year <= years; year++) {
      const months = year * 12
      const invested = monthlyContribution * months
      const corpus = monthlyContribution *
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))

      data.push({
        year: currentAge + year,
        invested,
        corpus: corpus
      })
    }
    return data
  })() : []

  return (
    <CalculatorLayout
      title="NPS Calculator"
      description="Calculate your National Pension System corpus and monthly pension"
      icon="🏛️"
    >
      {/* Input Section */}
      <InputSection title="NPS Details" icon="💰" onReset={resetCalculator}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyInput
            label="Monthly Contribution"
            value={inputs.monthlyContribution}
            onChange={(value) => handleInputChange('monthlyContribution', value)}
            placeholder="Enter monthly contribution"
            icon="💰"
            focusColor="#8B5CF6"
          />

          <NumberInput
            label="Current Age"
            value={inputs.currentAge}
            onChange={(value) => handleInputChange('currentAge', value)}
            placeholder=""
            icon="👤"
            suffix="years"
            min={18}
            max={70}
            step={1}
            showControls={true}
          />

          <CalculatorDropdown
            customConfig={{
              label: "Retirement Age",
              icon: "🎯",
              options: [
                { value: '60', label: '60 years', icon: '🎯' },
                { value: '65', label: '65 years', icon: '🎯' },
                { value: '70', label: '70 years', icon: '🎯' }
              ]
            }}
            value={inputs.retirementAge}
            onChange={(value) => handleInputChange('retirementAge', value)}
            category="retirement"
            placeholder="Select retirement age"
          />

          <PercentageInput
            label="Expected Return"
            value={inputs.expectedReturn}
            onChange={(value) => handleInputChange('expectedReturn', value)}
            placeholder="Enter expected return"
            icon="📈"
          />

          <PercentageInput
            label="Annuity Return"
            value={inputs.annuityReturn}
            onChange={(value) => handleInputChange('annuityReturn', value)}
            placeholder="Enter annuity return"
            icon="🏦"
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
        emptyStateMessage="Enter NPS details to see calculation"
      >
        {/* Main Result */}
        <div className="mb-8">
          <GradientResultCard
            title="Total NPS Corpus"
            value={formatCurrency(results?.corpus)}
            gradient="from-purple-500 to-pink-500"
            icon="💰"
          />
        </div>

        {/* Key Metrics - 2 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ResultCard
            title="Lump Sum (40%)"
            value={formatCurrency(results?.lumpSum)}
            description="40% of corpus available as lump sum at retirement"
            icon="💵"
          />

          <ResultCard
            title="Monthly Pension"
            value={formatCurrency(results?.monthlyPension)}
            description="Estimated monthly pension from 60% annuity"
            icon="🏦"
          />

          <ResultCard
            title="Total Investment"
            value={formatCurrency(results?.totalInvestment)}
            description={`Total contributions over ${results?.investmentPeriod} years`}
            icon="📊"
          />

          <ResultCard
            title="Annuity Amount (60%)"
            value={formatCurrency(results?.annuityAmount)}
            description="60% of corpus used to purchase annuity"
            icon="🏛️"
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
              NPS Growth Over Time
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value, true)}
                    label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value), name === 'invested' ? 'Total Invested' : 'Corpus Value']}
                    labelFormatter={(label) => `Age: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="invested" 
                    stroke="#6B7280" 
                    strokeWidth={2}
                    name="invested"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="corpus" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    name="corpus"
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
          calculatorName="NPS Calculator"
          inputs={inputs}
          results={results}
        />
      )}
    </CalculatorLayout>
  )
}
