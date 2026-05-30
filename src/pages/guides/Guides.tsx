import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import {
  BookOpen,
  CreditCard,
  Heart,
  Truck,
  Bot,
  Clock,
  ArrowRight,
  Star,
} from 'lucide-react';

const allGuides = [
  {
    title: 'What Is a Mortgage and How Does It Work',
    slug: 'what-is-mortgage',
    cat: 'Finance',
    desc: 'Learn the fundamentals of mortgages, including how monthly payments are calculated and what factors affect your interest rate.',
    readTime: '5 min read',
    featured: true,
  },
  {
    title: 'How to Reduce Your Mortgage Interest',
    slug: 'how-to-reduce-mortgage-interest',
    cat: 'Finance',
    desc: 'Practical strategies to lower your mortgage interest rate, from improving your credit score to making larger down payments.',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'What Is Mortgage Insurance and Do You Need It',
    slug: 'what-is-mortgage-insurance',
    cat: 'Finance',
    desc: 'Understand when mortgage insurance is required, how it works, and whether you can cancel it.',
    readTime: '4 min read',
    featured: false,
  },
  {
    title: 'How Mortgage Interest Works: A Beginner Guide',
    slug: 'how-mortgage-interest-works',
    cat: 'Finance',
    desc: 'A clear explanation of how mortgage interest accrues, amortization works, and impacts your total loan cost.',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'How Much House Can I Afford',
    slug: 'how-much-house-can-i-afford',
    cat: 'Finance',
    desc: 'Learn the key factors lenders consider and how to calculate your home buying budget.',
    readTime: '7 min read',
    featured: false,
  },
  {
    title: 'What Is Loan Amortization and Why Does It Matter',
    slug: 'what-is-loan-amortization',
    cat: 'Finance',
    desc: 'Understand how loan amortization schedules work and why they matter for your financial planning.',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'Fixed-Rate vs Adjustable-Rate Mortgage Guide',
    slug: 'fixed-vs-adjustable-rate-mortgage-guide',
    cat: 'Finance',
    desc: 'Compare the pros and cons of fixed-rate and adjustable-rate mortgages to choose the right one for you.',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'Understanding BMI: Body Mass Index Explained',
    slug: 'understanding-bmi',
    cat: 'Health',
    desc: 'Learn what BMI is, how it is calculated, its limitations, and how to interpret your results.',
    readTime: '4 min read',
    featured: true,
  },
  {
    title: 'How to Improve Your BMI and Maintain a Healthy Weight',
    slug: 'how-to-improve-bmi',
    cat: 'Health',
    desc: 'Evidence-based tips for achieving and maintaining a healthy BMI through nutrition and exercise.',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'Understanding Dimensional Weight in Shipping',
    slug: 'understanding-shipping-dim-weight',
    cat: 'Shipping',
    desc: 'Learn how carriers use dimensional weight to calculate shipping costs and how to minimize expenses.',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'How Shipping Costs Are Calculated: A Complete Guide',
    slug: 'how-shipping-costs-are-calculated',
    cat: 'Shipping',
    desc: 'A comprehensive overview of the factors that influence shipping costs and how to estimate them.',
    readTime: '7 min read',
    featured: false,
  },
  {
    title: 'How to Reduce Your Shipping Costs',
    slug: 'how-to-reduce-shipping-costs',
    cat: 'Shipping',
    desc: 'Practical strategies for e-commerce sellers and individuals to lower their shipping expenses.',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'International Shipping Guide: What You Need to Know',
    slug: 'international-shipping-guide',
    cat: 'Shipping',
    desc: 'Essential information for shipping internationally, including customs, duties, and documentation.',
    readTime: '8 min read',
    featured: false,
  },
  {
    title: 'Understanding AI Tokens: The Building Blocks of Language Models',
    slug: 'understanding-ai-tokens',
    cat: 'AI',
    desc: 'Learn what tokens are, how they affect AI costs, and why token counting matters for prompt optimization.',
    readTime: '5 min read',
    featured: true,
  },
  {
    title: 'How to Reduce Your AI API Costs',
    slug: 'how-to-reduce-ai-costs',
    cat: 'AI',
    desc: 'Practical strategies to optimize your AI spending through token reduction, prompt engineering, and caching.',
    readTime: '7 min read',
    featured: false,
  },
  {
    title: 'What Is Prompt Engineering: A Practical Guide',
    slug: 'what-is-prompt-engineering',
    cat: 'AI',
    desc: 'Master the art of writing effective prompts to get better results from AI models.',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'Understanding AI Context Windows: Limits and Optimization',
    slug: 'understanding-context-windows',
    cat: 'AI',
    desc: 'Learn how context windows work, their limitations, and strategies to maximize your AI conversations.',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'How to Calculate Age from a Date',
    slug: 'how-to-calculate-age',
    cat: 'Time',
    desc: 'Learn the correct methods for calculating age from birth dates for legal, medical, and personal use.',
    readTime: '4 min read',
    featured: false,
  },
  {
    title: 'Understanding Business Days: A Complete Guide',
    slug: 'understanding-business-days',
    cat: 'Time',
    desc: 'Learn how business days work, why they matter, and how to calculate deadlines correctly.',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'How Time Zones Work: A Practical Overview',
    slug: 'how-time-zones-work',
    cat: 'Time',
    desc: 'Understand UTC, daylight saving time, and how to convert between time zones accurately.',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'What Is a Leap Year: The Science Behind February 29',
    slug: 'what-is-leap-year',
    cat: 'Time',
    desc: 'Learn why leap years exist, the rules that govern them, and their impact on calendars and calculations.',
    readTime: '4 min read',
    featured: false,
  },
];

