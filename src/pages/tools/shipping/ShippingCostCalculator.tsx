import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';

type Carrier = 'fedex' | 'ups' | 'usps';

interface CarrierResult {
  carrier: Carrier;
  carrierName: string;
  dimWeight: number;
  actualWeight: number;
  billableWeight: number;
  estimatedCost: number;
}

interface ShippingCalculationResult {
  carriers: CarrierResult[];
  cheapestCarrier: Carrier;
  highestCarrier: Carrier;
  averageCost: number;
}

// Carrier rate formulas
const CARRIER_CONFIG: Record<Carrier, { name: string; base: number; weightRate: number; zoneRate: number; dimDivisor: number }> = {
  fedex: { name: 'FedEx Ground', base: 8, weightRate: 0.75, zoneRate: 1.5, dimDivisor: 139 },
  ups: { name: 'UPS Ground', base: 9, weightRate: 0.80, zoneRate: 1.6, dimDivisor: 139 },
  usps: { name: 'USPS Priority', base: 10, weightRate: 0.50, zoneRate: 0.80, dimDivisor: 166 },
};

function calculateShippingCosts(
  length: number,
  width: number,
  height: number,
  actualWeight: number,
  zone: number
): ShippingCalculationResult {
  const volume = length * width * height;
  const carriers: CarrierResult[] = [];

  let cheapestCarrier: Carrier = 'fedex';
  let highestCarrier: Carrier = 'fedex';
  let lowestCost = Infinity;
  let highestCost = 0;
  let totalCost = 0;

  (Object.keys(CARRIER_CONFIG) as Carrier[]).forEach((carrier) => {
    const config = CARRIER_CONFIG[carrier];
    const dimWeight = volume / config.dimDivisor;
    const billableWeight = Math.max(actualWeight, dimWeight);
    const cost = config.base + (billableWeight * config.weightRate) + (zone * config.zoneRate);

    const result: CarrierResult = {
      carrier,
      carrierName: config.name,
      dimWeight: Math.round(dimWeight * 100) / 100,
      actualWeight,
      billableWeight: Math.round(billableWeight * 100) / 100,
      estimatedCost: Math.round(cost * 100) / 100,
    };

    carriers.push(result);

    if (cost < lowestCost) {
      lowestCost = cost;
      cheapestCarrier = carrier;
    }
    if (cost > highestCost) {
      highestCost = cost;
      highestCarrier = carrier;
    }
    totalCost += cost;
  });

  return {
    carriers,
    cheapestCarrier,
    highestCarrier,
    averageCost: Math.round((totalCost / 3) * 100) / 100,
  };
}

