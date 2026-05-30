import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber } from '@/lib/utils';

export default function FedExDimWeightCalculator() {
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(12);
  const [dimDivisor, setDimDivisor] = useState(139);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const CM_PER_IN = 2.54;
  const toDisplay = (val: number) => unit === 'imperial' ? val : Math.round(val * CM_PER_IN * 10) / 10;
  const fromDisplay = (val: number) => unit === 'imperial' ? val : val / CM_PER_IN;

  const cubicInches = length * width * height;
  const dimWeight = Math.ceil(cubicInches / dimDivisor);
  const billableWeight = dimWeight;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const l = fromDisplay(length);
    const w = fromDisplay(width);
    const h = fromDisplay(height);
    if (l <= 0 || l > 108) newErrors.length = 'Length must be 1-108 in (FedEx limit)';
    if (w <= 0 || w > 108) newErrors.width = 'Width must be 1-108 in (FedEx limit)';
    if (h <= 0 || h > 108) newErrors.height = 'Height must be 1-108 in (FedEx limit)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
  };

  const faqs = [
    { question: 'What is the FedEx DIM divisor?', answer: 'FedEx uses a standard DIM divisor of 139 for domestic packages. For international shipments, the divisor may vary (e.g., 166 for some services).' },
    { question: 'How is FedEx billable weight calculated?', answer: 'FedEx compares actual weight to dimensional weight (calculated as L×W×H ÷ 139). The higher of the two is used for billing.' },
    { question: 'What are FedEx package size limits?', answer: 'FedEx packages can be up to 108 inches in length and 165 lbs. Oversize charges apply for packages over 90 inches in combined length and girth.' },
    { question: 'When does FedEx charge oversize fees?', answer: 'FedEx applies oversize surcharges for packages with combined dimensions (L + 2W + 2H) over 130 inches.' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'FedEx DIM Weight Calculator',
        description: 'Calculate dimensional weight and billable shipping costs for FedEx packages. Determine FedEx shipping charges based on package dimensions.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/fedex-dim-weight-calculator',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.calculatorpilotai.com/' },
          { '@type': 'ListItem', position: 2, name: 'Shipping Tools', item: 'https://www.calculatorpilotai.com/tools/shipping' },
          { '@type': 'ListItem', position: 3, name: 'FedEx DIM Weight Calculator', item: 'https://www.calculatorpilotai.com/tools/shipping/fedex-dim-weight-calculator' },
        ],
      },
    ],
  };

  const relatedTools = [
    { name: 'UPS DIM Weight Calculator', path: '/tools/shipping/ups-dim-weight-calculator', desc: 'Calculate UPS dimensional weight' },
    { name: 'Shipping Volume Calculator', path: '/tools/shipping/shipping-volume-calculator', desc: 'Calculate cubic inches, feet, and meters' },
    { name: 'Oversize Charge Calculator', path: '/tools/shipping/oversize-charge-calculator', desc: 'Check oversize status and fees' },
    { name: 'Freight Density Calculator', path: '/tools/shipping/freight-density-calculator', desc: 'Calculate freight class from density' },
  ];

  return (
    <ToolLayout toolId="fedex-dim" category="shipping" canonical="https://www.calculatorpilotai.com/tools/shipping/fedex-dim-weight-calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-600 text-white px-3 py-1 rounded font-bold text-sm">FedEx</div>
                <h2 className="text-2xl font-bold">DIM Weight Calculator</h2>
              </div>
              <p className="text-slate-600 text-sm">Calculate dimensional weight for FedEx shipments</p>
            </div>
            <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
              {(['imperial', 'metric'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === u ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                  {u === 'imperial' ? 'in' : 'cm'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <input
                id="length"
                type="number"
                min="1"
                max="108"
                step="0.1"
                value={toDisplay(length)}
                onChange={(e) => { setLength(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.length; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-mono text-lg ${errors.length ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.length && <p className="text-xs text-rose-500">{errors.length}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <input
                id="width"
                type="number"
                min="1"
                max="108"
                step="0.1"
                value={toDisplay(width)}
                onChange={(e) => { setWidth(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.width; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-mono text-lg ${errors.width ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.width && <p className="text-xs text-rose-500">{errors.width}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <input
                id="height"
                type="number"
                min="1"
                max="108"
                step="0.1"
                value={toDisplay(height)}
                onChange={(e) => { setHeight(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <label htmlFor="divisor" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground block mb-2">DIM Divisor</label>
            <select
              id="divisor"
              value={dimDivisor}
              onChange={(e) => setDimDivisor(Number(e.target.value))}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-mono"
            >
              <option value={139}>139 - FedEx Domestic Standard</option>
              <option value={166}>166 - FedEx International</option>
              <option value={126}>126 - FedEx Express Envelope</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">FedEx uses divisor 139 for domestic packages. International may use 166.</p>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-6 w-full bg-purple-600 text-white font-bold py-4 rounded-lg hover:bg-purple-700 transition-colors uppercase tracking-widest"
          >
            Calculate DIM Weight
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Inches</span>
            <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(cubicInches, { decimals: 1 })} cu in</div>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Dimensional Weight</span>
            <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(dimWeight, { decimals: 0 })} lbs</div>
          </div>
          <div className="p-6 bg-purple-100 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest block mb-2">Billable Weight</span>
            <div className="text-2xl font-mono font-bold text-purple-700 tabular-nums">{formatNumber(billableWeight, { decimals: 0 })} lbs</div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center">How to Use the FedEx DIM Calculator</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold mb-3 text-lg">Formula</h3>
            <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm space-y-2">
              <p>Cubic Inches = Length × Width × Height</p>
              <p>DIM Weight (lbs) = Cubic Inches ÷ {dimDivisor}</p>
              <p>Billable Weight = max(DIM Weight, Actual Weight)</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold mb-3 text-lg">FedEx Package Limits</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">&#10003;</span>
                Maximum length: 108 inches
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">&#10003;</span>
                Maximum weight: 150 lbs per package
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">&#10003;</span>
                Standard DIM divisor: 139 (domestic)
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p className="text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Shipping Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((tool, i) => (
              <Link key={i} to={tool.path} className="block p-5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <h3 className="font-bold text-sm mb-1">{tool.name}</h3>
                <p className="text-slate-400 text-xs">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