const categories = ['All', 'Finance', 'Health', 'Shipping', 'AI', 'Time'];

const categoryIcons: Record<string, typeof CreditCard> = {
  Finance: CreditCard,
  Health: Heart,
  Shipping: Truck,
  AI: Bot,
  Time: Clock,
};

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const canonicalUrl = 'https://www.calculatorpilotai.com/guides';

  const filteredGuides = activeCategory === 'All'
    ? allGuides
    : allGuides.filter(guide => guide.cat === activeCategory);

  const featuredGuides = allGuides.filter(guide => guide.featured);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: 'https://www.calculatorpilotai.com/' },
        { name: 'Guides', url: canonicalUrl }
      ]),
      generateFAQSchema([
        { question: 'What are these guides for?', answer: 'They explain the core concepts behind our calculators and link readers to the right tool.' },
        { question: 'Are the guides free?', answer: 'Yes, all guides and comparison pages are free to access.' }
      ])
    ]
  };

  return (
    <>
      <PageMeta
        title="Guides & Insights - CalcWise AI"
        description="Explore free finance, health, and shipping guides that explain the concepts behind our calculators."
        canonical={canonicalUrl}
        ogType="article"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-100 via-white to-slate-50 relative overflow-hidden hero-section">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm mb-6">
                <BookOpen className="w-4 h-4 min-w-4 min-h-4 text-primary" />
                <span className="text-sm font-medium text-slate-600">Guides & Insights</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
                Guides & <span className="text-primary">Insights</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                Practical guides to help you understand calculators, formulas, financial planning, health metrics, shipping rules, and AI tools.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Featured Guides */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-slate-900">Featured Guides</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredGuides.map((guide, i) => {
                const Icon = categoryIcons[guide.cat] || BookOpen;
                return (
                  <Link
                    key={i}
                    to={`/guides/${guide.slug}`}
                    className="group bg-white p-8 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-stabilize-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors icon-container-12">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded-full mb-2 card-badge">
                          {guide.cat}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                          {guide.desc}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">{guide.readTime}</span>
                          <span className="text-sm font-semibold text-primary flex items-center gap-1">
                            Read Guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Category Filter */}
          <section className="mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[2.25rem] min-w-[4rem] ${
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

          {/* All Guides Grid */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide, i) => {
                const Icon = categoryIcons[guide.cat] || BookOpen;
                return (
                  <Link
                    key={i}
                    to={`/guides/${guide.slug}`}
                    className="group bg-white p-6 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col guide-card"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded-full card-badge">
                        {guide.cat}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors icon-container-10">
                        <Icon className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2 tool-card-title">
                      {guide.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                      {guide.desc}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400">{guide.readTime}</span>
                      <span className="text-sm font-semibold text-primary flex items-center gap-1">
                        Read Guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
