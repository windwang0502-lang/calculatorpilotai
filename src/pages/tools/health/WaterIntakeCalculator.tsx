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

  const faqs = [
    {
      question: 'How much water should I actually drink per day?',
      answer: 'The classic advice of 8 glasses (64 oz) per day is a reasonable starting point, but actual needs vary significantly. Your water needs depend on body weight, activity level, climate, and overall health. A more personalized approach uses body weight: aim for 30-35ml per kg of body weight. For example, a 70kg person needs about 2.1-2.5 liters daily.'
    },
    {
      question: 'Does water intake depend on my activity level?',
      answer: 'Absolutely. Active individuals lose more water through sweat and need proportionally more hydration. Light exercise may add 200-400ml to daily needs, while intense exercise or endurance sports can double or triple water requirements. Always hydrate before, during, and after exercise to maintain performance and prevent dehydration.'
    },
    {
      question: 'How does climate affect my water needs?',
      answer: 'Hot and humid climates increase water loss through perspiration. Living in hot regions or experiencing summer heat requires additional hydration. Similarly, high altitudes increase breathing rate and water loss through respiration. Cold climates can also mask dehydration since you may not feel as thirsty.'
    },
    {
      question: 'Can I get water from foods and other beverages?',
      answer: 'Yes, about 20% of daily water intake typically comes from food, especially fruits and vegetables. Other beverages like tea, coffee, and milk contribute to hydration. However, sugary drinks and alcohol can have diuretic effects. Water remains the best choice for maintaining optimal hydration.'
    },
    {
      question: 'How do I know if I\'m properly hydrated?',
      answer: 'The simplest indicator is urine color: pale yellow (like lemonade) suggests good hydration, while dark yellow (like apple juice) indicates dehydration. Thirst is actually a late indicator of dehydration. Other signs include energy levels, headaches, and mental clarity. Chronic mild dehydration can affect mood and cognitive function.'
    },
    {
      question: 'Can I drink too much water?',
      answer: 'While rare, overhydration (hyponatremia) can occur, especially during endurance events. This happens when sodium levels become diluted from drinking excessive water. Symptoms include nausea, confusion, and in severe cases, seizures. For most people, drinking when thirsty and monitoring urine color is sufficient to maintain healthy hydration.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Water Intake Calculator',
        description: 'Calculate your daily water needs based on body weight, activity level, and climate for optimal hydration.',
        url: 'https://www.calculatorpilotai.com/tools/health/water-intake-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Water Intake Calculator', item: 'https://www.calculatorpilotai.com/tools/health/water-intake-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Calculate your daily calorie needs' },
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', desc: 'Calculate your body mass index' },
    { name: 'Protein Calculator', path: '/tools/health/protein-calculator', desc: 'Calculate your daily protein needs' },
  ];

  return (
    <ToolLayout toolId="water-intake" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
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
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
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

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Water Intake Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Water Intake Calculator estimates your daily hydration needs based on body weight, activity level, and climate. Proper hydration supports digestion, nutrient absorption, temperature regulation, cognitive function, and joint health. This tool helps you understand how much water your body needs to function optimally.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator starts with a base recommendation (35ml per kg of body weight) and adjusts for your activity level and climate. More exercise and hotter climates increase water needs. It also provides workout hydration guidelines to help you maintain hydration during physical activity.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Base: Water = body weight(kg) × 35ml</strong></p>
                <p className="mb-2"><strong>Activity multiplier: Sedentary 1.0, Moderate 1.1, Active 1.2, Very Active 1.3</strong></p>
                <p className="mb-2"><strong>Climate multiplier: Cool 1.0, Moderate 1.1, Hot 1.2</strong></p>
                <p className="text-xs text-slate-500">Example: 70kg, moderate activity, moderate climate = 2,695ml (2.7L)</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Daily Intake:</strong> Total water to drink each day.</li>
                <li><strong>Liters/Cups:</strong> Both metric and common measurements.</li>
                <li><strong>Workout Hydration:</strong> Pre, during, and post-workout guidelines.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Waiting until thirsty:</strong> Thirst indicates you\'re already mildly dehydrated.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring exercise:</strong> You need extra water during and after workouts.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Monitor urine color</strong> as a simple hydration check throughout the day.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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

      {/* Related Tools */}
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
