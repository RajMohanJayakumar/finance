
import React from 'react'
import html2pdf from 'html2pdf.js'

export default function PDFExport({ data, title = "Financial Calculator Results", calculatorType = "General" }) {
  const exportToPDF = () => {
    const element = document.createElement('div')
    element.innerHTML = generatePDFContent()

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `financial-calculator-report-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    html2pdf().set(opt).from(element).save()
  }

  const generatePDFContent = () => {
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    return `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; background: #ffffff; line-height: 1.6; color: #1a202c;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 50px; background: #6366F1; color: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.25); page-break-inside: avoid;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;">
            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 25px; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2);">
              <span style="color: white; font-size: 28px; font-weight: bold;">💰</span>
            </div>
            <h1 style="margin: 0; font-size: 36px; font-weight: 900; text-shadow: 0 4px 8px rgba(0,0,0,0.15); letter-spacing: -0.5px;">
              finclamp.com
            </h1>
          </div>
          <div style="background: rgba(255,255,255,0.12); border-radius: 16px; padding: 20px; margin-top: 25px; backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.2);">
            <p style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">${title}</p>
            <p style="margin: 12px 0 0 0; font-size: 15px; opacity: 0.9; font-weight: 500;">Generated on ${currentDate} at ${currentTime}</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
              <p style="margin: 0; font-size: 13px; opacity: 0.8; font-style: italic;">Professional Financial Analysis Report</p>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div style="margin-bottom: 50px;">
          ${data.map((item, index) => `
            <div style="margin-bottom: 40px; border: none; border-radius: 24px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.08); background: white; page-break-inside: avoid; ${index > 0 ? 'page-break-before: auto;' : ''}">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 120px; height: 120px; background: rgba(255,255,255,0.08); border-radius: 50%; transform: rotate(45deg);"></div>
                <div style="position: absolute; bottom: -30px; left: -30px; width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
                <h2 style="margin: 0; font-size: 26px; font-weight: 800; position: relative; z-index: 2; letter-spacing: -0.3px;">${item.calculator}</h2>
                <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 15px; position: relative; z-index: 2; font-weight: 500;">Calculated on ${new Date(item.timestamp).toLocaleDateString()} at ${new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              
              <div style="padding: 35px;">
                ${item.inputs ? `
                  <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 18px 0; font-size: 22px; font-weight: 800; color: #2d3748; display: flex; align-items: center; letter-spacing: -0.2px;">
                      <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">📊</span>
                      Input Parameters
                    </h3>
                    <div style="background: linear-gradient(135deg, #f7fafc, #edf2f7); border-radius: 16px; padding: 25px; border-left: 5px solid #667eea; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                      ${Object.entries(item.inputs).map(([key, value], inputIndex) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${inputIndex === Object.entries(item.inputs).length - 1 ? '0' : '15px'}; padding: 12px 0; ${inputIndex !== Object.entries(item.inputs).length - 1 ? 'border-bottom: 1px solid rgba(102, 126, 234, 0.12);' : ''}">
                          <span style="color: #4a5568; font-weight: 600; text-transform: capitalize; font-size: 15px;">${key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}:</span>
                          <span style="color: #1a202c; font-weight: 800; background: white; padding: 8px 16px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.08); font-size: 15px; border: 1px solid #e2e8f0;">${value}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
                
                ${item.results ? `
                  <div>
                    <h3 style="margin: 0 0 18px 0; font-size: 22px; font-weight: 800; color: #2d3748; display: flex; align-items: center; letter-spacing: -0.2px;">
                      <span style="background: linear-gradient(135deg, #10b981, #059669); color: white; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">💡</span>
                      Calculation Results
                    </h3>
                    <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 16px; padding: 25px; border-left: 5px solid #10b981; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.12);">
                      ${Object.entries(item.results).map(([key, value], resultIndex) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${resultIndex === Object.entries(item.results).length - 1 ? '0' : '18px'}; padding: 16px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); ${resultIndex === 0 ? 'border: 2px solid #10b981; background: linear-gradient(135deg, #f0fdf4, #ffffff);' : 'border: 1px solid #e5e7eb;'}">
                          <span style="color: #065f46; font-weight: 700; font-size: 16px; ${resultIndex === 0 ? 'color: #059669;' : ''}">${key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span style="color: #064e3b; font-weight: 900; font-size: 18px; ${resultIndex === 0 ? 'color: #10b981; font-size: 20px;' : ''}">${value}</span>
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
        <div style="text-align: center; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 20px; padding: 35px; margin-top: 40px; border: 2px solid #e2e8f0; page-break-inside: avoid;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px; flex-wrap: wrap;">
            <span style="font-size: 28px; margin-right: 15px;">🌟</span>
            <p style="margin: 0; font-size: 18px; font-weight: 700; color: #2d3748; letter-spacing: -0.2px;">Generated by finclamp.com</p>
          </div>
          <p style="margin: 0; font-size: 15px; color: #4a5568; font-weight: 500; margin-bottom: 20px;">Professional financial planning made simple • Trusted by thousands</p>

          <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 20px; margin-bottom: 5px;">📊</div>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600;">ACCURATE</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 20px; margin-bottom: 5px;">🔒</div>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600;">SECURE</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 20px; margin-bottom: 5px;">⚡</div>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600;">INSTANT</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 20px; margin-bottom: 5px;">💎</div>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600;">PREMIUM</div>
              </div>
            </div>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #d1d5db;">
            <p style="margin: 0; font-size: 13px; color: #9ca3af; font-style: italic; line-height: 1.5;">This report is generated for informational purposes only. Please consult with a qualified financial advisor for personalized advice. All calculations are based on the inputs provided and current market assumptions.</p>
          </div>
        </div>
      </div>
    `
  }

  return (
    <button
      onClick={exportToPDF}
      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
    >
      <span className="text-base sm:text-lg">📄</span>
      <span className="hidden sm:inline">Export to PDF</span>
      <span className="sm:hidden">PDF</span>
    </button>
  )
}
