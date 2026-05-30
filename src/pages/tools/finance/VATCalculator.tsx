import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatPercent, validateNumberInput } from '@/lib/utils';

interface VATResult {
  vatAmount: number;
  totalAmount: number;
  netAmount: number;
}

export default function VATCalculator() {
  const [amount, setAmount] = useState(100);
  const [vatRate, setVatRate] = useState(20);
  const [isInclusive, setIsInclusive] = useState(false);
  const [result, setResult] = useState<VATResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (vatRate < 0 || vatRate > 100) newErrors.vatRate = 'VAT rate must be between 0% and 100%';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;

    let vatAmount: number;
    let netAmount: number;
    let totalAmount: number;

    if (isInclusive) {
      netAmount = amount / (1 + vatRate / 100);
      vatAmount = amount - netAmount;
      totalAmount = amount;
    } else {
      netAmount = amount;
      vatAmount = amount * (vatRate / 100);
      totalAmount = amount + vatAmount;
    }

    setResult({ vatAmount, totalAmount, netAmount });
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const commonRates = [
    { country: 'Germany', rate: 19 },
    { country: 'France', rate: 20 },
    { country: 'UK', rate: 20 },
    { country: 'Italy', rate: 22 },
    { country: 'Spain', rate: 21 },
    { country: 'Netherlands', rate: 21 },
    { country: 'Belgium', rate: 21 },
    { country: 'Sweden', rate: 25 },
    { country: 'Denmark', rate: 25 },
    { country: 'Poland', rate: 23 },
  ];

  const faqs = [
    {
      question: 'What is VAT (Value Added Tax)?',
      answer: 'VAT is a consumption tax placed on products and services at each stage of production or distribution where value is added. Unlike sales tax, which is only applied at the final point of sale, VAT is collected incrementally at each stage of the supply chain.'
    },
    {
      question: 'How is VAT different from sales tax?',
      answer: 'Sales tax is only collected once, at the final sale to the consumer. VAT is collected at every stage of production and distribution. For consumers, the final price is similar, but VAT is built into the price at each stage rather than added at the end.'
    },
    {
      question: 'Why do VAT rates vary by country?',
      answer: 'Each country sets its own VAT rate based on fiscal policy, economic conditions, and social objectives. Some countries use multiple rates: a standard rate for most goods and services, and reduced rates for essentials like food, medicine, and books.'
    },
    {
      question: 'What does "VAT inclusive" mean?',
      answer: 'VAT inclusive means the amount you have includes the VAT. To extract the VAT amount and net price from a VAT-inclusive figure: Net Price = Total ÷ (1 + VAT Rate). For example, if you paid $120 including 20% VAT: $120 ÷ 1.20 = $100 net, $20 VAT.'
    },
    {
      question: 'Can I claim back VAT when traveling?',
      answer: 'If you are a business registered for VAT in an EU country, you may be able to reclaim VAT paid in other EU countries through the EU VAT Refund system. Tourists can sometimes claim VAT refunds on purchases over a certain threshold when leaving the country.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'VAT Calculator',
        description: 'Calculate Value Added Tax (VAT) for any country. Add or remove VAT from prices quickly.',
        url: 'https://www.calculatorpilotai.com/tools/finance/vat-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'VAT Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/vat-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Sales Tax Calculator', path: '/tools/finance/sales-tax-calculator', desc: 'Calculate US sales tax' },
    { name: 'Income Tax Calculator', path: '/tools/finance/income-tax-calculator', desc: 'Estimate income tax liability' },
    { name: 'Tip Calculator', path: '/tools/finance/tip-calculator', desc: 'Calculate tips and split bills' },
  ];

  return (
    <ToolLayout toolId="vat" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">VAT Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Amount ($)</label>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => { setAmount(validateNumberInput(e.target.value, { min: 0 })); clearError('amount'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.amount ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.amount && <p className="text-xs text-rose-500">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="vat-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">VAT Rate (%)</label>
              <input
                id="vat-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={vatRate}
                onChange={(e) => { setVatRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('vatRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.vatRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.vatRate && <p className="text-xs text-rose-500">{errors.vatRate}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Price Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isInclusive}
                    onChange={() => setIsInclusive(false)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Add VAT (exclusive)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={isInclusive}
                    onChange={() => setIsInclusive(true)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Remove VAT (inclusive)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Common VAT Rates</h3>
            <div className="flex flex-wrap gap-2">
              {commonRates.map((item) => (
                <button
                  key={item.country}
                  onClick={() => setVatRate(item.rate)}
                  className="px-2 py-1 text-xs bg-white border border-slate-200 rounded hover:border-primary hover:text-primary transition-colors"
                >
                  {item.country}: {item.rate}%
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate VAT
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Net Amount</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.netAmount)}</div>
                <span className="text-xs text-slate-500">excl. VAT</span>
              </div>
              <div className="p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-2">VAT Amount</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-rose-600 tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.vatAmount)}</div>
                <span className="text-xs text-rose-500">at {vatRate}%</span>
              </div>
              <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Total</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-black tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalAmount)}</div>
                <span className="text-xs text-slate-400">incl. VAT</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the VAT Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The VAT Calculator helps you add or remove Value Added Tax from any amount. This is essential for businesses operating internationally or anyone dealing with European pricing.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formulas</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Add VAT:</strong></p>
                <p className="mb-1">VAT = Net Amount × (Rate / 100)</p>
                <p className="mb-2">Total = Net Amount + VAT</p>
                <p className="mb-2"><strong>Remove VAT:</strong></p>
                <p className="mb-1">Net = Total / (1 + Rate / 100)</p>
                <p className="mb-1">VAT = Total - Net</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common VAT Rates in Europe</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                {commonRates.slice(0, 8).map((item) => (
                  <div key={item.country}>{item.country}: {item.rate}%</div>
                ))}
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
