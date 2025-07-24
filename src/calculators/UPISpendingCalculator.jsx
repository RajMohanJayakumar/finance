import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Plus, Minus, TrendingUp, Calendar, CreditCard } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const UPISpendingCalculator = ({ categoryColor = 'green' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [transactions, setTransactions] = useState([
    { id: 1, amount: '', category: 'food', description: '', time: 'morning' },
    { id: 2, amount: '', category: 'transport', description: '', time: 'afternoon' }
  ])

  const [settings, setSettings] = useState({
    dailyBudget: '',
    trackingPeriod: '7' // days
  })

  const [results, setResults] = useState({
    dailyTotal: 0,
    weeklyProjection: 0,
    monthlyProjection: 0,
    budgetStatus: 'within',
    categoryBreakdown: {},
    timeBreakdown: {},
    averageTransaction: 0,
    spendingTrend: 'stable'
  })

  const categories = {
    food: { label: 'Food & Dining', icon: '🍽️', color: 'orange' },
    transport: { label: 'Transportation', icon: '🚗', color: 'blue' },
    shopping: { label: 'Shopping', icon: '🛒', color: 'purple' },
    entertainment: { label: 'Entertainment', icon: '🎬', color: 'pink' },
    bills: { label: 'Bills & Utilities', icon: '💡', color: 'yellow' },
    groceries: { label: 'Groceries', icon: '🥬', color: 'green' },
    healthcare: { label: 'Healthcare', icon: '🏥', color: 'red' },
    education: { label: 'Education', icon: '📚', color: 'indigo' },
    other: { label: 'Other', icon: '💳', color: 'gray' }
  }

  const timeSlots = {
    morning: { label: 'Morning (6AM-12PM)', icon: '🌅' },
    afternoon: { label: 'Afternoon (12PM-6PM)', icon: '☀️' },
    evening: { label: 'Evening (6PM-10PM)', icon: '🌆' },
    night: { label: 'Night (10PM-6AM)', icon: '🌙' }
  }

  const popularUPIApps = ['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'Amazon Pay', 'WhatsApp Pay']

  useEffect(() => {
    calculateSpending()
  }, [transactions, settings])

  const calculateSpending = () => {
    const dailyTotal = transactions.reduce((sum, transaction) => {
      return sum + (parseFloat(transaction.amount) || 0)
    }, 0)

    const weeklyProjection = dailyTotal * 7
    const monthlyProjection = dailyTotal * 30

    const dailyBudget = parseFloat(settings.dailyBudget) || 0
    let budgetStatus = 'within'
    if (dailyBudget > 0) {
      if (dailyTotal > dailyBudget * 1.2) budgetStatus = 'over'
      else if (dailyTotal > dailyBudget) budgetStatus = 'warning'
    }

    // Category breakdown
    const categoryBreakdown = {}
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0
      if (amount > 0) {
        if (!categoryBreakdown[transaction.category]) {
          categoryBreakdown[transaction.category] = 0
        }
        categoryBreakdown[transaction.category] += amount
      }
    })

    // Time breakdown
    const timeBreakdown = {}
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount) || 0
      if (amount > 0) {
        if (!timeBreakdown[transaction.time]) {
          timeBreakdown[transaction.time] = 0
        }
        timeBreakdown[transaction.time] += amount
      }
    })

    const averageTransaction = transactions.length > 0 ? dailyTotal / transactions.filter(t => parseFloat(t.amount) > 0).length : 0

    setResults({
      dailyTotal,
      weeklyProjection,
      monthlyProjection,
      budgetStatus,
      categoryBreakdown,
      timeBreakdown,
      averageTransaction: averageTransaction || 0,
      spendingTrend: 'stable' // This could be calculated with historical data
    })
  }

  const addTransaction = () => {
    const newId = Math.max(...transactions.map(t => t.id)) + 1
    setTransactions([...transactions, {
      id: newId,
      amount: '',
      category: 'other',
      description: '',
      time: 'afternoon'
    }])
  }

  const removeTransaction = (id) => {
    if (transactions.length > 1) {
      setTransactions(transactions.filter(t => t.id !== id))
    }
  }

  const updateTransaction = (id, field, value) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ))
  }

  const updateSettings = (field, value) => {
    setSettings(prev => ({
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
          <Smartphone className="w-8 h-8 text-green-600" />
          UPI Daily Spending Calculator
        </h1>
        <p className="text-gray-600">Track your UPI/digital wallet spending habits and daily expenses</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
          
          <div className="space-y-4">
            {/* Daily Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Budget (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currentFormat.symbol}
                </span>
                <input
                  type="number"
                  value={settings.dailyBudget}
                  onChange={(e) => updateSettings('dailyBudget', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>
            </div>

            {/* Popular UPI Apps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popular UPI Apps
              </label>
              <div className="grid grid-cols-2 gap-2">
                {popularUPIApps.map(app => (
                  <div key={app} className="p-2 bg-gray-100 rounded text-center text-xs font-medium">
                    {app}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Add Common Expenses
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { amount: '50', label: 'Auto/Bus' },
                  { amount: '200', label: 'Lunch' },
                  { amount: '100', label: 'Coffee' },
                  { amount: '300', label: 'Groceries' }
                ].map(quick => (
                  <button
                    key={quick.label}
                    onClick={() => {
                      const newId = Math.max(...transactions.map(t => t.id)) + 1
                      setTransactions([...transactions, {
                        id: newId,
                        amount: quick.amount,
                        category: quick.label.toLowerCase().includes('auto') || quick.label.toLowerCase().includes('bus') ? 'transport' : 
                                 quick.label.toLowerCase().includes('lunch') || quick.label.toLowerCase().includes('coffee') ? 'food' : 'groceries',
                        description: quick.label,
                        time: 'afternoon'
                      }])
                    }}
                    className="p-2 bg-green-100 hover:bg-green-200 rounded text-xs transition-colors"
                  >
                    <div className="font-medium">{formatCurrency(quick.amount)}</div>
                    <div className="text-gray-600">{quick.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Today's Transactions</h2>
            <button
              onClick={addTransaction}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={transaction.amount}
                        onChange={(e) => updateTransaction(transaction.id, 'amount', e.target.value)}
                        className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Category
                    </label>
                    <select
                      value={transaction.category}
                      onChange={(e) => updateTransaction(transaction.id, 'category', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-green-500"
                    >
                      {Object.entries(categories).map(([key, cat]) => (
                        <option key={key} value={key}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={transaction.description}
                      onChange={(e) => updateTransaction(transaction.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-green-500"
                      placeholder="What did you buy?"
                    />
                  </div>

                  {/* Time */}
                  <div className="flex items-end gap-1">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Time
                      </label>
                      <select
                        value={transaction.time}
                        onChange={(e) => updateTransaction(transaction.id, 'time', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-green-500"
                      >
                        {Object.entries(timeSlots).map(([key, slot]) => (
                          <option key={key} value={key}>{slot.icon} {slot.label.split(' ')[0]}</option>
                        ))}
                      </select>
                    </div>
                    {transactions.length > 1 && (
                      <button
                        onClick={() => removeTransaction(transaction.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Total */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-green-800">Today's Total:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(results.dailyTotal)}
              </span>
            </div>
            {settings.dailyBudget && (
              <div className="mt-1 text-xs text-green-600">
                Budget: {formatCurrency(settings.dailyBudget)} 
                <span className={`ml-2 ${
                  results.budgetStatus === 'within' ? 'text-green-600' :
                  results.budgetStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  ({results.budgetStatus === 'within' ? 'Within budget' :
                    results.budgetStatus === 'warning' ? 'Close to limit' : 'Over budget'})
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Analysis */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Spending Analysis</h2>
          </div>

          <div className="space-y-4">
            {/* Projections */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly projection:</span>
                <span className="font-medium">{formatCurrency(results.weeklyProjection)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly projection:</span>
                <span className="font-medium">{formatCurrency(results.monthlyProjection)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average per transaction:</span>
                <span className="font-medium">{formatCurrency(results.averageTransaction)}</span>
              </div>
            </div>

            {/* Category Breakdown */}
            {Object.keys(results.categoryBreakdown).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">By Category</h3>
                <div className="space-y-2">
                  {Object.entries(results.categoryBreakdown).map(([category, amount]) => {
                    const categoryInfo = categories[category]
                    const percentage = results.dailyTotal > 0 ? (amount / results.dailyTotal) * 100 : 0
                    return (
                      <div key={category} className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1">
                          <span>{categoryInfo.icon}</span>
                          <span>{categoryInfo.label}</span>
                        </span>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(amount)}</div>
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Time Breakdown */}
            {Object.keys(results.timeBreakdown).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">By Time</h3>
                <div className="space-y-2">
                  {Object.entries(results.timeBreakdown).map(([time, amount]) => {
                    const timeInfo = timeSlots[time]
                    return (
                      <div key={time} className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1">
                          <span>{timeInfo.icon}</span>
                          <span>{timeInfo.label.split(' ')[0]}</span>
                        </span>
                        <span className="font-medium">{formatCurrency(amount)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Spending Tips</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <div>• Set daily spending limits</div>
                <div>• Review transactions weekly</div>
                <div>• Use UPI apps with spending insights</div>
                <div>• Avoid impulse purchases</div>
                <div>• Track small expenses - they add up!</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UPISpendingCalculator
