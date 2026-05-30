import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, validateNumberInput } from '@/lib/utils';

interface StudentLoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  payoffDate: string;
  gracePeriodInterest: number;
}

export default function StudentLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(35000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(120);
  const [gracePeriod, setGracePeriod] = useState(6);
  const [result, setResult] = useState<StudentLoanResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (loanAmount <= 0) newErrors.loanAmount = 'Loan amount must be greater than 0';
    if (loanAmount > 500000) newErrors.loanAmount = 'Loan amount seems too high';
    if (interestRate < 0 || interestRate > 25) newErrors.interestRate = 'Enter a valid interest rate (0-25%)';
    if (loanTerm < 12 || loanTerm > 360) newErrors.loanTerm = 'Loan term must be 12-360 months';
    if (gracePeriod < 0 || gracePeriod > 24) newErrors.gracePeriod = 'Grace period must be 0-24 months';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    let monthlyPayment: number;
    if (monthlyRate > 0) {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numPayments;
    }

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;
    const gracePeriodInterest = loanAmount * (interestRate / 100) * (gracePeriod / 12);

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + gracePeriod + loanTerm);

    setResult({
      monthlyPayment,
      totalInterest,
      totalPayment,
      payoffDate: payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      gracePeriodInterest
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
      question: 'When do I start repaying student loans?',
      answer: 'Most federal student loans have a 6-month grace period after graduation before you must start making payments. Private loans vary—some start immediately while others offer grace periods. During grace periods, interest may accrue on unsubsidized loans.'
    },
    {
      question: 'What is the difference between federal and private student loans?',
      answer: 'Federal student loans are issued by the government with fixed rates, income-driven repayment options, and potential forgiveness programs. Private loans are issued by banks and lenders with rates based on credit, often requiring a co-signer, and typically fewer repayment options.'
    },
    {
      question: 'Should I pay off student loans early?',
      answer: 'Consider paying early if you have extra money, but weigh this against other financial goals. If your loans have high interest rates, paying them off is like earning that rate risk-free. However, if you have lower rates and other financial priorities (emergency fund, retirement), those may take precedence.'
    },
    {
      question: 'What is student loan refinancing?',
      answer: 'Refinancing means getting a new loan at a lower interest rate to pay off your existing loans. This can save money but loses federal loan benefits like income-driven repayment and forgiveness programs. It is best for those with good credit who do not need those protections.'
    },
    {
      question: 'How do income-driven repayment plans work?',
      answer: 'Income-driven repayment plans (IDR) cap your monthly payment at 10-20% of your discretionary income. After 20-25 years of payments, any remaining balance is forgiven. These plans are valuable for those pursuing Public Service Loan Forgiveness or with high debt-to-income ratios.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Student Loan Calculator',
        description: 'Calculate monthly payments and total costs for student loans. See the impact of different terms and interest rates on your loan payoff.',
        url: 'https://www.calculatorpilotai.com/tools/finance/student-loan-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Student Loan Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/student-loan-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate loan payments for any purpose' },
    { name: 'Debt Payoff Calculator', path: '/tools/finance/debt-payoff-calculator', desc: 'Create a debt payoff strategy' },
    { name: 'Income Tax Calculator', path: '/tools/finance/income-tax-calculator', desc: 'Estimate your income taxes' },
  ];

  return (
    <ToolLayout toolId="student-loan" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Student Loan Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="loan-amount" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Student Loan Balance ($)</label>
              <input
                id="loan-amount"
                type="number"
                min="0"
                step="500"
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
                max="25"
                step="0.1"
                value={interestRate}
                onChange={(e) => { setInterestRate(validateNumberInput(e.target.value, { min: 0, max: 25 })); clearError('interestRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.interestRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.interestRate && <p className="text-xs text-rose-500">{errors.interestRate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="loan-term" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Term (Months)</label>
              <select
                id="loan-term"
                value={loanTerm}
                onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="60">60 months (5 years)</option>
                <option value="120">120 months (10 years)</option>
                <option value="180">180 months (15 years)</option>
                <option value="240">240 months (20 years)</option>
                <option value="300">300 months (25 years)</option>
              </select>
              {errors.loanTerm && <p className="text-xs text-rose-500">{errors.loanTerm}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="grace-period" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Grace Period (Months)</label>
              <input
                id="grace-period"
                type="number"
                min="0"
                max="24"
                step="1"
                value={gracePeriod}
                onChange={(e) => { setGracePeriod(validateNumberInput(e.target.value, { min: 0, max: 24 })); clearError('gracePeriod'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.gracePeriod ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.gracePeriod && <p className="text-xs text-rose-500">{errors.gracePeriod}</p>}
              <p className="text-xs text-slate-500">Federal loans: 6 months</p>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Student Loan
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Monthly Payment</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-primary tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.monthlyPayment)}</div>
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
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Debt-Free By</span>
                <div className="text-base md:text-lg font-mono font-bold leading-none">{result.payoffDate}</div>
              </div>
            </div>

            {result.gracePeriodInterest > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-amber-900 mb-2">Grace Period Interest</h3>
                <p className="text-amber-800 text-sm">
                  Interest that accrues during your {gracePeriod}-month grace period: <strong>{formatCurrency(result.gracePeriodInterest)}</strong>. This will be added to your principal when repayment begins.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Student Loan Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Student Loan Calculator estimates your monthly payments and total loan costs. It accounts for the grace period before repayment begins and shows the total interest you will pay over the life of the loan.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Student Loan Repayment</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Standard repayment:</strong> 10-year term with fixed payments</li>
                <li><strong>Graduated repayment:</strong> Starts low, increases over time</li>
                <li><strong>Extended repayment:</strong> For loans over $30,000, up to 25 years</li>
                <li><strong>Income-driven plans:</strong> Payments based on your income</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Tips for Managing Student Loans</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Make extra payments:</strong> Can significantly reduce total interest</li>
                <li><strong>Automate payments:</strong> Many lenders offer rate discounts for autopay</li>
                <li><strong>Explore forgiveness:</strong> Public Service Loan Forgiveness may be an option</li>
                <li><strong>Consider refinancing:</strong> Can lower your rate but loses federal benefits</li>
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
