import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber } from '@/lib/utils';

type ServiceType = 'ground' | 'express' | 'overnight';

const zoneMultipliers: Record<string, number> = {
  '2': 1.0,
  '3': 1.08,
  '4': 1.16,
  '5': 1.26,
  '6': 1.38,
  '7': 1.52,
  '8': 1.68,
};

const serviceMultipliers: Record<ServiceType, number> = {
  ground: 1.0,
  express: 1.35,
  overnight: 1.9,
};

export default function ShipmentCostEstimator() {
  const [weight, setWeight] = useState(12);
  const [length, setLength] = useState(16);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(10);
  const [zone, setZone] = useState('5');
  const [serviceType, setServiceType] = useState<ServiceType>('ground');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const divisor = 139;
  const cubicInches = length * width * height;
  const dimWeight = Math.ceil(cubicInches / divisor);
  const billableWeight = Math.max(weight, dimWeight);
  const dimImpact = dimWeight > weight;

  const baseRatePerLb = 0.88;
  const zoneMultiplier = zoneMultipliers[zone] ?? 1;
  const serviceMultiplier = serviceMultipliers[serviceType];

  const estimate = useMemo(() => {
    const base = billableWeight * baseRatePerLb * zoneMultiplier * serviceMultiplier;
    const fuelSurcharge = base * 0.12;
    const handling = billableWeight > 50 ? 8 : 0;
    const oversize = (length + 2 * (width + height)) > 130 ? 35 : 0;
    const low = base + fuelSurcharge + handling + oversize;
    const high = low * 1.18;
    return { low, high, fuelSurcharge, handling, oversize };
  }, [billableWeight, zoneMultiplier, serviceMultiplier, length, width, height]);

  const warnings = [
    dimImpact ? 'Dimensional weight exceeds actual weight; billing is based on DIM.' : '',
    billableWeight > 50 ? 'Heavy package handling surcharge likely.' : '',
    (length + 2 * (width + height)) > 130 ? 'Oversize surcharge likely based on length + girth.' : '',
  ].filter(Boolean);

  const validate = () => {
    const next: Record<string, string> = {};
    if (weight <= 0) next.weight = 'Weight must be greater than 0';
    if (length <= 0) next.length = 'Length must be greater than 0';
    if (width <= 0) next.width = 'Width must be greater than 0';
    if (height <= 0) next.height = 'Height must be greater than 0';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleEstimate = () => {
    validate();
  };

  const faqs = [
    {
      question: 'How accurate is this shipment cost estimate?',
      answer: 'This tool provides a practical range using billable weight, zone multipliers, and common surcharge patterns. Carrier invoices can vary by contract terms and accessorial fees.'
    },
    {
      question: 'Why is billable weight higher than actual weight?',
      answer: 'Carriers often bill by dimensional weight when a package is large for its weight. If DIM weight is higher, that value is used for pricing.'
    },
    {
      question: 'What surcharges are common?',
      answer: 'Fuel, residential delivery, additional handling, oversize, remote area, and signature fees are common. This estimator highlights high-probability surcharge conditions.'
    },
  ];

  const relatedTools = [
    { name: 'DIM Divisor Calculator', path: '/tools/shipping/dim-divisor-calculator', desc: 'Analyze DIM and billable weight impacts' },
    { name: 'FedEx DIM Calculator', path: '/tools/shipping/fedex-dim-weight-calculator', desc: 'FedEx DIM calculator' },
    { name: 'UPS DIM Calculator', path: '/tools/shipping/ups-dim-weight-calculator', desc: 'UPS DIM calculator' },
    { name: 'Freight Class Estimator', path: '/tools/shipping/freight-class-estimator', desc: 'Estimate LTL class from density' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Shipment Cost Estimator',
        description: 'Estimate shipping cost range using weight, package dimensions, zone, and service type with DIM impact and surcharge checks.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/shipment-cost-estimator',
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
          { '@type': 'ListItem', position: 3, name: 'Shipment Cost Estimator', item: 'https://www.calculatorpilotai.com/tools/shipping/shipment-cost-estimator' },
        ],
      },
    ],
  };

  return (
    <ToolLayout toolId="shipment-cost-estimator" category="shipping" canonical="https://www.calculatorpilotai.com/tools/shipping/shipment-cost-estimator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Shipment Cost Estimator</h2>
          <p className="text-slate-600 text-sm mb-6">Estimate shipping cost range with DIM and surcharge checks.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight (lbs)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className={`w-full p-3 border rounded-lg font-mono ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`} />
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Zone</label>
              <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg">
                {['2', '3', '4', '5', '6', '7', '8'].map((z) => (
                  <option key={z} value={z}>Zone {z}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Service Type</label>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value as ServiceType)} className="w-full p-3 border border-slate-200 rounded-lg">
                <option value="ground">Ground</option>
                <option value="express">Express</option>
                <option value="overnight">Overnight</option>
              </select>
            </div>
          </div>

          <button onClick={handleEstimate} className="mt-6 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest">Estimate Shipping Cost</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Dim Weight</span>
            <div className="text-2xl font-mono font-bold">{formatNumber(dimWeight, { decimals: 0 })} lbs</div>
          </div>
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Billable Weight</span>
            <div className="text-2xl font-mono font-bold">{formatNumber(billableWeight, { decimals: 0 })} lbs</div>
          </div>
          <div className="p-5 bg-primary/10 border border-primary/20 rounded-xl text-center">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Cost Range</span>
            <div className="text-2xl font-mono font-bold text-primary">${formatNumber(estimate.low, { decimals: 2 })} - ${formatNumber(estimate.high, { decimals: 2 })}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold mb-2">DIM Impact & Surcharge Warnings</h3>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            <li>Base estimate includes zone and service multiplier.</li>
            <li>Fuel surcharge estimate: ${formatNumber(estimate.fuelSurcharge, { decimals: 2 })}</li>
            {estimate.handling > 0 && <li>Additional handling estimated: ${formatNumber(estimate.handling, { decimals: 2 })}</li>}
            {estimate.oversize > 0 && <li>Oversize surcharge estimated: ${formatNumber(estimate.oversize, { decimals: 2 })}</li>}
            {warnings.map((w, idx) => <li key={idx}>{w}</li>)}
          </ul>
          <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg font-mono">
            DIM Weight = ceil((L × W × H) / 139), Billable = max(Actual, DIM)
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
