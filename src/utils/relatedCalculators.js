// Dynamic Related Calculators System
// This system intelligently suggests related calculators based on categories, tags, and calculator types

// Calculator metadata with tags for smart matching
const calculatorMetadata = {
  // Loans Category
  'emi': { category: 'loans', tags: ['loan', 'interest', 'monthly-payment', 'debt'], type: 'loan-calculator' },
  'mortgage': { category: 'loans', tags: ['loan', 'home', 'property', 'interest', 'monthly-payment'], type: 'loan-calculator' },
  'personal-loan': { category: 'loans', tags: ['loan', 'personal', 'interest', 'monthly-payment', 'debt'], type: 'loan-calculator' },
  
  // Savings Category
  'fd': { category: 'savings', tags: ['savings', 'fixed-deposit', 'interest', 'maturity', 'bank'], type: 'savings-calculator' },
  'rd': { category: 'savings', tags: ['savings', 'recurring-deposit', 'monthly', 'maturity', 'bank'], type: 'savings-calculator' },
  'ppf': { category: 'savings', tags: ['savings', 'tax-saving', 'long-term', 'government', 'retirement'], type: 'savings-calculator' },
  'future-value': { category: 'savings', tags: ['investment', 'future-value', 'time-value', 'growth'], type: 'investment-calculator' },
  'present-value': { category: 'savings', tags: ['investment', 'present-value', 'time-value', 'discount'], type: 'investment-calculator' },
  'annuity': { category: 'savings', tags: ['annuity', 'pension', 'regular-payment', 'retirement'], type: 'retirement-calculator' },
  
  // Mutual Funds Category
  'sip': { category: 'mutual_funds', tags: ['investment', 'mutual-funds', 'systematic', 'monthly', 'growth'], type: 'investment-calculator' },
  'swp': { category: 'mutual_funds', tags: ['investment', 'mutual-funds', 'withdrawal', 'systematic', 'income'], type: 'investment-calculator' },
  'cagr': { category: 'mutual_funds', tags: ['investment', 'growth-rate', 'returns', 'analysis'], type: 'analysis-calculator' },
  'xirr': { category: 'mutual_funds', tags: ['investment', 'irregular-cashflow', 'returns', 'mutual-funds'], type: 'analysis-calculator' },
  
  // Tax Category
  'income-tax': { category: 'tax', tags: ['tax', 'income', 'salary', 'deduction'], type: 'tax-calculator' },
  'capital-gains': { category: 'tax', tags: ['tax', 'capital-gains', 'investment', 'stocks'], type: 'tax-calculator' },
  'capital-gains-tax': { category: 'tax', tags: ['tax', 'capital-gains', 'stocks', 'property', 'mutual-funds'], type: 'tax-calculator' },
  'gst-profit-margin': { category: 'tax', tags: ['tax', 'gst', 'business', 'profit', 'margin'], type: 'business-calculator' },
  
  // Retirement Category
  'nps': { category: 'retirement', tags: ['retirement', 'pension', 'tax-saving', 'long-term'], type: 'retirement-calculator' },
  'epf': { category: 'retirement', tags: ['retirement', 'provident-fund', 'employee', 'long-term'], type: 'retirement-calculator' },
  'gratuity': { category: 'retirement', tags: ['retirement', 'gratuity', 'employee', 'benefit'], type: 'retirement-calculator' },
  
  // Personal Finance Category
  'budget-planner': { category: 'personal_finance', tags: ['budget', 'planning', 'expense', 'income'], type: 'planning-calculator' },
  'savings-goal': { category: 'personal_finance', tags: ['savings', 'goal', 'planning', 'target'], type: 'planning-calculator' },
  'stock-average': { category: 'personal_finance', tags: ['stocks', 'average', 'investment', 'portfolio'], type: 'investment-calculator' },
  'net-worth': { category: 'personal_finance', tags: ['net-worth', 'assets', 'liabilities', 'wealth'], type: 'analysis-calculator' },
  'roi': { category: 'personal_finance', tags: ['investment', 'returns', 'roi', 'business'], type: 'analysis-calculator' },
  'irr': { category: 'personal_finance', tags: ['investment', 'returns', 'irr', 'projects'], type: 'analysis-calculator' },
  'payback-period': { category: 'personal_finance', tags: ['investment', 'payback', 'recovery', 'time'], type: 'analysis-calculator' },
  'rent-vs-buy': { category: 'personal_finance', tags: ['property', 'rent', 'buy', 'decision'], type: 'comparison-calculator' },
  
  // Business Category
  'freelancer-tax': { category: 'business', tags: ['tax', 'freelancer', 'self-employed', 'business'], type: 'tax-calculator' },
  'break-even-point': { category: 'business', tags: ['business', 'break-even', 'costs', 'revenue'], type: 'business-calculator' },
  'business-loan-eligibility': { category: 'business', tags: ['business', 'loan', 'eligibility', 'finance'], type: 'loan-calculator' },
  'inventory-turnover': { category: 'business', tags: ['business', 'inventory', 'turnover', 'efficiency'], type: 'business-calculator' },
  'revenue-growth': { category: 'business', tags: ['business', 'revenue', 'growth', 'analysis'], type: 'analysis-calculator' },
  'invoice-due-date': { category: 'business', tags: ['business', 'invoice', 'payment', 'due-date'], type: 'business-calculator' },
  'depreciation': { category: 'business', tags: ['business', 'depreciation', 'assets', 'accounting'], type: 'business-calculator' },
  
  // Lifestyle Category
  'bill-split': { category: 'lifestyle', tags: ['lifestyle', 'bill', 'split', 'friends'], type: 'utility-calculator' },
  'tip-calculator': { category: 'lifestyle', tags: ['lifestyle', 'tip', 'restaurant', 'service'], type: 'utility-calculator' },
  'subscription-tracker': { category: 'lifestyle', tags: ['lifestyle', 'subscription', 'monthly', 'tracking'], type: 'tracking-calculator' },
  'daily-interest': { category: 'lifestyle', tags: ['interest', 'daily', 'short-term', 'calculation'], type: 'utility-calculator' },
  'monthly-expense': { category: 'lifestyle', tags: ['expense', 'monthly', 'budget', 'tracking'], type: 'tracking-calculator' },
  'upi-spending': { category: 'lifestyle', tags: ['spending', 'upi', 'digital', 'tracking'], type: 'tracking-calculator' },
  'grocery-budget': { category: 'lifestyle', tags: ['grocery', 'budget', 'family', 'monthly'], type: 'planning-calculator' },
  'commute-cost': { category: 'lifestyle', tags: ['commute', 'transport', 'cost', 'daily'], type: 'utility-calculator' },
  'wfh-savings': { category: 'lifestyle', tags: ['work-from-home', 'savings', 'cost', 'comparison'], type: 'comparison-calculator' },
  'habit-cost': { category: 'lifestyle', tags: ['habit', 'cost', 'tracking', 'lifestyle'], type: 'tracking-calculator' },
  
  // General Category
  'discount': { category: 'general', tags: ['discount', 'percentage', 'price', 'shopping'], type: 'utility-calculator' },
  'fuel-cost': { category: 'general', tags: ['fuel', 'cost', 'mileage', 'transport'], type: 'utility-calculator' },
  'compound-interest': { category: 'general', tags: ['interest', 'compound', 'investment', 'growth'], type: 'calculation-tool' },
  'simple-interest': { category: 'general', tags: ['interest', 'simple', 'loan', 'calculation'], type: 'calculation-tool' },
  'inflation': { category: 'general', tags: ['inflation', 'purchasing-power', 'time', 'economics'], type: 'analysis-calculator' },
  'inflation-impact': { category: 'general', tags: ['inflation', 'impact', 'purchasing-power', 'erosion'], type: 'analysis-calculator' }
}

