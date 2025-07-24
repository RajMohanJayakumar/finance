import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Calculator, Clock } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const DailyInterestCalculator = ({ categoryColor = 'teal' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [inputs, setInputs] = useState({
    principal: '',
    annualRate: '',
    days: '',
    calculationType: 'simple' // 'simple' or 'compound'
  })

  const [results, setResults] = useState({
    dailyRate: 0,
    dailyInterest: 0,
    totalInterest: 0,
    finalAmount: 0,
    effectiveRate: 0
  })

  useEffect(() => {
    calculateDailyInterest()
  }, [inputs])

  const calculateDailyInterest = () => {
    const principal = parseFloat(inputs.principal) || 0
    const annualRate = parseFloat(inputs.annualRate) || 0
    const days = parseInt(inputs.days) || 0

    if (principal <= 0 || annualRate <= 0 || days <= 0) {
      setResults({
        dailyRate: 0,
        dailyInterest: 0,
        totalInterest: 0,
        finalAmount: 0,
        effectiveRate: 0
      })
      return
    }

    const dailyRate = annualRate / 365 / 100

    let totalInterest, finalAmount

    if (inputs.calculationType === 'simple') {
      // Simple Interest: I = P * R * T
      const dailyInterest = principal * dailyRate
      totalInterest = dailyInterest * days
      finalAmount = principal + totalInterest
    } else {
      // Compound Interest: A = P(1 + r)^t
      finalAmount = principal * Math.pow(1 + dailyRate, days)
      totalInterest = finalAmount - principal
    }

    const effectiveRate = principal > 0 ? (totalInterest / principal) * 100 : 0

    setResults({
      dailyRate: dailyRate * 100,
      dailyInterest: principal * dailyRate,
      totalInterest,
      finalAmount,
      effectiveRate
    })
  }

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const quickDayButtons = [7, 15, 30, 60, 90, 180, 365]
  const quickRateButtons = [3, 5, 7, 10, 12, 15]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Clock className="w-8 h-8 text-teal-600" />
          Daily Interest Calculator
        </h1>
        <p className="text-gray-600">Calculate simple or compound interest on short-term savings and loans</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Calculator className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Interest Details</h2>
          </div>

          <div className="space-y-6">
            {/* Principal Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Principal Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currentFormat.symbol}
                </span>
                <input
                  type="number"
                  value={inputs.principal}
                  onChange={(e) => handleInputChange('principal', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="10000"
                />
              </div>
            </div>

            {/* Annual Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Interest Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.annualRate}
                  onChange={(e) => handleInputChange('annualRate', e.target.value)}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="8"
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
              
              {/* Quick Rate Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {quickRateButtons.map(rate => (
                  <button
                    key={rate}
                    onClick={() => handleInputChange('annualRate', rate.toString())}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputs.annualRate === rate.toString()
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Days
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  value={inputs.days}
                  onChange={(e) => handleInputChange('days', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="30"
                  min="1"
                />
              </div>
              
              {/* Quick Day Buttons */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {quickDayButtons.map(day => (
                  <button
                    key={day}
                    onClick={() => handleInputChange('days', day.toString())}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                      inputs.days === day.toString()
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day}d
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interest Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInputChange('calculationType', 'simple')}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    inputs.calculationType === 'simple'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Simple Interest
                </button>
                <button
                  onClick={() => handleInputChange('calculationType', 'compound')}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    inputs.calculationType === 'compound'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Compound Interest
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {inputs.calculationType === 'simple' 
                  ? 'Interest calculated only on principal amount'
                  : 'Interest calculated on principal + accumulated interest'
                }
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Interest Breakdown</h2>
          </div>

          <div className="space-y-4">
            {/* Daily Rate */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Daily Interest Rate:</span>
              <span className="font-bold text-gray-900">
                {results.dailyRate.toFixed(6)}%
              </span>
            </div>

            {/* Daily Interest */}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-700">Daily Interest Earned:</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(results.dailyInterest)}
              </span>
            </div>

            {/* Total Interest */}
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <span className="text-lg font-bold text-green-700">
                Total Interest ({inputs.days} days):
              </span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(results.totalInterest)}
              </span>
            </div>

            {/* Final Amount */}
            <div className="flex justify-between items-center p-4 bg-teal-50 rounded-lg border-2 border-teal-200">
              <span className="text-lg font-bold text-teal-700">Final Amount:</span>
              <span className="text-xl font-bold text-teal-600">
                {formatCurrency(results.finalAmount)}
              </span>
            </div>

            {/* Effective Rate */}
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium text-purple-700">Effective Rate:</span>
              <span className="font-bold text-purple-600">
                {results.effectiveRate.toFixed(3)}%
              </span>
            </div>

            {/* Interest Comparison */}
            {inputs.calculationType === 'compound' && inputs.days && inputs.principal && inputs.annualRate && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Simple vs Compound</h3>
                <div className="text-sm text-yellow-700 space-y-1">
                  {(() => {
                    const simpleInterest = (parseFloat(inputs.principal) * parseFloat(inputs.annualRate) * parseInt(inputs.days)) / (365 * 100)
                    const difference = results.totalInterest - simpleInterest
                    return (
                      <>
                        <div>Simple Interest: {formatCurrency(simpleInterest)}</div>
                        <div>Compound Interest: {formatCurrency(results.totalInterest)}</div>
                        <div className="font-medium">
                          Extra from compounding: {formatCurrency(difference)}
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Use Cases */}
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-indigo-800 mb-2">💡 Common Use Cases</h3>
              <div className="text-sm text-indigo-700 space-y-1">
                <div><strong>Short-term FDs:</strong> Calculate interest for deposits</div>
                <div><strong>Personal loans:</strong> Daily interest on borrowed amount</div>
                <div><strong>Credit cards:</strong> Daily interest charges</div>
                <div><strong>Savings accounts:</strong> Daily interest earnings</div>
                <div><strong>Money market:</strong> Short-term investment returns</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => {
                  const newDays = parseInt(inputs.days || 0) * 2
                  handleInputChange('days', newDays.toString())
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Double Period
              </button>
              <button
                onClick={() => {
                  setInputs({
                    principal: '',
                    annualRate: '',
                    days: '',
                    calculationType: 'simple'
                  })
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DailyInterestCalculator
