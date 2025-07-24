import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, Car, Coffee, Shirt, Calculator, TrendingUp } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const WFHSavingsCalculator = ({ categoryColor = 'green' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [workDetails, setWorkDetails] = useState({
    wfhDaysPerWeek: '5',
    workingDaysPerMonth: '22',
    commuteDistance: '25',
    fuelPrice: '100',
    vehicleMileage: '15'
  })

  const [expenses, setExpenses] = useState({
    // Commute costs
    parkingDaily: '100',
    tollDaily: '50',
    publicTransport: '150',
    
    // Food costs
    lunchDaily: '200',
    coffeeDaily: '100',
    snacksDaily: '50',
    
    // Clothing costs
    formalClothes: '5000',
    dryCleaningMonthly: '1000',
    shoesMonthly: '2000',
    
    // Additional costs
    internetUpgrade: '500',
    electricityIncrease: '800',
    homeOfficeSetup: '15000'
  })

  const [results, setResults] = useState({
    dailySavings: 0,
    weeklySavings: 0,
    monthlySavings: 0,
    yearlySavings: 0,
    categoryBreakdown: {},
    additionalCosts: 0,
    netSavings: 0,
    breakdownDetails: {}
  })

  useEffect(() => {
    calculateWFHSavings()
  }, [workDetails, expenses])

  const calculateWFHSavings = () => {
    const wfhDays = parseInt(workDetails.wfhDaysPerWeek) || 0
    const workingDays = parseInt(workDetails.workingDaysPerMonth) || 22
    const distance = parseFloat(workDetails.commuteDistance) || 0
    const fuelPrice = parseFloat(workDetails.fuelPrice) || 0
    const mileage = parseFloat(workDetails.vehicleMileage) || 0

    // Calculate commute savings
    const fuelCostPerKm = mileage > 0 ? fuelPrice / mileage : 0
    const dailyFuelCost = distance * 2 * fuelCostPerKm // Round trip
    const dailyParking = parseFloat(expenses.parkingDaily) || 0
    const dailyToll = parseFloat(expenses.tollDaily) || 0
    const dailyPublicTransport = parseFloat(expenses.publicTransport) || 0
    
    const dailyCommuteCost = Math.max(
      dailyFuelCost + dailyParking + dailyToll,
      dailyPublicTransport
    )

    // Calculate food savings
    const dailyLunch = parseFloat(expenses.lunchDaily) || 0
    const dailyCoffee = parseFloat(expenses.coffeeDaily) || 0
    const dailySnacks = parseFloat(expenses.snacksDaily) || 0
    const dailyFoodCost = dailyLunch + dailyCoffee + dailySnacks

    // Calculate clothing savings (monthly)
    const monthlyFormalClothes = parseFloat(expenses.formalClothes) / 12 || 0
    const monthlyDryCleaning = parseFloat(expenses.dryCleaningMonthly) || 0
    const monthlyShoes = parseFloat(expenses.shoesMonthly) || 0
    const monthlyClothingCost = monthlyFormalClothes + monthlyDryCleaning + monthlyShoes
    const dailyClothingCost = monthlyClothingCost / workingDays

    // Total daily savings
    const dailySavings = (dailyCommuteCost + dailyFoodCost + dailyClothingCost) * (wfhDays / 5)

    // Calculate additional WFH costs
    const monthlyInternet = parseFloat(expenses.internetUpgrade) || 0
    const monthlyElectricity = parseFloat(expenses.electricityIncrease) || 0
    const homeOfficeSetup = parseFloat(expenses.homeOfficeSetup) || 0
    const monthlyHomeOfficeDepreciation = homeOfficeSetup / 24 // Amortize over 2 years

    const monthlyAdditionalCosts = monthlyInternet + monthlyElectricity + monthlyHomeOfficeDepreciation
    const dailyAdditionalCosts = monthlyAdditionalCosts / workingDays

    // Net calculations
    const netDailySavings = dailySavings - dailyAdditionalCosts
    const weeklySavings = netDailySavings * 5
    const monthlySavings = netDailySavings * workingDays
    const yearlySavings = monthlySavings * 12

    // Category breakdown
    const categoryBreakdown = {
      commute: {
        label: 'Commute Costs',
        dailySaving: dailyCommuteCost * (wfhDays / 5),
        monthlySaving: dailyCommuteCost * (wfhDays / 5) * workingDays,
        icon: Car
      },
      food: {
        label: 'Food & Beverages',
        dailySaving: dailyFoodCost * (wfhDays / 5),
        monthlySaving: dailyFoodCost * (wfhDays / 5) * workingDays,
        icon: Coffee
      },
      clothing: {
        label: 'Formal Clothing',
        dailySaving: dailyClothingCost * (wfhDays / 5),
        monthlySaving: dailyClothingCost * (wfhDays / 5) * workingDays,
        icon: Shirt
      }
    }

    const breakdownDetails = {
      commute: {
        fuel: dailyFuelCost,
        parking: dailyParking,
        toll: dailyToll,
        publicTransport: dailyPublicTransport
      },
      food: {
        lunch: dailyLunch,
        coffee: dailyCoffee,
        snacks: dailySnacks
      },
      clothing: {
        formal: monthlyFormalClothes,
        dryCleaning: monthlyDryCleaning,
        shoes: monthlyShoes
      },
      additionalCosts: {
        internet: monthlyInternet,
        electricity: monthlyElectricity,
        homeOffice: monthlyHomeOfficeDepreciation
      }
    }

    setResults({
      dailySavings: netDailySavings,
      weeklySavings,
      monthlySavings,
      yearlySavings,
      categoryBreakdown,
      additionalCosts: monthlyAdditionalCosts,
      netSavings: monthlySavings,
      breakdownDetails
    })
  }

  const handleWorkDetailsChange = (field, value) => {
    setWorkDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleExpenseChange = (field, value) => {
    setExpenses(prev => ({
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Home className="w-8 h-8 text-green-600" />
          Work-from-Home Savings Calculator
        </h1>
        <p className="text-gray-600">Calculate savings on commute, food, and clothing when working from home</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Work & Expense Details</h2>

          <div className="space-y-6">
            {/* Work Details */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Work Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WFH Days/Week
                  </label>
                  <input
                    type="number"
                    value={workDetails.wfhDaysPerWeek}
                    onChange={(e) => handleWorkDetailsChange('wfhDaysPerWeek', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    max="7"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Working Days/Month
                  </label>
                  <input
                    type="number"
                    value={workDetails.workingDaysPerMonth}
                    onChange={(e) => handleWorkDetailsChange('workingDaysPerMonth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Commute Details */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Commute Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    One-way Distance (km)
                  </label>
                  <input
                    type="number"
                    value={workDetails.commuteDistance}
                    onChange={(e) => handleWorkDetailsChange('commuteDistance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Price/L
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={workDetails.fuelPrice}
                        onChange={(e) => handleWorkDetailsChange('fuelPrice', e.target.value)}
                        className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mileage (km/L)
                    </label>
                    <input
                      type="number"
                      value={workDetails.vehicleMileage}
                      onChange={(e) => handleWorkDetailsChange('vehicleMileage', e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Parking
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={expenses.parkingDaily}
                        onChange={(e) => handleExpenseChange('parkingDaily', e.target.value)}
                        className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Toll
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={expenses.tollDaily}
                        onChange={(e) => handleExpenseChange('tollDaily', e.target.value)}
                        className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Food Expenses */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Daily Food Expenses</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lunch
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={expenses.lunchDaily}
                      onChange={(e) => handleExpenseChange('lunchDaily', e.target.value)}
                      className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coffee
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={expenses.coffeeDaily}
                      onChange={(e) => handleExpenseChange('coffeeDaily', e.target.value)}
                      className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Snacks
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={expenses.snacksDaily}
                      onChange={(e) => handleExpenseChange('snacksDaily', e.target.value)}
                      className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clothing Expenses */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Clothing Expenses</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formal Clothes (Yearly)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={expenses.formalClothes}
                      onChange={(e) => handleExpenseChange('formalClothes', e.target.value)}
                      className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dry Cleaning/Month
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={expenses.dryCleaningMonthly}
                        onChange={(e) => handleExpenseChange('dryCleaningMonthly', e.target.value)}
                        className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formal Shoes/Month
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={expenses.shoesMonthly}
                        onChange={(e) => handleExpenseChange('shoesMonthly', e.target.value)}
                        className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional WFH Costs */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Additional WFH Costs</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Internet Upgrade/Month
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={expenses.internetUpgrade}
                        onChange={(e) => handleExpenseChange('internetUpgrade', e.target.value)}
                        className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Electricity Increase/Month
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={expenses.electricityIncrease}
                        onChange={(e) => handleExpenseChange('electricityIncrease', e.target.value)}
                        className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Office Setup (One-time)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={expenses.homeOfficeSetup}
                      onChange={(e) => handleExpenseChange('homeOfficeSetup', e.target.value)}
                      className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>
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
            <h2 className="text-xl font-bold text-gray-900">Savings Breakdown</h2>
          </div>

          <div className="space-y-6">
            {/* Net Savings Summary */}
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-center">
                <div className="text-sm text-green-700 mb-1">Net Monthly Savings</div>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(results.monthlySavings)}
                </div>
                <div className="text-sm text-green-500 mt-1">
                  {formatCurrency(results.yearlySavings)} per year
                </div>
              </div>
            </div>

            {/* Time Period Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700">Daily Savings</div>
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(results.dailySavings)}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-700">Weekly Savings</div>
                <div className="text-lg font-bold text-purple-600">
                  {formatCurrency(results.weeklySavings)}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Savings by Category</h3>
              <div className="space-y-3">
                {Object.entries(results.categoryBreakdown).map(([key, category]) => {
                  const IconComponent = category.icon
                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">{category.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(category.monthlySaving)}
                        </div>
                        <div className="text-sm text-gray-500">per month</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Additional Costs */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Additional WFH Costs</h3>
              <div className="text-sm text-yellow-700">
                <div className="flex justify-between">
                  <span>Monthly additional costs:</span>
                  <span className="font-medium">{formatCurrency(results.additionalCosts)}</span>
                </div>
                <div className="text-xs mt-1 text-yellow-600">
                  Includes internet, electricity, and home office setup amortization
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 WFH Money Tips</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Claim home office expenses for tax deductions</div>
                <div>• Invest savings in SIP or other investments</div>
                <div>• Use saved commute time for skill development</div>
                <div>• Consider hybrid model for optimal savings</div>
                <div>• Track actual vs estimated savings monthly</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WFHSavingsCalculator
