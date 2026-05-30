import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatPercent, validateNumberInput } from '@/lib/utils';

interface InvestmentResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  effectiveRate: number;
}

export default function InvestmentCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(20);
  const [annualRate, setAnnualRate] = useState(7);
  const [result, setResult] = useState<InvestmentResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (initialInvestment < 0) newErrors.initialInvestment = 'Initial investment cannot be negative';
    if (monthlyContribution < 0) newErrors.monthlyContribution = 'Monthly contribution cannot be negative';
    if (years <= 0) newErrors.years = 'Investment period must be at least 1 year';
    if (years > 50) newErrors.years = 'Investment period seems too long';
    if (annualRate < -20 || annualRate > 100) newErrors.annualRate = 'Annual return must be between -20% and 100%';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    const futureValueInitial = initialInvestment * Math.pow(1 + monthlyRate, months);
    const futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const futureValue = futureValueInitial + futureValueContributions;
    const totalContributions = initialInvestment + (monthlyContribution * months);
    const totalInterest = futureValue - totalContributions;
    const effectiveRate = (totalInterest / totalContributions) * 100;
    setResult({ futureValue, totalContributions, totalInterest, effectiveRate });
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
      question: 'How does compound interest work in this calculator?',
      answer: 'This calculator uses compound interest, where your returns earn returns over time. The formula accounts for interest compounding monthly, which is how most investment accounts work. This means your money grows exponentially rather than linearly over time.'
    },
    {
      question: 'What return rate should I use?',
      answer: 'Historical stock market averages are around 7-10% annually before inflation. For conservative estimates, use 4-6%. For aggressive growth scenarios, 10-12%. Remember that past performance does not guarantee future results, and actual returns will vary based on market conditions.'
    },
    {
      question: 'How do recurring contributions affect my returns?',
      answer: 'Regular contributions significantly boost your final balance through dollar-cost averaging. Even small monthly contributions compound over time. For example, $500/month for 20 years at 7% grows to about $347,000, with only $120,000 coming from your contributions.'
    },
    {
      question: 'Should I include inflation in my calculations?',
      answer: 'For real purchasing power, subtract the inflation rate from your expected return. If you expect 7% returns and 3% inflation, use a 4% real return. This gives you a more accurate picture of your future buying power.'
    },
    {
      question: 'How accurate is this calculator?',
      answer: 'This calculator provides estimates based on consistent returns. Actual returns will vary year to year due to market volatility. It does not account for taxes, fees, or irregular contribution patterns. Use it as a planning guide, not a guarantee.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Investment Calculator',
        description: 'Calculate future investment value with compound interest. Plan your investment growth with initial and recurring contributions.',
        url: 'https://www.calculatorpilotai.com/tools/finance/investment-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Investment Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/investment-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator', desc: 'Calculate compound interest on savings or investments' },
    { name: 'Retirement Calculator', path: '/tools/finance/retirement-calculator', desc: 'Plan your retirement savings goals' },
    { name: 'ROI Calculator', path: '/tools/finance/roi-calculator', desc: 'Measure return on investment performance' },
  ];

  return (
    <ToolLayout toolId="investment" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Investment Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="initial-investment" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Initial Investment ($)</label>
              <input
                id="initial-investment"
                type="number"
                min="0"
                step="100"
                value={initialInvestment}
                onChange={(e) => { setInitialInvestment(validateNumberInput(e.target.value, { min: 0 })); clearError('initialInvestment'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.initialInvestment ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.initialInvestment && <p className="text-xs text-rose-500">{errors.initialInvestment}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="monthly-contribution" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Contribution ($)</label>
              <input
                id="monthly-contribution"
                type="number"
                min="0"
                step="50"
                value={monthlyContribution}
                onChange={(e) => { setMonthlyContribution(validateNumberInput(e.target.value, { min: 0 })); clearError('monthlyContribution'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.monthlyContribution ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.monthlyContribution && <p className="text-xs text-rose-500">{errors.monthlyContribution}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Investment Period (Years)</label>
              <input
                id="years"
                type="number"
                min="1"
                max="50"
                step="1"
                value={years}
                onChange={(e) => { setYears(validateNumberInput(e.target.value, { min: 1, max: 50 })); clearError('years'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.years ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.years && <p className="text-xs text-rose-500">{errors.years}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="annual-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Expected Annual Return (%)</label>
              <input
                id="annual-rate"
                type="number"
                min="-20"
                max="100"
                step="0.1"
                value={annualRate}
                onChange={(e) => { setAnnualRate(validateNumberInput(e.target.value, { min: -20, max: 100 })); clearError('annualRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.annualRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.annualRate && <p className="text-xs text-rose-500">{errors.annualRate}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Investment
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-900 text-white rounded-xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Future Value</span>
              <div className="text-3xl md:text-4xl font-mono font-black mt-2">{formatCurrency(result.futureValue)}</div>
              <span className="text-sm text-slate-400">After {years} years</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Contributions</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalContributions)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Interest</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-emerald-600 tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalInterest)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Interest Ratio</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatPercent(result.effectiveRate)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Monthly Rate</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{(annualRate / 12).toFixed(3)}%</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Investment Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Investment Calculator projects the future value of your investments based on your initial investment, recurring contributions, expected rate of return, and time horizon. It demonstrates the power of compound interest and regular investing.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]</strong></p>
                <p className="mb-1">Where:</p>
                <p className="mb-1">• FV = Future Value</p>
                <p className="mb-1">• P = Initial Principal</p>
                <p className="mb-1">• r = Annual interest rate</p>
                <p className="mb-1">• n = Compounding periods per year (12 for monthly)</p>
                <p className="mb-1">• t = Number of years</p>
                <p className="mb-1">• PMT = Monthly contribution</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Key Insights</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Compound interest accelerates your wealth over time</li>
                <li>Starting early is more impactful than investing more later</li>
                <li>Regular contributions significantly boost final balances</li>
                <li>Even small monthly amounts add up significantly over decades</li>
              </ul>
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
