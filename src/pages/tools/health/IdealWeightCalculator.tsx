import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateIdealWeight, IdealWeightResult } from '@/lib/engines';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(30);
  const [result, setResult] = useState<IdealWeightResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const cmToDisplay = (val: number) => unit === 'metric' ? val : Math.round(val / 2.54 * 10) / 10;
  const cmFromDisplay = (val: number) => unit === 'metric' ? val : val * 2.54;
  const kgToDisplay = (val: number) => unit === 'metric' ? Math.round(val * 10) / 10 : Math.round(val * 2.20462 * 10) / 10;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (heightCm <= 0 || heightCm > 300) newErrors.height = 'Height must be between 1 and 300 cm';
    if (age <= 0 || age > 120) newErrors.age = 'Age must be between 1 and 120';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateIdealWeight(gender, heightCm, age);
    setResult(res);
  };

  const getFormulaDescription = (formula: string) => {
    switch (formula) {
      case 'Devine':
        return 'Developed in 1974 for medical use to calculate drug dosages';
      case 'Robinson':
        return 'Updated formula from 1983, commonly used in clinical settings';
      case 'Miller':
        return 'Formula from 1983, often used for general health assessments';
      default:
        return '';
    }
  };

  const unitLabel = unit === 'metric' ? 'kg' : 'lb';
  const heightLabel = unit === 'metric' ? 'cm' : 'in';

  return (
    <ToolLayout toolId="ideal-weight" category="health">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Find Your Ideal Weight</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="ideal-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="ideal-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="ideal-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({heightLabel})</label>
              <input
                id="ideal-height"
                type="number"
                min="1"
                max="300"
                step="0.1"
                value={cmToDisplay(heightCm)}
                onChange={(e) => {
                  setHeightCm(validateNumberInput(cmFromDisplay(Number(e.target.value)), { min: 1, max: 300 }));
                  setErrors(prev => { const n = { ...prev }; delete n.height; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="ideal-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="ideal-age"
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
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Ideal Weight
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Recommended Ideal Weight Range</span>
              <div className={`${getResultTextSize(kgToDisplay(result.rangeMin) + ' - ' + kgToDisplay(result.rangeMax))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>
                {kgToDisplay(result.rangeMin)} - {kgToDisplay(result.rangeMax)}
                <span className="text-lg font-normal text-muted-foreground ml-2">{unitLabel}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Devine Formula</span>
                <div className={`${getResultTextSize(kgToDisplay(result.devine))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{kgToDisplay(result.devine)}</div>
                <span className="text-sm text-muted-foreground">{unitLabel}</span>
                <p className="text-xs text-muted-foreground mt-2">{getFormulaDescription('Devine')}</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Robinson Formula</span>
                <div className={`${getResultTextSize(kgToDisplay(result.robinson))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{kgToDisplay(result.robinson)}</div>
                <span className="text-sm text-muted-foreground">{unitLabel}</span>
                <p className="text-xs text-muted-foreground mt-2">{getFormulaDescription('Robinson')}</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Miller Formula</span>
                <div className={`${getResultTextSize(kgToDisplay(result.miller))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{kgToDisplay(result.miller)}</div>
                <span className="text-sm text-muted-foreground">{unitLabel}</span>
                <p className="text-xs text-muted-foreground mt-2">{getFormulaDescription('Miller')}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Healthy BMI Range</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 rounded-lg gap-2">
                  <span className="text-sm font-medium">BMI Range</span>
                  <span className="font-bold">18.5 - 24.9</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 rounded-lg gap-2">
                  <span className="text-sm font-medium">At BMI 18.5</span>
                  <span className="font-mono">{kgToDisplay(result.bmiLow)} {unitLabel}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 rounded-lg gap-2">
                  <span className="text-sm font-medium">At BMI 24.9</span>
                  <span className="font-mono">{kgToDisplay(result.bmiHigh)} {unitLabel}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-3">Understanding Ideal Weight Formulas</h3>
              <p className="text-sm text-blue-700 mb-4">
                These formulas provide estimates based on height and gender. The average of all three formulas gives you a balanced recommendation.
              </p>
              <div className="text-sm text-blue-700">
                <p><strong>Note:</strong> These are general guidelines. Your ideal weight depends on factors like muscle mass, bone density, and overall health. Consult a healthcare provider for personalized advice.</p>
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
