import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, Calculator } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { categories, allTools, Tool, ToolCategory } from '@/data/tools';
import { searchTools, SearchableTool } from '@/data/toolSearchData';

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  finance: 'Finance',
  health: 'Health',
  ai: 'AI',
  shipping: 'Shipping',
  time: 'Time',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'All Calculators & AI Tools | CalcWise AI',
  description: 'Browse all calculators and AI tools including finance, health, shipping, productivity, and AI cost calculators.',
  url: 'https://www.calculatorpilotai.com/tools',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.calculatorpilotai.com/' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.calculatorpilotai.com/tools' },
    ],
  },
};

export default function AllToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchTools(searchQuery, 20);
  }, [searchQuery]);

  const hasSearchResults = searchResults !== null;

  return (
    <>
      <PageMeta
        title="All Calculators & AI Tools | CalcWise AI"
        description="Browse all calculators and AI tools including finance, health, shipping, productivity, and AI cost calculators."
        canonical="https://www.calculatorpilotai.com/tools"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-100 via-white to-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
                All Calculators & AI Tools
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Professional-grade calculators and AI-powered tools. Browse by category or search for what you need.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search calculators..."
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-lg outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-lg"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-slate-500 mt-3 text-center">
                  {hasSearchResults
                    ? `Found ${searchResults.length} tool${searchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
                    : `No tools found for "${searchQuery}"`
                  }
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <Breadcrumb items={[
            { name: 'Home', url: '/' },
            { name: 'Tools' },
          ]} />

          {hasSearchResults ? (
            /* Search Results */
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Search Results</h2>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((tool) => (
                    <Link
                      key={tool.slug}
                      to={tool.route}
                      className="group bg-white p-6 border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {CATEGORY_LABELS[tool.category]}
                          </span>
                          <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors mt-1">
                            {tool.name}
                          </h3>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {tool.description}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No tools found</h3>
                  <p className="text-slate-500 mb-6">Try a different search term or browse by category</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Category Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={cat.path}
                    className="group bg-white p-6 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <cat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{cat.tools.length} tools</p>
                  </Link>
                ))}
              </div>

              {/* Tools by Category */}
              {categories.map((cat) => (
                <section key={cat.id} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <cat.icon className="w-5 h-5 text-primary" />
                      </div>
                      {cat.name} Tools
                      <span className="text-sm font-normal text-slate-500">({cat.tools.length})</span>
                    </h2>
                    <Link to={cat.path} className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                      View All <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        to={tool.route}
                        className="group bg-white p-5 border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
