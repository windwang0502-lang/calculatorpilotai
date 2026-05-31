import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateUSPSRate, type USPSRateResult } from '@/lib/engines';
import { formatCurrency, validateNumberInput } from '@/lib/utils';

export default function USPSRateCalculator() {
  const [weight, setWeight] = useState(16); // oz
  const [zone, setZone] = useState(4);
  const [packageType, setPackageType] = useState<'envelope' | 'pak' | 'small_box' | 'medium_box' | 'large_box'>('small_box');
  const [result, setResult] = useState<USPSRateResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weightLbs = weight / 16;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (weight <= 0) newErrors.weight = 'Weight must be greater than 0';
    if (weight > 700) newErrors.weight = 'Maximum USPS package weight is 700 oz (43.75 lbs)';
    if (zone < 1 || zone > 8) newErrors.zone = 'Zone must be between 1 and 8';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateUSPSRate(weight, zone, packageType);
    setResult(res);
  };

  const getZoneDescription = (z: number) => {
    switch (z) {
      case 1: return 'Same state/adjacent';
      case 2: return '2 zones away';
      case 3: return '3 zones away';
      case 4: return '4 zones away';
      case 5: return '5 zones away';
      case 6: return '6 zones away';
      case 7: return '7 zones away';
      case 8: return '8+ zones away';
      default: return '';
    }
  };

  const faqs = [
    {
      question: 'What is USPS Ground Advantage?',
      answer: 'Ground Advantage is USPS\'s most economical shipping option, delivering packages in 2-5 business days. It includes tracking, up to 70 lbs per package, and works for packages up to 130 inches in combined length and girth. This is typically the best choice for heavier packages and non-urgent deliveries.'
    },
    {
      question: 'How is shipping zone determined?',
      answer: 'The shipping zone is based on the distance between the origin and destination ZIP codes. Zone 1-2 are nearby areas, while Zone 8 is the farthest. You can determine your zone using USPS Zone Lookup tools or shipping platforms, which calculate it based on ZIP codes.'
    },
    {
      question: 'What are the weight limits for USPS?',
      answer: 'USPS has different limits by service: Ground Advantage accepts packages up to 70 lbs and 130 inches in combined length/girth. Priority Mail accepts packages up to 70 lbs and up to 108 inches in combined length/girth. Priority Mail Express accepts packages up to 70 lbs and up to 130 inches combined.'
    },
    {
      question: 'What package types are available?',
      answer: 'USPS offers various package options: Flat Rate Envelopes (fixed price regardless of weight), Legal Flat Rate Envelopes, Padded Flat Rate Envelopes, Small Flat Rate Boxes, Medium Flat Rate Boxes, Large Flat Rate Boxes, and regular packages with weight-based pricing.'
    },
    {
      answer: 'Flat Rate boxes offer predictable pricing regardless of weight within their size limits. They\'re ideal when weight doesn\'t matter much, you need quick packing decisions, or you\'re shipping items across the country. Regular packages with weight-based pricing are better for lightweight items or precise weight measurements.',
      question: 'When should I use Flat Rate boxes?'
    },
    {
      question: 'How accurate are these estimates?',
      answer: 'These estimates are based on standard USPS rate structures and may not include additional services like insurance, signature confirmation, or special handling fees. Actual rates may vary based on exact locations, fuel surcharges, and current USPS pricing changes. Always verify rates at USPS.com before shipping.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'USPS Rate Calculator',
        description: 'Estimate USPS shipping costs for domestic packages including Ground Advantage, Priority Mail, and Priority Mail Express.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/usps-rate-calculator',
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
      }
    ]
  };

  const relatedTools = [
    { name: 'Shipping Cost Calculator', path: '/tools/shipping/shipping-cost-calculator', desc: 'Compare shipping carrier rates' },
    { name: 'DIM Weight Calculator', path: '/tools/shipping/dim-weight-calculator', desc: 'Calculate dimensional weight' },
    { name: 'Freight Class Calculator', path: '/tools/shipping/freight-class-calculator', desc: 'Determine freight class' },
  ];

  return (
    <ToolLayout toolId="usps-rate" category="shipping">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">USPS Rate Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="usps-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Package Weight</label>
              <div className="flex gap-2">
                <input
                  id="usps-weight"
                  type="number"
                  min="1"
                  max="700"
                  step="1"
                  value={weight}
                  onChange={(e) => { setWeight(validateNumberInput(e.target.value, { min: 1, max: 700 })); setErrors(prev => { const n = { ...prev }; delete n.weight; return n; }); }}
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
                />
                <span className="p-3 bg-slate-100 rounded-lg text-slate-600 font-medium">oz</span>
              </div>
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
              <p className="text-xs text-slate-500">{weightLbs.toFixed(2)} lbs</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="usps-zone" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Shipping Zone</label>
              <select
                id="usps-zone"
                value={zone}
                onChange={(e) => { setZone(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.zone; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg ${errors.zone ? 'border-rose-500' : 'border-slate-200'}`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(z => (
                  <option key={z} value={z}>Zone {z} - {getZoneDescription(z)}</option>
                ))}
              </select>
              {errors.zone && <p className="text-xs text-rose-500">{errors.zone}</p>}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Package Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'envelope', label: 'Envelope', desc: 'Flat documents, papers' },
                { id: 'pak', label: 'Flat Rate Pak', desc: 'Flexible padded envelope' },
                { id: 'small_box', label: 'Small Box', desc: 'Up to 8" x 6" x 2"' },
                { id: 'medium_box', label: 'Medium Box', desc: 'Up to 11" x 8" x 5"' },
                { id: 'large_box', label: 'Large Box', desc: 'Up to 12" x 12" x 8"' },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setPackageType(type.id as typeof packageType)}
                  className={`p-3 border rounded-lg text-left transition-all ${
                    packageType === type.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold">{type.label}</span>
                  <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate USPS Rate
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Shipping Options</h3>
              <div className="space-y-3">
                {result.options.map((option, index) => {
                  const isRecommended = index === 0;
                  return (
                    <div
                      key={option.service}
                      className={`p-4 rounded-lg ${
                        isRecommended
                          ? 'bg-primary/5 border-2 border-primary/30'
                          : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isRecommended && (
                            <span className="px-2 py-1 text-xs font-bold bg-primary text-primary-foreground rounded">RECOMMENDED</span>
                          )}
                          <div>
                            <span className="font-semibold">{option.service}</span>
                            <p className="text-sm text-slate-500">{option.estimatedDays}</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xl">{formatCurrency(option.cost)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Package Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Weight</span>
                  <span className="font-mono font-bold text-lg">{weightLbs.toFixed(2)} lbs</span>
                  <span className="text-sm text-slate-500">({weight} oz)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Zone</span>
                  <span className="font-mono font-bold text-lg">{zone}</span>
                  <span className="text-sm text-slate-500">{getZoneDescription(zone)}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Package Type</span>
                  <span className="font-mono font-bold text-lg capitalize">{packageType.replace('_', ' ')}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Max Weight</span>
                  <span className="font-mono font-bold text-lg">{result.maxWeight.toFixed(1)} lbs</span>
                  <span className="text-sm text-slate-500">per package</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Rate Estimate Disclaimer</p>
                  <p>These rates are estimates based on standard USPS pricing. Actual rates may vary. Add services like insurance, signature confirmation, or tracking upgrades for additional fees. Verify current rates at usps.com.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding USPS Shipping Options</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">USPS Service Levels</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-semibold">Ground Advantage</span>
                    <p className="text-sm text-slate-500">2-5 business days</p>
                  </div>
                  <span className="font-semibold text-emerald-600">Most Economical</span>
                </div>
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-semibold">Priority Mail 3-Day</span>
                    <p className="text-sm text-slate-500">1-3 business days</p>
                  </div>
                  <span className="font-semibold">Best Value</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold">Priority Mail Express</span>
                    <p className="text-sm text-slate-500">1-2 business days, Money-back guarantee</p>
                  </div>
                  <span className="font-semibold text-rose-600">Fastest</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Factors Affecting USPS Rates</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Weight:</strong> Heavier packages cost more, with tiered pricing</li>
                <li><strong>Zone:</strong> Longer distances (higher zones) increase costs</li>
                <li><strong>Package size:</strong> Dimensional weight for large, lightweight packages</li>
                <li><strong>Service level:</strong> Express is significantly more expensive than Ground</li>
                <li><strong>Add-on services:</strong> Insurance, tracking, and signature confirmation add fees</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Flat Rate vs Weight-Based</h3>
              <p className="text-slate-700 leading-relaxed">
                Flat Rate boxes offer predictable pricing regardless of weight within size limits. They're ideal when you need quick packing decisions or are shipping items that would otherwise fall into expensive weight tiers. Weight-based pricing is better for lightweight items where you benefit from precise measurements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
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
      </section>

      {/* Related Tools */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Shipping Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool, index) => (
              <Link key={index} to={tool.path} className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-slate-400 text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
