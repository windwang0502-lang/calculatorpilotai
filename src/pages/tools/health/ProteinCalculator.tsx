import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateProtein, ProteinResult } from '@/lib/engines';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function ProteinCalculator() {
  const [weight, setWeight] = useState(70);
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [goal, setGoal] = useState<'maintain' | 'fat-loss' | 'muscle-gain'>('maintain');
  const [result, setResult] = useState<ProteinResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weightDisplay = unit === 'kg' ? weight : Math.round(weight * 2.20462 * 10) / 10;

  const handleWeightChange = (val: number) => {
    if (unit === 'kg') setWeight(val);
    else setWeight(Math.round(val / 2.20462));
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
    const res = calculateProtein(weightInKg, goal);
    setResult(res);
  };

  const getGoalInfo = (g: typeof goal) => {
    switch (g) {
      case 'fat-loss':
        return { label: 'Fat Loss', multiplier: 2.0, color: 'text-green-600', bg: 'bg-green-50 border-green-200', desc: 'Higher protein intake helps preserve muscle while creating a calorie deficit' };
      case 'muscle-gain':
        return { label: 'Muscle Gain', multiplier: 2.2, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', desc: 'Extra protein supports muscle protein synthesis during training' };
      default:
        return { label: 'Maintain', multiplier: 1.6, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', desc: 'Adequate protein for body maintenance and general health' };
    }
  };

  const faqs = [
    {
      question: 'How much protein do I actually need?',
      answer: 'The Recommended Daily Allowance (RDA) for protein is 0.8g per kilogram of body weight, which meets basic needs for most sedentary adults. However, active individuals, those in calorie deficit, or those building muscle typically need 1.6-2.2g per kg. Athletes may need up to 2.2g per kg. Our calculator provides personalized recommendations based on your goals.'
    },
    {
      question: 'What\'s the difference between fat loss and muscle gain protein needs?',
      answer: 'During fat loss, higher protein intake (up to 2.0g per kg) helps preserve muscle mass while your body uses fat for energy. During muscle gain, slightly more protein (up to 2.2g per kg) supports muscle protein synthesis. For maintenance, 1.6g per kg is typically sufficient. The key difference is maintaining muscle during caloric restriction.'
    },
    {
      question: 'Is it possible to eat too much protein?',
      answer: 'While protein is less likely to be stored as fat compared to carbohydrates and fat, very high intakes (over 3.5g per kg) may strain kidneys in susceptible individuals and displace other important nutrients. Most people cannot effectively utilize more than about 2.2g protein per kg daily for muscle building. Spread intake throughout the day for best absorption.'
    },
    {
      question: 'How should I distribute my protein intake?',
      answer: 'Research suggests spreading protein evenly across 4-5 meals optimizes muscle protein synthesis. Aim for 25-40g of protein per meal. Our calculator shows a recommended distribution across breakfast, lunch, dinner, and snacks to help you meet your daily targets throughout the day.'
    },
    {
      question: 'What foods are the best protein sources?',
      answer: 'Complete protein sources (containing all essential amino acids) include animal products: chicken, beef, fish, eggs, and dairy. Plant sources like tofu, tempeh, legumes, and quinoa are also complete. For athletes, whey protein offers rapid absorption post-workout. Prioritize whole foods over supplements when possible.'
    },
    {
      question: 'Does timing matter for protein intake?',
      answer: 'While total daily intake is most important, protein timing can provide marginal benefits. Consuming 20-40g within 2-3 hours after resistance training may enhance muscle repair. Spreading protein evenly throughout the day (every 3-4 hours) maintains amino acid levels for muscle protein synthesis.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Protein Calculator',
        description: 'Calculate your daily protein needs based on body weight and fitness goals for optimal nutrition.',
        url: 'https://www.calculatorpilotai.com/tools/health/protein-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Protein Calculator', item: 'https://www.calculatorpilotai.com/tools/health/protein-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Calculate your daily calorie needs' },
    { name: 'BMR Calculator', path: '/tools/health/bmr-calculator', desc: 'Calculate your basal metabolic rate' },
    { name: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', desc: 'Estimate your body fat percentage' },
  ];

  return (
    <ToolLayout toolId="protein" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Daily Protein Needs</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'kg' | 'lb')}
              options={[{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="protein-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Body Weight ({unit})</label>
              <input
                id="protein-weight"
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
              <label htmlFor="protein-goal" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fitness Goal</label>
              <select
                id="protein-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as typeof goal)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="maintain">Maintain Weight</option>
                <option value="fat-loss">Fat Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
              </select>
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
            {(() => {
              const goalInfo = getGoalInfo(goal);
              return (
                <div className={`p-4 border rounded-xl`}>
                  <p className={`text-sm ${goalInfo.color}`}>
                    <strong>{goalInfo.label} Mode:</strong> {goalInfo.desc}
                  </p>
                </div>
              );
            })()}

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Recommended Daily Protein</span>
              <div className={`${getResultTextSize(formatNumber(result.dailyProtein))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.dailyProtein)}g</div>
              <span className="text-muted-foreground">per day</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Minimum</span>
                <div className={`${getResultTextSize(formatNumber(result.minProtein))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.minProtein)}g</div>
                <span className="text-sm text-muted-foreground">per day</span>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Maximum</span>
                <div className={`${getResultTextSize(formatNumber(result.maxProtein))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.maxProtein)}g</div>
                <span className="text-sm text-muted-foreground">per day</span>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Per Meal</span>
                <div className={`${getResultTextSize(formatNumber(result.perMeal))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.perMeal)}g</div>
                <span className="text-sm text-muted-foreground">avg (4 meals)</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Meal Distribution</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Breakfast</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.breakfast)}g</span>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Lunch</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.lunch)}g</span>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Dinner</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.dinner)}g</span>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Snacks</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.snacks)}g</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-2">Protein-Rich Food Sources</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-blue-700">
                <span>Chicken breast: 31g/100g</span>
                <span>Salmon: 20g/100g</span>
                <span>Eggs: 6g/egg</span>
                <span>Greek yogurt: 10g/100g</span>
                <span>Lean beef: 26g/100g</span>
                <span>Tofu: 8g/100g</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Protein Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Protein Calculator determines your daily protein needs based on your body weight and fitness goals. Protein is essential for muscle repair, enzyme production, and hormone synthesis. Getting enough protein supports fat loss, muscle gain, or weight maintenance depending on your goals.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator uses research-based protein intake recommendations. For maintenance, it suggests 1.6g per kg. During fat loss, it increases to 2.0g per kg to preserve muscle. For muscle gain, it recommends 2.2g per kg to support muscle protein synthesis. These are based on studies showing optimal protein utilization for each goal.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formulas</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Maintain: Protein = weight(kg) × 1.6</strong></p>
                <p className="mb-2"><strong>Fat Loss: Protein = weight(kg) × 2.0</strong></p>
                <p className="mb-2"><strong>Muscle Gain: Protein = weight(kg) × 2.2</strong></p>
                <p className="text-xs text-slate-500">Example: 70kg person during muscle gain = 154g protein/day</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Daily Protein:</strong> Total grams to consume each day.</li>
                <li><strong>Minimum/Maximum:</strong> Acceptable range for your goal.</li>
                <li><strong>Per Meal:</strong> Average to aim for in each meal.</li>
                <li><strong>Meal Distribution:</strong> Suggested breakdown across the day.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Eating all protein at once:</strong> Spreading intake optimizes absorption.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring total calories:</strong> Protein is just one part of your diet.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Spread protein across 4-5 meals</strong> for optimal muscle protein synthesis.</p>
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
