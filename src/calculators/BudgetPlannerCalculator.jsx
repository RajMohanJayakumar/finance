import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, TrendingUp, TrendingDown, Plus, Minus, Calculator } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const BudgetPlannerCalculator = ({ categoryColor = 'indigo' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [income, setIncome] = useState([
    { id: 1, source: 'Salary', amount: '' },
    { id: 2, source: 'Freelance', amount: '' }
  ])

  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Rent', amount: '' },
    { id: 2, category: 'Food', amount: '' },
    { id: 3, category: 'Transportation', amount: '' },
    { id: 4, category: 'Utilities', amount: '' },
    { id: 5, category: 'Entertainment', amount: '' }
  ])

  const [results, setResults] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    savingsRate: 0,
    budgetStatus: 'balanced',
    expenseBreakdown: {},
    incomeBreakdown: {}
  })

  useEffect(() => {
    calculateBudget()
  }, [income, expenses])

  const calculateBudget = () => {
    const totalIncome = income.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    const totalExpenses = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    const netIncome = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0

    let budgetStatus = 'balanced'
    if (netIncome > 0) budgetStatus = 'surplus'
    else if (netIncome < 0) budgetStatus = 'deficit'

    // Calculate breakdowns
    const expenseBreakdown = {}
    const incomeBreakdown = {}

    expenses.forEach(expense => {
      if (expense.amount && parseFloat(expense.amount) > 0) {
        expenseBreakdown[expense.category] = parseFloat(expense.amount)
      }
    })

    income.forEach(incomeItem => {
      if (incomeItem.amount && parseFloat(incomeItem.amount) > 0) {
        incomeBreakdown[incomeItem.source] = parseFloat(incomeItem.amount)
      }
    })

    setResults({
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      budgetStatus,
      expenseBreakdown,
      incomeBreakdown
    })
  }

  const addIncomeSource = () => {
    const newId = Math.max(...income.map(i => i.id)) + 1
    setIncome([...income, { id: newId, source: '', amount: '' }])
  }

  const removeIncomeSource = (id) => {
    if (income.length > 1) {
      setIncome(income.filter(i => i.id !== id))
    }
  }

  const updateIncome = (id, field, value) => {
    setIncome(income.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ))
  }

  const addExpenseCategory = () => {
    const newId = Math.max(...expenses.map(e => e.id)) + 1
    setExpenses([...expenses, { id: newId, category: '', amount: '' }])
  }

  const removeExpenseCategory = (id) => {
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
          Budget Planner Calculator
        </h1>
        <p className="text-gray-600">Track your income vs expenses and plan your monthly budget</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Income Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Income</h2>
            </div>
            <button
              onClick={addIncomeSource}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {income.map((incomeItem) => (
              <div key={incomeItem.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={incomeItem.source}
                    onChange={(e) => updateIncome(incomeItem.id, 'source', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="Income source"
                  />
                  {income.length > 1 && (
                    <button
                      onClick={() => removeIncomeSource(incomeItem.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currentFormat.symbol}
                  </span>
                  <input
                    type="number"
                    value={incomeItem.amount}
                    onChange={(e) => updateIncome(incomeItem.id, 'amount', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-green-800">Total Income:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(results.totalIncome)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Expenses Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Expenses</h2>
            </div>
            <button
              onClick={addExpenseCategory}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {expenses.map((expense) => (
              <div key={expense.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={expense.category}
                    onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="Expense category"
                  />
                  {expenses.length > 1 && (
                    <button
                      onClick={() => removeExpenseCategory(expense.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currentFormat.symbol}
                  </span>
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-red-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-red-800">Total Expenses:</span>
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(results.totalExpenses)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calculator className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Budget Summary</h2>
          </div>

          <div className="space-y-4">
            {/* Net Income */}
            <div className={`p-4 rounded-lg border-2 ${
              results.budgetStatus === 'surplus' 
                ? 'bg-green-50 border-green-200' 
                : results.budgetStatus === 'deficit'
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">Net Income</div>
                <div className={`text-2xl font-bold ${
                  results.budgetStatus === 'surplus' 
                    ? 'text-green-600' 
                    : results.budgetStatus === 'deficit'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}>
                  {results.netIncome >= 0 ? '+' : ''}{formatCurrency(results.netIncome)}
                </div>
                <div className={`text-sm ${
                  results.budgetStatus === 'surplus' 
                    ? 'text-green-500' 
                    : results.budgetStatus === 'deficit'
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}>
                  {results.budgetStatus === 'surplus' ? 'Budget Surplus' : 
                   results.budgetStatus === 'deficit' ? 'Budget Deficit' : 'Balanced Budget'}
                </div>
              </div>
            </div>

            {/* Savings Rate */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-700">Savings Rate:</span>
                <span className="font-bold text-blue-600">
                  {results.savingsRate.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Budget Recommendations */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Recommendations</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                {results.savingsRate >= 20 && (
                  <div>✅ Excellent! You're saving 20%+ of your income.</div>
                )}
                {results.savingsRate >= 10 && results.savingsRate < 20 && (
                  <div>👍 Good savings rate. Try to reach 20% if possible.</div>
                )}
                {results.savingsRate >= 0 && results.savingsRate < 10 && (
                  <div>⚠️ Consider increasing your savings rate to at least 10%.</div>
                )}
                {results.savingsRate < 0 && (
                  <div>🚨 You're spending more than you earn. Review your expenses.</div>
                )}
              </div>
            </div>

            {/* Expense Breakdown */}
            {Object.keys(results.expenseBreakdown).length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Expense Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(results.expenseBreakdown).map(([category, amount]) => {
                    const percentage = results.totalExpenses > 0 ? (amount / results.totalExpenses) * 100 : 0
                    return (
                      <div key={category} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{category}:</span>
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
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BudgetPlannerCalculator
