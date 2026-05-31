import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateDTI, type DTIResult } from '@/lib/engines';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function DTICalculator() {
  const [annualIncome, setAnnualIncome] = useState(85000);
  const [housingPayment, setHousingPayment] = useState(1800);
  const [otherDebts, setOtherDebts] = useState<string[]>(['450', '250', '200']);
  const [result, setResult] = useState<DTIResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (annualIncome <= 0) newErrors.annualIncome = 'Annual income must be greater than 0';
    if (annualIncome > 10000000) newErrors.annualIncome = 'Income seems unrealistically high';
    if (housingPayment < 0) newErrors.housingPayment = 'Housing payment cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const debts = otherDebts.map(d => parseFloat(d) || 0);
    const res = calculateDTI(annualIncome, housingPayment, debts);
    setResult(res);
  };

  const handleDebtChange = (index: number, value: string) => {
    const newDebts = [...otherDebts];
    newDebts[index] = value;
    setOtherDebts(newDebts);
  };

  const addDebt = () => {
    setOtherDebts([...otherDebts, '0']);
  };

  const removeDebt = (index: number) => {
    if (otherDebts.length > 1) {
      const newDebts = otherDebts.filter((_, i) => i !== index);
      setOtherDebts(newDebts);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-emerald-600';
      case 'Good': return 'text-blue-600';
      case 'Acceptable': return 'text-amber-600';
      case 'High Risk': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getRatioColor = (ratio: number, type: 'front' | 'back') => {
    const threshold = type === 'front' ? 28 : 36;
    if (ratio <= threshold * 0.8) return 'bg-emerald-100 border-emerald-300 text-emerald-700';
    if (ratio <= threshold) return 'bg-blue-100 border-blue-300 text-blue-700';
    if (ratio <= threshold * 1.2) return 'bg-amber-100 border-amber-300 text-amber-700';
    return 'bg-red-100 border-red-300 text-red-700';
  };

  const faqs = [
    {
      question: 'What is a debt-to-income ratio?',
      answer: 'Your debt-to-income (DTI) ratio compares your monthly debt payments to your gross monthly income. Lenders use this to assess your ability to manage monthly payments and repay borrowed money. A lower DTI indicates better financial health and makes you a more attractive borrower.'
    },
    {
      question: 'What is a good DTI ratio?',
      answer: 'For conventional mortgages, lenders typically want a front-end DTI (housing only) of 28% or less and a back-end DTI (all debts) of 36% or less. FHA loans are more flexible, allowing front-end ratios up to 31% and back-end ratios up to 43%. VA loans may approve borrowers with higher ratios depending on other factors.'
    },
    {
      question: 'How is DTI different from credit score?',
      answer: 'Your DTI ratio measures your income relative to your debt obligations, while your credit score measures your creditworthiness based on your credit history. You can have an excellent credit score but a high DTI (and vice versa). Both factors are important when applying for loans.'
    },
    {
      question: 'What debts are included in DTI calculation?',
      answer: 'DTI typically includes all recurring monthly debt payments: mortgage/rent, auto loans, student loans, minimum credit card payments, personal loans, alimony, child support, and other installment debts. It does not include utilities, insurance, or variable expenses.'
    },
    {
      question: 'How can I lower my DTI ratio?',
      answer: 'You can lower your DTI by increasing your income (getting a raise, taking on additional work) or reducing your debt (paying off loans, consolidating debt, making extra payments). Paying down credit card balances is especially effective as minimum payments can significantly impact your ratio.'
    },
    {
      question: 'Does renting affect my DTI?',
      answer: 'Yes, if you are applying for a mortgage while renting, your current rent payment is considered your housing payment for DTI calculations. Once you own a home, your mortgage payment replaces the rent in the calculation.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'DTI Calculator',
        description: 'Calculate your debt-to-income ratio to understand how much of your monthly income goes toward debt payments. Essential for mortgage qualification.',
        url: 'https://www.calculatorpilotai.com/tools/finance/dti-calculator',
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
      }
    ]
  };

  const relatedTools = [
    { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', desc: 'Calculate your monthly mortgage payment' },
    { name: 'Mortgage Affordability Calculator', path: '/tools/finance/mortgage-affordability-calculator', desc: 'See how much home you can afford' },
    { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', desc: 'Calculate payments for any loan type' },
  ];

  return (
    <ToolLayout toolId="dti" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">DTI Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="annual-income" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Annual Gross Income ($)</label>
              <input
                id="annual-income"
                type="number"
                min="0"
                step="1000"
                value={annualIncome}
                onChange={(e) => { setAnnualIncome(validateNumberInput(e.target.value, { min: 0 })); setErrors(prev => { const n = { ...prev }; delete n.annualIncome; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.annualIncome ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.annualIncome && <p className="text-xs text-rose-500">{errors.annualIncome}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="housing-payment" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Housing Payment ($)</label>
              <input
                id="housing-payment"
                type="number"
                min="0"
                step="50"
                value={housingPayment}
                onChange={(e) => { setHousingPayment(validateNumberInput(e.target.value, { min: 0 })); setErrors(prev => { const n = { ...prev }; delete n.housingPayment; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.housingPayment ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.housingPayment && <p className="text-xs text-rose-500">{errors.housingPayment}</p>}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Other Monthly Debts</label>
              <button
                onClick={addDebt}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                + Add Debt
              </button>
            </div>
            <div className="space-y-3">
              {otherDebts.map((debt, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={debt}
                    onChange={(e) => handleDebtChange(index, e.target.value)}
                    placeholder={`Debt ${index + 1}`}
                    className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono"
                  />
                  {otherDebts.length > 1 && (
                    <button
                      onClick={() => removeDebt(index)}
                      className="p-3 text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Include car loans, student loans, minimum credit card payments, etc.
            </p>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate DTI
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 border-2 rounded-xl text-center ${getRatioColor(result.frontEndRatio, 'front')}`}>
                <span className="text-xs font-bold uppercase tracking-widest block mb-2">Front-End DTI (Housing)</span>
                <div className={`${getResultTextSize(formatPercent(result.frontEndRatio))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatPercent(result.frontEndRatio)}</div>
                <span className={`text-sm font-semibold mt-2 block ${getStatusColor(result.frontEndStatus)}`}>{result.frontEndStatus}</span>
              </div>
              <div className={`p-6 border-2 rounded-xl text-center ${getRatioColor(result.backEndRatio, 'back')}`}>
                <span className="text-xs font-bold uppercase tracking-widest block mb-2">Back-End DTI (All Debts)</span>
                <div className={`${getResultTextSize(formatPercent(result.backEndRatio))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatPercent(result.backEndRatio)}</div>
                <span className={`text-sm font-semibold mt-2 block ${getStatusColor(result.backEndStatus)}`}>{result.backEndStatus}</span>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Gross Monthly</span>
                  <span className="font-mono font-bold">{formatCurrency(result.grossMonthlyIncome)}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Housing</span>
                  <span className="font-mono font-bold">{formatCurrency(result.housingPayment)}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Other Debts</span>
                  <span className="font-mono font-bold">{formatCurrency(result.monthlyDebtPayments)}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Remaining</span>
                  <span className="font-mono font-bold">{formatCurrency(result.grossMonthlyIncome - result.housingPayment - result.monthlyDebtPayments)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Lender Guidelines</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Maximum Housing Payment</span>
                  <span className="font-mono font-bold text-emerald-600">{formatCurrency(result.maxHousingPayment)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Maximum Total Debt</span>
                  <span className="font-mono font-bold text-emerald-600">{formatCurrency(result.maxTotalDebt)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Available for Housing Shortfall</span>
                  <span className={`font-mono font-bold ${result.maxHousingPayment - result.housingPayment >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(result.maxHousingPayment - result.housingPayment)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Debt-to-Income Ratio</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What is DTI Ratio?</h3>
              <p className="text-slate-700 leading-relaxed">
                Your debt-to-income (DTI) ratio is a financial metric that compares your total monthly debt payments to your gross monthly income. It's expressed as a percentage and is one of the key factors lenders use when evaluating loan applications.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Front-End vs Back-End DTI</h3>
              <p className="text-slate-700 leading-relaxed mb-3">
                <strong>Front-End DTI</strong> only includes housing-related expenses (rent/mortgage, property taxes, insurance). <strong>Back-End DTI</strong> includes all recurring debt obligations: housing, auto loans, student loans, credit cards, and personal loans.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Most lenders set maximum DTI thresholds: conventional loans typically require front-end DTI below 28% and back-end DTI below 36%. FHA loans allow slightly higher ratios, making homeownership more accessible for first-time buyers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">How to Improve Your DTI</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Increase income</strong> through promotions, side work, or career changes</li>
                <li><strong>Pay off existing debts</strong>, starting with highest-interest accounts</li>
                <li><strong>Avoid taking on new debt</strong> before applying for a mortgage</li>
                <li><strong>Consider debt consolidation</strong> to simplify payments and potentially lower rates</li>
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