// Get calculator info from App.jsx data
const getCalculatorInfo = (calculatorId, calculatorData) => {
  for (const category of Object.values(calculatorData)) {
    const calculator = category.calculators.find(calc => calc.id === calculatorId)
    if (calculator) {
      return {
        ...calculator,
        categoryColor: category.color,
        categoryTitle: category.title
      }
    }
  }
  return null
}

// Calculate similarity score between two calculators
const calculateSimilarity = (calc1Id, calc2Id) => {
  const calc1Meta = calculatorMetadata[calc1Id]
  const calc2Meta = calculatorMetadata[calc2Id]
  
  if (!calc1Meta || !calc2Meta) return 0
  
  let score = 0
  
  // Same category gets high score
  if (calc1Meta.category === calc2Meta.category) {
    score += 40
  }
  
  // Same type gets medium score
  if (calc1Meta.type === calc2Meta.type) {
    score += 30
  }
  
  // Common tags get points
  const commonTags = calc1Meta.tags.filter(tag => calc2Meta.tags.includes(tag))
  score += commonTags.length * 10
  
  // Cross-category relationships
  const crossCategoryBonus = getCrossCategoryBonus(calc1Meta.category, calc2Meta.category)
  score += crossCategoryBonus
  
  return score
}

// Define relationships between categories
const getCrossCategoryBonus = (category1, category2) => {
  const relationships = {
    'loans': ['savings', 'personal_finance', 'business'],
    'savings': ['mutual_funds', 'retirement', 'personal_finance'],
    'mutual_funds': ['savings', 'personal_finance', 'tax'],
    'tax': ['retirement', 'business', 'personal_finance'],
    'retirement': ['savings', 'tax', 'personal_finance'],
    'personal_finance': ['savings', 'mutual_funds', 'retirement'],
    'business': ['tax', 'loans', 'personal_finance'],
    'lifestyle': ['personal_finance', 'general'],
    'general': ['lifestyle', 'personal_finance']
  }
  
  if (relationships[category1]?.includes(category2)) {
    return 15
  }
  return 0
}

