import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateLoan, LoanResult } from '@/lib/engines';
import { generateLoanInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput, formatDuration } from '@/lib/utils';

type Frequency = 'monthly' | 'biweekly' | 'weekly';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [monthlyIncome, setMonthlyIncome] = useState(6000);
  const [result, setResult] = useState<LoanResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (loanAmount <= 0) newErrors.loanAmount = 'Loan amount must be greater than 0';
    if (loanAmount > 100000000) newErrors.loanAmount = 'Loan amount seems unrealistically high';
    if (interestRate < 0) newErrors.interestRate = 'Interest rate cannot be negative';
    if (interestRate > 50) newErrors.interestRate = 'Interest rate seems unrealistically high';
    if (years <= 0) newErrors.years = 'Loan term must be at least 1 year';
    if (years > 100) newErrors.years = 'Loan term seems unrealistically long';
    if (monthlyIncome <= 0) newErrors.monthlyIncome = 'Monthly income must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateLoan(loanAmount, interestRate, years, frequency);
    setResult(res);
    setInsight(generateLoanInsight(res, monthlyIncome));
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const getFrequencySuffix = () => {
    switch (frequency) {
      case 'monthly': return '/mo';
      case 'biweekly': return '/biwk';
      case 'weekly': return '/wk';
      default: return '';
    }
  };

  const faqs = [
    {
      question: 'How is my loan payment calculated?',
      answer: 'Your loan payment is calculated using the amortization formula: M = P × [r(1+r)^n] / [(1+r)^n - 1], where P is the principal, r is the periodic interest rate, and n is the total number of payments. This formula ensures equal payments throughout the loan term, with the interest portion decreasing over time as the principal is paid down.'
    },
    {
      question: 'What is the difference between monthly, biweekly, and weekly payments?',
      answer: 'Monthly payments divide your annual rate by 12. Biweekly payments divide by 26, meaning you make 13 full payments per year instead of 12. Weekly payments divide by 52. Making more frequent payments reduces total interest because interest accrues on a slightly lower balance more often. Biweekly payments can help you pay off your loan years earlier.'
    },
    {
      question: 'How does the loan term affect my total cost?',
      answer: 'A longer loan term means lower monthly payments but more total interest paid. For example, a 7-year loan at 7.5% on $25,000 will have higher payments than a 5-year loan, but you\'ll pay less total interest on the 5-year loan. Choose the shortest term you can afford to minimize interest costs.'
    },
    {
      question: 'What is a good interest rate for a loan?',
      answer: 'Good loan rates vary by credit score, loan type, and market conditions. Generally, rates below 10% are competitive for personal loans with good credit. Secured loans (like auto loans) typically have lower rates than unsecured loans. Compare rates from multiple lenders, as even a 1% difference can mean thousands of dollars over the life of the loan.'
    },
    {
      question: 'How much of my income should go toward loan payments?',
      answer: 'Financial advisors often recommend keeping total debt payments under 36% of your gross monthly income. Your loan payment should fit comfortably within your budget alongside other obligations. Use our monthly income field to see your debt-to-income ratio and ensure your loan payment is sustainable.'
    },
    {
      question: 'Should I make extra payments on my loan?',
      answer: 'Making extra payments can significantly reduce your total interest and pay off the loan faster. Any amount above your regular payment goes directly to principal. Before making extra payments, check if your loan has prepayment penalties or if you have higher-interest debt that should be paid off first.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Loan Calculator',
        description: 'Calculate monthly, biweekly, or weekly loan payments with adjustable payment frequency and term options.',
        url: 'https://www.calculatorpilotai.com/tools/finance/loan-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Loan Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/loan-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', desc: 'Calculate home mortgage payments with amortization' },
    { name: 'APR Calculator', path: '/tools/finance/apr-calculator', desc: 'Compare the true annual cost of loans' },
    { name: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator', desc: 'See how your savings or investments grow' },
  ];

  return (
    <ToolLayout toolId="loan" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Loan Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="loan-amount" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Amount ($)</label>
              <input
                id="loan-amount"
                type="number"
                min="0"
                step="100"
                value={loanAmount}
                onChange={(e) => { setLoanAmount(validateNumberInput(e.target.value, { min: 0 })); clearError('loanAmount'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.loanAmount ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.loanAmount && <p className="text-xs text-rose-500">{errors.loanAmount}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="interest-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</label>
              <input
                id="interest-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={interestRate}
                onChange={(e) => { setInterestRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('interestRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.interestRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.interestRate && <p className="text-xs text-rose-500">{errors.interestRate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="loan-term" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Term (Years)</label>
              <input
                id="loan-term"
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
              <label htmlFor="payment-frequency" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Payment Frequency</label>
              <select
                id="payment-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="monthly">Monthly</option>
                <option value="biweekly">Biweekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="monthly-income" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Income ($)</label>
              <input
                id="monthly-income"
                type="number"
                min="0"
                step="100"
                value={monthlyIncome}
                onChange={(e) => { setMonthlyIncome(validateNumberInput(e.target.value, { min: 0 })); clearError('monthlyIncome'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.monthlyIncome ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.monthlyIncome && <p className="text-xs text-rose-500">{errors.monthlyIncome}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Payment
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Payment</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-primary tabular-nums leading-none overflow-wrap-anywhere">
                  {formatCurrency(result.payment)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">{getFrequencySuffix()}</span>
                </div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Interest</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalInterest)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Payment</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalPayment)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Payoff Date</span>
                <div className="text-lg md:text-xl font-mono font-bold leading-none">{result.payoffDate}</div>
              </div>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Loan Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Loan Calculator helps you estimate payments for any type of installment loan—whether it\'s a personal loan, auto loan, or student loan. You can choose between monthly, biweekly, or weekly payment frequencies to see how different payment schedules affect your total interest and payoff date. This tool is essential for comparing loan offers and budgeting for major purchases.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator uses the standard amortization formula to determine your payment amount based on the loan principal, interest rate, and term. It then calculates the total interest you\'ll pay and projects your payoff date. By adjusting the payment frequency, you can see how making payments more often can reduce your total interest and help you pay off the loan faster.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>M = P × [r(1+r)^n] / [(1+r)^n - 1]</strong></p>
                <p className="mb-1">Where:</p>
                <p className="mb-1">• M = Payment amount per period</p>
                <p className="mb-1">• P = Principal loan amount</p>
                <p className="mb-1">• r = Periodic interest rate (annual rate ÷ number of periods per year)</p>
                <p className="mb-1">• n = Total number of payments (term in years × payments per year)</p>
                <p className="mt-3 text-xs text-slate-500">Example: $25,000 at 7.5% for 5 years monthly = $501/mo</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <p className="text-slate-700 leading-relaxed mb-3">Your loan calculation provides four key figures:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Payment:</strong> Your fixed payment amount per period, including principal and interest.</li>
                <li><strong>Total Interest:</strong> The sum of all interest paid over the loan term.</li>
                <li><strong>Total Payment:</strong> The total amount you\'ll pay (principal + interest).</li>
                <li><strong>Payoff Date:</strong> The projected date when you\'ll make your final payment.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring the APR:</strong> Look at the Annual Percentage Rate (APR), not just the interest rate, to compare the true cost of loans.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Focusing only on monthly payment:</strong> A lower payment with a longer term means more total interest paid.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Not comparing lenders:</strong> Getting quotes from multiple lenders can save thousands of dollars.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Use the biweekly option</strong> to see how making half-payments more often can save money.</p>
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