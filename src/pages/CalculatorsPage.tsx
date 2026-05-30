import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { categories, getPopularTools, getFeaturedTools, getNewTools } from '@/data/tools';
import { Calculator, ArrowRight, Star, TrendingUp, Zap, BookOpen, Filter } from 'lucide-react';
import { useState } from 'react';

export default function CalculatorsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'all' | 'popular' | 'featured' | 'new'>('all');

  const popularTools = getPopularTools();
  const featuredTools = getFeaturedTools();
  const newTools = getNewTools();

  const allTools = categories.flatMap(cat =>
    cat.tools.map(tool => ({ ...tool, categoryName: cat.name, categoryId: cat.id }))
  );

  const filteredTools = allTools.filter(tool => {
    const categoryMatch = activeCategory === 'all' || tool.categoryId === activeCategory;
    const sortMatch =
      sortBy === 'all' ||
      (sortBy === 'popular' && tool.popular) ||
      (sortBy === 'featured' && tool.featured) ||
      (sortBy === 'new' && tool.new);
    return categoryMatch && sortMatch;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Calculators',
    description: 'Browse our complete collection of free online calculators for finance, health, shipping, AI, and time.',
  };

  return (
    <>
      <PageMeta
        title="All Calculators - Free Online Tools | CalcWise AI"
        description="Browse our complete collection of 89+ free online calculators. Finance, health, shipping, AI, and time tools with AI-powered insights."
        canonical="https://www.calculatorpilotai.com/calculators"
        jsonLd={jsonLd}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { name: 'Home', url: '/' },
          { name: 'Calculators' },
        ]} />

        {/* Header */}
        <div className="mt-8 mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">89+ Tools</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            All Calculators
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Browse our complete collection of free online calculators. Filter by category or sort to find the tool you need.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link to="/popular-calculators" className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:shadow-md transition-all">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-slate-900">Popular</span>
          </Link>
          <Link to="/guides" className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:shadow-md transition-all">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-900">Guides</span>
          </Link>
          <Link to="/tools/finance" className="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl hover:shadow-md transition-all">
            <Star className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-900">Finance</span>
          </Link>
          <Link to="/html-sitemap" className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-xl hover:shadow-md transition-all">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-semibold text-slate-900">Sitemap</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'popular' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setSortBy('featured')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'featured' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setSortBy('new')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'new' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              New
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-500 mb-6">
          Showing {filteredTools.length} calculator{filteredTools.length !== 1 ? 's' : ''}
        </p>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const cat = categories.find(c => c.id === tool.categoryId);
            const Icon = cat?.icon || Calculator;
            return (
              <Link
                key={tool.slug}
                to={tool.route}
                className="group p-6 border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{tool.categoryName}</span>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">{tool.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{tool.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {tool.featured && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 inline mr-1" />Featured
                      </span>
                    )}
                    {tool.new && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        <Zap className="w-3 h-3 inline mr-1" />New
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-primary flex items-center">
                    Calculate <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Category Cards */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const toolCount = cat.tools.length;
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
                  <p className="text-xs text-slate-500 mt-1">{toolCount} tools</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
