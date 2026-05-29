import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateInterest, InterestResult } from '@/lib/engines';
import { generateInterestInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

type InterestType = 'simple' | 'compound';
type CompoundFrequency = 'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'daily';

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(5);
  const [type, setType] = useState<InterestType>('compound');
  const [compoundFrequency, setCompoundFrequency] = useState<CompoundFrequency>('monthly');
  const [result, setResult] = useState<InterestResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (principal <= 0) newErrors.principal = 'Principal must be greater than 0';
    if (principal > 100000000) newErrors.principal = 'Principal seems unrealistically high';
    if (rate < 0) newErrors.rate = 'Interest rate cannot be negative';
    if (rate > 100) newErrors.rate = 'Interest rate seems unrealistically high';
    if (years <= 0) newErrors.years = 'Time period must be at least 1 year';
    if (years > 100) newErrors.years = 'Time period seems unrealistically long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateInterest(principal, rate, years, type, compoundFrequency);
    setResult(res);
    setInsight(generateInterestInsight(res, type));
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
      question: 'What is the difference between simple and compound interest?',
      answer: 'Simple interest is calculated only on the original principal amount. The formula is: Interest = Principal × Rate × Time. Compound interest is calculated on the principal plus any accumulated interest, meaning you earn interest on your interest. Over time, compound interest grows your money much faster than simple interest because the base amount keeps increasing.'
    },
    {
      question: 'How does compounding frequency affect returns?',
      answer: 'The more frequently interest compounds, the more you earn. This is because each compounding period adds interest to your balance, and the next period calculates interest on a larger amount. Daily compounding yields slightly more than monthly, which yields more than annually. While the difference for shorter periods is minimal, over decades it can be substantial.'
    },
    {
      question: 'What is an effective interest rate?',
      answer: 'The effective interest rate (or effective annual rate) shows what you actually earn per year when compounding is factored in. For example, a 4.5% nominal rate compounded monthly actually yields about 4.6% effective rate. This metric allows you to compare investments with different compounding schedules on an equal basis.'
    },
    {
      question: 'When should I use simple vs compound interest?',
      answer: 'Simple interest is typically used for short-term loans, car loans, and some mortgages. Compound interest is used for savings accounts, investments, and most long-term financial products. Understanding which type applies helps you predict costs or earnings accurately.'
    },
    {
      question: 'How do I calculate compound interest manually?',
      answer: 'The compound interest formula is: A = P(1 + r/n)^(nt), where A is the final amount, P is the principal, r is the annual rate (as decimal), n is compounding frequency per year, and t is time in years. For example, $10,000 at 4.5% compounded monthly for 5 years: A = 10000(1 + 0.045/12)^(12×5) = $12,451.'
    },
    {
      question: 'Why does compound interest matter for long-term investing?',
      answer: 'Compound interest creates exponential growth over time. Albert Einstein reportedly called it the eighth wonder of the world. Starting early matters enormously — $10,000 invested at 7% for 30 years becomes about $76,123, while the same investment over 40 years becomes $149,745. The later decades see much faster growth as the base compounds.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Interest Calculator',
        description: 'Calculate simple and compound interest to see how your money grows over time with different compounding frequencies.',
        url: 'https://www.calculatorpilotai.com/tools/finance/interest-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Interest Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/interest-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator', desc: 'Calculate growth with regular contributions' },
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate loan payments with different frequencies' },
    { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', desc: 'Calculate home mortgage payments' },
  ];

  return (
    <ToolLayout toolId="interest" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Interest Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="interest-principal" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Principal ($)</label>
              <input
                id="interest-principal"
                type="number"
                min="0"
                step="100"
                value={principal}
                onChange={(e) => { setPrincipal(validateNumberInput(e.target.value, { min: 0 })); clearError('principal'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.principal ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.principal && <p className="text-xs text-rose-500">{errors.principal}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="interest-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</label>
              <input
                id="interest-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={rate}
                onChange={(e) => { setRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('rate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.rate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.rate && <p className="text-xs text-rose-500">{errors.rate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="interest-years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Time Period (Years)</label>
              <input
                id="interest-years"
                type="number"
                min="1"
                max="100"
                step="1"
                value={years}
                onChange={(e) => { setYears(validateNumberInput(e.target.value, { min: 1, max: 100 })); clearError('years'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.years ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.years && <p className="text-xs text-rose-500">{errors.years}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="interest-type" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Type</label>
              <select
                id="interest-type"
                value={type}
                onChange={(e) => setType(e.target.value as InterestType)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="compound">Compound Interest</option>
                <option value="simple">Simple Interest</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="compound-frequency" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Compound Frequency</label>
              <select
                id="compound-frequency"
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value as CompoundFrequency)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg disabled:opacity-50"
                disabled={type === 'simple'}
              >
                <option value="annually">Annually</option>
                <option value="semiannually">Semiannually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
              {type === 'simple' && <p className="text-xs text-muted-foreground mt-1">Not applicable for simple interest</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Interest
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Interest Earned</span>
                <div className={`${getResultTextSize(formatCurrency(result.interestEarned))} font-mono font-bold text-emerald-600 tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.interestEarned)}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Final Balance</span>
                <div className={`${getResultTextSize(formatCurrency(result.finalBalance))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.finalBalance)}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Effective Growth</span>
                <div className={`${getResultTextSize(formatPercent(result.effectiveGrowth))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatPercent(result.effectiveGrowth)}</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Growth Summary</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-mono font-bold text-slate-400">{formatCurrency(principal)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Principal</div>
                </div>
                <div className="text-2xl sm:text-3xl text-slate-300 hidden sm:block">→</div>
                <div className="sm:hidden text-xl text-slate-300">↓</div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-600">+{formatCurrency(result.interestEarned)}</div>
                  <div className="text-sm text-emerald-600 mt-1">Interest</div>
                </div>
                <div className="text-2xl sm:text-3xl text-slate-300 hidden sm:block">→</div>
                <div className="sm:hidden text-xl text-slate-300">↓</div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-mono font-bold text-primary">{formatCurrency(result.finalBalance)}</div>
                  <div className="text-sm text-primary mt-1">Final Balance</div>
                </div>
              </div>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Interest Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Interest Calculator helps you understand how money grows over time through either simple or compound interest. It shows the interest earned and final balance for any principal, rate, and time period. This tool is essential for comparing investment options, understanding loan costs, or projecting savings growth.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                For simple interest, it multiplies principal by rate by time. For compound interest, it applies the rate multiple times per period, with each period adding interest to the balance before calculating the next period's interest. The effective growth shows the true annual return when accounting for compounding frequency.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formulas</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Simple: Interest = P × R × T</strong></p>
                <p className="mb-2"><strong>Compound: A = P(1 + r/n)^(nt)</strong></p>
                <p className="mb-1">Where:</p>
                <p className="mb-1">• P = Principal, R = Rate, T = Time</p>
                <p className="mb-1">• r = Annual rate (decimal), n = Compounds/year, t = Years</p>
                <p className="mt-3 text-xs text-slate-500">Example: $10,000 at 4.5% for 5 years = $12,451 compound</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Interest Earned:</strong> Total interest gained over the period.</li>
                <li><strong>Final Balance:</strong> Principal plus all earned interest.</li>
                <li><strong>Effective Growth:</strong> True annual percentage return.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring compounding frequency:</strong> Monthly compounding earns more than annual.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Confusing nominal and effective rates:</strong> Always compare effective rates.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Use the effective growth</strong> to compare investments fairly.</p>
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