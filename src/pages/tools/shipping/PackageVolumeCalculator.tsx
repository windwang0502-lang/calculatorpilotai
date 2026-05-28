import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateVolume, VolumeResult, VolumeUnit } from '@/lib/engines';
import { validateNumberInput, formatNumber } from '@/lib/utils';

export default function PackageVolumeCalculator() {
  const [unit, setUnit] = useState<VolumeUnit>('inches');
  const [length, setLength] = useState(24);
  const [width, setWidth] = useState(18);
  const [height, setHeight] = useState(12);
  const [result, setResult] = useState<VolumeResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const unitLabel = unit === 'inches' ? 'in' : unit === 'centimeters' ? 'cm' : 'm';

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (length <= 0) newErrors.length = 'Length must be greater than 0';
    if (width <= 0) newErrors.width = 'Width must be greater than 0';
    if (height <= 0) newErrors.height = 'Height must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateVolume(length, width, height, unit);
    setResult(res);
  };

  const relatedTools = [
    { name: 'DIM Weight Calculator', path: '/tools/shipping/dim-weight-calculator', desc: 'Calculate dimensional weight for shipping' },
    { name: 'Chargeable Weight Calculator', path: '/tools/shipping/chargeable-weight-calculator', desc: 'Compare actual vs dimensional weight' },
    { name: 'Pallet Calculator', path: '/tools/shipping/pallet-calculator', desc: 'Calculate boxes per pallet' },
  ];

  const faqs = [
    {
      question: 'Why is package volume important for shipping?',
      answer: 'Package volume directly affects shipping costs because carriers use dimensional weight pricing. When a package is large but light, it takes up valuable cargo space. Carriers calculate shipping charges based on whichever is greater: actual weight or dimensional weight (a measure of volume). Understanding your package volume helps you optimize packaging and reduce shipping costs.'
    },
    {
      question: 'What units should I use for package measurements?',
      answer: 'Use the unit system consistent with your carrier and location. US-based shippers typically use inches, while international shipments often use centimeters. Most carriers accept either system as long as you use the correct divisor for dimensional weight calculations. The calculator converts between all common units automatically.'
    },
    {
      question: 'What is the difference between cubic inches and cubic feet?',
      answer: 'Cubic inches measure volume in a smaller scale: 1 cubic foot = 1,728 cubic inches. For shipping, cubic feet is more commonly used for larger freight shipments, while cubic inches is standard for small parcels. Dimensional weight calculations typically use cubic inches or centimeters, then divide by a divisor to get billable weight.'
    },
    {
      question: 'How accurate do my measurements need to be?',
      answer: 'For small packages, measurements to the nearest 0.5 inch (1 cm) are usually sufficient. For larger freight, accuracy to the nearest inch (2-3 cm) is adequate. Always measure to the outermost points including any packaging, strapping, or protrusions. Inaccurate measurements can lead to carrier adjustments and unexpected charges.'
    },
    {
      question: 'Should I include the pallet in volume calculations?',
      answer: 'Yes, when shipping palletized freight, include the pallet dimensions in your calculations. Most carriers measure pallets from the outermost points. The pallet base dimensions (typically 48×40 inches for standard US pallets) are factored into LTL freight calculations. Failure to include pallet dimensions can result in misquoted rates and adjustments.'
    },
    {
      question: 'How can I use volume calculations to reduce shipping costs?',
      answer: 'Reducing package volume is one of the most effective ways to lower shipping costs. Use appropriately sized boxes for your products rather than oversized boxes with excess filler. Consider flat-pack or modular packaging designs. Remove unnecessary packaging layers. Compare different box sizes to find the optimal fit. Every cubic inch reduced directly impacts your dimensional weight and shipping charges.'
    }
  ];

  const schemaJsonLd = result ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Package Volume Calculator',
        description: 'Calculate package volume in cubic inches, feet, centimeters, and meters.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/package-volume-calculator',
        applicationCategory: 'BusinessApplication',
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
          { '@type': 'ListItem', position: 2, name: 'Shipping', item: 'https://www.calculatorpilotai.com/tools/shipping' },
          { '@type': 'ListItem', position: 3, name: 'Package Volume Calculator', item: 'https://www.calculatorpilotai.com/tools/shipping/package-volume-calculator' }
        ]
      }
    ]
  } : null;

  return (
    <ToolLayout toolId="shipping" category="shipping">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Package Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Package Volume Calculator</h1>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            Calculate the cubic volume of your package in all major units for shipping and storage planning.
          </p>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold">Enter Package Dimensions</h2>
              <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
                {(['inches', 'centimeters', 'meters'] as const).map(u => (
                  <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === u ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                    {u === 'inches' ? 'in' : u === 'centimeters' ? 'cm' : 'm'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="pv-length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length ({unitLabel})</label>
                <input
                  id="pv-length"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={length}
                  onChange={(e) => { setLength(validateNumberInput(Number(e.target.value), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.length; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.length ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.length && <p className="text-xs text-rose-500">{errors.length}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="pv-width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width ({unitLabel})</label>
                <input
                  id="pv-width"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={width}
                  onChange={(e) => { setWidth(validateNumberInput(Number(e.target.value), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.width; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.width ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.width && <p className="text-xs text-rose-500">{errors.width}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="pv-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({unitLabel})</label>
                <input
                  id="pv-height"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={height}
                  onChange={(e) => { setHeight(validateNumberInput(Number(e.target.value), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
              <strong>Tip:</strong> Measure to the outermost points of your package, including any strapping, padding, or packaging materials. Carriers measure the space your package occupies.
            </div>

            <button onClick={handleCalculate} className="mt-8 w-full bg-emerald-600 text-white font-bold py-4 rounded-lg hover:bg-emerald-700 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2">
              Calculate Volume
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Inches</span>
                  <div className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.cubicInches, { decimals: 2 })}</div>
                  <span className="text-xs text-slate-500">in³</span>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Feet</span>
                  <div className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.cubicFeet, { decimals: 4 })}</div>
                  <span className="text-xs text-slate-500">ft³</span>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Cm</span>
                  <div className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.cubicCentimeters, { decimals: 2 })}</div>
                  <span className="text-xs text-slate-500">cm³</span>
                </div>
                <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl text-center">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-2">Cubic Meters</span>
                  <div className="text-xl font-mono font-bold text-emerald-700 tabular-nums">{formatNumber(result.cubicMeters, { decimals: 6 })}</div>
                  <span className="text-xs text-emerald-600">m³</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">Volume Explanation</h3>
                <p className="text-slate-700 leading-relaxed">{result.explanation}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Understanding Package Volume</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
                <p className="text-slate-700 leading-relaxed">
                  The Package Volume Calculator computes the three-dimensional space occupied by your package in all major unit systems. This calculation is fundamental for shipping, warehousing, and logistics planning. By converting between cubic inches, cubic feet, cubic centimeters, and cubic meters, you can communicate package volume to any carrier, warehouse, or logistics partner regardless of their preferred measurement system.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">How It Works</h3>
                <p className="text-slate-700 leading-relaxed">
                  The calculator multiplies the three dimensions (length × width × height) to obtain the total volume. It then applies standard conversion factors to express this volume in all unit systems. The conversion factors are: 1 cubic foot = 1,728 cubic inches; 1 cubic inch ≈ 16.39 cubic centimeters; 1 cubic meter = 1,000,000 cubic centimeters. These conversions ensure accurate volume calculations regardless of your input unit.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">The Formula</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                  <p className="mb-2"><strong>Volume = Length × Width × Height</strong></p>
                  <p className="mb-2">Example: 24 in × 18 in × 12 in = 5,184 cubic inches</p>
                  <p>5,184 in³ ÷ 1,728 = 3 ft³</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Example Calculations</h3>
                <p className="text-slate-700 leading-relaxed">
                  A standard moving box (18" × 18" × 24") has a volume of 7,776 cubic inches or 4.5 cubic feet. An 18-pack of 12oz canned beverages in a cardboard carrier measures approximately 15" × 10" × 5" = 750 cubic inches. A euro pallet (1200mm × 800mm × 144mm loaded height) has a base volume of 0.96 square meters, which when multiplied by load height gives total shipment volume for freight calculations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">When to Use This Calculator</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li>Calculating dimensional weight for shipping quotes</li>
                  <li>Planning warehouse storage capacity</li>
                  <li>Optimizing packaging to reduce dimensional weight charges</li>
                  <li>Estimating container loading for freight shipments</li>
                  <li>Comparing package sizes for e-commerce product listings</li>
                  <li>Calculating USPS flat rate box eligibility</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
                <div className="space-y-3 text-slate-700">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <p><strong>Forgetting internal dimensions:</strong> Measure the inside of the box to see how much product actually fits.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <p><strong>Ignoring package protrusions:</strong> Include any handles, spouts, or irregular shapes in measurements.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <p><strong>Confusing volume with capacity:</strong> Volume is external dimensions; capacity is usable internal space.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Double-check carrier requirements:</strong> Some carriers measure to the nearest whole inch, others to fractions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
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
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Shipping Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
