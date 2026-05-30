import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatPercent, validateNumberInput } from '@/lib/utils';

interface LoanInterestResult {
  monthlyInterest: number;
  totalInterest: number;
  totalPayment: number;
  interestRatio: number;
}

export default function LoanInterestCalculator() {
  const [principal, setPrincipal] = useState(25000);
  const [interestRate, setInterestRate] = useState(8);
  const [termYears, setTermYears] = useState(5);
  const [result, setResult] = useState<LoanInterestResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (principal <= 0) newErrors.principal = 'Principal must be greater than 0';
    if (interestRate < 0 || interestRate > 50) newErrors.interestRate = 'Enter a valid rate (0-50%)';
    if (termYears <= 0 || termYears > 50) newErrors.termYears = 'Term must be 1-50 years';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = termYears * 12;

    let monthlyPayment: number;
    if (monthlyRate > 0) {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = principal / numPayments;
    }

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;
    const monthlyInterest = principal * monthlyRate;
    const interestRatio = (totalInterest / totalPayment) * 100;

    setResult({
      monthlyInterest,
      totalInterest,
      totalPayment,
      interestRatio
    });
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
      answer: 'Simple interest is calculated only on the original principal amount. Compound interest is calculated on the principal plus accumulated interest. Most loans use simple interest, but some credit cards and investments use compound interest. Compound interest can work for or against you depending on whether you are borrowing or investing.'
    },
    {
      question: 'How is loan interest calculated monthly?',
      answer: 'Monthly interest is calculated by multiplying the annual interest rate by the outstanding principal balance and dividing by 12. For example, $25,000 at 8% annual rate: monthly interest = $25,000 × 0.08 / 12 = $166.67.'
    },
    {
      question: 'Why is my first payment mostly interest?',
      answer: 'Early in a loan term, the balance is highest, so more of your payment goes toward interest. As you pay down principal, the interest portion decreases and more goes toward principal. This is called amortization. Making extra payments accelerates principal reduction and reduces total interest.'
    },
    {
      question: 'How can I reduce the total interest on my loan?',
      answer: 'Three main strategies: 1) Make extra payments toward principal, 2) Refinance to a lower rate, 3) Choose a shorter loan term. Even small extra payments can save significant interest over the life of a loan.'
    },
    {
      question: 'What is an APR and how does it differ from interest rate?',
      answer: 'The interest rate is the cost of borrowing the principal. The APR (Annual Percentage Rate) includes the interest rate plus fees and other costs, giving you the true annual cost of the loan. Always compare APRs when shopping for loans.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Loan Interest Calculator',
        description: 'Calculate how much interest you will pay on a loan. See the breakdown of principal vs. interest over the life of the loan.',
        url: 'https://www.calculatorpilotai.com/tools/finance/loan-interest-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Loan Interest Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/loan-interest-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate loan payments with different terms' },
    { name: 'APR Calculator', path: '/tools/finance/apr-calculator', desc: 'Compare the true annual cost of loans' },
    { name: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator', desc: 'Calculate compound interest growth' },
  ];

  return (
    <ToolLayout toolId="loan-interest" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Loan Interest Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="principal" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Amount ($)</label>
              <input
                id="principal"
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
                max="50"
                step="0.1"
                value={interestRate}
                onChange={(e) => { setInterestRate(validateNumberInput(e.target.value, { min: 0, max: 50 })); clearError('interestRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.interestRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.interestRate && <p className="text-xs text-rose-500">{errors.interestRate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="term-years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Term (Years)</label>
              <input
                id="term-years"
                type="number"
                min="1"
                max="50"
                step="1"
                value={termYears}
                onChange={(e) => { setTermYears(validateNumberInput(e.target.value, { min: 1, max: 50 })); clearError('termYears'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.termYears ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.termYears && <p className="text-xs text-rose-500">{errors.termYears}</p>}
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Monthly Interest</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-rose-600 tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.monthlyInterest)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Interest</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-rose-600 tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalInterest)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Payment</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalPayment)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Interest Ratio</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatPercent(result.interestRatio)}</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-4">Cost Breakdown</h3>
              <div className="h-6 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-primary h-full"
                  style={{ width: `${100 - result.interestRatio}%` }}
                />
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: `${result.interestRatio}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Principal ({formatPercent(100 - result.interestRatio)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span>Interest ({formatPercent(result.interestRatio)})</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Loan Interest Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Loan Interest Calculator breaks down the true cost of borrowing by showing how much of your payments go toward principal versus interest. Understanding this split helps you make informed decisions about loans and see the impact of different rates and terms.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Monthly Interest = Principal × (Annual Rate / 12)</strong></p>
                <p className="mb-2"><strong>Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]</strong></p>
                <p className="mb-1">Where:</p>
                <p className="mb-1">• P = Principal amount</p>
                <p className="mb-1">• r = Monthly interest rate</p>
                <p className="mb-1">• n = Number of payments</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Amortization</h3>
              <p className="text-slate-700 leading-relaxed">
                Loans use amortization, where early payments are mostly interest and later payments are mostly principal. This happens because interest is calculated on the remaining balance. Making extra payments reduces the principal faster, shifting more of subsequent payments toward principal reduction.
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