export default function ShippingCostCalculator() {
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(12);
  const [weight, setWeight] = useState(5);
  const [zone, setZone] = useState<number>(4);
  const [carrier, setCarrier] = useState<Carrier>('fedex');
  const [result, setResult] = useState<ShippingCalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const faqs = [
    { q: 'What is billable weight?', a: 'Billable weight is the greater of actual weight and dimensional (DIM) weight. Carriers charge based on whichever is higher, as larger packages consume more truck space even if light.' },
    { q: 'How do shipping zones work?', a: 'Shipping zones range from 1-8, based on distance from origin. Zone 1 is the same or adjacent state; Zone 8 is the farthest states and remote areas. Longer distances mean higher zone surcharges.' },
    { q: 'Why do carriers have different rates?', a: 'Each carrier has unique pricing structures based on their network, service level guarantees, and operational efficiency. FedEx and UPS specialize in business shipping; USPS focuses on lightweight residential deliveries.' },
    { q: 'What is a DIM divisor?', a: 'The DIM divisor converts package volume to dimensional weight. Standard US domestic ground divisors: FedEx/UPS use 139, USPS uses 166. A lower divisor produces a higher dimensional weight.' },
    { q: 'When is actual weight more than DIM weight?', a: 'Small, dense packages typically have actual weight exceeding their DIM weight. For example, a 10" cube weighing 15 lbs has DIM weight of only 7 lbs, so 15 lbs would be billed.' },
    { q: 'How can I reduce shipping costs?', a: 'Reduce package dimensions (use right-sized boxes), minimize weight where possible, ship during carrier discount periods, and compare all three carriers. Negotiate volume discounts if you ship regularly.' },
  ];

  const relatedTools = [
    { name: 'DIM Weight Calculator', path: '/tools/shipping/dim-weight-calculator', desc: 'Calculate dimensional vs actual weight' },
    { name: 'Chargeable Weight Calculator', path: '/tools/shipping/chargeable-weight-calculator', desc: 'Air cargo chargeable weight rules' },
    { name: 'Package Volume Calculator', path: '/tools/shipping/package-volume-calculator', desc: 'Volume in cubic inches or centimeters' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'SoftwareApplication', name: 'Shipping Cost Calculator', description: 'Compare FedEx, UPS, and USPS shipping rates based on package dimensions, weight, and shipping zone.', url: 'https://www.calculatorpilotai.com/tools/shipping/shipping-cost-calculator', applicationCategory: 'BusinessApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      { '@type': 'FAQPage', mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })) },
    ],
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (length <= 0 || length > 150) newErrors.length = 'Length must be between 1 and 150 inches';
    if (width <= 0 || width > 150) newErrors.width = 'Width must be between 1 and 150 inches';
    if (height <= 0 || height > 150) newErrors.height = 'Height must be between 1 and 150 inches';
    if (weight <= 0 || weight > 150) newErrors.weight = 'Weight must be between 0.1 and 150 lbs';
    if (zone < 1 || zone > 8) newErrors.zone = 'Zone must be between 1 and 8';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateShippingCosts(length, width, height, weight, zone);
    setResult(res);
  };

  const clearError = (key: string) => {
    setErrors((prev) => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.carriers.map((c) => ({
      name: c.carrierName.replace(' ', '\n'),
      fullName: c.carrierName,
      cost: c.estimatedCost,
      isCheapest: c.carrier === result.cheapestCarrier,
    }));
  }, [result]);

  const selectedCarrierResult = result?.carriers.find((c) => c.carrier === carrier);

  const getZoneDescription = (z: number) => {
    const descriptions: Record<number, string> = {
      1: 'Same/Adjacent State',
      2: '2-3 States Away',
      3: '4-5 States Away',
      4: '6-7 States Away',
      5: '8-9 States Away',
      6: '10-11 States Away',
      7: '12-13 States Away',
      8: 'Far States/Remote',
    };
    return descriptions[z] || '';
  };

  return (
    <ToolLayout toolId="shipping-cost" category="shipping">
      <section className="space-y-8">
        {/* Calculator Input Section */}
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Your Shipping Costs</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Length */}
            <div className="space-y-2">
              <label htmlFor="sc-length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Length (inches)
              </label>
              <div className="relative">
                <input
                  id="sc-length"
                  type="number"
                  min="1"
                  max="150"
                  step="0.1"
                  value={length}
                  onChange={(e) => {
                    setLength(validateNumberInput(e.target.value, { min: 1, max: 150 }));
                    clearError('length');
                  }}
                  className={`w-full pl-3 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${
                    errors.length ? 'border-rose-500' : 'border-slate-200'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">in</span>
              </div>
              {errors.length && <p className="text-xs text-rose-500">{errors.length}</p>}
              <p className="text-xs text-muted-foreground">Longest side of your package</p>
            </div>

            {/* Width */}
            <div className="space-y-2">
              <label htmlFor="sc-width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Width (inches)
              </label>
              <div className="relative">
                <input
                  id="sc-width"
                  type="number"
                  min="1"
                  max="150"
                  step="0.1"
                  value={width}
                  onChange={(e) => {
                    setWidth(validateNumberInput(e.target.value, { min: 1, max: 150 }));
                    clearError('width');
                  }}
                  className={`w-full pl-3 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${
                    errors.width ? 'border-rose-500' : 'border-slate-200'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">in</span>
              </div>
              {errors.width && <p className="text-xs text-rose-500">{errors.width}</p>}
              <p className="text-xs text-muted-foreground">Second longest side</p>
            </div>

            {/* Height */}
            <div className="space-y-2">
              <label htmlFor="sc-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Height (inches)
              </label>
              <div className="relative">
                <input
                  id="sc-height"
                  type="number"
                  min="1"
                  max="150"
                  step="0.1"
                  value={height}
                  onChange={(e) => {
                    setHeight(validateNumberInput(e.target.value, { min: 1, max: 150 }));
                    clearError('height');
                  }}
                  className={`w-full pl-3 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${
                    errors.height ? 'border-rose-500' : 'border-slate-200'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">in</span>
              </div>
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
              <p className="text-xs text-muted-foreground">Shortest side of your package</p>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label htmlFor="sc-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Weight (lbs)
              </label>
              <div className="relative">
                <input
                  id="sc-weight"
                  type="number"
                  min="0.1"
                  max="150"
                  step="0.1"
                  value={weight}
                  onChange={(e) => {
                    setWeight(validateNumberInput(e.target.value, { min: 0.1, max: 150 }));
                    clearError('weight');
                  }}
                  className={`w-full pl-3 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${
                    errors.weight ? 'border-rose-500' : 'border-slate-200'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">lbs</span>
              </div>
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
              <p className="text-xs text-muted-foreground">Actual package weight</p>
            </div>

            {/* Zone - Full Width */}
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="sc-zone" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Shipping Zone
              </label>
              <select
                id="sc-zone"
                value={zone}
                onChange={(e) => setZone(Number(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${
                  errors.zone ? 'border-rose-500' : 'border-slate-200'
                } bg-white`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((z) => (
                  <option key={z} value={z}>
                    Zone {z} - {getZoneDescription(z)}
                  </option>
                ))}
              </select>
              {errors.zone && <p className="text-xs text-rose-500">{errors.zone}</p>}
              <p className="text-xs text-muted-foreground">Destination distance from origin (find your zone on carrier websites)</p>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-6 w-full sm:w-auto sm:px-12 bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-wider focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Shipping Costs
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 md:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Cheapest Carrier</span>
                <div className="text-sm md:text-base lg:text-lg font-bold text-emerald-700 leading-tight">
                  {CARRIER_CONFIG[result.cheapestCarrier].name}
                </div>
              </div>
              <div className="p-4 md:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Lowest Cost</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-slate-700 tabular-nums leading-none overflow-wrap-anywhere">
                  {formatCurrency(result.carriers.find((c) => c.carrier === result.cheapestCarrier)?.estimatedCost || 0)}
                </div>
              </div>
              <div className="p-4 md:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Highest Cost</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-slate-700 tabular-nums leading-none overflow-wrap-anywhere">
                  {formatCurrency(result.carriers.find((c) => c.carrier === result.highestCarrier)?.estimatedCost || 0)}
                </div>
              </div>
              <div className="p-4 md:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Average Cost</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-slate-700 tabular-nums leading-none overflow-wrap-anywhere">
                  {formatCurrency(result.averageCost)}
                </div>
              </div>
            </div>

            {/* Package Summary */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
              <h3 className="text-lg font-bold mb-4">Package Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-1">Dimensions</div>
                  <div className="font-mono font-semibold">{length}" x {width}" x {height}"</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-1">Volume</div>
                  <div className="font-mono font-semibold">{formatNumber(length * width * height, { decimals: 0 })} cu in</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-1">Actual Weight</div>
                  <div className="font-mono font-semibold">{weight} lbs</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-3">
                  <div className="text-sm text-primary mb-1">Shipping Zone</div>
                  <div className="font-mono font-semibold">{zone}</div>
                </div>
              </div>
            </div>

            {/* Carrier Comparison Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-bold mb-4">Carrier Cost Comparison</h3>
              <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: number) => `$${v.toFixed(0)}`}
                      width={45}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Estimated Cost']}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
                    />
                    <Legend />
                    <Bar dataKey="cost" name="Estimated Cost" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.isCheapest ? '#10b981' : '#3b82f6'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-3 text-center">
                Green bars indicate the cheapest carrier for your shipment
              </p>
            </div>

            {/* Detailed Carrier Results */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-lg font-bold">Detailed Results by Carrier</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {result.carriers.map((carrierResult) => {
                  const isSelected = carrier === carrierResult.carrier;
                  const isCheapest = carrierResult.carrier === result.cheapestCarrier;
                  return (
                    <div
                      key={carrierResult.carrier}
                      className={`p-5 ${isSelected ? 'bg-primary/5' : 'hover:bg-slate-50'} transition-colors cursor-pointer`}
                      onClick={() => setCarrier(carrierResult.carrier)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              isCheapest ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          />
                          <div>
                            <div className="font-bold text-lg">{carrierResult.carrierName}</div>
                            {isCheapest && (
                              <span className="text-xs text-emerald-600 font-medium">Best Rate</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Billable Weight</div>
                            <div className="font-mono font-semibold">{carrierResult.billableWeight} lbs</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">DIM Weight</div>
                            <div className="font-mono font-semibold">{carrierResult.dimWeight} lbs</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Estimated Cost</div>
                            <div className={`font-mono font-bold text-lg ${isCheapest ? 'text-emerald-600' : ''}`}>
                              {formatCurrency(carrierResult.estimatedCost)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">DIM Divisor: </span>
                              <span className="font-mono">{CARRIER_CONFIG[carrierResult.carrier].dimDivisor}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Base Rate: </span>
                              <span className="font-mono">${CARRIER_CONFIG[carrierResult.carrier].base}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight Rate: </span>
                              <span className="font-mono">${CARRIER_CONFIG[carrierResult.carrier].weightRate}/lb</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Zone Rate: </span>
                              <span className="font-mono">${CARRIER_CONFIG[carrierResult.carrier].zoneRate}/zone</span>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-muted-foreground">
                            <strong>Calculation:</strong> ${CARRIER_CONFIG[carrierResult.carrier].base} + ({carrierResult.billableWeight} lbs × ${CARRIER_CONFIG[carrierResult.carrier].weightRate}) + ({zone} zones × ${CARRIER_CONFIG[carrierResult.carrier].zoneRate}) = {formatCurrency(carrierResult.estimatedCost)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Carrier Focus */}
            {selectedCarrierResult && (
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  {selectedCarrierResult.carrierName} Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Package Volume</span>
                      <span className="font-mono font-semibold">{formatNumber(length * width * height)} cubic inches</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                      <span className="text-muted-foreground">DIM Divisor</span>
                      <span className="font-mono font-semibold">{CARRIER_CONFIG[carrier].dimDivisor}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Dimensional Weight</span>
                      <span className="font-mono font-semibold">{selectedCarrierResult.dimWeight} lbs</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Actual Weight</span>
                      <span className="font-mono font-semibold">{selectedCarrierResult.actualWeight} lbs</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/10 font-semibold">
                      <span>Billable Weight</span>
                      <span className="font-mono text-primary">{selectedCarrierResult.billableWeight} lbs</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Base Rate</span>
                      <span className="font-mono">${CARRIER_CONFIG[carrier].base}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Weight Charge</span>
                      <span className="font-mono">${CARRIER_CONFIG[carrier].weightRate} × {selectedCarrierResult.billableWeight}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                      <span className="text-muted-foreground">Zone Surcharge</span>
                      <span className="font-mono">${CARRIER_CONFIG[carrier].zoneRate} × {zone}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-3 mt-4 font-bold">
                      <span className="text-primary">Estimated Cost</span>
                      <span className="font-mono text-xl text-primary">{formatCurrency(selectedCarrierResult.estimatedCost)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cost Savings Tips */}
            {result && result.cheapestCarrier !== result.highestCarrier && (
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cost Savings Tip
                </h3>
                <p className="text-amber-800">
                  Choosing <strong>{CARRIER_CONFIG[result.cheapestCarrier].name}</strong> over{' '}
                  <strong>{CARRIER_CONFIG[result.highestCarrier].name}</strong> would save you{' '}
                  <strong className="font-mono">
                    {formatCurrency(
                      (result.carriers.find((c) => c.carrier === result.highestCarrier)?.estimatedCost || 0) -
                        (result.carriers.find((c) => c.carrier === result.cheapestCarrier)?.estimatedCost || 0)
                    )}
                  </strong>{' '}
                  on this shipment.
                </p>
              </div>
            )}

            {/* Related Shipping Tools */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-bold mb-4">Explore More Shipping Calculators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Link
                  to="/tools/shipping/dim-weight-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Dim Weight Calculator</span>
                </Link>
                <Link
                  to="/tools/shipping/freight-class-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Freight Class Calculator</span>
                </Link>
                <Link
                  to="/tools/shipping/package-volume-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Package Volume Calculator</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Content Sections Below Calculator */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">How to Use the Shipping Cost Calculator</h2>
          <div className="space-y-4">
            <p className="text-slate-700">This calculator compares shipping rates across FedEx, UPS, and USPS to help you find the most cost-effective option for your package. Enter your package dimensions and weight to get instant rate estimates.</p>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Step-by-Step Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                <li>Enter the length, width, and height of your package in inches</li>
                <li>Enter the actual weight in pounds</li>
                <li>Select your shipping zone (1 = nearest, 8 = farthest)</li>
                <li>Click "Calculate Shipping Costs" to compare rates</li>
                <li>Review the carrier comparison chart to find the best rate</li>
              </ol>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Understanding Shipping Zones</h3>
              <p className="text-slate-700">Shipping zones measure the distance between origin and destination. You can find your zone by entering your ZIP codes on the carrier's website. Zone 1 covers the same or adjacent state; Zone 8 covers the farthest remote areas.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Billable Weight vs Actual Weight</h3>
              <p className="text-slate-700">Carriers charge based on the greater of actual weight or dimensional weight (DIM). DIM weight is calculated from package volume using a divisor (139 for FedEx/UPS, 166 for USPS). Light, bulky packages often incur DIM weight charges.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Real-World Shipping Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Small E-Commerce Package</div>
              <div className="text-slate-700 text-sm mb-3">12" x 10" x 8" box, 5 lbs, Zone 4</div>
              <div className="bg-slate-50 rounded-lg p-3 text-sm">
                <span className="font-semibold">Estimated Cost Range:</span> $12.50 – $18.20
                <br /><span className="text-muted-foreground">Typical carrier: USPS Priority Mail for light packages</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Medium Household Moving Box</div>
              <div className="text-slate-700 text-sm mb-3">18" x 18" x 18" box, 25 lbs, Zone 6</div>
              <div className="bg-slate-50 rounded-lg p-3 text-sm">
                <span className="font-semibold">Estimated Cost Range:</span> $32.80 – $45.60
                <br /><span className="text-muted-foreground">Typical carrier: FedEx Ground for mid-range weight</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Large Oversized Package</div>
              <div className="text-slate-700 text-sm mb-3">24" x 20" x 16" box, 40 lbs, Zone 8</div>
              <div className="bg-slate-50 rounded-lg p-3 text-sm">
                <span className="font-semibold">Estimated Cost Range:</span> $58.20 – $75.90
                <br /><span className="text-muted-foreground">Typical carrier: UPS Ground for longer distances</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Lightweight But Bulky Item</div>
              <div className="text-slate-700 text-sm mb-3">20" x 16" x 14" box, 3 lbs, Zone 3</div>
              <div className="bg-slate-50 rounded-lg p-3 text-sm">
                <span className="font-semibold">Estimated Cost Range:</span> $14.30 – $22.10
                <br /><span className="text-muted-foreground">DIM weight dominates: billable weight ~16 lbs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Understanding Your Results</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-bold text-lg">Cheapest Carrier Badge</h3>
              <p className="text-slate-700">The green indicator shows which carrier offers the lowest rate for your specific package. This recommendation is based solely on price for the given dimensions, weight, and zone.</p>
            </div>
            <div className="border-l-4 border-slate-300 pl-4">
              <h3 className="font-bold text-lg">Billable Weight Explanation</h3>
              <p className="text-slate-700">The billable weight is the higher of actual weight or DIM weight. Carriers use this to ensure fair pricing regardless of package density. A 5-pound package in a large box may be billed as 15 pounds.</p>
            </div>
            <div className="border-l-4 border-slate-300 pl-4">
              <h3 className="font-bold text-lg">Cost Breakdown</h3>
              <p className="text-slate-700">Each rate consists of: base handling fee + (weight × per-pound rate) + (zone × zone surcharge). Click on any carrier row to see the full calculation breakdown.</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-lg">Savings Indicator</h3>
              <p className="text-slate-700">If there's a significant cost difference between carriers, you'll see a savings tip showing how much you could save by choosing the cheapest option.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Industry Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">E-Commerce Sellers</h3>
              <p className="text-slate-700 text-sm">Compare carrier rates for your product shipments. Factor in DIM weight for products shipped in large packaging. Consider offering multiple carrier options to customers.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Small Business Shipping</h3>
              <p className="text-slate-700 text-sm">Calculate shipping costs for business-to-business deliveries. Negotiate volume discounts with carriers based on your shipping patterns revealed by this calculator.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Moving & Relocation</h3>
              <p className="text-slate-700 text-sm">Estimate costs for moving boxes across country. Compare ground vs priority options based on urgency and budget constraints.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Freight Forwarders</h3>
              <p className="text-slate-700 text-sm">Quick preliminary rate checks for LTL quotes. Use zone and weight inputs to gauge ground shipping costs before requesting formal quotes from carriers.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Marketplace Sellers</h3>
              <p className="text-slate-700 text-sm">Calculate shipping costs for Amazon, eBay, or Etsy orders. Factor inDIM weight to accurately price shipping surcharges for oversized items.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Subscription Box Businesses</h3>
              <p className="text-slate-700 text-sm">Estimate per-unit shipping costs for monthly shipments. Optimize box dimensions to minimize DIM weight charges across your subscriber base.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Common Shipping Mistakes to Avoid</h2>
          <div className="space-y-4">
            <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-5">
              <h3 className="font-bold text-rose-900 mb-2">Using Wrong Dimensions</h3>
              <p className="text-rose-800 text-sm">Measure the outermost points of your package including any protrusions. Rounded dimensions can underestimate shipping costs if the actual package is larger.</p>
            </div>
            <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-5">
              <h3 className="font-bold text-rose-900 mb-2">Ignoring DIM Weight</h3>
              <p className="text-rose-800 text-sm">A 5-pound package in a large box might be billed as 15 pounds. Always check whether DIM weight exceeds actual weight, especially for lightweight items in big boxes.</p>
            </div>
            <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-5">
              <h3 className="font-bold text-rose-900 mb-2">Wrong Shipping Zone</h3>
              <p className="text-rose-800 text-sm">Entering the wrong zone can significantly skew results. Always verify your zone on the carrier's website using your actual origin and destination ZIP codes.</p>
            </div>
            <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-5">
              <h3 className="font-bold text-rose-900 mb-2">Forgetting Residential Surcharges</h3>
              <p className="text-rose-800 text-sm">This calculator uses base commercial rates. Residential deliveries often add $3-$5 surcharges that aren't reflected in the estimates. Check carrier surcharges for home addresses.</p>
            </div>
            <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-5">
              <h3 className="font-bold text-rose-900 mb-2">Not Comparing All Carriers</h3>
              <p className="text-rose-800 text-sm">USPS often wins for lightweight packages while FedEx/UPS may be cheaper for heavy shipments. Always compare all three carriers before committing to a shipping method.</p>
            </div>
            <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-5">
              <h3 className="font-bold text-rose-900 mb-2">Overlooking Fuel Surcharges</h3>
              <p className="text-rose-800 text-sm">Carrier rates include fuel surcharges that change quarterly. The estimates here reflect current base rates but actual charges may vary slightly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">{faq.q}</h3>
                <p className="text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Related Shipping Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool, i) => (
              <Link key={i} to={tool.path} className="block p-6 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-slate-600 text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
