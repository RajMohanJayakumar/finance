
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function EMICalculator() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [inputs, setInputs] = useState({
    principal: '',
    interestRate: '',
    tenure: '',
    emi: '',
    calculationType: 'emi' // emi, reverse-emi
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

  const calculateEMI = () => {
    if (inputs.calculationType === 'emi') {
      const P = parseFloat(inputs.principal) || 0
      const r = (parseFloat(inputs.interestRate) || 0) / 100 / 12 // Monthly rate
      const n = (parseFloat(inputs.tenure) || 0) * 12 // Total months

      // EMI = P × R × (1+R)^N / [(1+R)^N – 1]
      const emi = r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n
      const totalAmount = emi * n
      const totalInterest = totalAmount - P

      setResults({
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        principal: P
      })
    }
  }

  const shareableLink = `${window.location.origin}${location.pathname}?${new URLSearchParams(inputs).toString()}`

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Loan Amount (₹)
              <span className="text-blue-600 cursor-help" title="Principal loan amount">ℹ️</span>
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={inputs.principal}
              onChange={(e) => handleInputChange('principal', e.target.value)}
              placeholder="e.g., 1000000"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Interest Rate (% per annum)
              <span className="text-blue-600 cursor-help" title="Annual interest rate">ℹ️</span>
            </label>
            <input
              type="number"
              step="0.1"
              className="w-full p-3 border rounded-lg"
              value={inputs.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              placeholder="e.g., 8.5"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Loan Tenure (Years)
              <span className="text-blue-600 cursor-help" title="Loan repayment period">ℹ️</span>
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={inputs.tenure}
              onChange={(e) => handleInputChange('tenure', e.target.value)}
              placeholder="e.g., 20"
            />
          </div>

          <button
            onClick={calculateEMI}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate EMI
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">EMI Breakdown</h2>
          
          {results ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-2xl font-bold text-green-600">₹{results.emi.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Principal Amount</p>
                <p className="text-xl font-semibold text-blue-600">₹{results.principal.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Interest</p>
                <p className="text-xl font-semibold text-red-600">₹{results.totalInterest.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Amount Payable</p>
                <p className="text-xl font-semibold text-purple-600">₹{results.totalAmount.toLocaleString()}</p>
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
            <p className="text-gray-500">Enter loan details and click Calculate to see EMI breakdown</p>
          )}
        </div>
      </div>
    </div>
  )
}
