import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber } from '@/lib/utils';

export default function PackageCubicFeetCalculator() {
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [length, setLength] = useState(18);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(8);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const CM_PER_IN = 2.54;
  const IN_PER_FT = 12;
  const M3_PER_IN3 = 0.0000163871;

  const toDisplay = (val: number) => unit === 'imperial' ? val : Math.round(val * CM_PER_IN * 10) / 10;
  const fromDisplay = (val: number) => unit === 'imperial' ? val : val / CM_PER_IN;

  const cubicInches = length * width * height;
  const cubicFeet = cubicInches / (IN_PER_FT * IN_PER_FT * IN_PER_FT);
  const cubicMeters = cubicInches * M3_PER_IN3;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const l = fromDisplay(length);
    const w = fromDisplay(width);
    const h = fromDisplay(height);
    if (l <= 0 || l > 200) newErrors.length = 'Length must be 0.1-200 in';
    if (w <= 0 || w > 200) newErrors.width = 'Width must be 0.1-200 in';
    if (h <= 0 || h > 200) newErrors.height = 'Height must be 0.1-200 in';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => validate();

  const faqs = [
    { question: 'Why calculate cubic feet for packages?', answer: 'Cubic feet helps determine how much space a package takes up in shipping containers, trucks, and warehouses. It is also used for LTL freight classification and storage calculations.' },
    { question: 'How accurate is cubic foot calculation?', answer: 'Our calculator uses precise conversion factors: 1 cubic foot = 1,728 cubic inches, and 1 cubic inch = 0.0000163871 cubic meters.' },
    { question: 'What is the standard cubic foot formula?', answer: 'Cubic Feet = (Length × Width × Height) ÷ 1,728. All measurements must be in inches to use this formula directly.' },
    { question: 'How does cubic feet affect shipping costs?', answer: 'Many carriers charge based on billable weight, which is the greater of actual weight and dimensional weight. Cubic footage directly impacts dimensional weight calculations.' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Package Cubic Feet Calculator',
        description: 'Calculate cubic feet from package dimensions. Convert between cubic inches, cubic feet, and cubic meters for shipping and storage planning.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/package-cubic-feet-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Package Cubic Feet Calculator', item: 'https://www.calculatorpilotai.com/tools/shipping/package-cubic-feet-calculator' },
        ],
      },
    ],
  };

  const relatedTools = [
    { name: 'Shipping Volume Calculator', path: '/tools/shipping/shipping-volume-calculator', desc: 'Calculate cubic inches, feet, meters' },
    { name: 'DIM Divisor Calculator', path: '/tools/shipping/dim-divisor-calculator', desc: 'Calculate DIM weight with custom divisor' },
    { name: 'Pallet Calculator', path: '/tools/shipping/pallet-calculator', desc: 'Calculate pallet loading' },
    { name: 'Freight Density Calculator', path: '/tools/shipping/freight-density-calculator', desc: 'Calculate LTL freight class' },
  ];

  return (
    <ToolLayout toolId="package-cubic-feet" category="shipping" canonical="https://www.calculatorpilotai.com/tools/shipping/package-cubic-feet-calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Package Cubic Feet Calculator</h2>
              <p className="text-slate-600 text-sm mt-1">Calculate cubic feet from package dimensions</p>
            </div>
            <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
              {(['imperial', 'metric'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === u ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                  {u === 'imperial' ? 'in' : 'cm'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <input
                id="length"
                type="number"
                min="0.1"
                max="200"
                step="0.1"
                value={toDisplay(length)}
                onChange={(e) => { setLength(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.length; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.length ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.length && <p className="text-xs text-rose-500">{errors.length}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <input
                id="width"
                type="number"
                min="0.1"
                max="200"
                step="0.1"
                value={toDisplay(width)}
                onChange={(e) => { setWidth(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.width; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.width ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.width && <p className="text-xs text-rose-500">{errors.width}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <input
                id="height"
                type="number"
                min="0.1"
                max="200"
                step="0.1"
                value={toDisplay(height)}
                onChange={(e) => { setHeight(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
          </div>

          <button onClick={handleCalculate} className="mt-6 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest">
            Calculate Cubic Feet
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Inches</span>
            <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(cubicInches, { decimals: 1 })} cu in</div>
          </div>
          <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl text-center">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Cubic Feet</span>
            <div className="text-3xl font-mono font-bold text-primary tabular-nums">{formatNumber(cubicFeet, { decimals: 3 })} ft³</div>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Meters</span>
            <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(cubicMeters, { decimals: 6 })} m³</div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center">Cubic Foot Calculation Guide</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold mb-3 text-lg">Formula</h3>
            <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm space-y-2">
              <p>Step 1: Calculate Cubic Inches</p>
              <p className="pl-4">Cubic Inches = Length × Width × Height</p>
              <p className="pl-4">= {formatNumber(length)} × {formatNumber(width)} × {formatNumber(height)} = {formatNumber(cubicInches)} cu in</p>
              <p className="mt-4">Step 2: Convert to Cubic Feet</p>
              <p className="pl-4">Cubic Feet = Cubic Inches ÷ 1,728</p>
              <p className="pl-4">= {formatNumber(cubicInches)} ÷ 1,728 = {formatNumber(cubicFeet, { decimals: 3 })} ft³</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold mb-3 text-lg">Quick Reference</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-bold mb-1">Small Box</div>
                <div className="text-slate-600">12 × 12 × 12 in = 1.00 ft³</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-bold mb-1">Medium Box</div>
                <div className="text-slate-600">18 × 14 × 12 in = 1.75 ft³</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-bold mb-1">Large Box</div>
                <div className="text-slate-600">24 × 18 × 18 in = 4.50 ft³</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-bold mb-1">Standard Pallet</div>
                <div className="text-slate-600">48 × 40 × 48 in = 64 ft³</div>
              </div>
            </div>
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
