import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import { generateFAQSchema } from '@/lib/schema';

const popularTools = [
  {
    title: 'Mortgage Calculator',
    desc: 'Estimate your monthly mortgage payment, total interest, and total cost over the life of your loan. Includes a full amortization schedule and interactive charts showing principal vs interest breakdown.',
    cta: 'Calculate Now',
    path: '/tools/finance/mortgage-calculator',
    cat: 'Finance',
  },
  {
    title: 'BMI & Calorie Calculator',
    desc: 'Calculate your Body Mass Index and daily caloric needs based on the scientifically validated Mifflin-St Jeor equation. Supports both metric (kg/cm) and imperial (lb/in) units for global accessibility.',
    cta: 'Check Health',
    path: '/tools/health/bmi-calorie-calculator',
    cat: 'Health',
  },
  {
    title: 'AI Text Detector',
    desc: 'Analyze any text to estimate the probability of AI generation using deterministic heuristic features including lexical diversity, sentence burstiness, and AI marker phrase detection.',
    cta: 'Analyze Text',
    path: '/tools/ai/ai-detector',
    cat: 'AI',
  },
  {
    title: 'Shipping DIM Weight Calculator',
    desc: 'Determine whether your package will be billed by actual weight or dimensional weight. Supports both US standard (divisor 139) and international metric (divisor 5000) shipping calculations.',
    cta: 'Calculate Shipping',
    path: '/tools/shipping/dim-weight-calculator',
    cat: 'Shipping',
  },
  {
    title: 'Age Calculator',
    desc: 'Calculate your exact age in years, months, and days from your birthdate. Also computes the total number of days between any two dates with leap-year-aware precision.',
    cta: 'Calculate Age',
    path: '/tools/time/age-calculator',
    cat: 'Time',
  },
];

const categories = [
  { name: 'Finance Tools', path: '/tools/finance', desc: 'Mortgage calculators, interest analyzers, and financial planning tools.', icon: '💰' },
  { name: 'Health Tools', path: '/tools/health', desc: 'BMI, calorie, and body composition calculators with AI health insights.', icon: '🩺' },
  { name: 'AI Tools', path: '/tools/ai', desc: 'AI text detection and content analysis powered by heuristic algorithms.', icon: '🤖' },
  { name: 'Shipping Tools', path: '/tools/shipping', desc: 'Dimensional weight and billable weight calculators for logistics.', icon: '📦' },
  { name: 'Time Tools', path: '/tools/time', desc: 'Age calculators and date difference tools with precision accuracy.', icon: '⏰' },
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
  const canonicalUrl = 'https://toolfactory.ai/';
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
        <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          {/* Hero */}
          <section className="text-center mb-20 md:mb-28">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-tight text-balance">
              Free AI Calculators<br/><span className="text-primary">and Online Tools</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Professional-grade calculators and detectors enhanced with AI insights. Built for US users who need fast, accurate, and free tools for finance, health, shipping, and more.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/tools/finance/mortgage-calculator" className="bg-slate-900 text-white font-bold py-3 px-6 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm">
                Try Mortgage Calculator
              </Link>
              <Link to="/tools/health/bmi-calorie-calculator" className="bg-white border-2 border-slate-900 text-slate-900 font-bold py-3 px-6 rounded hover:bg-slate-50 transition-colors uppercase tracking-widest text-sm">
                Try BMI Calculator
              </Link>
            </div>
          </section>

          {/* Popular Tools */}
          <section className="mb-20 md:mb-28">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Popular Tools</p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Most Used Calculators</h2>
              </div>
              <Link to="/tools/finance" className="hidden md:block text-sm font-bold text-primary hover:underline">View All Tools →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTools.map((tool, i) => (
                <Link key={i} to={tool.path} className="group bg-white p-6 md:p-8 border border-slate-200 hover:border-primary transition-all rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded mb-3 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">{tool.cat}</span>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">{tool.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{tool.desc}</p>
                  <div className="flex items-center text-sm font-bold text-primary group-hover:gap-2 transition-all mt-auto">
                    {tool.cta} <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section className="mb-20 md:mb-28">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Categories</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-8">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((cat, i) => (
                <Link key={i} to={cat.path} className="group bg-white p-6 border border-slate-200 rounded-lg hover:border-primary transition-all text-center">
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-20 md:mb-28 bg-white border rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">How It Works</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Three Simple Steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl font-black text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Use Our Tools */}
          <section className="mb-20 md:mb-28">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Why CalcWise AI</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Built for Users Like You</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {whyUs.map((item, i) => (
                <div key={i} className="bg-white p-6 border rounded-lg text-center">
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Homepage FAQ */}
          <section className="mb-20 md:mb-28">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">FAQ</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              {homeFaqs.map((faq, i) => (
                <div key={i} className="bg-white p-6 border rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Internal Links */}
          <section className="mb-20 md:mb-28">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Explore More</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Discover Our Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/guides" className="group bg-white p-8 border rounded-lg hover:border-primary transition-all text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Guides & Tutorials</h3>
                <p className="text-slate-500 text-sm">In-depth articles on mortgages, BMI, shipping costs, and more.</p>
              </Link>
              <Link to="/compare" className="group bg-white p-8 border rounded-lg hover:border-primary transition-all text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Comparison Tools</h3>
                <p className="text-slate-500 text-sm">Side-by-side analysis to help you make informed decisions.</p>
              </Link>
              <Link to="/about" className="group bg-white p-8 border rounded-lg hover:border-primary transition-all text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">About CalcWise AI</h3>
                <p className="text-slate-500 text-sm">Learn about our mission, team, and commitment to free AI tools.</p>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
              <Link to="/tools/finance/mortgage-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Mortgage Calculator</Link>
              <Link to="/tools/health/bmi-calorie-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">BMI Calculator</Link>
              <Link to="/tools/shipping/dim-weight-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Shipping Calculator</Link>
              <Link to="/tools/ai/ai-detector" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">AI Detector</Link>
              <Link to="/tools/time/age-calculator" className="text-center text-sm text-slate-500 hover:text-primary transition-colors py-2">Age Calculator</Link>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">Start Calculating Today</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              Join thousands of users who rely on CalcWise AI for fast, accurate, and free calculations. No sign-up required.
            </p>
            <Link to="/tools/finance" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm">
              Explore All Tools
            </Link>
          </section>
        </main>
      </div>
    </>
  );
}
