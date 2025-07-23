import { useEffect } from 'react'

const SEOAnalytics = ({ calculatorId, inputs = {} }) => {
  useEffect(() => {
    // Track calculator usage for SEO analytics
    if (calculatorId && window.gtag) {
      window.gtag('event', 'calculator_view', {
        event_category: 'SEO',
        event_label: calculatorId,
        custom_map: {
          calculator_type: calculatorId,
          has_inputs: Object.keys(inputs).length > 0
        }
      })
    }
  }, [calculatorId, inputs])

  useEffect(() => {
    // Track page performance metrics
    if ('web-vitals' in window) {
      // Track Core Web Vitals for SEO
      const trackWebVitals = (metric) => {
        if (window.gtag) {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.value),
            event_label: calculatorId || 'homepage'
          })
        }
      }

      // This would require web-vitals library, but we'll simulate for now
      // getCLS(trackWebVitals)
      // getFID(trackWebVitals)
      // getFCP(trackWebVitals)
      // getLCP(trackWebVitals)
      // getTTFB(trackWebVitals)
    }
  }, [calculatorId])

  // Track social sharing events
  useEffect(() => {
    const trackSocialShare = (platform) => {
      if (window.gtag) {
        window.gtag('event', 'share', {
          event_category: 'Social',
          event_label: platform,
          custom_map: {
            calculator_type: calculatorId,
            url: window.location.href
          }
        })
      }
    }

    // Listen for share events
    window.addEventListener('share', (e) => {
      trackSocialShare(e.detail?.platform || 'unknown')
    })

    return () => {
      window.removeEventListener('share', trackSocialShare)
    }
  }, [calculatorId])

  // This component doesn't render anything
  return null
}

export default SEOAnalytics
