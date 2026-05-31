import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateAPR, APRResult } from '@/lib/engines';
import { generateAPRInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function APRCalculator() {
  const [loanAmount, setLoanAmount] = useState(200000);
  const [nominalRate, setNominalRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [fees, setFees] = useState(5000);
  const [result, setResult] = useState<APRResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (loanAmount <= 0) newErrors.loanAmount = 'Loan amount must be greater than 0';
    if (loanAmount > 100000000) newErrors.loanAmount = 'Loan amount seems unrealistically high';
    if (nominalRate < 0) newErrors.nominalRate = 'Interest rate cannot be negative';
    if (nominalRate > 50) newErrors.nominalRate = 'Interest rate seems unrealistically high';
    if (years <= 0) newErrors.years = 'Loan term must be at least 1 year';
    if (years > 100) newErrors.years = 'Loan term seems unrealistically long';
    if (fees < 0) newErrors.fees = 'Fees cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateAPR(loanAmount, nominalRate, years, fees);
    setResult(res);
    setInsight(generateAPRInsight(res.apr, nominalRate));
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
      question: 'What is APR and how is it different from the interest rate?',
      answer: 'APR (Annual Percentage Rate) is the true annual cost of borrowing, including the interest rate plus all fees and costs associated with the loan. While the nominal interest rate only reflects the cost of borrowing the principal, APR includes upfront fees (like origination fees, points, and closing costs) spread across the loan term. This gives you a more accurate picture of what you\'ll actually pay each year.'
    },
    {
      question: 'Why does including fees increase the APR?',
      answer: 'When you pay fees upfront, you\'re effectively borrowing less money but still paying interest on the full loan amount. By spreading these fees over the loan term, the APR calculation shows a higher effective rate than the nominal rate. For example, if you pay $5,000 in fees on a $200,000 loan, you\'re only receiving $195,000 but paying interest on $200,000.'
    },
    {
      question: 'How do I use APR to compare loan offers?',
      answer: 'APR is the best metric for comparing loans because it accounts for both interest and fees. A loan with a lower nominal rate but high fees might have a higher APR than a loan with a slightly higher rate but no fees. Always compare APR when shopping for loans, and make sure you\'re comparing loans with the same term length for accurate results.'
    },
    {
      question: 'What fees should I include in the APR calculation?',
      answer: 'Include all upfront costs that reduce your received loan amount or are paid separately at closing. Common fees include: origination fees, discount points, appraisal fees, title insurance, attorney fees, and prepaid interest. Ongoing costs like mortgage insurance or HOA fees are typically not included in APR.'
    },
    {
      question: 'Does a higher APR mean I should avoid the loan?',
      answer: 'Not necessarily. A higher APR might be acceptable if the fees buy you significant benefits, like a lower rate that saves money over time. Also, APR spreads fees over the loan term, so a loan you pay off early might have a higher effective cost. Consider your expected time in the loan when evaluating APR.'
    },
    {
      question: 'What is the difference between rate and APR for mortgages?',
      answer: 'For mortgages, the interest rate determines your monthly principal and interest payment, while APR helps you understand the total cost of the loan. The Truth in Lending Act requires lenders to disclose APR, making it easier to comparison shop. However, APR can be misleading for short-term loans since fees are spread over many years.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'APR Calculator',
        description: 'Calculate the true Annual Percentage Rate (APR) of a loan including fees and closing costs for accurate comparison.',
        url: 'https://www.calculatorpilotai.com/tools/finance/apr-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'APR Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/apr-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate loan payments with different frequencies' },
    { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', desc: 'Calculate home mortgage payments and amortization' },
    { name: 'Refinance Calculator', path: '/tools/finance/refinance-calculator', desc: 'Determine if refinancing makes financial sense' },
  ];

  return (
    <ToolLayout toolId="apr" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">APR Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="apr-loan-amount" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Amount ($)</label>
              <input
                id="apr-loan-amount"
                type="number"
                min="0"
                step="100"
                value={loanAmount}
                onChange={(e) => { setLoanAmount(validateNumberInput(e.target.value, { min: 0 })); clearError('loanAmount'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.loanAmount ? 'border-rose-500' : 'border-slate-200'}`}
                aria-describedby={errors.loanAmount ? 'apr-loan-amount-error' : undefined}
              />
              {errors.loanAmount && <p id="apr-loan-amount-error" className="text-xs text-rose-500" role="alert">{errors.loanAmount}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="apr-nominal-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Nominal Interest Rate (%)</label>
              <input
                id="apr-nominal-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={nominalRate}
                onChange={(e) => { setNominalRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('nominalRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.nominalRate ? 'border-rose-500' : 'border-slate-200'}`}
                aria-describedby={errors.nominalRate ? 'apr-nominal-rate-error' : undefined}
              />
              {errors.nominalRate && <p id="apr-nominal-rate-error" className="text-xs text-rose-500" role="alert">{errors.nominalRate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="apr-years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Term (Years)</label>
              <input
                id="apr-years"
                type="number"
                min="1"
                max="100"
                step="1"
                value={years}
                onChange={(e) => { setYears(validateNumberInput(e.target.value, { min: 1, max: 100 })); clearError('years'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.years ? 'border-rose-500' : 'border-slate-200'}`}
                aria-describedby={errors.years ? 'apr-years-error' : undefined}
              />
              {errors.years && <p id="apr-years-error" className="text-xs text-rose-500" role="alert">{errors.years}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="apr-fees" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fees / Closing Costs ($)</label>
              <input
                id="apr-fees"
                type="number"
                min="0"
                step="100"
                value={fees}
                onChange={(e) => { setFees(validateNumberInput(e.target.value, { min: 0 })); clearError('fees'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.fees ? 'border-rose-500' : 'border-slate-200'}`}
                aria-describedby={errors.fees ? 'apr-fees-error' : undefined}
              />
              {errors.fees && <p id="apr-fees-error" className="text-xs text-rose-500" role="alert">{errors.fees}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate APR
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">APR</span>
                <div className="text-xl md:text-2xl lg:text-3xl font-mono font-bold text-primary tabular-nums leading-none whitespace-nowrap">{formatPercent(result.apr)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Monthly Payment</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none whitespace-nowrap">{formatCurrency(result.monthlyPayment)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Cost</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none whitespace-nowrap">{formatCurrency(result.totalCost)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">Rate Difference</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-amber-600 tabular-nums leading-none whitespace-nowrap">{formatPercent(result.rateDifference, { showSign: true })}</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-amber-800">Why APR Matters</h3>
              <p className="text-amber-700 leading-relaxed">
                The APR of {formatPercent(result.apr)} is {result.rateDifference > 0 ? `${formatPercent(result.rateDifference)} higher` : 'equal'} to the nominal rate of {formatPercent(nominalRate)}.
                This difference represents the cost of fees spread across the {years}-year loan term.
                When comparing loans, always use APR to get a true cost comparison.
              </p>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the APR Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The APR Calculator helps you determine the true annual cost of borrowing by factoring in not just the interest rate, but also all fees and closing costs. This gives you an accurate basis for comparing loan offers from different lenders, as lenders may advertise low rates but charge high fees that make the actual cost much higher.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator takes your loan amount, nominal interest rate, loan term, and fees to compute the APR. It uses the standard APR formula which accounts for how fees effectively reduce the amount you receive while interest is calculated on the full loan amount. This adjusted rate shows the true yearly cost of the loan as a percentage.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>APR accounts for fees spread over the loan term</strong></p>
                <p className="mb-1">APR = (Total Interest + Fees) / Loan Amount / Years</p>
                <p className="mt-3 text-xs text-slate-500">Example: $200,000 loan, 6.5% rate, $5,000 fees, 30 years = 6.81% APR</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <p className="text-slate-700 leading-relaxed mb-3">Your APR calculation provides key insights:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>APR:</strong> The true annual percentage rate including all costs.</li>
                <li><strong>Monthly Payment:</strong> Your principal and interest payment based on the nominal rate.</li>
                <li><strong>Total Cost:</strong> Everything you\'ll pay over the life of the loan.</li>
                <li><strong>Rate Difference:</strong> How much higher the APR is than the nominal rate due to fees.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Comparing nominal rates:</strong> A 5% rate with $10,000 fees might cost more than a 6% rate with no fees.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring the rate difference:</strong> If APR is much higher than the nominal rate, the fees may not be worth it.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Not comparing same-term loans:</strong> APR is only comparable for loans with the same term length.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Always compare APR</strong> when evaluating loan offers from multiple lenders.</p>
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