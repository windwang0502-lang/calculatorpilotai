import React from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';

const stateMortgagePages = [
  { name: 'California Mortgage Calculator', path: '/tools/finance/california-mortgage-calculator', desc: 'Golden State home loan estimates' },
  { name: 'Texas Mortgage Calculator', path: '/tools/finance/texas-mortgage-calculator', desc: 'Lone Star State mortgage payment calculator' },
  { name: 'Florida Mortgage Calculator', path: '/tools/finance/florida-mortgage-calculator', desc: 'Sunshine State home loan estimator' },
  { name: 'New York Mortgage Calculator', path: '/tools/finance/new-york-mortgage-calculator', desc: 'Empire State mortgage calculator' },
  { name: 'Pennsylvania Mortgage Calculator', path: '/tools/finance/pennsylvania-mortgage-calculator', desc: 'Keystone State home loan calculator' },
  { name: 'Illinois Mortgage Calculator', path: '/tools/finance/illinois-mortgage-calculator', desc: 'Prairie State mortgage estimator' },
  { name: 'Ohio Mortgage Calculator', path: '/tools/finance/ohio-mortgage-calculator', desc: 'Buckeye State home loan calculator' },
  { name: 'Georgia Mortgage Calculator', path: '/tools/finance/georgia-mortgage-calculator', desc: 'Peach State mortgage payment calculator' },
  { name: 'North Carolina Mortgage Calculator', path: '/tools/finance/north-carolina-mortgage-calculator', desc: 'Tar Heel State home loan estimator' },
  { name: 'Michigan Mortgage Calculator', path: '/tools/finance/michigan-mortgage-calculator', desc: 'Great Lakes State mortgage calculator' },
];

const popularCalculators = [
  { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', desc: 'General mortgage payment calculator' },
  { name: 'Refinance Calculator', path: '/tools/finance/refinance-calculator', desc: 'Calculate refinance savings' },
  { name: 'FHA Loan Calculator', path: '/tools/finance/fha-loan-calculator', desc: 'FHA loan payment estimates' },
  { name: 'VA Loan Calculator', path: '/tools/finance/va-loan-calculator', desc: 'Veterans home loan calculator' },
  { name: 'USDA Loan Calculator', path: '/tools/finance/usda-loan-calculator', desc: 'Zero down payment calculator' },
  { name: 'Jumbo Loan Calculator', path: '/tools/finance/jumbo-loan-calculator', desc: 'High-value mortgage calculator' },
];

const salaryCalculators = [
  { name: 'Salary to Hourly Calculator', path: '/tools/finance/salary-to-hourly-calculator', desc: 'Convert annual salary to hourly rate' },
  { name: 'Annual to Hourly Salary Calculator', path: '/tools/finance/annual-to-hourly-salary-calculator', desc: 'Yearly to hourly wage converter' },
  { name: 'Hourly to Annual Salary Calculator', path: '/tools/finance/hourly-to-annual-salary-calculator', desc: 'Hourly wage to yearly income' },
  { name: 'Monthly to Annual Salary Calculator', path: '/tools/finance/monthly-to-annual-salary-calculator', desc: 'Monthly income to annual salary' },
  { name: 'Annual to Monthly Salary Calculator', path: '/tools/finance/annual-to-monthly-salary-calculator', desc: 'Yearly to monthly income converter' },
];

const schemaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Mortgage Calculator by State - Comprehensive Hub',
      description: 'Find state-specific mortgage calculators for all 50 states. Compare home loan costs across California, Texas, Florida, New York, and more.',
      url: 'https://www.calculatorpilotai.com/finance-guides/mortgage-by-state',
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
          { '@type': 'ListItem', position: 3, name: 'Mortgage by State', item: 'https://www.calculatorpilotai.com/finance-guides/mortgage-by-state' },
        ],
      },
    },
    {
      '@type': 'ItemList',
      name: 'State Mortgage Calculators',
      description: 'List of mortgage calculators organized by US state',
      itemListElement: stateMortgagePages.map((page, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: page.name,
        url: `https://www.calculatorpilotai.com${page.path}`,
      })),
    },
  ],
};

export default function MortgageByStateHub() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <ToolLayout toolId="mortgage-by-state-hub" category="finance">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/finance-guides" className="hover:text-primary transition-colors">Finance Guides</Link>
              <span>/</span>
              <span>Mortgage by State</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Mortgage Calculator by State
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Find state-specific mortgage calculators to estimate your home loan payment. Each calculator considers local housing markets, property taxes, and regional costs.
            </p>
          </header>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Top 10 State Mortgage Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stateMortgagePages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-1">
                    {page.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{page.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Popular Mortgage Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularCalculators.map((calc) => (
                <Link
                  key={calc.path}
                  to={calc.path}
                  className="group bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-primary/5 hover:border-primary/30 transition-all"
                >
                  <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{calc.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Related Salary Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {salaryCalculators.map((calc) => (
                <Link
                  key={calc.path}
                  to={calc.path}
                  className="group bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-primary/5 hover:border-primary/30 transition-all"
                >
                  <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{calc.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Calculate Your Mortgage?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Use our comprehensive mortgage calculators to estimate your monthly payments, compare loan options, and make informed decisions about your home purchase.
            </p>
            <Link
              to="/tools/finance/mortgage-calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Go to Mortgage Calculator
            </Link>
          </section>
        </div>
      </ToolLayout>
    </>
  );
}