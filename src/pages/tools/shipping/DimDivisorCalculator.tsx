import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber } from '@/lib/utils';

export default function DimDivisorCalculator() {
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(15);
  const [height, setHeight] = useState(10);
  const [actualWeight, setActualWeight] = useState(25);
  const [divisor, setDivisor] = useState(139);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const CM_PER_IN = 2.54;
  const KG_PER_LB = 0.453592;

  const toDisplay = (val: number) => unit === 'imperial' ? val : Math.round(val * CM_PER_IN * 10) / 10;
  const fromDisplay = (val: number) => unit === 'imperial' ? val : val / CM_PER_IN;
  const toDisplayW = (lbVal: number) => unit === 'imperial' ? lbVal : Math.round(lbVal * KG_PER_LB * 100) / 100;

  const cubicInches = length * width * height;
  const dimWeight = Math.ceil(cubicInches / divisor);
  const billableWeight = Math.max(dimWeight, actualWeight);
  const isDimBillable = dimWeight > actualWeight;
  const dimDifference = Math.abs(dimWeight - actualWeight);

  const getImpactAnalysis = () => {
    if (isDimBillable) {
      return {
        result: 'DIM Weight Higher',
        description: `Dimensional weight is ${formatNumber(dimDifference)} ${unit === 'imperial' ? 'lbs' : 'kg'} more than actual weight. You will be charged for ${formatNumber(dimWeight)} ${unit === 'imperial' ? 'lbs' : 'kg'}.`,
        color: 'amber',
      };
    }
    return {
      result: 'Actual Weight Higher',
      description: `Actual weight is ${formatNumber(dimDifference)} ${unit === 'imperial' ? 'lbs' : 'kg'} more than dimensional weight. You will be charged for ${formatNumber(actualWeight)} ${unit === 'imperial' ? 'lbs' : 'kg'}.`,
      color: 'green',
    };
  };

  const impact = getImpactAnalysis();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const l = fromDisplay(length);
    const w = fromDisplay(width);
    const h = fromDisplay(height);
    if (l <= 0 || l > 300) newErrors.length = 'Length must be 0.1-300 in';
    if (w <= 0 || w > 300) newErrors.width = 'Width must be 0.1-300 in';
    if (h <= 0 || h > 300) newErrors.height = 'Height must be 0.1-300 in';
    if (actualWeight < 0 || actualWeight > 1000) newErrors.weight = 'Weight must be 0-1,000 lbs';
    if (divisor <= 0) newErrors.divisor = 'Divisor must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => validate();

  const faqs = [
    { question: 'What is a DIM divisor?', answer: 'A DIM divisor is the number used to divide cubic inches to calculate dimensional weight. Different carriers and service levels use different divisors (e.g., 139 for FedEx domestic, 166 for FedEx international).' },
    { question: 'Why do DIM divisors vary?', answer: 'Different divisors account for the density of packages a carrier typically handles. Lower divisors result in higher dimensional weights, which affects pricing for lightweight, large packages.' },
    { question: 'What divisor should I use?', answer: 'Use 139 for most US domestic shipments. Use 166 for international shipments. Check with your carrier for their specific divisor requirements.' },
    { question: 'How does divisor affect shipping cost?', answer: 'A lower divisor (like 139) means higher dimensional weight for the same package, potentially increasing costs. A higher divisor (like 166) may reduce DIM weight charges.' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'DIM Divisor Calculator',
        description: 'Calculate dimensional weight with custom DIM divisors. Analyze how different carrier divisors affect your billable shipping weight.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/dim-divisor-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'DIM Divisor Calculator', item: 'https://www.calculatorpilotai.com/tools/shipping/dim-divisor-calculator' },
        ],
      },
    ],
  };

  const relatedTools = [
    { name: 'FedEx DIM Calculator', path: '/tools/shipping/fedex-dim-weight-calculator', desc: 'FedEx specific DIM calculator' },
    { name: 'UPS DIM Calculator', path: '/tools/shipping/ups-dim-weight-calculator', desc: 'UPS specific DIM calculator' },
    { name: 'Shipping Volume Calculator', path: '/tools/shipping/shipping-volume-calculator', desc: 'Calculate package volume' },
    { name: 'Package Cubic Feet Calculator', path: '/tools/shipping/package-cubic-feet-calculator', desc: 'Calculate cubic feet' },
  ];

  return (
    <ToolLayout toolId="dim-divisor" category="shipping" canonical="https://www.calculatorpilotai.com/tools/shipping/dim-divisor-calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold">DIM Divisor Calculator</h2>
              <p className="text-slate-600 text-sm mt-1">Analyze dimensional weight with custom divisors</p>
            </div>
            <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
              {(['imperial', 'metric'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === u ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                  {u === 'imperial' ? 'in/lb' : 'cm/kg'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label htmlFor="length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <input id="length" type="number" min="0.1" max="300" step="0.1" value={toDisplay(length)}
                onChange={(e) => { setLength(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.length; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono ${errors.length ? 'border-rose-500' : 'border-slate-200'}`} />
              {errors.length && <p className="text-xs text-rose-500">{errors.length}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <input id="width" type="number" min="0.1" max="300" step="0.1" value={toDisplay(width)}
                onChange={(e) => { setWidth(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.width; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono ${errors.width ? 'border-rose-500' : 'border-slate-200'}`} />
              {errors.width && <p className="text-xs text-rose-500">{errors.width}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <input id="height" type="number" min="0.1" max="300" step="0.1" value={toDisplay(height)}
                onChange={(e) => { setHeight(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono ${errors.height ? 'border-rose-500' : 'border-slate-200'}`} />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight ({unit === 'imperial' ? 'lb' : 'kg'})</label>
              <input id="weight" type="number" min="0" max="1000" step="0.1" value={toDisplayW(actualWeight)}
                onChange={(e) => { setActualWeight(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.weight; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`} />
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg mb-6">
            <label htmlFor="divisor" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground block mb-2">DIM Divisor</label>
            <select id="divisor" value={divisor} onChange={(e) => setDivisor(Number(e.target.value))}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono">
              <option value={139}>139 - FedEx/UPS Domestic</option>
              <option value={166}>166 - FedEx International</option>
              <option value={194}>194 - UPS Ground</option>
              <option value={126}>126 - FedEx Express Envelope</option>
              <option value={5000}>5000 - Metric Standard</option>
            </select>
            {errors.divisor && <p className="text-xs text-rose-500 mt-1">{errors.divisor}</p>}
          </div>

          <button onClick={handleCalculate} className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest">
            Analyze DIM Impact
          </button>
        </div>

        <div className={`p-6 border-2 rounded-xl ${impact.color === 'amber' ? 'bg-amber-50 border-amber-300' : 'bg-green-50 border-green-300'}`}>
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest block mb-2">DIM Impact Analysis</span>
            <div className={`text-2xl font-bold ${impact.color === 'amber' ? 'text-amber-700' : 'text-green-700'}`}>{impact.result}</div>
            <p className="text-sm mt-2 text-slate-700">{impact.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Inches</span>
            <div className="text-xl font-mono font-bold tabular-nums">{formatNumber(cubicInches, { decimals: 0 })} cu in</div>
          </div>
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Dimensional Weight</span>
            <div className="text-xl font-mono font-bold tabular-nums">{formatNumber(dimWeight, { decimals: 0 })} {unit === 'imperial' ? 'lbs' : 'kg'}</div>
          </div>
          <div className="p-5 bg-primary/10 border border-primary/20 rounded-xl text-center">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Billable Weight</span>
            <div className="text-2xl font-mono font-bold text-primary tabular-nums">{formatNumber(billableWeight, { decimals: 0 })} {unit === 'imperial' ? 'lbs' : 'kg'}</div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center">DIM Divisor Reference</h2>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left py-3 px-4 font-bold">Carrier / Service</th>
                  <th className="text-center py-3 px-4 font-bold">DIM Divisor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr><td className="py-2 px-4">FedEx Ground / Express</td><td className="text-center py-2 px-4 font-mono">139</td></tr>
                <tr><td className="py-2 px-4">FedEx International</td><td className="text-center py-2 px-4 font-mono">166</td></tr>
                <tr><td className="py-2 px-4">FedEx Envelope</td><td className="text-center py-2 px-4 font-mono">126</td></tr>
                <tr><td className="py-2 px-4">UPS Daily Rate</td><td className="text-center py-2 px-4 font-mono">139</td></tr>
                <tr><td className="py-2 px-4">UPS Retail Rate</td><td className="text-center py-2 px-4 font-mono">166</td></tr>
                <tr><td className="py-2 px-4">USPS Priority Mail</td><td className="text-center py-2 px-4 font-mono">194</td></tr>
              </tbody>
            </table>
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
