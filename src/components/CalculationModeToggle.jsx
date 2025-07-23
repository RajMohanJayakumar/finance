import React from 'react'
import { motion } from 'framer-motion'

const CalculationModeToggle = ({
  calculationType,
  onToggle,
  className = "",
  variant = "minimal" // "minimal", "cards", "switch", "tabs", "arrows"
}) => {
  const modes = [
    {
      value: 'monthly',
      label: 'Monthly Investment',
      shortLabel: 'Monthly SIP',
      icon: '💰',
      description: 'Calculate maturity from monthly SIP',
      color: 'from-blue-500 to-purple-600'
    },
    {
      value: 'maturity',
      label: 'Target Maturity',
      shortLabel: 'Target Goal',
      icon: '🎯',
      description: 'Calculate required SIP for target',
      color: 'from-green-500 to-teal-600'
    }
  ]

  // Design Variant 1: Minimal Toggle (Space-efficient)
  if (variant === "minimal") {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="relative bg-gray-100 rounded-full p-0.5 flex items-center">
          {/* Background slider */}
          <motion.div
            className="absolute bg-white rounded-full shadow-sm"
            style={{
              width: '50%',
              height: 'calc(100% - 4px)',
              top: '2px',
            }}
            animate={{
              x: calculationType === 'monthly' ? '2px' : 'calc(100% + 2px)'
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          />

          {/* Toggle buttons */}
          <motion.button
            type="button"
            onClick={() => onToggle('monthly')}
            className={`
              relative z-10 px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200
              ${calculationType === 'monthly'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
            whileTap={{ scale: 0.95 }}
          >
            💰 Monthly
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onToggle('maturity')}
            className={`
              relative z-10 px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200
              ${calculationType === 'maturity'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
            whileTap={{ scale: 0.95 }}
          >
            🎯 Target
          </motion.button>
        </div>
      </div>
    )
  }

  // Design Variant 2: Micro Toggle (Ultra-compact)
  if (variant === "micro") {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="relative bg-gray-200 rounded-full p-0.5 flex items-center w-16 h-7">
          {/* Background slider */}
          <motion.div
            className="absolute bg-white rounded-full shadow-sm w-6 h-6"
            animate={{
              x: calculationType === 'monthly' ? '2px' : '8px'
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          />

          {/* Invisible buttons for click areas */}
          <button
            type="button"
            onClick={() => onToggle('monthly')}
            className="absolute left-0 w-8 h-full z-10 rounded-l-full"
            title="Monthly Investment"
          />
          <button
            type="button"
            onClick={() => onToggle('maturity')}
            className="absolute right-0 w-8 h-full z-10 rounded-r-full"
            title="Target Maturity"
          />

          {/* Visual indicators */}
          <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
            <span className={`text-xs transition-opacity ${calculationType === 'monthly' ? 'opacity-0' : 'opacity-60'}`}>
              💰
            </span>
            <span className={`text-xs transition-opacity ${calculationType === 'maturity' ? 'opacity-0' : 'opacity-60'}`}>
              🎯
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Design Variant 3: Interactive Cards
  if (variant === "cards") {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {modes.map((mode) => (
            <motion.button
              key={mode.value}
              type="button"
              onClick={() => onToggle(mode.value)}
              className={`
                relative p-4 rounded-2xl border-2 transition-all duration-300
                ${calculationType === mode.value
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-lg
                  ${calculationType === mode.value
                    ? `bg-gradient-to-r ${mode.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {mode.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-semibold text-sm ${
                    calculationType === mode.value ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {mode.shortLabel}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {mode.description}
                  </div>
                </div>
                {calculationType === mode.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // Design Variant 4: Modern Switch with Arrow
  if (variant === "switch") {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-2 shadow-inner">
          <div className="flex items-center gap-4">
            {/* Left Mode */}
            <motion.button
              type="button"
              onClick={() => onToggle('monthly')}
              className={`
                px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 min-w-[120px]
                ${calculationType === 'monthly'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">💰</span>
                <span>Monthly SIP</span>
              </div>
            </motion.button>

            {/* Arrow Indicator */}
            <motion.div
              className="flex items-center justify-center"
              animate={{
                rotateY: calculationType === 'monthly' ? 0 : 180
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>

            {/* Right Mode */}
            <motion.button
              type="button"
              onClick={() => onToggle('maturity')}
              className={`
                px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 min-w-[120px]
                ${calculationType === 'maturity'
                  ? 'bg-white text-green-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">🎯</span>
                <span>Target Goal</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 max-w-[250px] leading-relaxed">
            {modes.find(mode => mode.value === calculationType)?.description}
          </p>
        </div>
      </div>
    )
  }

  // Design Variant 5: Tab-style Toggle
  if (variant === "tabs") {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-1 shadow-sm">
          {/* Background slider */}
          <motion.div
            className="absolute bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md"
            style={{
              width: 'calc(50% - 4px)',
              height: 'calc(100% - 8px)',
              top: '4px',
            }}
            animate={{
              x: calculationType === 'monthly' ? '4px' : 'calc(100% + 4px)'
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
          />

          <div className="relative z-10 flex">
            {modes.map((mode) => (
              <motion.button
                key={mode.value}
                type="button"
                onClick={() => onToggle(mode.value)}
                className={`
                  px-8 py-4 font-medium text-sm transition-colors duration-200 rounded-xl min-w-[140px]
                  ${calculationType === mode.value
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xl">{mode.icon}</span>
                  <span className="font-semibold">{mode.shortLabel}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 max-w-[280px] leading-relaxed">
            {modes.find(mode => mode.value === calculationType)?.description}
          </p>
        </div>
      </div>
    )
  }

  // Default: Original vertical design (fallback)
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative bg-gray-100 rounded-2xl p-1 flex flex-col w-48">
        {/* Background slider */}
        <motion.div
          className="absolute bg-white rounded-xl shadow-md"
          style={{
            width: 'calc(100% - 8px)',
            height: 'calc(50% - 4px)',
            left: '4px',
          }}
          animate={{
            y: calculationType === 'monthly' ? '4px' : 'calc(100% + 4px)'
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        />

        {/* Toggle buttons */}
        {modes.map((mode) => (
          <motion.button
            key={mode.value}
            type="button"
            onClick={() => onToggle(mode.value)}
            className={`
              relative z-10 px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200
              flex flex-col items-center gap-1 min-h-[60px]
              ${calculationType === mode.value
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">{mode.icon}</span>
            <span className="text-xs font-semibold leading-tight text-center">
              {mode.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Description */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500 max-w-[180px] leading-relaxed">
          {modes.find(mode => mode.value === calculationType)?.description}
        </p>
      </div>
    </div>
  )
}

export default CalculationModeToggle
