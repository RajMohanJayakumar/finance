import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Fuel, Car, Calculator, TrendingUp } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const FuelCostCalculator = ({ categoryColor = 'orange' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [inputs, setInputs] = useState({
    fuelPrice: '',
    mileage: '',
    dailyDistance: '',
    monthlyDistance: '',
    calculationType: 'daily' // 'daily' or 'monthly'
  })

  const [results, setResults] = useState({
    dailyCost: 0,
    weeklyCost: 0,
    monthlyCost: 0,
    yearlyCost: 0,
    costPerKm: 0,
    fuelPerDay: 0,
    fuelPerMonth: 0,
    fuelPerYear: 0
  })

  const colorClasses = {
    orange: {
      primary: 'bg-orange-600',
      secondary: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300'
    },
    blue: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300'
    }
  }

  const colors = colorClasses[categoryColor] || colorClasses.orange

  useEffect(() => {
    calculateFuelCost()
  }, [inputs])

  const calculateFuelCost = () => {
    const fuelPrice = parseFloat(inputs.fuelPrice) || 0
    const mileage = parseFloat(inputs.mileage) || 0
    const dailyDistance = parseFloat(inputs.dailyDistance) || 0
    const monthlyDistance = parseFloat(inputs.monthlyDistance) || 0

    if (fuelPrice <= 0 || mileage <= 0) {
      setResults({
        dailyCost: 0,
        weeklyCost: 0,
        monthlyCost: 0,
        yearlyCost: 0,
        costPerKm: 0,
        fuelPerDay: 0,
        fuelPerMonth: 0,
        fuelPerYear: 0
      })
      return
    }

    // Calculate cost per kilometer
    const costPerKm = fuelPrice / mileage

    let dailyCost, monthlyCost

    if (inputs.calculationType === 'daily' && dailyDistance > 0) {
      // Calculate based on daily distance
      dailyCost = dailyDistance * costPerKm
      monthlyCost = dailyCost * 30 // Assuming 30 days per month
    } else if (inputs.calculationType === 'monthly' && monthlyDistance > 0) {
      // Calculate based on monthly distance
      monthlyCost = monthlyDistance * costPerKm
      dailyCost = monthlyCost / 30
    } else {
      dailyCost = 0
      monthlyCost = 0
    }

    const weeklyCost = dailyCost * 7
    const yearlyCost = monthlyCost * 12

    // Calculate fuel consumption
    const fuelPerDay = dailyDistance / mileage
    const fuelPerMonth = monthlyCost / fuelPrice
    const fuelPerYear = yearlyCost / fuelPrice

    setResults({
      dailyCost,
      weeklyCost,
      monthlyCost,
      yearlyCost,
      costPerKm,
      fuelPerDay,
      fuelPerMonth,
      fuelPerYear
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
          <Fuel className="w-8 h-8 text-orange-600" />
          Fuel Cost Calculator
        </h1>
        <p className="text-gray-600">Calculate daily, monthly, and yearly fuel costs based on fuel price and mileage</p>
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <Car className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Vehicle Details</h2>
          </div>

          <div className="space-y-6">
            {/* Fuel Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Price per Liter
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currentFormat.symbol}
                </span>
                <input
                  type="number"
                  value={inputs.fuelPrice}
                  onChange={(e) => handleInputChange('fuelPrice', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="100"
                  step="0.01"
                />
              </div>
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Mileage (km/liter)
              </label>
              <input
                type="number"
                value={inputs.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="15"
                step="0.1"
              />
            </div>

            {/* Calculation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInputChange('calculationType', 'daily')}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    inputs.calculationType === 'daily'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Daily Distance
                </button>
                <button
                  onClick={() => handleInputChange('calculationType', 'monthly')}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    inputs.calculationType === 'monthly'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Monthly Distance
                </button>
              </div>
            </div>

            {/* Distance Input */}
            {inputs.calculationType === 'daily' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Distance (km)
                </label>
                <input
                  type="number"
                  value={inputs.dailyDistance}
                  onChange={(e) => handleInputChange('dailyDistance', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="50"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Distance (km)
                </label>
                <input
                  type="number"
                  value={inputs.monthlyDistance}
                  onChange={(e) => handleInputChange('monthlyDistance', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="1500"
                />
              </div>
            )}
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
              <Calculator className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Cost Breakdown</h2>
          </div>

          <div className="space-y-4">
            {/* Cost per KM */}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-700">Cost per KM:</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(results.costPerKm)}
              </span>
            </div>

            {/* Daily Cost */}
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-700">Daily Cost:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(results.dailyCost)}
              </span>
            </div>

            {/* Weekly Cost */}
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-700">Weekly Cost:</span>
              <span className="font-bold text-yellow-600">
                {formatCurrency(results.weeklyCost)}
              </span>
            </div>

            {/* Monthly Cost */}
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
              <span className="text-lg font-bold text-orange-700">Monthly Cost:</span>
              <span className="text-xl font-bold text-orange-600">
                {formatCurrency(results.monthlyCost)}
              </span>
            </div>

            {/* Yearly Cost */}
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <span className="text-lg font-bold text-red-700">Yearly Cost:</span>
              <span className="text-xl font-bold text-red-600">
                {formatCurrency(results.yearlyCost)}
              </span>
            </div>
          </div>

          {/* Fuel Consumption */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Fuel Consumption</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-700">Daily Fuel:</span>
                <span className="font-bold text-purple-600">
                  {results.fuelPerDay.toFixed(2)} L
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-700">Monthly Fuel:</span>
                <span className="font-bold text-purple-600">
                  {results.fuelPerMonth.toFixed(2)} L
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-700">Yearly Fuel:</span>
                <span className="font-bold text-purple-600">
                  {results.fuelPerYear.toFixed(2)} L
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FuelCostCalculator
