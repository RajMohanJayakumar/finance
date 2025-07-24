// Calculator descriptions, formulas, and educational content
export const calculatorDescriptions = {
  // Loan Calculators
  emi: {
    title: "EMI Calculator - Equated Monthly Installment",
    description: "An EMI (Equated Monthly Installment) calculator helps you determine the fixed monthly payment amount for any loan. Whether it's a home loan, personal loan, or car loan, this calculator provides accurate EMI calculations along with a detailed amortization schedule.",
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
    title: "SIP Calculator - Systematic Investment Plan Calculator",
    description: "A SIP (Systematic Investment Plan) calculator helps you calculate the potential returns from your mutual fund investments through systematic monthly contributions. It demonstrates the power of compounding and rupee cost averaging in wealth creation.",
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
    title: "Fixed Deposit Calculator - FD Maturity Calculator",
    description: "A Fixed Deposit (FD) calculator helps you determine the maturity amount and interest earned on your fixed deposit investment. It considers the principal amount, interest rate, and tenure to provide accurate calculations for both simple and compound interest scenarios.",
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
    title: "PPF Calculator - Public Provident Fund Calculator",
    description: "A PPF (Public Provident Fund) calculator helps you calculate the maturity amount for your PPF investments. PPF is a 15-year tax-saving investment scheme with attractive returns and complete tax exemption under EEE (Exempt-Exempt-Exempt) status.",
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
    title: "Mortgage Calculator - Home Loan Calculator",
    description: "A mortgage calculator is specifically designed for home loans, helping you calculate monthly payments, total interest, and understand the complete cost of your home purchase. It includes advanced features like property taxes, insurance, and PMI calculations.",
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
    title: "Personal Loan Calculator",
    description: "A personal loan calculator helps you determine the EMI for unsecured personal loans. These loans typically have higher interest rates but offer flexibility in usage for various personal needs like medical expenses, travel, or debt consolidation.",
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
    title: "Recurring Deposit Calculator - RD Maturity Calculator",
    description: "A Recurring Deposit (RD) calculator helps you calculate the maturity amount for your monthly recurring deposit investments. It's perfect for systematic savings with a fixed monthly contribution over a specified period.",
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
    title: "Income Tax Calculator - Tax Liability Calculator",
    description: "An Income Tax calculator helps you calculate your tax liability under both old and new tax regimes. It considers various deductions, exemptions, and tax slabs to provide accurate tax calculations and help you choose the most beneficial regime.",
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
    title: "SWP Calculator - Systematic Withdrawal Plan Calculator",
    description: "A SWP (Systematic Withdrawal Plan) calculator helps you plan regular withdrawals from your mutual fund investments while keeping the remaining corpus invested for continued growth. It's ideal for retirement planning and creating regular income streams.",
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
    title: "CAGR Calculator - Compound Annual Growth Rate Calculator",
    description: "A CAGR (Compound Annual Growth Rate) calculator helps you determine the annual growth rate of your investments over a specific period. It's a key metric for comparing investment performance and understanding true returns.",
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
    title: "Capital Gains Tax Calculator - STCG & LTCG Calculator",
    description: "A Capital Gains Tax calculator helps you calculate the tax liability on your investment gains. It considers both Short-Term Capital Gains (STCG) and Long-Term Capital Gains (LTCG) with different tax rates and exemptions.",
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
    title: "NPS Calculator - National Pension Scheme Calculator",
    description: "An NPS (National Pension Scheme) calculator helps you calculate the pension corpus and monthly pension amount under the National Pension Scheme. It considers your contributions, expected returns, and annuity rates to provide comprehensive retirement planning insights.",
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
    title: "EPF Calculator - Employee Provident Fund Calculator",
    description: "An EPF (Employee Provident Fund) calculator helps you calculate the maturity amount of your provident fund contributions. It considers both employee and employer contributions along with the applicable interest rates to provide accurate EPF projections.",
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
    title: "Gratuity Calculator - Employee Gratuity Calculator",
    description: "A Gratuity calculator helps you calculate the gratuity amount payable to employees based on their last drawn salary and years of service. Gratuity is a retirement benefit paid to employees who have completed at least 5 years of continuous service.",
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
    title: "Compound Interest Calculator",
    description: "A Compound Interest calculator helps you understand how your money grows when interest is calculated on both the principal amount and previously earned interest. It demonstrates the power of compounding in wealth creation over time.",
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
    title: "Simple Interest Calculator",
    description: "A Simple Interest calculator helps you calculate interest earned on the principal amount only. Unlike compound interest, simple interest doesn't include interest on previously earned interest, making it straightforward to understand and calculate.",
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
    title: "Inflation Calculator - Purchasing Power Calculator",
    description: "An Inflation calculator helps you understand how inflation affects the purchasing power of money over time. It shows how much money you'll need in the future to buy the same goods and services that you can buy today.",
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
  }
}

// Export individual calculator data for easy access
export const getCalculatorDescription = (calculatorId) => {
  return calculatorDescriptions[calculatorId] || null
}
