import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface WeightGainResult {
  conservative: number;
  moderate: number;
  aggressive: number;
  weeklyGain: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function WeightGainCalorieCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState(65);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(25);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<WeightGainResult | null>(null);
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
    const conservative = Math.round(tdee * 1.1);
    const moderate = Math.round(tdee * 1.15);
    const aggressive = Math.round(tdee * 1.2);

    const proteinCals = protein * 4;
    const fatCals = moderate * 0.25;
    const carbsCals = moderate - proteinCals - fatCals;

    setResult({
      conservative,
      moderate,
      aggressive,
      weeklyGain: Math.round((moderate - tdee) / 3500 * 10) / 10,
      protein: Math.round(protein),
      carbs: Math.round(carbsCals / 4),
      fat: Math.round(fatCals / 9),
    });
  };

  const faqs = [
    {
      question: 'How many calories do I need to gain weight?',
      answer: 'A surplus of 250-500 calories above maintenance promotes weight gain. A smaller surplus (10%) is recommended for lean bulking with minimal fat gain. Larger surpluses (15-20%) can speed muscle gain but increase fat storage. The ideal depends on your body type and goals.'
    },
    {
      question: 'What should I eat to gain weight healthily?',
      answer: 'Focus on nutrient-dense foods, not junk food. Prioritize protein (1.6-2.2g/kg), complex carbs (whole grains, oats, rice), healthy fats (nuts, olive oil), and adequate vegetables. Eat multiple meals throughout the day if you struggle with large portions. Consider shakes if whole foods are hard to consume.'
    },
    {
      question: 'How fast can I gain muscle?',
      answer: 'Beginners can gain 1-2 lbs of muscle per month. Intermediate lifters: 0.5-1 lb/month. Advanced: 0.25-0.5 lb/month. These rates assume adequate protein, progressive training, and sufficient sleep. Gaining more muscle requires gear or years of training experience.'
    },
    {
      question: 'Should I bulk or cut first?',
      answer: 'If you\'re new to training and have significant body fat (>20% men, >30% women), consider a cut first to establish good eating habits at a lower weight. If you\'re lean and new to lifting, you can start a lean bulk. Most people benefit from alternating bulk and cut cycles (bulk 3-6 months, cut 2-4 months).'
    },
    {
      question: 'Why am I not gaining weight despite eating more?',
      answer: 'Track calories accurately—most people underestimate. Eat consistently, not just on training days. Ensure adequate sleep (7-9 hours) for recovery. Progressive overload in training is essential—if you\'re not getting stronger, you won\'t gain much muscle. Consider metabolic adaptation if you\'ve been dieting.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Weight Gain Calorie Calculator',
        description: 'Calculate optimal calories for healthy muscle building and weight gain.',
        url: 'https://www.calculatorpilotai.com/tools/health/weight-gain-calorie-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Weight Gain Calorie Calculator', item: 'https://www.calculatorpilotai.com/tools/health/weight-gain-calorie-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Maintenance Calculator', path: '/tools/health/maintenance-calorie-calculator', desc: 'Find your maintenance calories' },
    { name: 'Macro Calculator', path: '/tools/health/macro-calculator', desc: 'Calculate your macros for muscle gain' },
    { name: 'One Rep Max', path: '/tools/health/one-rep-max-calculator', desc: 'Calculate your lifting strength' },
  ];

  const activityLevels = [
    { value: 1.2, label: 'Sedentary' },
    { value: 1.375, label: 'Light' },
    { value: 1.55, label: 'Moderate' },
    { value: 1.725, label: 'Active' },
    { value: 1.9, label: 'Very Active' },
  ];

  return (
    <ToolLayout toolId="weight-gain-calorie" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Weight Gain Calories</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="wgc-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="wgc-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="wgc-activity" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity Level</label>
              <select
                id="wgc-activity"
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
              <label htmlFor="wgc-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
              <input
                id="wgc-weight"
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
              <label htmlFor="wgc-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({unit === 'metric' ? 'cm' : 'in'})</label>
              <input
                id="wgc-height"
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
              <label htmlFor="wgc-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="wgc-age"
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
            Calculate Weight Gain Calories
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Recommended Daily Calories</span>
              <div className={`${getResultTextSize(formatNumber(result.moderate))} font-mono font-bold tabular-nums leading-tight tracking-tight text-blue-600`}>{formatNumber(result.moderate)}</div>
              <span className="text-sm text-muted-foreground">kcal/day for lean muscle gain</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">Lean Bulk</span>
                <div className="text-2xl font-mono font-bold text-green-600">{formatNumber(result.conservative)}</div>
                <span className="text-sm text-muted-foreground">kcal/day</span>
                <div className="mt-2 text-xs text-green-600">+10% surplus</div>
              </div>
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Moderate</span>
                <div className="text-2xl font-mono font-bold text-blue-600">{formatNumber(result.moderate)}</div>
                <span className="text-sm text-muted-foreground">kcal/day</span>
                <div className="mt-2 text-xs text-blue-600">+15% surplus</div>
              </div>
              <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl text-center">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block mb-2">Heavy Bulk</span>
                <div className="text-2xl font-mono font-bold text-purple-600">{formatNumber(result.aggressive)}</div>
                <span className="text-sm text-muted-foreground">kcal/day</span>
                <div className="mt-2 text-xs text-purple-600">+20% surplus</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Recommended Macros</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-blue-600">{formatNumber(result.protein)}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-green-600">{formatNumber(result.carbs)}g</div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-yellow-600">{formatNumber(result.fat)}g</div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">Surplus Guide</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-green-600 font-medium">Lean Bulk (10%)</span><span>Minimal fat gain, slower muscle growth</span></div>
                <div className="flex justify-between"><span className="text-blue-600 font-medium">Moderate (15%)</span><span>Balanced approach for most people</span></div>
                <div className="flex justify-between"><span className="text-purple-600 font-medium">Heavy Bulk (20%)</span><span>Faster gains, more fat storage</span></div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Weight Gain Calories</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">The Caloric Surplus</h3>
              <p className="text-slate-700 leading-relaxed">
                Building muscle requires a caloric surplus—eating more than you burn. This provides the energy and building blocks for muscle growth. However, larger surpluses don't mean faster muscle gain and simply add more fat. A modest surplus of 10-20% above maintenance balances muscle growth with minimal fat gain.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Protein for Muscle Growth</h3>
              <p className="text-slate-700 leading-relaxed">
                During bulking, protein remains crucial for muscle synthesis. Aim for 1.6-2.2g per kg bodyweight. This calculator recommends 2g/kg as a target. Extra protein beyond this won't speed muscle growth but ensures you're not limiting gains with insufficient amino acids.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Quality Over Quantity</h3>
              <p className="text-slate-700 leading-relaxed">
                Don't just add calories with junk food. Focus on whole foods: lean proteins, complex carbs, healthy fats, and vegetables. This supports training recovery, hormonal health, and overall wellbeing while you build muscle.
              </p>
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
