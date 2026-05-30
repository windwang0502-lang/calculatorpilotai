import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatPercent, validateNumberInput } from '@/lib/utils';

interface IncomeTaxResult {
  estimatedTax: number;
  effectiveRate: number;
  marginalRate: number;
  taxableIncome: number;
  totalDeductions: number;
}

export default function IncomeTaxCalculator() {
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [grossIncome, setGrossIncome] = useState(75000);
  const [deductions, setDeductions] = useState(14000);
  const [result, setResult] = useState<IncomeTaxResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const standardDeductions2026 = {
    single: 14600,
    married: 29200
  };

  const taxBrackets2026 = {
    single: [
      { min: 0, max: 11925, rate: 10 },
      { min: 11925, max: 48475, rate: 12 },
      { min: 48475, max: 103225, rate: 22 },
      { min: 103225, max: 197250, rate: 24 },
      { min: 197250, max: 250525, rate: 32 },
      { min: 250525, max: 626350, rate: 35 },
      { min: 626350, max: Infinity, rate: 37 }
    ],
    married: [
      { min: 0, max: 23850, rate: 10 },
      { min: 23850, max: 96950, rate: 12 },
      { min: 96950, max: 206450, rate: 22 },
      { min: 206450, max: 394500, rate: 24 },
      { min: 394500, max: 501050, rate: 32 },
      { min: 501050, max: 751600, rate: 35 },
      { min: 751600, max: Infinity, rate: 37 }
    ]
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (grossIncome < 0) newErrors.grossIncome = 'Income cannot be negative';
    if (deductions < 0) newErrors.deductions = 'Deductions cannot be negative';
    if (deductions > grossIncome) newErrors.deductions = 'Deductions cannot exceed income';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTax = (taxableIncome: number, brackets: typeof taxBrackets2026.single) => {
    let tax = 0;
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const incomeInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
        tax += incomeInBracket * (bracket.rate / 100);
      }
    }
    return tax;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const useDeductions = Math.max(deductions, standardDeductions2026[filingStatus]);
    const taxableIncome = Math.max(0, grossIncome - useDeductions);
    const taxBrackets = taxBrackets2026[filingStatus];
    const estimatedTax = calculateTax(taxableIncome, taxBrackets);
    const effectiveRate = taxableIncome > 0 ? (estimatedTax / taxableIncome) * 100 : 0;

    let marginalRate = 10;
    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.min) {
        marginalRate = bracket.rate;
      }
    }

    setResult({
      estimatedTax,
      effectiveRate,
      marginalRate,
      taxableIncome,
      totalDeductions: useDeductions
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
      question: 'What is the difference between marginal and effective tax rate?',
      answer: 'Your marginal tax rate is the rate you pay on your last dollar of income. Your effective tax rate is your total tax divided by your total income. Effective rate is always lower than marginal rate because income is spread across multiple brackets.'
    },
    {
      question: 'Should I take the standard or itemized deduction?',
      answer: 'Take the standard deduction unless your itemized deductions (mortgage interest, state taxes, charitable donations, medical expenses) exceed the standard deduction. For 2026, the standard deduction is $14,600 for single filers and $29,200 for married filing jointly.'
    },
    {
      question: 'What counts as taxable income?',
      answer: 'Taxable income includes wages, salaries, tips, investment income, business income, and most other income. Tax-exempt income includes municipal bond interest, Roth distributions, and certain Social Security benefits under certain thresholds.'
    },
    {
      question: 'Are these calculations accurate for my specific situation?',
      answer: 'This calculator provides an estimate using 2026 federal tax brackets and standard deductions. Your actual tax may differ based on credits, state taxes, self-employment tax, retirement contributions, and other factors. Consult a tax professional for precise calculations.'
    },
    {
      question: 'What are tax brackets?',
      answer: 'Tax brackets define ranges of income taxed at different rates. Only income within each bracket is taxed at that bracket rate. This means if you move into a higher bracket, only the income above that threshold is taxed at the higher rate—your entire income is not taxed at the higher rate.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Income Tax Calculator',
        description: 'Estimate your federal income tax liability using 2026 tax brackets. Calculate effective and marginal tax rates.',
        url: 'https://www.calculatorpilotai.com/tools/finance/income-tax-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Income Tax Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/income-tax-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Tax Refund Calculator', path: '/tools/finance/tax-refund-calculator', desc: 'Estimate your tax refund amount' },
    { name: 'Sales Tax Calculator', path: '/tools/finance/sales-tax-calculator', desc: 'Calculate sales tax on purchases' },
    { name: 'Salary Calculator', path: '/tools/finance/salary-calculator', desc: 'Convert between hourly and salary' },
  ];

  return (
    <ToolLayout toolId="income-tax" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Income Tax Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="filing-status" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Filing Status</label>
              <select
                id="filing-status"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as 'single' | 'married')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="gross-income" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gross Annual Income ($)</label>
              <input
                id="gross-income"
                type="number"
                min="0"
                step="1000"
                value={grossIncome}
                onChange={(e) => { setGrossIncome(validateNumberInput(e.target.value, { min: 0 })); clearError('grossIncome'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.grossIncome ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.grossIncome && <p className="text-xs text-rose-500">{errors.grossIncome}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="deductions" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Deductions ($)</label>
              <input
                id="deductions"
                type="number"
                min="0"
                step="100"
                value={deductions}
                onChange={(e) => { setDeductions(validateNumberInput(e.target.value, { min: 0 })); clearError('deductions'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.deductions ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.deductions && <p className="text-xs text-rose-500">{errors.deductions}</p>}
              <p className="text-xs text-slate-500">
                Standard deduction for {filingStatus === 'single' ? 'single' : 'married'}: ${standardDeductions2026[filingStatus].toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Income Tax
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-900 text-white rounded-xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated Federal Tax</span>
              <div className="text-3xl md:text-4xl font-mono font-black mt-2">{formatCurrency(result.estimatedTax)}</div>
              <span className="text-sm text-slate-400">per year</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Taxable Income</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.taxableIncome)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Effective Rate</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatPercent(result.effectiveRate)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Marginal Rate</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-primary tabular-nums leading-none overflow-wrap-anywhere">{formatPercent(result.marginalRate)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Deductions Used</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalDeductions)}</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Income Tax Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Income Tax Calculator estimates your federal income tax liability based on 2026 tax brackets. It calculates your taxable income, determines which brackets apply, and shows both your effective and marginal tax rates.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">2026 Federal Tax Brackets (Single)</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>10%:</span><span className="font-mono">$0 - $11,925</span></div>
                  <div className="flex justify-between"><span>12%:</span><span className="font-mono">$11,926 - $48,475</span></div>
                  <div className="flex justify-between"><span>22%:</span><span className="font-mono">$48,476 - $103,225</span></div>
                  <div className="flex justify-between"><span>24%:</span><span className="font-mono">$103,226 - $197,250</span></div>
                  <div className="flex justify-between"><span>32%:</span><span className="font-mono">$197,251 - $250,525</span></div>
                  <div className="flex justify-between"><span>35%:</span><span className="font-mono">$250,526 - $626,350</span></div>
                  <div className="flex justify-between"><span>37%:</span><span className="font-mono">$626,351+</span></div>
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
