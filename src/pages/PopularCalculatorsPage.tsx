import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { categories, getPopularTools, getFeaturedTools } from '@/data/tools';
import { TrendingUp, ArrowRight, Star, Calculator, CreditCard, Heart, Bot, Truck, Clock } from 'lucide-react';

export default function PopularCalculatorsPage() {
  const popularTools = getPopularTools();
  const featuredTools = getFeaturedTools();

  const toolIcons: Record<string, typeof Calculator> = {
    finance: CreditCard,
    health: Heart,
    ai: Bot,
    shipping: Truck,
    time: Clock,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Popular Calculators',
    description: 'Discover our most popular calculators used by thousands of people daily.',
  };

  return (
    <>
      <PageMeta
        title="Popular Calculators - Most Used Free Online Tools | CalcWise AI"
        description="Discover our most popular calculators. Mortgage, BMI, loan, and shipping calculators used by thousands daily."
        canonical="https://www.calculatorpilotai.com/popular-calculators"
        jsonLd={jsonLd}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { name: 'Home', url: '/' },
          { name: 'Calculators', url: '/calculators' },
          { name: 'Popular' },
        ]} />

        {/* Header */}
        <div className="mt-8 mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">{popularTools.length} Popular Tools</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Popular Calculators
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover our most used calculators. These tools are trusted by thousands of users for accurate, fast calculations.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <Calculator className="w-4 h-4" /> All Calculators
            </Link>
            <Link to="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Read Guides
            </Link>
          </div>
        </div>

        {/* Popular Tools Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, index) => {
              const Icon = toolIcons[tool.category] || Calculator;
              const cat = categories.find(c => c.id === tool.category);
              return (
                <Link
                  key={tool.slug}
                  to={tool.route}
                  className="group relative p-8 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  {index < 3 && (
                    <div className="absolute -top-3 left-4 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Top {index + 1}
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{cat?.name}</span>
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">{tool.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{tool.description}</p>
                  <div className="flex items-center text-sm font-semibold text-primary">
                    Use Calculator <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Section */}
        <section className="mb-12 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Featured Calculators</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.slice(0, 6).map((tool) => {
              const Icon = toolIcons[tool.category] || Calculator;
              const cat = categories.find(c => c.id === tool.category);
              return (
                <Link
                  key={tool.slug}
                  to={tool.route}
                  className="group p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-amber-400" />
                    <span className="text-xs text-white/60">{cat?.name}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">{tool.name}</h3>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link to="/calculators" className="inline-flex items-center gap-2 text-white font-semibold hover:underline">
              View All Calculators <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Browse by Category */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const popularCount = cat.tools.filter(t => t.popular).length;
              return (
                <Link
                  key={cat.id}
                  to={`/tools/${cat.id}`}
                  className="group p-6 bg-slate-50 border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 group-hover:border-primary group-hover:bg-primary/5 transition-colors">
                    <Icon className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{popularCount} popular</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
