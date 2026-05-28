import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import {
  GitCompare,
  CreditCard,
  Heart,
  Truck,
  Bot,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const allComparisons = [
  {
    title: 'Fixed-Rate vs Variable-Rate Mortgage',
    slug: 'fixed-vs-variable-mortgage',
    cat: 'Finance',
    bestFor: 'Home buyers comparing long-term stability vs. potential savings',
    desc: 'Compare fixed-rate and adjustable-rate mortgages to understand which offers better value based on your timeline and risk tolerance.',
  },
  {
    title: '15-Year vs 30-Year Mortgage',
    slug: '15-year-vs-30-year-mortgage',
    cat: 'Finance',
    bestFor: 'Homeowners deciding between faster payoff vs. lower monthly payments',
    desc: 'Weigh the trade-offs between higher monthly payments with less total interest versus lower payments with more interest over time.',
  },
  {
    title: 'Buying a Home vs Renting',
    slug: 'mortgage-vs-rent',
    cat: 'Finance',
    bestFor: 'People deciding whether to buy or continue renting',
    desc: 'Compare the financial implications of buying versus renting based on your situation, location, and long-term plans.',
  },
  {
    title: 'Refinancing vs Taking a New Mortgage',
    slug: 'refinance-vs-new-mortgage',
    cat: 'Finance',
    bestFor: 'Homeowners considering restructuring their home loan',
    desc: 'Understand when refinancing makes sense versus taking out a completely new mortgage with different terms.',
  },
  {
    title: 'Personal Loan vs Credit Card',
    slug: 'personal-loan-vs-credit-card',
    cat: 'Finance',
    bestFor: 'Borrowers choosing between personal loans and credit cards for large purchases',
    desc: 'Compare interest rates, repayment terms, and overall costs between personal loans and credit card financing.',
  },
  {
    title: 'FedEx vs UPS Shipping',
    slug: 'fedex-vs-ups-shipping',
    cat: 'Shipping',
    bestFor: 'E-commerce sellers choosing between major carriers',
    desc: 'Compare shipping rates, delivery speeds, and services offered by FedEx and UPS for domestic and international shipments.',
  },
  {
    title: 'BMI vs Body Fat Percentage',
    slug: 'bmi-vs-body-fat-percentage',
    cat: 'Health',
    bestFor: 'Health-conscious individuals choosing body composition metrics',
    desc: 'Compare BMI and body fat percentage as health indicators, understanding the strengths and limitations of each measurement.',
  },
];

const categories = ['All', 'Finance', 'Health', 'Shipping', 'AI'];

const categoryIcons: Record<string, typeof CreditCard> = {
  Finance: CreditCard,
  Health: Heart,
  Shipping: Truck,
  AI: Bot,
};

export default function ComparePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const canonicalUrl = 'https://www.calculatorpilotai.com/compare';

  const filteredComparisons = activeCategory === 'All'
    ? allComparisons
    : allComparisons.filter(item => item.cat === activeCategory);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: 'https://www.calculatorpilotai.com/' },
        { name: 'Compare', url: canonicalUrl }
      ]),
      generateFAQSchema([
        { question: 'What can I compare here?', answer: 'Side-by-side pages for finance, health, and shipping decisions.' },
        { question: 'Are comparisons free?', answer: 'Yes, all comparison pages are free to read and use.' }
      ])
    ]
  };

  return (
    <>
      <PageMeta
        title="Compare Tools - CalcWise AI"
        description="Compare important finance, health, and shipping decisions side by side."
        canonical={canonicalUrl}
        ogType="article"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-100 via-white to-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm mb-6">
                <GitCompare className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-slate-600">Comparison Tools</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
                Comparison <span className="text-primary">Tools</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                Compare finance, health, shipping, and AI-related options side by side to make better decisions.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Category Filter */}
          <section className="mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Comparison Cards */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredComparisons.map((item, i) => {
                const Icon = categoryIcons[item.cat] || GitCompare;
                return (
                  <Link
                    key={i}
                    to={`/compare/${item.slug}`}
                    className="group bg-white p-8 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                        {item.cat}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Best for</span>
                          <p className="text-sm text-slate-600 mt-1">{item.bestFor}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400">Side-by-side analysis</span>
                      <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Compare Now <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 bg-slate-900 text-white rounded-3xl p-10 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">Make Better Decisions</h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-8">
                Use our comparison tools alongside our calculators to get a complete picture before making important financial, health, or business decisions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/tools" className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                  Explore Calculators <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/guides" className="inline-flex items-center gap-2 bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200">
                  Read Guides <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
