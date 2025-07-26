import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Minus, Calculator, Receipt } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const BillSplitCalculator = ({ categoryColor = 'blue' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [billDetails, setBillDetails] = useState({
    totalBill: '',
    tipAmount: '',
    tipPercent: '15',
    tipMode: 'amount', // 'amount' or 'percent'
    numberOfPeople: '2'
  })

  const [people, setPeople] = useState([
    { id: 1, name: 'Person 1', customAmount: '', payCustom: false },
    { id: 2, name: 'Person 2', customAmount: '', payCustom: false }
  ])

  const [results, setResults] = useState({
    subtotal: 0,
    tipAmount: 0,
    totalWithTip: 0,
    perPersonAmount: 0,
    customTotal: 0,
    remainingAmount: 0,
    remainingPeople: 0,
    perPersonRemaining: 0
  })

  useEffect(() => {
    calculateBillSplit()
  }, [billDetails, people])

  const calculateBillSplit = () => {
    const totalBill = parseFloat(billDetails.totalBill) || 0
    const numberOfPeople = parseInt(billDetails.numberOfPeople) || 1

    let tipAmount = 0
    let tipPercent = 0

    if (billDetails.tipMode === 'amount') {
      tipAmount = parseFloat(billDetails.tipAmount) || 0
      tipPercent = totalBill > 0 ? (tipAmount / totalBill) * 100 : 0
    } else {
      tipPercent = parseFloat(billDetails.tipPercent) || 0
      tipAmount = (totalBill * tipPercent) / 100
    }

    const totalWithTip = totalBill + tipAmount

    // Calculate custom amounts
    const customTotal = people.reduce((sum, person) => {
      return person.payCustom ? sum + (parseFloat(person.customAmount) || 0) : sum
    }, 0)

    const remainingAmount = totalWithTip - customTotal
    const remainingPeople = people.filter(person => !person.payCustom).length
    const perPersonRemaining = remainingPeople > 0 ? remainingAmount / remainingPeople : 0
    const perPersonAmount = numberOfPeople > 0 ? totalWithTip / numberOfPeople : 0

    setResults({
      subtotal: totalBill,
      tipAmount,
      tipPercent,
      totalWithTip,
      perPersonAmount,
      customTotal,
      remainingAmount,
      remainingPeople,
      perPersonRemaining
    })
  }

  const handleBillChange = (field, value) => {
    setBillDetails(prev => ({
      ...prev,
      [field]: value
    }))

    // Update number of people in the people array
    if (field === 'numberOfPeople') {
      const newCount = parseInt(value) || 1
      const currentCount = people.length

      if (newCount > currentCount) {
        const newPeople = []
        for (let i = 1; i <= newCount; i++) {
          if (i <= currentCount) {
            newPeople.push(people[i - 1])
          } else {
            newPeople.push({
              id: i,
              name: `Person ${i}`,
              customAmount: '',
              payCustom: false
            })
          }
        }
        setPeople(newPeople)
      } else if (newCount < currentCount) {
        setPeople(people.slice(0, newCount))
      }
    }
  }

  const updatePerson = (id, field, value) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, [field]: value } : person
    ))
  }

  const addPerson = () => {
    const newId = Math.max(...people.map(p => p.id)) + 1
    setPeople([...people, {
      id: newId,
      name: `Person ${newId}`,
      customAmount: '',
      payCustom: false
    }])
    setBillDetails(prev => ({
      ...prev,
      numberOfPeople: (people.length + 1).toString()
    }))
  }

  const removePerson = (id) => {
    if (people.length > 1) {
      setPeople(people.filter(p => p.id !== id))
      setBillDetails(prev => ({
        ...prev,
        numberOfPeople: (people.length - 1).toString()
      }))
    }
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
          <Receipt className="w-8 h-8 text-blue-600" />
          Bill Split Calculator
        </h1>
        <p className="text-gray-600">Split bills fairly among friends, roommates, or group outings</p>
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
            <h2 className="text-xl font-bold text-gray-900">Bill Details</h2>
          </div>

          <div className="space-y-6">
            {/* Total Bill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Bill Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currentFormat.symbol}
                </span>
                <input
                  type="number"
                  value={billDetails.totalBill}
                  onChange={(e) => handleBillChange('totalBill', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>
            </div>

            {/* Tip Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tip
              </label>

              {/* Tip Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
                <button
                  onClick={() => handleBillChange('tipMode', 'amount')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    billDetails.tipMode === 'amount'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Amount
                </button>
                <button
                  onClick={() => handleBillChange('tipMode', 'percent')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    billDetails.tipMode === 'percent'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Percentage
                </button>
              </div>

              {/* Tip Input Field */}
              {billDetails.tipMode === 'amount' ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {currentFormat.symbol}
                  </span>
                  <input
                    type="number"
                    value={billDetails.tipAmount}
                    onChange={(e) => handleBillChange('tipAmount', e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50"
                    min="0"
                    step="0.01"
                  />
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={billDetails.tipPercent}
                      onChange={(e) => handleBillChange('tipPercent', e.target.value)}
                      className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="15"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[10, 15, 18, 20, 25].map(percent => (
                      <button
                        key={percent}
                        onClick={() => handleBillChange('tipPercent', percent.toString())}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          billDetails.tipPercent === percent.toString()
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Number of People */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of People
              </label>
              <input
                type="number"
                value={billDetails.numberOfPeople}
                onChange={(e) => handleBillChange('numberOfPeople', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2"
                min="1"
              />
            </div>
          </div>

          {/* People List */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">People</h3>
              <button
                onClick={addPerson}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Person
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {people.map((person) => (
                <div key={person.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    />
                    {people.length > 1 && (
                      <button
                        onClick={() => removePerson(person.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={person.payCustom}
                      onChange={(e) => updatePerson(person.id, 'payCustom', e.target.checked)}
                      className="rounded"
                    />
                    <label className="text-xs text-gray-600">Custom amount</label>
                  </div>

                  {person.payCustom && (
                    <div className="mt-2 relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={person.customAmount}
                        onChange={(e) => updatePerson(person.id, 'customAmount', e.target.value)}
                        className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              ))}
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
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Split Breakdown</h2>
          </div>

          <div className="space-y-4">
            {/* Bill Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(results.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Tip ({billDetails.tipMode === 'amount' ? formatCurrency(results.tipAmount) : `${results.tipPercent.toFixed(1)}%`}):
                  </span>
                  <span className="font-medium">{formatCurrency(results.tipAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(results.totalWithTip)}</span>
                </div>
              </div>
            </div>

            {/* Equal Split */}
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-center">
                <div className="text-sm text-blue-700 mb-1">Equal Split</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(results.perPersonAmount)}
                </div>
                <div className="text-sm text-blue-500">per person</div>
              </div>
            </div>

            {/* Custom Split Results */}
            {people.some(p => p.payCustom) && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Custom Split</h3>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-700">Custom payments:</span>
                    <span className="font-medium">{formatCurrency(results.customTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-700">Remaining amount:</span>
                    <span className="font-medium">{formatCurrency(results.remainingAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-700">Remaining people:</span>
                    <span className="font-medium">{results.remainingPeople}</span>
                  </div>
                </div>

                {results.remainingPeople > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-green-700">Each remaining person pays:</div>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(results.perPersonRemaining)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Individual Breakdown */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Individual Breakdown</h3>
              <div className="space-y-2">
                {people.map((person) => {
                  const amount = person.payCustom 
                    ? parseFloat(person.customAmount) || 0
                    : results.perPersonRemaining || results.perPersonAmount
                  
                  return (
                    <div key={person.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium text-gray-700">{person.name}:</span>
                      <span className="font-bold text-gray-900">
                        {formatCurrency(amount)}
                        {person.payCustom && (
                          <span className="text-xs text-blue-600 ml-1">(custom)</span>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BillSplitCalculator
