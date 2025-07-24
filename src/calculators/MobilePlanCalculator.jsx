import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Wifi, Phone, MessageSquare, Calculator } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const MobilePlanCalculator = ({ categoryColor = 'purple' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [usage, setUsage] = useState({
    dataGB: '10',
    callMinutes: '300',
    smsCount: '100',
    planType: 'postpaid'
  })

  const [preferences, setPreferences] = useState({
    provider: 'any',
    validity: '28',
    additionalFeatures: []
  })

  const [results, setResults] = useState({
    recommendedPlans: [],
    costComparison: {},
    savings: {},
    bestValue: null
  })

  const providers = {
    jio: { name: 'Jio', color: 'blue' },
    airtel: { name: 'Airtel', color: 'red' },
    vi: { name: 'Vi (Vodafone Idea)', color: 'purple' },
    bsnl: { name: 'BSNL', color: 'green' },
    any: { name: 'All Providers', color: 'gray' }
  }

  const planTypes = {
    prepaid: { label: 'Prepaid', description: 'Pay in advance' },
    postpaid: { label: 'Postpaid', description: 'Pay after usage' }
  }

  const additionalFeatures = {
    ott: { label: 'OTT Subscriptions', cost: 200 },
    international: { label: 'International Roaming', cost: 500 },
    hotspot: { label: 'Hotspot Data', cost: 100 },
    premium: { label: 'Premium Support', cost: 150 }
  }

  // Sample plan data (in real app, this would come from API)
  const samplePlans = {
    jio: [
      { name: 'Jio 149', price: 149, data: 1, calls: 300, sms: 100, validity: 24, ott: false },
      { name: 'Jio 239', price: 239, data: 2, calls: 'unlimited', sms: 100, validity: 28, ott: false },
      { name: 'Jio 399', price: 399, data: 6, calls: 'unlimited', sms: 100, validity: 28, ott: true },
      { name: 'Jio 599', price: 599, data: 12, calls: 'unlimited', sms: 100, validity: 56, ott: true },
      { name: 'Jio 999', price: 999, data: 24, calls: 'unlimited', sms: 100, validity: 84, ott: true }
    ],
    airtel: [
      { name: 'Airtel 155', price: 155, data: 1, calls: 300, sms: 100, validity: 24, ott: false },
      { name: 'Airtel 265', price: 265, data: 2, calls: 'unlimited', sms: 100, validity: 28, ott: false },
      { name: 'Airtel 449', price: 449, data: 6, calls: 'unlimited', sms: 100, validity: 28, ott: true },
      { name: 'Airtel 719', price: 719, data: 12, calls: 'unlimited', sms: 100, validity: 56, ott: true },
      { name: 'Airtel 1199', price: 1199, data: 24, calls: 'unlimited', sms: 100, validity: 84, ott: true }
    ],
    vi: [
      { name: 'Vi 179', price: 179, data: 1, calls: 300, sms: 100, validity: 28, ott: false },
      { name: 'Vi 299', price: 299, data: 2, calls: 'unlimited', sms: 100, validity: 28, ott: false },
      { name: 'Vi 479', price: 479, data: 6, calls: 'unlimited', sms: 100, validity: 28, ott: true },
      { name: 'Vi 719', price: 719, data: 12, calls: 'unlimited', sms: 100, validity: 56, ott: true },
      { name: 'Vi 1199', price: 1199, data: 24, calls: 'unlimited', sms: 100, validity: 84, ott: true }
    ],
    bsnl: [
      { name: 'BSNL 107', price: 107, data: 2, calls: 'unlimited', sms: 100, validity: 25, ott: false },
      { name: 'BSNL 187', price: 187, data: 2, calls: 'unlimited', sms: 100, validity: 28, ott: false },
      { name: 'BSNL 397', price: 397, data: 6, calls: 'unlimited', sms: 100, validity: 70, ott: false },
      { name: 'BSNL 797', price: 797, data: 24, calls: 'unlimited', sms: 100, validity: 160, ott: false }
    ]
  }

  useEffect(() => {
    calculateBestPlans()
  }, [usage, preferences])

  const calculateBestPlans = () => {
    const dataNeeded = parseFloat(usage.dataGB) || 0
    const callsNeeded = parseInt(usage.callMinutes) || 0
    const smsNeeded = parseInt(usage.smsCount) || 0
    const validityNeeded = parseInt(preferences.validity) || 28

    let allPlans = []
    
    // Get plans from selected provider or all providers
    if (preferences.provider === 'any') {
      Object.entries(samplePlans).forEach(([provider, plans]) => {
        plans.forEach(plan => {
          allPlans.push({ ...plan, provider })
        })
      })
    } else {
      samplePlans[preferences.provider]?.forEach(plan => {
        allPlans.push({ ...plan, provider: preferences.provider })
      })
    }

    // Filter plans that meet requirements
    const suitablePlans = allPlans.filter(plan => {
      const meetsData = plan.data >= dataNeeded
      const meetsCalls = plan.calls === 'unlimited' || plan.calls >= callsNeeded
      const meetsSms = plan.sms >= smsNeeded
      const meetsValidity = plan.validity >= validityNeeded * 0.8 // Allow 20% flexibility
      
      return meetsData && meetsCalls && meetsSms && meetsValidity
    })

    // Calculate cost per day for comparison
    const plansWithCostPerDay = suitablePlans.map(plan => ({
      ...plan,
      costPerDay: plan.price / plan.validity,
      costPerGB: plan.price / plan.data,
      value: calculateValueScore(plan, dataNeeded, callsNeeded)
    }))

    // Sort by value score
    const recommendedPlans = plansWithCostPerDay
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    // Find best value plan
    const bestValue = recommendedPlans[0]

    // Calculate cost comparison
    const costComparison = calculateCostComparison(recommendedPlans)

    // Calculate potential savings
    const savings = calculateSavings(recommendedPlans)

    setResults({
      recommendedPlans,
      costComparison,
      savings,
      bestValue
    })
  }

  const calculateValueScore = (plan, dataNeeded, callsNeeded) => {
    let score = 0
    
    // Data value (higher score for more data at lower cost)
    score += (plan.data / plan.price) * 100
    
    // Validity value (longer validity is better)
    score += plan.validity * 2
    
    // OTT bonus
    if (plan.ott) score += 50
    
    // Penalty for excess (if plan is much more than needed)
    if (plan.data > dataNeeded * 2) score -= 20
    
    return score
  }

  const calculateCostComparison = (plans) => {
    const comparison = {}
    
    plans.forEach(plan => {
      if (!comparison[plan.provider]) {
        comparison[plan.provider] = {
          cheapest: plan,
          mostData: plan,
          bestValue: plan
        }
      }
      
      const current = comparison[plan.provider]
      
      if (plan.price < current.cheapest.price) {
        current.cheapest = plan
      }
      
      if (plan.data > current.mostData.data) {
        current.mostData = plan
      }
      
      if (plan.value > current.bestValue.value) {
        current.bestValue = plan
      }
    })
    
    return comparison
  }

  const calculateSavings = (plans) => {
    if (plans.length < 2) return {}
    
    const mostExpensive = plans.reduce((max, plan) => 
      plan.price > max.price ? plan : max
    )
    
    const cheapest = plans.reduce((min, plan) => 
      plan.price < min.price ? plan : min
    )
    
    return {
      maxSaving: mostExpensive.price - cheapest.price,
      percentageSaving: ((mostExpensive.price - cheapest.price) / mostExpensive.price) * 100
    }
  }

  const handleUsageChange = (field, value) => {
    setUsage(prev => ({
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div className="text-center" {...fadeInUp}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Smartphone className="w-8 h-8 text-purple-600" />
          Mobile/Data Plan Cost Estimator
        </h1>
        <p className="text-gray-600">Choose the best mobile plan for your needs and budget</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Requirements */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calculator className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Your Usage</h2>
          </div>

          <div className="space-y-6">
            {/* Data Usage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Data Usage (GB)
              </label>
              <div className="relative">
                <Wifi className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  value={usage.dataGB}
                  onChange={(e) => handleUsageChange('dataGB', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Light: 1-3GB | Medium: 5-10GB | Heavy: 15GB+
              </div>
            </div>

            {/* Call Minutes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Call Minutes
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  value={usage.callMinutes}
                  onChange={(e) => handleUsageChange('callMinutes', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="300"
                />
              </div>
            </div>

            {/* SMS Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly SMS Count
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  value={usage.smsCount}
                  onChange={(e) => handleUsageChange('smsCount', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(planTypes).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => handleUsageChange('planType', key)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      usage.planType === key
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Provider
              </label>
              <select
                value={preferences.provider}
                onChange={(e) => handlePreferenceChange('provider', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(providers).map(([key, provider]) => (
                  <option key={key} value={key}>{provider.name}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Recommended Plans */}
        <motion.div 
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended Plans</h2>

          {results.recommendedPlans.length > 0 ? (
            <div className="space-y-4">
              {/* Best Value Highlight */}
              {results.bestValue && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                        BEST VALUE
                      </span>
                      <span className="font-bold text-green-800">{results.bestValue.name}</span>
                      <span className="text-sm text-green-600 capitalize">({results.bestValue.provider})</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(results.bestValue.price)}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Data</div>
                      <div className="font-medium">{results.bestValue.data}GB</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Calls</div>
                      <div className="font-medium">{results.bestValue.calls}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Validity</div>
                      <div className="font-medium">{results.bestValue.validity} days</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Cost/Day</div>
                      <div className="font-medium">{formatCurrency(results.bestValue.costPerDay)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Plans */}
              <div className="space-y-3">
                {results.recommendedPlans.slice(1).map((plan, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{plan.name}</span>
                        <span className="text-sm text-gray-500 capitalize">({plan.provider})</span>
                        {plan.ott && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            OTT
                          </span>
                        )}
                      </div>
                      <span className="text-lg font-bold text-purple-600">
                        {formatCurrency(plan.price)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Data</div>
                        <div className="font-medium">{plan.data}GB</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Calls</div>
                        <div className="font-medium">{plan.calls}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Validity</div>
                        <div className="font-medium">{plan.validity} days</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Cost/Day</div>
                        <div className="font-medium">{formatCurrency(plan.costPerDay)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Savings Info */}
              {results.savings.maxSaving > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💰 Potential Savings</h3>
                  <div className="text-sm text-yellow-700">
                    You can save up to <strong>{formatCurrency(results.savings.maxSaving)}</strong> 
                    ({results.savings.percentageSaving.toFixed(1)}%) by choosing the right plan!
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Money Saving Tips</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• Choose longer validity plans for better value</div>
                  <div>• Consider plans with OTT subscriptions if you use them</div>
                  <div>• Monitor your actual usage to avoid overpaying</div>
                  <div>• Look for cashback offers and discounts</div>
                  <div>• Consider family plans if you have multiple connections</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Smartphone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Enter your usage requirements to see recommended plans</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default MobilePlanCalculator
