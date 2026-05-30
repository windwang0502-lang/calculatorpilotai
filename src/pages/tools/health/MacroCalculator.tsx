import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface MacroResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function MacroCalculator() {
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('maintain');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(30);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<MacroResult | null>(null);
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
    let tdee = bmr * activityLevel;

    if (goal === 'lose') tdee *= 0.8;
    else if (goal === 'gain') tdee *= 1.15;

    const protein = weightKg * 2.0;
    const fat = (tdee * 0.25) / 9;
    const carbs = (tdee - (protein * 4) - (fat * 9)) / 4;

    setResult({
      calories: Math.round(tdee),
      protein: Math.round(protein),
      carbs: Math.round(Math.max(carbs, 50)),
      fat: Math.round(fat),
    });
  };

  const faqs = [
    {
      question: 'What are macros and why do they matter?',
      answer: 'Macros (macronutrients) are the three main nutrients your body needs in large amounts: protein, carbohydrates, and fat. Each serves specific functions—protein builds and repairs muscle, carbs provide energy, and fat supports hormone production and nutrient absorption. Balancing them correctly helps you reach fitness goals.'
    },
    {
      question: 'How are macros calculated?',
      answer: 'This calculator uses evidence-based ratios: protein at 2g per kg bodyweight (optimal for muscle preservation), fat at 25% of calories (for hormonal health), and carbs filling remaining calories. These ratios adjust based on your goal (maintain, lose, or gain).'
    },
    {
      question: 'What are the ideal macro ratios?',
      answer: 'There\'s no one-size-fits-all answer. For general health: 20-30% protein, 40-50% carbs, 25-35% fat. For muscle gain: 25-30% protein, 40-50% carbs, 20-30% fat. For fat loss: 30-40% protein, 30-40% carbs, 25-35% fat. Individual needs vary based on training and metabolism.'
    },
    {
      question: 'Should I count macros or just calories?',
      answer: 'Both matter, but macros provide more actionable guidance. Counting calories tells you how much to eat. Tracking macros tells you what to eat. For most people, prioritizing protein intake while hitting calorie targets produces better results than calorie counting alone.'
    },
    {
      question: 'How do I track macros?',
      answer: 'Use a food scale and app like MyFitnessPal, Cronometer, or MacroFactor. Weigh food raw when possible for accuracy. Start by tracking for 2-3 weeks to understand portion sizes. Many people find that the act of tracking naturally improves dietary choices.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Macro Calculator',
        description: 'Calculate your optimal macronutrient breakdown for fitness goals.',
        url: 'https://www.calculatorpilotai.com/tools/health/macro-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Macro Calculator', item: 'https://www.calculatorpilotai.com/tools/health/macro-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Calculate your daily calorie needs' },
    { name: 'BMR Calculator', path: '/tools/health/bmr-calculator', desc: 'Calculate your basal metabolic rate' },
    { name: 'Protein Calculator', path: '/tools/health/protein-calculator', desc: 'Calculate your protein needs' },
  ];

  const activityLevels = [
    { value: 1.2, label: 'Sedentary', desc: 'Little or no exercise' },
    { value: 1.375, label: 'Light', desc: '1-3 days/week' },
    { value: 1.55, label: 'Moderate', desc: '3-5 days/week' },
    { value: 1.725, label: 'Active', desc: '6-7 days/week' },
    { value: 1.9, label: 'Very Active', desc: 'Twice daily' },
  ];

  return (
    <ToolLayout toolId="macro" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Your Macros</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="macro-goal" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Goal</label>
              <select
                id="macro-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as 'maintain' | 'lose' | 'gain')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="maintain">Maintain Weight</option>
                <option value="lose">Lose Weight</option>
                <option value="gain">Build Muscle</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="macro-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="macro-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="macro-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
              <input
                id="macro-weight"
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
              <label htmlFor="macro-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({unit === 'metric' ? 'cm' : 'in'})</label>
              <input
                id="macro-height"
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
              <label htmlFor="macro-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="macro-age"
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
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="macro-activity" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity Level</label>
              <select
                id="macro-activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                {activityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label} ({level.desc})</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Macros
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Daily Calories</span>
              <div className={`${getResultTextSize(formatNumber(result.calories))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.calories)}</div>
              <span className="text-sm text-muted-foreground">kcal per day</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Protein</span>
                <div className="text-2xl font-mono font-bold text-blue-600">{formatNumber(result.protein)}g</div>
                <span className="text-sm text-muted-foreground">{Math.round((result.protein * 4 / result.calories) * 100)}% of calories</span>
              </div>
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">Carbs</span>
                <div className="text-2xl font-mono font-bold text-green-600">{formatNumber(result.carbs)}g</div>
                <span className="text-sm text-muted-foreground">{Math.round((result.carbs * 4 / result.calories) * 100)}% of calories</span>
              </div>
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest block mb-2">Fat</span>
                <div className="text-2xl font-mono font-bold text-yellow-600">{formatNumber(result.fat)}g</div>
                <span className="text-sm text-muted-foreground">{Math.round((result.fat * 9 / result.calories) * 100)}% of calories</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Macro Distribution</h3>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: `${Math.round((result.protein * 4 / result.calories) * 100)}%` }} />
                <div className="bg-green-500 h-full" style={{ width: `${Math.round((result.carbs * 4 / result.calories) * 100)}%` }} />
                <div className="bg-yellow-500 h-full" style={{ width: `${Math.round((result.fat * 9 / result.calories) * 100)}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded mr-1"></span> Protein</span>
                <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded mr-1"></span> Carbs</span>
                <span className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded mr-1"></span> Fat</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Macros</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What Are Macronutrients?</h3>
              <p className="text-slate-700 leading-relaxed">
                Macronutrients are nutrients your body needs in large amounts. Protein provides 4 calories per gram and is essential for muscle building and repair. Carbohydrates provide 4 calories per gram and are your body's primary energy source. Fat provides 9 calories per gram and is crucial for hormone production and nutrient absorption.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Macro Calculator Formula</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Step 1:</strong> Calculate BMR using Mifflin-St Jeor equation</li>
                <li><strong>Step 2:</strong> Multiply by activity factor to get TDEE</li>
                <li><strong>Step 3:</strong> Adjust based on goal (+15% gain, -20% lose)</li>
                <li><strong>Step 4:</strong> Allocate macros: 2g protein/kg, 25% fat, rest carbs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Adjusting for Your Goals</h3>
              <p className="text-slate-700 leading-relaxed">
                These are starting points, not absolute rules. Track your progress for 2-4 weeks and adjust. If you're losing weight too fast, add calories. If you're not gaining muscle, increase protein. The best macro split is the one you can stick to consistently.
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
