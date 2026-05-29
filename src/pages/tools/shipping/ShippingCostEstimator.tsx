import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateShippingCost, ShippingCostResult, DistanceZone, ServiceLevel, PackageType } from '@/lib/engines';
import { validateNumberInput, formatNumber } from '@/lib/utils';

export default function ShippingCostEstimator() {
  const [weight, setWeight] = useState(10);
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(12);
  const [zone, setZone] = useState<DistanceZone>('regional');
  const [service, setService] = useState<ServiceLevel>('ground');
  const [packageType, setPackageType] = useState<PackageType>('small');
  const [result, setResult] = useState<ShippingCostResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (weight <= 0 || weight > 10000) newErrors.weight = 'Weight must be between 0.1 and 10000 lbs';
    if (length <= 0 || length > 108) newErrors.length = 'Length must be between 0.1 and 108 inches';
    if (width <= 0 || width > 108) newErrors.width = 'Width must be between 0.1 and 108 inches';
    if (height <= 0 || height > 108) newErrors.height = 'Height must be between 0.1 and 108 inches';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateShippingCost(weight, length, width, height, zone, service, packageType);
    setResult(res);
  };

  const relatedTools = [
    { name: 'DIM Weight Calculator', path: '/tools/shipping/dim-weight-calculator', desc: 'Calculate dimensional weight for accurate billing' },
    { name: 'Chargeable Weight Calculator', path: '/tools/shipping/chargeable-weight-calculator', desc: 'Compare actual vs dimensional weight' },
    { name: 'Freight Class Calculator', path: '/tools/shipping/freight-class-calculator', desc: 'Estimate LTL freight class' },
  ];

  const faqs = [
    {
      question: 'Is this an official FedEx, UPS, or USPS rate?',
      answer: 'No, this calculator provides estimates only, not official carrier quotes. Actual shipping rates vary based on your account agreements, fuel surcharges, accessorial charges, and real-time carrier pricing. Always obtain official quotes directly from carriers for accurate pricing.'
    },
    {
      question: 'What is a distance zone in shipping?',
      answer: 'Distance zones categorize shipments based on how far they travel. Local zones cover shipments within a metropolitan area or state. Regional zones cover neighboring states or areas within 1,000 miles. Cross-country zones cover shipments traveling across the nation, typically over 1,500 miles.'
    },
    {
      question: 'How do service levels affect shipping cost?',
      answer: 'Service levels directly impact pricing due to delivery speed and handling requirements. Ground shipping is the most economical option with transit times of 3-7 business days. 2-Day shipping costs significantly more due to faster processing and air transport. Overnight shipping is the premium option with the highest per-pound rates.'
    },
    {
      question: 'What is the difference between small, large, and oversized packages?',
      answer: 'Small packages typically weigh under 70 lbs and fit through standard carrier scanners. Large packages exceed standard dimensional limits and may trigger surcharges. Oversized packages exceed carrier maximum dimensions (typically 108 inches in any dimension) and require special handling, often incurring significant additional fees.'
    },
    {
      question: 'How is billable weight determined?',
      answer: 'Carriers compare actual weight against dimensional weight (also called volumetric weight). Dimensional weight is calculated by multiplying package dimensions, dividing by a standard divisor (139 for domestic US), and rounding up. The higher of the two weights becomes the billable weight used for rate calculations.'
    },
    {
      question: 'What are some ways to reduce shipping costs?',
      answer: 'Reduce package size to minimize dimensional weight charges. Use lightweight but sturdy packaging materials. Negotiate volume discounts with carriers. Consider regional carriers for specific lanes. Ship during off-peak times when possible. Use carrier-provided free packaging for standard sizes. Consolidate multiple orders into single shipments.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Shipping Cost Estimator',
        description: 'Estimate shipping costs based on weight, dimensions, distance, and service level.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/shipping-cost-estimator',
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
          { '@type': 'ListItem', position: 3, name: 'Shipping Cost Estimator', item: 'https://www.calculatorpilotai.com/tools/shipping/shipping-cost-estimator' }
        ]
      }
    ]
  };

  return (
    <ToolLayout toolId="shipping" category="shipping">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Shipping Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Cost Estimator</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Get instant shipping cost estimates based on weight, dimensions, distance, and service speed.
          </p>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Enter Package Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="sc-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight (lbs)</label>
                <input
                  id="sc-weight"
                  type="number"
                  min="0.1"
                  max="10000"
                  step="0.1"
                  value={weight}
                  onChange={(e) => { setWeight(validateNumberInput(Number(e.target.value), { min: 0.1, max: 10000 })); setErrors(prev => { const n = { ...prev }; delete n.weight; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="sc-zone" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Distance Zone</label>
                <select
                  id="sc-zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value as DistanceZone)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg bg-white"
                >
                  <option value="local">Local (Same Area)</option>
                  <option value="regional">Regional (Neighboring States)</option>
                  <option value="cross-country">Cross-Country (Nationwide)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="sc-length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length (in)</label>
                <input
                  id="sc-length"
                  type="number"
                  min="0.1"
                  max="108"
                  step="0.1"
                  value={length}
                  onChange={(e) => { setLength(validateNumberInput(Number(e.target.value), { min: 0.1, max: 108 })); setErrors(prev => { const n = { ...prev }; delete n.length; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.length ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.length && <p className="text-xs text-rose-500">{errors.length}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="sc-width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width (in)</label>
                <input
                  id="sc-width"
                  type="number"
                  min="0.1"
                  max="108"
                  step="0.1"
                  value={width}
                  onChange={(e) => { setWidth(validateNumberInput(Number(e.target.value), { min: 0.1, max: 108 })); setErrors(prev => { const n = { ...prev }; delete n.width; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.width ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.width && <p className="text-xs text-rose-500">{errors.width}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="sc-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height (in)</label>
                <input
                  id="sc-height"
                  type="number"
                  min="0.1"
                  max="108"
                  step="0.1"
                  value={height}
                  onChange={(e) => { setHeight(validateNumberInput(Number(e.target.value), { min: 0.1, max: 108 })); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="sc-service" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Service Level</label>
                <select
                  id="sc-service"
                  value={service}
                  onChange={(e) => setService(e.target.value as ServiceLevel)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg bg-white"
                >
                  <option value="ground">Ground (3-7 Days)</option>
                  <option value="2-day">2-Day Air</option>
                  <option value="overnight">Overnight</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="sc-package" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Package Type</label>
                <select
                  id="sc-package"
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value as PackageType)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg bg-white"
                >
                  <option value="small">Small Parcel (Standard)</option>
                  <option value="large">Large Package (Oversize)</option>
                  <option value="oversize">Very Oversize (Special Handling)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <strong>Disclaimer:</strong> This is an estimation tool only. Actual shipping rates vary based on carrier, account agreements, fuel surcharges, accessorials, and real-time pricing. This calculator does not represent FedEx, UPS, USPS, or any specific carrier.
            </div>

            <button onClick={handleCalculate} className="mt-8 w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Estimate Shipping Cost
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl text-center mb-8">
                <span className="text-sm font-semibold uppercase tracking-widest opacity-80">Estimated Cost Range</span>
                <div className="text-5xl font-bold mt-2">
                  ${formatNumber(result.estimatedMin, { decimals: 2 })} - ${formatNumber(result.estimatedMax, { decimals: 2 })}
                </div>
                <p className="text-blue-200 mt-2">Based on {formatNumber(result.billableWeight, { decimals: 1 })} lbs billable weight</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4">Cost Factors</h3>
                  <ul className="space-y-2 text-sm">
                    {result.costFactors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4">Savings Tips</h3>
                  <ul className="space-y-2 text-sm">
                    {result.savingsTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Shipping Cost Estimator</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
                <p className="text-slate-700 leading-relaxed">
                  The Shipping Cost Estimator helps you get a quick ballpark figure for shipping packages before requesting official quotes from carriers. By entering your package weight, dimensions, shipping zone, and desired service level, you can estimate the cost range for your shipment. This is invaluable for e-commerce businesses, small business owners, and anyone regularly shipping packages to understand costs upfront.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">How It Works</h3>
                <p className="text-slate-700 leading-relaxed">
                  The estimator calculates dimensional weight by dividing the package volume (length × width × height) by a standard divisor of 139. It then compares this to the actual weight and uses the higher value (billable weight) for calculations. Base rates are adjusted by service level multipliers (ground, 2-day, overnight), zone multipliers (local, regional, cross-country), and package type surcharges. The result is a cost range that accounts for typical rate variations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">The Formula</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                  <p className="mb-2"><strong>Step 1:</strong> Dimensional Weight = (L × W × H) ÷ 139</p>
                  <p className="mb-2"><strong>Step 2:</strong> Billable Weight = MAX(Actual Weight, Dimensional Weight)</p>
                  <p className="mb-2"><strong>Step 3:</strong> Base Cost = Billable Weight × Base Rate × Zone Multiplier</p>
                  <p><strong>Step 4:</strong> Total Cost = Base Cost + Package Surcharges</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Example Calculation</h3>
                <p className="text-slate-700 leading-relaxed">
                  You want to ship a 15 lb package measuring 18" × 14" × 12" from New York to Chicago (regional zone) via ground. Step 1: Dim weight = (18 × 14 × 12) ÷ 139 = 21.7 lbs. Step 2: Billable weight = MAX(15, 21.7) = 21.7 lbs. Step 3: Assuming a base rate of $0.75/lb and 1.4x regional multiplier, Base Cost = 21.7 × $0.75 × 1.4 = $22.79. Step 4: Small parcel with no surcharges. Estimated range: $20-$28.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">When to Use This Calculator</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li>Pricing products for e-commerce before shipping costs are known</li>
                  <li>Comparing fulfillment options (in-house vs. 3PL)</li>
                  <li>Budgeting for shipping during product launches</li>
                  <li>Deciding between service levels for customer orders</li>
                  <li>Negotiating shipping contracts with carriers</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Common Mistakes That Increase Shipping Costs</h3>
                <div className="space-y-3 text-slate-700">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <p><strong>Underestimating package dimensions:</strong> Always measure to the furthest points, including packaging.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <p><strong>Choosing expedited shipping when ground would suffice:</strong> Ground shipping saves 50-70% in many cases.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <p><strong>Using oversized packaging for small items:</strong> Reduce box size to minimize dimensional weight charges.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Requesting carrier quotes:</strong> Get official quotes for accurate pricing before shipping.</p>
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
