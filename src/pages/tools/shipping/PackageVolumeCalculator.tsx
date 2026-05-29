import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateVolume, VolumeResult, VolumeUnit } from '@/lib/engines';
import { validateNumberInput, formatNumber, getResultTextSize } from '@/lib/utils';

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

  const schemaJsonLd = {
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
  };

  return (
    <ToolLayout
      toolId="shipping"
      category="shipping"
      title="Package Volume Calculator"
      description="Calculate package volume in cubic inches, feet, centimeters, and meters for accurate shipping cost estimation."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      <div className="space-y-8">
        {/* Calculator Form */}
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Enter Package Dimensions</h2>
            <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
              {(['inches', 'centimeters', 'meters'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === u ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
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

          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
            <strong>Tip:</strong> Measure to the outermost points of your package, including any strapping, padding, or packaging materials. Carriers measure the space your package occupies.
          </div>

          <button onClick={handleCalculate} className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2">
            Calculate Volume
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Inches</span>
                <div className={`${getResultTextSize(formatNumber(result.cubicInches, { decimals: 2 }))} font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere`}>{formatNumber(result.cubicInches, { decimals: 2 })}</div>
                <span className="text-xs text-slate-500">in³</span>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Feet</span>
                <div className={`${getResultTextSize(formatNumber(result.cubicFeet, { decimals: 4 }))} font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere`}>{formatNumber(result.cubicFeet, { decimals: 4 })}</div>
                <span className="text-xs text-slate-500">ft³</span>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cubic Cm</span>
                <div className={`${getResultTextSize(formatNumber(result.cubicCentimeters, { decimals: 2 }))} font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere`}>{formatNumber(result.cubicCentimeters, { decimals: 2 })}</div>
                <span className="text-xs text-slate-500">cm³</span>
              </div>
              <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Cubic Meters</span>
                <div className={`${getResultTextSize(formatNumber(result.cubicMeters, { decimals: 6 }))} font-mono font-bold text-primary tabular-nums leading-none overflow-wrap-anywhere`}>{formatNumber(result.cubicMeters, { decimals: 6 })}</div>
                <span className="text-xs text-primary/80">m³</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Volume Explanation</h3>
              <p className="text-slate-700 leading-relaxed">{result.explanation}</p>
            </div>

            {/* FAQ Section */}
            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-lg p-5">
                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                    <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Tools */}
            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-6">Related Shipping Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedTools.map((tool, index) => (
                  <a key={index} href={tool.path} className="block p-5 bg-white border border-slate-200 rounded-lg hover:border-primary hover:shadow-sm transition-all">
                    <h3 className="font-bold text-base mb-2">{tool.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{tool.desc}</p>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

