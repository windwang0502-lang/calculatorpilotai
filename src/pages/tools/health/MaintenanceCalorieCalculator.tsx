import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface MaintenanceResult {
  bmr: number;
  sedentary: number;
  light: number;
  moderate: number;
  active: number;
  veryActive: number;
}

export default function MaintenanceCalorieCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(30);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<MaintenanceResult | null>(null);
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

    setResult({
      bmr: Math.round(bmr),
      sedentary: Math.round(bmr * 1.2),
      light: Math.round(bmr * 1.375),
      moderate: Math.round(bmr * 1.55),
      active: Math.round(bmr * 1.725),
      veryActive: Math.round(bmr * 1.9),
    });
  };

  const faqs = [
    {
      question: 'What is maintenance calories?',
      answer: 'Maintenance calories (Total Daily Energy Expenditure or TDEE) are the number of calories you need to maintain your current body weight. This includes your basal metabolic rate (calories burned at rest) plus all physical activity throughout the day.'
    },
    {
      question: 'How is BMR different from TDEE?',
      answer: 'BMR (Basal Metabolic Rate) is the calories your body burns just to maintain basic functions like breathing and circulation—essentially if you stayed in bed all day. TDEE includes BMR plus the calories burned through movement, exercise, and daily activities.'
    },
    {
      question: 'Why does activity level matter so much?',
      answer: 'Activity level accounts for 15-50% of total calorie expenditure depending on how active you are. A sedentary person might need 300-500 fewer calories than a moderately active person with the same stats. This is why accurately estimating activity level is crucial for calorie calculations.'
    },
    {
      question: 'How do I use this for weight management?',
      answer: 'To lose weight: eat 15-25% below maintenance. To gain weight: eat 10-20% above maintenance. For body recomposition (lose fat, gain muscle): eat at maintenance with high protein and strength training. Make adjustments every 2-4 weeks based on results.'
    },
    {
      question: 'How accurate are these estimates?',
      answer: 'These calculations are estimates with about 15-20% margin of error due to individual variations in metabolism, muscle mass, and NEAT (Non-Exercise Activity Thermogenesis). Use this as a starting point and adjust based on actual weight changes over 2-4 weeks.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Maintenance Calorie Calculator',
        description: 'Calculate your daily maintenance calories based on BMR and activity level.',
        url: 'https://www.calculatorpilotai.com/tools/health/maintenance-calorie-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Maintenance Calorie Calculator', item: 'https://www.calculatorpilotai.com/tools/health/maintenance-calorie-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Weight Loss Calculator', path: '/tools/health/weight-loss-calorie-calculator', desc: 'Calculate calories for fat loss' },
    { name: 'Weight Gain Calculator', path: '/tools/health/weight-gain-calorie-calculator', desc: 'Calculate calories for muscle gain' },
    { name: 'BMR Calculator', path: '/tools/health/bmr-calculator', desc: 'Calculate your basal metabolic rate' },
  ];

  const activityLevels = [
    { key: 'sedentary', label: 'Sedentary', desc: 'Little/no exercise, desk job', multiplier: 1.2 },
    { key: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week', multiplier: 1.375 },
    { key: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week', multiplier: 1.55 },
    { key: 'active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week', multiplier: 1.725 },
    { key: 'veryActive', label: 'Extremely Active', desc: 'Physical job + hard daily training', multiplier: 1.9 },
  ];

  return (
    <ToolLayout toolId="maintenance-calorie" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Maintenance Calories</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="mc-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="mc-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="mc-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="mc-age"
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
            <div className="space-y-2">
              <label htmlFor="mc-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
              <input
                id="mc-weight"
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
              <label htmlFor="mc-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({unit === 'metric' ? 'cm' : 'in'})</label>
              <input
                id="mc-height"
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
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Maintenance Calories
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Your Basal Metabolic Rate</span>
              <div className={`${getResultTextSize(formatNumber(result.bmr))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.bmr)}</div>
              <span className="text-sm text-muted-foreground">calories/day (at complete rest)</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Maintenance Calories by Activity Level</h3>
              <div className="space-y-3">
                {activityLevels.map((level, i) => (
                  <div key={level.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-bold">{level.label}</div>
                      <div className="text-sm text-muted-foreground">{level.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold">{formatNumber(result[level.key as keyof MaintenanceResult] as number)}</div>
                      <div className="text-xs text-muted-foreground">kcal/day</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2">How to Use This Information</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm">
                <li><strong>Weight Loss:</strong> Eat 20-25% below your maintenance</li>
                <li><strong>Weight Gain:</strong> Eat 10-20% above your maintenance</li>
                <li><strong>Recomposition:</strong> Eat at maintenance with high protein</li>
                <li>Track weight for 2-4 weeks and adjust as needed</li>
              </ul>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Maintenance Calories</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What is TDEE?</h3>
              <p className="text-slate-700 leading-relaxed">
                Total Daily Energy Expenditure (TDEE) is the total number of calories you burn in a day, including all activities. It's calculated by multiplying your Basal Metabolic Rate (BMR) by an activity multiplier. This is your maintenance level—where weight stays stable.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">The Mifflin-St Jeor Equation</h3>
              <p className="text-slate-700 leading-relaxed mb-3">This calculator uses the scientifically validated Mifflin-St Jeor equation:</p>
              <div className="bg-white p-4 rounded-lg font-mono text-sm">
                <p className="text-slate-600">Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5</p>
                <p className="text-slate-600">Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Activity Multipliers</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Sedentary (1.2):</strong> Desk job, minimal exercise</li>
                <li><strong>Light (1.375):</strong> Light exercise 1-3 days/week</li>
                <li><strong>Moderate (1.55):</strong> Moderate exercise 3-5 days/week</li>
                <li><strong>Active (1.725):</strong> Hard exercise 6-7 days/week</li>
                <li><strong>Very Active (1.9):</strong> Physical job + intense daily training</li>
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
