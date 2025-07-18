
import React from 'react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 transform hover:scale-105 transition-transform duration-300">
                <span className="text-white text-2xl font-bold">💰</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Universal Finance Calculator
              </h1>
              <p className="text-gray-600 font-medium">Your complete financial planning suite • Trusted by thousands</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold border border-emerald-200 shadow-sm">
              ✨ All calculators free
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl text-sm font-semibold border border-blue-200 shadow-sm">
              📱 Install as PWA
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-xl text-sm font-semibold border border-purple-200 shadow-sm">
              🔒 Secure & Private
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
