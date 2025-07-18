
import React from 'react'
import PDFExport from './PDFExport'

export default function ComparisonPanel({ data, onRemove, onClose }) {
  if (!data || data.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <span>📊</span>
                <span>Calculator Comparison</span>
              </h2>
              <p className="text-white/90 mt-1">Compare your financial calculations side by side</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">No calculations to compare yet</h3>
              <p className="text-gray-500">Add calculations from any calculator to compare them here.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-2xl p-6 relative">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                  
                  <h3 className="font-bold text-lg mb-4 text-gray-800">
                    {item.calculator}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500">
                      Added: {new Date(item.timestamp).toLocaleString()}
                    </div>
                    
                    {item.inputs && (
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-gray-700">Inputs:</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(item.inputs).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {item.results && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-gray-700">Results:</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(item.results).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="font-bold text-purple-700">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {data.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-center">
              <PDFExport data={data} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
