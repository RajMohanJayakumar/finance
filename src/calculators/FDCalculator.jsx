
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function FDCalculator() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [inputs, setInputs] = useState({
    principal: '',
    interestRate: '',
    tenure: '',
    compoundingFrequency: '4' // Quarterly
  })
  
  const [results, setResults] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const newInputs = { ...inputs }
    
    Object.keys(inputs).forEach(key => {
      const value = urlParams.get(key)
      if (value) newInputs[key] = value
    })
    
    setInputs(newInputs)
  }, [location.search])

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

  const calculateFD = () => {
    const P = parseFloat(inputs.principal) || 0
    const r = (parseFloat(inputs.interestRate) || 0) / 100
    const t = parseFloat(inputs.tenure) || 0
    const n = parseFloat(inputs.compoundingFrequency) || 1

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = P * Math.pow(1 + r/n, n * t)
    const interestEarned = maturityAmount - P

    setResults({
      maturityAmount: Math.round(maturityAmount),
      interestEarned: Math.round(interestEarned),
      principal: P,
      effectiveRate: ((maturityAmount / P - 1) / t * 100).toFixed(2)
    })
  }

  const shareableLink = `${window.location.origin}${location.pathname}?${new URLSearchParams(inputs).toString()}`

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Fixed Deposit Details</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Principal Amount (₹)
              <span className="text-blue-600 cursor-help" title="Initial deposit amount">ℹ️</span>
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={inputs.principal}
              onChange={(e) => handleInputChange('principal', e.target.value)}
              placeholder="e.g., 100000"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Interest Rate (% per annum)
              <span className="text-blue-600 cursor-help" title="Annual interest rate offered">ℹ️</span>
            </label>
            <input
              type="number"
              step="0.1"
              className="w-full p-3 border rounded-lg"
              value={inputs.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              placeholder="e.g., 6.5"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Tenure (Years)
              <span className="text-blue-600 cursor-help" title="Fixed deposit period">ℹ️</span>
            </label>
            <input
              type="number"
              step="0.1"
              className="w-full p-3 border rounded-lg"
              value={inputs.tenure}
              onChange={(e) => handleInputChange('tenure', e.target.value)}
              placeholder="e.g., 5"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Compounding Frequency
              <span className="text-blue-600 cursor-help" title="How often interest is compounded">ℹ️</span>
            </label>
            <select
              className="w-full p-3 border rounded-lg"
              value={inputs.compoundingFrequency}
              onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
            >
              <option value="1">Annually</option>
              <option value="2">Semi-Annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
            </select>
          </div>

          <button
            onClick={calculateFD}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate Maturity
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Maturity Details</h2>
          
          {results ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Maturity Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{results.maturityAmount.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Principal Amount</p>
                <p className="text-xl font-semibold text-blue-600">₹{results.principal.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Interest Earned</p>
                <p className="text-xl font-semibold text-purple-600">₹{results.interestEarned.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Effective Annual Rate</p>
                <p className="text-xl font-semibold text-yellow-600">{results.effectiveRate}%</p>
              </div>

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
            <p className="text-gray-500">Enter FD details and click Calculate to see maturity amount</p>
          )}
        </div>
      </div>
    </div>
  )
}
