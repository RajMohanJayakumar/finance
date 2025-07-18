
import React, { useState, useEffect } from 'react'

export default function TaxCalculator({ onAddToComparison, categoryColor = 'red' }) {
  
  const initialInputs = {
    annualIncome: '',
    country: 'india',
    taxRegime: 'old'
  }

  const [inputs, setInputs] = useState(initialInputs)
  
  const [results, setResults] = useState(null)

  const taxSlabs = {
    india: {
      old: [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: Infinity, rate: 30 }
      ],
      new: [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 600000, rate: 5 },
        { min: 600000, max: 900000, rate: 10 },
        { min: 900000, max: 1200000, rate: 15 },
        { min: 1200000, max: 1500000, rate: 20 },
        { min: 1500000, max: Infinity, rate: 30 }
      ]
    }
  }

  const handleInputChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
  }

  const handleReset = () => {
    setInputs(initialInputs)
    setResults(null)
  }

  const calculateTax = () => {
    const income = parseFloat(inputs.annualIncome) || 0
    const slabs = taxSlabs[inputs.country][inputs.taxRegime]
    
    let totalTax = 0
    let taxBreakdown = []

    for (let slab of slabs) {
      if (income > slab.min) {
        const taxableInThisSlab = Math.min(income, slab.max) - slab.min
        const taxInThisSlab = (taxableInThisSlab * slab.rate) / 100
        totalTax += taxInThisSlab

        if (taxableInThisSlab > 0) {
          taxBreakdown.push({
            range: `₹${slab.min.toLocaleString()} - ${slab.max === Infinity ? '∞' : '₹' + slab.max.toLocaleString()}`,
            rate: slab.rate,
            taxableAmount: taxableInThisSlab,
            tax: taxInThisSlab
          })
        }
      }
    }

    // Add cess (4% on total tax for India)
    const cess = totalTax * 0.04
    const totalTaxWithCess = totalTax + cess
    const netIncome = income - totalTaxWithCess

    setResults({
      grossIncome: income,
      totalTax: Math.round(totalTax),
      cess: Math.round(cess),
      totalTaxWithCess: Math.round(totalTaxWithCess),
      netIncome: Math.round(netIncome),
      effectiveTaxRate: ((totalTaxWithCess / income) * 100).toFixed(2),
      taxBreakdown
    })
  }

  const shareableLink = `${window.location.origin}${location.pathname}?${new URLSearchParams(inputs).toString()}`

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Income Details</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Annual Gross Income (₹)
              <span className="text-blue-600 cursor-help" title="Your total annual income before tax">ℹ️</span>
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={inputs.annualIncome}
              onChange={(e) => handleInputChange('annualIncome', e.target.value)}
              placeholder="e.g., 1200000"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={inputs.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            >
              <option value="india">🇮🇳 India</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Tax Regime (India)</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={inputs.taxRegime}
              onChange={(e) => handleInputChange('taxRegime', e.target.value)}
            >
              <option value="old">Old Tax Regime</option>
              <option value="new">New Tax Regime</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:from-gray-600 hover:to-gray-700 cursor-pointer"
            >
              🔄 Reset
            </button>
            <button
              onClick={calculateTax}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Calculate Tax
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tax Calculation</h2>
          
          {results ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Gross Income</p>
                <p className="text-xl font-semibold text-green-600">₹{results.grossIncome.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Income Tax</p>
                <p className="text-xl font-semibold text-red-600">₹{results.totalTax.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Health & Education Cess (4%)</p>
                <p className="text-lg font-semibold text-orange-600">₹{results.cess.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-red-100 rounded-lg">
                <p className="text-sm text-gray-600">Total Tax</p>
                <p className="text-xl font-bold text-red-700">₹{results.totalTaxWithCess.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Net Income</p>
                <p className="text-xl font-bold text-blue-600">₹{results.netIncome.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Effective Tax Rate</p>
                <p className="text-lg font-semibold text-purple-600">{results.effectiveTaxRate}%</p>
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
                    className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Enter income details and click Calculate to see tax breakdown</p>
          )}
        </div>
      </div>
    </div>
  )
}
