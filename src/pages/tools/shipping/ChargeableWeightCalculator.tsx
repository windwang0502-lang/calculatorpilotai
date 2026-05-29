import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateChargeableWeight, ChargeableWeightResult, ChargeableUnit, DimFactor } from '@/lib/engines';
import { validateNumberInput, formatNumber } from '@/lib/utils';

const CM_PER_IN = 2.54;
const KG_PER_LB = 0.453592;

export default function ChargeableWeightCalculator() {
  const [unit, setUnit] = useState<ChargeableUnit>('imperial');
  const [actualWeight, setActualWeight] = useState(10);
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(12);
  const [dimFactor, setDimFactor] = useState<DimFactor>(139);
  const [customDimFactor, setCustomDimFactor] = useState(139);
  const [result, setResult] = useState<ChargeableWeightResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toDisplay = (inchVal: number) => unit === 'imperial' ? inchVal : Math.round(inchVal * CM_PER_IN * 10) / 10;
  const fromDisplay = (val: number) => unit === 'imperial' ? val : val / CM_PER_IN;
  const toDisplayW = (lbVal: number) => unit === 'imperial' ? lbVal : Math.round(lbVal * KG_PER_LB * 100) / 100;
  const fromDisplayW = (val: number) => unit === 'imperial' ? val : val / KG_PER_LB;

  const dimLabel = unit === 'imperial' ? 'in' : 'cm';
  const weightLabel = unit === 'imperial' ? 'lb' : 'kg';
  const effectiveDimFactor = dimFactor === 'custom' ? customDimFactor : dimFactor;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (actualWeight <= 0) newErrors.actualWeight = 'Weight must be greater than 0';
    if (length <= 0) newErrors.length = 'Length must be greater than 0';
    if (width <= 0) newErrors.width = 'Width must be greater than 0';
    if (height <= 0) newErrors.height = 'Height must be greater than 0';
    if (dimFactor === 'custom' && (customDimFactor <= 0 || !isFinite(customDimFactor))) {
      newErrors.customFactor = 'Custom DIM factor must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateChargeableWeight(
      fromDisplayW(actualWeight),
      fromDisplay(length),
      fromDisplay(width),
      fromDisplay(height),
      unit,
      effectiveDimFactor
    );
    setResult(res);
  };

  const relatedTools = [
    { name: 'DIM Weight Calculator', path: '/tools/shipping/dim-weight-calculator', desc: 'Calculate dimensional weight for shipping' },
    { name: 'Shipping Cost Estimator', path: '/tools/shipping/shipping-cost-estimator', desc: 'Estimate total shipping costs' },
    { name: 'Package Volume Calculator', path: '/tools/shipping/package-volume-calculator', desc: 'Calculate package volume' },
  ];

  const faqs = [
    {
      question: 'What is chargeable weight?',
      answer: 'Chargeable weight (also called billable weight) is the weight that carriers use to calculate shipping charges. It is the greater of either the actual weight of the package or its dimensional weight. Carriers use this metric because large but lightweight packages take up valuable cargo space that could otherwise hold heavier packages.'
    },
    {
      question: 'What is dimensional weight?',
      answer: 'Dimensional weight (DIM weight) is a calculated weight based on package dimensions. It reflects the space a package occupies relative to its actual weight. Carriers calculate it by multiplying length × width × height and dividing by a DIM factor. If dimensional weight exceeds actual weight, you pay for the dimensional weight.'
    },
    {
      question: 'What is a DIM factor?',
      answer: 'A DIM factor (dimensional factor) is the divisor used in dimensional weight calculations. Standard carriers use 139 for domestic US packages. International shipments often use 166 or 5000 (metric). Lower factors produce higher dimensional weights, while higher factors produce lower dimensional weights. Always verify your carrier uses the correct factor.'
    },
    {
      question: 'Which weight is usually higher?',
      answer: 'It depends on package density. Dense, heavy items (like books or metal products) typically have actual weight exceeding dimensional weight. Lightweight, bulky items (like pillows or foam) usually have dimensional weight exceeding actual weight. Optimizing packaging to fit products efficiently reduces dimensional weight charges.'
    },
    {
      question: 'How can I reduce chargeable weight?',
      answer: 'Reduce package size to minimize dimensional weight. Remove excess packaging materials. Choose denser packaging materials that provide protection with less volume. Flatten items when possible. Split large shipments into multiple smaller packages—sometimes each package is under the dimensional weight threshold. Compare carriers, as DIM factors vary.'
    },
    {
      question: 'Do all carriers use the same DIM factor?',
      answer: 'No, DIM factors vary by carrier and service level. UPS and FedEx typically use 139 for domestic packages. USPS uses various factors depending on service. International carriers often use 166 or metric 5000. Some regional carriers use different divisors entirely. Always verify the DIM factor your specific carrier uses.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Chargeable Weight Calculator',
        description: 'Compare actual weight vs dimensional weight to determine billable shipping weight.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/chargeable-weight-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Chargeable Weight Calculator', item: 'https://www.calculatorpilotai.com/tools/shipping/chargeable-weight-calculator' }
        ]
      }
    ]
  };

  return (
    <ToolLayout toolId="shipping" category="shipping">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-violet-500/20 text-violet-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Shipping Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chargeable Weight Calculator</h1>
          <p className="text-xl text-violet-200 max-w-2xl mx-auto">
            Compare actual weight vs dimensional weight to determine what you'll actually pay for shipping.
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
                {(['imperial', 'metric'] as const).map(u => (
                  <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === u ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                    {u === 'imperial' ? 'in / lb' : 'cm / kg'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="cw-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Actual Weight ({weightLabel})</label>
                <input
                  id="cw-weight"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={toDisplayW(actualWeight)}
                  onChange={(e) => { setActualWeight(validateNumberInput(fromDisplayW(Number(e.target.value)), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.actualWeight; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.actualWeight ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.actualWeight && <p className="text-xs text-rose-500">{errors.actualWeight}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="cw-dim-factor" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">DIM Factor</label>
                <select
                  id="cw-dim-factor"
                  value={dimFactor}
                  onChange={(e) => setDimFactor(e.target.value as DimFactor)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg bg-white"
                >
                  <option value={139}>139 (US Domestic)</option>
                  <option value={166}>166 (International)</option>
                  <option value={5000}>5000 (Metric)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {dimFactor === 'custom' && (
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="cw-custom-factor" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Custom DIM Factor</label>
                  <input
                    id="cw-custom-factor"
                    type="number"
                    min="1"
                    step="1"
                    value={customDimFactor}
                    onChange={(e) => { setCustomDimFactor(validateNumberInput(Number(e.target.value), { min: 1 })); setErrors(prev => { const n = { ...prev }; delete n.customFactor; return n; }); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.customFactor ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.customFactor && <p className="text-xs text-rose-500">{errors.customFactor}</p>}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="cw-length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length ({dimLabel})</label>
                <input
                  id="cw-length"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={toDisplay(length)}
                  onChange={(e) => { setLength(validateNumberInput(fromDisplay(Number(e.target.value)), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.length; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.length ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.length && <p className="text-xs text-rose-500">{errors.length}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="cw-width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width ({dimLabel})</label>
                <input
                  id="cw-width"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={toDisplay(width)}
                  onChange={(e) => { setWidth(validateNumberInput(fromDisplay(Number(e.target.value)), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.width; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.width ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.width && <p className="text-xs text-rose-500">{errors.width}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="cw-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({dimLabel})</label>
                <input
                  id="cw-height"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={toDisplay(height)}
                  onChange={(e) => { setHeight(validateNumberInput(fromDisplay(Number(e.target.value)), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
              </div>
            </div>

            <button onClick={handleCalculate} className="mt-8 w-full bg-violet-600 text-white font-bold py-4 rounded-lg hover:bg-violet-700 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-violet-600 focus:ring-offset-2">
              Calculate Chargeable Weight
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
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Actual Weight</span>
                  <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(result.actualWeight, { decimals: 2 })} {weightLabel}</div>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Dimensional Weight</span>
                  <div className="text-2xl font-mono font-bold tabular-nums">{formatNumber(result.dimensionalWeight, { decimals: 2 })} {weightLabel}</div>
                </div>
                <div className={`p-6 rounded-xl text-center ${result.whichApplies === 'dimensional' ? 'bg-violet-100 border-2 border-violet-400' : 'bg-green-100 border-2 border-green-400'}`}>
                  <span className="text-xs font-bold uppercase tracking-widest block mb-2">{result.whichApplies === 'dimensional' ? 'Dimensional Applies' : 'Actual Weight Applies'}</span>
                  <div className={`text-3xl font-mono font-bold tabular-nums ${result.whichApplies === 'dimensional' ? 'text-violet-700' : 'text-green-700'}`}>
                    {formatNumber(result.chargeableWeight, { decimals: 2 })} {weightLabel}
                  </div>
                  <span className="text-xs font-semibold mt-1 block">Chargeable Weight</span>
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
            <h2 className="text-3xl font-bold mb-8 text-center">Understanding Chargeable Weight</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
                <p className="text-slate-700 leading-relaxed">
                  The Chargeable Weight Calculator determines which weight—actual or dimensional—will be used for shipping charges. When you enter your package's actual weight and dimensions, the calculator computes the dimensional weight using your specified DIM factor and shows you which weight is higher. This is critical because carriers always charge based on the greater of the two values, and the difference can significantly impact your shipping costs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">How It Works</h3>
                <p className="text-slate-700 leading-relaxed">
                  The calculator performs two calculations: First, it identifies your actual weight as entered. Second, it calculates dimensional weight using the formula: (Length × Width × Height) ÷ DIM Factor. The DIM factor varies by carrier and service level. After calculating both weights, the system displays which weight is higher and explains why that weight was selected. This transparency helps you understand exactly how shipping costs are determined.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">The Formula</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                  <p className="mb-2"><strong>Step 1:</strong> Dimensional Weight = (Length × Width × Height) ÷ DIM Factor</p>
                  <p className="mb-2"><strong>Step 2:</strong> Compare Actual Weight vs Dimensional Weight</p>
                  <p><strong>Step 3:</strong> Chargeable Weight = MAX(Actual Weight, Dimensional Weight)</p>
                  <p className="mt-2 text-slate-600">Example: 12×12×12 in package with 10 lb actual weight: DIM = (12×12×12)÷139 = 12.4 lb. Since 12.4 &gt; 10, chargeable weight = 12.4 lbs</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Example Calculations</h3>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Example 1 - Dimensional Weight Applies:</strong> A large box of pillows measuring 24" × 20" × 18" weighs 8 lbs. DIM weight = (24×20×18)÷139 = 62.3 lbs. Since 62.3 &gt; 8, carrier charges for 62.3 lbs. This is why lightweight bulky items cost more to ship.
                </p>
                <p className="text-slate-700 leading-relaxed mt-4">
                  <strong>Example 2 - Actual Weight Applies:</strong> A small box of books measuring 10" × 8" × 6" weighs 15 lbs. DIM weight = (10×8×6)÷139 = 3.4 lbs. Since 15 &gt; 3.4, carrier charges for 15 lbs actual weight. Dense items save money because actual weight is used.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">When to Use This Calculator</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li>Before shipping to estimate costs accurately</li>
                  <li>When comparing fulfillment options or warehouses</li>
                  <li>To identify when packaging changes can reduce costs</li>
                  <li>When auditing carrier invoices for accuracy</li>
                  <li>During product design to optimize shipping characteristics</li>
                  <li>Before choosing between shipping services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">How to Reduce Chargeable Weight</h3>
                <div className="space-y-3 text-slate-700">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Right-size packaging:</strong> Use the smallest box that fits your product with minimal void fill.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Increase product density:</strong> Pack more product per cubic inch to tip the scale toward actual weight.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Consider poly mailers:</strong> For soft goods, flexible packaging dramatically reduces dimensional weight.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Negotiate DIM factors:</strong> Large-volume shippers can often negotiate more favorable DIM factors.</p>
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
