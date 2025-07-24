import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Users, Calculator, TrendingUp } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const GroceryBudgetCalculator = ({ categoryColor = 'green' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [familyDetails, setFamilyDetails] = useState({
    adults: '2',
    children: '0',
    infants: '0',
    dietType: 'mixed',
    location: 'metro'
  })

  const [preferences, setPreferences] = useState({
    organicPercentage: '20',
    eatingOutFrequency: '4',
    bulkBuying: false,
    brandPreference: 'mixed'
  })

  const [results, setResults] = useState({
    weeklyBudget: 0,
    monthlyBudget: 0,
    yearlyBudget: 0,
    perPersonDaily: 0,
    categoryBreakdown: {},
    savingsTips: []
  })

  const dietTypes = {
    vegetarian: { label: 'Vegetarian', multiplier: 0.85 },
    mixed: { label: 'Mixed (Veg + Non-Veg)', multiplier: 1.0 },
    nonvegetarian: { label: 'Non-Vegetarian', multiplier: 1.15 },
    vegan: { label: 'Vegan', multiplier: 0.9 }
  }

  const locations = {
    metro: { label: 'Metro Cities', multiplier: 1.2 },
    tier1: { label: 'Tier 1 Cities', multiplier: 1.0 },
    tier2: { label: 'Tier 2 Cities', multiplier: 0.85 },
    rural: { label: 'Rural Areas', multiplier: 0.7 }
  }

  const brandPreferences = {
    premium: { label: 'Premium Brands', multiplier: 1.3 },
    mixed: { label: 'Mixed Brands', multiplier: 1.0 },
    budget: { label: 'Budget Brands', multiplier: 0.8 }
  }

  // Base daily cost per person in INR (tier 1 city, mixed diet)
  const baseCosts = {
    adult: 150,
    child: 100,
    infant: 50
  }

  const groceryCategories = {
    grains: { label: 'Grains & Cereals', percentage: 25 },
    vegetables: { label: 'Vegetables & Fruits', percentage: 30 },
    dairy: { label: 'Dairy Products', percentage: 15 },
    protein: { label: 'Protein (Meat/Pulses)', percentage: 20 },
    spices: { label: 'Spices & Condiments', percentage: 5 },
    snacks: { label: 'Snacks & Beverages', percentage: 5 }
  }

  useEffect(() => {
    calculateGroceryBudget()
  }, [familyDetails, preferences])

  const calculateGroceryBudget = () => {
    const adults = parseInt(familyDetails.adults) || 0
    const children = parseInt(familyDetails.children) || 0
    const infants = parseInt(familyDetails.infants) || 0

    // Calculate base daily cost
    let dailyCost = (adults * baseCosts.adult) + 
                   (children * baseCosts.child) + 
                   (infants * baseCosts.infant)

    // Apply multipliers
    dailyCost *= dietTypes[familyDetails.dietType].multiplier
    dailyCost *= locations[familyDetails.location].multiplier
    dailyCost *= brandPreferences[preferences.brandPreference].multiplier

    // Apply organic percentage (organic costs 30% more)
    const organicMultiplier = 1 + (parseInt(preferences.organicPercentage) / 100 * 0.3)
    dailyCost *= organicMultiplier

    // Apply bulk buying discount (5% savings)
    if (preferences.bulkBuying) {
      dailyCost *= 0.95
    }

    // Adjust for eating out frequency (reduces grocery needs)
    const eatingOutReduction = parseInt(preferences.eatingOutFrequency) * 0.02
    dailyCost *= (1 - eatingOutReduction)

    const weeklyBudget = dailyCost * 7
    const monthlyBudget = dailyCost * 30
    const yearlyBudget = dailyCost * 365
    const totalPeople = adults + children + infants
    const perPersonDaily = totalPeople > 0 ? dailyCost / totalPeople : 0

    // Category breakdown
    const categoryBreakdown = {}
    Object.entries(groceryCategories).forEach(([key, category]) => {
      categoryBreakdown[key] = {
        label: category.label,
        amount: (monthlyBudget * category.percentage) / 100,
        percentage: category.percentage
      }
    })

    // Generate savings tips
    const savingsTips = generateSavingsTips()

    setResults({
      weeklyBudget,
      monthlyBudget,
      yearlyBudget,
      perPersonDaily,
      categoryBreakdown,
      savingsTips
    })
  }

  const generateSavingsTips = () => {
    const tips = []
    
    if (parseInt(preferences.organicPercentage) > 50) {
      tips.push("Consider reducing organic purchases to 30-40% to save costs")
    }
    
    if (!preferences.bulkBuying) {
      tips.push("Buy non-perishables in bulk to save 5-10%")
    }
    
    if (parseInt(preferences.eatingOutFrequency) < 2) {
      tips.push("Meal planning can help optimize grocery purchases")
    }
    
    if (preferences.brandPreference === 'premium') {
      tips.push("Mix premium and regular brands to balance quality and cost")
    }
    
    tips.push("Shop seasonal vegetables and fruits for better prices")
    tips.push("Compare prices across different stores and online platforms")
    
    return tips
  }

  const handleFamilyChange = (field, value) => {
    setFamilyDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <ShoppingCart className="w-8 h-8 text-green-600" />
          Grocery Budget Calculator
        </h1>
        <p className="text-gray-600">Estimate monthly grocery needs based on family size and preferences</p>
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
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Family Details</h2>
          </div>

          <div className="space-y-6">
            {/* Family Size */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adults
                </label>
                <input
                  type="number"
                  value={familyDetails.adults}
                  onChange={(e) => handleFamilyChange('adults', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children (3-12 yrs)
                </label>
                <input
                  type="number"
                  value={familyDetails.children}
                  onChange={(e) => handleFamilyChange('children', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Infants (0-3 yrs)
                </label>
                <input
                  type="number"
                  value={familyDetails.infants}
                  onChange={(e) => handleFamilyChange('infants', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            {/* Diet Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diet Type
              </label>
              <select
                value={familyDetails.dietType}
                onChange={(e) => handleFamilyChange('dietType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {Object.entries(dietTypes).map(([key, diet]) => (
                  <option key={key} value={key}>{diet.label}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={familyDetails.location}
                onChange={(e) => handleFamilyChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {Object.entries(locations).map(([key, location]) => (
                  <option key={key} value={key}>{location.label}</option>
                ))}
              </select>
            </div>

            {/* Preferences */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
              
              {/* Organic Percentage */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organic Products: {preferences.organicPercentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={preferences.organicPercentage}
                  onChange={(e) => handlePreferenceChange('organicPercentage', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Eating Out Frequency */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eating Out (times per week)
                </label>
                <input
                  type="number"
                  value={preferences.eatingOutFrequency}
                  onChange={(e) => handlePreferenceChange('eatingOutFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max="21"
                />
              </div>

              {/* Brand Preference */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Preference
                </label>
                <select
                  value={preferences.brandPreference}
                  onChange={(e) => handlePreferenceChange('brandPreference', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {Object.entries(brandPreferences).map(([key, brand]) => (
                    <option key={key} value={key}>{brand.label}</option>
                  ))}
                </select>
              </div>

              {/* Bulk Buying */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.bulkBuying}
                  onChange={(e) => handlePreferenceChange('bulkBuying', e.target.checked)}
                  className="rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  I buy non-perishables in bulk
                </label>
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
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Budget Estimate</h2>
          </div>

          <div className="space-y-4">
            {/* Budget Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-sm text-green-700">Weekly</div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(results.weeklyBudget)}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-sm text-blue-700">Per Person/Day</div>
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(results.perPersonDaily)}
                </div>
              </div>
            </div>

            {/* Monthly Budget */}
            <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200 text-center">
              <div className="text-sm text-indigo-700 mb-1">Monthly Budget</div>
              <div className="text-2xl font-bold text-indigo-600">
                {formatCurrency(results.monthlyBudget)}
              </div>
            </div>

            {/* Yearly Budget */}
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-sm text-purple-700">Yearly Budget</div>
              <div className="text-lg font-bold text-purple-600">
                {formatCurrency(results.yearlyBudget)}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Monthly Category Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(results.categoryBreakdown).map(([key, category]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{category.label}</span>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(category.amount)}</div>
                      <div className="text-xs text-gray-500">{category.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Tips */}
            {results.savingsTips.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">💡 Money Saving Tips</h3>
                <div className="text-sm text-yellow-700 space-y-1">
                  {results.savingsTips.map((tip, index) => (
                    <div key={index}>• {tip}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Shopping Tips */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🛒 Smart Shopping Tips</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Make a shopping list and stick to it</div>
                <div>• Shop seasonal produce for better prices</div>
                <div>• Compare prices across stores and apps</div>
                <div>• Buy generic brands for basic items</div>
                <div>• Use coupons and cashback offers</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default GroceryBudgetCalculator
