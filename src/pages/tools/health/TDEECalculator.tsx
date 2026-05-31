import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateTDEE, type TDEEResult } from '@/lib/engines';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function TDEECalculator() {
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<1.2 | 1.375 | 1.55 | 1.725 | 1.9>(1.55);
  const [result, setResult] = useState<TDEEResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');

  const weightDisplay = weightUnit === 'kg' ? weightKg : Math.round(weightKg * 2.20462);
  const heightDisplay = heightUnit === 'cm' ? heightCm : Math.round(heightCm / 2.54);

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
    const res = calculateTDEE(weightKg, heightCm, age, gender, activityLevel);
    setResult(res);
  };

  const getActivityLabel = (level: number) => {
    switch (level) {
      case 1.2: return 'Sedentary (Little or no exercise)';
      case 1.375: return 'Lightly Active (1-3 days/week)';
      case 1.55: return 'Moderately Active (3-5 days/week)';
      case 1.725: return 'Very Active (6-7 days/week)';
      case 1.9: return 'Extra Active (Hard exercise/physical job)';
      default: return '';
    }
  };

  const faqs = [
    {
      question: 'What is TDEE and why is it important?',
      answer: 'TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, including all activities from breathing to exercise. Understanding your TDEE is essential for weight management: eat fewer calories than your TDEE to lose weight, eat more to gain weight, and eat at your TDEE to maintain.'
    },
    {
      question: 'How is TDEE different from BMR?',
      answer: 'BMR (Basal Metabolic Rate) is the calories your body burns at complete rest just to maintain basic life functions. TDEE multiplies BMR by an activity factor to account for all daily movement, exercise, and normal activities. Your TDEE is typically 1.2 to 1.9 times your BMR depending on how active you are.'
    },
    {
      question: 'What activity level should I choose?',
      answer: 'Be honest about your activity level. "Sedentary" means desk job with minimal exercise. "Lightly active" is 1-3 days of light exercise per week. "Moderately active" is 3-5 days of moderate exercise. "Very active" is 6-7 days of intense exercise. "Extra active" is intense daily exercise plus a physical job.'
    },
    {
      question: 'How accurate are the calorie calculations?',
      answer: 'TDEE calculations are estimates based on population averages. Individual variation can be 10-15% due to genetics, muscle mass, hormone levels, and other factors. Start with the calculated values and adjust based on actual weight changes over 2-3 weeks. If you\'re not losing weight at the target calories, reduce intake by 100-200 calories.'
    },
    {
      question: 'What are macros and why do they matter?',
      answer: 'Macronutrients (protein, carbs, and fat) are the three main nutrients that provide calories. Protein is crucial for muscle preservation during weight loss. Fat is essential for hormone production and nutrient absorption. Carbs provide energy for workouts. The optimal macro split depends on your goals and activity level.'
    },
    {
      question: 'Should I calculate TDEE for weight loss or maintenance?',
      answer: 'Use your maintenance TDEE as the baseline, then create a deficit. For sustainable weight loss, aim for a 250-500 calorie daily deficit (0.5-1 lb per week). Avoid extreme deficits below your BMR, as this can cause muscle loss, metabolic slowdown, and nutritional deficiencies.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'TDEE Calculator',
        description: 'Calculate your Total Daily Energy Expenditure to determine how many calories you burn each day. Essential for weight loss, muscle gain, and nutrition planning.',
        url: 'https://www.calculatorpilotai.com/tools/health/tdee-calculator',
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
      }
    ]
  };

  const relatedTools = [
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', desc: 'Calculate your BMI and daily calorie needs' },
    { name: 'BMR Calculator', path: '/tools/health/bmr-calculator', desc: 'Calculate your basal metabolic rate' },
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Determine your daily calorie needs' },
  ];

  return (
    <ToolLayout toolId="tdee" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">TDEE Calculator</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setWeightUnit('kg')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${weightUnit === 'kg' ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}
              >
                kg
              </button>
              <button
                onClick={() => setWeightUnit('lb')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${weightUnit === 'lb' ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}
              >
                lb
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="tdee-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight ({weightUnit})</label>
              <input
                id="tdee-weight"
                type="number"
                min="1"
                max="500"
                step="1"
                value={weightDisplay}
                onChange={(e) => { handleWeightChange(validateNumberInput(e.target.value, { min: 1, max: 500 })); setErrors(prev => { const n = { ...prev }; delete n.weight; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="tdee-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({heightUnit})</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setHeightUnit('cm')}
                    className={`px-2 py-1 text-xs font-bold uppercase rounded transition-colors ${heightUnit === 'cm' ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-500'}`}
                  >
                    cm
                  </button>
                  <button
                    onClick={() => setHeightUnit('in')}
                    className={`px-2 py-1 text-xs font-bold uppercase rounded transition-colors ${heightUnit === 'in' ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-500'}`}
                  >
                    in
                  </button>
                </div>
              </div>
              <input
                id="tdee-height"
                type="number"
                min="1"
                max="300"
                step="1"
                value={heightDisplay}
                onChange={(e) => { handleHeightChange(validateNumberInput(e.target.value, { min: 1, max: 300 })); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="tdee-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="tdee-age"
                type="number"
                min="1"
                max="150"
                step="1"
                value={age}
                onChange={(e) => { setAge(validateNumberInput(e.target.value, { min: 1, max: 150 })); setErrors(prev => { const n = { ...prev }; delete n.age; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.age ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.age && <p className="text-xs text-rose-500">{errors.age}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="tdee-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="tdee-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="tdee-activity" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity Level</label>
              <select
                id="tdee-activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value) as 1.2 | 1.375 | 1.55 | 1.725 | 1.9)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
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
            Calculate TDEE
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">BMR</span>
                <span className="font-mono font-bold text-2xl">{formatNumber(result.bmr)}</span>
                <span className="text-sm text-slate-500">cal/day (at rest)</span>
              </div>
              <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl text-center">
                <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Maintenance TDEE</span>
                <span className={`${getResultTextSize(formatNumber(result.tdee))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>{formatNumber(result.tdee)}</span>
                <span className="text-sm text-primary/70">cal/day to maintain</span>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Activity Multiplier</span>
                <span className="font-mono font-bold text-2xl">{activityLevel}x</span>
                <span className="text-sm text-slate-500">{getActivityLabel(activityLevel).split('(')[0]}</span>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Calorie Targets for Your Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3">Weight Loss</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                      <span className="text-sm font-medium">Mild Deficit (-0.5 lb/wk)</span>
                      <span className="font-mono font-bold text-emerald-600">{formatNumber(result.caloriesToLose.mild)} cal</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-100 rounded-lg">
                      <span className="text-sm font-medium">Moderate Deficit (-1 lb/wk)</span>
                      <span className="font-mono font-bold text-emerald-700">{formatNumber(result.caloriesToLose.moderate)} cal</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                      <span className="text-sm font-medium">Extreme Deficit (-2 lb/wk)</span>
                      <span className="font-mono font-bold text-emerald-600">{formatNumber(result.caloriesToLose.extreme)} cal</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Weight Gain</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Mild Surplus (+0.5 lb/wk)</span>
                      <span className="font-mono font-bold text-blue-600">{formatNumber(result.caloriesToGain.mild)} cal</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
                      <span className="text-sm font-medium">Moderate Surplus (+1 lb/wk)</span>
                      <span className="font-mono font-bold text-blue-700">{formatNumber(result.caloriesToGain.moderate)} cal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Macro Breakdown (Maintenance)</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-rose-50 rounded-lg">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">Protein</span>
                  <span className="font-mono font-bold text-xl text-rose-600">{result.protein}g</span>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">Fat</span>
                  <span className="font-mono font-bold text-xl text-amber-600">{result.fat}g</span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Carbs</span>
                  <span className="font-mono font-bold text-xl text-emerald-600">{result.carbs}g</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding TDEE and Calories</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What is TDEE?</h3>
              <p className="text-slate-700 leading-relaxed">
                Total Daily Energy Expenditure (TDEE) represents the total number of calories your body burns each day, accounting for all activities from basic metabolic functions to exercise. It\'s calculated by taking your BMR (Basal Metabolic Rate) and multiplying it by an activity factor that reflects your daily movement and exercise habits.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">How TDEE is Calculated</h3>
              <p className="text-slate-700 leading-relaxed mb-3">
                We use the <strong>Mifflin-St Jeor equation</strong>, considered one of the most accurate BMR formulas for most people:
              </p>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-1"><strong>Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5</strong></p>
                <p><strong>Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161</strong></p>
              </div>
              <p className="text-slate-700 leading-relaxed mt-3">
                Then multiply BMR by your activity level: Sedentary (1.2), Lightly Active (1.375), Moderately Active (1.55), Very Active (1.725), or Extra Active (1.9).
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Using TDEE for Your Goals</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Weight loss:</strong> Subtract 250-500 calories from TDEE for sustainable loss</li>
                <li><strong>Weight gain:</strong> Add 250-500 calories to TDEE for muscle building</li>
                <li><strong>Maintenance:</strong> Eat at your calculated TDEE</li>
                <li><strong>Adjust based on results:</strong> If weight isn\'t changing after 2-3 weeks, adjust intake</li>
              </ul>
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
              <Link key={index} to={tool.path} className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-slate-400 text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
