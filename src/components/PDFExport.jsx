
import React from 'react'
import html2pdf from 'html2pdf.js'

export default function PDFExport({ data, title = "Financial Calculator Results", calculatorType = "General" }) {
  const exportToPDF = () => {
    const element = document.createElement('div')
    element.innerHTML = generatePDFContent()

    const opt = {
      margin: 0.5,
      filename: `${calculatorType.toLowerCase().replace(/\s+/g, '-')}-calculator-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(element).save()
  }

  const generatePDFContent = () => {
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    return `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: #ffffff;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 20px; box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
            <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 20px; backdrop-filter: blur(10px);">
              <span style="color: white; font-size: 24px; font-weight: bold;">💰</span>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              Universal Finance Calculator
            </h1>
          </div>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; margin-top: 20px; backdrop-filter: blur(10px);">
            <p style="margin: 0; font-size: 18px; font-weight: 600;">${title}</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Generated on ${currentDate} at ${currentTime}</p>
          </div>
        </div>

        <!-- Results -->
        <div style="margin-bottom: 40px;">
          ${data.map((item, index) => `
            <div style="margin-bottom: 30px; border: none; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); background: white;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; position: relative;">
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; transform: translate(30px, -30px);"></div>
                <h2 style="margin: 0; font-size: 24px; font-weight: 700; position: relative; z-index: 1;">${item.calculator}</h2>
                <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; position: relative; z-index: 1;">Calculated on ${new Date(item.timestamp).toLocaleString()}</p>
              </div>
              
              <div style="padding: 30px;">
                ${item.inputs ? `
                  <div style="margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700; color: #374151; display: flex; align-items: center;">
                      <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">📊</span>
                      Input Parameters
                    </h3>
                    <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 12px; padding: 20px; border-left: 4px solid #667eea;">
                      ${Object.entries(item.inputs).map(([key, value]) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid rgba(102, 126, 234, 0.1);">
                          <span style="color: #475569; font-weight: 600; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}:</span>
                          <span style="color: #1e293b; font-weight: 700; background: white; padding: 4px 12px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${value}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
                
                ${item.results ? `
                  <div>
                    <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700; color: #374151; display: flex; align-items: center;">
                      <span style="background: linear-gradient(135deg, #10b981, #059669); color: white; width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">💡</span>
                      Calculation Results
                    </h3>
                    <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 12px; padding: 20px; border-left: 4px solid #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);">
                      ${Object.entries(item.results).map(([key, value], resultIndex) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); ${resultIndex === 0 ? 'border: 2px solid #10b981;' : ''}">
                          <span style="color: #065f46; font-weight: 600; font-size: 16px;">${key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span style="color: #064e3b; font-weight: 800; font-size: 18px; ${resultIndex === 0 ? 'color: #10b981;' : ''}">${value}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer -->
        <div style="text-align: center; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 16px; padding: 25px; margin-top: 30px; border: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <span style="font-size: 24px; margin-right: 10px;">🌟</span>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #374151;">Generated by Universal Finance Calculator</p>
          </div>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Professional financial planning made simple • Trusted by thousands</p>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #d1d5db;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">This report is generated for informational purposes only. Please consult with a financial advisor for personalized advice.</p>
          </div>
        </div>
      </div>
    `
  }

  return (
    <button
      onClick={exportToPDF}
      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 border border-emerald-400 cursor-pointer"
    >
      <span className="text-lg">📄</span>
      <span>Export to PDF</span>
    </button>
  )
}
