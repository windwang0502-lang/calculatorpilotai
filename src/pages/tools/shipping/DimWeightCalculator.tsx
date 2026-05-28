import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateShipping, ShippingResult } from '@/lib/engines';
import { generateShippingInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

const CM_PER_IN = 2.54;
const KG_PER_LB = 0.453592;

export default function ShippingCalculator() {
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  // Always stored internally in inches / lbs
  const [lengthIn, setLengthIn] = useState(12);
  const [widthIn, setWidthIn] = useState(12);
  const [heightIn, setHeightIn] = useState(12);
  const [weightLb, setWeightLb] = useState(5);
  const [divisor, setDivisor] = useState(139);
  const [result, setResult] = useState<ShippingResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toDisplay = (inchVal: number) => unit === 'imperial' ? inchVal : Math.round(inchVal * CM_PER_IN * 10) / 10;
  const fromDisplay = (val: number) => unit === 'imperial' ? val : val / CM_PER_IN;
  const toDisplayW = (lbVal: number) => unit === 'imperial' ? lbVal : Math.round(lbVal * KG_PER_LB * 100) / 100;
  const fromDisplayW = (val: number) => unit === 'imperial' ? val : val / KG_PER_LB;

  const dimLabel = unit === 'imperial' ? 'in' : 'cm';
  const weightLabel = unit === 'imperial' ? 'lb' : 'kg';
  const metricDivisor = unit === 'metric' ? 5000 : divisor;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (lengthIn <= 0 || lengthIn > 2540) newErrors.length = `Length out of valid range`;
    if (widthIn <= 0 || widthIn > 2540) newErrors.width = `Width out of valid range`;
    if (heightIn <= 0 || heightIn > 2540) newErrors.height = `Height out of valid range`;
    if (weightLb < 0 || weightLb > 22046) newErrors.actualWeight = `Weight out of valid range`;
    if (metricDivisor <= 0) newErrors.divisor = 'Divisor must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateShipping(lengthIn, widthIn, heightIn, weightLb, unit === 'metric' ? metricDivisor * (1 / CM_PER_IN) ** 3 / KG_PER_LB : divisor);
    setResult(res);
    setInsight(generateShippingInsight(res.dimWeight, weightLb));
  };

  return (
    <ToolLayout toolId="shipping" category="shipping">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">DIM Weight Calculator</h2>
            <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
              {(['imperial', 'metric'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === u ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                  {u === 'imperial' ? 'in / lb' : 'cm / kg'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="ship-length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Length ({dimLabel})</label>
              <input
                id="ship-length"
                type="number"
                min="0.1"
                max="2540"
                step="0.1"
                value={toDisplay(lengthIn)}
                onChange={(e) => { setLengthIn(validateNumberInput(fromDisplay(Number(e.target.value)), { min: 0.1, max: 2540 })); setErrors(prev => { const n = { ...prev }; delete n.length; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.length ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.length && <p className="text-xs text-rose-500">{errors.length}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="ship-width" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Width ({dimLabel})</label>
              <input
                id="ship-width"
                type="number"
                min="0.1"
                max="2540"
                step="0.1"
                value={toDisplay(widthIn)}
                onChange={(e) => { setWidthIn(validateNumberInput(fromDisplay(Number(e.target.value)), { min: 0.1, max: 2540 })); setErrors(prev => { const n = { ...prev }; delete n.width; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.width ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.width && <p className="text-xs text-rose-500">{errors.width}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="ship-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({dimLabel})</label>
              <input
                id="ship-height"
                type="number"
                min="0.1"
                max="2540"
                step="0.1"
                value={toDisplay(heightIn)}
                onChange={(e) => { setHeightIn(validateNumberInput(fromDisplay(Number(e.target.value)), { min: 0.1, max: 2540 })); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="ship-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Actual Weight ({weightLabel})</label>
              <input
                id="ship-weight"
                type="number"
                min="0"
                max="22046"
                step="0.1"
                value={toDisplayW(weightLb)}
                onChange={(e) => { setWeightLb(validateNumberInput(fromDisplayW(Number(e.target.value)), { min: 0, max: 22046 })); setErrors(prev => { const n = { ...prev }; delete n.actualWeight; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.actualWeight ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.actualWeight && <p className="text-xs text-rose-500">{errors.actualWeight}</p>}
            </div>
            {unit === 'imperial' && (
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="ship-divisor" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Shipping Divisor (139 = US Standard)</label>
                <input
                  id="ship-divisor"
                  type="number"
                  min="1"
                  step="1"
                  value={divisor}
                  onChange={(e) => { setDivisor(validateNumberInput(Number(e.target.value), { min: 1 })); setErrors(prev => { const n = { ...prev }; delete n.divisor; return n; }); }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.divisor ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.divisor && <p className="text-xs text-rose-500">{errors.divisor}</p>}
              </div>
            )}
            {unit === 'metric' && (
              <div className="md:col-span-2 text-xs text-muted-foreground bg-slate-50 p-3 rounded-lg">
                Metric mode uses the standard divisor of 5000 (cm³/kg), as used by most international carriers.
              </div>
            )}
          </div>
          <button onClick={handleCalculate} className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
            Calculate Billable Weight
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">DIM Weight</span>
                <div className={`${getResultTextSize(formatNumber(toDisplayW(result.dimWeight), { decimals: 2 }))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(toDisplayW(result.dimWeight), { decimals: 2 })} {weightLabel}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Actual Weight</span>
                <div className={`${getResultTextSize(formatNumber(toDisplayW(weightLb), { decimals: 2 }))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(toDisplayW(weightLb), { decimals: 2 })} {weightLabel}</div>
              </div>
              <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl text-center">
                <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Billable Weight</span>
                <div className={`${getResultTextSize(formatNumber(toDisplayW(result.billableWeight), { decimals: 2 }))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>{formatNumber(toDisplayW(result.billableWeight), { decimals: 2 })} {weightLabel}</div>
              </div>
            </div>
            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}
