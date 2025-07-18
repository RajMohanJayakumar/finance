
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function SIPCalculator() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [inputs, setInputs] = useState({
    monthlyAmount: '',
    expectedReturn: '',
    timePeriod: '',
    targetAmount: '',
    calculationType: 'sip' // sip, reverse-sip, swp
  })
  
  const [results, setResults] = useState(null)

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const newInputs = { ...inputs }
    
    Object.keys(inputs).forEach(key => {
      const value = urlParams.get(key)
      if (value) newInputs[key] = value
    })
    
    setInputs(newInputs)
  }, [location.search])

  // Update URL when inputs change
  const updateURL = (newInputs) => {
    const params = new URLSearchParams()
    Object.entries(newInputs).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    
    const newURL = `${location.pathname}?${params.toString()}`
    navigate(newURL, { replace: true })
  }

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
    updateURL(newInputs)
  }

  const calculateSIP = () => {
    const P = parseFloat(inputs.monthlyAmount) || 0
    const r = (parseFloat(inputs.expectedReturn) || 0) / 100 / 12 // Monthly rate
    const n = (parseFloat(inputs.timePeriod) || 0) * 12 // Total months

    if (inputs.calculationType === 'sip') {
      // Standard SIP: Future Value = P × [(1 + r)^n – 1] × (1 + r) / r
      const futureValue = r > 0 ? P * (((Math.pow(1 + r, n) - 1) * (1 + r)) / r) : P * n
      const totalInvestment = P * n
      const gains = futureValue - totalInvestment

      setResults({
        futureValue: Math.round(futureValue),
        totalInvestment: Math.round(totalInvestment),
        gains: Math.round(gains),
        returnPercentage: ((gains / totalInvestment) * 100).toFixed(2)
      })
    } else if (inputs.calculationType === 'reverse-sip') {
      // Reverse SIP: Given target amount, find monthly investment
      const targetAmount = parseFloat(inputs.targetAmount) || 0
      const requiredMonthly = r > 0 ? (targetAmount * r) / (((Math.pow(1 + r, n) - 1) * (1 + r))) : targetAmount / n
      
      setResults({
        requiredMonthly: Math.round(requiredMonthly),
        targetAmount: targetAmount,
        totalInvestment: Math.round(requiredMonthly * n),
        gains: Math.round(targetAmount - (requiredMonthly * n))
      })
    }
  }

  const shareableLink = `${window.location.origin}${location.pathname}?${new URLSearchParams(inputs).toString()}`

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Calculator Inputs</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Calculation Type</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={inputs.calculationType}
              onChange={(e) => handleInputChange('calculationType', e.target.value)}
            >
              <option value="sip">Standard SIP</option>
              <option value="reverse-sip">Reverse SIP (Find Monthly Amount)</option>
            </select>
          </div>

          {inputs.calculationType === 'sip' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Monthly Investment Amount (₹)
                <span className="text-blue-600 cursor-help" title="Amount you plan to invest every month">ℹ️</span>
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg"
                value={inputs.monthlyAmount}
                onChange={(e) => handleInputChange('monthlyAmount', e.target.value)}
                placeholder="e.g., 5000"
              />
            </div>
          )}

          {inputs.calculationType === 'reverse-sip' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Target Amount (₹)
                <span className="text-blue-600 cursor-help" title="Target corpus you want to achieve">ℹ️</span>
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg"
                value={inputs.targetAmount}
                onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                placeholder="e.g., 1000000"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Expected Annual Return (%)
              <span className="text-blue-600 cursor-help" title="Expected annual return from your mutual fund">ℹ️</span>
            </label>
            <input
              type="number"
              step="0.1"
              className="w-full p-3 border rounded-lg"
              value={inputs.expectedReturn}
              onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
              placeholder="e.g., 12"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Investment Period (Years)
              <span className="text-blue-600 cursor-help" title="How long you plan to invest">ℹ️</span>
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={inputs.timePeriod}
              onChange={(e) => handleInputChange('timePeriod', e.target.value)}
              placeholder="e.g., 10"
            />
          </div>

          <button
            onClick={calculateSIP}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          
          {results ? (
            <div className="space-y-4">
              {inputs.calculationType === 'sip' && (
                <>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Maturity Amount</p>
                    <p className="text-2xl font-bold text-green-600">₹{results.futureValue.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Investment</p>
                    <p className="text-xl font-semibold text-blue-600">₹{results.totalInvestment.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Gains</p>
                    <p className="text-xl font-semibold text-purple-600">₹{results.gains.toLocaleString()}</p>
                  </div>
                </>
              )}

              {inputs.calculationType === 'reverse-sip' && (
                <>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Required Monthly Investment</p>
                    <p className="text-2xl font-bold text-green-600">₹{results.requiredMonthly.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Target Amount</p>
                    <p className="text-xl font-semibold text-blue-600">₹{results.targetAmount.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Investment</p>
                    <p className="text-xl font-semibold text-purple-600">₹{results.totalInvestment.toLocaleString()}</p>
                  </div>
                </>
              )}

              {/* Share Section */}
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
                    className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Enter your details and click Calculate to see results</p>
          )}
        </div>
      </div>
    </div>
  )
}
