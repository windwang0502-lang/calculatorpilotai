import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateMortgage, MortgageResult, AmortizationRow } from '@/lib/engines';
import { generateMortgageInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [years, setYears] = useState(30);
  const [monthlyIncome, setMonthlyIncome] = useState(8000);
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAllRows, setShowAllRows] = useState(false);

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
    const res = calculateMortgage(loanAmount, interestRate, years);
    setResult(res);
    setInsight(generateMortgageInsight(res, monthlyIncome));
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
      question: 'How is my monthly mortgage payment calculated?',
      answer: 'Your monthly payment is calculated using the standard amortization formula: M = P × [r(1+r)^n] / [(1+r)^n - 1], where P is the principal loan amount, r is the monthly interest rate (annual rate divided by 12), and n is the total number of payments. This formula spreads your loan evenly over the loan term, with early payments going mostly toward interest and later payments going mostly toward principal.'
    },
    {
      question: 'What is an amortization schedule?',
      answer: 'An amortization schedule is a table that shows how each payment is split between principal and interest over the life of your loan. It also displays your remaining loan balance after each payment. Early in the loan term, a larger portion of each payment goes toward interest. As the principal decreases, less interest accrues, so more of your payment goes toward reducing the principal.'
    },
    {
      question: 'How does my interest rate affect my total cost?',
      answer: 'Even a small difference in interest rate significantly impacts your total cost. For example, on a $300,000 30-year loan, a 0.5% rate difference can mean tens of thousands of dollars in additional interest paid over the life of the loan. Use our calculator to compare different rates and see how refinancing or making extra payments can save you money.'
    },
    {
      question: 'Should I choose a 15-year or 30-year mortgage?',
      answer: 'A 15-year mortgage typically offers a lower interest rate but higher monthly payments. While you\'ll pay less total interest with a 15-year loan, the higher payments may strain your budget. A 30-year mortgage offers lower monthly payments but more total interest paid. Choose based on your budget, long-term financial goals, and how long you plan to stay in the home.'
    },
    {
      question: 'What is the 28/36 rule for mortgage qualification?',
      answer: 'Lenders often use the 28/36 rule as a guideline for mortgage qualification: your housing expenses (including mortgage, property tax, and insurance) should not exceed 28% of your gross monthly income, and your total debt payments should not exceed 36%. Our calculator includes a monthly income field to help you understand if your mortgage fits these guidelines.'
    },
    {
      question: 'How much should I put down on a house?',
      answer: 'While a 20% down payment is ideal to avoid private mortgage insurance (PMI), many buyers put down 3-20% depending on their situation. A larger down payment reduces your monthly payment and total interest, but tying up more money in real estate reduces liquidity. Consider your emergency fund, other debts, and investment opportunities when deciding on a down payment amount.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Mortgage Calculator',
        description: 'Calculate your monthly mortgage payment, total interest, and view a complete amortization schedule for your home loan.',
        url: 'https://www.calculatorpilotai.com/tools/finance/mortgage-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Mortgage Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/mortgage-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate monthly payments for any type of loan' },
    { name: 'APR Calculator', path: '/tools/finance/apr-calculator', desc: 'Calculate the true annual cost of borrowing' },
    { name: 'Refinance Calculator', path: '/tools/finance/refinance-calculator', desc: 'Determine if refinancing makes sense for you' },
  ];

  return (
    <ToolLayout toolId="mortgage" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Mortgage Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="mortgage-amount" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Amount ($)</label>
              <input
                id="mortgage-amount"
                type="number"
                min="0"
                step="1000"
                value={loanAmount}
                onChange={(e) => { setLoanAmount(validateNumberInput(e.target.value, { min: 0 })); clearError('loanAmount'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.loanAmount ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.loanAmount && <p className="text-xs text-rose-500">{errors.loanAmount}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="mortgage-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</label>
              <input
                id="mortgage-rate"
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
              <label htmlFor="mortgage-years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Term (Years)</label>
              <input
                id="mortgage-years"
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
              <label htmlFor="mortgage-income" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Income ($)</label>
              <input
                id="mortgage-income"
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
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Payment
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Monthly Payment</span>
                <div className={`${getResultTextSize(formatCurrency(result.monthlyPayment))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.monthlyPayment)}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Interest</span>
                <div className={`${getResultTextSize(formatCurrency(result.totalInterest))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.totalInterest)}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Payment</span>
                <div className={`${getResultTextSize(formatCurrency(result.totalPayment))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.totalPayment)}</div>
              </div>
            </div>

            <AmortizationChart data={result.amortization} />
            <AmortizationTable data={result.amortization} showAll={showAllRows} onToggle={() => setShowAllRows(v => !v)} />

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Mortgage Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Mortgage Calculator helps you estimate your monthly mortgage payment based on the loan amount, interest rate, and loan term. It generates a complete amortization schedule showing how each payment is split between principal and interest over the life of your loan. This tool is essential for budgeting your home purchase and understanding the true cost of your mortgage.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator uses the standard amortization formula to determine your monthly payment. It then creates an amortization schedule that tracks every payment throughout the loan term, showing the remaining balance after each payment. The chart visualizes how much of each year\'s payments go toward principal versus interest, helping you understand your loan\'s equity buildup over time.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>M = P × [r(1+r)^n] / [(1+r)^n - 1]</strong></p>
                <p className="mb-1">Where:</p>
                <p className="mb-1">• M = Monthly payment</p>
                <p className="mb-1">• P = Principal loan amount</p>
                <p className="mb-1">• r = Monthly interest rate (annual rate ÷ 12)</p>
                <p className="mb-1">• n = Total number of payments (years × 12)</p>
                <p className="mt-3 text-xs text-slate-500">Example: $300,000 at 5.5% for 30 years = $1,702/mo payment</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <p className="text-slate-700 leading-relaxed mb-3">Your mortgage calculation provides three key figures:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Monthly Payment:</strong> Your fixed payment amount, including principal and interest (property tax and insurance not included).</li>
                <li><strong>Total Interest:</strong> The sum of all interest paid over the loan term. This is the cost of borrowing.</li>
                <li><strong>Total Payment:</strong> The total amount you\'ll pay over the life of the loan (principal + interest).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring total interest:</strong> Focus on the monthly payment but remember that a 30-year loan costs significantly more in interest than a 15-year loan.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Not accounting for extra costs:</strong> Your mortgage payment is just part of homeownership costs. Include property taxes, insurance, HOA fees, and maintenance.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Choosing the lowest rate without comparing fees:</strong> A slightly higher rate with lower fees may be better than the lowest advertised rate.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Consider the full cost</strong> including PMI, taxes, and insurance before deciding on loan terms.</p>
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

function AmortizationChart({ data }: { data: AmortizationRow[] }) {
  const chartData = useMemo(() => {
    const yearly: { year: number; principal: number; interest: number }[] = [];
    for (let year = 1; year <= data.length / 12; year++) {
      const start = (year - 1) * 12;
      const end = Math.min(year * 12, data.length);
      let principal = 0;
      let interest = 0;
      for (let i = start; i < end; i++) {
        principal += data[i].principal;
        interest += data[i].interest;
      }
      yearly.push({ year, principal: Math.round(principal), interest: Math.round(interest) });
    }
    return yearly;
  }, [data]);

  return (
    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold mb-4">Annual Principal vs Interest</h3>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Legend wrapperStyle={{ paddingTop: 8 }} />
            <Area type="monotone" dataKey="principal" name="Principal" stroke="#10b981" fillOpacity={1} fill="url(#colorPrincipal)" />
            <Area type="monotone" dataKey="interest" name="Interest" stroke="#f43f5e" fillOpacity={1} fill="url(#colorInterest)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AmortizationTable({ data, showAll, onToggle }: { data: AmortizationRow[]; showAll: boolean; onToggle: () => void }) {
  const displayData = showAll ? data : data.slice(0, 12);
  return (
    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-lg font-bold">Amortization Schedule</h3>
        <button onClick={onToggle} className="text-sm font-bold text-primary hover:underline whitespace-nowrap">
          {showAll ? 'Show First 12 Months' : `Show All ${data.length} Months`}
        </button>
      </div>
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200 text-muted-foreground uppercase tracking-widest text-xs">
              <th className="text-left py-3 px-2">Month</th>
              <th className="text-right py-3 px-2">Payment</th>
              <th className="text-right py-3 px-2">Principal</th>
              <th className="text-right py-3 px-2">Interest</th>
              <th className="text-right py-3 px-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row) => (
              <tr key={row.month} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="py-2 px-2">{row.month}</td>
                <td className="text-right py-2 px-2 font-mono tabular-nums">{formatCurrency(row.payment)}</td>
                <td className="text-right py-2 px-2 font-mono tabular-nums text-emerald-600">{formatCurrency(row.principal)}</td>
                <td className="text-right py-2 px-2 font-mono tabular-nums text-rose-500">{formatCurrency(row.interest)}</td>
                <td className="text-right py-2 px-2 font-mono tabular-nums">{formatCurrency(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
