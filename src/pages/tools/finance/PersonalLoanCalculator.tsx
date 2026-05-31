import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatPercent, validateNumberInput } from '@/lib/utils';

interface PersonalLoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  apr: number;
  payoffDate: string;
}

export default function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [interestRate, setInterestRate] = useState(10);
  const [termYears, setTermYears] = useState(3);
  const [fees, setFees] = useState(500);
  const [result, setResult] = useState<PersonalLoanResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (loanAmount <= 0) newErrors.loanAmount = 'Loan amount must be greater than 0';
    if (loanAmount > 500000) newErrors.loanAmount = 'Loan amount seems too high';
    if (interestRate < 0 || interestRate > 50) newErrors.interestRate = 'Enter a valid interest rate (0-50%)';
    if (termYears < 1 || termYears > 30) newErrors.termYears = 'Term must be 1-30 years';
    if (fees < 0) newErrors.fees = 'Fees cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = termYears * 12;
    const effectiveAmount = loanAmount - fees;

    let monthlyPayment: number;
    if (monthlyRate > 0) {
      monthlyPayment = effectiveAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = effectiveAmount / numPayments;
    }

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - effectiveAmount;
    const apr = (totalInterest + fees) / effectiveAmount * 100 / termYears * 100 / 100;

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + numPayments);

    setResult({
      monthlyPayment,
      totalInterest,
      totalPayment,
      apr: (totalInterest + fees) / loanAmount / termYears * 100,
      payoffDate: payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
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
      question: 'What is a personal loan?',
      answer: 'A personal loan is an unsecured loan that you repay in fixed monthly installments over a set period. Unlike auto loans or mortgages, personal loans are not backed by collateral. They can be used for debt consolidation, home improvements, medical expenses, or major purchases.'
    },
    {
      question: 'How is the interest rate determined?',
      answer: 'Personal loan rates are based primarily on your credit score, income, and debt-to-income ratio. Lenders also consider the loan amount and term. Those with excellent credit (750+) typically qualify for rates between 6-10%, while those with fair credit (630-689) may see rates of 15-25% or higher.'
    },
    {
      question: 'What fees should I expect with a personal loan?',
      answer: 'Common fees include origination fees (1-8% of loan amount), prepayment penalties, and late fees. Always ask about all fees before signing. The APR (Annual Percentage Rate) includes both interest and fees, giving you the true cost of the loan.'
    },
    {
      question: 'Should I pay off debt with a personal loan?',
      answer: 'Debt consolidation can make sense if you can get a lower rate than your current debt. Calculate whether the monthly savings justify the time and effort. Also consider: will you stop using the old cards? If not, consolidation may just create more debt.'
    },
    {
      question: 'What is the difference between APR and interest rate?',
      answer: 'The interest rate is the cost of borrowing the principal amount. The APR includes the interest rate plus all fees, giving you the true annual cost of the loan. Always compare APRs when shopping for loans to get an accurate comparison.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Personal Loan Calculator',
        description: 'Calculate monthly payments, total interest, and APR for personal loans. Compare different loan terms and see when you will be debt-free.',
        url: 'https://www.calculatorpilotai.com/tools/finance/personal-loan-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Personal Loan Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/personal-loan-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate loan payments with different frequencies' },
    { name: 'Debt Payoff Calculator', path: '/tools/finance/debt-payoff-calculator', desc: 'Create a debt payoff strategy' },
    { name: 'APR Calculator', path: '/tools/finance/apr-calculator', desc: 'Compare the true cost of loans' },
  ];

  return (
    <ToolLayout toolId="personal-loan" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Personal Loan Calculator</h2>
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
                max="30"
                step="1"
                value={termYears}
                onChange={(e) => { setTermYears(validateNumberInput(e.target.value, { min: 1, max: 30 })); clearError('termYears'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.termYears ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.termYears && <p className="text-xs text-rose-500">{errors.termYears}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="fees" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Origination Fees ($)</label>
              <input
                id="fees"
                type="number"
                min="0"
                step="25"
                value={fees}
                onChange={(e) => { setFees(validateNumberInput(e.target.value, { min: 0 })); clearError('fees'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.fees ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.fees && <p className="text-xs text-rose-500">{errors.fees}</p>}
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
              <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Monthly Payment</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-black tabular-nums leading-none whitespace-nowrap">{formatCurrency(result.monthlyPayment)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Interest</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-rose-600 tabular-nums leading-none whitespace-nowrap">{formatCurrency(result.totalInterest)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Payment</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none whitespace-nowrap">{formatCurrency(result.totalPayment)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Debt-Free By</span>
                <div className="text-base md:text-lg font-mono font-bold leading-none">{result.payoffDate}</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Personal Loan Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Personal Loan Calculator estimates your monthly payments, total interest, and overall loan cost. It helps you understand the true cost of borrowing and plan your budget accordingly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>M = P × [r(1+r)^n] / [(1+r)^n - 1]</strong></p>
                <p className="mb-1">Where:</p>
                <p className="mb-1">• M = Monthly payment</p>
                <p className="mb-1">• P = Principal (loan amount minus fees)</p>
                <p className="mb-1">• r = Monthly interest rate</p>
                <p className="mb-1">• n = Total number of payments</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Tips for Getting the Best Personal Loan Rate</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Check your credit score:</strong> Know where you stand before applying</li>
                <li><strong>Shop around:</strong> Compare rates from at least 3-5 lenders</li>
                <li><strong>Consider credit unions:</strong> Often offer lower rates than banks</li>
                <li><strong>Add a co-signer:</strong> Can help you qualify for better rates</li>
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
