import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Cigarette, TrendingUp, AlertTriangle, Calculator } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const HabitCostCalculator = ({ categoryColor = 'orange' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [habits, setHabits] = useState([
    { id: 1, type: 'coffee', name: 'Coffee', dailyQuantity: '2', unitCost: '150', active: true },
    { id: 2, type: 'cigarette', name: 'Cigarettes', dailyQuantity: '10', unitCost: '15', active: false }
  ])

  const [timeframe, setTimeframe] = useState('1') // years for projection

  const [results, setResults] = useState({
    dailyTotal: 0,
    weeklyTotal: 0,
    monthlyTotal: 0,
    yearlyTotal: 0,
    projectedCost: 0,
    habitBreakdown: {},
    alternativeInvestments: {},
    healthImpact: {}
  })

  const habitTypes = {
    coffee: { 
      label: 'Coffee', 
      icon: Coffee, 
      color: 'brown',
      units: ['cups', 'shots'],
      healthImpact: 'Moderate caffeine intake can boost alertness but may cause anxiety in excess',
      alternatives: ['Green tea', 'Herbal tea', 'Home brewing']
    },
    cigarette: { 
      label: 'Cigarettes', 
      icon: Cigarette, 
      color: 'red',
      units: ['cigarettes', 'packs'],
      healthImpact: 'Smoking significantly increases risk of cancer, heart disease, and respiratory issues',
      alternatives: ['Nicotine gum', 'Vaping (transition)', 'Meditation', 'Exercise']
    },
    alcohol: { 
      label: 'Alcohol', 
      icon: Coffee, 
      color: 'purple',
      units: ['drinks', 'bottles'],
      healthImpact: 'Moderate consumption may be okay, but excess leads to liver damage and addiction',
      alternatives: ['Mocktails', 'Sparkling water', 'Social activities without alcohol']
    },
    snacks: { 
      label: 'Snacks/Junk Food', 
      icon: Coffee, 
      color: 'yellow',
      units: ['items', 'packets'],
      healthImpact: 'High sugar and processed foods contribute to obesity and diabetes',
      alternatives: ['Fruits', 'Nuts', 'Homemade snacks']
    },
    energy_drinks: { 
      label: 'Energy Drinks', 
      icon: Coffee, 
      color: 'blue',
      units: ['cans', 'bottles'],
      healthImpact: 'High caffeine and sugar content can cause heart palpitations and crashes',
      alternatives: ['Natural fruit juices', 'Coconut water', 'Green smoothies']
    }
  }

  useEffect(() => {
    calculateHabitCosts()
  }, [habits, timeframe])

  const calculateHabitCosts = () => {
    let dailyTotal = 0
    const habitBreakdown = {}

    habits.forEach(habit => {
      if (habit.active) {
        const dailyQuantity = parseFloat(habit.dailyQuantity) || 0
        const unitCost = parseFloat(habit.unitCost) || 0
        const dailyCost = dailyQuantity * unitCost

        dailyTotal += dailyCost

        habitBreakdown[habit.id] = {
          name: habit.name,
          type: habit.type,
          dailyCost,
          weeklyCost: dailyCost * 7,
          monthlyCost: dailyCost * 30,
          yearlyCost: dailyCost * 365,
          dailyQuantity,
          unitCost
        }
      }
    })

    const weeklyTotal = dailyTotal * 7
    const monthlyTotal = dailyTotal * 30
    const yearlyTotal = dailyTotal * 365
    const projectedYears = parseFloat(timeframe) || 1
    const projectedCost = yearlyTotal * projectedYears

    // Calculate alternative investments
    const alternativeInvestments = calculateAlternativeInvestments(monthlyTotal, projectedYears)

    // Health impact calculations
    const healthImpact = calculateHealthImpact(habits)

    setResults({
      dailyTotal,
      weeklyTotal,
      monthlyTotal,
      yearlyTotal,
      projectedCost,
      habitBreakdown,
      alternativeInvestments,
      healthImpact
    })
  }

  const calculateAlternativeInvestments = (monthlyAmount, years) => {
    if (monthlyAmount <= 0) return {}

    // SIP calculation with 12% annual return
    const monthlyRate = 0.12 / 12
    const months = years * 12
    const sipValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))

    // FD calculation with 7% annual return
    const fdValue = monthlyAmount * months * Math.pow(1.07, years)

    // PPF calculation with 8% annual return (15 years)
    const ppfYears = Math.min(years, 15)
    const ppfMonths = ppfYears * 12
    const ppfRate = 0.08 / 12
    const ppfValue = monthlyAmount * (((Math.pow(1 + ppfRate, ppfMonths) - 1) / ppfRate) * (1 + ppfRate))

    return {
      sip: { value: sipValue, returns: sipValue - (monthlyAmount * months) },
      fd: { value: fdValue, returns: fdValue - (monthlyAmount * months) },
      ppf: { value: ppfValue, returns: ppfValue - (monthlyAmount * ppfMonths) }
    }
  }

  const calculateHealthImpact = (habits) => {
    const impact = {}
    
    habits.forEach(habit => {
      if (habit.active) {
        const habitType = habitTypes[habit.type]
        if (habitType) {
          impact[habit.id] = {
            name: habit.name,
            description: habitType.healthImpact,
            alternatives: habitType.alternatives
          }
        }
      }
    })

    return impact
  }

  const addHabit = () => {
    const newId = Math.max(...habits.map(h => h.id)) + 1
    setHabits([...habits, {
      id: newId,
      type: 'coffee',
      name: 'New Habit',
      dailyQuantity: '1',
      unitCost: '100',
      active: true
    }])
  }

  const updateHabit = (id, field, value) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, [field]: value } : habit
    ))
  }

  const removeHabit = (id) => {
    if (habits.length > 1) {
      setHabits(habits.filter(h => h.id !== id))
    }
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
          <Coffee className="w-8 h-8 text-orange-600" />
          Coffee/Smoking Cost Tracker
        </h1>
        <p className="text-gray-600">See how small habits affect your wallet over time</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Habits Input */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Habits</h2>
            <button
              onClick={addHabit}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              Add Habit
            </button>
          </div>

          <div className="space-y-4">
            {habits.map((habit) => {
              const habitType = habitTypes[habit.type]
              const IconComponent = habitType.icon
              
              return (
                <div key={habit.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={habit.active}
                        onChange={(e) => updateHabit(habit.id, 'active', e.target.checked)}
                        className="rounded"
                      />
                      <IconComponent className={`w-5 h-5 text-${habitType.color}-600`} />
                      <input
                        type="text"
                        value={habit.name}
                        onChange={(e) => updateHabit(habit.id, 'name', e.target.value)}
                        className="font-medium bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-orange-500 rounded px-1"
                      />
                    </div>
                    {habits.length > 1 && (
                      <button
                        onClick={() => removeHabit(habit.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Type
                      </label>
                      <select
                        value={habit.type}
                        onChange={(e) => updateHabit(habit.id, 'type', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-orange-500"
                      >
                        {Object.entries(habitTypes).map(([key, type]) => (
                          <option key={key} value={key}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Daily Quantity
                      </label>
                      <input
                        type="number"
                        value={habit.dailyQuantity}
                        onChange={(e) => updateHabit(habit.id, 'dailyQuantity', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-orange-500"
                        placeholder="2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Cost per Unit
                      </label>
                      <div className="relative">
                        <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                          {currentFormat.symbol}
                        </span>
                        <input
                          type="number"
                          value={habit.unitCost}
                          onChange={(e) => updateHabit(habit.id, 'unitCost', e.target.value)}
                          className="w-full pl-4 pr-1 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-orange-500"
                          placeholder="150"
                        />
                      </div>
                    </div>
                  </div>

                  {habit.active && (
                    <div className="mt-2 text-xs text-gray-600">
                      Daily cost: {formatCurrency((parseFloat(habit.dailyQuantity) || 0) * (parseFloat(habit.unitCost) || 0))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Time Projection */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project costs for how many years?
            </label>
            <input
              type="number"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="1"
              min="1"
              max="50"
            />
          </div>
        </motion.div>

        {/* Results */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Cost Impact</h2>
          </div>

          <div className="space-y-6">
            {/* Cost Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-sm text-orange-700">Daily Cost</div>
                <div className="text-lg font-bold text-orange-600">
                  {formatCurrency(results.dailyTotal)}
                </div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-sm text-red-700">Monthly Cost</div>
                <div className="text-lg font-bold text-red-600">
                  {formatCurrency(results.monthlyTotal)}
                </div>
              </div>
            </div>

            {/* Yearly and Projected */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Yearly Cost:</span>
                <span className="font-bold text-gray-900">{formatCurrency(results.yearlyTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{timeframe} Year Projection:</span>
                <span className="text-xl font-bold text-red-600">{formatCurrency(results.projectedCost)}</span>
              </div>
            </div>

            {/* Habit Breakdown */}
            {Object.keys(results.habitBreakdown).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Cost by Habit</h3>
                <div className="space-y-2">
                  {Object.values(results.habitBreakdown).map((habit, index) => {
                    const habitType = habitTypes[habit.type]
                    const IconComponent = habitType.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 text-${habitType.color}-600`} />
                          <span className="text-sm font-medium">{habit.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(habit.monthlyCost)}</div>
                          <div className="text-xs text-gray-500">per month</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Alternative Investments */}
            {results.monthlyTotal > 0 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">💰 If You Invested Instead</h3>
                <div className="text-sm text-green-700 space-y-2">
                  <div className="flex justify-between">
                    <span>SIP (12% return):</span>
                    <span className="font-bold">{formatCurrency(results.alternativeInvestments.sip?.value || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FD (7% return):</span>
                    <span className="font-bold">{formatCurrency(results.alternativeInvestments.fd?.value || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PPF (8% return):</span>
                    <span className="font-bold">{formatCurrency(results.alternativeInvestments.ppf?.value || 0)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Health Impact */}
            {Object.keys(results.healthImpact).length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Health Impact</h3>
                </div>
                <div className="space-y-3">
                  {Object.values(results.healthImpact).map((impact, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-yellow-800">{impact.name}:</div>
                      <div className="text-yellow-700 mb-1">{impact.description}</div>
                      <div className="text-yellow-600">
                        <strong>Alternatives:</strong> {impact.alternatives.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motivation */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🎯 Quit & Save</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Small habits create big financial impact over time</div>
                <div>• Redirect habit money to investments for wealth building</div>
                <div>• Track progress weekly to stay motivated</div>
                <div>• Replace expensive habits with healthier, cheaper alternatives</div>
                <div>• Use saved money for experiences or goals that matter</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HabitCostCalculator
