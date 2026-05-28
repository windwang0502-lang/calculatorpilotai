import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateWaterIntake, WaterIntakeResult } from '@/lib/engines';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(70);
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active' | 'very-active'>('moderate');
  const [climate, setClimate] = useState<'cool' | 'moderate' | 'hot'>('moderate');
  const [result, setResult] = useState<WaterIntakeResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weightDisplay = unit === 'kg' ? weight : Math.round(weight * 2.20462 * 10) / 10;

  const handleWeightChange = (val: number) => {
    if (unit === 'kg') setWeight(val);
    else setWeight(val / 2.20462);
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
    const res = calculateWaterIntake(weightInKg, activityLevel, climate);
    setResult(res);
  };

  const getActivityDescription = (level: typeof activityLevel) => {
    switch (level) {
      case 'sedentary':
        return 'Little or no exercise, desk job';
      case 'moderate':
        return 'Light exercise 1-3 days/week';
      case 'active':
        return 'Moderate exercise 3-5 days/week';
      case 'very-active':
        return 'Hard exercise 6-7 days/week';
    }
  };

  const getClimateDescription = (clim: typeof climate) => {
    switch (clim) {
      case 'cool':
        return 'Cold climate, minimal sweating';
      case 'moderate':
        return 'Temperate climate, normal sweating';
      case 'hot':
        return 'Hot climate, high sweating';
    }
  };

  return (
    <ToolLayout toolId="water-intake" category="health">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Daily Water Needs</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'kg' | 'lb')}
              options={[{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="water-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Body Weight ({unit})</label>
              <input
                id="water-weight"
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
              <label htmlFor="water-activity" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity Level</label>
              <select
                id="water-activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as typeof activityLevel)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="sedentary">Sedentary</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very-active">Very Active</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="water-climate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Climate</label>
              <select
                id="water-climate"
                value={climate}
                onChange={(e) => setClimate(e.target.value as typeof climate)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="cool">Cool</option>
                <option value="moderate">Moderate</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Water Intake
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Recommended Daily Water Intake</span>
              <div className={`${getResultTextSize(formatNumber(result.liters, { decimals: 1 }))} font-mono font-bold text-blue-700 tabular-nums leading-tight tracking-tight`}>{formatNumber(result.liters, { decimals: 1 })}L</div>
              <span className="text-blue-600">or {formatNumber(result.cups)} cups</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Liters Per Day</span>
                <div className={`${getResultTextSize(formatNumber(result.liters, { decimals: 1 }))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.liters, { decimals: 1 })} L</div>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cups Per Day (8oz)</span>
                <div className={`${getResultTextSize(formatNumber(result.cups))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.cups)} cups</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Your Calculation Factors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Activity Level</span>
                  <span className="font-semibold capitalize">{activityLevel.replace('-', ' ')}</span>
                  <p className="text-sm text-muted-foreground mt-1">{getActivityDescription(activityLevel)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Climate</span>
                  <span className="font-semibold capitalize">{climate}</span>
                  <p className="text-sm text-muted-foreground mt-1">{getClimateDescription(climate)}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-3">Workout Hydration Tips</h3>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <span className="font-bold">Pre-workout:</span>
                  <span>Drink {formatNumber(result.preWorkout, { decimals: 1 })}L ({formatNumber(result.preWorkoutCups)} cups) 2 hours before exercise</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <span className="font-bold">During workout:</span>
                  <span>Drink {formatNumber(result.duringWorkout, { decimals: 1 })}L ({formatNumber(result.duringWorkoutCups)} cups) every 15-20 minutes</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <span className="font-bold">Post-workout:</span>
                  <span>Drink {formatNumber(result.postWorkout, { decimals: 1 })}L ({formatNumber(result.postWorkoutCups)} cups) within 30 minutes after</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">How to Stay Hydrated</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-blue-500">1.</span> Carry a reusable water bottle throughout the day</li>
                <li className="flex gap-2"><span className="text-blue-500">2.</span> Set reminders on your phone every hour</li>
                <li className="flex gap-2"><span className="text-blue-500">3.</span> Drink a glass of water before each meal</li>
                <li className="flex gap-2"><span className="text-blue-500">4.</span> Eat water-rich foods like cucumbers, watermelon, and oranges</li>
                <li className="flex gap-2"><span className="text-blue-500">5.</span> Monitor urine color - pale yellow indicates good hydration</li>
              </ul>
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
