
import React, { useState, useEffect } from 'react'

export default function CAGRCalculator({ onAddToComparison, categoryColor = 'purple' }) {
  
  const initialInputs = {
    beginningValue: '',
    endingValue: '',
    numberOfYears: '',
    calculationType: 'cagr'
  }

  const [inputs, setInputs] = useState(initialInputs)
  
  const [results, setResults] = useState(null)

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
  }

  const calculate = () => {
    const beginningValue = parseFloat(inputs.beginningValue) || 0
    const endingValue = parseFloat(inputs.endingValue) || 0
    const numberOfYears = parseFloat(inputs.numberOfYears) || 0

    if (inputs.calculationType === 'cagr') {
      // CAGR = (Ending Value / Beginning Value)^(1/n) – 1
      const cagr = Math.pow(endingValue / beginningValue, 1 / numberOfYears) - 1
      const totalReturns = endingValue - beginningValue
      const totalReturnPercentage = ((endingValue - beginningValue) / beginningValue) * 100

      setResults({
        cagr: (cagr * 100).toFixed(2),
        totalReturns: Math.round(totalReturns),
        totalReturnPercentage: totalReturnPercentage.toFixed(2),
        beginningValue,
        endingValue,
        numberOfYears
      })
    } else if (inputs.calculationType === 'roi') {
      // ROI = (Net Profit / Cost of Investment) × 100
      const roi = ((endingValue - beginningValue) / beginningValue) * 100
      const netProfit = endingValue - beginningValue

      setResults({
        roi: roi.toFixed(2),
        netProfit: Math.round(netProfit),
        investment: beginningValue,
        finalValue: endingValue
      })
    }
  }

  // Auto-calculate when inputs change
  useEffect(() => {
    if (inputs.beginningValue && inputs.endingValue && inputs.numberOfYears) {
      calculate()
    }
  }, [inputs.beginningValue, inputs.endingValue, inputs.numberOfYears, inputs.calculationType])

  const shareableLink = `${window.location.origin}${location.pathname}?${new URLSearchParams(inputs).toString()}`

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Calculation Type</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={inputs.calculationType}
              onChange={(e) => handleInputChange('calculationType', e.target.value)}
            >
              <option value="cagr">CAGR (Compound Annual Growth Rate)</option>
              <option value="roi">ROI (Return on Investment)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {inputs.calculationType === 'cagr' ? 'Beginning Value' : 'Initial Investment'} (₹)
              <span className="text-blue-600 cursor-help" title="Initial investment amount">ℹ️</span>
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={inputs.beginningValue}
              onChange={(e) => handleInputChange('beginningValue', e.target.value)}
              placeholder="e.g., 100000"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {inputs.calculationType === 'cagr' ? 'Ending Value' : 'Final Value'} (₹)
              <span className="text-blue-600 cursor-help" title="Final investment value">ℹ️</span>
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={inputs.endingValue}
              onChange={(e) => handleInputChange('endingValue', e.target.value)}
              placeholder="e.g., 200000"
            />
          </div>

          {inputs.calculationType === 'cagr' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Number of Years
                <span className="text-blue-600 cursor-help" title="Investment duration in years">ℹ️</span>
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full p-3 border rounded-lg"
                value={inputs.numberOfYears}
                onChange={(e) => handleInputChange('numberOfYears', e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:from-gray-600 hover:to-gray-700 cursor-pointer"
            >
              🔄 Reset
            </button>
            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Calculate {inputs.calculationType.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {inputs.calculationType === 'cagr' ? 'CAGR Analysis' : 'ROI Analysis'}
          </h2>
          
          {results ? (
            <div className="space-y-4">
              {inputs.calculationType === 'cagr' && (
                <>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">CAGR</p>
                    <p className="text-2xl font-bold text-green-600">{results.cagr}% per annum</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Beginning Value</p>
                    <p className="text-xl font-semibold text-blue-600">₹{results.beginningValue.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ending Value</p>
                    <p className="text-xl font-semibold text-purple-600">₹{results.endingValue.toLocaleString()}</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Returns</p>
                    <p className="text-xl font-semibold text-yellow-600">₹{results.totalReturns.toLocaleString()} ({results.totalReturnPercentage}%)</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Investment Period</p>
                    <p className="text-lg font-semibold text-gray-600">{results.numberOfYears} years</p>
                  </div>
                </>
              )}

              {inputs.calculationType === 'roi' && (
                <>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="text-2xl font-bold text-green-600">{results.roi}%</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Initial Investment</p>
                    <p className="text-xl font-semibold text-blue-600">₹{results.investment.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Final Value</p>
                    <p className="text-xl font-semibold text-purple-600">₹{results.finalValue.toLocaleString()}</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">Net Profit</p>
                    <p className="text-xl font-semibold text-yellow-600">₹{results.netProfit.toLocaleString()}</p>
                  </div>
                </>
              )}

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Share this calculation:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 p-2 text-xs border rounded"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(shareableLink)}
                    className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Enter investment details and click Calculate to see results</p>
          )}
        </div>
      </div>
    </div>
  )
}
