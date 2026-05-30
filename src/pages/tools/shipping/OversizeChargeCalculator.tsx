import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber } from '@/lib/utils';

export default function OversizeChargeCalculator() {
  const [length, setLength] = useState(48);
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(30);
  const [actualWeight, setActualWeight] = useState(75);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cubicInches = length * width * height;
  const girth = 2 * (width + height);
  const combinedLengthGirth = length + girth;
  const billableWeight = actualWeight;

  const getOversizeStatus = () => {
    if (combinedLengthGirth > 165) {
      return { level: 'oversize', label: 'Truckload Required', color: 'red', warning: 'Package exceeds carrier maximum. Requires freight/LTL shipping.' };
    }
    if (combinedLengthGirth > 130 || length > 96) {
      return { level: 'oversize', label: 'Oversize 3', color: 'red', warning: 'Significant oversize surcharge applies. May require special handling.' };
    }
    if (combinedLengthGirth > 115 || length > 84) {
      return { level: 'oversize', label: 'Oversize 2', color: 'orange', warning: 'Oversize surcharge applies. Additional handling fees expected.' };
    }
    if (combinedLengthGirth > 108 || length > 60) {
      return { level: 'oversize', label: 'Oversize 1', color: 'yellow', warning: 'Minor oversize fees may apply. Package within normal carrier limits.' };
    }
    return { level: 'standard', label: 'Standard', color: 'green', warning: 'Package is within standard carrier size limits.' };
  };

  const status = getOversizeStatus();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (length <= 0 || length > 240) newErrors.length = 'Length must be 1-240 in';
    if (width <= 0 || width > 240) newErrors.width = 'Width must be 1-240 in';
    if (height <= 0 || height > 240) newErrors.height = 'Height must be 1-240 in';
    if (actualWeight <= 0 || actualWeight > 1000) newErrors.actualWeight = 'Weight must be 0.1-1000 lbs';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    validate();
  };

  const faqs = [
    { question: 'What are common oversize thresholds?', answer: 'FedEx/UPS: Over 130" combined length + girth triggers oversize surcharges. Over 165" combined dimensions exceeds carrier limits.' },
    { question: 'How is combined length and girth calculated?', answer: 'Combined Length + Girth = Length + 2(Width + Height). Girth measures the perimeter around the package at its widest points.' },
    { question: 'What fees are associated with oversize packages?', answer: 'Fees vary by carrier but typically include: Oversize handling charge ($25-150+), additional fuel surcharges, and residential delivery premiums if applicable.' },
    { question: 'Does oversize affect dimensional weight?', answer: 'Yes. For packages over 5,184 cubic inches (12×12×36 or equivalent), carriers may use a different dimensional factor, resulting in higher billable weights.' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Oversize Charge Calculator',
        description: 'Check if your package qualifies as oversize and understand potential surcharges. Calculate combined length and girth to determine FedEx and UPS oversize status.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/oversize-charge-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Oversize Charge Calculator', item: 'https://www.calculatorpilotai.com/tools/shipping/oversize-charge-calculator' },
        ],
      },
    ],
  };

  const relatedTools = [
    { name: 'FedEx DIM Weight Calculator', path: '/tools/shipping/fedex-dim-weight-calculator', desc: 'Calculate FedEx dimensional weight' },
    { name: 'UPS DIM Weight Calculator', path: '/tools/shipping/ups-dim-weight-calculator', desc: 'Calculate UPS dimensional weight' },
    { name: 'Shipping Volume Calculator', path: '/tools/shipping/shipping-volume-calculator', desc: 'Calculate cubic inches, feet, and meters' },
    { name: 'Freight Density Calculator', path: '/tools/shipping/freight-density-calculator', desc: 'Calculate freight class from density' },
  ];

  const statusColorClass = status.color === 'red' ? 'bg-red-100 border-red-300 text-red-800' :
    status.color === 'orange' ? 'bg-orange-100 border-orange-300 text-orange-800' :
    status.color === 'yellow' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
    'bg-green-100 border-green-300 text-green-800';

  return (
    <ToolLayout toolId="oversize-charge" category="shipping" canonical="https://www.calculatorpilotai.com/tools/shipping/oversize-charge-calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Oversize Charge Calculator</h2>
            <p className="text-slate-600 text-sm mt-1">Check if your package triggers oversize surcharges</p>
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
                min="0.1"
                max="1000"
                step="0.1"
                value={actualWeight}
                onChange={(e) => { setActualWeight(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.actualWeight; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.actualWeight ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.actualWeight && <p className="text-xs text-rose-500">{errors.actualWeight}</p>}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-6 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest"
          >
            Check Oversize Status
          </button>
        </div>

        <div className={`p-6 border-2 rounded-xl ${statusColorClass}`}>
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest block mb-2">Oversize Status</span>
            <div className="text-3xl font-bold">{status.label}</div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-800">{status.warning}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Inches</span>
            <div className="text-xl font-mono font-bold tabular-nums">{formatNumber(cubicInches, { decimals: 0 })}</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Girth</span>
            <div className="text-xl font-mono font-bold tabular-nums">{formatNumber(girth, { decimals: 0 })} in</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">L + G</span>
            <div className="text-xl font-mono font-bold tabular-nums">{formatNumber(combinedLengthGirth, { decimals: 0 })} in</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Weight</span>
            <div className="text-xl font-mono font-bold tabular-nums">{formatNumber(billableWeight, { decimals: 1 })} lbs</div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center">Oversize Thresholds</h2>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left py-3 px-4 font-bold">Classification</th>
                  <th className="text-center py-3 px-4 font-bold">Threshold</th>
                  <th className="text-center py-3 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-green-50">
                  <td className="py-3 px-4 font-medium">Standard</td>
                  <td className="text-center py-3 px-4">&lt; 108" L+G</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-bold">Normal</span></td>
                </tr>
                <tr className="bg-yellow-50">
                  <td className="py-3 px-4 font-medium">Oversize 1</td>
                  <td className="text-center py-3 px-4">&gt; 108" or &gt; 60" length</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-bold">Minor Fee</span></td>
                </tr>
                <tr className="bg-orange-50">
                  <td className="py-3 px-4 font-medium">Oversize 2</td>
                  <td className="text-center py-3 px-4">&gt; 115" or &gt; 84" length</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs font-bold">Surcharge</span></td>
                </tr>
                <tr className="bg-red-50">
                  <td className="py-3 px-4 font-medium">Oversize 3</td>
                  <td className="text-center py-3 px-4">&gt; 130" L+G or &gt; 96" length</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-bold">High Fee</span></td>
                </tr>
                <tr className="bg-red-100">
                  <td className="py-3 px-4 font-medium">Exceeds Limits</td>
                  <td className="text-center py-3 px-4">&gt; 165" L+G</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-red-300 text-red-900 rounded text-xs font-bold">LTL/Freight Only</span></td>
                </tr>
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
