import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, validateNumberInput } from '@/lib/utils';

interface CalorieBurnResult {
  calories: number;
  perMinute: number;
  fatCalories: number;
  carbCalories: number;
}

const activities = [
  { name: 'Running (6 mph)', met: 9.8, speed: '6 mph' },
  { name: 'Running (5 mph)', met: 8.3, speed: '5 mph' },
  { name: 'Jogging (4 mph)', met: 7.0, speed: '4 mph' },
  { name: 'Walking (3.5 mph)', met: 4.3, speed: '3.5 mph' },
  { name: 'Walking (2.5 mph)', met: 3.0, speed: '2.5 mph' },
  { name: 'Cycling (12-14 mph)', met: 8.0, speed: '12-14 mph' },
  { name: 'Cycling (16-19 mph)', met: 10.0, speed: '16-19 mph' },
  { name: 'Swimming (freestyle)', met: 7.0, speed: 'moderate' },
  { name: 'Jump Rope', met: 12.3, speed: 'fast' },
  { name: 'Rowing Machine', met: 8.0, speed: 'moderate' },
  { name: 'Elliptical Trainer', met: 5.0, speed: 'moderate' },
  { name: 'Stair Climbing', met: 8.8, speed: 'fast' },
  { name: 'Weight Training', met: 4.0, speed: 'moderate' },
  { name: 'HIIT Training', met: 11.0, speed: 'max effort' },
  { name: 'Yoga', met: 2.5, speed: 'light' },
  { name: 'Pilates', met: 3.8, speed: 'moderate' },
];

