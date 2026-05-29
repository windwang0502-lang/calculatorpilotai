import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateDebtPayoff, DebtPayoffResult } from '@/lib/engines';
import { generateDebtPayoffInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function DebtPayoffCalculator() {
  const [balance, setBalance] = useState(15000);
  const [rate, setRate] = useState(19.99);
  const [monthlyPayment, setMonthlyPayment] = useState(300);
  const [extraPayment, setExtraPayment] = useState(150);
  const [useExtraPayment, setUseExtraPayment] = useState(true);
  const [result, setResult] = useState<DebtPayoffResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (balance <= 0) newErrors.balance = 'Debt balance must be greater than 0';
    if (balance > 100000000) newErrors.balance = 'Balance seems unrealistically high';
    if (rate < 0) newErrors.rate = 'Interest rate cannot be negative';
    if (rate > 100) newErrors.rate = 'Interest rate seems unrealistically high';
    if (monthlyPayment <= 0) newErrors.monthlyPayment = 'Monthly payment must be greater than 0';
    if (extraPayment < 0) newErrors.extraPayment = 'Extra payment cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateDebtPayoff(balance, rate, monthlyPayment, extraPayment, useExtraPayment);
    setResult(res);
    setInsight(generateDebtPayoffInsight(res));
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
      question: 'How does extra payment reduce my debt faster?',
      answer: 'When you make a payment on a debt, the interest for that month is calculated first, and the remainder goes to principal. By adding extra to your payment, that additional amount goes directly to reducing principal. This means the next month\'s interest is calculated on a smaller balance, so more of your payment goes to principal. This creates a compounding effect that accelerates your payoff dramatically.'
    },
    {
      question: 'What is the avalanche method for debt payoff?',
      answer: 'The avalanche method (also called debt stacking) involves paying minimums on all debts while putting every extra dollar toward the debt with the highest interest rate. This mathematically minimizes total interest paid. Our calculator compares payoff with and without extra payments to show the power of this approach.'
    },
    {
      question: 'What is the snowball method?',
      answer: 'The snowball method (popularized by Dave Ramsey) involves paying off debts from smallest to largest balance, regardless of interest rate. The psychological wins from eliminating small debts first provide motivation to keep going. While it may cost more in total interest, the behavioral benefits make it effective for many people.'
    },
    {
      question: 'How much can extra payments save me?',
      answer: 'The savings from extra payments can be substantial. On a $15,000 balance at 19.99% with $300 minimum payment, adding just $150/month saves over $6,000 in interest and cuts 4 years off your payoff time. The higher your interest rate, the more you save with extra payments.'
    },
    {
      question: 'Should I pay off debt or invest first?',
      answer: 'Generally, paying off high-interest debt (like credit cards) provides a guaranteed "return" equal to the interest rate. However, you should maintain an emergency fund first. For debts under 5-6% interest, minimum payments while investing may make sense, especially with employer 401k matching.'
    },
    {
      question: 'What payment is too low to make progress?',
      answer: 'If your monthly payment doesn\'t exceed the monthly interest accrual, your balance will never decrease. For example, a $15,000 balance at 19.99% APR accrues about $249 in monthly interest ($15,000 × 0.1999 ÷ 12). Any payment under $249 actually increases your debt. Our calculator alerts you when this happens.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Debt Payoff Calculator',
        description: 'Calculate how extra payments can accelerate your debt payoff and save thousands in interest.',
        url: 'https://www.calculatorpilotai.com/tools/finance/debt-payoff-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Debt Payoff Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/debt-payoff-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate loan payments and total costs' },
    { name: 'Interest Calculator', path: '/tools/finance/interest-calculator', desc: 'Calculate simple and compound interest' },
    { name: 'APR Calculator', path: '/tools/finance/apr-calculator', desc: 'Compare the true cost of loans' },
  ];

  return (
    <ToolLayout toolId="debt-payoff" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Debt Payoff Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="debt-balance" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Debt Balance ($)</label>
              <input
                id="debt-balance"
                type="number"
                min="0"
                step="100"
                value={balance}
                onChange={(e) => { setBalance(validateNumberInput(e.target.value, { min: 0 })); clearError('balance'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.balance ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.balance && <p className="text-xs text-rose-500">{errors.balance}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="debt-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</label>
              <input
                id="debt-rate"
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
              <label htmlFor="monthly-payment" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Payment ($)</label>
              <input
                id="monthly-payment"
                type="number"
                min="0"
                step="10"
                value={monthlyPayment}
                onChange={(e) => { setMonthlyPayment(validateNumberInput(e.target.value, { min: 0 })); clearError('monthlyPayment'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.monthlyPayment ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.monthlyPayment && <p className="text-xs text-rose-500">{errors.monthlyPayment}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="extra-payment" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Extra Monthly Payment ($)</label>
              <input
                id="extra-payment"
                type="number"
                min="0"
                step="10"
                value={extraPayment}
                onChange={(e) => { setExtraPayment(validateNumberInput(e.target.value, { min: 0 })); clearError('extraPayment'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.extraPayment ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.extraPayment && <p className="text-xs text-rose-500">{errors.extraPayment}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="useExtraPayment"
                  checked={useExtraPayment}
                  onChange={(e) => setUseExtraPayment(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="useExtraPayment" className="text-sm font-semibold text-muted-foreground">
                  Include extra payment in calculation
                </label>
              </div>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Payoff
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {result.monthsToPayOff === Infinity ? (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2 text-rose-800">Payment Too Low</h3>
                <p className="text-rose-700 leading-relaxed">
                  Your monthly payment of {formatCurrency(monthlyPayment)} does not cover the monthly interest of {formatCurrency(balance * rate / 100 / 12)}.
                  Your debt will never decrease with this payment amount. Please increase your payment.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Months to Pay Off</span>
                    <div className={`${getResultTextSize(String(result.monthsToPayOff))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>{result.monthsToPayOff}</div>
                  </div>
                  <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Interest</span>
                    <div className={`${getResultTextSize(formatCurrency(result.totalInterest))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.totalInterest)}</div>
                  </div>
                  <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Paid</span>
                    <div className={`${getResultTextSize(formatCurrency(result.totalPaid))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.totalPaid)}</div>
                  </div>
                  <div className="p-4 sm:p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Time Saved</span>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-600">{result.timeSaved} mo</div>
                  </div>
                  <div className="p-4 sm:p-6 bg-primary/5 border border-primary/20 rounded-xl text-center col-span-2 lg:col-span-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Interest Saved</span>
                    <div className={`${getResultTextSize(formatCurrency(result.interestSaved))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.interestSaved)}</div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-emerald-800">Payoff Summary</h3>
                  <p className="text-emerald-700 leading-relaxed">
                    {useExtraPayment && result.timeSaved > 0
                      ? `By paying ${formatCurrency(monthlyPayment + extraPayment)} monthly instead of just ${formatCurrency(monthlyPayment)}, you will be debt-free in ${result.monthsToPayOff} months. You will save ${formatCurrency(result.interestSaved)} in interest and become debt-free ${result.timeSaved} months earlier.`
                      : `With your current payment of ${formatCurrency(monthlyPayment)} monthly, you will be debt-free in ${result.monthsToPayOff} months. Total interest paid: ${formatCurrency(result.totalInterest)}.`}
                  </p>
                </div>

                <AIInsightPanel insight={insight} />
              </>
            )}
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Debt Payoff Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Debt Payoff Calculator helps you understand how extra payments can dramatically accelerate your path to being debt-free. It shows how much time and money you can save by paying more than the minimum each month. This tool is essential for planning your debt payoff strategy and staying motivated.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator tracks your balance month by month, applying interest and subtracting payments until the balance reaches zero. It calculates the total interest paid and how long it takes to become debt-free. By comparing scenarios with and without extra payments, you can see the power of accelerated payoff.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Math</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Monthly Interest = Balance × (APR ÷ 12)</strong></p>
                <p className="mb-2"><strong>Principal Paid = Payment - Monthly Interest</strong></p>
                <p className="text-xs text-slate-500">New Balance = Previous Balance - Principal Paid</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Months to Pay Off:</strong> Total time until debt-free.</li>
                <li><strong>Total Interest:</strong> Money paid just for borrowing.</li>
                <li><strong>Total Paid:</strong> Principal plus all interest.</li>
                <li><strong>Time & Interest Saved:</strong> Benefits of extra payments.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Making minimum payments only:</strong> This maximizes interest paid and time in debt.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring high-interest debt:</strong> Credit cards with 20%+ rates cost you heavily.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Even small extra payments help</strong> — any amount above minimum reduces principal faster.</p>
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