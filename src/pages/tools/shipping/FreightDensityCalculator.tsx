import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber } from '@/lib/utils';

export default function FreightDensityCalculator() {
  const [length, setLength] = useState(48);
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(40);
  const [weight, setWeight] = useState(1200);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const IN_PER_FT = 12;
  const cubicInches = length * width * height;
  const cubicFeet = cubicInches / (IN_PER_FT * IN_PER_FT * IN_PER_FT);
  const density = weight / cubicFeet;

  const getFreightClass = (d: number): { class: string; description: string; color: string } => {
    if (d < 1) return { class: '500', description: 'High value, low density (machinery, vaccines)', color: 'blue' };
    if (d < 2) return { class: '400', description: 'Books, clothing, general merchandise', color: 'blue' };
    if (d < 4) return { class: '300', description: 'Food products, beverages', color: 'green' };
    if (d < 6) return { class: '250', description: 'Computers, electronics, household goods', color: 'green' };
    if (d < 8) return { class: '175', description: 'Tires, auto parts, machinery', color: 'yellow' };
    if (d < 10) return { class: '125', description: 'Palletized freight, wooden goods', color: 'orange' };
    if (d < 12) return { class: '100', description: 'Brick, concrete, heavy machinery', color: 'red' };
    return { class: '60', description: 'Steel, lead, dense materials', color: 'red' };
  };

  const freightClass = getFreightClass(density);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (length <= 0 || length > 240) newErrors.length = 'Length must be 1-240 in';
    if (width <= 0 || width > 240) newErrors.width = 'Width must be 1-240 in';
    if (height <= 0 || height > 240) newErrors.height = 'Height must be 1-240 in';
    if (weight <= 0 || weight > 50000) newErrors.weight = 'Weight must be 1-50,000 lbs';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    validate();
  };

  const faqs = [
    { question: 'What is freight density?', answer: 'Freight density is the weight of a shipment divided by its cubic footage. It is the primary factor in determining LTL freight class.' },
    { question: 'How is LTL freight class determined?', answer: 'Freight class is calculated based on density (lbs per cubic foot). Lower density = higher class = higher shipping cost per hundredweight.' },
    { question: 'What are the NMFC freight classes?', answer: 'Classes range from 50 (highest density, lowest cost) to 500 (lowest density, highest cost). Common classes: 50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500.' },
    { question: 'Does freight class affect all shipments?', answer: 'Freight class primarily affects LTL (Less Than Truckload) shipments. Full truckload shipments typically price by the truck, not by class.' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Freight Density Calculator',
        description: 'Calculate freight density and determine LTL freight class. Essential for LTL shipping quotes and freight cost estimation.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/freight-density-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Freight Density Calculator', item: 'https://www.calculatorpilotai.com/tools/shipping/freight-density-calculator' },
        ],
      },
    ],
  };

  const relatedTools = [
    { name: 'FedEx DIM Weight Calculator', path: '/tools/shipping/fedex-dim-weight-calculator', desc: 'Calculate FedEx dimensional weight' },
    { name: 'UPS DIM Weight Calculator', path: '/tools/shipping/ups-dim-weight-calculator', desc: 'Calculate UPS dimensional weight' },
    { name: 'Shipping Volume Calculator', path: '/tools/shipping/shipping-volume-calculator', desc: 'Calculate cubic inches, feet, and meters' },
    { name: 'Oversize Charge Calculator', path: '/tools/shipping/oversize-charge-calculator', desc: 'Check oversize status and fees' },
  ];

  return (
    <ToolLayout toolId="freight-density" category="shipping" canonical="https://www.calculatorpilotai.com/tools/shipping/freight-density-calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Freight Density Calculator</h2>
            <p className="text-slate-600 text-sm mt-1">Calculate freight density and determine LTL freight class</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label htmlFor="length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length (in)</label>
              <input
                id="length"
                type="number"
                min="1"
                max="240"
                step="1"
                value={length}
                onChange={(e) => { setLength(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.length; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.length ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.length && <p className="text-xs text-rose-500">{errors.length}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width (in)</label>
              <input
                id="width"
                type="number"
                min="1"
                max="240"
                step="1"
                value={width}
                onChange={(e) => { setWidth(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.width; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.width ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.width && <p className="text-xs text-rose-500">{errors.width}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height (in)</label>
              <input
                id="height"
                type="number"
                min="1"
                max="240"
                step="1"
                value={height}
                onChange={(e) => { setHeight(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight (lbs)</label>
              <input
                id="weight"
                type="number"
                min="1"
                max="50000"
                step="1"
                value={weight}
                onChange={(e) => { setWeight(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.weight; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-6 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest"
          >
            Calculate Freight Class
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Feet</span>
            <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(cubicFeet, { decimals: 2 })} ft³</div>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Density</span>
            <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(density, { decimals: 2 })} lbs/ft³</div>
          </div>
          <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl text-center">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Freight Class</span>
            <div className="text-3xl font-mono font-bold text-primary tabular-nums">{freightClass.class}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Freight Classification</h3>
          <p className="text-slate-600">{freightClass.description}</p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center">Freight Density Chart</h2>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left py-3 px-4 font-bold">Density (lbs/ft³)</th>
                  <th className="text-center py-3 px-4 font-bold">Freight Class</th>
                  <th className="text-left py-3 px-4 font-bold">Example Commodities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr><td className="py-2 px-4 font-mono">&lt; 1</td><td className="text-center py-2 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-bold">500</span></td><td className="py-2 px-4">Bearings, car bumpers</td></tr>
                <tr><td className="py-2 px-4 font-mono">1 - 2</td><td className="text-center py-2 px-4"><span className="px-2 py-1 bg-blue-200 text-blue-800 rounded font-bold">400</span></td><td className="py-2 px-4">Books, textbooks</td></tr>
                <tr><td className="py-2 px-4 font-mono">2 - 4</td><td className="text-center py-2 px-4"><span className="px-2 py-1 bg-blue-200 text-blue-800 rounded font-bold">300</span></td><td className="py-2 px-4">Magazines, envelopes</td></tr>
                <tr><td className="py-2 px-4 font-mono">4 - 6</td><td className="text-center py-2 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded font-bold">250</span></td><td className="py-2 px-4">Computers, electronics</td></tr>
                <tr><td className="py-2 px-4 font-mono">6 - 8</td><td className="text-center py-2 px-4"><span className="px-2 py-1 bg-green-200 text-green-800 rounded font-bold">175</span></td><td className="py-2 px-4">Auto accessories, tiles</td></tr>
                <tr><td className="py-2 px-4 font-mono">8 - 10</td><td className="text-center py-2 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-bold">125</span></td><td className="py-2 px-4">Wooden furniture, crate</td></tr>
                <tr><td className="py-2 px-4 font-mono">10 - 12</td><td className="text-center py-2 px-4"><span className="px-2 py-1 bg-orange-100 text-orange-800 rounded font-bold">100</span></td><td className="py-2 px-4">Cabinets, flooring</td></tr>
                <tr><td className="py-2 px-4 font-mono">12+</td><td className="text-center py-2 px-4"><span className="px-2 py-1 bg-red-100 text-red-800 rounded font-bold">60</span></td><td className="py-2 px-4">Dairy products, sand</td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold mb-3 text-lg">Formula</h3>
            <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm space-y-2">
              <p>Step 1: Cubic Feet = (L × W × H) ÷ 1,728</p>
              <p>Step 2: Density = Weight (lbs) ÷ Cubic Feet</p>
              <p>Step 3: Freight Class = determined by density range</p>
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
