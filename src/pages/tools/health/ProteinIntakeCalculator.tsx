import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface ProteinResult {
  grams: number;
  calories: number;
  percentage: number;
}

export default function ProteinIntakeCalculator() {
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('maintain');
  const [weightKg, setWeightKg] = useState(75);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<ProteinResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weightDisplay = unit === 'metric' ? weightKg : Math.round(weightKg * 2.20462 * 10) / 10;
  const weightFromDisplay = (val: number) => unit === 'metric' ? val : val / 2.20462;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (weightKg <= 0 || weightKg > 500) newErrors.weight = 'Weight must be between 1 and 500 kg';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getProteinRatio = (goal: string) => {
    switch (goal) {
      case 'lose': return 2.2;
      case 'gain': return 2.0;
      default: return 1.6;
    }
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const ratio = getProteinRatio(goal);
    const grams = Math.round(weightKg * ratio);
    const calories = grams * 4;
    const percentage = Math.round((calories / 2000) * 100);

    setResult({ grams, calories, percentage });
  };

  const faqs = [
    {
      question: 'How much protein do I need?',
      answer: 'Protein needs depend on goals and activity level. General guidelines: sedentary adults need 0.8g/kg, those building muscle need 1.6-2.2g/kg, and those losing weight need 1.6-2.2g/kg to preserve muscle. Athletes in intense training may benefit from up to 2.5g/kg. More isn\'t always better—excess protein is used for energy or stored as fat.'
    },
    {
      question: 'Why do I need more protein when losing weight?',
      answer: 'During caloric restriction, your body can break down muscle for energy if protein intake is insufficient. Higher protein intake (1.6-2.2g/kg) during weight loss helps preserve lean mass, maintains metabolic rate, and keeps you feeling full longer. This results in better body composition than low-protein diets.'
    },
    {
      question: 'Is too much protein bad for my kidneys?',
      answer: 'For healthy individuals, high protein intake (up to 2.2g/kg) poses no risk to kidney function. Research shows the kidneys adapt to increased protein metabolism. However, those with pre-existing kidney disease should consult a doctor before increasing protein intake.'
    },
    {
      question: 'What are the best protein sources?',
      answer: 'Complete proteins (containing all essential amino acids): eggs, dairy, meat, fish, poultry, and soy. Incomplete plant proteins: beans, legumes, grains, nuts. For muscle building, prioritize animal proteins or combine plant sources (rice + beans) for complete amino acid profiles.'
    },
    {
      question: 'Should I use protein supplements?',
      answer: 'Whole foods should be your primary protein source. Supplements (whey, casein, plant proteins) are convenient for meeting protein targets when whole foods are impractical. They\'re not necessary but can help, especially post-workout or for those struggling to eat enough protein from food alone.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Protein Intake Calculator',
        description: 'Calculate your optimal daily protein intake based on weight and fitness goals.',
        url: 'https://www.calculatorpilotai.com/tools/health/protein-intake-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Protein Intake Calculator', item: 'https://www.calculatorpilotai.com/tools/health/protein-intake-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Macro Calculator', path: '/tools/health/macro-calculator', desc: 'Calculate your complete macro breakdown' },
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Calculate your daily calorie needs' },
    { name: 'Lean Body Mass', path: '/tools/health/lean-body-mass-calculator', desc: 'Calculate your lean mass' },
  ];

  const proteinSources = [
    { food: 'Chicken Breast (100g)', protein: 31 },
    { food: 'Salmon (100g)', protein: 25 },
    { food: 'Eggs (2 large)', protein: 13 },
    { food: 'Greek Yogurt (170g)', protein: 17 },
    { food: 'Cottage Cheese (100g)', protein: 11 },
    { food: 'Tofu (100g)', protein: 8 },
    { food: 'Lentils (100g)', protein: 9 },
    { food: 'Almonds (30g)', protein: 6 },
  ];

  return (
    <ToolLayout toolId="protein-intake" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Protein Intake</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="pi-goal" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Goal</label>
              <select
                id="pi-goal"
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
              <label htmlFor="pi-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Body Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
              <input
                id="pi-weight"
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
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Protein Needs
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Daily Protein Target</span>
              <div className={`${getResultTextSize(formatNumber(result.grams))} font-mono font-bold tabular-nums leading-tight tracking-tight text-blue-600`}>{formatNumber(result.grams)}g</div>
              <span className="text-sm text-muted-foreground">per day</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Calories from Protein</span>
                <div className="text-2xl font-mono font-bold">{result.calories}</div>
                <span className="text-sm text-muted-foreground">kcal/day</span>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">% of 2000 Cal Diet</span>
                <div className="text-2xl font-mono font-bold">{result.percentage}%</div>
                <span className="text-sm text-muted-foreground">of total calories</span>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Per Meal (4/day)</span>
                <div className="text-2xl font-mono font-bold">{Math.round(result.grams / 4)}g</div>
                <span className="text-sm text-muted-foreground">minimum per meal</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">High-Protein Food Examples</h3>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-2">Food</th>
                      <th className="text-right py-2 px-2">Protein</th>
                      <th className="text-right py-2 px-2">To Reach Goal</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {proteinSources.map((source, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-2 px-2">{source.food}</td>
                        <td className="text-right py-2 px-2">{source.protein}g</td>
                        <td className="text-right py-2 px-2">{Math.ceil(result.grams / source.protein)} servings</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Protein Needs</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Protein Requirements by Goal</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="font-bold text-blue-600 w-24">Maintain:</span>
                  <span className="text-slate-700">1.6g per kg bodyweight</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="font-bold text-green-600 w-24">Muscle Gain:</span>
                  <span className="text-slate-700">1.6-2.2g per kg bodyweight</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="font-bold text-orange-600 w-24">Fat Loss:</span>
                  <span className="text-slate-700">1.6-2.2g per kg bodyweight</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">How Much Is Too Much?</h3>
              <p className="text-slate-700 leading-relaxed">
                For healthy individuals, up to 2.2-2.5g per kg is safe and effective. Higher amounts offer diminishing returns for muscle building. Excess protein is metabolized for energy or stored as fat. There's no magical threshold—your body uses what it needs for tissue repair and growth.
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
