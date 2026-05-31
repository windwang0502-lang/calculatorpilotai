import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import { generateFAQSchema } from '@/lib/schema';
import {
  Calculator,
  Sparkles,
  UserCheck,
  Flag,
  TrendingUp,
  Grid3X3,
  ArrowRight,
  CreditCard,
  Heart,
  Bot,
  Truck,
  Clock,
  Shield,
  Lock,
  RefreshCw,
  Eye,
  CheckCircle,
  BookOpen,
  Star,
  Zap,
} from 'lucide-react';
import { categories, getPopularTools, getFeaturedTools, getToolStats, getNewTools } from '@/data/tools';

const popularTools = getPopularTools().map(tool => ({
  title: tool.name,
  desc: tool.description,
  cta: 'Calculate Now',
  path: tool.route,
  cat: tool.category.charAt(0).toUpperCase() + tool.category.slice(1),
  icon: categories.find(c => c.id === tool.category)?.icon || Calculator,
}));

const featuredTools = getFeaturedTools().slice(0, 6).map(tool => ({
  title: tool.name,
  desc: tool.description,
  cta: 'Try Now',
  path: tool.route,
  cat: tool.category.charAt(0).toUpperCase() + tool.category.slice(1),
  icon: categories.find(c => c.id === tool.category)?.icon || Calculator,
}));

const newTools = getNewTools().slice(0, 6).map(tool => ({
  title: tool.name,
  desc: tool.description,
  cta: 'New Tool',
  path: tool.route,
  cat: tool.category.charAt(0).toUpperCase() + tool.category.slice(1),
  icon: categories.find(c => c.id === tool.category)?.icon || Calculator,
  isNew: true,
}));

// Featured guides
const featuredGuides = [
  { title: 'What Is a Mortgage', path: '/guides/what-is-mortgage', cat: 'Finance', icon: CreditCard },
  { title: 'Understanding BMI', path: '/guides/understanding-bmi', cat: 'Health', icon: Heart },
  { title: 'Understanding AI Tokens', path: '/guides/understanding-ai-tokens', cat: 'AI', icon: Bot },
  { title: 'How Time Zones Work', path: '/guides/how-time-zones-work', cat: 'Time', icon: Clock },
];

const categoriesData = categories.map(cat => ({
  name: cat.name + ' Tools',
  path: cat.path,
  desc: cat.description,
  icon: cat.icon,
}));

const trustBadges = [
  { icon: UserCheck, text: 'Free to Use' },
  { icon: Sparkles, text: 'AI-Powered Insights' },
  { icon: Flag, text: 'No Signup Required' },
  { icon: Flag, text: 'Built for US Users' },
];

const toolStats = getToolStats();

const stats = [
  { value: `${toolStats.totalTools}+`, label: 'Free Tools' },
  { value: Object.keys(toolStats.byCategory).length.toString(), label: 'Tool Categories' },
  { value: 'Weekly', label: 'Updated' },
];

const howItWorks = [
  { step: '01', title: 'Choose a Tool', desc: 'Browse our collection of free calculators across finance, health, shipping, AI, and time categories.' },
  { step: '02', title: 'Enter Your Data', desc: 'Fill in your numbers using simple input fields. All calculations run instantly in your browser.' },
  { step: '03', title: 'Get Results & AI Insights', desc: 'Receive accurate calculations along with contextual AI insights that help you understand what the numbers mean.' },
];

const whyUs = [
  { title: '100% Free', desc: 'Every calculator and tool is completely free. No hidden fees, no subscriptions, no credit card required.' },
  { title: 'Lightning Fast', desc: 'All calculations run instantly in your browser. No server delays, no loading screens.' },
  { title: 'Mobile Friendly', desc: 'Fully responsive design works perfectly on phones, tablets, and desktop screens of all sizes.' },
  { title: 'AI Enhanced', desc: 'Beyond raw numbers, our AI Insight engine provides contextual analysis and actionable recommendations.' },
  { title: 'Privacy First', desc: 'Your data never leaves your device. All calculations are performed locally in your browser.' },
];

const homeFaqs = [
  { q: 'Are all calculators on CalcWise AI free to use?', a: 'Yes. Every calculator, detector, and tool on CalcWise AI is 100% free to use. We do not require accounts, subscriptions, or payment information.' },
  { q: 'How accurate are the calculation results?', a: 'Our calculators use industry-standard formulas and algorithms. However, all results are estimates for informational purposes only and should not replace professional advice.' },
  { q: 'Is my data safe when using these tools?', a: 'Absolutely. All calculations run entirely in your browser. We do not collect, store, or transmit your personal data or calculator inputs to any server.' },
  { q: 'What is AI Insight and how does it work?', a: 'AI Insight is a contextual analysis feature that runs after each calculation. It interprets your results and provides personalized recommendations, risk assessments, and actionable suggestions.' },
  { q: 'Do the calculators work on mobile devices?', a: 'Yes. Every tool is fully responsive and optimized for mobile, tablet, and desktop use. You can calculate on any device with a web browser.' },
  { q: 'Can I request a new calculator or tool?', a: 'Absolutely. We welcome suggestions for new tools. Use our Contact page to submit your idea, and we will consider it for our development roadmap.' },
];