// Main function to get related calculators
export const getRelatedCalculators = (currentCalculatorId, calculatorData, count = 3) => {
  if (!currentCalculatorId || !calculatorData) {
    return []
  }
  
  // Get all calculator IDs except current one
  const allCalculatorIds = []
  Object.values(calculatorData).forEach(category => {
    category.calculators.forEach(calc => {
      if (calc.id !== currentCalculatorId) {
        allCalculatorIds.push(calc.id)
      }
    })
  })
  
  // Calculate similarity scores for all calculators
  const scoredCalculators = allCalculatorIds.map(calcId => ({
    id: calcId,
    score: calculateSimilarity(currentCalculatorId, calcId),
    info: getCalculatorInfo(calcId, calculatorData)
  })).filter(calc => calc.info) // Filter out calculators without info
  
  // Sort by score and return top results
  const topCalculators = scoredCalculators
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(calc => ({
      id: calc.id,
      name: calc.info.name,
      description: calc.info.description,
      icon: calc.info.icon,
      category: calc.info.categoryTitle,
      categoryColor: calc.info.categoryColor
    }))
  
  return topCalculators
}

// Get calculators by category
export const getCalculatorsByCategory = (category, calculatorData, excludeId = null) => {
  const categoryData = calculatorData[category]
  if (!categoryData) return []
  
  return categoryData.calculators
    .filter(calc => calc.id !== excludeId)
    .map(calc => ({
      id: calc.id,
      name: calc.name,
      description: calc.description,
      icon: calc.icon,
      category: categoryData.title,
      categoryColor: categoryData.color
    }))
}

// Get calculators by type
export const getCalculatorsByType = (type, calculatorData, excludeId = null) => {
  const calculatorIds = Object.keys(calculatorMetadata).filter(id => 
    calculatorMetadata[id].type === type && id !== excludeId
  )
  
  return calculatorIds.map(id => {
    const info = getCalculatorInfo(id, calculatorData)
    return info ? {
      id,
      name: info.name,
      description: info.description,
      icon: info.icon,
      category: info.categoryTitle,
      categoryColor: info.categoryColor
    } : null
  }).filter(Boolean)
}
