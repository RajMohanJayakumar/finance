import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Plus, Minus, Home, Car, Utensils, Zap, ShoppingBag, Heart, Calculator } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const MonthlyExpenseCalculator = ({ categoryColor = 'indigo' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'rent', name: 'Rent/Mortgage', amount: '', icon: Home },
    { id: 2, category: 'food', name: 'Food & Groceries', amount: '', icon: Utensils },
    { id: 3, category: 'transportation', name: 'Transportation', amount: '', icon: Car },
    { id: 4, category: 'utilities', name: 'Utilities', amount: '', icon: Zap },
    { id: 5, category: 'entertainment', name: 'Entertainment', amount: '', icon: ShoppingBag },
    { id: 6, category: 'healthcare', name: 'Healthcare', amount: '', icon: Heart }
  ])

  const [results, setResults] = useState({
    totalExpenses: 0,
    categoryBreakdown: {},
    percentageBreakdown: {},
    budgetRecommendations: {}
  })

  const expenseCategories = {
    rent: { label: 'Housing', icon: Home, color: 'blue', recommended: 30 },
    food: { label: 'Food & Groceries', icon: Utensils, color: 'green', recommended: 15 },
    transportation: { label: 'Transportation', icon: Car, color: 'yellow', recommended: 15 },
    utilities: { label: 'Utilities', icon: Zap, color: 'orange', recommended: 10 },
    entertainment: { label: 'Entertainment', icon: ShoppingBag, color: 'purple', recommended: 10 },
    healthcare: { label: 'Healthcare', icon: Heart, color: 'red', recommended: 5 },
    savings: { label: 'Savings', icon: Calculator, color: 'emerald', recommended: 20 },
    other: { label: 'Other', icon: Calculator, color: 'gray', recommended: 5 }
  }

  useEffect(() => {
    calculateExpenses()
  }, [expenses])

  const calculateExpenses = () => {
    const totalExpenses = expenses.reduce((sum, expense) => {
      return sum + (parseFloat(expense.amount) || 0)
    }, 0)

    const categoryBreakdown = {}
    const percentageBreakdown = {}

    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount) || 0
      if (amount > 0) {
        categoryBreakdown[expense.category] = amount
        percentageBreakdown[expense.category] = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }
    })

    // Budget recommendations based on 50/30/20 rule and common guidelines
    const budgetRecommendations = {}
    Object.keys(expenseCategories).forEach(category => {
      const recommended = expenseCategories[category].recommended
      const actual = percentageBreakdown[category] || 0
      budgetRecommendations[category] = {
        recommended,
        actual,
        status: actual <= recommended ? 'good' : actual <= recommended * 1.2 ? 'warning' : 'over'
      }
    })

    setResults({
      totalExpenses,
      categoryBreakdown,
      percentageBreakdown,
      budgetRecommendations
    })
  }

  const addExpense = () => {
    const newId = Math.max(...expenses.map(e => e.id)) + 1
    setExpenses([...expenses, {
      id: newId,
      category: 'other',
      name: '',
      amount: '',
      icon: Calculator
    }])
  }

  const removeExpense = (id) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(e => e.id !== id))
    }
  }

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ))
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
          <PieChart className="w-8 h-8 text-indigo-600" />
          Monthly Expense Split Calculator
        </h1>
        <p className="text-gray-600">Categorize and analyze your monthly expenses with budget recommendations</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Input Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Monthly Expenses</h2>
            <button
              onClick={addExpense}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {expenses.map((expense) => {
              const categoryInfo = expenseCategories[expense.category]
              const IconComponent = categoryInfo.icon
              
              return (
                <div key={expense.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Category */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Category
                      </label>
                      <select
                        value={expense.category}
                        onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      >
                        {Object.entries(expenseCategories).map(([key, cat]) => (
                          <option key={key} value={key}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Expense Name
                      </label>
                      <input
                        type="text"
                        value={expense.name}
                        onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        placeholder={categoryInfo.label}
                      />
                    </div>

                    {/* Amount */}
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                            {currentFormat.symbol}
                          </span>
                          <input
                            type="number"
                            value={expense.amount}
                            onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                            className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      {expenses.length > 1 && (
                        <button
                          onClick={() => removeExpense(expense.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Icon and Info */}
                  <div className="mt-2 flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 text-${categoryInfo.color}-600`} />
                    <span className="text-xs text-gray-500">
                      Recommended: {categoryInfo.recommended}% of total expenses
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-indigo-800">Total Monthly Expenses:</span>
              <span className="text-xl font-bold text-indigo-600">
                {formatCurrency(results.totalExpenses)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Analysis Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Expense Analysis</h2>

          <div className="space-y-6">
            {/* Category Breakdown */}
            {Object.keys(results.categoryBreakdown).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Category Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(results.categoryBreakdown).map(([category, amount]) => {
                    const categoryInfo = expenseCategories[category]
                    const percentage = results.percentageBreakdown[category]
                    const recommendation = results.budgetRecommendations[category]
                    const IconComponent = categoryInfo.icon
                    
                    return (
                      <div key={category} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className={`w-4 h-4 text-${categoryInfo.color}-600`} />
                            <span className="font-medium text-gray-700">{categoryInfo.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{formatCurrency(amount)}</div>
                            <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                        
                        {/* Budget Status */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            Recommended: {recommendation.recommended}%
                          </span>
                          <span className={`font-medium ${
                            recommendation.status === 'good' ? 'text-green-600' :
                            recommendation.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {recommendation.status === 'good' ? '✅ Within budget' :
                             recommendation.status === 'warning' ? '⚠️ Slightly over' : '🚨 Over budget'}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              recommendation.status === 'good' ? 'bg-green-500' :
                              recommendation.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, (percentage / recommendation.recommended) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Budget Recommendations */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Budget Guidelines</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div><strong>50/30/20 Rule:</strong></div>
                <div>• 50% - Needs (rent, food, utilities)</div>
                <div>• 30% - Wants (entertainment, dining out)</div>
                <div>• 20% - Savings & debt repayment</div>
              </div>
            </div>

            {/* Savings Recommendation */}
            {results.totalExpenses > 0 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">💰 Savings Target</h3>
                <div className="text-sm text-green-700">
                  <div>Based on your expenses of {formatCurrency(results.totalExpenses)}:</div>
                  <div className="mt-1">
                    <strong>Recommended monthly savings: {formatCurrency(results.totalExpenses * 0.25)}</strong>
                  </div>
                  <div className="text-xs mt-1">
                    (25% of expenses for emergency fund & goals)
                  </div>
                </div>
              </div>
            )}

            {/* Expense Optimization Tips */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">🎯 Optimization Tips</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>• Review subscriptions monthly</div>
                <div>• Cook at home to reduce food costs</div>
                <div>• Use public transport when possible</div>
                <div>• Compare utility providers annually</div>
                <div>• Set entertainment budget limits</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MonthlyExpenseCalculator
