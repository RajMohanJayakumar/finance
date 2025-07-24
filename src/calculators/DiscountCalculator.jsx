import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Percent, Tag, ShoppingCart, Calculator } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const DiscountCalculator = ({ categoryColor = 'blue' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [inputs, setInputs] = useState({
    originalPrice: '',
    discountPercent: '',
    additionalDiscount: '',
    taxPercent: ''
  })

  const [results, setResults] = useState({
    discountAmount: 0,
    additionalDiscountAmount: 0,
    totalDiscount: 0,
    priceAfterDiscount: 0,
    taxAmount: 0,
    finalPrice: 0,
    totalSavings: 0,
    savingsPercent: 0
  })

  const colorClasses = {
    blue: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300'
    },
    green: {
      primary: 'bg-green-600',
      secondary: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300'
    }
  }

  const colors = colorClasses[categoryColor] || colorClasses.blue

  useEffect(() => {
    calculateDiscount()
  }, [inputs])

  const calculateDiscount = () => {
    const originalPrice = parseFloat(inputs.originalPrice) || 0
    const discountPercent = parseFloat(inputs.discountPercent) || 0
    const additionalDiscount = parseFloat(inputs.additionalDiscount) || 0
    const taxPercent = parseFloat(inputs.taxPercent) || 0

    if (originalPrice <= 0) {
      setResults({
        discountAmount: 0,
        additionalDiscountAmount: 0,
        totalDiscount: 0,
        priceAfterDiscount: 0,
        taxAmount: 0,
        finalPrice: 0,
        totalSavings: 0,
        savingsPercent: 0
      })
      return
    }

    // Calculate primary discount
    const discountAmount = (originalPrice * discountPercent) / 100
    const priceAfterFirstDiscount = originalPrice - discountAmount

    // Calculate additional discount (applied on already discounted price)
    const additionalDiscountAmount = (priceAfterFirstDiscount * additionalDiscount) / 100
    const priceAfterAllDiscounts = priceAfterFirstDiscount - additionalDiscountAmount

    // Calculate tax on final discounted price
    const taxAmount = (priceAfterAllDiscounts * taxPercent) / 100
    const finalPrice = priceAfterAllDiscounts + taxAmount

    // Calculate total savings
    const totalDiscount = discountAmount + additionalDiscountAmount
    const totalSavings = originalPrice - priceAfterAllDiscounts
    const savingsPercent = (totalSavings / originalPrice) * 100

    setResults({
      discountAmount,
      additionalDiscountAmount,
      totalDiscount,
      priceAfterDiscount: priceAfterAllDiscounts,
      taxAmount,
      finalPrice,
      totalSavings,
      savingsPercent
    })
  }

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

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
          <Tag className="w-8 h-8 text-blue-600" />
          Discount Calculator
        </h1>
        <p className="text-gray-600">Calculate final price after applying percentage discounts and taxes</p>
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Price Details</h2>
          </div>

          <div className="space-y-6">
            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currentFormat.symbol}
                </span>
                <input
                  type="number"
                  value={inputs.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>
            </div>

            {/* Discount Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.discountPercent}
                  onChange={(e) => handleInputChange('discountPercent', e.target.value)}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="20"
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
            </div>

            {/* Additional Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Discount (Optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.additionalDiscount}
                  onChange={(e) => handleInputChange('additionalDiscount', e.target.value)}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
            </div>

            {/* Tax Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Percentage (Optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.taxPercent}
                  onChange={(e) => handleInputChange('taxPercent', e.target.value)}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="18"
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </span>
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
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Price Breakdown</h2>
          </div>

          <div className="space-y-4">
            {/* Original Price */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Original Price:</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(inputs.originalPrice || 0)}
              </span>
            </div>

            {/* Primary Discount */}
            {results.discountAmount > 0 && (
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-700">
                  Discount ({inputs.discountPercent}%):
                </span>
                <span className="font-bold text-red-600">
                  -{formatCurrency(results.discountAmount)}
                </span>
              </div>
            )}

            {/* Additional Discount */}
            {results.additionalDiscountAmount > 0 && (
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-700">
                  Additional Discount ({inputs.additionalDiscount}%):
                </span>
                <span className="font-bold text-red-600">
                  -{formatCurrency(results.additionalDiscountAmount)}
                </span>
              </div>
            )}

            {/* Price After Discounts */}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-700">Price After Discounts:</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(results.priceAfterDiscount)}
              </span>
            </div>

            {/* Tax */}
            {results.taxAmount > 0 && (
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-yellow-700">
                  Tax ({inputs.taxPercent}%):
                </span>
                <span className="font-bold text-yellow-600">
                  +{formatCurrency(results.taxAmount)}
                </span>
              </div>
            )}

            {/* Final Price */}
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <span className="text-lg font-bold text-green-700">Final Price:</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(results.finalPrice)}
              </span>
            </div>

            {/* Total Savings */}
            {results.totalSavings > 0 && (
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <span className="text-lg font-bold text-purple-700">Total Savings:</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-600">
                    {formatCurrency(results.totalSavings)}
                  </div>
                  <div className="text-sm text-purple-500">
                    ({results.savingsPercent.toFixed(1)}% off)
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DiscountCalculator
