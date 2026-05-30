import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber } from '@/lib/utils';

export default function ShippingVolumeCalculator() {
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(12);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const CM_PER_IN = 2.54;
  const IN_PER_FT = 12;
  const M_PER_CM = 0.01;
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
    if (l <= 0 || l > 500) newErrors.length = 'Length must be between 1 and 500';
    if (w <= 0 || w > 500) newErrors.width = 'Width must be between 1 and 500';
    if (h <= 0 || h > 500) newErrors.height = 'Height must be between 1 and 500';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    validate();
  };

  const faqs = [
    { question: 'Why calculate shipping volume?', answer: 'Shipping volume helps determine dimensional weight, freight charges, and storage requirements. Carriers often charge based on the greater of actual weight or dimensional weight.' },
    { question: 'What is cubic foot measurement used for?', answer: 'Cubic feet is commonly used in freight shipping, storage calculations, and LTL (Less Than Truckload) shipping quotes. It helps determine how much space a package occupies.' },
    { question: 'How do I convert cubic meters to cubic feet?', answer: 'To convert cubic meters to cubic feet, multiply by 35.3147. One cubic meter equals approximately 35.3 cubic feet.' },
    { question: 'What is the difference between dimensional and actual weight?', answer: 'Actual weight is measured on a scale. Dimensional (DIM) weight is calculated from package volume using a carrier-specific divisor. Carriers bill the greater of the two.' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Shipping Volume Calculator',
        description: 'Calculate package volume in cubic inches, cubic feet, and cubic meters. Essential for freight shipping, storage planning, and dimensional weight calculations.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/shipping-volume-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Shipping Volume Calculator', item: 'https://www.calculatorpilotai.com/tools/shipping/shipping-volume-calculator' },
        ],
      },
    ],
  };

  const relatedTools = [
    { name: 'FedEx DIM Weight Calculator', path: '/tools/shipping/fedex-dim-weight-calculator', desc: 'Calculate FedEx dimensional weight' },
    { name: 'UPS DIM Weight Calculator', path: '/tools/shipping/ups-dim-weight-calculator', desc: 'Calculate UPS dimensional weight' },
    { name: 'Oversize Charge Calculator', path: '/tools/shipping/oversize-charge-calculator', desc: 'Check oversize status and fees' },
    { name: 'Freight Density Calculator', path: '/tools/shipping/freight-density-calculator', desc: 'Calculate freight class from density' },
  ];

  return (
    <ToolLayout toolId="shipping-volume" category="shipping" canonical="https://www.calculatorpilotai.com/tools/shipping/shipping-volume-calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Shipping Volume Calculator</h2>
              <p className="text-slate-600 text-sm mt-1">Calculate package volume in multiple units</p>
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
                max="500"
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
                max="500"
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
                max="500"
                step="0.1"
                value={toDisplay(height)}
                onChange={(e) => { setHeight(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-6 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest"
          >
            Calculate Volume
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl text-center">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Cubic Inches</span>
            <div className="text-2xl font-mono font-bold text-primary tabular-nums">{formatNumber(cubicInches, { decimals: 2 })} cu in</div>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Feet</span>
            <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(cubicFeet, { decimals: 4 })} cu ft</div>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Meters</span>
            <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(cubicMeters, { decimals: 6 })} m³</div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center">Volume Conversion Reference</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold mb-3 text-lg">Conversion Formulas</h3>
            <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm space-y-3">
              <p>Cubic Inches = L × W × H (in inches)</p>
              <p>Cubic Feet = Cubic Inches ÷ 1,728</p>
              <p>Cubic Meters = Cubic Inches × 0.0000163871</p>
              <p>Cubic Meters = Cubic Feet × 0.0283168</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold mb-3 text-lg">Common Package Sizes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3">Size</th>
                    <th className="text-right py-2 px-3">Cu In</th>
                    <th className="text-right py-2 px-3">Cu Ft</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100"><td className="py-2 px-3">6 × 4 × 2 in</td><td className="text-right py-2 px-3">48</td><td className="text-right py-2 px-3">0.028</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 px-3">12 × 12 × 12 in</td><td className="text-right py-2 px-3">1,728</td><td className="text-right py-2 px-3">1.00</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 px-3">18 × 12 × 8 in</td><td className="text-right py-2 px-3">1,728</td><td className="text-right py-2 px-3">1.00</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 px-3">24 × 18 × 12 in</td><td className="text-right py-2 px-3">5,184</td><td className="text-right py-2 px-3">3.00</td></tr>
                </tbody>
              </table>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-4 gap-4">
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
