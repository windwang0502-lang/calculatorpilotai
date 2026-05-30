import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatPercent, validateNumberInput } from '@/lib/utils';

interface SalesTaxResult {
  taxAmount: number;
  totalAmount: number;
  priceExcludingTax: number;
}

export default function SalesTaxCalculator() {
  const [price, setPrice] = useState(100);
  const [taxRate, setTaxRate] = useState(8.25);
  const [result, setResult] = useState<SalesTaxResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (price <= 0) newErrors.price = 'Price must be greater than 0';
    if (taxRate < 0 || taxRate > 100) newErrors.taxRate = 'Tax rate must be between 0% and 100%';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const taxAmount = price * (taxRate / 100);
    const totalAmount = price + taxAmount;
    const priceExcludingTax = price;

    setResult({
      taxAmount,
      totalAmount,
      priceExcludingTax
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
      question: 'What is sales tax?',
      answer: 'Sales tax is a consumption tax imposed by state and local governments on the sale of goods and services. The tax is usually calculated as a percentage of the purchase price and is paid by the buyer at the point of sale. Revenue is used to fund government services and infrastructure.'
    },
    {
      question: 'Why do tax rates vary by location?',
      answer: 'Sales tax rates vary because they can be imposed at multiple levels: state, county, city, and special districts. Some items may also be tax-exempt at certain levels. This is why the same item can have different tax amounts in different locations or when purchased online versus in-store.'
    },
    {
      question: 'Are there items that are not taxed?',
      answer: 'Yes, most states exempt certain items from sales tax, commonly including: prescription medications, groceries (in some states), medical equipment, educational materials, and clothing under a certain price threshold. These exemptions vary significantly by state.'
    },
    {
      question: 'How do I calculate tax backwards from total?',
      answer: 'To find the pre-tax price when you only know the total: Pre-tax Price = Total ÷ (1 + Tax Rate). For example, if you paid $108.25 total and the tax rate is 8.25%: $108.25 ÷ 1.0825 = $100 pre-tax price.'
    },
    {
      question: 'Do online purchases have sales tax?',
      answer: 'Yes, in most cases. The Supreme Court ruling in South Dakota v. Wayfair (2018) allowed states to require online retailers to collect sales tax regardless of whether they have a physical presence in the state. However, some small sellers may still be exempt.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Sales Tax Calculator',
        description: 'Calculate sales tax amount and total cost. Add or remove tax from any price quickly and accurately.',
        url: 'https://www.calculatorpilotai.com/tools/finance/sales-tax-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Sales Tax Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/sales-tax-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'VAT Calculator', path: '/tools/finance/vat-calculator', desc: 'Calculate Value Added Tax for Europe' },
    { name: 'Income Tax Calculator', path: '/tools/finance/income-tax-calculator', desc: 'Estimate your income tax liability' },
    { name: 'Tip Calculator', path: '/tools/finance/tip-calculator', desc: 'Calculate tips and split bills' },
  ];

  const stateRates: Record<string, number> = {
    'California': 7.25, 'Texas': 6.25, 'Florida': 6.0, 'New York': 4.0, 'Illinois': 6.25,
    'Pennsylvania': 6.0, 'Ohio': 5.75, 'Georgia': 4.0, 'North Carolina': 4.75, 'Michigan': 6.0,
    'Washington': 6.5, 'Arizona': 5.6, 'Colorado': 2.9, 'Tennessee': 7.0, 'Indiana': 7.0,
    'Missouri': 4.225, 'Maryland': 6.0, 'Wisconsin': 5.0, 'Colorado': 2.9, 'Minnesota': 6.875,
    'Virginia': 5.3, 'Massachusetts': 6.25, 'Nevada': 6.85, 'Kentucky': 6.0, 'Louisiana': 4.45,
  };

  return (
    <ToolLayout toolId="sales-tax" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Sales Tax Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Item Price ($)</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => { setPrice(validateNumberInput(e.target.value, { min: 0 })); clearError('price'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.price ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.price && <p className="text-xs text-rose-500">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="tax-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sales Tax Rate (%)</label>
              <input
                id="tax-rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) => { setTaxRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('taxRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.taxRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.taxRate && <p className="text-xs text-rose-500">{errors.taxRate}</p>}
              <p className="text-xs text-slate-500">US average: ~7.12%</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Common State Rates</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stateRates).slice(0, 8).map(([state, rate]) => (
                <button
                  key={state}
                  onClick={() => setTaxRate(rate)}
                  className="px-2 py-1 text-xs bg-white border border-slate-200 rounded hover:border-primary hover:text-primary transition-colors"
                >
                  {state}: {rate}%
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Sales Tax
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Pre-Tax Price</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.priceExcludingTax)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-2">Tax Amount</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-rose-600 tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.taxAmount)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-xl text-center min-w-0 lg:col-span-1 col-span-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Total Cost</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-black tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalAmount)}</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Sales Tax Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Sales Tax Calculator adds the appropriate sales tax to any purchase price to show you the total cost. It is useful for shopping, budgeting, or comparing prices across locations with different tax rates.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Tax Amount = Price × (Tax Rate / 100)</strong></p>
                <p className="mb-2"><strong>Total Cost = Price + Tax Amount</strong></p>
                <p className="mb-2"><strong>Reverse: Price = Total / (1 + Tax Rate / 100)</strong></p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">State Sales Tax Rates (2026)</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div>California: 7.25%</div>
                <div>Texas: 6.25%</div>
                <div>New York: 4%</div>
                <div>Florida: 6%</div>
                <div>Washington: 6.5%</div>
                <div>Oregon: 0% (no sales tax)</div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Note: Local taxes may add 0-5% on top of state rates</p>
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
