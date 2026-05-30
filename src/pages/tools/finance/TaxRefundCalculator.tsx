import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, validateNumberInput } from '@/lib/utils';

interface TaxRefundResult {
  estimatedRefund: number;
  totalTax: number;
  overpayment: number;
}

export default function TaxRefundCalculator() {
  const [grossIncome, setGrossIncome] = useState(85000);
  const [taxWithheld, setTaxWithheld] = useState(14000);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [deductions, setDeductions] = useState(14600);
  const [result, setResult] = useState<TaxRefundResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (taxWithheld < 0) newErrors.taxWithheld = 'Withholding cannot be negative';
    if (deductions < 0) newErrors.deductions = 'Deductions cannot be negative';
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
    const taxableIncome = Math.max(0, grossIncome - deductions);
    const totalTax = calculateTax(taxableIncome, taxBrackets2026[filingStatus]);
    const overpayment = Math.max(0, taxWithheld - totalTax);
    const estimatedRefund = overpayment;

    setResult({
      estimatedRefund,
      totalTax,
      overpayment
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
      question: 'What is a tax refund?',
      answer: 'A tax refund is money the government returns to you when you have paid more in taxes throughout the year than you actually owe. This happens when your tax withholding from paychecks exceeds your actual tax liability. Refunds are not free money—they are simply returning your overpayment.'
    },
    {
      question: 'Why might I get a large refund?',
      answer: 'Common reasons for large refunds include: claiming too few allowances on your W-4, having multiple jobs with each withholding as if it is your only job, not updating withholding after major life changes (marriage, children, home purchase), or having significant deductions that were not reflected in withholding.'
    },
    {
      question: 'Should I aim for a large refund or owe money?',
      answer: 'Neither extreme is ideal. A large refund means you gave the government an interest-free loan all year. owing money means you might face penalties if you underpaid. The goal is to have withholding close to your actual tax liability, so you owe or are refunded only a small amount.'
    },
    {
      question: 'How can I increase my refund?',
      answer: 'If you want a larger refund, you can claim fewer allowances on your W-4, contribute more to tax-advantaged accounts (401k, IRA), or increase your deductions. However, consider whether this is financially optimal—you may be better off having more money now and a smaller refund.'
    },
    {
      question: 'Does this calculator include state taxes?',
      answer: 'No, this calculator estimates federal income tax only. State income tax varies significantly by state and would need to be calculated separately. Some states have no income tax, while others have rates up to 13% or more.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Tax Refund Calculator',
        description: 'Estimate your tax refund or amount owed. See how withholding compares to your actual tax liability.',
        url: 'https://www.calculatorpilotai.com/tools/finance/tax-refund-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Tax Refund Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/tax-refund-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Income Tax Calculator', path: '/tools/finance/income-tax-calculator', desc: 'Calculate federal income tax liability' },
    { name: 'Sales Tax Calculator', path: '/tools/finance/sales-tax-calculator', desc: 'Calculate sales tax on purchases' },
    { name: 'Salary Calculator', path: '/tools/finance/salary-calculator', desc: 'Convert between hourly and salary' },
  ];

  return (
    <ToolLayout toolId="tax-refund" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Tax Refund Calculator</h2>
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
              <label htmlFor="gross-income" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Annual Gross Income ($)</label>
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
            <div className="space-y-2">
              <label htmlFor="tax-withheld" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Federal Tax Withheld ($)</label>
              <input
                id="tax-withheld"
                type="number"
                min="0"
                step="100"
                value={taxWithheld}
                onChange={(e) => { setTaxWithheld(validateNumberInput(e.target.value, { min: 0 })); clearError('taxWithheld'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.taxWithheld ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.taxWithheld && <p className="text-xs text-rose-500">{errors.taxWithheld}</p>}
              <p className="text-xs text-slate-500">From Box 2 of your W-2</p>
            </div>
            <div className="space-y-2">
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
              <p className="text-xs text-slate-500">Standard: ${filingStatus === 'single' ? '14,600' : '29,200'}</p>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Tax Refund
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-6 rounded-xl text-center ${result.estimatedRefund > 0 ? 'bg-emerald-50 border border-emerald-200' : result.estimatedRefund < 0 ? 'bg-rose-50 border border-rose-200' : 'bg-slate-50 border border-slate-200'}`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${result.estimatedRefund > 0 ? 'text-emerald-600' : result.estimatedRefund < 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                {result.estimatedRefund > 0 ? 'Estimated Refund' : result.estimatedRefund < 0 ? 'Amount Owed' : 'Balanced'}
              </span>
              <div className={`text-3xl md:text-4xl font-mono font-black mt-2 ${result.estimatedRefund > 0 ? 'text-emerald-600' : result.estimatedRefund < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {formatCurrency(Math.abs(result.estimatedRefund))}
              </div>
              <span className="text-sm text-slate-500">{result.estimatedRefund > 0 ? 'to be refunded' : result.estimatedRefund < 0 ? 'to pay' : 'no refund or amount owed'}</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Gross Income</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(grossIncome)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Tax Liability</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalTax)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Tax Withheld</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(taxWithheld)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Deductions</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(deductions)}</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Tax Refund Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Tax Refund Calculator estimates your federal income tax, compares it to your withholding, and calculates whether you will receive a refund or owe money when you file your taxes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How to Find Your Information</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Gross Income:</strong> Box 1 of your W-2, multiplied by number of pay periods</li>
                <li><strong>Tax Withheld:</strong> Box 2 of your W-2, multiplied by number of pay periods</li>
                <li><strong>Deductions:</strong> Standard ($14,600 single, $29,200 married) or itemized total</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Tips for Tax Planning</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p>Review your withholding annually, especially after life changes</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p>Use the IRS Tax Withholding Estimator for precise recommendations</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p>Maximize retirement contributions to reduce taxable income</p>
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
