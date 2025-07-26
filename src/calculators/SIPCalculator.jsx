import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator, TrendingUp, Target } from 'lucide-react'
import PDFExport from '../components/PDFExport'
import { useComparison } from '../contexts/ComparisonContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCalculatorState, generateCalculatorShareURL } from '../hooks/useCalculatorState'
import ModernInputSection, { ModernInputField, ModernButtonGroup } from '../components/ModernInputSection'
import ModernResultsSection, { ModernResultGrid, ModernSummaryCard } from '../components/ModernResultsSection'

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
          <Target className="w-8 h-8 text-purple-600" />
          SIP Calculator
        </h1>
        <p className="text-gray-600">Calculate your Systematic Investment Plan returns</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <ModernInputSection
          title="Investment Details"
          icon={Calculator}
          onReset={resetCalculator}
          categoryColor="purple"
        >
          {/* Investment Inputs */}
          <div className="grid grid-cols-1 gap-6">
            <ModernInputField
              label="Monthly Investment"
              value={inputs.monthlyInvestment}
              onChange={(value) => handleFieldChange('monthlyInvestment', value)}
              type="currency"
              placeholder="Enter monthly investment amount"
              min="0"
              categoryColor="purple"
            />

            <ModernInputField
              label="Target Maturity Amount"
              value={inputs.maturityAmount}
              onChange={(value) => handleFieldChange('maturityAmount', value)}
              type="currency"
              placeholder="Enter target maturity amount"
              min="0"
              categoryColor="purple"
            />
          </div>

          <ModernInputField
            label="Expected Annual Return"
            value={inputs.annualReturn}
            onChange={(value) => handleInputChange('annualReturn', value)}
            type="number"
            placeholder="12"
            suffix="%"
            min="0"
            max="50"
            step="0.1"
            categoryColor="purple"
          />

          {/* Investment Period */}
          <div className="grid grid-cols-2 gap-4">
            <ModernInputField
              label="Years"
              value={inputs.timePeriodYears}
              onChange={(value) => handleInputChange('timePeriodYears', value)}
              type="number"
              placeholder="10"
              min="0"
              max="50"
              categoryColor="purple"
            />

            <ModernInputField
              label="Months"
              value={inputs.timePeriodMonths}
              onChange={(value) => handleInputChange('timePeriodMonths', value)}
              type="number"
              placeholder="0"
              min="0"
              max="11"
              categoryColor="purple"
            />
          </div>

          <ModernInputField
            label="Lump Sum Amount (Optional)"
            value={inputs.lumpSumAmount}
            onChange={(value) => handleInputChange('lumpSumAmount', value)}
            type="currency"
            placeholder="Enter lump sum amount"
            min="0"
            categoryColor="purple"
          />

          <ModernButtonGroup
            label="Annual Step-up Type"
            value={inputs.stepUpType}
            onChange={(value) => handleInputChange('stepUpType', value)}
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'amount', label: 'Fixed Amount' }
            ]}
            categoryColor="purple"
          />

          <ModernInputField
            label="Annual Step-up"
            value={inputs.stepUpPercentage}
            onChange={(value) => handleInputChange('stepUpPercentage', value)}
            type="number"
            placeholder="0"
            suffix={inputs.stepUpType === 'percentage' ? '%' : ''}
            min="0"
            categoryColor="purple"
          />
        </ModernInputSection>

        {/* Results Section */}
        <ModernResultsSection
          title="Results"
          icon={TrendingUp}
          results={results}
          onShare={shareCalculation}
          onAddToComparison={handleAddToComparison}
          categoryColor="purple"
          emptyStateMessage="Enter investment details to see SIP calculation"
        >
          {/* Main Result */}
          <ModernSummaryCard
            title="Maturity Amount"
            items={[
              { label: 'Final Value', value: results?.maturityAmount, type: 'currency' }
            ]}
            categoryColor="purple"
            className="mb-6"
          />

          {/* Key Metrics */}
          <ModernResultGrid
            results={[
              { label: 'Total Investment', value: results?.totalInvestment, type: 'currency' },
              { label: 'Total Returns', value: results?.totalReturns, type: 'currency', highlight: true },
              { label: 'Monthly Investment', value: results?.monthlyInvestment, type: 'currency' },
              { label: 'Annualized Return', value: results?.annualizedReturn, type: 'percentage' }
            ]}
            categoryColor="purple"
          />


          {/* Chart */}
          {results && yearlyBreakdown.length > 0 && (
            <motion.div
              className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-purple-800 mb-4">Investment Growth</h3>
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
            </motion.div>
          )}
        </ModernResultsSection>
      </div>

      {/* PDF Export */}
      {results && (
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
      )}
    </div>
  )
}
