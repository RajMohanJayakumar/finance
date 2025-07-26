// SEO utility functions for dynamic meta tags and structured data

export const calculatorSEOData = {
  // Loan Calculators
  emi: {
    title: "EMI Calculator - Calculate Loan EMI & Repayment Schedule | FinClamp",
    description: "Calculate your loan EMI with our free EMI calculator. Get detailed amortization schedule, total interest, and compare different loan options. Easy to use and accurate.",
    keywords: "EMI calculator, loan calculator, home loan EMI, personal loan EMI, car loan calculator, equated monthly installment",
    canonical: "/calculators?in=emi",
    structuredData: {
      "@type": "WebApplication",
      "name": "EMI Calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "description": "Calculate Equated Monthly Installment (EMI) for loans with detailed amortization schedule",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  mortgage: {
    title: "Mortgage Calculator - Home Loan EMI Calculator | FinClamp",
    description: "Calculate your home loan EMI, total interest, and monthly payments with our advanced mortgage calculator. Compare different loan terms and interest rates.",
    keywords: "mortgage calculator, home loan calculator, housing loan EMI, property loan calculator, mortgage payment",
    canonical: "/calculators?in=mortgage",
    structuredData: {
      "@type": "WebApplication",
      "name": "Mortgage Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate mortgage payments and home loan EMI with detailed breakdown"
    }
  },
  "personal-loan": {
    title: "Personal Loan Calculator - Calculate EMI & Interest | FinClamp",
    description: "Calculate personal loan EMI, total interest, and repayment schedule. Compare different personal loan options and find the best rates.",
    keywords: "personal loan calculator, personal loan EMI, unsecured loan calculator, instant loan calculator",
    canonical: "/calculators?in=personal-loan",
    structuredData: {
      "@type": "WebApplication",
      "name": "Personal Loan Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate personal loan EMI and total cost with detailed analysis"
    }
  },

  // Savings Calculators
  fd: {
    title: "Fixed Deposit Calculator - FD Maturity & Interest Calculator | FinClamp",
    description: "Calculate FD maturity amount, interest earned, and returns on your fixed deposit investment. Compare different FD schemes and tenure options.",
    keywords: "FD calculator, fixed deposit calculator, FD maturity calculator, bank FD calculator, fixed deposit interest",
    canonical: "/calculators/fd-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "Fixed Deposit Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate fixed deposit maturity amount and interest earnings"
    }
  },
  rd: {
    title: "Recurring Deposit Calculator - RD Maturity Calculator | FinClamp",
    description: "Calculate RD maturity amount and returns on your recurring deposit. Plan your monthly savings with our accurate RD calculator.",
    keywords: "RD calculator, recurring deposit calculator, RD maturity calculator, monthly deposit calculator",
    canonical: "/calculators/rd-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "Recurring Deposit Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate recurring deposit maturity value and monthly savings plan"
    }
  },
  ppf: {
    title: "PPF Calculator - Public Provident Fund Calculator | FinClamp",
    description: "Calculate PPF maturity amount, interest, and tax benefits. Plan your 15-year PPF investment with our comprehensive calculator.",
    keywords: "PPF calculator, public provident fund calculator, PPF maturity calculator, PPF interest calculator, tax saving",
    canonical: "/calculators/ppf-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "PPF Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate Public Provident Fund maturity amount and tax benefits"
    }
  },

  // Mutual Fund Calculators
  sip: {
    title: "SIP Calculator - Systematic Investment Plan Calculator | FinClamp",
    description: "Calculate SIP returns, maturity amount, and wealth creation potential. Plan your mutual fund investments with our advanced SIP calculator.",
    keywords: "SIP calculator, systematic investment plan, mutual fund calculator, SIP returns calculator, investment calculator",
    canonical: "/calculators/sip-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "SIP Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate Systematic Investment Plan returns and wealth creation potential"
    }
  },
  swp: {
    title: "SWP Calculator - Systematic Withdrawal Plan Calculator | FinClamp",
    description: "Calculate SWP withdrawals and remaining corpus. Plan your retirement income with our systematic withdrawal plan calculator.",
    keywords: "SWP calculator, systematic withdrawal plan, retirement planning, mutual fund withdrawal calculator",
    canonical: "/calculators/swp-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "SWP Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate systematic withdrawal plan and retirement income planning"
    }
  },
  cagr: {
    title: "CAGR Calculator - Compound Annual Growth Rate Calculator | FinClamp",
    description: "Calculate CAGR for your investments. Analyze investment performance and compare different investment options with our CAGR calculator.",
    keywords: "CAGR calculator, compound annual growth rate, investment returns calculator, portfolio performance",
    canonical: "/calculators/cagr-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "CAGR Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate Compound Annual Growth Rate for investment analysis"
    }
  },

  // Tax Calculators
  "income-tax": {
    title: "Income Tax Calculator - Calculate Tax Liability | FinClamp",
    description: "Calculate your income tax liability, tax savings, and take-home salary. Compare old vs new tax regime with our comprehensive tax calculator.",
    keywords: "income tax calculator, tax calculator India, tax liability calculator, salary tax calculator, tax saving calculator",
    canonical: "/calculators/income-tax-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "Income Tax Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate income tax liability and tax savings under different regimes"
    }
  },
  "capital-gains": {
    title: "Capital Gains Tax Calculator - STCG & LTCG Calculator | FinClamp",
    description: "Calculate capital gains tax on your investments. Understand STCG and LTCG implications with our detailed capital gains calculator.",
    keywords: "capital gains calculator, STCG calculator, LTCG calculator, capital gains tax, investment tax calculator",
    canonical: "/calculators/capital-gains-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "Capital Gains Tax Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate short-term and long-term capital gains tax on investments"
    }
  },

  // Retirement Calculators
  nps: {
    title: "NPS Calculator - National Pension Scheme Calculator | FinClamp",
    description: "Calculate NPS maturity amount, pension, and tax benefits. Plan your retirement with our comprehensive National Pension Scheme calculator.",
    keywords: "NPS calculator, national pension scheme calculator, NPS maturity calculator, retirement planning, pension calculator",
    canonical: "/calculators/nps-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "NPS Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate National Pension Scheme maturity and retirement planning"
    }
  },
  epf: {
    title: "EPF Calculator - Employee Provident Fund Calculator | FinClamp",
    description: "Calculate EPF maturity amount, interest, and withdrawal. Plan your provident fund savings with our accurate EPF calculator.",
    keywords: "EPF calculator, employee provident fund calculator, PF calculator, provident fund maturity calculator",
    canonical: "/calculators/epf-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "EPF Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate Employee Provident Fund maturity and interest earnings"
    }
  },
  gratuity: {
    title: "Gratuity Calculator - Calculate Gratuity Amount | FinClamp",
    description: "Calculate gratuity amount based on salary and years of service. Understand your gratuity benefits with our easy-to-use calculator.",
    keywords: "gratuity calculator, gratuity amount calculator, employee gratuity calculator, gratuity calculation formula",
    canonical: "/calculators/gratuity-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "Gratuity Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate gratuity amount for employees based on salary and service years"
    }
  },

  // General Calculators
  "compound-interest": {
    title: "Compound Interest Calculator - Calculate Compound Growth | FinClamp",
    description: "Calculate compound interest and investment growth. Understand the power of compounding with our detailed compound interest calculator.",
    keywords: "compound interest calculator, compound growth calculator, investment compounding, compound interest formula",
    canonical: "/calculators/compound-interest-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "Compound Interest Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate compound interest and investment growth over time"
    }
  },
  "simple-interest": {
    title: "Simple Interest Calculator - Calculate Simple Interest | FinClamp",
    description: "Calculate simple interest on loans and investments. Easy-to-use simple interest calculator with detailed breakdown.",
    keywords: "simple interest calculator, simple interest formula, loan interest calculator, investment interest",
    canonical: "/calculators/simple-interest-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "Simple Interest Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate simple interest on loans and investments"
    }
  },
  inflation: {
    title: "Inflation Calculator - Calculate Inflation Impact | FinClamp",
    description: "Calculate inflation impact on your money over time. Understand purchasing power erosion with our inflation calculator.",
    keywords: "inflation calculator, inflation impact calculator, purchasing power calculator, money value calculator",
    canonical: "/calculators/inflation-calculator",
    structuredData: {
      "@type": "WebApplication",
      "name": "Inflation Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate inflation impact on purchasing power over time"
    }
  }
}

