import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, validateNumberInput } from '@/lib/utils';

interface SavingsGoalResult {
  monthlySavings: number;
  totalInterest: number;
  goalAchieved: string;
  shortfall: number;
}

export default function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [months, setMonths] = useState(36);
  const [annualRate, setAnnualRate] = useState(5);
  const [result, setResult] = useState<SavingsGoalResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (goalAmount <= 0) newErrors.goalAmount = 'Goal amount must be greater than 0';
    if (currentSavings < 0) newErrors.currentSavings = 'Current savings cannot be negative';
    if (currentSavings >= goalAmount) newErrors.currentSavings = 'You already have enough savings!';
    if (months <= 0) newErrors.months = 'Timeframe must be at least 1 month';
    if (months > 600) newErrors.months = 'Timeframe seems too long';
    if (annualRate < -5 || annualRate > 30) newErrors.annualRate = 'Enter a realistic rate';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const amountNeeded = goalAmount - currentSavings;
    const monthlyRate = annualRate / 100 / 12;

    let monthlySavings: number;
    if (monthlyRate > 0) {
      monthlySavings = amountNeeded * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    } else {
      monthlySavings = amountNeeded / months;
    }

    const totalDeposited = currentSavings + (monthlySavings * months);
    const totalInterest = goalAmount - totalDeposited;

    const today = new Date();
    const goalDate = new Date(today);
    goalDate.setMonth(goalDate.getMonth() + months);

    setResult({
      monthlySavings,
      totalInterest: Math.abs(totalInterest),
      goalAchieved: goalDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      shortfall: amountNeeded - (currentSavings + monthlySavings * months)
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
      question: 'How do I determine my savings goal?',
      answer: 'Start by identifying what you are saving for—a down payment, emergency fund, vacation, or major purchase. Research typical costs for your goal and set a specific target amount with a realistic timeframe. Breaking large goals into smaller milestones can help maintain motivation.'
    },
    {
      question: 'What is a good savings rate for my goal?',
      answer: 'A good savings rate depends on your income and the goal amount. The key is to make it challenging but achievable. If the required monthly savings is more than 50% of your discretionary income, consider extending your timeline or finding ways to increase your income.'
    },
    {
      question: 'How does compound interest help with savings goals?',
      answer: 'When you save in a high-yield account or investments, you earn interest on your balance. This interest then earns its own interest, creating exponential growth. Starting early and keeping money invested rather than in a checking account can significantly accelerate your progress toward your goal.'
    },
    {
      question: 'Should I use a high-yield savings account or invest for short-term goals?',
      answer: 'For goals under 3 years, a high-yield savings account is typically safer. For goals 5+ years away, a diversified investment portfolio may provide better returns. The stock market is too volatile for short-term goals, but for longer timeframes, the potential for higher returns makes investing worthwhile.'
    },
    {
      question: 'What if I cannot meet my monthly savings target?',
      answer: 'If the target seems unreachable, consider: extending your timeline, breaking the goal into smaller sub-goals, finding ways to increase income (side hustle, selling items), or reducing expenses. Small adjustments add up over time. Even partial progress toward your goal is better than not saving at all.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Savings Goal Calculator',
        description: 'Calculate how much you need to save monthly to reach your savings goal. Account for compound interest and set realistic timelines.',
        url: 'https://www.calculatorpilotai.com/tools/finance/savings-goal-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Savings Goal Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/savings-goal-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator', desc: 'See how compound interest grows your savings' },
    { name: 'Investment Calculator', path: '/tools/finance/investment-calculator', desc: 'Project investment growth over time' },
    { name: 'FIRE Calculator', path: '/tools/finance/fire-calculator', desc: 'Calculate your financial independence number' },
  ];

  return (
    <ToolLayout toolId="savings-goal" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Savings Goal Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="goal-amount" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Savings Goal ($)</label>
              <input
                id="goal-amount"
                type="number"
                min="0"
                step="100"
                value={goalAmount}
                onChange={(e) => { setGoalAmount(validateNumberInput(e.target.value, { min: 0 })); clearError('goalAmount'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.goalAmount ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.goalAmount && <p className="text-xs text-rose-500">{errors.goalAmount}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="current-savings" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Savings ($)</label>
              <input
                id="current-savings"
                type="number"
                min="0"
                step="100"
                value={currentSavings}
                onChange={(e) => { setCurrentSavings(validateNumberInput(e.target.value, { min: 0 })); clearError('currentSavings'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.currentSavings ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.currentSavings && <p className="text-xs text-rose-500">{errors.currentSavings}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="months" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Timeframe (Months)</label>
              <input
                id="months"
                type="number"
                min="1"
                max="600"
                step="1"
                value={months}
                onChange={(e) => { setMonths(validateNumberInput(e.target.value, { min: 1, max: 600 })); clearError('months'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.months ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.months && <p className="text-xs text-rose-500">{errors.months}</p>}
              <p className="text-xs text-slate-500">{Math.floor(months / 12)} years, {months % 12} months</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="annual-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Expected Annual Return (%)</label>
              <input
                id="annual-rate"
                type="number"
                min="-5"
                max="30"
                step="0.1"
                value={annualRate}
                onChange={(e) => { setAnnualRate(validateNumberInput(e.target.value, { min: -5, max: 30 })); clearError('annualRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.annualRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.annualRate && <p className="text-xs text-rose-500">{errors.annualRate}</p>}
              <p className="text-xs text-slate-500">High-yield savings: ~4-5%</p>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Savings
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-900 text-white rounded-xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly Savings Needed</span>
              <div className="text-3xl md:text-4xl font-mono font-black mt-2">{formatCurrency(result.monthlySavings)}</div>
              <span className="text-sm text-slate-400">to reach your goal</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Goal Amount</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(goalAmount)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Interest Earned</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-emerald-600 tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalInterest)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Target Date</span>
                <div className="text-base md:text-lg font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{result.goalAchieved}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Remaining to Save</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(goalAmount - currentSavings)}</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Savings Goal Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Savings Goal Calculator helps you determine how much you need to save each month to reach a specific financial goal. It accounts for your current savings and expected returns on your savings.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Setting Effective Savings Goals</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Be specific:</strong> Set an exact dollar amount rather than a vague target</li>
                <li><strong>Set realistic timelines:</strong> Give yourself enough time to make saving manageable</li>
                <li><strong>Consider the return rate:</strong> High-yield savings accounts currently offer 4-5% APY</li>
                <li><strong>Automate your savings:</strong> Set up automatic transfers to make saving effortless</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Monthly Savings = (Goal - Current) × r / ((1 + r)^n - 1)</strong></p>
                <p className="mb-1">Where:</p>
                <p className="mb-1">• r = Monthly interest rate</p>
                <p className="mb-1">• n = Number of months</p>
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
