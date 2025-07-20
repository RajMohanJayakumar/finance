import React, { useState, useEffect } from 'react'
import CurrencySelector from './CurrencySelector'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handlePWAInstall = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.prompt()
      })
    } else {
      alert('PWA installation is supported on mobile devices and modern browsers')
    }
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-2xl shadow-xl border-b border-gray-200/50' 
        : 'bg-gradient-to-br from-indigo-50/80 via-white/90 to-emerald-50/80 backdrop-blur-xl shadow-lg'
    }`}>
      {/* Animated gradient bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-emerald-500 animate-pulse"></div>
      


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center py-4 sm:py-6">
          {/* Logo and Brand Section */}
          <div className="flex items-center space-x-4 group">
            {/* Animated Logo */}
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-110 hover:rotate-3 group-hover:animate-pulse">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm5-18v4h3V3h-3z"/>
                </svg>
              </div>


            </div>
            
            {/* Brand Text */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 transition-all duration-500 cursor-default">
                FinClamp
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-gray-600 font-semibold text-sm sm:text-base bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                  Smart Financial Planning
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Currency Selector */}
            <CurrencySelector />

            {/* Calculator Count */}
            <div className="hidden lg:flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
              <div className="text-center">
                <div className="text-xs text-gray-500 font-medium">Calculators</div>
                <div className="text-sm font-bold text-emerald-600">15+</div>
              </div>
            </div>

            {/* PWA Install Button */}
            <button
              onClick={handlePWAInstall}
              className="group relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center space-x-2">
                <span className="text-lg">📱</span>
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </div>
            </button>

            {/* Mobile menu indicator */}
            <div className="md:hidden flex flex-col space-y-1 cursor-pointer group">
              <div className="w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform group-hover:rotate-45 transition-transform duration-300"></div>
              <div className="w-4 h-0.5 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transform group-hover:opacity-0 transition-opacity duration-300"></div>
              <div className="w-6 h-0.5 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transform group-hover:-rotate-45 transition-transform duration-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
    </header>
  )
}
