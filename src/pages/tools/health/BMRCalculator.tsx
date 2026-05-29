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

  const faqs = [
    {
      question: 'What is BMR and why does it matter?',
      answer: 'BMR (Basal Metabolic Rate) is the number of calories your body needs to function at complete rest. It includes energy needed for vital functions like breathing, circulation, cell production, and brain function. BMR typically accounts for 60-75% of your total daily calorie needs. Knowing your BMR helps you set accurate calorie goals for weight management.'
    },
    {
      question: 'How is BMR calculated?',
      answer: 'BMR is calculated using the Mifflin-St Jeor equation, considered the most accurate formula for most people. For men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5. For women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161. This formula accounts for the metabolic differences between genders.'
    },
    {
      question: 'What factors affect BMR?',
      answer: 'Several factors influence your BMR: body composition (muscle burns more calories than fat), age (BMR decreases with age), gender (men typically have higher BMR), genetics, thyroid hormones, and pregnancy. Certain medications and medical conditions can also raise or lower BMR.'
    },
    {
      question: 'How is BMR different from TDEE?',
      answer: 'BMR is calories burned at complete rest, while TDEE (Total Daily Energy Expenditure) includes all daily activities. To estimate TDEE, multiply your BMR by an activity factor: sedentary (1.2), lightly active (1.375), moderately active (1.55), very active (1.725), or extra active (1.9). Your TDEE is what you should use for calorie planning.'
    },
    {
      question: 'Can I increase my BMR?',
      answer: 'While you cannot change factors like age and genetics, you can influence BMR through body composition. Building muscle through strength training can increase BMR because muscle tissue requires more calories to maintain than fat tissue. Some studies suggest high-intensity interval training and adequate protein intake may also boost metabolism.'
    },
    {
      question: 'Why do men and women have different BMR formulas?',
      answer: 'Men typically have higher BMR than women due to differences in body composition—men generally have more muscle mass and lower body fat percentage. On average, men\'s BMR is about 5-10% higher than women\'s when comparing similar weight and height. This is why the formula includes a +5 for men and -161 for women.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'BMR Calculator',
        description: 'Calculate your Basal Metabolic Rate (BMR) to understand how many calories your body burns at rest.',
        url: 'https://www.calculatorpilotai.com/tools/health/bmr-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'BMR Calculator', item: 'https://www.calculatorpilotai.com/tools/health/bmr-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', desc: 'Calculate your body mass index' },
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Calculate your daily calorie needs' },
    { name: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', desc: 'Estimate your body fat percentage' },
  ];

  return (
    <ToolLayout toolId="bmr" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
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
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
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

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the BMR Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The BMR Calculator determines how many calories your body burns at complete rest using the Mifflin-St Jeor equation. It then applies an activity multiplier to estimate your total daily calorie needs and provides targets for weight loss and weight gain. This tool is essential for anyone tracking nutrition or planning fitness goals.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator uses your gender, age, height, and weight to calculate your Basal Metabolic Rate. This represents the calories needed for vital functions when you\'re at complete rest. By multiplying BMR by your activity level, it estimates total daily energy expenditure. Adding 500 calories gives weight gain targets; subtracting 500 gives weight loss targets.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>BMR (Male) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5</strong></p>
                <p className="mb-2"><strong>BMR (Female) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161</strong></p>
                <p className="mb-2"><strong>TDEE = BMR × Activity Factor</strong></p>
                <p className="text-xs text-slate-500">Example: 30yo male, 70kg, 175cm = 1,664 BMR × 1.55 = 2,579 TDEE</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>BMR:</strong> Calories burned at complete rest daily.</li>
                <li><strong>Maintenance:</strong> Total calories to maintain current weight.</li>
                <li><strong>Weight Loss:</strong> Calorie target for safe weight loss (~1 lb/week).</li>
                <li><strong>Weight Gain:</strong> Calorie target for healthy weight gain (~1 lb/week).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Eating below BMR:</strong> Severely restricting calories can cause health issues.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring activity level:</strong> Your actual needs vary based on exercise habits.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Track your weight over 2-3 weeks</strong> and adjust calories as needed.</p>
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
