import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatPercent, validateNumberInput } from '@/lib/utils';

interface ROIResult {
  roi: number;
  annualRoi: number;
  totalGain: number;
  totalValue: number;
}

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [finalValue, setFinalValue] = useState(15000);
  const [holdingPeriod, setHoldingPeriod] = useState(2);
  const [result, setResult] = useState<ROIResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (initialInvestment <= 0) newErrors.initialInvestment = 'Initial investment must be greater than 0';
    if (finalValue < 0) newErrors.finalValue = 'Final value cannot be negative';
    if (holdingPeriod <= 0) newErrors.holdingPeriod = 'Holding period must be at least 1 year';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const totalGain = finalValue - initialInvestment;
    const roi = (totalGain / initialInvestment) * 100;
    const annualRoi = (Math.pow(finalValue / initialInvestment, 1 / holdingPeriod) - 1) * 100;
    setResult({ roi, annualRoi, totalGain, totalValue: finalValue });
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
      question: 'What is ROI and why is it important?',
      answer: 'ROI (Return on Investment) measures the profitability of an investment relative to its cost. It is expressed as a percentage and helps you compare the performance of different investments. A positive ROI means you have made money, while a negative ROI indicates a loss.'
    },
    {
      question: 'How is annualized ROI different from total ROI?',
      answer: 'Total ROI shows your overall return over the entire holding period. Annualized ROI converts this to a yearly rate, making it easier to compare investments with different time horizons. For example, a 21% return over 2 years has an annualized ROI of 10%, which can be fairly compared to a 15% return over 1 year.'
    },
    {
      question: 'What is a good ROI?',
      answer: 'A good ROI depends on your risk tolerance, time horizon, and the type of investment. Historically, the S&P 500 has returned about 10% annually. Real estate might target 8-12%, while stocks could range from 7-10% for conservative investments to 15%+ for growth strategies. Always compare similar investments and consider risk when evaluating ROI.'
    },
    {
      question: 'Does ROI account for taxes and fees?',
      answer: 'No, this basic ROI calculation uses the simple formula without factoring in taxes, inflation, transaction fees, or ongoing expenses. For a more accurate picture of your actual returns, subtract these costs from your final value before calculating ROI.'
    },
    {
      question: 'How do I calculate ROI for multiple investments?',
      answer: 'To compare multiple investments, calculate the annualized ROI for each using the same holding period. This normalizes returns across different time frames. You can also calculate the profit margin (gain divided by cost) to see which investment delivered more value per dollar invested.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'ROI Calculator',
        description: 'Calculate Return on Investment (ROI) and annualized returns for any investment. Compare different investment opportunities.',
        url: 'https://www.calculatorpilotai.com/tools/finance/roi-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'ROI Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/roi-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Investment Calculator', path: '/tools/finance/investment-calculator', desc: 'Project investment growth over time' },
    { name: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator', desc: 'See how compound interest grows your savings' },
    { name: 'Retirement Calculator', path: '/tools/finance/retirement-calculator', desc: 'Plan for your retirement goals' },
  ];

  return (
    <ToolLayout toolId="roi" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">ROI Calculator</h2>
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
              <label htmlFor="final-value" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Final Value ($)</label>
              <input
                id="final-value"
                type="number"
                min="0"
                step="100"
                value={finalValue}
                onChange={(e) => { setFinalValue(validateNumberInput(e.target.value, { min: 0 })); clearError('finalValue'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.finalValue ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.finalValue && <p className="text-xs text-rose-500">{errors.finalValue}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="holding-period" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Holding Period (Years)</label>
              <input
                id="holding-period"
                type="number"
                min="1"
                step="1"
                value={holdingPeriod}
                onChange={(e) => { setHoldingPeriod(validateNumberInput(e.target.value, { min: 1 })); clearError('holdingPeriod'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.holdingPeriod ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.holdingPeriod && <p className="text-xs text-rose-500">{errors.holdingPeriod}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate ROI
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total ROI</span>
                <div className={`text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none whitespace-nowrap ${result.roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatPercent(result.roi)}
                </div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Annualized ROI</span>
                <div className={`text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none whitespace-nowrap ${result.annualRoi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatPercent(result.annualRoi)}
                </div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Gain</span>
                <div className={`text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none whitespace-nowrap ${result.totalGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(result.totalGain)}
                </div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Final Value</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none whitespace-nowrap">
                  {formatCurrency(result.totalValue)}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the ROI Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The ROI Calculator helps you measure the profitability of any investment. Whether you are comparing stocks, real estate, business ventures, or any other investment, this tool provides clear metrics to evaluate performance. Enter your initial investment and the final value to see your return at a glance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator uses two key formulas. Total ROI is calculated as (Final Value - Initial Investment) / Initial Investment × 100. For annualized ROI, we use the compound annual growth rate (CAGR) formula, which accounts for the time period of your investment.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formulas</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Total ROI = ((Final Value - Initial Investment) / Initial Investment) × 100</strong></p>
                <p className="mb-2"><strong>Annualized ROI = ((Final Value / Initial Investment)^(1/Years) - 1) × 100</strong></p>
                <p className="mt-3 text-xs text-slate-500">Example: $10,000 invested, returned $15,000 after 2 years = 50% total ROI, 21.8% annualized ROI</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Total ROI:</strong> Your overall return as a percentage of the initial investment.</li>
                <li><strong>Annualized ROI:</strong> Your average yearly return, useful for comparing investments with different timeframes.</li>
                <li><strong>Total Gain:</strong> The absolute dollar amount of profit or loss.</li>
                <li><strong>Final Value:</strong> Your total investment value at the end of the holding period.</li>
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
