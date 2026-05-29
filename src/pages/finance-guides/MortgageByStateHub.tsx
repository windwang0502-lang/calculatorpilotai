import React from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';

// West Coast
const westCoastStates = [
  { name: 'California', path: '/tools/finance/california-mortgage-calculator', desc: 'Golden State home loan estimates' },
  { name: 'Oregon', path: '/tools/finance/oregon-mortgage-calculator', desc: 'Beaver State mortgage calculator' },
  { name: 'Washington', path: '/tools/finance/washington-mortgage-calculator', desc: 'Evergreen State mortgage estimates' },
];

// Southwest
const southwestStates = [
  { name: 'Arizona', path: '/tools/finance/arizona-mortgage-calculator', desc: 'Grand Canyon State mortgage calculator' },
  { name: 'Colorado', path: '/tools/finance/colorado-mortgage-calculator', desc: 'Centennial State home loan estimates' },
  { name: 'Nevada', path: '/tools/finance/nevada-mortgage-calculator', desc: 'Silver State mortgage calculator' },
  { name: 'Utah', path: '/tools/finance/utah-mortgage-calculator', desc: 'Beehive State home loan estimates' },
];

// Texas & South Central
const southCentralStates = [
  { name: 'Texas', path: '/tools/finance/texas-mortgage-calculator', desc: 'Lone Star State mortgage calculator' },
  { name: 'Oklahoma', path: '/tools/finance/oklahoma-mortgage-calculator', desc: 'Sooner State home loan estimates' },
  { name: 'Kansas', path: '/tools/finance/kansas-mortgage-calculator', desc: 'Sunflower State mortgage calculator' },
];

// Midwest
const midwestStates = [
  { name: 'Illinois', path: '/tools/finance/illinois-mortgage-calculator', desc: 'Prairie State mortgage calculator' },
  { name: 'Indiana', path: '/tools/finance/indiana-mortgage-calculator', desc: 'Hoosier State home loan estimates' },
  { name: 'Iowa', path: '/tools/finance/iowa-mortgage-calculator', desc: 'Hawkeye State mortgage calculator' },
  { name: 'Michigan', path: '/tools/finance/michigan-mortgage-calculator', desc: 'Great Lakes State mortgage estimates' },
  { name: 'Minnesota', path: '/tools/finance/minnesota-mortgage-calculator', desc: 'North Star State home loan calculator' },
  { name: 'Missouri', path: '/tools/finance/missouri-mortgage-calculator', desc: 'Show-Me State mortgage calculator' },
  { name: 'Ohio', path: '/tools/finance/ohio-mortgage-calculator', desc: 'Buckeye State home loan estimates' },
  { name: 'Wisconsin', path: '/tools/finance/wisconsin-mortgage-calculator', desc: 'Badger State mortgage calculator' },
];

// Southeast
const southeastStates = [
  { name: 'Alabama', path: '/tools/finance/alabama-mortgage-calculator', desc: 'Yellowhammer State mortgage calculator' },
  { name: 'Arkansas', path: '/tools/finance/arkansas-mortgage-calculator', desc: 'Natural State home loan estimates' },
  { name: 'Florida', path: '/tools/finance/florida-mortgage-calculator', desc: 'Sunshine State mortgage calculator' },
  { name: 'Georgia', path: '/tools/finance/georgia-mortgage-calculator', desc: 'Peach State home loan estimates' },
  { name: 'Kentucky', path: '/tools/finance/kentucky-mortgage-calculator', desc: 'Bluegrass State mortgage calculator' },
  { name: 'North Carolina', path: '/tools/finance/north-carolina-mortgage-calculator', desc: 'Tar Heel State home loan estimates' },
  { name: 'South Carolina', path: '/tools/finance/south-carolina-mortgage-calculator', desc: 'Palmetto State mortgage calculator' },
  { name: 'Tennessee', path: '/tools/finance/tennessee-mortgage-calculator', desc: 'Volunteer State home loan estimates' },
];

// Northeast
const northeastStates = [
  { name: 'New York', path: '/tools/finance/new-york-mortgage-calculator', desc: 'Empire State mortgage calculator' },
  { name: 'Massachusetts', path: '/tools/finance/massachusetts-mortgage-calculator', desc: 'Bay State home loan estimates' },
  { name: 'Pennsylvania', path: '/tools/finance/pennsylvania-mortgage-calculator', desc: 'Keystone State mortgage calculator' },
  { name: 'Virginia', path: '/tools/finance/virginia-mortgage-calculator', desc: 'Old Dominion home loan estimates' },
];

const allStatePages = [
  ...westCoastStates,
  ...southwestStates,
  ...southCentralStates,
  ...midwestStates,
  ...southeastStates,
  ...northeastStates,
];

const popularCalculators = [
  { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', desc: 'General mortgage payment calculator' },
  { name: 'Refinance Calculator', path: '/tools/finance/refinance-calculator', desc: 'Calculate refinance savings' },
  { name: 'FHA Loan Calculator', path: '/tools/finance/fha-loan-calculator', desc: 'FHA loan payment estimates' },
  { name: 'VA Loan Calculator', path: '/tools/finance/va-loan-calculator', desc: 'Veterans home loan calculator' },
  { name: 'USDA Loan Calculator', path: '/tools/finance/usda-loan-calculator', desc: 'Zero down payment calculator' },
  { name: 'Jumbo Loan Calculator', path: '/tools/finance/jumbo-loan-calculator', desc: 'High-value mortgage calculator' },
  { name: 'Conventional Loan Calculator', path: '/tools/finance/conventional-loan-calculator', desc: 'Conforming loan estimates' },
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
      itemListElement: allStatePages.map((page, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: page.name + ' Mortgage Calculator',
        url: `https://www.calculatorpilotai.com${page.path}`,
      })),
    },
  ],
};

function StateSection({ title, states }: { title: string; states: typeof westCoastStates }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-slate-700">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {states.map((page) => (
          <Link
            key={page.path}
            to={page.path}
            className="group bg-white border border-slate-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <h4 className="font-medium group-hover:text-primary transition-colors text-sm">
              {page.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{page.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

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

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              State Mortgage Calculators ({allStatePages.length} states)
            </h2>

            <div className="space-y-6">
              <StateSection title="West Coast" states={westCoastStates} />
              <StateSection title="Southwest & Mountain West" states={southwestStates} />
              <StateSection title="Texas & South Central" states={southCentralStates} />
              <StateSection title="Midwest" states={midwestStates} />
              <StateSection title="Southeast" states={southeastStates} />
              <StateSection title="Northeast" states={northeastStates} />
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Loan Type Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularCalculators.map((calc) => (
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

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Salary & Income Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {salaryCalculators.map((calc) => (
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

          <section className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Calculate Your Mortgage?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Use our comprehensive mortgage calculators to estimate your monthly payments, compare loan options, and make informed decisions about your home purchase.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/tools/finance/mortgage-calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Go to Mortgage Calculator
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