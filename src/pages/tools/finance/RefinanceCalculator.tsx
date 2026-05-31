import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateRefinance, RefinanceResult } from '@/lib/engines';
import { generateRefinanceInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState(300000);
  const [currentRate, setCurrentRate] = useState(7);
  const [remainingYears, setRemainingYears] = useState(25);
  const [newRate, setNewRate] = useState(5.5);
  const [newTermYears, setNewTermYears] = useState(30);
  const [closingCosts, setClosingCosts] = useState(6000);
  const [result, setResult] = useState<RefinanceResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (currentBalance <= 0) newErrors.currentBalance = 'Current balance must be greater than 0';
    if (currentBalance > 100000000) newErrors.currentBalance = 'Balance seems unrealistically high';
    if (currentRate < 0) newErrors.currentRate = 'Current rate cannot be negative';
    if (currentRate > 50) newErrors.currentRate = 'Current rate seems unrealistically high';
    if (remainingYears <= 0) newErrors.remainingYears = 'Remaining years must be at least 1';
    if (remainingYears > 100) newErrors.remainingYears = 'Term seems unrealistically long';
    if (newRate < 0) newErrors.newRate = 'New rate cannot be negative';
    if (newRate > 50) newErrors.newRate = 'New rate seems unrealistically high';
    if (newTermYears <= 0) newErrors.newTermYears = 'New term must be at least 1 year';
    if (newTermYears > 100) newErrors.newTermYears = 'New term seems unrealistically long';
    if (closingCosts < 0) newErrors.closingCosts = 'Closing costs cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateRefinance(currentBalance, currentRate, remainingYears, newRate, newTermYears, closingCosts);
    setResult(res);
    setInsight(generateRefinanceInsight(res));
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const faqs = [
    {
      question: 'When should I consider refinancing my mortgage?',
      answer: 'You should consider refinancing when you can get a rate at least 0.5-1% lower than your current rate, especially if you plan to stay in the home long enough to recover the closing costs. Other good reasons include switching from an adjustable-rate to a fixed-rate mortgage, shortening your loan term, or accessing equity through a cash-out refinance.'
    },
    {
      question: 'What is a break-even point and why does it matter?',
      answer: 'The break-even point is when your monthly savings from refinancing equal the closing costs you paid. For example, if closing costs are $6,000 and you save $200 per month, your break-even is 30 months. If you plan to stay in the home longer than the break-even period, refinancing makes financial sense. If you\'ll move before then, it may not be worth it.'
    },
    {
      question: 'Should I extend my loan term when refinancing?',
      answer: 'Extending your loan term (like going from a 15-year to a 30-year mortgage) will lower your monthly payment but increase total interest paid over time. While this can provide immediate cash flow relief, it may not be the best long-term strategy. Consider your goals, how long you\'ve been paying on your current loan, and whether you can afford higher payments.'
    },
    {
      question: 'What closing costs should I expect when refinancing?',
      answer: 'Typical refinancing closing costs range from 2% to 5% of your loan amount. This includes application fees, appraisal, title insurance, origination fees, and recording fees. For a $300,000 loan, expect $6,000-$15,000 in closing costs. Some lenders offer no-closing-cost refinances, but they typically charge a slightly higher interest rate.'
    },
    {
      question: 'How much does a lower rate need to be to make refinancing worth it?',
      answer: 'The traditional rule of thumb is to refinance when rates are at least 1% lower than your current rate. However, the actual threshold depends on your break-even period and how long you\'ll keep the loan. A 0.5% difference might be worth it if you have a high balance, low closing costs, and plan to stay in the home for many years.'
    },
    {
      question: 'Should I do a cash-out refinance?',
      answer: 'A cash-out refinance replaces your existing mortgage with a larger one and you receive the difference in cash. This can make sense for home improvements, debt consolidation, or investing. However, it increases your debt and reduces your home equity. Only consider it if you have a clear plan for the funds and a strategy for repaying.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Refinance Calculator',
        description: 'Determine if refinancing your mortgage makes financial sense by calculating potential monthly savings and break-even period.',
        url: 'https://www.calculatorpilotai.com/tools/finance/refinance-calculator',
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
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.calculatorpilotai.com' },
          { '@type': 'ListItem', position: 2, name: 'Finance', item: 'https://www.calculatorpilotai.com/tools/finance' },
          { '@type': 'ListItem', position: 3, name: 'Refinance Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/refinance-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', desc: 'Calculate your current mortgage payment' },
    { name: 'APR Calculator', path: '/tools/finance/apr-calculator', desc: 'Compare the true cost of different loans' },
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate various loan payment scenarios' },
  ];

  return (
    <ToolLayout toolId="refinance" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Refinance Calculator</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-slate-700">Current Loan</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-balance" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Loan Balance ($)</label>
                  <input
                    id="current-balance"
                    type="number"
                    min="0"
                    step="1000"
                    value={currentBalance}
                    onChange={(e) => { setCurrentBalance(validateNumberInput(e.target.value, { min: 0 })); clearError('currentBalance'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.currentBalance ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.currentBalance && <p className="text-xs text-rose-500">{errors.currentBalance}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="current-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Interest Rate (%)</label>
                  <input
                    id="current-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={currentRate}
                    onChange={(e) => { setCurrentRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('currentRate'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.currentRate ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.currentRate && <p className="text-xs text-rose-500">{errors.currentRate}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="remaining-years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Remaining Term (Years)</label>
                  <input
                    id="remaining-years"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={remainingYears}
                    onChange={(e) => { setRemainingYears(validateNumberInput(e.target.value, { min: 1, max: 100 })); clearError('remainingYears'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.remainingYears ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.remainingYears && <p className="text-xs text-rose-500">{errors.remainingYears}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-slate-700">New Loan Terms</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="new-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">New Interest Rate (%)</label>
                  <input
                    id="new-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newRate}
                    onChange={(e) => { setNewRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('newRate'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.newRate ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.newRate && <p className="text-xs text-rose-500">{errors.newRate}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-term" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">New Loan Term (Years)</label>
                  <input
                    id="new-term"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={newTermYears}
                    onChange={(e) => { setNewTermYears(validateNumberInput(e.target.value, { min: 1, max: 100 })); clearError('newTermYears'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.newTermYears ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.newTermYears && <p className="text-xs text-rose-500">{errors.newTermYears}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="closing-costs" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Closing Costs ($)</label>
                  <input
                    id="closing-costs"
                    type="number"
                    min="0"
                    step="100"
                    value={closingCosts}
                    onChange={(e) => { setClosingCosts(validateNumberInput(e.target.value, { min: 0 })); clearError('closingCosts'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.closingCosts ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.closingCosts && <p className="text-xs text-rose-500">{errors.closingCosts}</p>}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Refinance Savings
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Current Payment</span>
                <div className="text-xl sm:text-2xl font-mono font-bold tabular-nums leading-tight whitespace-nowrap overflow-hidden">{formatCurrency(result.currentPayment)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">New Payment</span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-600 tabular-nums leading-tight whitespace-nowrap overflow-hidden">{formatCurrency(result.newPayment)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Monthly Savings</span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-600 tabular-nums leading-tight whitespace-nowrap overflow-hidden">{formatCurrency(result.monthlySavings)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Break-Even</span>
                <div className="text-xl sm:text-2xl font-mono font-bold tabular-nums leading-tight whitespace-nowrap overflow-hidden">{result.breakEvenMonths} mo</div>
              </div>
              <div className="p-4 sm:p-5 bg-primary/5 border border-primary/20 rounded-xl text-center sm:col-span-2 xl:col-span-1">
                <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Lifetime Savings</span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-primary tabular-nums leading-tight whitespace-nowrap overflow-hidden">{formatCurrency(result.lifetimeSavings)}</div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-emerald-800">Refinance Analysis</h3>
              <p className="text-emerald-700 leading-relaxed">
                {result.monthlySavings > 0
                  ? `By refinancing, you could save ${formatCurrency(result.monthlySavings)} per month. At this rate, your closing costs of ${formatCurrency(closingCosts)} will be recovered in ${result.breakEvenMonths} months. Over the life of the loan, you could save ${formatCurrency(result.lifetimeSavings)}.`
                  : `Refinancing with these terms may not provide immediate savings. Consider waiting for better rates or different loan terms.`}
              </p>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Refinance Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Refinance Calculator helps you determine whether refinancing your mortgage makes financial sense. It compares your current loan terms with a new mortgage, calculating your potential monthly savings and how long it will take to recover closing costs through those savings. This decision-making tool helps you understand the true cost-benefit of refinancing.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator compares two loan scenarios: your current mortgage and a new refinance deal. It calculates the monthly payment for each, determines the difference (your savings), and divides your closing costs by that monthly savings to find your break-even point. It then projects lifetime savings by multiplying monthly savings by the remaining loan term.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Key Numbers</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Break-Even Months = Closing Costs ÷ Monthly Savings</strong></p>
                <p className="mb-2">Lifetime Savings = (Current Total - New Total) - Closing Costs</p>
                <p className="text-xs text-slate-500">Example: $6,000 costs ÷ $200/mo savings = 30 months break-even</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <p className="text-slate-700 leading-relaxed mb-3">Your refinance analysis shows:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Current vs New Payment:</strong> Compare your current monthly payment with the new one.</li>
                <li><strong>Monthly Savings:</strong> How much lower your new payment would be.</li>
                <li><strong>Break-Even:</strong> Months until closing costs are recovered through savings.</li>
                <li><strong>Lifetime Savings:</strong> Total net savings after accounting for closing costs.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Not considering how long you'll stay:</strong> If you'll move before breaking even, refinancing costs you money.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Focusing only on monthly payment:</strong> A lower payment with a longer term may mean more total interest.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring the rate difference:</strong> A 0.5% savings may not justify refinancing costs in many cases.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Consider cash-out scenarios carefully</strong> — you\'re taking on more debt in exchange for liquidity.</p>
                </div>
              </div>
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
              <a key={index} href={tool.path} className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-slate-400 text-sm">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}