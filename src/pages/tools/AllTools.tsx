import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import { categories } from '@/data/tools';
import { ArrowRight } from 'lucide-react';

export default function AllToolsPage() {
  return (
    <>
      <PageMeta
        title="All Calculators and Online Tools — CalcWise AI"
        description="Browse all free AI-powered calculators and online tools. Finance, health, time, AI, and shipping tools with AI insights. No sign-up required."
        canonical="https://www.calculatorpilotai.com/tools"
      />
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-100 via-white to-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
                All Calculators and Online Tools
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Professional-grade calculators and AI-powered tools. Browse by category or explore all tools below.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-12">
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
                <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{cat.name} Tools</h3>
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
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
