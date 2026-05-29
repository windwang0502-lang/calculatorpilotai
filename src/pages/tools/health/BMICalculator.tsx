import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateBMI, BMIResult } from '@/lib/engines';
import { generateBMIInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatNumber, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'underweight': return 'text-blue-600';
      case 'normal': return 'text-emerald-600';
      case 'overweight': return 'text-amber-600';
      case 'obese': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const faqs = [
    {
      question: 'What is BMI and how is it calculated?',
      answer: 'BMI (Body Mass Index) is a measure of body fat based on height and weight. The formula is: BMI = weight(kg) / height(m)². For example, a person weighing 70 kg and 1.75 m tall has a BMI of 22.9. BMI categories are: Underweight (under 18.5), Normal (18.5-24.9), Overweight (25-29.9), and Obese (30 or higher).'
    },
    {
      question: 'What are the limitations of BMI?',
      answer: 'BMI is a screening tool but has limitations. It doesn\'t distinguish between muscle and fat mass, so athletes may have high BMI without excess body fat. It doesn\'t account for age, gender, or ethnicity. For example, older adults may have higher body fat percentages at the same BMI as younger people. Use BMI as one indicator among many health metrics.'
    },
    {
      question: 'How accurate is BMI for different body types?',
      answer: 'BMI is less accurate for muscular individuals (who may be classified as overweight despite low body fat) and for elderly individuals (who may be classified as normal despite higher body fat). Athletes, bodybuilders, and pregnant women should use alternative body composition measurements for more accurate health assessments.'
    },
    {
      question: 'What are healthy BMI ranges by age?',
      answer: 'For adults aged 18-65, the standard BMI ranges apply regardless of age. However, some research suggests slightly higher BMI (25-27) may be optimal for adults over 65. Always consult with a healthcare provider to determine your healthy weight range based on your individual health history and goals.'
    },
    {
      question: 'How does the calculator estimate daily calorie needs?',
      answer: 'The calculator uses your BMR (Basal Metabolic Rate) multiplied by an activity factor. BMR is calculated using the Mifflin-St Jeor equation, which estimates the calories your body burns at rest. The activity factor accounts for your exercise level, from sedentary (1.2) to extra active (1.9).'
    },
    {
      question: 'What should I do if my BMI is in the overweight or obese range?',
      answer: 'BMI is just one health indicator. If your BMI is above normal, consider consulting a healthcare provider for a comprehensive health assessment. They can evaluate other factors like blood pressure, cholesterol, and blood sugar. Small lifestyle changes—walking 10 minutes daily, reducing processed foods—can make significant differences over time.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'BMI & Calorie Calculator',
        description: 'Calculate your Body Mass Index and daily calorie needs based on your age, gender, height, weight, and activity level.',
        url: 'https://www.calculatorpilotai.com/tools/health/bmi-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'BMI Calculator', item: 'https://www.calculatorpilotai.com/tools/health/bmi-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'BMR Calculator', path: '/tools/health/bmr-calculator', desc: 'Calculate your basal metabolic rate' },
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Determine your daily calorie needs' },
    { name: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', desc: 'Estimate your body fat percentage' },
  ];

  return (
    <ToolLayout toolId="bmi" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">BMI & Calorie Calculator</h2>
            <UnitToggle value={weightUnit} onChange={(v) => setWeightUnit(v as 'kg' | 'lb')} options={[
              { label: 'kg', value: 'kg' },
              { label: 'lb', value: 'lb' },
            ]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="bmi-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight ({weightUnit})</label>
              <input
                id="bmi-weight"
                type="number"
                min="1"
                max="500"
                step="0.1"
                value={weightDisplay}
                onChange={(e) => { handleWeightChange(validateNumberInput(e.target.value, { min: 1, max: 500 })); setErrors(prev => { const n = { ...prev }; delete n.weight; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="bmi-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({heightUnit})</label>
                <UnitToggle value={heightUnit} onChange={(v) => setHeightUnit(v as 'cm' | 'ft')} options={[
                  { label: 'cm', value: 'cm' },
                  { label: 'in', value: 'ft' },
                ]} />
              </div>
              <input
                id="bmi-height"
                type="number"
                min="1"
                max="300"
                step="0.1"
                value={heightDisplay}
                onChange={(e) => { handleHeightChange(validateNumberInput(e.target.value, { min: 1, max: 300 })); setErrors(prev => { const n = { ...prev }; delete n.height; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="bmi-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="bmi-age"
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
              <label htmlFor="bmi-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="bmi-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="bmi-activity" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity Level</label>
              <select
                id="bmi-activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
              >
                <option value={1.2}>Sedentary (Little or no exercise)</option>
                <option value={1.375}>Lightly active (1-3 days/week)</option>
                <option value={1.55}>Moderately active (3-5 days/week)</option>
                <option value={1.725}>Very active (6-7 days/week)</option>
                <option value={1.9}>Extra active (Hard exercise/physical job)</option>
              </select>
            </div>
          </div>
          <button onClick={handleCalculate} className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2">
            Analyze Health Metrics
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">BMI Score</span>
                <div className={`${getResultTextSize(formatNumber(result.bmi, { decimals: 1 }))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.bmi, { decimals: 1 })}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Category</span>
                <div className={`${getResultTextSize(result.status)} font-bold ${getStatusColor(result.status)}`}>{result.status}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Daily Calories</span>
                <div className={`${getResultTextSize(formatNumber(Math.round(result.calories)))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(Math.round(result.calories))} kcal</div>
              </div>
            </div>
            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the BMI Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The BMI Calculator estimates your Body Mass Index and daily calorie needs in one comprehensive tool. It factors in your weight, height, age, gender, and activity level to provide personalized health metrics. BMI is a widely-used screening tool that helps assess whether your weight is in proportion to your height.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                BMI is calculated by dividing your weight in kilograms by the square of your height in meters. The calculator then categorizes your BMI into Underweight, Normal, Overweight, or Obese ranges. For calorie estimation, it uses the Mifflin-St Jeor equation to calculate your BMR, then multiplies by your activity factor to estimate daily energy needs.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formulas</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>BMI = weight(kg) / height(m)²</strong></p>
                <p className="mb-2"><strong>BMR (male) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5</strong></p>
                <p className="mb-2"><strong>BMR (female) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161</strong></p>
                <p className="text-xs text-slate-500">Daily Calories = BMR × Activity Factor</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <p className="text-slate-700 leading-relaxed mb-3">Your health metrics provide these insights:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>BMI Score:</strong> A number that categorizes your weight relative to your height.</li>
                <li><strong>Category:</strong> Underweight (under 18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (30+).</li>
                <li><strong>Daily Calories:</strong> Estimated calories to maintain your current weight based on activity level.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Relying solely on BMI:</strong> It doesn\'t measure body fat directly or account for muscle mass.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring activity level:</strong> Your calorie needs vary dramatically based on how active you are.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Use BMI as a screening tool</strong> — consult healthcare providers for comprehensive assessments.</p>
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
