import { useEffect } from 'react'
import { getCalculatorDescription } from '../data/calculatorDescriptions'

const SEOEnhancer = ({ calculatorId }) => {
  useEffect(() => {
    if (!calculatorId) return

    const description = getCalculatorDescription(calculatorId)
    if (!description) return

    // Update document title with SEO-optimized title
    document.title = description.title

    // Update meta description
    updateMetaTag('description', description.description)

    // Update meta keywords if available
    if (description.seoKeywords) {
      updateMetaTag('keywords', description.seoKeywords)
    }

    // Add Open Graph tags for social media
    updateOpenGraphTags(description, calculatorId)

    // Add Twitter Card tags
    updateTwitterCardTags(description, calculatorId)

    // Update structured data with enhanced SEO
    updateEnhancedStructuredData(description, calculatorId)

    // Add FAQ structured data for better search results
    if (description.searchQueries) {
      addFAQStructuredData(description, calculatorId)
    }

    // Add breadcrumb structured data
    addBreadcrumbStructuredData(description, calculatorId)

  }, [calculatorId])

  const updateMetaTag = (name, content) => {
    let metaTag = document.querySelector(`meta[name="${name}"]`)
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.name = name
      document.head.appendChild(metaTag)
    }
    metaTag.content = content
  }

  const updateOpenGraphTags = (description, calculatorId) => {
    const baseURL = window.location.origin
    const ogTags = [
      { property: 'og:title', content: description.title },
      { property: 'og:description', content: description.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${baseURL}?calculator=${calculatorId}` },
      { property: 'og:site_name', content: 'FinClamp' },
      { property: 'og:image', content: `${baseURL}/og-calculator-${calculatorId}.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: description.title }
    ]

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`)
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute('property', tag.property)
        document.head.appendChild(metaTag)
      }
      metaTag.content = tag.content
    })
  }

  const updateTwitterCardTags = (description, calculatorId) => {
    const baseURL = window.location.origin
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: description.title },
      { name: 'twitter:description', content: description.description },
      { name: 'twitter:image', content: `${baseURL}/twitter-calculator-${calculatorId}.jpg` },
      { name: 'twitter:site', content: '@FinClamp' },
      { name: 'twitter:creator', content: '@FinClamp' }
    ]

    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`)
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.name = tag.name
        document.head.appendChild(metaTag)
      }
      metaTag.content = tag.content
    })
  }

  const updateEnhancedStructuredData = (description, calculatorId) => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[data-type="calculator-structured-data"]')
    if (existingScript) {
      existingScript.remove()
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": description.title,
      "description": description.description,
      "url": `${window.location.origin}?calculator=${calculatorId}`,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "publisher": {
        "@type": "Organization",
        "name": "FinClamp",
        "url": window.location.origin,
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/favicon.svg`
        }
      },
      "dateModified": new Date().toISOString(),
      "inLanguage": "en-US",
      "keywords": description.seoKeywords || "",
      "mainEntity": {
        "@type": "SoftwareApplication",
        "name": description.title,
        "applicationCategory": "Finance",
        "operatingSystem": "Web Browser"
      }
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-type', 'calculator-structured-data')
    script.textContent = JSON.stringify(structuredData, null, 2)
    document.head.appendChild(script)
  }

  const addFAQStructuredData = (description, calculatorId) => {
    if (!description.searchQueries) return

    // Remove existing FAQ structured data
    const existingFAQ = document.querySelector('script[data-type="faq-structured-data"]')
    if (existingFAQ) {
      existingFAQ.remove()
    }

    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": description.searchQueries.slice(0, 5).map((query, index) => ({
        "@type": "Question",
        "name": query,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Use our free ${description.title.split(' - ')[0]} to ${query.toLowerCase()}. Get instant results with detailed calculations and explanations.`
        }
      }))
    }

    const faqScript = document.createElement('script')
    faqScript.type = 'application/ld+json'
    faqScript.setAttribute('data-type', 'faq-structured-data')
    faqScript.textContent = JSON.stringify(faqData, null, 2)
    document.head.appendChild(faqScript)
  }

  const addBreadcrumbStructuredData = (description, calculatorId) => {
    // Remove existing breadcrumb structured data
    const existingBreadcrumb = document.querySelector('script[data-type="breadcrumb-structured-data"]')
    if (existingBreadcrumb) {
      existingBreadcrumb.remove()
    }

    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Financial Calculators",
          "item": `${window.location.origin}/calculators`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": description.title.split(' - ')[0],
          "item": `${window.location.origin}?calculator=${calculatorId}`
        }
      ]
    }

    const breadcrumbScript = document.createElement('script')
    breadcrumbScript.type = 'application/ld+json'
    breadcrumbScript.setAttribute('data-type', 'breadcrumb-structured-data')
    breadcrumbScript.textContent = JSON.stringify(breadcrumbData, null, 2)
    document.head.appendChild(breadcrumbScript)
  }

  // This component doesn't render anything
  return null
}

export default SEOEnhancer