export default function HomePage() {
  const canonicalUrl = 'https://www.calculatorpilotai.com/';
  const faqSchema = generateFAQSchema(homeFaqs.map(f => ({ question: f.q, answer: f.a })));

  return (
    <>
      <PageMeta
        title="Free AI Calculators and Online Tools — CalcWise AI"
        description="Free AI-powered calculators for finance, health, shipping, and productivity. Mortgage calculator, BMI calculator, AI detector, shipping DIM weight tool, and more."
        canonical={canonicalUrl}
        ogType="website"
        jsonLd={faqSchema}
      />
      <div className="min-h-screen bg-slate-50">
        <main>
          {/* Hero Section with subtle gradient background */}
          <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 hero-section">
            {/* Decorative shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-blue-500/3 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-tight text-balance">
                  Free AI Calculators<br/><span className="text-primary">and Online Tools</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                  Professional-grade calculators and detectors enhanced with AI insights. Built for US users who need fast, accurate, and free tools for finance, health, shipping, and more.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link to="/tools/finance/mortgage-calculator" className="bg-slate-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-sm min-h-[48px] min-w-[180px] inline-flex items-center justify-center cta-button">
                    Try Mortgage Calculator
                  </Link>
                  <Link to="/tools/health/bmi-calorie-calculator" className="bg-white border-2 border-slate-900 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-sm min-h-[48px] min-w-[180px] inline-flex items-center justify-center cta-button">
                    Try BMI Calculator
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-16 flex flex-wrap justify-center gap-4 md:gap-6 trust-badges">
                {trustBadges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm trust-badge">
                    <badge.icon className="w-4 h-4 min-w-4 min-h-4 text-primary" />
                    <span className="text-sm font-medium text-slate-600">{badge.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 max-w-xl mx-auto stats-grid">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-slate-900 stat-value">{stat.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Popular Tools Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Popular Tools</p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Most Used Calculators</h2>
              </div>
              <Link to="/calculators" className="hidden md:flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 popular-tools-grid">
              {popularTools.map((tool, i) => (
                <Link key={i} to={tool.path} className="group bg-white p-6 md:p-8 border border-slate-200 hover:border-primary transition-all duration-300 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 h-full flex flex-col tool-card">
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full card-badge">
                      {tool.cat}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors icon-container-10">
                      <tool.icon className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 tool-card-title">{tool.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{tool.desc}</p>
                  <div className="flex items-center text-sm font-semibold text-primary">
                    {tool.cta} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link to="/calculators" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Featured Calculators Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 bg-white">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Featured</p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Featured Calculators</h2>
              </div>
              <Link to="/calculators" className="hidden md:flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool, i) => (
                <Link key={i} to={tool.path} className="group bg-slate-50 p-6 border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-300 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <tool.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{tool.cat}</span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{tool.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{tool.desc}</p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                    {tool.cta} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* New Calculators Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Just Added
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">New Calculators</h2>
              </div>
              <Link to="/calculators" className="hidden md:flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                Browse All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newTools.map((tool, i) => (
                <Link key={i} to={tool.path} className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-6 border border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 rounded-xl relative overflow-hidden">
                  {tool.isNew && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                      New
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <tool.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{tool.cat}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">{tool.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Guides Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 bg-white">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Guides
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Featured Guides</h2>
              </div>
              <Link to="/guides" className="hidden md:flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                All Guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGuides.map((guide, i) => (
                <Link key={i} to={guide.path} className="group bg-slate-50 p-6 border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-300 rounded-xl text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <guide.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{guide.cat}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 group-hover:text-primary transition-colors">{guide.title}</h3>
                  <p className="text-xs text-slate-500 mt-2">Learn more →</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Categories Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 bg-white">
            <div className="mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Categories</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 categories-grid">
              {categoriesData.map((cat, i) => (
                <Link key={i} to={cat.path} className="group bg-slate-50 p-6 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center category-card">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 group-hover:border-primary group-hover:bg-primary/5 transition-colors icon-container-14">
                    <cat.icon className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">How It Works</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Three Simple Steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((item, i) => (
                <div key={i} className="text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm card-stabilize">
                  <div className="text-5xl font-black text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Us Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 bg-white">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Why CalcWise AI</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Built for Users Like You</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {whyUs.map((item, i) => (
                <div key={i} className="bg-slate-50 p-6 border border-slate-200 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Trust CalcWise AI Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-slate-300">E-E-A-T Verified</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Why Trust CalcWise AI</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  We are committed to providing accurate, transparent, and reliable tools. Here's what sets us apart.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">Transparent Formulas</h3>
                  <p className="text-sm text-slate-400">Every calculation shows exactly how results are computed. No black boxes.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-bold mb-2">100% Free Access</h3>
                  <p className="text-sm text-slate-400">Every tool is completely free. No hidden fees, subscriptions, or paywalls.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-bold mb-2">Privacy Focused</h3>
                  <p className="text-sm text-slate-400">All calculations run locally in your browser. We never store your data.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-bold mb-2">Continuously Updated</h3>
                  <p className="text-sm text-slate-400">We regularly update our tools to ensure accuracy and add new features.</p>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-black text-primary">100%</div>
                    <div className="text-sm text-slate-400">Browser-Based</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-primary">0</div>
                    <div className="text-sm text-slate-400">Data Stored</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-primary">Free</div>
                    <div className="text-sm text-slate-400">Forever</div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link
                  to="/editorial-policy"
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Read our Editorial Policy →
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">FAQ</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              {homeFaqs.map((faq, i) => (
                <div key={i} className="bg-white p-6 border border-slate-200 rounded-2xl hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Resources Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Explore More</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Discover Our Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/guides" className="group bg-white p-8 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center card-stabilize">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors icon-container-14">
                  <Calculator className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Guides & Tutorials</h3>
                <p className="text-slate-500 text-sm">In-depth articles on mortgages, BMI, shipping costs, and more.</p>
              </Link>
              <Link to="/compare" className="group bg-white p-8 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center card-stabilize">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors icon-container-14">
                  <TrendingUp className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Comparison Tools</h3>
                <p className="text-slate-500 text-sm">Side-by-side analysis to help you make informed decisions.</p>
              </Link>
              <Link to="/about" className="group bg-white p-8 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center card-stabilize">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors icon-container-14">
                  <Sparkles className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">About CalcWise AI</h3>
                <p className="text-slate-500 text-sm">Learn about our mission and commitment to free AI tools.</p>
              </Link>
            </div>
          </section>

          {/* Quick Links Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 bg-white">
            <div className="text-center mb-10">
              <h2 className="text-xl font-bold text-slate-900">Quick Links</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Link to="/tools/finance/mortgage-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Mortgage Calculator</Link>
              <Link to="/tools/finance/loan-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Loan Calculator</Link>
              <Link to="/tools/finance/apr-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">APR Calculator</Link>
              <Link to="/tools/finance/refinance-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Refinance Calculator</Link>
              <Link to="/tools/finance/interest-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Interest Calculator</Link>
              <Link to="/tools/finance/debt-payoff-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Debt Payoff</Link>
              <Link to="/tools/health/bmi-calorie-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">BMI Calculator</Link>
              <Link to="/tools/health/bmr-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">BMR Calculator</Link>
              <Link to="/tools/health/body-fat-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Body Fat Calculator</Link>
              <Link to="/tools/health/protein-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Protein Calculator</Link>
              <Link to="/tools/health/ideal-weight-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Ideal Weight</Link>
              <Link to="/tools/health/water-intake-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Water Intake</Link>
              <Link to="/tools/shipping/dim-weight-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Shipping Calculator</Link>
              <Link to="/tools/ai/ai-detector" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">AI Detector</Link>
              <Link to="/tools/ai/prompt-generator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Prompt Generator</Link>
              <Link to="/tools/ai/ai-humanizer" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">AI Humanizer</Link>
              <Link to="/tools/ai/image-prompt-generator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Image Prompt</Link>
              <Link to="/tools/ai/email-generator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Email Generator</Link>
              <Link to="/tools/ai/title-generator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Title Generator</Link>
              <Link to="/tools/time/age-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Age Calculator</Link>
              <Link to="/tools/time/date-difference-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Date Difference</Link>
              <Link to="/tools/time/business-days-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Business Days</Link>
              <Link to="/tools/time/countdown-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Countdown</Link>
              <Link to="/tools/time/time-duration-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Time Duration</Link>
              <Link to="/tools/time/age-at-date-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Age At Date</Link>
              <Link to="/guides/what-is-mortgage" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Mortgage Guide</Link>
              <Link to="/guides/understanding-bmi" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">BMI Guide</Link>
              <Link to="/guides/understanding-shipping-dim-weight" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Shipping Guide</Link>
              <Link to="/compare/fixed-vs-variable-mortgage" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Fixed vs Variable</Link>
              <Link to="/compare/15-year-vs-30-year-mortgage" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">15 vs 30 Year</Link>
              <Link to="/compare/bmi-vs-body-fat-percentage" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">BMI vs Body Fat</Link>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl" />
              </div>
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">Start Calculating Today</h2>
                <p className="text-slate-400 max-w-xl mx-auto mb-8">
                  Join thousands of users who rely on CalcWise AI for fast, accurate, and free calculations. No sign-up required.
                </p>
                <Link to="/tools" className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 min-h-[48px] min-w-[180px] justify-center cta-button">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
