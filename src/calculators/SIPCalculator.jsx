import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function SIPCalculator() {
  const location = useLocation()
  const navigate = useNavigate()

  const [inputs, setInputs] = useState({
    monthlyInvestment: '',
    annualReturn: '',
    timePeriod: '',
    futureValue: '',
    calculationType: 'sip' // sip, reverse-sip
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

  const calculateSIP = () => {
    if (inputs.calculationType === 'sip') {
      const P = parseFloat(inputs.monthlyInvestment) || 0
      const r = (parseFloat(inputs.annualReturn) || 0) / 100 / 12 // Monthly rate
      const n = (parseFloat(inputs.timePeriod) || 0) * 12 // Total months

      if (P > 0 && r > 0 && n > 0) {
        const futureValue = P * (((1 + r) ** n - 1) / r) * (1 + r)
        const totalInvested = P * n
        const totalGains = futureValue - totalInvested

        setResults({
          futureValue: futureValue.toFixed(2),
          totalInvested: totalInvested.toFixed(2),
          totalGains: totalGains.toFixed(2),
          monthlyInvestment: P.toFixed(2)
        })
      }
    } else if (inputs.calculationType === 'reverse-sip') {
      const FV = parseFloat(inputs.futureValue) || 0
      const r = (parseFloat(inputs.annualReturn) || 0) / 100 / 12 // Monthly rate
      const n = (parseFloat(inputs.timePeriod) || 0) * 12 // Total months

      if (FV > 0 && r > 0 && n > 0) {
        const monthlyInvestment = FV / (((1 + r) ** n - 1) / r * (1 + r))
        const totalInvested = monthlyInvestment * n
        const totalGains = FV - totalInvested

        setResults({
          futureValue: FV.toFixed(2),
          totalInvested: totalInvested.toFixed(2),
          totalGains: totalGains.toFixed(2),
          monthlyInvestment: monthlyInvestment.toFixed(2)
        })
      }
    }
  }

  useEffect(() => {
    if (inputs.monthlyInvestment || inputs.futureValue) {
      calculateSIP()
    }
  }, [inputs])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">SIP Calculator</h2>

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
              <option value="sip">Calculate Future Value</option>
              <option value="reverse-sip">Calculate Monthly Investment</option>
            </select>
          </div>

          {inputs.calculationType === 'sip' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Monthly Investment (₹)</label>
              <input
                type="number"
                value={inputs.monthlyInvestment}
                onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., 5000"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Target Future Value (₹)</label>
              <input
                type="number"
                value={inputs.futureValue}
                onChange={(e) => handleInputChange('futureValue', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., 1000000"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Expected Annual Return (%)</label>
            <input
              type="number"
              value={inputs.annualReturn}
              onChange={(e) => handleInputChange('annualReturn', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., 12"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Time Period (Years)</label>
            <input
              type="number"
              value={inputs.timePeriod}
              onChange={(e) => handleInputChange('timePeriod', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., 10"
            />
          </div>
        </div>

        {results && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Results</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Monthly Investment:</span>
                <span className="font-semibold">₹{results.monthlyInvestment}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Investment:</span>
                <span className="font-semibold">₹{results.totalInvested}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Gains:</span>
                <span className="font-semibold text-green-600">₹{results.totalGains}</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-2">
                <span>Future Value:</span>
                <span className="font-bold text-blue-600">₹{results.futureValue}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}