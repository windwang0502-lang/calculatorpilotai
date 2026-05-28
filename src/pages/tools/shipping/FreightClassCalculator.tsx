import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateFreightClass, FreightClassResult } from '@/lib/engines';
import { validateNumberInput, formatNumber } from '@/lib/utils';

const CM_PER_IN = 2.54;
const KG_PER_LB = 0.453592;

export default function FreightClassCalculator() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [length, setLength] = useState(24);
  const [width, setWidth] = useState(18);
  const [height, setHeight] = useState(12);
  const [weight, setWeight] = useState(50);
  const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>('lb');
  const [result, setResult] = useState<FreightClassResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toDisplay = (inchVal: number) => unit === 'in' ? inchVal : Math.round(inchVal * CM_PER_IN * 10) / 10;
  const fromDisplay = (val: number) => unit === 'in' ? val : val / CM_PER_IN;
  const toDisplayW = (lbVal: number) => weightUnit === 'lb' ? lbVal : Math.round(lbVal * KG_PER_LB * 100) / 100;
  const fromDisplayW = (val: number) => weightUnit === 'lb' ? val : val / KG_PER_LB;

  const dimLabel = unit === 'in' ? 'in' : 'cm';

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (length <= 0 || length > 2540) newErrors.length = 'Length must be between 0.1 and 2540';
    if (width <= 0 || width > 2540) newErrors.width = 'Width must be between 0.1 and 2540';
    if (height <= 0 || height > 2540) newErrors.height = 'Height must be between 0.1 and 2540';
    if (weight <= 0 || weight > 22046) newErrors.weight = 'Weight must be between 0.1 and 22046';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateFreightClass(
      fromDisplay(length),
      fromDisplay(width),
      fromDisplay(height),
      unit,
      fromDisplayW(weight),
      weightUnit
    );
    setResult(res);
  };

  const relatedTools = [
    { name: 'Pallet Calculator', path: '/tools/shipping/pallet-calculator', desc: 'Calculate how many boxes fit on a pallet' },
    { name: 'Package Volume Calculator', path: '/tools/shipping/package-volume-calculator', desc: 'Calculate package volume in multiple units' },
    { name: 'DIM Weight Calculator', path: '/tools/shipping/dim-weight-calculator', desc: 'Calculate dimensional weight for shipping' },
  ];

  const faqs = [
    {
      question: 'What is freight class?',
      answer: 'Freight class is a standardized classification system used by carriers to categorize and price LTL (Less Than Truckload) shipments. The National Motor Freight Classification (NMFC) assigns classes from 50 to 500, with lower numbers representing denser, more economical freight and higher numbers representing lighter, bulkier items that require more handling.'
    },
    {
      question: 'How is freight density calculated?',
      answer: 'Freight density is calculated by dividing the weight of a shipment (in pounds) by its volume (in cubic feet). The formula is: Density (lb/ft³) = Weight (lbs) ÷ Volume (ft³). This density value is then used to determine the appropriate freight class for LTL shipping.'
    },
    {
      question: 'Is this the official NMFC freight class?',
      answer: 'No, this calculator provides an ESTIMATED freight class based solely on density. The official NMFC freight class involves additional factors including commodity description, density, stowability, handling, and liability. For accurate freight class determination, consult the official NMFC directory or your carrier.'
    },
    {
      question: 'Why does freight class affect shipping cost?',
      answer: 'Freight class directly impacts shipping rates because it determines how much handling, space, and liability a carrier assumes. Lower classes (50-70) are dense and easy to handle, resulting in lower rates. Higher classes (250-500) are bulky or fragile, requiring more care and space, leading to higher shipping costs.'
    },
    {
      question: 'What is a good density for freight shipping?',
      answer: 'A density of 50 lb/ft³ or higher qualifies for Class 50, the most economical freight class. Densities between 15-35 lb/ft³ fall into mid-range classes (65-85) with moderate pricing. Densities below 10 lb/ft³ typically result in Class 100 or higher, which carries premium shipping rates.'
    },
    {
      question: 'Can freight class change after carrier audit?',
      answer: 'Yes, carriers may reclassify shipments during audit, potentially resulting in additional charges. Common reasons include incorrect commodity description, inaccurate dimensions or weight provided at booking, and density calculations that differ from carrier measurements. Always provide accurate information to avoid unexpected adjustments.'
    }
  ];

  const schemaJsonLd = result ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Freight Class Calculator',
        description: 'Calculate the density and estimated freight class for your LTL shipment based on package dimensions and weight.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/freight-class-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Freight Class Calculator', item: 'https://www.calculatorpilotai.com/tools/shipping/freight-class-calculator' }
        ]
      }
    ]
  } : null;

  return (
    <ToolLayout toolId="shipping" category="shipping">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            LTL Shipping Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Freight Class Calculator</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Calculate your shipment's density and get an estimated freight class for LTL shipping quotes.
          </p>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold">Enter Package Details</h2>
              <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
                {(['in', 'cm'] as const).map(u => (
                  <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === u ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                    {u === 'in' ? 'in / lb' : 'cm / kg'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="fc-length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length ({dimLabel})</label>
                <input
                  id="fc-length"
                  type="number"
                  min="0.1"
                  max="2540"
                  step="0.1"
                  value={toDisplay(length)}
                  onChange={(e) => { setLength(validateNumberInput(fromDisplay(Number(e.target.value)), { min: 0.1, max: 2540 })); setErrors(prev => { const n = { ...prev }; delete n.length; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.length ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.length && <p className="text-xs text-rose-500">{errors.length}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="fc-width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width ({dimLabel})</label>
                <input
                  id="fc-width"
                  type="number"
                  min="0.1"
                  max="2540"
                  step="0.1"
                  value={toDisplay(width)}
                  onChange={(e) => { setWidth(validateNumberInput(fromDisplay(Number(e.target.value)), { min: 0.1, max: 2540 })); setErrors(prev => { const n = { ...prev }; delete n.width; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.width ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.width && <p className="text-xs text-rose-500">{errors.width}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="fc-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({dimLabel})</label>
                <input
                  id="fc-height"
                  type="number"
                  min="0.1"
                  max="2540"
                  step="0.1"
                  value={toDisplay(height)}
                  onChange={(e) => { setHeight(validateNumberInput(fromDisplay(Number(e.target.value)), { min: 0.1, max: 2540 })); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="fc-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight ({weightUnit})</label>
                <input
                  id="fc-weight"
                  type="number"
                  min="0.1"
                  max="22046"
                  step="0.1"
                  value={toDisplayW(weight)}
                  onChange={(e) => { setWeight(validateNumberInput(fromDisplayW(Number(e.target.value)), { min: 0.1, max: 22046 })); setErrors(prev => { const n = { ...prev }; delete n.weight; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>Note:</strong> This calculator provides an <em>estimated</em> freight class based on density alone. Official NMFC freight classification involves additional factors including commodity type, stowability, handling requirements, and liability. Always verify with your carrier.
            </div>

            <button onClick={handleCalculate} className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
              Calculate Freight Class
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Feet</span>
                  <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(result.cubicFeet, { decimals: 2 })} ft³</div>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Density</span>
                  <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(result.density, { decimals: 2 })} lb/ft³</div>
                </div>
                <div className="p-6 bg-amber-50 border border-amber-300 rounded-xl text-center">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">Est. Freight Class</span>
                  <div className="text-2xl font-mono font-bold text-amber-700">{result.freightClass}</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">What This Means</h3>
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
            <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Freight Class Calculator</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
                <p className="text-slate-700 leading-relaxed">
                  The Freight Class Calculator helps shippers estimate the National Motor Freight Classification (NMFC) class for their LTL (Less Than Truckload) shipments. By entering your package dimensions and weight, you can quickly determine the density of your freight and get an estimated class that carriers use to determine shipping rates. This tool is essential for obtaining accurate freight quotes and avoiding surprise charges during shipping.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">How It Works</h3>
                <p className="text-slate-700 leading-relaxed">
                  The calculator converts your package dimensions to cubic inches, then divides by 1,728 to get cubic feet. It then divides the weight (in pounds) by the volume (in cubic feet) to calculate density in pounds per cubic foot. This density value is matched against standard NMFC density breakpoints to estimate the freight class. For example, a density of 50+ lb/ft³ maps to Class 50, while densities below 1 lb/ft³ fall into Class 200 or higher.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">The Formula</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                  <p className="mb-2"><strong>Density = Weight (lbs) ÷ Volume (ft³)</strong></p>
                  <p className="mb-2">Volume (ft³) = Length (in) × Width (in) × Height (in) ÷ 1,728</p>
                  <p>Example: 24" × 18" × 12" = 0.25 ft³ → If weight is 50 lbs → Density = 200 lb/ft³</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Example Calculation</h3>
                <p className="text-slate-700 leading-relaxed">
                  Let's say you have a pallet of auto parts measuring 48" × 40" × 48" and weighing 800 lbs. First, calculate volume: 48 × 40 × 48 = 92,160 cubic inches ÷ 1,728 = 53.33 cubic feet. Then calculate density: 800 lbs ÷ 53.33 ft³ = 15 lb/ft³. This density falls into the Class 70 range (15-22.5 lb/ft³), which is appropriate for moderately dense automotive components.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">When to Use This Calculator</h3>
                <p className="text-slate-700 leading-relaxed mb-3">Use the Freight Class Calculator in these scenarios:</p>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li>Before booking LTL shipments to estimate shipping costs</li>
                  <li>When comparing quotes from different carriers</li>
                  <li>To verify that carriers haven't misclassified your freight</li>
                  <li>When optimizing packaging to reduce shipping costs</li>
                  <li>During contract negotiations to understand rate structures</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Common Shipping Mistakes to Avoid</h3>
                <div className="space-y-3 text-slate-700">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <p><strong>Underestimating dimensions:</strong> Always measure the outermost points of your packaging, including pallet and strapping.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <p><strong>Forgetting pallet weight:</strong> Include the weight of the pallet itself in your total shipment weight.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <p><strong>Using residential classes for commercial addresses:</strong> This can result in incorrect pricing.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Double-check all measurements</strong> before submitting quotes to avoid accessorial charges.</p>
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
