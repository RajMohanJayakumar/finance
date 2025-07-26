import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Users, Calculator, Star } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const TipCalculator = ({ categoryColor = 'green' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [inputs, setInputs] = useState({
    billAmount: '',
    tipPercent: '18',
    numberOfPeople: '1',
    serviceQuality: 'good'
  })

  const [results, setResults] = useState({
    tipAmount: 0,
    totalAmount: 0,
    perPersonBill: 0,
    perPersonTip: 0,
    perPersonTotal: 0
  })

  const serviceQualities = {
    poor: { percent: 10, label: 'Poor Service', color: 'red' },
    average: { percent: 15, label: 'Average Service', color: 'yellow' },
    good: { percent: 18, label: 'Good Service', color: 'green' },
    excellent: { percent: 20, label: 'Excellent Service', color: 'blue' },
    outstanding: { percent: 25, label: 'Outstanding Service', color: 'purple' }
  }

  useEffect(() => {
    calculateTip()
  }, [inputs])

  const calculateTip = () => {
    const billAmount = parseFloat(inputs.billAmount) || 0
    const tipPercent = parseFloat(inputs.tipPercent) || 0
    const numberOfPeople = parseInt(inputs.numberOfPeople) || 1

    const tipAmount = (billAmount * tipPercent) / 100
    const totalAmount = billAmount + tipAmount
    const perPersonBill = billAmount / numberOfPeople
    const perPersonTip = tipAmount / numberOfPeople
    const perPersonTotal = totalAmount / numberOfPeople

    setResults({
      tipAmount,
      totalAmount,
      perPersonBill,
      perPersonTip,
      perPersonTotal
    })
  }

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceQualityChange = (quality) => {
    setInputs(prev => ({
      ...prev,
      serviceQuality: quality,
      tipPercent: serviceQualities[quality].percent.toString()
    }))
  }

  const quickTipButtons = [10, 15, 18, 20, 22, 25]

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
          <DollarSign className="w-8 h-8 text-green-600" />
          Tip Calculator
        </h1>
        <p className="text-gray-600">Calculate tips and split bills with tip per person</p>
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
            <div className="p-2 bg-green-100 rounded-lg">
              <Calculator className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Bill Details</h2>
          </div>

          <div className="space-y-6">
            {/* Bill Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currentFormat.symbol}
                </span>
                <input
                  type="number"
                  value={inputs.billAmount}
                  onChange={(e) => handleInputChange('billAmount', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 rounded-xl transition-all duration-300 focus:outline-none cursor-text focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="100"
                  step="0.01"
                />
              </div>
            </div>

            {/* Service Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Service Quality
              </label>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(serviceQualities).map(([key, quality]) => (
                  <button
                    key={key}
                    onClick={() => handleServiceQualityChange(key)}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      inputs.serviceQuality === key
                        ? `border-${quality.color}-500 bg-${quality.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Star className={`w-4 h-4 ${
                        inputs.serviceQuality === key 
                          ? `text-${quality.color}-600` 
                          : 'text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        inputs.serviceQuality === key 
                          ? `text-${quality.color}-800` 
                          : 'text-gray-700'
                      }`}>
                        {quality.label}
                      </span>
                    </div>
                    <span className={`font-bold ${
                      inputs.serviceQuality === key 
                        ? `text-${quality.color}-600` 
                        : 'text-gray-500'
                    }`}>
                      {quality.percent}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tip Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.tipPercent}
                  onChange={(e) => handleInputChange('tipPercent', e.target.value)}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="18"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
              
              {/* Quick Tip Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {quickTipButtons.map(percent => (
                  <button
                    key={percent}
                    onClick={() => handleInputChange('tipPercent', percent.toString())}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputs.tipPercent === percent.toString()
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>

            {/* Number of People */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of People
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  value={inputs.numberOfPeople}
                  onChange={(e) => handleInputChange('numberOfPeople', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1"
                  min="1"
                />
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Tip Breakdown</h2>
          </div>

          <div className="space-y-4">
            {/* Bill Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bill Amount:</span>
                  <span className="font-medium">{formatCurrency(inputs.billAmount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tip ({inputs.tipPercent}%):</span>
                  <span className="font-medium text-green-600">{formatCurrency(results.tipAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-green-600">{formatCurrency(results.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Per Person Breakdown */}
            {parseInt(inputs.numberOfPeople) > 1 && (
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 text-center">
                  Per Person ({inputs.numberOfPeople} people)
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Bill per person:</span>
                    <span className="font-medium">{formatCurrency(results.perPersonBill)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Tip per person:</span>
                    <span className="font-medium">{formatCurrency(results.perPersonTip)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-blue-200 pt-2">
                    <span className="text-blue-800">Total per person:</span>
                    <span className="text-blue-600">{formatCurrency(results.perPersonTotal)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tip Guide */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Tipping Guide</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div><strong>Restaurants:</strong> 15-20% (18% standard)</div>
                <div><strong>Bars:</strong> $1-2 per drink or 15-20%</div>
                <div><strong>Delivery:</strong> 15-20% (minimum $3-5)</div>
                <div><strong>Taxi/Uber:</strong> 15-20%</div>
                <div><strong>Hair Salon:</strong> 15-20%</div>
                <div><strong>Hotel Housekeeping:</strong> $2-5 per night</div>
              </div>
            </div>

            {/* Service Quality Feedback */}
            {inputs.serviceQuality && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">
                  {serviceQualities[inputs.serviceQuality].label}
                </h3>
                <div className="text-sm text-purple-700">
                  {inputs.serviceQuality === 'poor' && 'Consider speaking with management about the service issues.'}
                  {inputs.serviceQuality === 'average' && 'Standard service deserves a standard tip.'}
                  {inputs.serviceQuality === 'good' && 'Good service is worth recognizing with a fair tip.'}
                  {inputs.serviceQuality === 'excellent' && 'Excellent service deserves to be rewarded!'}
                  {inputs.serviceQuality === 'outstanding' && 'Outstanding service deserves exceptional recognition!'}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => {
                  const roundedTotal = Math.ceil(results.totalAmount)
                  const newTip = roundedTotal - parseFloat(inputs.billAmount || 0)
                  const newTipPercent = inputs.billAmount ? ((newTip / parseFloat(inputs.billAmount)) * 100).toFixed(1) : 0
                  handleInputChange('tipPercent', newTipPercent.toString())
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Round Up Total
              </button>
              <button
                onClick={() => {
                  setInputs({
                    billAmount: '',
                    tipPercent: '18',
                    numberOfPeople: '1',
                    serviceQuality: 'good'
                  })
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
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

export default TipCalculator
