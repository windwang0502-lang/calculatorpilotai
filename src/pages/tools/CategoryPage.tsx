import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { getCategoryById, categories } from '@/data/tools';
import { Calculator, ArrowRight, BookOpen, Star, TrendingUp, Grid3X3 } from 'lucide-react';

// Featured guides by category
const CATEGORY_GUIDES: Record<string, Array<{ title: string; path: string }>> = {
  finance: [
    { title: 'What Is a Mortgage', path: '/guides/what-is-mortgage' },
    { title: 'How Mortgage Interest Works', path: '/guides/how-mortgage-interest-works' },
    { title: 'How to Reduce Mortgage Interest', path: '/guides/how-to-reduce-mortgage-interest' },
    { title: 'Understanding Loan Amortization', path: '/guides/what-is-loan-amortization' },
  ],
  health: [
    { title: 'Understanding BMI', path: '/guides/understanding-bmi' },
    { title: 'How to Improve BMI', path: '/guides/how-to-improve-bmi' },
  ],
  shipping: [
    { title: 'Understanding DIM Weight', path: '/guides/understanding-shipping-dim-weight' },
    { title: 'How Shipping Costs Are Calculated', path: '/guides/how-shipping-costs-are-calculated' },
    { title: 'How to Reduce Shipping Costs', path: '/guides/how-to-reduce-shipping-costs' },
  ],
  ai: [
    { title: 'Understanding AI Tokens', path: '/guides/understanding-ai-tokens' },
    { title: 'How to Reduce AI Costs', path: '/guides/how-to-reduce-ai-costs' },
    { title: 'What Is Prompt Engineering', path: '/guides/what-is-prompt-engineering' },
  ],
  time: [
    { title: 'How to Calculate Age', path: '/guides/how-to-calculate-age' },
    { title: 'Understanding Business Days', path: '/guides/understanding-business-days' },
    { title: 'How Time Zones Work', path: '/guides/how-time-zones-work' },
  ],
};

export default function CategoryPage() {
  const { category } = useParams();
  const categoryData = category ? getCategoryById(category as any) : null;

  if (!categoryData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Category not found</h1>
        <Link to="/calculators" className="text-primary hover:underline">Browse all calculators</Link>
      </div>
    );
  }

  const Icon = categoryData.icon;
  const categoryGuides = CATEGORY_GUIDES[category] || [];
  const relatedCategories = categories.filter(c => c.id !== category).slice(0, 3);
  const popularTools = categoryData.tools.filter(t => t.popular);
  const featuredTools = categoryData.tools.filter(t => t.featured);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryData.name} Calculators`,
    description: categoryData.description,
  };

  return (
    <>
      <PageMeta
        title={`${categoryData.name} Calculators - Free Online Tools`}
        description={categoryData.description}
        canonical={`https://www.calculatorpilotai.com/tools/${category}`}
        jsonLd={jsonLd}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { name: 'Home', url: '/' },
          { name: 'Calculators', url: '/calculators' },
          { name: categoryData.name },
        ]} />

        {/* Category Header */}
        <div className="mt-8 mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            {categoryData.name} Calculators
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {categoryData.description}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <Grid3X3 className="w-4 h-4" /> All Calculators
            </Link>
            <Link to="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <BookOpen className="w-4 h-4" /> Browse Guides
            </Link>
            <Link to="/popular-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <TrendingUp className="w-4 h-4" /> Popular Tools
            </Link>
          </div>
        </div>

        {/* Popular Tools */}
        {popularTools.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-slate-900">Popular in {categoryData.name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTools.map((tool) => (
                <Link
                  key={tool.slug}
                  to={tool.route}
                  className="group p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl hover:border-primary hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">{tool.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                    Use Tool <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Guides */}
        {categoryGuides.length > 0 && (
          <section className="mb-12 p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-slate-900">Featured {categoryData.name} Guides</h2>
              </div>
              <Link to="/guides" className="text-sm font-semibold text-primary hover:underline">
                All Guides →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryGuides.map((guide) => (
                <Link
                  key={guide.path}
                  to={guide.path}
                  className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all"
                >
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{categoryData.name}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-primary transition-colors">{guide.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Tools */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">All {categoryData.name} Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryData.tools.map((tool) => (
              <Link
                key={tool.slug}
                to={tool.route}
                className="group p-8 border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Calculator</span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors mt-1">{tool.name}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{tool.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    {tool.featured && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Featured</span>
                    )}
                    {tool.new && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">New</span>
                    )}
                    {tool.popular && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Popular</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-primary flex items-center">
                    Calculate <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Related Categories */}
        <section className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white">
          <h2 className="text-xl font-bold mb-6 text-center">Explore Other Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.path}
                className="group p-6 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 transition-colors">
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white">{cat.name}</h3>
                <p className="text-sm text-white/70 mt-1">{cat.tools.length} tools</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/calculators" className="inline-flex items-center gap-2 text-white font-semibold hover:underline">
              View All Calculators <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
