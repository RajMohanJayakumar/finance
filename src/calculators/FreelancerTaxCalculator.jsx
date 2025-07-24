import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const FreelancerTaxCalculator = ({ categoryColor = 'indigo' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [income, setIncome] = useState({
    freelanceIncome: '',
    otherIncome: '',
    businessExpenses: '',
    professionalTax: ''
  })

  const [deductions, setDeductions] = useState({
    section80C: '',
    section80D: '',
    section80G: '',
    section80E: '',
    section80TTA: '',
    standardDeduction: '50000' // For FY 2023-24
  })

  const [taxRegime, setTaxRegime] = useState('new') // 'old' or 'new'

  const [results, setResults] = useState({
    grossIncome: 0,
    totalDeductions: 0,
    taxableIncome: 0,
    incomeTax: 0,
    cess: 0,
    totalTax: 0,
    netIncome: 0,
    effectiveTaxRate: 0,
    quarterlyTax: 0,
    taxBreakdown: {}
  })

  // Tax slabs for FY 2023-24
  const taxSlabs = {
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

  useEffect(() => {
    calculateTax()
  }, [income, deductions, taxRegime])

  const calculateTax = () => {
    const freelanceIncome = parseFloat(income.freelanceIncome) || 0
    const otherIncome = parseFloat(income.otherIncome) || 0
    const businessExpenses = parseFloat(income.businessExpenses) || 0
    const professionalTax = parseFloat(income.professionalTax) || 0

    // Calculate net freelance income after business expenses
    const netFreelanceIncome = Math.max(0, freelanceIncome - businessExpenses)
    const grossIncome = netFreelanceIncome + otherIncome

    // Calculate total deductions
    let totalDeductions = 0
    if (taxRegime === 'old') {
      totalDeductions = Object.values(deductions).reduce((sum, deduction) => {
        return sum + (parseFloat(deduction) || 0)
      }, 0)
    } else {
      // New regime has limited deductions
      totalDeductions = parseFloat(deductions.standardDeduction) || 0
    }

    // Calculate taxable income
    const taxableIncome = Math.max(0, grossIncome - totalDeductions)

    // Calculate income tax based on selected regime
    const { incomeTax, taxBreakdown } = calculateIncomeTax(taxableIncome, taxRegime)

    // Calculate cess (4% on income tax)
    const cess = incomeTax * 0.04

    // Total tax including professional tax
    const totalTax = incomeTax + cess + professionalTax

    // Net income after tax
    const netIncome = grossIncome - totalTax

    // Effective tax rate
    const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0

    // Quarterly advance tax (for freelancers)
    const quarterlyTax = incomeTax / 4

    setResults({
      grossIncome,
      totalDeductions,
      taxableIncome,
      incomeTax,
      cess,
      totalTax,
      netIncome,
      effectiveTaxRate,
      quarterlyTax,
      taxBreakdown
    })
  }

  const calculateIncomeTax = (taxableIncome, regime) => {
    const slabs = taxSlabs[regime]
    let tax = 0
    const breakdown = []

    for (const slab of slabs) {
      if (taxableIncome > slab.min) {
        const taxableInThisSlab = Math.min(taxableIncome, slab.max) - slab.min
        const taxInThisSlab = taxableInThisSlab * (slab.rate / 100)
        
        if (taxInThisSlab > 0) {
          tax += taxInThisSlab
          breakdown.push({
            range: `${formatCurrency(slab.min)} - ${slab.max === Infinity ? 'Above' : formatCurrency(slab.max)}`,
            rate: slab.rate,
            taxableAmount: taxableInThisSlab,
            tax: taxInThisSlab
          })
        }
      }
    }

    return { incomeTax: tax, taxBreakdown: breakdown }
  }

  const handleIncomeChange = (field, value) => {
    setIncome(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDeductionChange = (field, value) => {
    setDeductions(prev => ({
      ...prev,
      [field]: value
    }))
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
          <FileText className="w-8 h-8 text-indigo-600" />
          Freelancer Tax Estimator
        </h1>
        <p className="text-gray-600">Calculate income tax for freelancers and self-employed professionals</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Income & Deductions</h2>

          <div className="space-y-6">
            {/* Tax Regime Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tax Regime (FY 2023-24)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTaxRegime('old')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    taxRegime === 'old'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">Old Regime</div>
                  <div className="text-xs text-gray-500">With deductions</div>
                </button>
                <button
                  onClick={() => setTaxRegime('new')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    taxRegime === 'new'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">New Regime</div>
                  <div className="text-xs text-gray-500">Lower rates</div>
                </button>
              </div>
            </div>

            {/* Income Details */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Annual Income</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Freelance/Business Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={income.freelanceIncome}
                      onChange={(e) => handleIncomeChange('freelanceIncome', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="1200000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Expenses (Deductible)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={income.businessExpenses}
                      onChange={(e) => handleIncomeChange('businessExpenses', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="200000"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Equipment, software, office rent, internet, etc.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Income (Salary, Interest, etc.)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={income.otherIncome}
                      onChange={(e) => handleIncomeChange('otherIncome', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Tax (Annual)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={income.professionalTax}
                      onChange={(e) => handleIncomeChange('professionalTax', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="2500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Deductions (Only for Old Regime) */}
            {taxRegime === 'old' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Deductions</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section 80C (PPF, ELSS, etc.) - Max ₹1.5L
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={deductions.section80C}
                        onChange={(e) => handleDeductionChange('section80C', e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="150000"
                        max="150000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section 80D (Health Insurance) - Max ₹25K
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={deductions.section80D}
                        onChange={(e) => handleDeductionChange('section80D', e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="25000"
                        max="25000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section 80G (Donations)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={deductions.section80G}
                        onChange={(e) => handleDeductionChange('section80G', e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Standard Deduction
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {currentFormat.symbol}
                      </span>
                      <input
                        type="number"
                        value={deductions.standardDeduction}
                        onChange={(e) => handleDeductionChange('standardDeduction', e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {taxRegime === 'new' && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700">
                  <strong>New Tax Regime:</strong> Most deductions are not available, but tax rates are lower.
                  Only standard deduction of ₹50,000 is allowed.
                </div>
              </div>
            )}
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
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calculator className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Tax Calculation</h2>
          </div>

          <div className="space-y-6">
            {/* Tax Summary */}
            <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              <div className="text-center">
                <div className="text-sm text-indigo-700 mb-1">Total Annual Tax</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {formatCurrency(results.totalTax)}
                </div>
                <div className="text-sm text-indigo-500 mt-1">
                  Effective Rate: {results.effectiveTaxRate.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Income Breakdown */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Income Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Income:</span>
                  <span className="font-medium">{formatCurrency(results.grossIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Deductions:</span>
                  <span className="font-medium">-{formatCurrency(results.totalDeductions)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Taxable Income:</span>
                  <span className="font-bold">{formatCurrency(results.taxableIncome)}</span>
                </div>
              </div>
            </div>

            {/* Tax Breakdown */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Tax Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Income Tax:</span>
                  <span className="font-medium">{formatCurrency(results.incomeTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health & Education Cess (4%):</span>
                  <span className="font-medium">{formatCurrency(results.cess)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Professional Tax:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(income.professionalTax) || 0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total Tax:</span>
                  <span className="font-bold text-red-600">{formatCurrency(results.totalTax)}</span>
                </div>
              </div>
            </div>

            {/* Net Income */}
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-800">Net Income After Tax:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(results.netIncome)}
                </span>
              </div>
            </div>

            {/* Quarterly Advance Tax */}
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Advance Tax (Quarterly)</span>
              </div>
              <div className="text-sm text-yellow-700">
                <div>Quarterly payment: <strong>{formatCurrency(results.quarterlyTax)}</strong></div>
                <div className="text-xs mt-1">
                  Due dates: 15 Jun, 15 Sep, 15 Dec, 15 Mar
                </div>
              </div>
            </div>

            {/* Tax Slab Breakdown */}
            {results.taxBreakdown.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Tax Slab Breakdown</h3>
                <div className="space-y-2">
                  {results.taxBreakdown.map((slab, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex justify-between">
                        <span>{slab.range} ({slab.rate}%)</span>
                        <span className="font-medium">{formatCurrency(slab.tax)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Tax Saving Tips</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Keep detailed records of business expenses</div>
                <div>• Pay advance tax quarterly to avoid penalties</div>
                <div>• Consider investing in tax-saving instruments</div>
                <div>• Maintain separate business and personal accounts</div>
                <div>• Consult a CA for complex tax situations</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FreelancerTaxCalculator
