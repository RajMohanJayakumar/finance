import { useState, useEffect, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PDFExport from '../components/PDFExport'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import CurrencyInput from '../components/CurrencyInput'
import UnifiedNumberInput from '../components/UnifiedNumberInput'
import PercentageInput from '../components/PercentageInput'
import StepUpInput from '../components/StepUpInput'
import CalculatorLayout, { InputSection, ResultsSection, ResultCard, GradientResultCard } from '../components/CalculatorLayout'

export default function SIPCalculator({ onAddToComparison }) {
  const { addToComparison } = useComparison()
  const { formatCurrency } = useCurrency()

  // Default values
  const defaultInputs = {
    monthlyInvestment: '',
    maturityAmount: '',
    lumpSumAmount: '',
    annualReturn: '12',
    timePeriodYears: '10',
    timePeriodMonths: '0',
    stepUpPercentage: '0',
    stepUpType: 'percentage'
  }

  // State management with URL synchronization
  const {
    inputs,
    results,
    setResults,
    handleInputChange,
    resetCalculator
  } = useCalculatorState('sip_', defaultInputs)

  const [yearlyBreakdown, setYearlyBreakdown] = useState([])
  const [lastUpdatedField, setLastUpdatedField] = useState(null)

  // Handle input changes with field tracking
  const handleFieldChange = (field, value) => {
    handleInputChange(field, value)
    setLastUpdatedField(field)
  }

  // Calculate SIP maturity amount from monthly investment
  const calculateMaturityFromMonthly = (monthlyInv, annualRate, totalMonths, stepUpValue, stepUpType) => {
    const monthlyRate = annualRate / 100 / 12

    if (stepUpValue > 0) {
      return calculateStepUpSIPMaturity(monthlyInv, monthlyRate, totalMonths, stepUpValue, stepUpType)
    } else {
      if (monthlyRate > 0) {
        const futureValueFactor = ((1 + monthlyRate) ** totalMonths - 1) / monthlyRate
        return monthlyInv * futureValueFactor
      } else {
        return monthlyInv * totalMonths
      }
    }
  }

  // Calculate required monthly investment for target maturity
  const calculateMonthlyFromMaturity = (maturityAmt, annualRate, totalMonths, stepUpValue, stepUpType) => {
    const monthlyRate = annualRate / 100 / 12

    if (stepUpValue > 0) {
      return calculateRequiredMonthlyForStepUp(maturityAmt, monthlyRate, totalMonths, stepUpValue, stepUpType)
    } else {
      if (monthlyRate > 0) {
        const futureValueFactor = ((1 + monthlyRate) ** totalMonths - 1) / monthlyRate
        return maturityAmt / futureValueFactor
      } else {
        return maturityAmt / totalMonths
      }
    }
  }

  // Share calculation
  const shareCalculation = () => {
    const shareableURL = generateCalculatorShareURL('sip', inputs, results)

    const shareData = {
      title: 'finclamp.com - SIP Calculator Results',
      text: `SIP Calculator Results - Monthly Investment: ${formatCurrency(inputs.monthlyInvestment)}, Maturity: ${formatCurrency(results?.maturityAmount)}`,
      url: shareableURL
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareableURL)
      alert('Link copied to clipboard!')
    }
  }

  // Helper function to calculate step-up SIP maturity amount
  const calculateStepUpSIPMaturity = (initialMonthly, monthlyRate, totalMonths, stepUpValue, stepUpType) => {
    let totalAmount = 0
    let currentMonthlyInv = initialMonthly

    for (let month = 1; month <= totalMonths; month++) {
      // Add current month's investment with compound growth
      const monthsToGrow = totalMonths - month + 1
      totalAmount += currentMonthlyInv * ((1 + monthlyRate) ** monthsToGrow)

      // Increase investment annually (at the end of each 12-month period)
      if (month % 12 === 0 && month < totalMonths) {
        if (stepUpType === 'percentage') {
          currentMonthlyInv = currentMonthlyInv * (1 + stepUpValue / 100)
        } else {
          currentMonthlyInv = currentMonthlyInv + stepUpValue
        }
      }
    }

    return totalAmount
  }

  // Helper function to calculate required monthly investment for step-up SIP
  const calculateRequiredMonthlyForStepUp = (targetAmount, monthlyRate, totalMonths, stepUpValue, stepUpType) => {
    // Use binary search to find the required monthly investment
    let low = 1
    let high = targetAmount / 12
    let tolerance = 1

    while (high - low > tolerance) {
      const mid = (low + high) / 2
      const calculatedAmount = calculateStepUpSIPMaturity(mid, monthlyRate, totalMonths, stepUpValue, stepUpType)

      if (calculatedAmount < targetAmount) {
        low = mid
      } else {
        high = mid
      }
    }

    return (low + high) / 2
  }

  // Main SIP calculation function
  const calculateSIP = useCallback(() => {
    const monthlyInv = parseFloat(inputs.monthlyInvestment) || 0
    const maturityAmt = parseFloat(inputs.maturityAmount) || 0
    const lumpSum = parseFloat(inputs.lumpSumAmount) || 0
    const annualRate = parseFloat(inputs.annualReturn) || 0
    const years = parseInt(inputs.timePeriodYears) || 0
    const months = parseInt(inputs.timePeriodMonths) || 0
    const stepUpValue = parseFloat(inputs.stepUpPercentage) || 0
    const stepUpType = inputs.stepUpType || 'percentage'

    // Calculate total months
    const totalMonths = (years * 12) + months

    if (totalMonths <= 0 || annualRate <= 0 || (monthlyInv <= 0 && maturityAmt <= 0)) {
      setResults(null)
      setYearlyBreakdown([])
      return
    }

    const monthlyRate = annualRate / 100 / 12
    let calculatedMonthlyInvestment = monthlyInv
    let calculatedMaturityAmount = maturityAmt

    // Determine which value to calculate based on what user provided
    if (monthlyInv > 0 && maturityAmt <= 0) {
      // Calculate maturity from monthly investment
      calculatedMaturityAmount = calculateMaturityFromMonthly(
        monthlyInv, annualRate, totalMonths, stepUpValue, stepUpType
      )
    } else if (maturityAmt > 0 && monthlyInv <= 0) {
      // Calculate monthly investment from target maturity
      calculatedMonthlyInvestment = calculateMonthlyFromMaturity(
        maturityAmt, annualRate, totalMonths, stepUpValue, stepUpType
      )
    } else if (monthlyInv > 0 && maturityAmt > 0) {
      // Both values provided - use the last updated field to determine calculation direction
      if (lastUpdatedField === 'monthlyInvestment') {
        calculatedMaturityAmount = calculateMaturityFromMonthly(
          monthlyInv, annualRate, totalMonths, stepUpValue, stepUpType
        )
      } else if (lastUpdatedField === 'maturityAmount') {
        calculatedMonthlyInvestment = calculateMonthlyFromMaturity(
          maturityAmt, annualRate, totalMonths, stepUpValue, stepUpType
        )
      }
    }

    // Add lump sum if provided
    if (lumpSum > 0) {
      calculatedMaturityAmount += lumpSum * ((1 + monthlyRate) ** totalMonths)
    }

    // Calculate total investment considering step-up
    let totalInvestment = lumpSum
    if (stepUpValue > 0) {
      let currentMonthlyInv = calculatedMonthlyInvestment
      for (let month = 1; month <= totalMonths; month++) {
        totalInvestment += currentMonthlyInv
        if (month % 12 === 0 && month < totalMonths) {
          if (stepUpType === 'percentage') {
            currentMonthlyInv = currentMonthlyInv * (1 + stepUpValue / 100)
          } else {
            currentMonthlyInv = currentMonthlyInv + stepUpValue
          }
        }
      }
    } else {
      totalInvestment += calculatedMonthlyInvestment * totalMonths
    }

    const totalReturns = calculatedMaturityAmount - totalInvestment
    const absoluteReturn = totalReturns
    const annualizedReturn = totalMonths > 0 ?
      (Math.pow(calculatedMaturityAmount / totalInvestment, 12 / totalMonths) - 1) * 100 : 0

    // Generate yearly breakdown for visualization
    const breakdown = []
    let cumulativeInvestment = lumpSum
    let currentMonthlyInv = calculatedMonthlyInvestment

    for (let year = 1; year <= years; year++) {
      // Calculate yearly investment (considering step-up happens at year end)
      let yearlyInvestment = 0
      let tempMonthlyInv = currentMonthlyInv

      for (let month = 1; month <= 12; month++) {
        yearlyInvestment += tempMonthlyInv
        // Step-up happens at the end of the year, not during
      }

      cumulativeInvestment += yearlyInvestment

      // Calculate value at end of year
      const monthsFromStart = year * 12
      let yearEndValue = 0

      // Add lump sum growth
      if (lumpSum > 0) {
        yearEndValue += lumpSum * ((1 + monthlyRate) ** monthsFromStart)
      }

      // Add SIP value with step-up
      if (stepUpValue > 0) {
        yearEndValue += calculateStepUpSIPMaturity(
          calculatedMonthlyInvestment, monthlyRate, monthsFromStart, stepUpValue, stepUpType
        )
      } else {
        if (monthlyRate > 0) {
          const futureValueFactor = ((1 + monthlyRate) ** monthsFromStart - 1) / monthlyRate
          yearEndValue += calculatedMonthlyInvestment * futureValueFactor
        } else {
          yearEndValue += calculatedMonthlyInvestment * monthsFromStart
        }
      }

      breakdown.push({
        year,
        investment: Math.round(yearlyInvestment),
        cumulativeInvestment: Math.round(cumulativeInvestment),
        value: Math.round(yearEndValue),
        returns: Math.round(yearEndValue - cumulativeInvestment)
      })

      // Update monthly investment for next year if step-up
      if (stepUpValue > 0) {
        if (stepUpType === 'percentage') {
          currentMonthlyInv = currentMonthlyInv * (1 + stepUpValue / 100)
        } else {
          currentMonthlyInv = currentMonthlyInv + stepUpValue
        }
      }
    }

    setResults({
      monthlyInvestment: Math.round(calculatedMonthlyInvestment),
      maturityAmount: Math.round(calculatedMaturityAmount),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns),
      absoluteReturn: Math.round(absoluteReturn),
      annualizedReturn: annualizedReturn.toFixed(2),
      wealthGained: Math.round(totalReturns)
    })

    setYearlyBreakdown(breakdown)
  }, [inputs, setResults, lastUpdatedField])

  // Real-time calculation with bidirectional updates
  useEffect(() => {
    const monthlyInv = parseFloat(inputs.monthlyInvestment) || 0
    const maturityAmt = parseFloat(inputs.maturityAmount) || 0
    const annualRate = parseFloat(inputs.annualReturn) || 0
    const years = parseInt(inputs.timePeriodYears) || 0
    const months = parseInt(inputs.timePeriodMonths) || 0
    const totalMonths = (years * 12) + months

    // Only calculate if we have minimum required inputs
    if (annualRate > 0 && totalMonths > 0 && (monthlyInv > 0 || maturityAmt > 0)) {
      const stepUpValue = parseFloat(inputs.stepUpPercentage) || 0
      const stepUpType = inputs.stepUpType || 'percentage'

      // Real-time bidirectional updates
      if (lastUpdatedField === 'monthlyInvestment' && monthlyInv > 0) {
        const calculatedMaturity = calculateMaturityFromMonthly(
          monthlyInv, annualRate, totalMonths, stepUpValue, stepUpType
        )
        if (Math.abs(calculatedMaturity - maturityAmt) > 1) {
          handleInputChange('maturityAmount', Math.round(calculatedMaturity).toString())
        }
      } else if (lastUpdatedField === 'maturityAmount' && maturityAmt > 0) {
        const calculatedMonthly = calculateMonthlyFromMaturity(
          maturityAmt, annualRate, totalMonths, stepUpValue, stepUpType
        )
        if (Math.abs(calculatedMonthly - monthlyInv) > 1) {
          handleInputChange('monthlyInvestment', Math.round(calculatedMonthly).toString())
        }
      }

      // Always trigger main calculation
      calculateSIP()
    } else {
      setResults(null)
      setYearlyBreakdown([])
    }
  }, [inputs.monthlyInvestment, inputs.maturityAmount, inputs.annualReturn, inputs.timePeriodYears, inputs.timePeriodMonths, inputs.stepUpPercentage, inputs.stepUpType, lastUpdatedField])

  // Add to comparison
  const handleAddToComparison = () => {
    if (results) {
      const comparisonData = {
        type: 'SIP',
        inputs: {
          monthlyInvestment: inputs.monthlyInvestment,
          annualReturn: inputs.annualReturn,
          timePeriod: `${inputs.timePeriodYears} years ${inputs.timePeriodMonths} months`,
          stepUp: inputs.stepUpPercentage > 0 ? `${inputs.stepUpPercentage}${inputs.stepUpType === 'percentage' ? '%' : ' ₹'}` : 'None'
        },
        results: {
          maturityAmount: results.maturityAmount,
          totalInvestment: results.totalInvestment,
          totalReturns: results.totalReturns
        }
      }

      addToComparison(comparisonData)
      if (onAddToComparison) {
        onAddToComparison(comparisonData)
      }
    }
  }

  return (
    <CalculatorLayout
      title="SIP Calculator"
      description="Calculate your Systematic Investment Plan returns"
      icon="📈"
    >
      {/* Input Section */}
      <InputSection title="Investment Details" icon="📊" onReset={resetCalculator}>
        {/* Investment Inputs - Both Always Active */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Investment */}
          <CurrencyInput
            label="Monthly Investment"
            value={inputs.monthlyInvestment}
            onChange={(value) => handleFieldChange('monthlyInvestment', value)}
            fieldName="monthlyInvestment"
            icon="💰"
            placeholder="Enter monthly investment amount"
            min="0"
            focusColor="#8B5CF6"
          />

          {/* Target Maturity Amount */}
          <CurrencyInput
            label="Target Maturity Amount"
            value={inputs.maturityAmount}
            onChange={(value) => handleFieldChange('maturityAmount', value)}
            fieldName="maturityAmount"
            icon="🎯"
            placeholder="Enter target maturity amount"
            min="0"
            focusColor="#8B5CF6"
          />
        </div>

        {/* Expected Annual Return */}
        <PercentageInput
          label="Expected Annual Return"
          value={inputs.annualReturn}
          onChange={(value) => handleInputChange('annualReturn', value)}
          icon="📈"
          placeholder="12"
        />

        {/* Investment Period */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="text-lg">📅</span>
            Investment Period
          </label>
          <div className="grid grid-cols-2 gap-3">
            <UnifiedNumberInput
              label="Years"
              value={inputs.timePeriodYears}
              onChange={(value) => handleInputChange('timePeriodYears', value)}
              min={0}
              max={50}
              step={1}
              showControls={true}
            />
            <UnifiedNumberInput
              label="Months"
              value={inputs.timePeriodMonths}
              onChange={(value) => handleInputChange('timePeriodMonths', value)}
              min={0}
              max={11}
              step={1}
              showControls={true}
            />
          </div>
        </div>

        {/* Lump Sum Amount */}
        <CurrencyInput
          label="Lump Sum Amount (Optional)"
          value={inputs.lumpSumAmount}
          onChange={(value) => handleInputChange('lumpSumAmount', value)}
          fieldName="lumpSumAmount"
          icon="💎"
          placeholder="Enter lump sum amount"
          min="0"
          focusColor="#8B5CF6"
        />

        {/* Annual Step-up */}
        <StepUpInput
          label="Annual Step-up"
          value={inputs.stepUpPercentage}
          stepUpType={inputs.stepUpType}
          onChange={(value) => handleInputChange('stepUpPercentage', value)}
          onTypeChange={(type) => handleInputChange('stepUpType', type)}
          icon="📊"
          placeholder="0"
        />
      </InputSection>

      {/* Results Section */}
      <ResultsSection
        results={results}
        onAddToComparison={handleAddToComparison}
        onShare={shareCalculation}
        comparisonData={{
          type: 'SIP',
          monthlyInvestment: inputs.monthlyInvestment,
          maturityAmount: results?.maturityAmount
        }}
      >
        {results && (
          <>
            {/* Main Result */}
            <div className="mb-8">
              <GradientResultCard
                title="Maturity Amount"
                value={formatCurrency(results.maturityAmount)}
                gradient="from-purple-500 to-indigo-600"
                icon="🎯"
              />
            </div>

            {/* Key Metrics - 2 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ResultCard
                title="Total Investment"
                value={formatCurrency(results.totalInvestment)}
                description="Total amount you will invest through SIP"
                icon="💰"
              />
              <ResultCard
                title="Total Returns"
                value={formatCurrency(results.totalReturns)}
                description="Wealth gained from your SIP investment"
                icon="📈"
              />
              <ResultCard
                title="Monthly Investment"
                value={formatCurrency(results.monthlyInvestment)}
                description="Amount to invest every month"
                icon="📅"
              />
              <ResultCard
                title="Annualized Return"
                value={`${results.annualizedReturn}%`}
                description="Expected annual return rate"
                icon="🎯"
              />
            </div>

            {/* Chart */}
            {yearlyBreakdown.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Investment Growth</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                      <Tooltip
                        formatter={(value, name) => [formatCurrency(value), name]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="cumulativeInvestment"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        name="Total Investment"
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Portfolio Value"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* PDF Export */}
            <div className="mt-6">
              <PDFExport
                calculatorType="SIP"
                inputs={{
                  monthlyInvestment: inputs.monthlyInvestment,
                  annualReturn: inputs.annualReturn,
                  timePeriod: `${inputs.timePeriodYears} years ${inputs.timePeriodMonths} months`,
                  stepUp: inputs.stepUpPercentage > 0 ? `${inputs.stepUpPercentage}${inputs.stepUpType === 'percentage' ? '%' : ' ₹'}` : 'None'
                }}
                results={{
                  maturityAmount: results.maturityAmount,
                  totalInvestment: results.totalInvestment,
                  totalReturns: results.totalReturns,
                  annualizedReturn: results.annualizedReturn
                }}
                yearlyBreakdown={yearlyBreakdown}
              />
            </div>
          </>
        )}
      </ResultsSection>
    </CalculatorLayout>
  )
}
