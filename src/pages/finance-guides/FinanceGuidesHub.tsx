import React from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';

// Salary Guides
const salaryGuides = [
  { name: 'Salary After Tax Calculator', path: '/tools/finance/salary-after-tax-calculator', desc: 'Calculate take-home pay after taxes' },
  { name: 'Salary Per Paycheck Calculator', path: '/tools/finance/salary-per-paycheck-calculator', desc: 'Estimate per-paycheck amounts' },
  { name: 'Biweekly Salary Calculator', path: '/tools/finance/biweekly-salary-calculator', desc: 'Calculate bi-weekly payments' },
  { name: 'Monthly Paycheck Calculator', path: '/tools/finance/monthly-paycheck-calculator', desc: 'Estimate monthly payments' },
  { name: 'Annual Income Calculator', path: '/tools/finance/annual-income-calculator', desc: 'Convert hourly/daily rates to yearly' },
];

// Mortgage Guides
const mortgageGuides = [
  { name: 'Mortgage Payment Breakdown', path: '/tools/finance/mortgage-payment-breakdown', desc: 'Understand PITI and more' },
  { name: 'Extra Payment Mortgage Calculator', path: '/tools/finance/extra-payment-mortgage-calculator', desc: 'Pay off your home faster' },
  { name: 'Mortgage Affordability Guide', path: '/tools/finance/mortgage-affordability-guide', desc: 'How much house can you afford' },
  { name: 'First Time Home Buyer Guide', path: '/tools/finance/first-time-home-buyer-guide', desc: 'Complete home buying roadmap' },
  { name: 'Refinance vs New Mortgage', path: '/tools/finance/refinance-vs-new-mortgage', desc: 'When to refinance your home' },
];

// Loan Guides
const loanGuides = [
  { name: 'Personal Loan Calculator Guide', path: '/tools/finance/personal-loan-calculator-guide', desc: 'Find the best personal loan' },
  { name: 'Auto Loan Calculator Guide', path: '/tools/finance/auto-loan-calculator-guide', desc: 'Finance your vehicle wisely' },
  { name: 'Student Loan Calculator Guide', path: '/tools/finance/student-loan-calculator-guide', desc: 'Education financing strategy' },
  { name: 'Debt Payoff Strategy Guide', path: '/tools/finance/debt-payoff-strategy-guide', desc: 'Avalanche vs Snowball methods' },
  { name: 'Loan Interest Guide', path: '/tools/finance/loan-interest-guide', desc: 'Understanding how interest works' },
];

// Investment Guides
const investmentGuides = [
  { name: 'Retirement Savings Guide', path: '/tools/finance/retirement-savings-guide', desc: 'Build your nest egg' },
  { name: 'Investment Return Calculator Guide', path: '/tools/finance/investment-return-calculator-guide', desc: 'Measure investment performance' },
  { name: 'Compound Growth Guide', path: '/tools/finance/compound-growth-guide', desc: 'The power of compound returns' },
  { name: 'Passive Income Guide', path: '/tools/finance/passive-income-guide', desc: 'Build streams of earnings' },
  { name: 'Financial Independence Guide', path: '/tools/finance/financial-independence-guide', desc: 'Retire early and work on your terms' },
];

// Finance Calculators
const financeCalculators = [
  { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', desc: 'Calculate monthly mortgage payments' },
  { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Personal and business loan payments' },
  { name: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator', desc: 'Grow your savings faster' },
  { name: 'Salary to Hourly Calculator', path: '/tools/finance/salary-to-hourly-calculator', desc: 'Convert annual to hourly rate' },
  { name: 'Auto Loan Calculator', path: '/tools/finance/auto-loan-calculator', desc: 'Calculate car payments' },
  { name: 'Investment Return Calculator', path: '/tools/finance/investment-return-calculator', desc: 'Track investment performance' },
];

const allGuides = [...salaryGuides, ...mortgageGuides, ...loanGuides, ...investmentGuides];

const schemaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Finance Guides - Comprehensive Hub',
      description: 'Find comprehensive finance guides covering salary, mortgages, loans, and investments. Expert resources to help you manage money, plan for retirement, and make informed financial decisions.',
      url: 'https://www.calculatorpilotai.com/finance-guides',
      isPartOf: {
        '@type': 'WebSite',
        name: 'CalculatorPilot AI',
        url: 'https://www.calculatorpilotai.com',
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.calculatorpilotai.com/' },
          { '@type': 'ListItem', position: 2, name: 'Finance Guides', item: 'https://www.calculatorpilotai.com/finance-guides' },
        ],
      },
    },
    {
      '@type': 'ItemList',
      name: 'Finance Guides',
      description: 'Comprehensive guides covering salary, mortgages, loans, and investments',
      itemListElement: allGuides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: guide.name,
        url: `https://www.calculatorpilotai.com${guide.path}`,
      })),
    },
  ],
};

function ResourceSection({ title, icon, resources }: { title: string; icon: React.ReactNode; resources: typeof salaryGuides }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resources.map((resource) => (
          <Link
            key={resource.path}
            to={resource.path}
            className="group bg-white border border-slate-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <h4 className="font-medium group-hover:text-primary transition-colors text-sm">
              {resource.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{resource.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function FinanceGuidesHub() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <ToolLayout toolId="finance-guides-hub" category="finance">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/finance" className="hover:text-primary transition-colors">Finance Tools</Link>
              <span>/</span>
              <span>Guides</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Finance Guides
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Expert finance guides to help you manage money, plan for major purchases, and build long-term wealth. From salary calculations to retirement planning.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Finance Guides ({allGuides.length} guides)
            </h2>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-200/50">
                <ResourceSection
                  title="Salary & Income"
                  icon={
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                  resources={salaryGuides}
                />
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-6 border border-emerald-200/50">
                <ResourceSection
                  title="Mortgage & Home Buying"
                  icon={
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  }
                  resources={mortgageGuides}
                />
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200/50">
                <ResourceSection
                  title="Loan Guides"
                  icon={
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  }
                  resources={loanGuides}
                />
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200/50">
                <ResourceSection
                  title="Investment & Retirement"
                  icon={
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                  resources={investmentGuides}
                />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Finance Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {financeCalculators.map((calc) => (
                <Link
                  key={calc.path}
                  to={calc.path}
                  className="group bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-primary/5 hover:border-primary/30 transition-all"
                >
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{calc.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-12 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              State-Specific Mortgage Calculators
            </h3>
            <Link
              to="/finance-guides/mortgage-by-state"
              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div>
                <h4 className="font-medium text-primary">Mortgage by State Hub</h4>
                <p className="text-sm text-muted-foreground">Find state-specific mortgage calculators and housing market guides</p>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </section>

          <section className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Start Your Financial Journey</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Use our calculators and guides to better understand your finances and make informed decisions about loans, investments, and major purchases.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/tools/finance/mortgage-calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Calculate Your Mortgage
              </Link>
              <Link
                to="/tools/finance"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Browse All Finance Calculators
              </Link>
            </div>
          </section>
        </div>
      </ToolLayout>
    </>
  );
}
