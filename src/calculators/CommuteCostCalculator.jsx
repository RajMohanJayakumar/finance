import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Car, Bus, Train, Calculator } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

const CommuteCostCalculator = ({ categoryColor = 'blue' }) => {
  const { formatCurrency, currentFormat } = useCurrency()
  
  const [commuteDetails, setCommuteDetails] = useState({
    distance: '',
    workingDays: '22',
    transportMode: 'car'
  })

  const [transportCosts, setTransportCosts] = useState({
    // Car costs
    fuelPrice: '100',
    mileage: '15',
    parking: '100',
    toll: '50',
    maintenance: '2000',
    
    // Public transport
    busPass: '1500',
    metroPass: '2000',
    autoRickshaw: '25',
    
    // Mixed transport
    mixedDaily: '150'
  })

  const [results, setResults] = useState({
    dailyCost: 0,
    weeklyCost: 0,
    monthlyCost: 0,
    yearlyCost: 0,
    costPerKm: 0,
    comparison: {},
    savings: {}
  })

  const transportModes = {
    car: { label: 'Personal Car', icon: Car, color: 'blue' },
    bike: { label: 'Personal Bike', icon: Car, color: 'green' },
    bus: { label: 'Public Bus', icon: Bus, color: 'yellow' },
    metro: { label: 'Metro/Subway', icon: Train, color: 'purple' },
    auto: { label: 'Auto Rickshaw', icon: Car, color: 'orange' },
    mixed: { label: 'Mixed Transport', icon: MapPin, color: 'gray' }
  }

  useEffect(() => {
    calculateCommuteCost()
  }, [commuteDetails, transportCosts])

  const calculateCommuteCost = () => {
    const distance = parseFloat(commuteDetails.distance) || 0
    const workingDays = parseInt(commuteDetails.workingDays) || 22
    const roundTripDistance = distance * 2 // Daily round trip

    let dailyCost = 0
    let costPerKm = 0

    switch (commuteDetails.transportMode) {
      case 'car':
        const fuelCostPerKm = parseFloat(transportCosts.fuelPrice) / parseFloat(transportCosts.mileage)
        const fuelCost = roundTripDistance * fuelCostPerKm
        const parking = parseFloat(transportCosts.parking) || 0
        const toll = parseFloat(transportCosts.toll) || 0
        const maintenanceDaily = (parseFloat(transportCosts.maintenance) || 0) / 30
        dailyCost = fuelCost + parking + toll + maintenanceDaily
        costPerKm = dailyCost / roundTripDistance
        break

      case 'bike':
        const bikeFuelCostPerKm = parseFloat(transportCosts.fuelPrice) / 45 // Assuming 45 km/l for bike
        const bikeFuelCost = roundTripDistance * bikeFuelCostPerKm
        const bikeParking = (parseFloat(transportCosts.parking) || 0) * 0.3 // Bike parking is cheaper
        const bikeMaintenance = (parseFloat(transportCosts.maintenance) || 0) * 0.4 / 30 // Bike maintenance is cheaper
        dailyCost = bikeFuelCost + bikeParking + bikeMaintenance
        costPerKm = dailyCost / roundTripDistance
        break

      case 'bus':
        const busPass = parseFloat(transportCosts.busPass) || 0
        dailyCost = busPass / workingDays
        costPerKm = dailyCost / roundTripDistance
        break

      case 'metro':
        const metroPass = parseFloat(transportCosts.metroPass) || 0
        dailyCost = metroPass / workingDays
        costPerKm = dailyCost / roundTripDistance
        break

      case 'auto':
        const autoRate = parseFloat(transportCosts.autoRickshaw) || 0
        dailyCost = roundTripDistance * autoRate
        costPerKm = autoRate
        break

      case 'mixed':
        dailyCost = parseFloat(transportCosts.mixedDaily) || 0
        costPerKm = dailyCost / roundTripDistance
        break

      default:
        dailyCost = 0
        costPerKm = 0
    }

    const weeklyCost = dailyCost * 5 // 5 working days
    const monthlyCost = dailyCost * workingDays
    const yearlyCost = monthlyCost * 12

    // Calculate comparison with other modes
    const comparison = calculateComparison(distance, workingDays)
    
    // Calculate potential savings
    const savings = calculateSavings(dailyCost, comparison)

    setResults({
      dailyCost,
      weeklyCost,
      monthlyCost,
      yearlyCost,
      costPerKm,
      comparison,
      savings
    })
  }

  const calculateComparison = (distance, workingDays) => {
    const roundTripDistance = distance * 2
    const comparison = {}

    // Car calculation
    const carFuelCostPerKm = parseFloat(transportCosts.fuelPrice) / parseFloat(transportCosts.mileage)
    const carDailyCost = (roundTripDistance * carFuelCostPerKm) + 
                        (parseFloat(transportCosts.parking) || 0) + 
                        (parseFloat(transportCosts.toll) || 0) + 
                        ((parseFloat(transportCosts.maintenance) || 0) / 30)
    comparison.car = carDailyCost * workingDays

    // Bike calculation
    const bikeFuelCostPerKm = parseFloat(transportCosts.fuelPrice) / 45
    const bikeDailyCost = (roundTripDistance * bikeFuelCostPerKm) + 
                         ((parseFloat(transportCosts.parking) || 0) * 0.3) + 
                         ((parseFloat(transportCosts.maintenance) || 0) * 0.4 / 30)
    comparison.bike = bikeDailyCost * workingDays

    // Public transport
    comparison.bus = parseFloat(transportCosts.busPass) || 0
    comparison.metro = parseFloat(transportCosts.metroPass) || 0
    comparison.auto = (roundTripDistance * (parseFloat(transportCosts.autoRickshaw) || 0)) * workingDays
    comparison.mixed = (parseFloat(transportCosts.mixedDaily) || 0) * workingDays

    return comparison
  }

  const calculateSavings = (currentDailyCost, comparison) => {
    const currentMonthlyCost = currentDailyCost * parseInt(commuteDetails.workingDays)
    const savings = {}

    Object.entries(comparison).forEach(([mode, cost]) => {
      if (mode !== commuteDetails.transportMode) {
        const monthlySaving = currentMonthlyCost - cost
        const yearlySaving = monthlySaving * 12
        savings[mode] = {
          monthly: monthlySaving,
          yearly: yearlySaving,
          percentage: currentMonthlyCost > 0 ? (monthlySaving / currentMonthlyCost) * 100 : 0
        }
      }
    })

    return savings
  }

  const handleCommuteChange = (field, value) => {
    setCommuteDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCostChange = (field, value) => {
    setTransportCosts(prev => ({
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
          <MapPin className="w-8 h-8 text-blue-600" />
          Commute Cost Calculator
        </h1>
        <p className="text-gray-600">Calculate daily/weekly fuel or public transport costs for your commute</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Commute Details */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Commute Details</h2>
          
          <div className="space-y-4">
            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                One-way Distance (km)
              </label>
              <input
                type="number"
                value={commuteDetails.distance}
                onChange={(e) => handleCommuteChange('distance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25"
              />
            </div>

            {/* Working Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Days per Month
              </label>
              <input
                type="number"
                value={commuteDetails.workingDays}
                onChange={(e) => handleCommuteChange('workingDays', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="22"
              />
            </div>

            {/* Transport Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Transport Mode
              </label>
              <select
                value={commuteDetails.transportMode}
                onChange={(e) => handleCommuteChange('transportMode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(transportModes).map(([key, mode]) => (
                  <option key={key} value={key}>{mode.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Transport Costs */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Parameters</h2>
          
          <div className="space-y-4">
            {/* Car/Bike Costs */}
            {(commuteDetails.transportMode === 'car' || commuteDetails.transportMode === 'bike') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Price per Liter
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={transportCosts.fuelPrice}
                      onChange={(e) => handleCostChange('fuelPrice', e.target.value)}
                      className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                {commuteDetails.transportMode === 'car' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mileage (km/L)
                    </label>
                    <input
                      type="number"
                      value={transportCosts.mileage}
                      onChange={(e) => handleCostChange('mileage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Parking
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={transportCosts.parking}
                      onChange={(e) => handleCostChange('parking', e.target.value)}
                      className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Maintenance
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {currentFormat.symbol}
                    </span>
                    <input
                      type="number"
                      value={transportCosts.maintenance}
                      onChange={(e) => handleCostChange('maintenance', e.target.value)}
                      className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Public Transport Costs */}
            {commuteDetails.transportMode === 'bus' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Bus Pass
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currentFormat.symbol}
                  </span>
                  <input
                    type="number"
                    value={transportCosts.busPass}
                    onChange={(e) => handleCostChange('busPass', e.target.value)}
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            )}

            {commuteDetails.transportMode === 'metro' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Metro Pass
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currentFormat.symbol}
                  </span>
                  <input
                    type="number"
                    value={transportCosts.metroPass}
                    onChange={(e) => handleCostChange('metroPass', e.target.value)}
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            )}

            {commuteDetails.transportMode === 'auto' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate per KM
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currentFormat.symbol}
                  </span>
                  <input
                    type="number"
                    value={transportCosts.autoRickshaw}
                    onChange={(e) => handleCostChange('autoRickshaw', e.target.value)}
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            )}

            {commuteDetails.transportMode === 'mixed' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Mixed Transport Cost
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currentFormat.symbol}
                  </span>
                  <input
                    type="number"
                    value={transportCosts.mixedDaily}
                    onChange={(e) => handleCostChange('mixedDaily', e.target.value)}
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calculator className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Cost Breakdown</h2>
          </div>

          <div className="space-y-4">
            {/* Cost Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Cost:</span>
                <span className="font-bold">{formatCurrency(results.dailyCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Cost:</span>
                <span className="font-medium">{formatCurrency(results.weeklyCost)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Monthly Cost:</span>
                <span className="font-bold text-blue-600">{formatCurrency(results.monthlyCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Yearly Cost:</span>
                <span className="font-medium">{formatCurrency(results.yearlyCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost per KM:</span>
                <span className="font-medium">{formatCurrency(results.costPerKm)}</span>
              </div>
            </div>

            {/* Mode Comparison */}
            {Object.keys(results.comparison).length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">Monthly Cost Comparison</h3>
                <div className="space-y-1">
                  {Object.entries(results.comparison).map(([mode, cost]) => {
                    const modeInfo = transportModes[mode]
                    const isCurrent = mode === commuteDetails.transportMode
                    return (
                      <div key={mode} className={`flex justify-between text-sm p-2 rounded ${
                        isCurrent ? 'bg-blue-100 font-medium' : 'bg-gray-50'
                      }`}>
                        <span>{modeInfo.label} {isCurrent ? '(Current)' : ''}</span>
                        <span>{formatCurrency(cost)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Savings Opportunities */}
            {Object.keys(results.savings).length > 0 && (
              <div className="mt-6 p-3 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">💰 Potential Savings</h3>
                <div className="text-sm text-green-700 space-y-1">
                  {Object.entries(results.savings).map(([mode, saving]) => {
                    if (saving.monthly > 0) {
                      const modeInfo = transportModes[mode]
                      return (
                        <div key={mode}>
                          Switch to {modeInfo.label}: Save {formatCurrency(saving.monthly)}/month
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Cost Saving Tips</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>• Consider carpooling to split costs</div>
                <div>• Use public transport for longer distances</div>
                <div>• Combine trips to reduce frequency</div>
                <div>• Work from home when possible</div>
                <div>• Maintain your vehicle for better mileage</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CommuteCostCalculator