// Default SEO data for homepage
export const defaultSEOData = {
  title: "FinClamp - Complete Financial Calculator Suite | Free Online Calculators",
  description: "Free online financial calculators for loans, investments, savings, taxes, and retirement planning. Calculate EMI, SIP, FD, PPF, tax liability and more with FinClamp.",
  keywords: "financial calculator, EMI calculator, SIP calculator, tax calculator, loan calculator, investment calculator, retirement planning",
  canonical: "/",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FinClamp",
    "description": "Complete financial calculator suite for all your financial planning needs",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "EMI Calculator",
      "SIP Calculator", 
      "Tax Calculator",
      "FD Calculator",
      "PPF Calculator",
      "Loan Calculator"
    ]
  }
}

// Function to get SEO data for a specific calculator
export const getSEOData = (calculatorId) => {
  return calculatorSEOData[calculatorId] || defaultSEOData
}

// Function to update document title
export const updateDocumentTitle = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  document.title = seoData.title
}

// Function to update meta description
export const updateMetaDescription = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  let metaDescription = document.querySelector('meta[name="description"]')
  
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  
  metaDescription.content = seoData.description
}

// Function to update meta keywords
export const updateMetaKeywords = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  let metaKeywords = document.querySelector('meta[name="keywords"]')
  
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.name = 'keywords'
    document.head.appendChild(metaKeywords)
  }
  
  metaKeywords.content = seoData.keywords
}

