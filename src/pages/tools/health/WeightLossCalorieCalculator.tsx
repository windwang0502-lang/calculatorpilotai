import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface WeightLossResult {
  conservative: number;
  moderate: number;
  aggressive: number;
  weeklyLoss: number;
  protein: number;
}

export default function WeightLossCalorieCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState(85);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(30);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<WeightLossResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weightDisplay = unit === 'metric' ? weightKg : Math.round(weightKg * 2.20462 * 10) / 10;
  const heightDisplay = unit === 'metric' ? heightCm : Math.round(heightCm / 2.54 * 10) / 10;
  const weightFromDisplay = (val: number) => unit === 'metric' ? val : val / 2.20462;
  const heightFromDisplay = (val: number) => unit === 'metric' ? val : val * 2.54;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (weightKg <= 0 || weightKg > 500) newErrors.weight = 'Weight must be between 1 and 500 kg';
    if (heightCm <= 0 || heightCm > 300) newErrors.height = 'Height must be between 1 and 300 cm';
    if (age < 18 || age > 100) newErrors.age = 'Age must be between 18 and 100';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBMR = () => {
    if (gender === 'male') {
      return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const bmr = calculateBMR();
    const tdee = bmr * activityLevel;

    const protein = weightKg * 2.0;

    setResult({
      conservative: Math.round(tdee * 0.85),
      moderate: Math.round(tdee * 0.75),
      aggressive: Math.round(tdee * 0.65),
      weeklyLoss: Math.round((tdee * 0.25) / 3500 * 10) / 10,
      protein: Math.round(protein),
    });
  };

  const faqs = [
    {
      question: 'How many calories should I cut for weight loss?',
      answer: 'A 500 calorie daily deficit creates approximately 1 pound (0.45 kg) of weight loss per week—this is a moderate deficit. Conservative deficit: 15% below maintenance (0.5 lb/week). Aggressive deficit: 35% below maintenance (2 lb/week). Faster rates are harder to sustain and may cause muscle loss.'
    },
    {
      question: 'Why is protein intake important during weight loss?',
      answer: 'High protein intake (1.6-2.2g per kg bodyweight) during caloric restriction helps preserve lean muscle mass, maintains metabolic rate, and keeps you feeling fuller longer. Without adequate protein, you risk losing muscle along with fat, which slows metabolism and worsens body composition.'
    },
    {
      question: 'Is it safe to lose weight quickly?',
      answer: 'Rapid weight loss (>2 lbs/week) can be safe short-term but increases risk of muscle loss, nutrient deficiencies, gallstones, and metabolic adaptation. A moderate pace of 1-2 lbs/week is more sustainable and preserves more muscle mass. Very low-calorie diets (<1200 cal/day) should be medically supervised.'
    },
    {
      question: 'How do I know which deficit level to use?',
      answer: 'Choose conservative (15%) if you\'re new to dieting, have a lot of weight to lose, or want to preserve maximum muscle. Choose moderate (25%) for steady, sustainable progress. Choose aggressive (35%) only if you\'re experienced, already lean, or need faster results for a specific event.'
    },
    {
      question: 'When should I increase my deficit?',
      answer: 'If weight loss stalls for 2+ weeks despite staying consistent, try a small deficit increase (100-150 cal). Also consider adding cardio or NEAT (non-exercise activity) to increase expenditure rather than further restricting calories, which can cause metabolic slowdown.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Weight Loss Calorie Calculator',
        description: 'Calculate optimal calories for sustainable fat loss with muscle preservation.',
        url: 'https://www.calculatorpilotai.com/tools/health/weight-loss-calorie-calculator',
        applicationCategory: 'HealthApplication',
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
          { '@type': 'ListItem', position: 2, name: 'Health', item: 'https://www.calculatorpilotai.com/tools/health' },
          { '@type': 'ListItem', position: 3, name: 'Weight Loss Calorie Calculator', item: 'https://www.calculatorpilotai.com/tools/health/weight-loss-calorie-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Maintenance Calculator', path: '/tools/health/maintenance-calorie-calculator', desc: 'Find your maintenance calories' },
    { name: 'Macro Calculator', path: '/tools/health/macro-calculator', desc: 'Calculate your macros for weight loss' },
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Calculate your daily calorie needs' },
  ];

  const activityLevels = [
    { value: 1.2, label: 'Sedentary' },
    { value: 1.375, label: 'Light' },
    { value: 1.55, label: 'Moderate' },
    { value: 1.725, label: 'Active' },
    { value: 1.9, label: 'Very Active' },
  ];

  return (
    <ToolLayout toolId="weight-loss-calorie" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Weight Loss Calories</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="wlc-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="wlc-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="wlc-activity" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity Level</label>
              <select
                id="wlc-activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                {activityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="wlc-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
              <input
                id="wlc-weight"
                type="number"
                min="1"
                max="500"
                step="0.1"
                value={weightDisplay}
                onChange={(e) => {
                  setWeightKg(validateNumberInput(weightFromDisplay(Number(e.target.value)), { min: 1, max: 500 }));
                  setErrors(prev => { const n = { ...prev }; delete n.weight; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="wlc-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({unit === 'metric' ? 'cm' : 'in'})</label>
              <input
                id="wlc-height"
                type="number"
                min="1"
                max="300"
                step="0.1"
                value={heightDisplay}
                onChange={(e) => {
                  setHeightCm(validateNumberInput(heightFromDisplay(Number(e.target.value)), { min: 1, max: 300 }));
                  setErrors(prev => { const n = { ...prev }; delete n.height; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="wlc-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="wlc-age"
                type="number"
                min="18"
                max="100"
                value={age}
                onChange={(e) => {
                  setAge(validateNumberInput(Number(e.target.value), { min: 18, max: 100 }));
                  setErrors(prev => { const n = { ...prev }; delete n.age; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.age ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.age && <p className="text-xs text-rose-500">{errors.age}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Weight Loss Calories
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">Recommended Daily Calories</span>
              <div className={`${getResultTextSize(formatNumber(result.moderate))} font-mono font-bold tabular-nums leading-tight tracking-tight text-green-600`}>{formatNumber(result.moderate)}</div>
              <span className="text-sm text-muted-foreground">kcal/day for steady weight loss</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Conservative</span>
                <div className="text-2xl font-mono font-bold text-blue-600">{formatNumber(result.conservative)}</div>
                <span className="text-sm text-muted-foreground">kcal/day</span>
                <div className="mt-2 text-xs text-blue-600">~0.5 lb/week loss</div>
              </div>
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">Moderate</span>
                <div className="text-2xl font-mono font-bold text-green-600">{formatNumber(result.moderate)}</div>
                <span className="text-sm text-muted-foreground">kcal/day</span>
                <div className="mt-2 text-xs text-green-600">~1 lb/week loss</div>
              </div>
              <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl text-center">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-2">Aggressive</span>
                <div className="text-2xl font-mono font-bold text-orange-600">{formatNumber(result.aggressive)}</div>
                <span className="text-sm text-muted-foreground">kcal/day</span>
                <div className="mt-2 text-xs text-orange-600">~2 lb/week loss</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Protein Target</span>
                <div className="text-2xl font-mono font-bold">{formatNumber(result.protein)}g</div>
                <span className="text-sm text-muted-foreground">per day (2g/kg)</span>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Weekly Loss</span>
                <div className="text-2xl font-mono font-bold">{result.weeklyLoss} lb</div>
                <span className="text-sm text-muted-foreground">at moderate deficit</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Deficit Guide</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-blue-600 font-medium">Conservative (15%)</span><span>Best for beginners, preserves muscle</span></div>
                <div className="flex justify-between"><span className="text-green-600 font-medium">Moderate (25%)</span><span>Sustainable, ~1 lb/week loss</span></div>
                <div className="flex justify-between"><span className="text-orange-600 font-medium">Aggressive (35%)</span><span>For experienced dieters, faster results</span></div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Weight Loss Calories</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">How Deficit Works</h3>
              <p className="text-slate-700 leading-relaxed">
                Weight loss requires a caloric deficit—eating fewer calories than you burn. A 3,500 calorie deficit equals approximately 1 pound of fat loss. By creating a 500 calorie daily deficit, you can lose about 1 pound per week. This is a safe, sustainable rate that minimizes muscle loss.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Protein During Weight Loss</h3>
              <p className="text-slate-700 leading-relaxed">
                During caloric restriction, your body can break down muscle for energy if protein intake is insufficient. Consuming 1.6-2.2g of protein per kg bodyweight helps preserve lean mass, maintain metabolic rate, and achieve better body composition. This calculator recommends 2g/kg as a target.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Choosing Your Deficit</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Conservative:</strong> Slower but easier to sustain long-term</li>
                <li><strong>Moderate:</strong> Good balance of speed and sustainability</li>
                <li><strong>Aggressive:</strong> Faster results but harder to maintain, higher muscle loss risk</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
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
      </section>

      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Health Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

function UnitToggle({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${value === opt.value ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-800'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
