import React, { useState } from 'react'
import CalculationModeToggle from './CalculationModeToggle'

const ToggleDesignDemo = () => {
  const [minimalMode, setMinimalMode] = useState('monthly')
  const [microMode, setMicroMode] = useState('monthly')
  const [cardMode, setCardMode] = useState('monthly')
  const [switchMode, setSwitchMode] = useState('monthly')
  const [tabMode, setTabMode] = useState('monthly')
  const [originalMode, setOriginalMode] = useState('monthly')

  const variants = [
    {
      name: "Minimal Toggle",
      variant: "minimal",
      mode: minimalMode,
      setMode: setMinimalMode,
      description: "Simple, space-efficient toggle with icons and text"
    },
    {
      name: "Micro Toggle",
      variant: "micro",
      mode: microMode,
      setMode: setMicroMode,
      description: "Ultra-compact toggle, perfect for tight spaces"
    },
    {
      name: "Interactive Cards",
      variant: "cards",
      mode: cardMode,
      setMode: setCardMode,
      description: "Card-based design with gradient backgrounds and checkmarks"
    },
    {
      name: "Modern Switch",
      variant: "switch",
      mode: switchMode,
      setMode: setSwitchMode,
      description: "Horizontal switch with animated arrow indicator"
    },
    {
      name: "Tab Toggle",
      variant: "tabs",
      mode: tabMode,
      setMode: setTabMode,
      description: "Tab-style with sliding gradient background"
    },
    {
      name: "Original Vertical",
      variant: "original",
      mode: originalMode,
      setMode: setOriginalMode,
      description: "Original vertical design with sliding background"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Toggle Design Variants
          </h1>
          <p className="text-lg text-gray-600">
            Different design approaches for the calculation mode toggle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {variants.map((variant, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {variant.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {variant.description}
                </p>
              </div>
              
              <div className="flex justify-center">
                <CalculationModeToggle
                  calculationType={variant.mode}
                  onToggle={variant.setMode}
                  variant={variant.variant}
                />
              </div>
              
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Current: {variant.mode === 'monthly' ? 'Monthly Investment' : 'Target Maturity'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Usage in SIP Calculator
            </h3>
            <p className="text-gray-600 mb-6">
              Choose your preferred design variant by updating the <code className="bg-gray-100 px-2 py-1 rounded">variant</code> prop:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <code className="text-sm text-gray-800">
                {`<CalculationModeToggle
  calculationType={inputs.calculationType}
  onToggle={handleCalculationModeToggle}
  variant="minimal" // "minimal", "micro", "cards", "switch", "tabs", or default
/>`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToggleDesignDemo
