import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateBMR, BMRResult } from '@/lib/engines';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function BMRCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [result, setResult] = useState<BMRResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');

  const weightDisplay = weightUnit === 'kg' ? weightKg : Math.round(weightKg * 2.20462 * 10) / 10;
  const heightDisplay = heightUnit === 'cm' ? heightCm : Math.round(heightCm / 2.54 * 10) / 10;

  const handleWeightChange = (val: number) => {
    if (weightUnit === 'kg') setWeightKg(val);
    else setWeightKg(val / 2.20462);
  };

  const handleHeightChange = (val: number) => {
    if (heightUnit === 'cm') setHeightCm(val);
    else setHeightCm(val * 2.54);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (age <= 0 || age > 120) newErrors.age = 'Age must be between 1 and 120';
    if (weightKg <= 0 || weightKg > 500) newErrors.weight = 'Weight must be between 1 and 500 kg';
    if (heightCm <= 0 || heightCm > 300) newErrors.height = 'Height must be between 1 and 300 cm';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateBMR(weightKg, heightCm, age, gender, activityLevel);
    setResult(res);
  };

  const getActivityLabel = (level: number) => {
    const labels: Record<number, string> = {
      1.2: 'Sedentary',
      1.375: 'Lightly Active',
      1.55: 'Moderately Active',
      1.725: 'Very Active',
      1.9: 'Extra Active',
    };
    return labels[level] || 'Moderately Active';
  };

  return (
    <ToolLayout toolId="bmr" category="health">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Your BMR</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="bmr-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="bmr-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="bmr-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="bmr-age"
                type="number"
                min="1"
                max="120"
                step="1"
                value={age}
                onChange={(e) => {
                  setAge(validateNumberInput(Number(e.target.value), { min: 1, max: 120 }));
                  setErrors(prev => { const n = { ...prev }; delete n.age; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.age ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.age && <p className="text-xs text-rose-500">{errors.age}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="bmr-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({heightUnit === 'cm' ? 'cm' : 'in'})</label>
              <div className="flex gap-2">
                <input
                  id="bmr-height"
                  type="number"
                  min="1"
                  max="300"
                  step="0.1"
                  value={heightDisplay}
                  onChange={(e) => {
                    handleHeightChange(validateNumberInput(Number(e.target.value), { min: 1, max: 300 }));
                    setErrors(prev => { const n = { ...prev }; delete n.height; return n; });
                  }}
                  className={`flex-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
                />
                <UnitToggle
                  value={heightUnit}
                  onChange={(v) => setHeightUnit(v as 'cm' | 'in')}
                  options={[{ label: 'cm', value: 'cm' }, { label: 'in', value: 'in' }]}
                />
              </div>
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="bmr-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight ({weightUnit})</label>
              <div className="flex gap-2">
                <input
                  id="bmr-weight"
                  type="number"
                  min="1"
                  max="500"
                  step="0.1"
                  value={weightDisplay}
                  onChange={(e) => {
                    handleWeightChange(validateNumberInput(Number(e.target.value), { min: 1, max: 500 }));
                    setErrors(prev => { const n = { ...prev }; delete n.weight; return n; });
                  }}
                  className={`flex-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
                />
                <UnitToggle
                  value={weightUnit}
                  onChange={(v) => setWeightUnit(v as 'kg' | 'lb')}
                  options={[{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }]}
                />
              </div>
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="bmr-activity" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity Level</label>
              <select
                id="bmr-activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value={1.2}>Sedentary (Little or no exercise)</option>
                <option value={1.375}>Lightly Active (1-3 days/week)</option>
                <option value={1.55}>Moderately Active (3-5 days/week)</option>
                <option value={1.725}>Very Active (6-7 days/week)</option>
                <option value={1.9}>Extra Active (Hard exercise/physical job)</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate BMR
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Your Basal Metabolic Rate</span>
              <div className={`${getResultTextSize(formatNumber(Math.round(result.bmr)))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(Math.round(result.bmr))} kcal/day</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Maintain Weight</span>
                <div className={`${getResultTextSize(formatNumber(Math.round(result.maintenanceCalories)))} font-mono font-bold text-blue-700 tabular-nums leading-tight tracking-tight`}>{formatNumber(Math.round(result.maintenanceCalories))}</div>
                <span className="text-sm text-blue-500">kcal/day</span>
              </div>
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">Weight Loss</span>
                <div className={`${getResultTextSize(formatNumber(Math.round(result.weightLossCalories)))} font-mono font-bold text-green-700 tabular-nums leading-tight tracking-tight`}>{formatNumber(Math.round(result.weightLossCalories))}</div>
                <span className="text-sm text-green-500">kcal/day (-500)</span>
              </div>
              <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl text-center">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-2">Weight Gain</span>
                <div className={`${getResultTextSize(formatNumber(Math.round(result.weightGainCalories)))} font-mono font-bold text-orange-700 tabular-nums leading-tight tracking-tight`}>{formatNumber(Math.round(result.weightGainCalories))}</div>
                <span className="text-sm text-orange-500">kcal/day (+500)</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">What This Means For You</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Your BMR of <strong className="text-foreground">{formatNumber(Math.round(result.bmr))} calories</strong> is the number of calories your body burns at complete rest.
                  With your activity level of <strong className="text-foreground">{getActivityLabel(activityLevel)}</strong>,
                  your body burns approximately <strong className="text-foreground">{formatNumber(Math.round(result.maintenanceCalories))} calories</strong> per day.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">To Lose Weight</h4>
                    <p>Consume {formatNumber(Math.round(result.weightLossCalories))} calories daily to lose about 1 lb per week through diet alone.</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-700 mb-2">To Gain Weight</h4>
                    <p>Consume {formatNumber(Math.round(result.weightGainCalories))} calories daily to gain about 1 lb per week through diet alone.</p>
                  </div>
                </div>
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
