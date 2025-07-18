
import React from 'react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">💰</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Universal Finance Calculator
              </h1>
              <p className="text-sm text-gray-500">Your complete financial planning suite</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
              ✨ All calculators free
            </div>
            <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
              📱 Install as PWA
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