// Function to update canonical URL
export const updateCanonicalURL = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  let canonical = document.querySelector('link[rel="canonical"]')

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }

  canonical.href = `${window.location.origin}${seoData.canonical}`
}

// Function to update Open Graph tags
export const updateOpenGraphTags = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  const baseURL = window.location.origin

  const ogTags = [
    { property: 'og:title', content: seoData.title },
    { property: 'og:description', content: seoData.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${baseURL}${seoData.canonical}` },
    { property: 'og:site_name', content: 'FinClamp' },
    { property: 'og:image', content: `${baseURL}/og-image.jpg` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `${seoData.title} - FinClamp` }
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

// Function to update Twitter Card tags
export const updateTwitterCardTags = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  const baseURL = window.location.origin

  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoData.title },
    { name: 'twitter:description', content: seoData.description },
    { name: 'twitter:image', content: `${baseURL}/twitter-card.jpg` },
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

// Function to update structured data (JSON-LD)
export const updateStructuredData = (calculatorId) => {
  const seoData = getSEOData(calculatorId)

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // Create new structured data
  const structuredData = {
    "@context": "https://schema.org",
    ...seoData.structuredData,
    "url": `${window.location.origin}${seoData.canonical}`,
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
    "inLanguage": "en-US"
  }

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData, null, 2)
  document.head.appendChild(script)
}

// Main function to update all SEO elements
export const updateSEO = (calculatorId) => {
  updateDocumentTitle(calculatorId)
  updateMetaDescription(calculatorId)
  updateMetaKeywords(calculatorId)
  updateCanonicalURL(calculatorId)
  updateOpenGraphTags(calculatorId)
  updateTwitterCardTags(calculatorId)
  updateStructuredData(calculatorId)
}

// Function to generate breadcrumb structured data with new URL structure
export const generateBreadcrumbData = (calculatorId) => {
  const seoData = getSEOData(calculatorId)
  const baseURL = window.location.origin

  // Map calculator to category for breadcrumb
  const calculatorCategoryMap = {
    'emi': 'loans',
    'mortgage': 'loans',
    'personal-loan': 'loans',
    'fd': 'savings',
    'rd': 'savings',
    'ppf': 'savings',
    'sip': 'mutual_funds',
    'swp': 'mutual_funds',
    'cagr': 'mutual_funds',
    'income-tax': 'tax',
    'capital-gains': 'tax',
    'nps': 'retirement',
    'epf': 'retirement',
    'gratuity': 'retirement',
    'budget-planner': 'personal_finance',
    'savings-goal': 'personal_finance',
    'stock-average': 'personal_finance',
    'net-worth': 'personal_finance',
    'bill-split': 'lifestyle',
    'tip': 'lifestyle',
    'subscription': 'lifestyle',
    'daily-interest': 'lifestyle',
    'monthly-expense': 'lifestyle',
    'upi-spending': 'lifestyle',
    'grocery-budget': 'lifestyle',
    'commute-cost': 'lifestyle',
    'wfh-savings': 'lifestyle',
    'habit-cost': 'lifestyle',
    'freelancer-tax': 'business',
    'discount': 'general',
    'fuel-cost': 'general',
    'compound-interest': 'general',
    'simple-interest': 'general',
    'inflation': 'general',
    'finance-quest': 'games'
  }

  const categoryNames = {
    'loans': 'Loan Calculators',
    'savings': 'Savings Calculators',
    'mutual_funds': 'Mutual Fund Calculators',
    'tax': 'Tax Calculators',
    'retirement': 'Retirement Calculators',
    'personal_finance': 'Personal Finance Calculators',
    'lifestyle': 'Lifestyle Calculators',
    'business': 'Business Calculators',
    'general': 'General Calculators',
    'games': 'Financial Games'
  }

  const category = calculatorCategoryMap[calculatorId] || 'general'
  const categoryName = categoryNames[category] || 'Calculators'

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseURL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `${baseURL}/${calculatorId === 'finance-quest' ? 'games' : 'calculators'}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": seoData.title.split(' - ')[0],
        "item": `${baseURL}/${calculatorId === 'finance-quest' ? 'games' : 'calculators'}?in=${calculatorId}`
      }
    ]
  }
}
