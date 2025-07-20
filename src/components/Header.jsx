
import React from 'react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-1"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300">
                <span className="text-white text-xl font-bold">💰</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                FinClamp
              </h1>
              <p className="text-gray-600 font-medium text-sm sm:text-base">Your complete financial planning suite • Trusted by thousands</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  window.addEventListener('beforeinstallprompt', (e) => {
                    e.prompt()
                  })
                } else {
                  alert('PWA installation is supported on mobile devices and modern browsers')
                }
              }}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer"
            >
              📱 Install as PWA
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
