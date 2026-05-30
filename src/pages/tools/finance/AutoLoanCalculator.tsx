import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, validateNumberInput } from '@/lib/utils';

interface AutoLoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  downPaymentPercent: number;
  payoffDate: string;
}

export default function AutoLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeIn, setTradeIn] = useState(0);
  const [interestRate, setInterestRate] = useState(7);
  const [loanTerm, setLoanTerm] = useState(60);
  const [result, setResult] = useState<AutoLoanResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (vehiclePrice <= 0) newErrors.vehiclePrice = 'Vehicle price must be greater than 0';
    if (downPayment < 0) newErrors.downPayment = 'Down payment cannot be negative';
    if (tradeIn < 0) newErrors.tradeIn = 'Trade-in value cannot be negative';
    if (interestRate < 0 || interestRate > 30) newErrors.interestRate = 'Enter a valid interest rate (0-30%)';
    if (loanTerm < 12 || loanTerm > 96) newErrors.loanTerm = 'Loan term must be 12-96 months';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const loanAmount = Math.max(0, vehiclePrice - downPayment - tradeIn);
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
    const downPaymentPercent = ((downPayment + tradeIn) / vehiclePrice) * 100;

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + loanTerm);

    setResult({
      monthlyPayment,
      totalInterest,
      totalPayment,
      downPaymentPercent,
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

  const loanAmount = Math.max(0, vehiclePrice - downPayment - tradeIn);

  const faqs = [
    {
      question: 'What is a good auto loan interest rate?',
      answer: 'Good rates vary based on your credit score. For new cars in 2026: Excellent credit (750+): 5-7%, Good credit (700-749): 7-10%, Fair credit (650-699): 10-15%, Subprime (600-649): 15-20%. Rates for used cars are typically 1-3% higher than new car rates.'
    },
    {
      question: 'How much should I put down on a car?',
      answer: 'The traditional recommendation is 20% down for new cars to avoid being upside down on the loan. However, putting down at least 10% helps avoid negative equity. Larger down payments mean lower monthly payments and less total interest paid.'
    },
    {
      question: 'What is the best loan term for an auto loan?',
      answer: 'Shorter terms (36-48 months) mean higher payments but less total interest. Longer terms (60-72 months) have lower payments but cost more in interest and risk being upside down longer. Aim for the shortest term you can afford while still meeting your monthly budget.'
    },
    {
      question: 'Should I trade in my car or sell it privately?',
      answer: 'Dealers typically offer 10-20% less than private sale value, but trading in simplifies the process and may reduce sales tax. If your car is worth significantly more than your loan payoff, selling privately could net you more money. Consider the convenience vs. value tradeoff.'
    },
    {
      question: 'How does my credit score affect my auto loan?',
      answer: 'Your credit score is the primary factor in determining your interest rate. Higher scores mean lower rates and more lender options. Before applying, check your credit report for errors and consider improving your score if you have time before buying.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Auto Loan Calculator',
        description: 'Calculate monthly payments, total interest, and costs for auto loans. Factor in down payment, trade-in value, and different loan terms.',
        url: 'https://www.calculatorpilotai.com/tools/finance/auto-loan-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Auto Loan Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/auto-loan-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate loan payments for any purpose' },
    { name: 'APR Calculator', path: '/tools/finance/apr-calculator', desc: 'Compare the true annual cost of loans' },
    { name: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator', desc: 'See how interest compounds over time' },
  ];

  return (
    <ToolLayout toolId="auto-loan" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Auto Loan Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="vehicle-price" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Vehicle Price ($)</label>
              <input
                id="vehicle-price"
                type="number"
                min="0"
                step="500"
                value={vehiclePrice}
                onChange={(e) => { setVehiclePrice(validateNumberInput(e.target.value, { min: 0 })); clearError('vehiclePrice'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.vehiclePrice ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.vehiclePrice && <p className="text-xs text-rose-500">{errors.vehiclePrice}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="down-payment" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Down Payment ($)</label>
              <input
                id="down-payment"
                type="number"
                min="0"
                step="500"
                value={downPayment}
                onChange={(e) => { setDownPayment(validateNumberInput(e.target.value, { min: 0 })); clearError('downPayment'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.downPayment ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.downPayment && <p className="text-xs text-rose-500">{errors.downPayment}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="trade-in" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trade-In Value ($)</label>
              <input
                id="trade-in"
                type="number"
                min="0"
                step="500"
                value={tradeIn}
                onChange={(e) => { setTradeIn(validateNumberInput(e.target.value, { min: 0 })); clearError('tradeIn'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.tradeIn ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.tradeIn && <p className="text-xs text-rose-500">{errors.tradeIn}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="interest-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</label>
              <input
                id="interest-rate"
                type="number"
                min="0"
                max="30"
                step="0.1"
                value={interestRate}
                onChange={(e) => { setInterestRate(validateNumberInput(e.target.value, { min: 0, max: 30 })); clearError('interestRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.interestRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.interestRate && <p className="text-xs text-rose-500">{errors.interestRate}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="loan-term" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Term (Months)</label>
              <select
                id="loan-term"
                value={loanTerm}
                onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="36">36 months (3 years)</option>
                <option value="48">48 months (4 years)</option>
                <option value="60">60 months (5 years)</option>
                <option value="72">72 months (6 years)</option>
                <option value="84">84 months (7 years)</option>
              </select>
              {errors.loanTerm && <p className="text-xs text-rose-500">{errors.loanTerm}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Auto Loan
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-900 text-white rounded-xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loan Amount</span>
              <div className="text-3xl md:text-4xl font-mono font-black mt-2">{formatCurrency(loanAmount)}</div>
              <span className="text-sm text-slate-400">to finance</span>
            </div>
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
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Down Payment</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{result.downPaymentPercent.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Auto Loan Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Auto Loan Calculator helps you estimate your monthly car payment and total loan costs. It factors in the vehicle price, down payment, trade-in value, interest rate, and loan term to give you a complete picture of your auto financing.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Tips for Auto Financing</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Get pre-approved:</strong> Knowing your rate before visiting the dealer gives you negotiating power</li>
                <li><strong>Compare rates:</strong> Banks, credit unions, and online lenders may offer better deals than dealer financing</li>
                <li><strong>Watch the total cost:</strong> Longer terms mean lower payments but more interest paid overall</li>
                <li><strong>Avoid add-ons:</strong> Dealer add-ons (extended warranties, GAP insurance) often have markup</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>M = P × [r(1+r)^n] / [(1+r)^n - 1]</strong></p>
                <p className="mb-1">Where:</p>
                <p className="mb-1">• M = Monthly payment</p>
                <p className="mb-1">• P = Loan amount (price - down - trade-in)</p>
                <p className="mb-1">• r = Monthly interest rate</p>
                <p className="mb-1">• n = Number of payments</p>
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
