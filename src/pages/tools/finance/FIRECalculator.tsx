import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, validateNumberInput } from '@/lib/utils';

interface FIREResult {
  fireNumber: number;
  currentProgress: number;
  yearsToFire: number;
  monthlyInvestment: number;
  totalContributions: number;
}

export default function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [targetFireAge, setTargetFireAge] = useState(45);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [annualIncome, setAnnualIncome] = useState(90000);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [result, setResult] = useState<FIREResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (currentAge < 18 || currentAge > 70) newErrors.currentAge = 'Enter a valid age';
    if (targetFireAge <= currentAge) newErrors.targetFireAge = 'FIRE age must be greater than current age';
    if (targetFireAge > 100) newErrors.targetFireAge = 'FIRE age seems too high';
    if (currentSavings < 0) newErrors.currentSavings = 'Cannot be negative';
    if (annualExpenses <= 0) newErrors.annualExpenses = 'Enter your annual expenses';
    if (annualIncome <= 0) newErrors.annualIncome = 'Enter your annual income';
    if (annualReturn < -10 || annualReturn > 30) newErrors.annualReturn = 'Enter a realistic return';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const fireNumber = annualExpenses * 25;
    const yearsToFire = targetFireAge - currentAge;
    const monthlyRate = annualReturn / 100 / 12;
    const months = yearsToFire * 12;
    const amountNeeded = fireNumber - currentSavings;

    let monthlyInvestment: number;
    if (monthlyRate > 0) {
      monthlyInvestment = amountNeeded * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    } else {
      monthlyInvestment = amountNeeded / months;
    }

    const totalContributions = currentSavings + (monthlyInvestment * months);
    const currentProgress = (currentSavings / fireNumber) * 100;

    setResult({
      fireNumber,
      currentProgress: Math.min(currentProgress, 100),
      yearsToFire,
      monthlyInvestment: Math.max(monthlyInvestment, 0),
      totalContributions
    });
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const faqs = [
    {
      question: 'What is FIRE?',
      answer: 'FIRE stands for Financial Independence, Retire Early. It is a movement focused on extreme savings and investment to achieve financial independence and retire much earlier than traditional retirement age. The goal is to have enough invested that you can withdraw 4% annually without depleting your portfolio.'
    },
    {
      question: 'What is the 4% rule?',
      answer: 'The 4% rule suggests you can safely withdraw 4% of your portfolio annually in retirement without running out of money over 30 years. This means you need 25 times your annual expenses as your FIRE number. For $50,000/year expenses, your FIRE number would be $1,250,000.'
    },
    {
      question: 'What is a realistic FIRE number?',
      answer: 'Your FIRE number is 25 times your annual expenses (based on the 4% rule). If you spend $40,000/year, you need $1,000,000. If you spend $100,000/year, you need $2,500,000. The key is knowing your actual expenses, not just your income.'
    },
    {
      question: 'How do I calculate my savings rate?',
      answer: 'Savings rate = (Annual Income - Annual Expenses) / Annual Income. If you earn $90,000 and spend $50,000, your savings rate is 44%. Higher savings rates mean reaching FIRE faster. Most FIRE practitioners aim for 50%+ savings rate.'
    },
    {
      question: 'What are the different FIRE variations?',
      answer: 'There are several FIRE variations: Lean FIRE (minimalist lifestyle, lower number), Fat FIRE (comfortable lifestyle, higher number), Barista FIRE (part-time work to cover expenses), and Coast FIRE (enough invested to let compound growth handle retirement).'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'FIRE Calculator',
        description: 'Calculate your Financial Independence, Retire Early (FIRE) number, current progress, and years until financial independence.',
        url: 'https://www.calculatorpilotai.com/tools/finance/fire-calculator',
        applicationCategory: 'FinanceApplication',
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
          { '@type': 'ListItem', position: 2, name: 'Finance', item: 'https://www.calculatorpilotai.com/tools/finance' },
          { '@type': 'ListItem', position: 3, name: 'FIRE Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/fire-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Retirement Calculator', path: '/tools/finance/retirement-calculator', desc: 'Plan your retirement savings goals' },
    { name: 'Investment Calculator', path: '/tools/finance/investment-calculator', desc: 'Project investment growth over time' },
    { name: 'Savings Goal Calculator', path: '/tools/finance/savings-goal-calculator', desc: 'Calculate how to reach your savings goals' },
  ];

  return (
    <ToolLayout toolId="fire" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">FIRE Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="current-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Age</label>
              <input
                id="current-age"
                type="number"
                min="18"
                max="70"
                value={currentAge}
                onChange={(e) => { setCurrentAge(validateNumberInput(e.target.value, { min: 18, max: 70 })); clearError('currentAge'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.currentAge ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.currentAge && <p className="text-xs text-rose-500">{errors.currentAge}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="target-fire-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Target FIRE Age</label>
              <input
                id="target-fire-age"
                type="number"
                min="30"
                max="100"
                value={targetFireAge}
                onChange={(e) => { setTargetFireAge(validateNumberInput(e.target.value, { min: 30, max: 100 })); clearError('targetFireAge'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.targetFireAge ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.targetFireAge && <p className="text-xs text-rose-500">{errors.targetFireAge}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="current-savings" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Investment Savings ($)</label>
              <input
                id="current-savings"
                type="number"
                min="0"
                step="1000"
                value={currentSavings}
                onChange={(e) => { setCurrentSavings(validateNumberInput(e.target.value, { min: 0 })); clearError('currentSavings'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.currentSavings ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.currentSavings && <p className="text-xs text-rose-500">{errors.currentSavings}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="annual-expenses" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Annual Expenses ($)</label>
              <input
                id="annual-expenses"
                type="number"
                min="0"
                step="1000"
                value={annualExpenses}
                onChange={(e) => { setAnnualExpenses(validateNumberInput(e.target.value, { min: 0 })); clearError('annualExpenses'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.annualExpenses ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.annualExpenses && <p className="text-xs text-rose-500">{errors.annualExpenses}</p>}
              <p className="text-xs text-slate-500">Your yearly spending in retirement</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="annual-income" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Annual Income ($)</label>
              <input
                id="annual-income"
                type="number"
                min="0"
                step="1000"
                value={annualIncome}
                onChange={(e) => { setAnnualIncome(validateNumberInput(e.target.value, { min: 0 })); clearError('annualIncome'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.annualIncome ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.annualIncome && <p className="text-xs text-rose-500">{errors.annualIncome}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="annual-return" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Expected Annual Return (%)</label>
              <input
                id="annual-return"
                type="number"
                min="-10"
                max="30"
                step="0.5"
                value={annualReturn}
                onChange={(e) => { setAnnualReturn(validateNumberInput(e.target.value, { min: -10, max: 30 })); clearError('annualReturn'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.annualReturn ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.annualReturn && <p className="text-xs text-rose-500">{errors.annualReturn}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate FIRE
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-900 text-white rounded-xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your FIRE Number</span>
              <div className="text-3xl md:text-4xl font-mono font-black mt-2">{formatCurrency(result.fireNumber)}</div>
              <span className="text-sm text-slate-400">25x your annual expenses</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Progress to FIRE</span>
                <span className="text-sm font-mono font-bold">{result.currentProgress.toFixed(1)}%</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(result.currentProgress, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Years to FIRE</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{result.yearsToFire}</div>
              </div>
              <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Monthly Investment Needed</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-emerald-600 tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.monthlyInvestment)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Savings Rate</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{(((annualIncome - annualExpenses) / annualIncome) * 100).toFixed(0)}%</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Contributions</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalContributions)}</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the FIRE Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What is FIRE?</h3>
              <p className="text-slate-700 leading-relaxed">
                FIRE (Financial Independence, Retire Early) is a lifestyle movement focused on extreme savings and investment to achieve financial independence much earlier than traditional retirement. The core principle is simple: save aggressively, invest wisely, and build enough wealth to live off the returns.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The 4% Rule</h3>
              <p className="text-slate-700 leading-relaxed">
                The FIRE movement typically uses the 4% safe withdrawal rate. This means you need 25 times your annual expenses invested. At 4%, your portfolio should theoretically last 30+ years without running out of money.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How Savings Rate Affects Your Timeline</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>10% savings rate = ~51 years to FIRE</li>
                <li>25% savings rate = ~32 years to FIRE</li>
                <li>50% savings rate = ~17 years to FIRE</li>
                <li>75% savings rate = ~7 years to FIRE</li>
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
          <h2 className="text-3xl font-bold mb-8 text-center">Related Financial Calculators</h2>
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
