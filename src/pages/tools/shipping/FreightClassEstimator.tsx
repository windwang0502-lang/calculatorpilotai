import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber } from '@/lib/utils';

type ClassBand = {
  min: number;
  max: number;
  class: string;
  note: string;
};

const classBands: ClassBand[] = [
  { min: 0, max: 1, class: '500', note: 'Very low density, high handling cost' },
  { min: 1, max: 2, class: '400', note: 'Low density freight' },
  { min: 2, max: 4, class: '300', note: 'Light but stackable freight' },
  { min: 4, max: 6, class: '250', note: 'Moderate low density freight' },
  { min: 6, max: 8, class: '175', note: 'General LTL freight range' },
  { min: 8, max: 10, class: '125', note: 'Mid-density freight' },
  { min: 10, max: 12, class: '100', note: 'Higher density freight' },
  { min: 12, max: Infinity, class: '70-92.5', note: 'Dense freight, lower class range' },
];

function estimateClass(density: number) {
  return classBands.find((band) => density >= band.min && density < band.max) ?? classBands[classBands.length - 1];
}

export default function FreightClassEstimator() {
  const [length, setLength] = useState(48);
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(48);
  const [weight, setWeight] = useState(500);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cubicFeet = (length * width * height) / 1728;
  const density = cubicFeet > 0 ? weight / cubicFeet : 0;
  const classEstimate = estimateClass(density);

  const validate = () => {
    const next: Record<string, string> = {};
    if (length <= 0) next.length = 'Length must be greater than 0';
    if (width <= 0) next.width = 'Width must be greater than 0';
    if (height <= 0) next.height = 'Height must be greater than 0';
    if (weight <= 0) next.weight = 'Weight must be greater than 0';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCalculate = () => {
    validate();
  };

  const faqs = [
    {
      question: 'How is freight class estimated?',
      answer: 'This estimator uses density (lbs per cubic foot) as the primary signal. Final NMFC class can also depend on handling, stowability, and liability.'
    },
    {
      question: 'What density is considered good for LTL?',
      answer: 'Higher density generally yields lower freight class and lower cost. Densities above 10 lbs/ft³ often land in class 100 or lower ranges.'
    },
    {
      question: 'Why can final billed class differ?',
      answer: 'Carriers may reclassify based on inspection, commodity type, packaging, and tariff rules even when density is calculated correctly.'
    },
  ];

  const relatedTools = [
    { name: 'Freight Density Calculator', path: '/tools/shipping/freight-density-calculator', desc: 'Compute exact density from dimensions and weight' },
    { name: 'Pallet Calculator', path: '/tools/shipping/pallet-calculator', desc: 'Estimate pallet loading and footprint' },
    { name: 'Shipment Cost Estimator', path: '/tools/shipping/shipment-cost-estimator', desc: 'Estimate total shipping cost range' },
    { name: 'Package Cubic Feet Calculator', path: '/tools/shipping/package-cubic-feet-calculator', desc: 'Convert dimensions into cubic feet' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Freight Class Estimator',
        description: 'Estimate freight class range from shipment dimensions and weight using density-based rules.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/freight-class-estimator',
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
          { '@type': 'ListItem', position: 3, name: 'Freight Class Estimator', item: 'https://www.calculatorpilotai.com/tools/shipping/freight-class-estimator' },
        ],
      },
    ],
  };

  return (
    <ToolLayout toolId="freight-class-estimator" category="shipping" canonical="https://www.calculatorpilotai.com/tools/shipping/freight-class-estimator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Freight Class Estimator</h2>
          <p className="text-slate-600 text-sm mb-6">Estimate LTL freight class range from dimensions and weight.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length (in)</label>
              <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className={`w-full p-3 border rounded-lg font-mono ${errors.length ? 'border-rose-500' : 'border-slate-200'}`} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width (in)</label>
              <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className={`w-full p-3 border rounded-lg font-mono ${errors.width ? 'border-rose-500' : 'border-slate-200'}`} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height (in)</label>
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className={`w-full p-3 border rounded-lg font-mono ${errors.height ? 'border-rose-500' : 'border-slate-200'}`} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight (lbs)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className={`w-full p-3 border rounded-lg font-mono ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`} />
            </div>
          </div>

          <button onClick={handleCalculate} className="mt-6 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest">Estimate Freight Class</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Feet</span>
            <div className="text-2xl font-mono font-bold">{formatNumber(cubicFeet, { decimals: 2 })}</div>
          </div>
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Density</span>
            <div className="text-2xl font-mono font-bold">{formatNumber(density, { decimals: 2 })} lbs/ft³</div>
          </div>
          <div className="p-5 bg-primary/10 border border-primary/20 rounded-xl text-center">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Estimated Class</span>
            <div className="text-3xl font-mono font-bold text-primary">{classEstimate.class}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold mb-2">Explanation</h3>
          <p className="text-slate-700">Density-based estimate indicates class <strong>{classEstimate.class}</strong>. {classEstimate.note}. Final class may vary by NMFC commodity rules.</p>
          <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg font-mono">
            Formula: Density = Weight (lbs) / [(Length × Width × Height) / 1728]
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
