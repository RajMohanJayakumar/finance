// Calculator descriptions, formulas, and educational content
export const calculatorDescriptions = {
  // Loan Calculators
  emi: {
    title: "EMI Calculator - Calculate Loan EMI Online | Home Loan, Personal Loan EMI Calculator",
    description: "Free EMI Calculator to calculate loan EMI for home loans, personal loans, car loans, and business loans. Get instant EMI calculation with detailed amortization schedule, total interest, and monthly payment breakdown. Calculate EMI online with our accurate loan EMI calculator and plan your finances better.",
    seoKeywords: "EMI calculator, loan EMI calculator, home loan EMI, personal loan EMI, car loan EMI, calculate EMI online, loan calculator, monthly EMI calculator, EMI calculation formula, loan payment calculator",
    searchQueries: [
      "EMI calculator online",
      "home loan EMI calculator",
      "personal loan EMI calculator",
      "car loan EMI calculator",
      "calculate EMI for loan",
      "monthly EMI calculation",
      "loan EMI formula",
      "EMI calculator with interest rate",
      "housing loan EMI calculator",
      "business loan EMI calculator"
    ],
    formula: {
      name: "EMI Formula",
      equation: "EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]",
      variables: {
        "P": "Principal loan amount",
        "R": "Monthly interest rate (Annual rate ÷ 12 ÷ 100)",
        "N": "Number of monthly installments (Loan tenure in months)"
      }
    },
    keyFeatures: [
      "Calculate exact monthly EMI amount",
      "View complete amortization schedule",
      "Understand principal vs interest breakdown",
      "Compare different loan scenarios",
      "Plan your monthly budget effectively"
    ],
    howItWorks: [
      "Enter the loan amount you need",
      "Input the annual interest rate offered by the lender",
      "Specify the loan tenure in years",
      "Get instant EMI calculation with detailed breakdown"
    ],
    benefits: [
      "Better financial planning and budgeting",
      "Compare loan offers from different lenders",
      "Understand the total cost of borrowing",
      "Make informed decisions about loan tenure"
    ],
    example: {
      scenario: "Home Loan Example",
      inputs: {
        "Loan Amount": "₹50,00,000",
        "Interest Rate": "8.5% per annum",
        "Tenure": "20 years"
      },
      result: "Monthly EMI: ₹43,391"
    }
  },

  sip: {
    title: "SIP Calculator - Mutual Fund SIP Calculator | Calculate SIP Returns Online",
    description: "Free SIP Calculator to calculate mutual fund SIP returns and maturity amount. Plan your systematic investment plan with our online SIP calculator. Calculate SIP returns, understand the power of compounding, and plan your wealth creation journey with accurate SIP calculations for mutual funds.",
    seoKeywords: "SIP calculator, mutual fund SIP calculator, SIP returns calculator, systematic investment plan calculator, SIP maturity calculator, mutual fund calculator, SIP investment calculator, calculate SIP returns, SIP planning calculator",
    searchQueries: [
      "SIP calculator online",
      "mutual fund SIP calculator",
      "SIP returns calculator",
      "calculate SIP maturity amount",
      "systematic investment plan calculator",
      "SIP calculator with returns",
      "mutual fund SIP planning",
      "SIP investment calculator",
      "monthly SIP calculator",
      "SIP wealth calculator"
    ],
    formula: {
      name: "SIP Future Value Formula",
      equation: "FV = P × [((1 + R)^N - 1) / R] × (1 + R)",
      variables: {
        "FV": "Future value of SIP",
        "P": "Monthly SIP amount",
        "R": "Monthly expected return rate",
        "N": "Number of monthly investments"
      }
    },
    keyFeatures: [
      "Calculate SIP maturity amount",
      "Understand power of compounding",
      "Plan systematic wealth creation",
      "Compare different SIP amounts",
      "Analyze long-term investment growth"
    ],
    howItWorks: [
      "Enter your monthly SIP amount",
      "Input expected annual return rate",
      "Specify investment tenure",
      "Get projected maturity value and wealth gained"
    ],
    benefits: [
      "Disciplined investment approach",
      "Rupee cost averaging benefits",
      "Power of compounding over time",
      "Flexible investment amounts"
    ],
    example: {
      scenario: "SIP Investment Example",
      inputs: {
        "Monthly SIP": "₹10,000",
        "Expected Return": "12% per annum",
        "Tenure": "15 years"
      },
      result: "Maturity Amount: ₹50,01,148"
    }
  },

  fd: {
    title: "FD Calculator - Fixed Deposit Calculator | Calculate FD Maturity & Interest Online",
    description: "Free FD Calculator to calculate fixed deposit maturity amount and interest earnings. Compare FD rates from different banks, calculate FD returns, and plan your fixed deposit investments. Get accurate FD maturity calculations with our online fixed deposit calculator for all major banks in India.",
    seoKeywords: "FD calculator, fixed deposit calculator, FD maturity calculator, FD interest calculator, bank FD calculator, fixed deposit maturity, FD returns calculator, calculate FD interest, FD investment calculator",
    searchQueries: [
      "FD calculator online",
      "fixed deposit calculator",
      "FD maturity calculator",
      "bank FD calculator",
      "calculate FD interest",
      "FD returns calculator",
      "fixed deposit maturity calculator",
      "FD interest rate calculator",
      "SBI FD calculator",
      "HDFC FD calculator"
    ],
    formula: {
      name: "FD Maturity Formula",
      equation: "A = P × (1 + R/100)^T",
      variables: {
        "A": "Maturity amount",
        "P": "Principal deposit amount",
        "R": "Annual interest rate",
        "T": "Time period in years"
      }
    },
    keyFeatures: [
      "Calculate FD maturity amount",
      "Compare different FD schemes",
      "Understand interest earnings",
      "Analyze various tenure options",
      "Plan your savings goals"
    ],
    howItWorks: [
      "Enter your deposit amount",
      "Input the FD interest rate",
      "Specify the deposit tenure",
      "Choose compounding frequency",
      "Get maturity amount and interest earned"
    ],
    benefits: [
      "Guaranteed returns with capital protection",
      "Predictable income stream",
      "Flexible tenure options",
      "Higher returns than savings accounts"
    ],
    example: {
      scenario: "Fixed Deposit Example",
      inputs: {
        "Deposit Amount": "₹1,00,000",
        "Interest Rate": "6.5% per annum",
        "Tenure": "3 years"
      },
      result: "Maturity Amount: ₹1,20,795"
    }
  },

  ppf: {
    title: "PPF Calculator - Public Provident Fund Calculator | Calculate PPF Maturity Online",
    description: "Free PPF Calculator to calculate Public Provident Fund maturity amount and returns. Plan your 15-year PPF investment with tax benefits under Section 80C. Calculate PPF interest, maturity value, and tax savings with our accurate PPF calculator for long-term wealth creation.",
    seoKeywords: "PPF calculator, public provident fund calculator, PPF maturity calculator, PPF interest calculator, PPF investment calculator, PPF tax benefit calculator, PPF returns calculator, calculate PPF maturity",
    searchQueries: [
      "PPF calculator online",
      "public provident fund calculator",
      "PPF maturity calculator",
      "PPF interest calculator",
      "calculate PPF returns",
      "PPF investment calculator",
      "PPF tax benefit calculator",
      "PPF 15 year calculator",
      "PPF contribution calculator",
      "PPF withdrawal calculator"
    ],
    formula: {
      name: "PPF Maturity Formula",
      equation: "A = P × [((1 + R)^N - 1) / R]",
      variables: {
        "A": "Maturity amount",
        "P": "Annual contribution",
        "R": "Annual interest rate",
        "N": "Number of years (15 years minimum)"
      }
    },
    keyFeatures: [
      "Calculate PPF maturity amount",
      "Understand tax benefits",
      "Plan long-term wealth creation",
      "Analyze different contribution scenarios",
      "Track 15-year investment growth"
    ],
    howItWorks: [
      "Enter your annual PPF contribution",
      "Current PPF interest rate is auto-filled",
      "Specify investment period (minimum 15 years)",
      "Get maturity amount with tax benefits"
    ],
    benefits: [
      "Triple tax benefit (EEE status)",
      "Government-backed safety",
      "Attractive interest rates",
      "Long-term wealth creation"
    ],
    example: {
      scenario: "PPF Investment Example",
      inputs: {
        "Annual Contribution": "₹1,50,000",
        "Interest Rate": "7.1% per annum",
        "Tenure": "15 years"
      },
      result: "Maturity Amount: ₹40,68,209"
    }
  },

  mortgage: {
    title: "Mortgage Calculator - Home Loan Calculator | Calculate Monthly Mortgage Payment",
    description: "Free Mortgage Calculator to calculate home loan EMI, monthly mortgage payments, and total interest cost. Compare mortgage rates, analyze different loan terms, and plan your home purchase with our comprehensive mortgage calculator. Get accurate home loan calculations instantly.",
    seoKeywords: "mortgage calculator, home loan calculator, mortgage payment calculator, home loan EMI calculator, mortgage rate calculator, housing loan calculator, property loan calculator, home mortgage calculator",
    searchQueries: [
      "mortgage calculator online",
      "home loan calculator",
      "mortgage payment calculator",
      "home loan EMI calculator",
      "mortgage rate calculator",
      "housing loan calculator",
      "property loan calculator",
      "home mortgage payment calculator",
      "mortgage affordability calculator",
      "home loan interest calculator"
    ],
    formula: {
      name: "Mortgage Payment Formula",
      equation: "M = P × [r(1+r)^n] / [(1+r)^n - 1]",
      variables: {
        "M": "Monthly mortgage payment",
        "P": "Principal loan amount",
        "r": "Monthly interest rate",
        "n": "Total number of payments"
      }
    },
    keyFeatures: [
      "Calculate monthly mortgage payments",
      "Include property taxes and insurance",
      "Factor in PMI (Private Mortgage Insurance)",
      "Analyze different down payment scenarios",
      "View amortization schedule with equity buildup"
    ],
    howItWorks: [
      "Enter the home purchase price",
      "Specify your down payment amount",
      "Input the mortgage interest rate",
      "Add property taxes and insurance costs",
      "Get comprehensive monthly payment breakdown"
    ],
    benefits: [
      "Determine affordable home price range",
      "Compare different mortgage options",
      "Understand total homeownership costs",
      "Plan for down payment requirements"
    ],
    example: {
      scenario: "Home Purchase Example",
      inputs: {
        "Home Price": "₹1,00,00,000",
        "Down Payment": "₹20,00,000",
        "Interest Rate": "8.0% per annum",
        "Tenure": "25 years"
      },
      result: "Monthly Payment: ₹61,681"
    }
  },

  "personal-loan": {
    title: "Personal Loan Calculator - Calculate Personal Loan EMI Online | Instant Approval",
    description: "Free Personal Loan Calculator to calculate EMI for unsecured personal loans. Get instant personal loan EMI calculation for medical expenses, travel, debt consolidation, and emergency needs. Compare personal loan rates and plan your finances with our accurate personal loan EMI calculator.",
    seoKeywords: "personal loan calculator, personal loan EMI calculator, unsecured loan calculator, instant personal loan calculator, personal loan EMI, calculate personal loan EMI, personal loan interest calculator",
    searchQueries: [
      "personal loan calculator online",
      "personal loan EMI calculator",
      "calculate personal loan EMI",
      "unsecured loan calculator",
      "instant personal loan calculator",
      "personal loan interest calculator",
      "personal loan eligibility calculator",
      "personal loan rate calculator",
      "quick personal loan calculator",
      "personal loan payment calculator"
    ],
    formula: {
      name: "Personal Loan EMI Formula",
      equation: "EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]",
      variables: {
        "P": "Principal loan amount",
        "R": "Monthly interest rate",
        "N": "Number of monthly installments"
      }
    },
    keyFeatures: [
      "Calculate personal loan EMI",
      "Compare different loan amounts",
      "Analyze various tenure options",
      "Understand total interest cost",
      "Plan repayment strategy"
    ],
    howItWorks: [
      "Enter the required loan amount",
      "Input the interest rate offered",
      "Choose the repayment tenure",
      "Get instant EMI and total cost calculation"
    ],
    benefits: [
      "Quick access to funds without collateral",
      "Flexible usage for any personal need",
      "Fixed EMI for better budgeting",
      "No restrictions on end-use"
    ],
    example: {
      scenario: "Personal Loan Example",
      inputs: {
        "Loan Amount": "₹5,00,000",
        "Interest Rate": "12% per annum",
        "Tenure": "5 years"
      },
      result: "Monthly EMI: ₹11,122"
    }
  },

  rd: {
    title: "RD Calculator - Recurring Deposit Calculator | Calculate RD Maturity Online",
    description: "Free RD Calculator to calculate recurring deposit maturity amount and monthly savings plan. Plan your systematic monthly deposits with our accurate RD calculator. Calculate RD returns, interest earnings, and maturity value for all major banks in India.",
    seoKeywords: "RD calculator, recurring deposit calculator, RD maturity calculator, monthly deposit calculator, RD interest calculator, bank RD calculator, recurring deposit maturity, calculate RD returns",
    searchQueries: [
      "RD calculator online",
      "recurring deposit calculator",
      "RD maturity calculator",
      "monthly deposit calculator",
      "calculate RD interest",
      "RD returns calculator",
      "bank RD calculator",
      "recurring deposit maturity calculator",
      "RD investment calculator",
      "SBI RD calculator"
    ],
    formula: {
      name: "RD Maturity Formula",
      equation: "A = P × [(1 + R/400)^(4T) - 1] / (1/400)",
      variables: {
        "A": "Maturity amount",
        "P": "Monthly deposit amount",
        "R": "Annual interest rate",
        "T": "Time period in years"
      }
    },
    keyFeatures: [
      "Calculate RD maturity amount",
      "Plan monthly savings systematically",
      "Compare different RD schemes",
      "Understand compound growth",
      "Set and achieve savings goals"
    ],
    howItWorks: [
      "Enter your monthly deposit amount",
      "Input the RD interest rate",
      "Specify the deposit tenure",
      "Get maturity amount and total interest"
    ],
    benefits: [
      "Disciplined monthly saving habit",
      "Compound interest benefits",
      "Flexible monthly amounts",
      "Safe investment option"
    ],
    example: {
      scenario: "Recurring Deposit Example",
      inputs: {
        "Monthly Deposit": "₹5,000",
        "Interest Rate": "6.0% per annum",
        "Tenure": "5 years"
      },
      result: "Maturity Amount: ₹3,48,857"
    }
  },

  "income-tax": {
    title: "Income Tax Calculator 2024-25 | Calculate Tax Online | Old vs New Tax Regime",
    description: "Free Income Tax Calculator for FY 2024-25 to calculate your tax liability under old and new tax regimes. Compare tax savings, calculate take-home salary, and optimize your tax planning. Get accurate income tax calculation with latest tax slabs, deductions, and exemptions for AY 2025-26.",
    seoKeywords: "income tax calculator, tax calculator 2024-25, income tax calculator India, old vs new tax regime calculator, tax liability calculator, salary tax calculator, take home salary calculator, tax saving calculator",
    searchQueries: [
      "income tax calculator 2024-25",
      "tax calculator India",
      "old vs new tax regime calculator",
      "salary tax calculator",
      "income tax calculator online",
      "tax liability calculator",
      "take home salary calculator",
      "tax saving calculator",
      "income tax calculation FY 2024-25",
      "tax calculator with new regime"
    ],
    formula: {
      name: "Tax Calculation Formula",
      equation: "Tax = (Taxable Income × Tax Rate) - Tax Rebates",
      variables: {
        "Taxable Income": "Total Income - Deductions - Exemptions",
        "Tax Rate": "Applicable tax slab rate",
        "Tax Rebates": "Section 87A and other rebates"
      }
    },
    keyFeatures: [
      "Compare old vs new tax regime",
      "Calculate exact tax liability",
      "Optimize tax-saving investments",
      "Plan salary structure",
      "Understand take-home salary"
    ],
    howItWorks: [
      "Enter your annual income details",
      "Add applicable deductions and exemptions",
      "Choose between old and new tax regime",
      "Get detailed tax calculation and comparison"
    ],
    benefits: [
      "Accurate tax planning",
      "Regime comparison for optimal choice",
      "Identify tax-saving opportunities",
      "Better financial planning"
    ],
    example: {
      scenario: "Tax Calculation Example",
      inputs: {
        "Annual Income": "₹12,00,000",
        "Deductions": "₹1,50,000",
        "Regime": "Old Tax Regime"
      },
      result: "Tax Liability: ₹1,17,000"
    }
  },

  swp: {
    title: "SWP Calculator - Systematic Withdrawal Plan Calculator | Retirement Income Planning",
    description: "Free SWP Calculator to plan systematic withdrawals from mutual funds for retirement income. Calculate optimal withdrawal amounts, remaining corpus, and create sustainable income streams. Plan your retirement with our comprehensive SWP calculator for mutual fund investments.",
    seoKeywords: "SWP calculator, systematic withdrawal plan calculator, retirement income calculator, mutual fund withdrawal calculator, SWP planning calculator, retirement withdrawal calculator, pension calculator",
    searchQueries: [
      "SWP calculator online",
      "systematic withdrawal plan calculator",
      "retirement income calculator",
      "mutual fund withdrawal calculator",
      "SWP planning calculator",
      "retirement withdrawal calculator",
      "pension withdrawal calculator",
      "SWP vs SIP calculator",
      "retirement corpus calculator",
      "monthly income calculator"
    ],
    formula: {
      name: "SWP Remaining Value Formula",
      equation: "RV = IV × (1 + R)^N - W × [((1 + R)^N - 1) / R]",
      variables: {
        "RV": "Remaining value after withdrawals",
        "IV": "Initial investment value",
        "R": "Monthly return rate",
        "N": "Number of months",
        "W": "Monthly withdrawal amount"
      }
    },
    keyFeatures: [
      "Plan systematic withdrawals",
      "Calculate remaining corpus value",
      "Optimize withdrawal amounts",
      "Plan retirement income",
      "Balance growth and income needs"
    ],
    howItWorks: [
      "Enter your initial investment amount",
      "Specify monthly withdrawal requirement",
      "Input expected return rate",
      "Set withdrawal period",
      "Get remaining corpus and sustainability analysis"
    ],
    benefits: [
      "Regular income from investments",
      "Tax-efficient withdrawal strategy",
      "Continued growth of remaining corpus",
      "Flexible withdrawal amounts"
    ],
    example: {
      scenario: "SWP Example",
      inputs: {
        "Initial Investment": "₹50,00,000",
        "Monthly Withdrawal": "₹25,000",
        "Expected Return": "10% per annum",
        "Period": "20 years"
      },
      result: "Remaining Corpus: ₹1,73,85,326"
    }
  },

  cagr: {
    title: "CAGR Calculator - Compound Annual Growth Rate Calculator | Investment Returns",
    description: "Free CAGR Calculator to calculate Compound Annual Growth Rate of your investments. Analyze investment performance, compare mutual funds, stocks, and portfolio returns. Calculate CAGR for accurate investment analysis and decision making.",
    seoKeywords: "CAGR calculator, compound annual growth rate calculator, investment returns calculator, mutual fund CAGR calculator, stock returns calculator, portfolio performance calculator, investment growth calculator",
    searchQueries: [
      "CAGR calculator online",
      "compound annual growth rate calculator",
      "investment returns calculator",
      "mutual fund CAGR calculator",
      "stock returns calculator",
      "calculate CAGR formula",
      "investment performance calculator",
      "portfolio CAGR calculator",
      "annual return calculator",
      "growth rate calculator"
    ],
    formula: {
      name: "CAGR Formula",
      equation: "CAGR = (Ending Value / Beginning Value)^(1/N) - 1",
      variables: {
        "CAGR": "Compound Annual Growth Rate",
        "Ending Value": "Final investment value",
        "Beginning Value": "Initial investment value",
        "N": "Number of years"
      }
    },
    keyFeatures: [
      "Calculate investment growth rate",
      "Compare different investments",
      "Analyze historical performance",
      "Understand true annual returns",
      "Make informed investment decisions"
    ],
    howItWorks: [
      "Enter initial investment value",
      "Input final investment value",
      "Specify investment period in years",
      "Get CAGR percentage and analysis"
    ],
    benefits: [
      "Standardized performance comparison",
      "Accounts for compounding effect",
      "Easy to understand metric",
      "Useful for goal planning"
    ],
    example: {
      scenario: "CAGR Calculation Example",
      inputs: {
        "Initial Value": "₹1,00,000",
        "Final Value": "₹2,50,000",
        "Time Period": "8 years"
      },
      result: "CAGR: 12.13% per annum"
    }
  },

  "capital-gains": {
    title: "Capital Gains Tax Calculator 2024-25 | STCG & LTCG Calculator India",
    description: "Free Capital Gains Tax Calculator for FY 2024-25 to calculate STCG and LTCG tax on stocks, mutual funds, and property. Calculate capital gains tax liability, exemptions, and optimize your investment tax planning with our comprehensive calculator.",
    seoKeywords: "capital gains tax calculator, STCG calculator, LTCG calculator, capital gains tax calculator India, stock capital gains calculator, mutual fund tax calculator, property capital gains calculator",
    searchQueries: [
      "capital gains tax calculator 2024-25",
      "STCG calculator India",
      "LTCG calculator India",
      "stock capital gains calculator",
      "mutual fund capital gains calculator",
      "property capital gains calculator",
      "capital gains tax calculator online",
      "equity capital gains calculator",
      "debt capital gains calculator",
      "capital gains exemption calculator"
    ],
    formula: {
      name: "Capital Gains Tax Formula",
      equation: "Tax = (Sale Price - Purchase Price - Expenses) × Tax Rate",
      variables: {
        "Sale Price": "Final selling price of the asset",
        "Purchase Price": "Original purchase price",
        "Expenses": "Transaction costs and improvements",
        "Tax Rate": "STCG or LTCG tax rate applicable"
      }
    },
    keyFeatures: [
      "Calculate STCG and LTCG separately",
      "Consider indexation benefits",
      "Factor in transaction costs",
      "Understand tax exemptions",
      "Plan tax-efficient selling strategy"
    ],
    howItWorks: [
      "Enter purchase price and date",
      "Input selling price and date",
      "Add transaction costs if any",
      "Choose asset type (equity, debt, property)",
      "Get detailed tax calculation"
    ],
    benefits: [
      "Optimize timing of asset sales",
      "Understand tax implications before selling",
      "Plan for tax payments in advance",
      "Maximize after-tax returns"
    ],
    example: {
      scenario: "Equity Investment Example",
      inputs: {
        "Purchase Price": "₹1,00,000",
        "Sale Price": "₹1,50,000",
        "Holding Period": "2 years",
        "Asset Type": "Equity"
      },
      result: "LTCG Tax: ₹5,000"
    }
  },

  // Retirement Calculators
  nps: {
    title: "NPS Calculator - National Pension Scheme Calculator | Retirement Planning 2024",
    description: "Free NPS Calculator to calculate National Pension Scheme corpus, monthly pension, and tax benefits. Plan your retirement with NPS Tier-I and Tier-II calculations. Calculate NPS maturity amount, annuity, and lump sum withdrawal with our comprehensive NPS calculator.",
    seoKeywords: "NPS calculator, national pension scheme calculator, NPS maturity calculator, NPS pension calculator, retirement planning calculator, NPS tax benefit calculator, NPS corpus calculator",
    searchQueries: [
      "NPS calculator online",
      "national pension scheme calculator",
      "NPS maturity calculator",
      "NPS pension calculator",
      "NPS tax benefit calculator",
      "retirement planning calculator",
      "NPS corpus calculator",
      "NPS Tier 1 calculator",
      "NPS Tier 2 calculator",
      "NPS withdrawal calculator"
    ],
    formula: {
      name: "NPS Maturity Formula",
      equation: "Corpus = P × [((1 + R)^N - 1) / R] × (1 + R)",
      variables: {
        "Corpus": "Total corpus at maturity",
        "P": "Monthly/Annual contribution",
        "R": "Expected annual return rate",
        "N": "Number of years until retirement"
      }
    },
    keyFeatures: [
      "Calculate NPS corpus at retirement",
      "Estimate monthly pension amount",
      "Understand tax benefits",
      "Plan retirement contributions",
      "Compare Tier-I and Tier-II accounts"
    ],
    howItWorks: [
      "Enter your monthly NPS contribution",
      "Input expected return rate",
      "Specify years until retirement",
      "Choose annuity percentage (40% minimum)",
      "Get corpus, lump sum, and pension details"
    ],
    benefits: [
      "Government co-contribution for certain categories",
      "Tax benefits under Section 80C and 80CCD",
      "Professional fund management",
      "Portable across jobs and locations"
    ],
    example: {
      scenario: "NPS Investment Example",
      inputs: {
        "Monthly Contribution": "₹5,000",
        "Expected Return": "10% per annum",
        "Years to Retirement": "25 years"
      },
      result: "Total Corpus: ₹59,51,325"
    }
  },

  epf: {
    title: "EPF Calculator - Employee Provident Fund Calculator | PF Balance Calculator",
    description: "Free EPF Calculator to calculate Employee Provident Fund maturity amount and balance. Calculate EPF corpus with employee and employer contributions, interest rates, and salary increments. Plan your retirement with our accurate PF calculator.",
    seoKeywords: "EPF calculator, employee provident fund calculator, PF calculator, PF balance calculator, provident fund calculator, EPF maturity calculator, PF corpus calculator, EPF withdrawal calculator",
    searchQueries: [
      "EPF calculator online",
      "employee provident fund calculator",
      "PF calculator India",
      "PF balance calculator",
      "EPF maturity calculator",
      "provident fund calculator",
      "EPF corpus calculator",
      "PF withdrawal calculator",
      "EPF interest calculator",
      "PF pension calculator"
    ],
    formula: {
      name: "EPF Maturity Formula",
      equation: "EPF = (Employee Contribution + Employer Contribution) × Compound Interest",
      variables: {
        "Employee Contribution": "12% of basic salary",
        "Employer Contribution": "12% of basic salary (3.67% to EPF)",
        "Compound Interest": "Annual EPF interest rate compounded"
      }
    },
    keyFeatures: [
      "Calculate EPF maturity amount",
      "Include both employee and employer contributions",
      "Factor in annual salary increments",
      "Understand withdrawal rules",
      "Plan retirement corpus"
    ],
    howItWorks: [
      "Enter your current basic salary",
      "Input expected annual increment",
      "Specify years of service",
      "Current EPF interest rate is applied",
      "Get total EPF corpus at retirement"
    ],
    benefits: [
      "Guaranteed returns with government backing",
      "Tax benefits on contributions",
      "Employer matching contribution",
      "Partial withdrawal facility"
    ],
    example: {
      scenario: "EPF Calculation Example",
      inputs: {
        "Basic Salary": "₹50,000",
        "Annual Increment": "8%",
        "Years of Service": "30 years"
      },
      result: "EPF Corpus: ₹1,89,46,231"
    }
  },

  gratuity: {
    title: "Gratuity Calculator - Calculate Gratuity Amount Online | Employee Benefits",
    description: "Free Gratuity Calculator to calculate employee gratuity amount based on salary and years of service. Calculate gratuity as per Payment of Gratuity Act 1972. Understand gratuity eligibility, tax implications, and retirement benefits with our accurate calculator.",
    seoKeywords: "gratuity calculator, employee gratuity calculator, gratuity amount calculator, gratuity calculation formula, gratuity calculator India, retirement gratuity calculator, gratuity tax calculator",
    searchQueries: [
      "gratuity calculator online",
      "employee gratuity calculator",
      "calculate gratuity amount",
      "gratuity calculator India",
      "gratuity formula calculator",
      "retirement gratuity calculator",
      "gratuity eligibility calculator",
      "gratuity tax calculator",
      "gratuity payment calculator",
      "service gratuity calculator"
    ],
    formula: {
      name: "Gratuity Formula",
      equation: "Gratuity = (Last Salary × 15 × Years of Service) / 26",
      variables: {
        "Last Salary": "Basic salary + DA of last month",
        "Years of Service": "Completed years of service",
        "15": "Number of days for each year of service",
        "26": "Number of working days in a month"
      }
    },
    keyFeatures: [
      "Calculate gratuity amount accurately",
      "Understand eligibility criteria",
      "Factor in salary components",
      "Consider service period",
      "Know tax implications"
    ],
    howItWorks: [
      "Enter last drawn basic salary",
      "Input years of completed service",
      "Calculator applies the standard formula",
      "Get gratuity amount and tax details"
    ],
    benefits: [
      "Retirement financial security",
      "Tax exemption up to specified limits",
      "Mandatory employer contribution",
      "Additional retirement corpus"
    ],
    example: {
      scenario: "Gratuity Calculation Example",
      inputs: {
        "Last Basic Salary": "₹80,000",
        "Years of Service": "20 years"
      },
      result: "Gratuity Amount: ₹9,23,077"
    }
  },

  // General Calculators
  "compound-interest": {
    title: "Compound Interest Calculator - Calculate Compound Interest Online | Investment Growth",
    description: "Free Compound Interest Calculator to calculate investment growth with compounding. Understand the power of compound interest for long-term wealth creation. Calculate compound interest with different compounding frequencies and investment periods.",
    seoKeywords: "compound interest calculator, compound interest formula calculator, investment compound calculator, compound growth calculator, compound interest calculation, compounding calculator, investment growth calculator",
    searchQueries: [
      "compound interest calculator online",
      "compound interest formula calculator",
      "calculate compound interest",
      "investment compound calculator",
      "compound growth calculator",
      "compounding calculator",
      "compound interest calculation formula",
      "investment growth calculator",
      "compound interest vs simple interest",
      "power of compounding calculator"
    ],
    formula: {
      name: "Compound Interest Formula",
      equation: "A = P(1 + R/100)^T",
      variables: {
        "A": "Final amount after compound interest",
        "P": "Principal amount",
        "R": "Annual interest rate",
        "T": "Time period in years"
      }
    },
    keyFeatures: [
      "Calculate compound growth",
      "Compare different compounding frequencies",
      "Understand time value of money",
      "Plan long-term investments",
      "Visualize growth over time"
    ],
    howItWorks: [
      "Enter the principal amount",
      "Input annual interest rate",
      "Specify time period",
      "Choose compounding frequency",
      "Get final amount and interest earned"
    ],
    benefits: [
      "Exponential growth over time",
      "Higher returns than simple interest",
      "Foundation of investment planning",
      "Demonstrates patience in investing"
    ],
    example: {
      scenario: "Compound Interest Example",
      inputs: {
        "Principal": "₹1,00,000",
        "Interest Rate": "8% per annum",
        "Time Period": "10 years"
      },
      result: "Final Amount: ₹2,15,892"
    }
  },

  "simple-interest": {
    title: "Simple Interest Calculator - Calculate Simple Interest Online | SI Formula",
    description: "Free Simple Interest Calculator to calculate interest on principal amount. Learn simple interest formula, calculate SI for loans and investments. Compare simple vs compound interest with our easy-to-use simple interest calculator.",
    seoKeywords: "simple interest calculator, simple interest formula calculator, SI calculator, calculate simple interest, simple interest calculation, loan interest calculator, simple interest vs compound interest",
    searchQueries: [
      "simple interest calculator online",
      "simple interest formula calculator",
      "calculate simple interest",
      "SI calculator",
      "simple interest calculation formula",
      "loan simple interest calculator",
      "simple interest vs compound interest",
      "simple interest rate calculator",
      "basic interest calculator",
      "simple interest math calculator"
    ],
    formula: {
      name: "Simple Interest Formula",
      equation: "SI = (P × R × T) / 100",
      variables: {
        "SI": "Simple Interest",
        "P": "Principal amount",
        "R": "Annual interest rate",
        "T": "Time period in years"
      }
    },
    keyFeatures: [
      "Calculate simple interest easily",
      "Understand basic interest concepts",
      "Compare with compound interest",
      "Quick calculations for short-term loans",
      "Educational tool for interest learning"
    ],
    howItWorks: [
      "Enter the principal amount",
      "Input annual interest rate",
      "Specify time period in years",
      "Get simple interest and total amount"
    ],
    benefits: [
      "Easy to understand and calculate",
      "Predictable interest earnings",
      "Useful for short-term calculations",
      "Foundation for financial literacy"
    ],
    example: {
      scenario: "Simple Interest Example",
      inputs: {
        "Principal": "₹50,000",
        "Interest Rate": "6% per annum",
        "Time Period": "3 years"
      },
      result: "Simple Interest: ₹9,000"
    }
  },

  inflation: {
    title: "Inflation Calculator - Calculate Inflation Impact | Purchasing Power Calculator",
    description: "Free Inflation Calculator to calculate inflation impact on purchasing power over time. Understand how inflation affects money value, plan inflation-adjusted investments, and calculate future costs with our comprehensive inflation calculator.",
    seoKeywords: "inflation calculator, purchasing power calculator, inflation impact calculator, inflation rate calculator, money value calculator, inflation adjusted calculator, cost of living calculator, future value inflation calculator",
    searchQueries: [
      "inflation calculator online",
      "purchasing power calculator",
      "inflation impact calculator",
      "calculate inflation rate",
      "money value calculator",
      "inflation adjusted calculator",
      "cost of living calculator",
      "future value inflation calculator",
      "inflation erosion calculator",
      "real vs nominal calculator"
    ],
    formula: {
      name: "Inflation Adjusted Value Formula",
      equation: "Future Value = Present Value × (1 + Inflation Rate)^Years",
      variables: {
        "Future Value": "Amount needed in future",
        "Present Value": "Current amount/cost",
        "Inflation Rate": "Annual inflation rate",
        "Years": "Number of years"
      }
    },
    keyFeatures: [
      "Calculate future cost of goods",
      "Understand purchasing power erosion",
      "Plan for inflation in investments",
      "Compare historical inflation impact",
      "Make inflation-adjusted financial plans"
    ],
    howItWorks: [
      "Enter current cost or amount",
      "Input expected inflation rate",
      "Specify number of years",
      "Get future value and purchasing power loss"
    ],
    benefits: [
      "Better long-term financial planning",
      "Understand real vs nominal returns",
      "Plan adequate retirement corpus",
      "Make inflation-beating investment choices"
    ],
    example: {
      scenario: "Inflation Impact Example",
      inputs: {
        "Current Cost": "₹1,00,000",
        "Inflation Rate": "6% per annum",
        "Time Period": "10 years"
      },
      result: "Future Cost: ₹1,79,085"
    }
  },

  "net-worth": {
    title: "Net Worth Calculator - Calculate Your Net Worth Online | Personal Finance",
    description: "Free Net Worth Calculator to calculate your total net worth by listing all assets and liabilities. Track your financial progress, understand your wealth position, and plan for financial goals with our comprehensive net worth calculator.",
    seoKeywords: "net worth calculator, personal net worth calculator, calculate net worth online, wealth calculator, financial net worth calculator, assets liabilities calculator, personal finance calculator, wealth tracking calculator",
    searchQueries: [
      "net worth calculator online",
      "personal net worth calculator",
      "calculate my net worth",
      "wealth calculator online",
      "assets and liabilities calculator",
      "financial net worth calculator",
      "personal finance net worth",
      "net worth tracking calculator",
      "how to calculate net worth",
      "wealth assessment calculator"
    ],
    formula: {
      name: "Net Worth Formula",
      equation: "Net Worth = Total Assets - Total Liabilities",
      variables: {
        "Net Worth": "Your total financial worth",
        "Total Assets": "Sum of all valuable possessions (cash, investments, property, etc.)",
        "Total Liabilities": "Sum of all debts and obligations (loans, credit cards, etc.)"
      }
    },
    keyFeatures: [
      "Calculate comprehensive net worth",
      "Track assets and liabilities separately",
      "Categorize different types of assets",
      "Monitor financial progress over time",
      "Understand wealth distribution"
    ],
    howItWorks: [
      "List all your assets (cash, investments, property, vehicles)",
      "Enter all your liabilities (loans, credit cards, debts)",
      "Calculator automatically computes your net worth",
      "View detailed breakdown of assets vs liabilities",
      "Track your financial health category"
    ],
    benefits: [
      "Clear picture of your financial position",
      "Track wealth building progress",
      "Identify areas for financial improvement",
      "Set realistic financial goals"
    ],
    example: {
      scenario: "Net Worth Calculation Example",
      inputs: {
        "Total Assets": "₹50,00,000 (House + Investments + Cash)",
        "Total Liabilities": "₹20,00,000 (Home Loan + Car Loan)",
        "Calculation": "Assets - Liabilities"
      },
      result: "Net Worth: ₹30,00,000"
    }
  },

  discount: {
    title: "Discount Calculator - Calculate Final Price After Percentage Discounts",
    description: "Free Discount Calculator to calculate final price after applying percentage discounts and taxes. Calculate multiple discounts, additional offers, and tax calculations for shopping, sales, and business pricing decisions.",
    seoKeywords: "discount calculator, percentage discount calculator, sale price calculator, discount percentage calculator, price after discount calculator, shopping discount calculator, final price calculator",
    searchQueries: [
      "discount calculator online",
      "percentage discount calculator",
      "sale price calculator",
      "calculate discount percentage",
      "price after discount calculator",
      "shopping discount calculator",
      "final price after discount",
      "multiple discount calculator",
      "discount and tax calculator",
      "retail discount calculator"
    ],
    formula: {
      name: "Discount Calculation Formula",
      equation: "Final Price = (Original Price - Discount) + Tax",
      variables: {
        "Final Price": "Price after applying discounts and adding taxes",
        "Original Price": "Initial price before any discounts",
        "Discount": "Amount reduced from original price (percentage-based)",
        "Tax": "Additional charges applied on discounted price"
      }
    },
    keyFeatures: [
      "Calculate single and multiple discounts",
      "Apply additional discount offers",
      "Include tax calculations",
      "Show total savings amount",
      "Display savings percentage"
    ],
    howItWorks: [
      "Enter the original price of the item",
      "Add primary discount percentage",
      "Include additional discounts if applicable",
      "Add tax percentage if required",
      "Get final price and total savings"
    ],
    benefits: [
      "Smart shopping decisions",
      "Compare different offers",
      "Calculate actual savings",
      "Business pricing strategies"
    ],
    example: {
      scenario: "Shopping Discount Example",
      inputs: {
        "Original Price": "₹1,000",
        "Discount": "20% + 5% additional",
        "Tax": "18% GST"
      },
      result: "Final Price: ₹944, Savings: ₹240"
    }
  },

  "fuel-cost": {
    title: "Fuel Cost Calculator - Calculate Daily Monthly Fuel Expenses | Mileage Calculator",
    description: "Free Fuel Cost Calculator to calculate daily, monthly, and yearly fuel expenses based on fuel price and vehicle mileage. Plan your transportation budget and track fuel consumption for cars, bikes, and commercial vehicles.",
    seoKeywords: "fuel cost calculator, fuel expense calculator, mileage calculator, petrol cost calculator, diesel cost calculator, fuel consumption calculator, transportation cost calculator, vehicle running cost calculator",
    searchQueries: [
      "fuel cost calculator online",
      "daily fuel cost calculator",
      "monthly fuel expense calculator",
      "petrol cost calculator",
      "diesel cost calculator",
      "vehicle mileage calculator",
      "fuel consumption calculator",
      "transportation cost calculator",
      "car running cost calculator",
      "fuel budget calculator"
    ],
    formula: {
      name: "Fuel Cost Calculation Formula",
      equation: "Fuel Cost = (Distance ÷ Mileage) × Fuel Price",
      variables: {
        "Fuel Cost": "Total cost of fuel for the given distance",
        "Distance": "Total distance to be traveled (in km)",
        "Mileage": "Vehicle's fuel efficiency (km per liter)",
        "Fuel Price": "Current price of fuel per liter"
      }
    },
    keyFeatures: [
      "Calculate daily and monthly fuel costs",
      "Track fuel consumption patterns",
      "Compare different vehicles",
      "Budget transportation expenses",
      "Analyze cost per kilometer"
    ],
    howItWorks: [
      "Enter current fuel price per liter",
      "Input your vehicle's mileage (km/L)",
      "Choose daily or monthly calculation",
      "Enter distance traveled",
      "Get detailed cost breakdown"
    ],
    benefits: [
      "Budget transportation costs",
      "Compare vehicle efficiency",
      "Plan travel expenses",
      "Track fuel consumption"
    ],
    example: {
      scenario: "Daily Commute Fuel Cost",
      inputs: {
        "Fuel Price": "₹100/liter",
        "Vehicle Mileage": "15 km/L",
        "Daily Distance": "50 km"
      },
      result: "Daily Cost: ₹333, Monthly: ₹10,000"
    }
  },

  "stock-average": {
    title: "Stock Average Calculator - Calculate Average Stock Price | Portfolio Average Calculator",
    description: "Free Stock Average Calculator to calculate average stock price over multiple purchases. Track your stock portfolio, calculate average buying price, and monitor profit/loss with our comprehensive stock averaging calculator for smart investment decisions.",
    seoKeywords: "stock average calculator, average stock price calculator, portfolio average calculator, stock cost averaging calculator, share average price calculator, investment average calculator, stock portfolio calculator",
    searchQueries: [
      "stock average calculator online",
      "average stock price calculator",
      "portfolio average calculator",
      "stock cost averaging calculator",
      "share average price calculator",
      "calculate average stock price",
      "investment average calculator",
      "stock portfolio calculator",
      "stock buying average calculator",
      "equity average price calculator"
    ],
    formula: {
      name: "Stock Average Price Formula",
      equation: "Average Price = Total Investment ÷ Total Shares",
      variables: {
        "Average Price": "Average cost per share across all purchases",
        "Total Investment": "Sum of all money invested in the stock",
        "Total Shares": "Total number of shares purchased across all transactions"
      }
    },
    keyFeatures: [
      "Calculate average stock price across multiple purchases",
      "Track total investment and shares",
      "Monitor current profit/loss",
      "Add unlimited purchase transactions",
      "Real-time portfolio valuation"
    ],
    howItWorks: [
      "Add each stock purchase with quantity and price",
      "Calculator computes average price automatically",
      "Enter current market price to see profit/loss",
      "Track your investment performance",
      "Plan future investment decisions"
    ],
    benefits: [
      "Make informed investment decisions",
      "Track portfolio performance",
      "Calculate profit/loss accurately",
      "Plan dollar-cost averaging strategy"
    ],
    example: {
      scenario: "Stock Average Calculation Example",
      inputs: {
        "Purchase 1": "100 shares @ ₹150",
        "Purchase 2": "50 shares @ ₹120",
        "Current Price": "₹160"
      },
      result: "Average Price: ₹140, Profit: ₹3,000 (14.3%)"
    }
  },

  "budget-planner": {
    title: "Budget Planner Calculator - Monthly Budget Tracker | Income vs Expense Calculator",
    description: "Free Budget Planner Calculator to track monthly income vs expenses. Plan your personal budget, categorize expenses, monitor savings rate, and achieve financial goals with our comprehensive budget planning tool.",
    seoKeywords: "budget planner calculator, monthly budget calculator, income expense calculator, personal budget planner, budget tracker calculator, expense tracker calculator, savings rate calculator",
    searchQueries: [
      "budget planner calculator online",
      "monthly budget calculator",
      "income vs expense calculator",
      "personal budget planner",
      "budget tracker calculator",
      "expense tracker calculator",
      "savings rate calculator",
      "family budget calculator",
      "household budget planner",
      "budget planning tool"
    ],
    formula: {
      name: "Budget Planning Formula",
      equation: "Net Income = Total Income - Total Expenses",
      variables: {
        "Net Income": "Amount left after all expenses (savings potential)",
        "Total Income": "Sum of all income sources (salary, freelance, etc.)",
        "Total Expenses": "Sum of all monthly expenses and bills"
      }
    },
    keyFeatures: [
      "Track multiple income sources",
      "Categorize all expenses",
      "Calculate savings rate",
      "Budget surplus/deficit analysis",
      "Expense breakdown by category"
    ],
    howItWorks: [
      "Add all your income sources",
      "List all monthly expenses by category",
      "Calculator shows net income automatically",
      "View savings rate and budget status",
      "Get personalized budget recommendations"
    ],
    benefits: [
      "Control your finances",
      "Identify spending patterns",
      "Increase savings rate",
      "Achieve financial goals"
    ],
    example: {
      scenario: "Monthly Budget Example",
      inputs: {
        "Income": "₹80,000 (Salary + Freelance)",
        "Expenses": "₹65,000 (Rent, Food, etc.)",
        "Net Income": "₹15,000"
      },
      result: "Savings Rate: 18.75%, Budget Surplus"
    }
  },

  "savings-goal": {
    title: "Savings Goal Calculator - Daily Monthly Savings Tracker | Financial Goal Planner",
    description: "Free Savings Goal Calculator to plan how much to save daily/monthly to reach your financial goals. Set savings targets, track progress, and calculate the exact amount needed to achieve your dreams with our goal planning tool.",
    seoKeywords: "savings goal calculator, daily savings calculator, monthly savings calculator, financial goal calculator, savings target calculator, goal planning calculator, savings tracker calculator",
    searchQueries: [
      "savings goal calculator online",
      "daily savings calculator",
      "monthly savings calculator",
      "financial goal calculator",
      "savings target calculator",
      "goal planning calculator",
      "savings tracker calculator",
      "how much to save calculator",
      "savings plan calculator",
      "financial goal planner"
    ],
    formula: {
      name: "Savings Goal Formula",
      equation: "Daily Savings = (Goal Amount - Current Savings) ÷ Days Remaining",
      variables: {
        "Daily Savings": "Amount to save each day to reach goal",
        "Goal Amount": "Target amount you want to save",
        "Current Savings": "Amount already saved towards goal",
        "Days Remaining": "Number of days until target date"
      }
    },
    keyFeatures: [
      "Calculate daily/weekly/monthly savings needed",
      "Track progress towards goal",
      "Set realistic target dates",
      "Visual progress indicator",
      "Goal achievability assessment"
    ],
    howItWorks: [
      "Set your savings goal amount",
      "Enter current savings (if any)",
      "Choose your target date",
      "Get daily/monthly savings plan",
      "Track progress with visual indicators"
    ],
    benefits: [
      "Achieve financial goals faster",
      "Stay motivated with progress tracking",
      "Plan realistic savings targets",
      "Build consistent saving habits"
    ],
    example: {
      scenario: "Vacation Savings Goal",
      inputs: {
        "Goal": "₹1,00,000 for vacation",
        "Current Savings": "₹25,000",
        "Target Date": "12 months"
      },
      result: "Save ₹208/day or ₹6,250/month"
    }
  },

  "bill-split": {
    title: "Bill Split Calculator - Split Bills Among Friends | Group Bill Calculator",
    description: "Free Bill Split Calculator to split bills fairly among friends, roommates, or group outings. Calculate individual shares, handle custom amounts, and include tips for restaurants, parties, and shared expenses.",
    seoKeywords: "bill split calculator, split bill calculator, group bill calculator, restaurant bill split, roommate bill split, party bill calculator, expense split calculator",
    searchQueries: [
      "bill split calculator online",
      "split bill calculator",
      "group bill calculator",
      "restaurant bill split calculator",
      "roommate bill split",
      "party expense calculator",
      "expense split calculator",
      "divide bill calculator",
      "shared bill calculator",
      "group expense calculator"
    ],
    formula: {
      name: "Bill Split Formula",
      equation: "Per Person = (Total Bill + Tip) ÷ Number of People",
      variables: {
        "Per Person": "Amount each person needs to pay",
        "Total Bill": "Original bill amount before tip",
        "Tip": "Tip amount (percentage of bill)",
        "Number of People": "Total people sharing the bill"
      }
    },
    keyFeatures: [
      "Split bills equally among any number of people",
      "Handle custom amounts for specific individuals",
      "Include tip calculations",
      "Support different payment scenarios",
      "Real-time calculation updates"
    ],
    howItWorks: [
      "Enter the total bill amount",
      "Set tip percentage",
      "Add number of people",
      "Customize individual amounts if needed",
      "Get per-person breakdown instantly"
    ],
    benefits: [
      "Fair bill splitting",
      "Avoid payment disputes",
      "Handle complex scenarios",
      "Quick group calculations"
    ],
    example: {
      scenario: "Restaurant Bill Split",
      inputs: {
        "Total Bill": "₹2,000",
        "Tip": "18%",
        "People": "4 friends"
      },
      result: "Each person pays: ₹590"
    }
  },

  "tip-calculator": {
    title: "Tip Calculator - Calculate Tips and Split Bills | Restaurant Tip Calculator",
    description: "Free Tip Calculator to calculate tips based on service quality and split bills with tips per person. Perfect for restaurants, bars, delivery, and service industries with customizable tip percentages.",
    seoKeywords: "tip calculator, restaurant tip calculator, tip calculator with split, service tip calculator, delivery tip calculator, bar tip calculator, gratuity calculator",
    searchQueries: [
      "tip calculator online",
      "restaurant tip calculator",
      "tip calculator with split",
      "service tip calculator",
      "delivery tip calculator",
      "bar tip calculator",
      "gratuity calculator",
      "tip percentage calculator",
      "dining tip calculator",
      "bill tip calculator"
    ],
    formula: {
      name: "Tip Calculation Formula",
      equation: "Tip Amount = Bill Amount × Tip Percentage",
      variables: {
        "Tip Amount": "Amount to tip based on service",
        "Bill Amount": "Total bill before tip",
        "Tip Percentage": "Percentage based on service quality"
      }
    },
    keyFeatures: [
      "Service quality-based tip suggestions",
      "Customizable tip percentages",
      "Split bill with tip per person",
      "Quick tip percentage buttons",
      "Comprehensive tipping guide"
    ],
    howItWorks: [
      "Enter your bill amount",
      "Select service quality or custom tip %",
      "Add number of people if splitting",
      "Get tip amount and total per person",
      "Follow tipping guidelines for different services"
    ],
    benefits: [
      "Fair tipping based on service",
      "Easy bill splitting with tips",
      "Learn proper tipping etiquette",
      "Quick calculations for any scenario"
    ],
    example: {
      scenario: "Restaurant Dinner",
      inputs: {
        "Bill": "₹1,500",
        "Service": "Good (18%)",
        "People": "2"
      },
      result: "Tip: ₹270, Total per person: ₹885"
    }
  },

  "subscription-tracker": {
    title: "Subscription Cost Tracker - Track Monthly Yearly Subscription Costs | Streaming Calculator",
    description: "Free Subscription Cost Tracker to calculate total monthly and yearly costs of all your streaming, app, and digital subscriptions. Manage Netflix, Spotify, and other recurring services efficiently.",
    seoKeywords: "subscription cost tracker, subscription calculator, streaming cost calculator, monthly subscription tracker, app subscription calculator, recurring payment calculator",
    searchQueries: [
      "subscription cost tracker",
      "subscription calculator online",
      "streaming cost calculator",
      "monthly subscription tracker",
      "app subscription calculator",
      "recurring payment calculator",
      "subscription expense tracker",
      "digital subscription calculator",
      "subscription budget calculator",
      "subscription cost analyzer"
    ],
    formula: {
      name: "Subscription Cost Formula",
      equation: "Total Cost = Σ(Individual Subscription × Billing Frequency)",
      variables: {
        "Total Cost": "Combined cost of all subscriptions",
        "Individual Subscription": "Cost of each service",
        "Billing Frequency": "How often you're charged (monthly, yearly, etc.)"
      }
    },
    keyFeatures: [
      "Track unlimited subscriptions",
      "Multiple billing cycles (weekly, monthly, yearly)",
      "Category-wise breakdown",
      "Popular service quick-add",
      "Cost optimization suggestions"
    ],
    howItWorks: [
      "Add all your subscriptions",
      "Set cost and billing frequency",
      "Categorize by service type",
      "View total monthly/yearly costs",
      "Identify savings opportunities"
    ],
    benefits: [
      "Control subscription spending",
      "Identify unused services",
      "Budget recurring expenses",
      "Optimize subscription portfolio"
    ],
    example: {
      scenario: "Digital Subscriptions",
      inputs: {
        "Netflix": "₹649/month",
        "Spotify": "₹119/month",
        "Amazon Prime": "₹1,499/year"
      },
      result: "Monthly total: ₹893, Yearly: ₹10,715"
    }
  },

  "daily-interest": {
    title: "Daily Interest Calculator - Calculate Daily Simple Compound Interest | Short Term Interest",
    description: "Free Daily Interest Calculator for simple and compound interest on short-term savings, loans, and investments. Calculate daily interest earnings and total returns for any time period.",
    seoKeywords: "daily interest calculator, daily compound interest calculator, short term interest calculator, daily simple interest calculator, daily savings calculator, daily loan interest calculator",
    searchQueries: [
      "daily interest calculator online",
      "daily compound interest calculator",
      "short term interest calculator",
      "daily simple interest calculator",
      "daily savings interest calculator",
      "daily loan interest calculator",
      "calculate daily interest",
      "daily interest rate calculator",
      "short term investment calculator",
      "daily earnings calculator"
    ],
    formula: {
      name: "Daily Interest Formula",
      equation: "Daily Interest = Principal × (Annual Rate ÷ 365) ÷ 100",
      variables: {
        "Daily Interest": "Interest earned or charged per day",
        "Principal": "Initial amount invested or borrowed",
        "Annual Rate": "Yearly interest rate percentage",
        "Days": "Number of days for calculation"
      }
    },
    keyFeatures: [
      "Simple and compound interest calculations",
      "Flexible time periods (days to years)",
      "Daily interest rate breakdown",
      "Comparison between interest types",
      "Quick preset buttons for common periods"
    ],
    howItWorks: [
      "Enter principal amount",
      "Set annual interest rate",
      "Choose number of days",
      "Select simple or compound interest",
      "Get daily and total interest breakdown"
    ],
    benefits: [
      "Plan short-term investments",
      "Calculate loan interest costs",
      "Compare investment options",
      "Understand daily earnings"
    ],
    example: {
      scenario: "30-Day Fixed Deposit",
      inputs: {
        "Principal": "₹1,00,000",
        "Annual Rate": "8%",
        "Period": "30 days"
      },
      result: "Daily interest: ₹22, Total: ₹658"
    }
  },

  "monthly-expense": {
    title: "Monthly Expense Split Calculator - Categorize Analyze Monthly Expenses | Budget Tracker",
    description: "Free Monthly Expense Split Calculator to categorize and analyze your monthly expenses by rent, food, utilities, and more. Track spending patterns with budget recommendations and expense optimization tips.",
    seoKeywords: "monthly expense calculator, expense split calculator, expense categorizer, monthly budget tracker, expense analyzer, spending tracker, budget breakdown calculator",
    searchQueries: [
      "monthly expense calculator",
      "expense split calculator",
      "expense categorizer online",
      "monthly budget tracker",
      "expense analyzer calculator",
      "spending tracker calculator",
      "budget breakdown calculator",
      "expense category calculator",
      "monthly spending calculator",
      "expense budget planner"
    ],
    formula: {
      name: "Expense Analysis Formula",
      equation: "Category % = (Category Expense ÷ Total Expenses) × 100",
      variables: {
        "Category %": "Percentage of total expenses for each category",
        "Category Expense": "Amount spent in specific category",
        "Total Expenses": "Sum of all monthly expenses"
      }
    },
    keyFeatures: [
      "Categorize expenses by type (rent, food, utilities)",
      "Budget recommendations based on 50/30/20 rule",
      "Expense percentage breakdown",
      "Visual progress indicators",
      "Money-saving optimization tips"
    ],
    howItWorks: [
      "Add your monthly expenses by category",
      "Set amounts for rent, food, transportation, etc.",
      "View percentage breakdown of spending",
      "Get budget recommendations",
      "Identify areas for cost optimization"
    ],
    benefits: [
      "Understand spending patterns",
      "Optimize budget allocation",
      "Identify overspending categories",
      "Plan better financial habits"
    ],
    example: {
      scenario: "Monthly Expense Analysis",
      inputs: {
        "Rent": "₹25,000 (50%)",
        "Food": "₹8,000 (16%)",
        "Transport": "₹5,000 (10%)"
      },
      result: "Total: ₹50,000, Budget status: Balanced"
    }
  },

  "upi-spending": {
    title: "UPI Daily Spending Calculator - Track Digital Wallet Spending Habits | UPI Tracker",
    description: "Free UPI Daily Spending Calculator to track your UPI and digital wallet spending habits. Monitor daily expenses, categorize transactions, and control your digital payment spending with smart insights.",
    seoKeywords: "UPI spending calculator, digital wallet tracker, UPI expense tracker, daily spending calculator, digital payment tracker, UPI transaction tracker, mobile payment calculator",
    searchQueries: [
      "UPI spending calculator",
      "digital wallet spending tracker",
      "UPI expense calculator",
      "daily UPI spending tracker",
      "digital payment calculator",
      "UPI transaction tracker",
      "mobile payment spending",
      "PhonePe spending tracker",
      "Google Pay expense tracker",
      "Paytm spending calculator"
    ],
    formula: {
      name: "UPI Spending Analysis",
      equation: "Daily Budget Status = Daily Spending ÷ Daily Budget × 100",
      variables: {
        "Daily Budget Status": "Percentage of daily budget used",
        "Daily Spending": "Total UPI transactions for the day",
        "Daily Budget": "Set daily spending limit"
      }
    },
    keyFeatures: [
      "Track daily UPI transactions",
      "Categorize digital payments",
      "Set daily spending budgets",
      "Time-based spending analysis",
      "Popular UPI app integration"
    ],
    howItWorks: [
      "Add your daily UPI transactions",
      "Categorize by food, transport, shopping, etc.",
      "Set daily spending budget",
      "Track spending by time of day",
      "Get spending insights and tips"
    ],
    benefits: [
      "Control digital spending",
      "Understand payment patterns",
      "Avoid overspending",
      "Track small expenses"
    ],
    example: {
      scenario: "Daily UPI Spending",
      inputs: {
        "Food": "₹200 (lunch)",
        "Transport": "₹50 (auto)",
        "Shopping": "₹300 (groceries)"
      },
      result: "Daily total: ₹550, Weekly: ₹3,850"
    }
  },

  "grocery-budget": {
    title: "Grocery Budget Calculator - Estimate Monthly Grocery Needs | Family Food Budget",
    description: "Free Grocery Budget Calculator to estimate monthly grocery needs based on family size, diet preferences, and location. Plan your food budget with category-wise breakdown and money-saving tips.",
    seoKeywords: "grocery budget calculator, family food budget calculator, monthly grocery calculator, food budget planner, grocery expense calculator, family meal budget calculator",
    searchQueries: [
      "grocery budget calculator",
      "family food budget calculator",
      "monthly grocery budget",
      "food budget calculator",
      "grocery expense calculator",
      "family meal budget",
      "grocery cost calculator",
      "food budget planner",
      "monthly food expense",
      "grocery shopping budget"
    ],
    formula: {
      name: "Grocery Budget Formula",
      equation: "Monthly Budget = (Family Size × Base Cost × Location × Diet × Preferences)",
      variables: {
        "Monthly Budget": "Estimated monthly grocery expense",
        "Family Size": "Number of adults, children, and infants",
        "Base Cost": "Base daily cost per person",
        "Location": "City tier multiplier",
        "Diet": "Vegetarian/non-vegetarian multiplier",
        "Preferences": "Organic, brand, and shopping preferences"
      }
    },
    keyFeatures: [
      "Family size-based calculations",
      "Diet type considerations (veg/non-veg)",
      "Location-based cost adjustments",
      "Organic and brand preferences",
      "Category-wise budget breakdown"
    ],
    howItWorks: [
      "Enter family details (adults, children, infants)",
      "Select diet type and location",
      "Set preferences for organic, brands, eating out",
      "Get monthly grocery budget estimate",
      "View category-wise breakdown and tips"
    ],
    benefits: [
      "Plan monthly food budget",
      "Optimize grocery spending",
      "Compare different scenarios",
      "Get money-saving tips"
    ],
    example: {
      scenario: "Family of 4 Grocery Budget",
      inputs: {
        "Family": "2 adults, 2 children",
        "Diet": "Mixed (veg + non-veg)",
        "Location": "Metro city"
      },
      result: "Monthly budget: ₹18,000"
    }
  },

  "commute-cost": {
    title: "Commute Cost Calculator - Daily Weekly Fuel Public Transport Cost | Travel Calculator",
    description: "Free Commute Cost Calculator to calculate daily, weekly, and monthly commute costs for fuel, public transport, and mixed travel. Compare different transport modes and find the most cost-effective option.",
    seoKeywords: "commute cost calculator, daily travel cost calculator, fuel cost calculator, public transport cost calculator, travel expense calculator, commute budget calculator",
    searchQueries: [
      "commute cost calculator",
      "daily travel cost calculator",
      "fuel commute calculator",
      "public transport cost calculator",
      "travel expense calculator",
      "commute budget calculator",
      "daily fuel cost calculator",
      "metro bus cost calculator",
      "car vs public transport cost",
      "commute savings calculator"
    ],
    formula: {
      name: "Commute Cost Formula",
      equation: "Daily Cost = (Distance × 2 × Cost per KM) + Parking + Tolls",
      variables: {
        "Daily Cost": "Total daily commute expense",
        "Distance": "One-way distance to work",
        "Cost per KM": "Fuel cost per km or transport rate",
        "Parking": "Daily parking charges",
        "Tolls": "Daily toll charges"
      }
    },
    keyFeatures: [
      "Multiple transport mode calculations",
      "Car, bike, bus, metro, auto rickshaw options",
      "Fuel cost and mileage considerations",
      "Parking and toll cost inclusion",
      "Transport mode comparison"
    ],
    howItWorks: [
      "Enter commute distance and working days",
      "Select primary transport mode",
      "Input relevant costs (fuel, passes, rates)",
      "Get daily, weekly, monthly cost breakdown",
      "Compare with other transport options"
    ],
    benefits: [
      "Choose most economical transport",
      "Plan commute budget",
      "Compare transport options",
      "Identify cost-saving opportunities"
    ],
    example: {
      scenario: "25km Daily Commute",
      inputs: {
        "Distance": "25 km one-way",
        "Mode": "Personal car",
        "Fuel": "₹100/L, 15 km/L"
      },
      result: "Daily: ₹433, Monthly: ₹9,533"
    }
  }
}

// Export individual calculator data for easy access
export const getCalculatorDescription = (calculatorId) => {
  return calculatorDescriptions[calculatorId] || null
}
