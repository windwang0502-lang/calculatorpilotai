import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Heart,
  Clock,
  Bot,
  Truck,
  ArrowRight,
} from 'lucide-react';

const toolCategories = [
  {
    category: 'Finance Tools',
    path: '/tools/finance',
    icon: CreditCard,
    tools: [
      { title: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator' },
      { title: 'Loan Calculator', path: '/tools/finance/loan-calculator' },
      { title: 'APR Calculator', path: '/tools/finance/apr-calculator' },
      { title: 'Refinance Calculator', path: '/tools/finance/refinance-calculator' },
    ],
  },
  {
    category: 'Health Tools',
    path: '/tools/health',
    icon: Heart,
    tools: [
      { title: 'BMI & Calorie Calculator', path: '/tools/health/bmi-calorie-calculator' },
      { title: 'BMR Calculator', path: '/tools/health/bmr-calculator' },
      { title: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator' },
      { title: 'Protein Calculator', path: '/tools/health/protein-calculator' },
    ],
  },
  {
    category: 'Time Tools',
    path: '/tools/time',
    icon: Clock,
    tools: [
      { title: 'Age Calculator', path: '/tools/time/age-calculator' },
      { title: 'Date Difference Calculator', path: '/tools/time/date-difference-calculator' },
      { title: 'Business Days Calculator', path: '/tools/time/business-days-calculator' },
      { title: 'Countdown Calculator', path: '/tools/time/countdown-calculator' },
    ],
  },
  {
    category: 'AI Tools',
    path: '/tools/ai',
    icon: Bot,
    tools: [
      { title: 'AI Text Detector', path: '/tools/ai/ai-detector' },
      { title: 'Prompt Generator', path: '/tools/ai/prompt-generator' },
      { title: 'AI Humanizer', path: '/tools/ai/ai-humanizer' },
      { title: 'Image Prompt Generator', path: '/tools/ai/image-prompt-generator' },
    ],
  },
  {
    category: 'Shipping Tools',
    path: '/tools/shipping',
    icon: Truck,
    tools: [
      { title: 'DIM Weight Calculator', path: '/tools/shipping/dim-weight-calculator' },
      { title: 'Freight Class Calculator', path: '/tools/shipping/freight-class-calculator' },
      { title: 'Package Volume Calculator', path: '/tools/shipping/package-volume-calculator' },
      { title: 'Chargeable Weight Calculator', path: '/tools/shipping/chargeable-weight-calculator' },
    ],
  },
];

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900">
          CALC<span className="text-primary">WISE</span> AI
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-600 items-center">
          <div className="relative group">
            <Link to="/tools" className="hover:text-primary transition-colors flex items-center gap-1">
              Tools
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 w-[900px] min-w-[900px]">
                <div className="grid grid-cols-5 gap-6">
                  {toolCategories.map((cat) => (
                    <div key={cat.category}>
                      <Link
                        to={cat.path}
                        className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-2 mb-3 group/link"
                      >
                        <cat.icon className="w-4 h-4 min-w-4 min-h-4 group-hover/link:text-primary transition-colors" />
                        {cat.category}
                      </Link>
                      <ul className="space-y-1">
                        {cat.tools.map((tool) => (
                          <li key={tool.path}>
                            <Link
                              to={tool.path}
                              className="text-sm text-slate-600 hover:text-primary hover:translate-x-1 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-all duration-200 block"
                            >
                              {tool.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={cat.path}
                        className="text-xs font-medium text-primary hover:underline mt-2 flex items-center gap-1"
                      >
                        View All <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                  <Link
                    to="/tools"
                    className="text-sm font-semibold text-primary hover:underline flex items-center justify-center gap-1"
                  >
                    View All Tools <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Link to="/guides" className="hover:text-primary transition-colors">Guides</Link>
          <Link to="/compare" className="hover:text-primary transition-colors">Compare</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
        </nav>

        <div className="md:hidden relative" ref={mobileMenuRef}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2">
              <div className="border-b border-slate-100 pb-2 mb-2">
                <button
                  onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                >
                  <span>All Tools</span>
                  <svg className={`w-4 h-4 transition-transform ${mobileCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileCategoryOpen && (
                  <div className="bg-slate-50">
                    <Link to="/tools/finance" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-primary hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      <CreditCard className="w-4 h-4 min-w-4 min-h-4" /> Finance Tools
                    </Link>
                    <Link to="/tools/health" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-primary hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      <Heart className="w-4 h-4 min-w-4 min-h-4" /> Health Tools
                    </Link>
                    <Link to="/tools/time" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-primary hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      <Clock className="w-4 h-4 min-w-4 min-h-4" /> Time Tools
                    </Link>
                    <Link to="/tools/ai" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-primary hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      <Bot className="w-4 h-4 min-w-4 min-h-4" /> AI Tools
                    </Link>
                    <Link to="/tools/shipping" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-primary hover:bg-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      <Truck className="w-4 h-4 min-w-4 min-h-4" /> Shipping Tools
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/tools" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <Calculator className="w-4 h-4 min-w-4 min-h-4" /> All Tools
              </Link>
              <Link to="/guides" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>Guides</Link>
              <Link to="/compare" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>Compare</Link>
              <Link to="/about" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Calculator({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}
