import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateAffordability, type AffordabilityResult } from '@/lib/engines';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function MortgageAffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState(1800);
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (annualIncome <= 0) newErrors.annualIncome = 'Annual income must be greater than 0';
    if (interestRate < 0) newErrors.interestRate = 'Interest rate cannot be negative';
    if (interestRate > 30) newErrors.interestRate = 'Interest rate seems unrealistically high';
    if (loanTermYears <= 0) newErrors.loanTermYears = 'Loan term must be at least 1 year';
    if (downPaymentPercent < 0) newErrors.downPaymentPercent = 'Down payment cannot be negative';
    if (downPaymentPercent > 100) newErrors.downPaymentPercent = 'Down payment cannot exceed 100%';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateAffordability(
      annualIncome,
      monthlyDebts,
      interestRate,
      loanTermYears,
      downPaymentPercent,
      propertyTaxRate,
      homeInsuranceAnnual
    );
    setResult(res);
  };

  const faqs = [
    {
      question: 'How much house can I afford with my income?',
      answer: 'A common rule of thumb is the 28/36 rule: your mortgage payment (including taxes, insurance, and PMI) should not exceed 28% of your gross monthly income, and your total debt payments should not exceed 36%. Our calculator uses these guidelines along with your specific financial details to estimate how much home you can afford.'
    },
    {
      question: 'What is included in my monthly mortgage payment?',
      answer: 'Your monthly payment typically includes: Principal (the loan balance), Interest (the cost of borrowing), Property Taxes (usually held in escrow), Homeowners Insurance (held in escrow), and potentially PMI if your down payment is less than 20%. Some loans also include HOA fees.'
    },
    {
      question: 'How does my down payment affect affordability?',
      answer: 'A larger down payment increases your purchasing power because it reduces the loan amount needed. Additionally, down payments of 20% or more typically eliminate the need for Private Mortgage Insurance (PMI), which can add $100-$500+ monthly to your payment. However, waiting to save a larger down payment means paying more in rent and potentially higher home prices.'
    },
    {
      question: 'What is property tax rate?',
      answer: 'Property tax rates vary significantly by location, typically ranging from 0.5% to 2.5% of your home\'s assessed value annually. For example, a 1.2% rate on a $400,000 home equals $4,800 per year or $400 per month in property taxes. Check with your local county assessor for exact rates in your area.'
    },
    {
      question: 'Should I choose a 15-year or 30-year mortgage?',
      answer: 'A 15-year mortgage has higher monthly payments but significantly less total interest paid over the life of the loan. A 30-year mortgage offers lower monthly payments, providing more flexibility in your budget, but you\'ll pay substantially more total interest. Choose based on your budget comfort level and long-term financial goals.'
    },
    {
      question: 'How does PMI affect my affordability calculation?',
      answer: 'Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home\'s value. PMI typically costs 0.5% to 1% of the loan amount annually. On a $350,000 loan, that\'s $1,750 to $3,500 per year ($146 to $292 monthly). Our calculator includes this estimate to give you a more accurate picture of your true monthly housing costs.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Mortgage Affordability Calculator',
        description: 'Calculate how much mortgage you can afford based on your income, debts, down payment, and desired monthly payment. Get pre-approval estimates instantly.',
        url: 'https://www.calculatorpilotai.com/tools/finance/mortgage-affordability-calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      }
    ]
  };

  const relatedTools = [
    { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', desc: 'Calculate your monthly mortgage payment' },
    { name: 'DTI Calculator', path: '/tools/finance/dti-calculator', desc: 'Calculate your debt-to-income ratio' },
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate payments for any loan type' },
  ];

  return (
    <ToolLayout toolId="mortgage-affordability" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Mortgage Affordability Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="annual-income" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Annual Gross Income ($)</label>
              <input
                id="annual-income"
                type="number"
                min="0"
                step="5000"
                value={annualIncome}
                onChange={(e) => { setAnnualIncome(validateNumberInput(e.target.value, { min: 0 })); setErrors(prev => { const n = { ...prev }; delete n.annualIncome; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.annualIncome ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.annualIncome && <p className="text-xs text-rose-500">{errors.annualIncome}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="monthly-debts" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Other Debts ($)</label>
              <input
                id="monthly-debts"
                type="number"
                min="0"
                step="50"
                value={monthlyDebts}
                onChange={(e) => setMonthlyDebts(validateNumberInput(e.target.value, { min: 0 }))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg"
              />
              <p className="text-xs text-slate-500">Car payments, student loans, credit cards</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="interest-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</label>
              <input
                id="interest-rate"
                type="number"
                min="0"
                max="30"
                step="0.125"
                value={interestRate}
                onChange={(e) => { setInterestRate(validateNumberInput(e.target.value, { min: 0, max: 30 })); setErrors(prev => { const n = { ...prev }; delete n.interestRate; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.interestRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="loan-term" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Term</label>
              <select
                id="loan-term"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={30}>30 Years</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="down-payment" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Down Payment (%)</label>
              <input
                id="down-payment"
                type="number"
                min="0"
                max="100"
                step="1"
                value={downPaymentPercent}
                onChange={(e) => { setDownPaymentPercent(validateNumberInput(e.target.value, { min: 0, max: 100 })); setErrors(prev => { const n = { ...prev }; delete n.downPaymentPercent; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.downPaymentPercent ? 'border-rose-500' : 'border-slate-200'}`}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="property-tax" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Property Tax Rate (%)</label>
              <input
                id="property-tax"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={propertyTaxRate}
                onChange={(e) => setPropertyTaxRate(validateNumberInput(e.target.value, { min: 0, max: 10 }))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg"
              />
              <p className="text-xs text-slate-500">Annual rate as percentage of home value</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="insurance" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Annual Home Insurance ($)</label>
              <input
                id="insurance"
                type="number"
                min="0"
                step="100"
                value={homeInsuranceAnnual}
                onChange={(e) => setHomeInsuranceAnnual(validateNumberInput(e.target.value, { min: 0 }))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Affordability
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 border border-primary/20 rounded-xl">
              <div className="text-center">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground block mb-2">Maximum Home Price</span>
                <div className={`${getResultTextSize(formatCurrency(result.maxHomePrice), 'text-4xl')} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>
                  {formatCurrency(result.maxHomePrice)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Max Loan</span>
                <span className="font-mono font-bold text-lg">{formatCurrency(result.maxLoanAmount)}</span>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Down Payment</span>
                <span className="font-mono font-bold text-lg">{formatCurrency(result.downPayment)}</span>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Down %</span>
                <span className="font-mono font-bold text-lg">{downPaymentPercent}%</span>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Monthly</span>
                <span className="font-mono font-bold text-lg">{formatCurrency(result.totalMonthlyHousing)}</span>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Monthly Payment Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Principal & Interest</span>
                    <span className="font-mono font-semibold">{formatCurrency(result.estimatedMonthlyPayment)}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(result.estimatedMonthlyPayment / result.totalMonthlyHousing) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Property Tax</span>
                    <span className="font-mono font-semibold">{formatCurrency(result.monthlyPropertyTax)}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(result.monthlyPropertyTax / result.totalMonthlyHousing) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Home Insurance</span>
                    <span className="font-mono font-semibold">{formatCurrency(result.monthlyInsurance)}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(result.monthlyInsurance / result.totalMonthlyHousing) * 100}%` }}
                    />
                  </div>
                </div>
                {result.monthlyPMI > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-600">PMI</span>
                      <span className="font-mono font-semibold">{formatCurrency(result.monthlyPMI)}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(result.monthlyPMI / result.totalMonthlyHousing) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How Much House Can You Afford?</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Understanding the 28/36 Rule</h3>
              <p className="text-slate-700 leading-relaxed">
                The 28/36 rule is a guideline used by lenders to determine how much you can afford to borrow. The <strong>front-end ratio</strong> (28%) means your housing costs should not exceed 28% of your gross monthly income. The <strong>back-end ratio</strong> (36%) means your total debt payments should not exceed 36% of your gross monthly income.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Factors That Affect Affordability</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Income:</strong> Higher income increases your purchasing power</li>
                <li><strong>Existing debts:</strong> Car payments, student loans, and credit card minimums reduce affordability</li>
                <li><strong>Credit score:</strong> Better scores mean lower interest rates and better terms</li>
                <li><strong>Down payment:</strong> Larger down payments reduce loan amount and eliminate PMI</li>
                <li><strong>Interest rates:</strong> Lower rates allow you to afford more home</li>
                <li><strong>Property taxes:</strong> Vary significantly by location</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Beyond the Calculator</h3>
              <p className="text-slate-700 leading-relaxed">
                While our calculator provides a solid estimate based on industry guidelines, your actual affordability depends on your complete financial picture. Consider your emergency fund, job stability, planned major expenses, and personal comfort level with housing costs. Being house-poor (where housing costs strain your budget) can impact your quality of life and financial goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p className="text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Financial Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool, index) => (
              <Link key={index} to={tool.path} className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-slate-400 text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
