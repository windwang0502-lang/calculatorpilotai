import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculatePallet, PalletResult, PalletType } from '@/lib/engines';
import { validateNumberInput, formatNumber } from '@/lib/utils';

export default function PalletCalculator() {
  const [boxLength, setBoxLength] = useState(18);
  const [boxWidth, setBoxWidth] = useState(14);
  const [boxHeight, setBoxHeight] = useState(10);
  const [boxWeight, setBoxWeight] = useState(15);
  const [boxQuantity, setBoxQuantity] = useState(48);
  const [palletType, setPalletType] = useState<PalletType>('standard-us');
  const [maxPalletHeight, setMaxPalletHeight] = useState(0);
  const [maxPalletWeight, setMaxPalletWeight] = useState(0);
  const [result, setResult] = useState<PalletResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (boxLength <= 0) newErrors.boxLength = 'Box length must be greater than 0';
    if (boxWidth <= 0) newErrors.boxWidth = 'Box width must be greater than 0';
    if (boxHeight <= 0) newErrors.boxHeight = 'Box height must be greater than 0';
    if (boxWeight <= 0) newErrors.boxWeight = 'Box weight must be greater than 0';
    if (boxQuantity <= 0) newErrors.boxQuantity = 'Quantity must be greater than 0';
    if (maxPalletHeight < 0) newErrors.maxHeight = 'Max height cannot be negative';
    if (maxPalletWeight < 0) newErrors.maxWeight = 'Max weight cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculatePallet(
      boxLength, boxWidth, boxHeight, boxWeight, boxQuantity,
      palletType,
      maxPalletHeight || 0,
      maxPalletWeight || 0
    );
    setResult(res);
  };

  const relatedTools = [
    { name: 'Freight Class Calculator', path: '/tools/shipping/freight-class-calculator', desc: 'Estimate freight class for palletized shipments' },
    { name: 'Shipping Cost Estimator', path: '/tools/shipping/shipping-cost-estimator', desc: 'Estimate shipping costs for pallets' },
    { name: 'Package Volume Calculator', path: '/tools/shipping/package-volume-calculator', desc: 'Calculate package volume' },
  ];

  const faqs = [
    {
      question: 'What are the standard pallet sizes?',
      answer: 'The most common pallet sizes are: Standard US/GMA pallet at 48×40 inches (1219×1016 mm), Euro pallet at 47.24×31.50 inches (1200×800 mm), and Half pallet at 48×20 inches. US pallets are standard in North America, while Euro pallets are used throughout Europe and in many international shipments. Always confirm the required pallet type with your logistics provider.'
    },
    {
      question: 'What is pallet utilization?',
      answer: "Pallet utilization measures how efficiently your boxes fill the available space on a pallet. It's calculated as the percentage of pallet surface area covered by boxes in each layer. Higher utilization (80%+) means you're efficiently using pallet space and reducing shipping costs per unit. Low utilization (below 50%) suggests you may be wasting space and should consider different box sizes or arrangements."
    },
    {
      question: 'What is the maximum pallet height?',
      answer: 'Maximum pallet height varies by carrier and pallet type. Standard US LTL freight typically allows up to 96 inches (8 feet) from pallet base to top. Some carriers allow 108 inches or more. Maritime containers usually limit loads to 96-98 inches. Always check with your carrier for specific height restrictions, as overage can result in costly special handling fees or rejected shipments.'
    },
    {
      question: 'What is the maximum pallet weight?',
      answer: 'Standard US pallets (GMA) have a maximum load capacity of 4,500 lbs when evenly distributed. Euro pallets typically support 2,200-3,300 lbs depending on the pallet quality and configuration. These are structural limits; actual weight limits may be lower due to truck axle limits, forklift capacity, or carrier restrictions. Exceeding weight limits creates safety hazards and may result in refused shipments.'
    },
    {
      question: 'How do I maximize pallet utilization?',
      answer: 'To maximize pallet utilization: Choose box sizes that divide evenly into pallet dimensions. Use brick or column patterns rather than simple grids when boxes are different sizes. Consider mixing box orientations within layers for better fit. Optimize box sizes during product design phase. Use layer pads or cardboard sheets to create stable, uniform layers. Avoid overhang—boxes should not extend beyond the pallet edges.'
    },
    {
      question: 'Should I stretch wrap or band my pallets?',
      answer: 'Stretch wrapping is essential for most palletized shipments to keep boxes secure during transit. Use 5-10 layers of stretch wrap, especially around the base and middle of the load. Consider banding for very heavy loads or international shipping where shifting is more likely. Some carriers require specific pallet securing methods—check your shipping agreement for requirements. Pallets with unstable loads may be refused or result in product damage claims.'
    }
  ];

  const schemaJsonLd = result ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Pallet Calculator',
        description: 'Calculate how many boxes fit on a pallet and estimate pallet utilization.',
        url: 'https://www.calculatorpilotai.com/tools/shipping/pallet-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Pallet Calculator', item: 'https://www.calculatorpilotai.com/tools/shipping/pallet-calculator' }
        ]
      }
    ]
  } : null;

  return (
    <ToolLayout toolId="shipping" category="shipping">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-orange-500/20 text-orange-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Warehouse Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pallet Calculator</h1>
          <p className="text-xl text-orange-200 max-w-2xl mx-auto">
            Calculate how many boxes fit on a pallet and optimize your shipping and storage planning.
          </p>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Enter Box and Pallet Information</h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Box Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label htmlFor="pc-box-length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length (in)</label>
                  <input
                    id="pc-box-length"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={boxLength}
                    onChange={(e) => { setBoxLength(validateNumberInput(Number(e.target.value), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.boxLength; return n; }); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.boxLength ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.boxLength && <p className="text-xs text-rose-500">{errors.boxLength}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="pc-box-width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width (in)</label>
                  <input
                    id="pc-box-width"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={boxWidth}
                    onChange={(e) => { setBoxWidth(validateNumberInput(Number(e.target.value), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.boxWidth; return n; }); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.boxWidth ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.boxWidth && <p className="text-xs text-rose-500">{errors.boxWidth}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="pc-box-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height (in)</label>
                  <input
                    id="pc-box-height"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={boxHeight}
                    onChange={(e) => { setBoxHeight(validateNumberInput(Number(e.target.value), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.boxHeight; return n; }); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.boxHeight ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.boxHeight && <p className="text-xs text-rose-500">{errors.boxHeight}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="pc-box-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight (lbs)</label>
                  <input
                    id="pc-box-weight"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={boxWeight}
                    onChange={(e) => { setBoxWeight(validateNumberInput(Number(e.target.value), { min: 0.1 })); setErrors(prev => { const n = { ...prev }; delete n.boxWeight; return n; }); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.boxWeight ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.boxWeight && <p className="text-xs text-rose-500">{errors.boxWeight}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="pc-quantity" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Number of Boxes</label>
                <input
                  id="pc-quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={boxQuantity}
                  onChange={(e) => { setBoxQuantity(validateNumberInput(Number(e.target.value), { min: 1 })); setErrors(prev => { const n = { ...prev }; delete n.boxQuantity; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.boxQuantity ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.boxQuantity && <p className="text-xs text-rose-500">{errors.boxQuantity}</p>}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Pallet Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="pc-pallet-type" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pallet Type</label>
                  <select
                    id="pc-pallet-type"
                    value={palletType}
                    onChange={(e) => setPalletType(e.target.value as PalletType)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg bg-white"
                  >
                    <option value="standard-us">Standard US (48×40 in)</option>
                    <option value="euro">Euro (1200×800 mm)</option>
                    <option value="custom">Custom Size</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="pc-max-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Max Height (in, 0=default)</label>
                  <input
                    id="pc-max-height"
                    type="number"
                    min="0"
                    step="1"
                    value={maxPalletHeight}
                    onChange={(e) => { setMaxPalletHeight(validateNumberInput(Number(e.target.value), { min: 0 })); setErrors(prev => { const n = { ...prev }; delete n.maxHeight; return n; }); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.maxHeight ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.maxHeight && <p className="text-xs text-rose-500">{errors.maxHeight}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="pc-max-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Max Weight (lbs, 0=default)</label>
                  <input
                    id="pc-max-weight"
                    type="number"
                    min="0"
                    step="1"
                    value={maxPalletWeight}
                    onChange={(e) => { setMaxPalletWeight(validateNumberInput(Number(e.target.value), { min: 0 })); setErrors(prev => { const n = { ...prev }; delete n.maxWeight; return n; }); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.maxWeight ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.maxWeight && <p className="text-xs text-rose-500">{errors.maxWeight}</p>}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>Note:</strong> Set Max Height and Max Weight to 0 to use standard pallet limits (96" height, 4,500 lbs for US pallets; 94" height, 2,200 lbs for Euro pallets).
            </div>

            <button onClick={handleCalculate} className="mt-8 w-full bg-orange-600 text-white font-bold py-4 rounded-lg hover:bg-orange-700 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-orange-600 focus:ring-offset-2">
              Calculate Pallets
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-8 rounded-xl text-center mb-8">
                <span className="text-sm font-semibold uppercase tracking-widest opacity-80">Estimated Pallet Count</span>
                <div className="text-5xl font-bold mt-2">{result.palletCount}</div>
                <p className="text-orange-100 mt-2">
                  {result.boxesPerPallet} boxes per pallet × {Math.ceil(result.totalBoxes / result.palletCount)} pallets
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Boxes/Pallet</span>
                  <div className="text-xl font-mono font-bold">{result.boxesPerPallet}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Boxes</span>
                  <div className="text-xl font-mono font-bold">{result.totalBoxes}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Weight</span>
                  <div className="text-xl font-mono font-bold">{formatNumber(result.totalWeight, { decimals: 0 })} lbs</div>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-300 rounded-xl text-center">
                  <span className="text-xs font-bold text-orange-700 uppercase tracking-widest block mb-2">Utilization</span>
                  <div className="text-xl font-mono font-bold text-orange-700">{formatNumber(result.palletUtilization, { decimals: 1 })}%</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Notes</h3>
                <ul className="space-y-2">
                  {result.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <span className="text-orange-500 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Understanding Pallet Calculations</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
                <p className="text-slate-700 leading-relaxed">
                  The Pallet Calculator helps warehouse managers, logistics coordinators, and shippers determine how many boxes fit on a standard pallet. By entering your box dimensions, weight, quantity, and pallet type, you can quickly calculate the number of pallets needed for your shipment. This tool is essential for optimizing warehouse space, planning truckloads, and accurately quoting freight costs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">How It Works</h3>
                <p className="text-slate-700 leading-relaxed">
                  The calculator determines how many boxes fit across the pallet length and width by dividing pallet dimensions by box dimensions. It then calculates how many layers fit within the height and weight limits. The limiting factor (space or weight) determines the boxes per pallet. Finally, it divides your total box quantity by boxes per pallet to estimate the number of pallets required.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">The Formula</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                  <p className="mb-2"><strong>Boxes per layer</strong> = floor(Pallet Length ÷ Box Length) × floor(Pallet Width ÷ Box Width)</p>
                  <p className="mb-2"><strong>Layers per pallet</strong> = floor(Max Height ÷ Box Height)</p>
                  <p className="mb-2"><strong>Max boxes by weight</strong> = floor(Max Weight ÷ Box Weight)</p>
                  <p><strong>Boxes per pallet</strong> = MIN(Boxes per layer × Layers, Max boxes by weight)</p>
                  <p className="mt-2 text-slate-600">Example: 18×14×10 in boxes on 48×40 in pallet with 96" max height: Boxes/layer = 2×2 = 4, Layers = 9, Boxes/pallet = 4×9 = 36</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Example Calculations</h3>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Example 1:</strong> You have 48 small boxes measuring 12"×10"×8" at 5 lbs each, shipping on US pallets with standard limits. Floor(48÷12)=4 boxes across length, Floor(40÷10)=4 boxes across width = 16 per layer. Max height allows 12 layers (96÷8), so 16×12=192 boxes per pallet. For 48 boxes, you need just 1 pallet.
                </p>
                <p className="text-slate-700 leading-relaxed mt-4">
                  <strong>Example 2:</strong> Large boxes at 24"×20"×18" weighing 30 lbs each. Only 2 fit across length (48÷24) and 2 across width (40÷20) = 4 per layer. Height allows 5 layers (96÷18≈5), but weight limits to 150 boxes (4500÷30). So 4×5=20 boxes per pallet, and 150 boxes need 8 pallets.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">When to Use This Calculator</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li>Planning warehouse receiving and storage capacity</li>
                  <li>Estimating truck or container loading requirements</li>
                  <li>Calculating shipping costs for palletized freight</li>
                  <li>Designing product packaging for optimal palletization</li>
                  <li>Creating picking and packing workflows</li>
                  <li>Estimating labor requirements for loading/unloading</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Pallet Optimization Tips</h3>
                <div className="space-y-3 text-slate-700">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Match box dimensions to pallet:</strong> Choose box sizes that divide evenly into pallet dimensions to avoid wasted space.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Consider case pack quantities:</strong> Design case packs to fill pallet layers completely for easier handling.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Stackability matters:</strong> Ensure boxes can safely support the weight of boxes stacked above them.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <p><strong>Account for overhang:</strong> Boxes should not extend beyond pallet edges—use corner boards if needed.</p>
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