export default function CalorieBurnCalculator() {
  const [weightKg, setWeightKg] = useState(75);
  const [duration, setDuration] = useState(30);
  const [activityIndex, setActivityIndex] = useState(0);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<CalorieBurnResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weightDisplay = unit === 'metric' ? weightKg : Math.round(weightKg * 2.20462 * 10) / 10;
  const weightFromDisplay = (val: number) => unit === 'metric' ? val : val / 2.20462;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (weightKg <= 0 || weightKg > 500) newErrors.weight = 'Weight must be between 1 and 500 kg';
    if (duration <= 0 || duration > 600) newErrors.duration = 'Duration must be 1-600 minutes';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const met = activities[activityIndex].met;
    const calories = met * weightKg * (duration / 60);

    // At rest, ~60% from fat, 40% from carbs
    // At high intensity, ~35% from fat, 65% from carbs
    const intensityFactor = Math.min(met / 12, 1);
    const fatPercent = 0.6 - (intensityFactor * 0.25);
    const carbPercent = 0.4 + (intensityFactor * 0.25);

    setResult({
      calories: Math.round(calories),
      perMinute: Math.round(calories / duration),
      fatCalories: Math.round(calories * fatPercent),
      carbCalories: Math.round(calories * carbPercent),
    });
  };

  const faqs = [
    {
      question: 'How are calories burned calculated?',
      answer: 'This calculator uses MET (Metabolic Equivalent of Task) values. The formula is: Calories = MET × weight(kg) × duration(hours). MET values come from the Compendium of Physical Activities and represent the energy cost of various activities relative to resting metabolism.'
    },
    {
      question: 'What affects how many calories I burn?',
      answer: 'Several factors influence calorie burn: body weight (heavier people burn more), activity intensity (harder = more calories), duration, fitness level (fitter people burn fewer calories for same activity), age, gender, and environmental conditions like temperature and altitude.'
    },
    {
      question: 'Why do these estimates vary?',
      answer: "MET values are population averages and don't account for individual variations. Your actual calorie burn could be 15-30% higher or lower than calculated. Use these numbers as estimates, not precise measurements. For accuracy, use heart rate monitors or indirect calorimetry."
    },
    {
      question: "What's the difference between fat and carb calories?",
      answer: "Your body uses a mix of fat and carbohydrates for energy. Resting and low-intensity exercise primarily uses fat. High-intensity exercise relies more on carbs (glycogen). At maximum effort, you may use almost exclusively carbs. This is why both matter for body composition."
    },
    {
      question: 'Is exercise the best way to burn calories?',
      answer: 'NEAT (Non-Exercise Activity Thermogenesis)—daily movement like walking, standing, fidgeting—often burns more calories than structured exercise for most people. Focus on increasing NEAT first, then add exercise. Diet modification typically has a larger impact on weight loss than exercise alone.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Calorie Burn Calculator',
        description: 'Calculate calories burned during various exercises and activities.',
        url: 'https://www.calculatorpilotai.com/tools/health/calorie-burn-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Calorie Burn Calculator', item: 'https://www.calculatorpilotai.com/tools/health/calorie-burn-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Calculate your daily calorie needs' },
    { name: 'Target Heart Rate', path: '/tools/health/target-heart-rate-calculator', desc: 'Calculate your exercise zones' },
    { name: 'Running Pace Calculator', path: '/tools/health/running-pace-calculator', desc: 'Calculate your running pace' },
  ];

  return (
    <ToolLayout toolId="calorie-burn" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Calorie Burn</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="cb-activity" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity</label>
              <select
                id="cb-activity"
                value={activityIndex}
                onChange={(e) => setActivityIndex(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                {activities.map((act, i) => (
                  <option key={i} value={i}>{act.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="cb-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Body Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
              <input
                id="cb-weight"
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
              <label htmlFor="cb-duration" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Duration (minutes)</label>
              <input
                id="cb-duration"
                type="number"
                min="1"
                max="600"
                value={duration}
                onChange={(e) => {
                  setDuration(validateNumberInput(Number(e.target.value), { min: 1, max: 600 }));
                  setErrors(prev => { const n = { ...prev }; delete n.duration; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.duration ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.duration && <p className="text-xs text-rose-500">{errors.duration}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Calories Burned
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl text-center">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-2">Total Calories Burned</span>
              <div className="text-6xl font-mono font-bold text-orange-600">{formatNumber(result.calories)}</div>
              <span className="text-lg text-muted-foreground">calories</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Per Minute</span>
                <div className="text-2xl font-mono font-bold">{result.perMinute}</div>
                <span className="text-sm text-muted-foreground">cal/min</span>
              </div>
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">From Fat</span>
                <div className="text-2xl font-mono font-bold text-blue-600">{result.fatCalories}</div>
                <span className="text-sm text-muted-foreground">{Math.round(result.fatCalories / result.calories * 100)}%</span>
              </div>
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">From Carbs</span>
                <div className="text-2xl font-mono font-bold text-green-600">{result.carbCalories}</div>
                <span className="text-sm text-muted-foreground">{Math.round(result.carbCalories / result.calories * 100)}%</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Energy Source Distribution</h3>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: `${Math.round(result.fatCalories / result.calories * 100)}%` }} />
                <div className="bg-green-500 h-full" style={{ width: `${Math.round(result.carbCalories / result.calories * 100)}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded mr-1"></span> Fat</span>
                <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded mr-1"></span> Carbs</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Higher intensity = more carbs. Lower intensity = more fat. Both contribute to energy expenditure.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Calorie Burn</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What is MET?</h3>
              <p className="text-slate-700 leading-relaxed">
                MET (Metabolic Equivalent of Task) measures energy expenditure. 1 MET equals energy burned at rest. Walking at 3 mph = 3 METs, meaning you burn 3x more calories than resting. Running = 9-12 METs depending on speed. MET values are standardized from research and applied universally.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Fat vs. Carbs for Energy</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Low intensity:</strong> Primarily fat oxidation, limited glycogen use</li>
                <li><strong>Moderate intensity:</strong> Mixed fuel, ~50/50 fat and carbs</li>
                <li><strong>High intensity:</strong> Primarily carbs (glycogen), limited fat oxidation</li>
                <li>Fat loss doesn't require low-intensity exercise—total calorie balance matters most</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Maximizing Calorie Burn</h3>
              <p className="text-slate-700 leading-relaxed">
                For maximum calorie burn, focus on: 1) Activities that engage large muscle groups, 2) Higher intensity when possible, 3) Longer duration, 4) Consistency over intensity. Remember that NEAT—standing, walking, fidgeting—often burns more daily calories than structured exercise.
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
