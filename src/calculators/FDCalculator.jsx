
import React, { useState, useEffect } from 'react'

export default function FDCalculator({ onAddToComparison, categoryColor = 'green' }) {
  
  const [inputs, setInputs] = useState({
    principal: '',
    interestRate: '',
    timePeriod: '',
    compoundingFrequency: '4', // Quarterly
    maturityAmount: '',
    calculationType: 'maturity' // maturity, reverse-maturity
  })
  
  const [results, setResults] = useState(null)

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const calculateFD = () => {
    if (inputs.calculationType === 'maturity') {
      const P = parseFloat(inputs.principal) || 0
      const r = (parseFloat(inputs.interestRate) || 0) / 100
      const t = parseFloat(inputs.timePeriod) || 0
      const n = parseFloat(inputs.compoundingFrequency) || 1

      if (P > 0 && r > 0 && t > 0) {
        const maturityAmount = P * Math.pow((1 + r / n), n * t)
        const interestEarned = maturityAmount - P

        setResults({
          principal: P.toFixed(2),
          maturityAmount: maturityAmount.toFixed(2),
          interestEarned: interestEarned.toFixed(2),
          timePeriod: t
        })
      }
    } else if (inputs.calculationType === 'reverse-maturity') {
      const A = parseFloat(inputs.maturityAmount) || 0
      const r = (parseFloat(inputs.interestRate) || 0) / 100
      const t = parseFloat(inputs.timePeriod) || 0
      const n = parseFloat(inputs.compoundingFrequency) || 1

      if (A > 0 && r > 0 && t > 0) {
        const principal = A / Math.pow((1 + r / n), n * t)
        const interestEarned = A - principal

        setResults({
          principal: principal.toFixed(2),
          maturityAmount: A.toFixed(2),
          interestEarned: interestEarned.toFixed(2),
          timePeriod: t
        })
      }
    }
  }

  useEffect(() => {
    if (inputs.principal || inputs.maturityAmount) {
      calculateFD()
    }
  }, [inputs])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Fixed Deposit Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Calculator Inputs</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Calculation Type</label>
            <select 
              value={inputs.calculationType}
              onChange={(e) => handleInputChange('calculationType', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="maturity">Calculate Maturity Amount</option>
              <option value="reverse-maturity">Calculate Principal Required</option>
            </select>
          </div>

          {inputs.calculationType === 'maturity' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Principal Amount (₹)</label>
              <input
                type="number"
                value={inputs.principal}
                onChange={(e) => handleInputChange('principal', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., 100000"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Target Maturity Amount (₹)</label>
              <input
                type="number"
                value={inputs.maturityAmount}
                onChange={(e) => handleInputChange('maturityAmount', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., 150000"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Interest Rate (% per annum)</label>
            <input
              type="number"
              value={inputs.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., 7.5"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Time Period (Years)</label>
            <input
              type="number"
              value={inputs.timePeriod}
              onChange={(e) => handleInputChange('timePeriod', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., 5"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Compounding Frequency</label>
            <select 
              value={inputs.compoundingFrequency}
              onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="1">Annually</option>
              <option value="2">Semi-annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
            </select>
          </div>
        </div>

        {results && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Results</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Principal Amount:</span>
                <span className="font-semibold">₹{results.principal}</span>
              </div>
              <div className="flex justify-between">
                <span>Interest Earned:</span>
                <span className="font-semibold text-green-600">₹{results.interestEarned}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Period:</span>
                <span className="font-semibold">{results.timePeriod} years</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-2">
                <span>Maturity Amount:</span>
                <span className="font-bold text-blue-600">₹{results.maturityAmount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
