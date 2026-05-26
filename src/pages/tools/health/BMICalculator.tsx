import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateBMI, BMIResult } from '@/lib/engines';
import { generateBMIInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';

export default function BMICalculator() {
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState(1.2);
  const [result, setResult] = useState<BMIResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');

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
    if (weightKg <= 0 || weightKg > 500) newErrors.weight = 'Weight must be between 1 and 500 kg';
    if (heightCm <= 0 || heightCm > 300) newErrors.height = 'Height must be between 1 and 300 cm';
    if (age <= 0 || age > 150) newErrors.age = 'Age must be between 1 and 150';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateBMI(weightKg, heightCm, age, gender, activityLevel);
    setResult(res);
    setInsight(generateBMIInsight(res.bmi, res.status));
  };

  return (
    <ToolLayout toolId="bmi" category="health">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">BMI & Calorie Calculator</h2>
            <div className="flex gap-2">
              <UnitToggle value={weightUnit} onChange={(v) => setWeightUnit(v as 'kg' | 'lb')} options={[
                { label: 'kg', value: 'kg' },
                { label: 'lb', value: 'lb' },
              ]} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight ({weightUnit})</label>
              <input type="number" value={weightDisplay} onChange={(e) => { handleWeightChange(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.weight; return n; }); }} className={`w-full p-3 border rounded outline-none focus:ring-2 focus:ring-primary ${errors.weight ? 'border-rose-500' : ''}`} />
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({heightUnit})</label>
                <UnitToggle value={heightUnit} onChange={(v) => setHeightUnit(v as 'cm' | 'ft')} options={[
                  { label: 'cm', value: 'cm' },
                  { label: 'in', value: 'ft' },
                ]} />
              </div>
              <input type="number" value={heightDisplay} onChange={(e) => { handleHeightChange(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }} className={`w-full p-3 border rounded outline-none focus:ring-2 focus:ring-primary ${errors.height ? 'border-rose-500' : ''}`} />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input type="number" value={age} onChange={(e) => { setAge(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.age; return n; }); }} className={`w-full p-3 border rounded outline-none focus:ring-2 focus:ring-primary ${errors.age ? 'border-rose-500' : ''}`} />
              {errors.age && <p className="text-xs text-rose-500">{errors.age}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')} className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-primary bg-white">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity Level</label>
              <select value={activityLevel} onChange={(e) => setActivityLevel(Number(e.target.value))} className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-primary bg-white">
                <option value={1.2}>Sedentary (Little or no exercise)</option>
                <option value={1.375}>Lightly active (1-3 days/week)</option>
                <option value={1.55}>Moderately active (3-5 days/week)</option>
                <option value={1.725}>Very active (6-7 days/week)</option>
                <option value={1.9}>Extra active (Hard exercise/physical job)</option>
              </select>
            </div>
          </div>
          <button onClick={handleCalculate} className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest">
            Analyze Health Metrics
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-slate-50 border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">BMI Score</span>
                <div className="text-3xl font-mono font-bold">{result.bmi.toFixed(1)}</div>
              </div>
              <div className="p-6 bg-slate-50 border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Category</span>
                <div className="text-2xl font-bold text-emerald-600">{result.status}</div>
              </div>
              <div className="p-6 bg-slate-50 border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Daily Calories</span>
                <div className="text-3xl font-mono font-bold">{Math.round(result.calories)} kcal</div>
              </div>
            </div>
            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}

function UnitToggle({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <div className="flex bg-slate-100 rounded overflow-hidden text-xs font-bold">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value as 'kg' | 'lb' | 'cm' | 'ft')}
          className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${value === opt.value ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
