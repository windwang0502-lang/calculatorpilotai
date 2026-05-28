import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateProtein, ProteinResult } from '@/lib/engines';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function ProteinCalculator() {
  const [weight, setWeight] = useState(70);
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [goal, setGoal] = useState<'maintain' | 'fat-loss' | 'muscle-gain'>('maintain');
  const [result, setResult] = useState<ProteinResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weightDisplay = unit === 'kg' ? weight : Math.round(weight * 2.20462 * 10) / 10;

  const handleWeightChange = (val: number) => {
    if (unit === 'kg') setWeight(val);
    else setWeight(Math.round(val / 2.20462));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const weightInKg = unit === 'kg' ? weight : weight / 2.20462;
    if (weightInKg <= 0 || weightInKg > 500) newErrors.weight = 'Weight must be between 1 and 500 kg';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const weightInKg = unit === 'kg' ? weight : weight / 2.20462;
    const res = calculateProtein(weightInKg, goal);
    setResult(res);
  };

  const getGoalInfo = (g: typeof goal) => {
    switch (g) {
      case 'fat-loss':
        return { label: 'Fat Loss', multiplier: 2.0, color: 'text-green-600', bg: 'bg-green-50 border-green-200', desc: 'Higher protein intake helps preserve muscle while creating a calorie deficit' };
      case 'muscle-gain':
        return { label: 'Muscle Gain', multiplier: 2.2, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', desc: 'Extra protein supports muscle protein synthesis during training' };
      default:
        return { label: 'Maintain', multiplier: 1.6, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', desc: 'Adequate protein for body maintenance and general health' };
    }
  };

  return (
    <ToolLayout toolId="protein" category="health">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Daily Protein Needs</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'kg' | 'lb')}
              options={[{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="protein-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Body Weight ({unit})</label>
              <input
                id="protein-weight"
                type="number"
                min="1"
                max="500"
                step="0.1"
                value={weightDisplay}
                onChange={(e) => {
                  handleWeightChange(validateNumberInput(Number(e.target.value), { min: 1, max: 500 }));
                  setErrors(prev => { const n = { ...prev }; delete n.weight; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="protein-goal" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fitness Goal</label>
              <select
                id="protein-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as typeof goal)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="maintain">Maintain Weight</option>
                <option value="fat-loss">Fat Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Protein Needs
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(() => {
              const goalInfo = getGoalInfo(goal);
              return (
                <div className={`p-4 border rounded-xl`}>
                  <p className={`text-sm ${goalInfo.color}`}>
                    <strong>{goalInfo.label} Mode:</strong> {goalInfo.desc}
                  </p>
                </div>
              );
            })()}

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Recommended Daily Protein</span>
              <div className={`${getResultTextSize(formatNumber(result.dailyProtein))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.dailyProtein)}g</div>
              <span className="text-muted-foreground">per day</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Minimum</span>
                <div className={`${getResultTextSize(formatNumber(result.minProtein))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.minProtein)}g</div>
                <span className="text-sm text-muted-foreground">per day</span>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Maximum</span>
                <div className={`${getResultTextSize(formatNumber(result.maxProtein))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.maxProtein)}g</div>
                <span className="text-sm text-muted-foreground">per day</span>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Per Meal</span>
                <div className={`${getResultTextSize(formatNumber(result.perMeal))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.perMeal)}g</div>
                <span className="text-sm text-muted-foreground">avg (4 meals)</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Meal Distribution</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Breakfast</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.breakfast)}g</span>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Lunch</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.lunch)}g</span>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Dinner</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.dinner)}g</span>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Snacks</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.snacks)}g</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-2">Protein-Rich Food Sources</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-blue-700">
                <span>Chicken breast: 31g/100g</span>
                <span>Salmon: 20g/100g</span>
                <span>Eggs: 6g/egg</span>
                <span>Greek yogurt: 10g/100g</span>
                <span>Lean beef: 26g/100g</span>
                <span>Tofu: 8g/100g</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </ToolLayout>
  );
}

function UnitToggle({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${value === opt.value ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
