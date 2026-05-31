import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Heart,
  Clock,
  Bot,
  Truck,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import GlobalSearch from '@/components/GlobalSearch';
import { searchTools, SearchableTool } from '@/data/toolSearchData';
import { ToolCategory } from '@/data/tools';

const toolCategories = [
  {
    category: 'Finance Tools',
    path: '/tools/finance',
    icon: CreditCard,
    tools: [
      { title: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator' },
      { title: 'Loan Calculator', path: '/tools/finance/loan-calculator' },
      { title: 'APR Calculator', path: '/tools/finance/apr-calculator' },
      { title: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator' },
      { title: 'Refinance Calculator', path: '/tools/finance/refinance-calculator' },
    ],
  },
  {
    category: 'Health Tools',
    path: '/tools/health',
    icon: Heart,
    tools: [
      { title: 'BMI & Calorie Calculator', path: '/tools/health/bmi-calorie-calculator' },
      { title: 'Calorie Calculator', path: '/tools/health/calorie-calculator' },
      { title: 'BMR Calculator', path: '/tools/health/bmr-calculator' },
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
      { title: 'Work Hours Calculator', path: '/tools/time/work-hours-calculator' },
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
      { title: 'Token Calculator', path: '/tools/ai/token-calculator' },
    ],
  },
  {
    category: 'Shipping Tools',
    path: '/tools/shipping',
    icon: Truck,
    tools: [
      { title: 'DIM Weight Calculator', path: '/tools/shipping/dim-weight-calculator' },
      { title: 'Freight Class Calculator', path: '/tools/shipping/freight-class-calculator' },
      { title: 'Shipping Cost Calculator', path: '/tools/shipping/shipping-cost-calculator' },
      { title: 'Package Volume Calculator', path: '/tools/shipping/package-volume-calculator' },
    ],
  },
];

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [desktopSearchQuery, setDesktopSearchQuery] = useState('');
  const [desktopSearchResults, setDesktopSearchResults] = useState<SearchableTool[]>([]);
  const [selectedResult, setSelectedResult] = useState(0);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const CATEGORY_LABELS: Record<ToolCategory, string> = {
    finance: 'Finance',
    health: 'Health',
    ai: 'AI',
    shipping: 'Shipping',
    time: 'Time',
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (desktopSearchQuery.trim()) {
      setDesktopSearchResults(searchTools(desktopSearchQuery, 6));
      setSelectedResult(0);
    } else {
      setDesktopSearchResults([]);
    }
  }, [desktopSearchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResult(prev => Math.min(prev + 1, desktopSearchResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResult(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (desktopSearchResults[selectedResult]) {
          navigate(desktopSearchResults[selectedResult].route);
          setDesktopSearchQuery('');
          setSearchOpen(false);
        }
        break;
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900 flex-shrink-0">
            CALC<span className="text-primary">WISE</span> AI
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={desktopSearchQuery}
                onChange={(e) => setDesktopSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => desktopSearchQuery.trim() && setDesktopSearchResults(searchTools(desktopSearchQuery, 6))}
                placeholder="Search calculators..."
                className="w-full pl-10 pr-16 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                autoComplete="off"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-2 py-0.5 text-[10px] text-slate-400 bg-white border border-slate-200 rounded">
                ⌘K
              </kbd>
            </div>

            {/* Desktop Search Results Dropdown */}
            {desktopSearchQuery.trim() && desktopSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[60]">
                <ul>
                  {desktopSearchResults.map((tool, index) => (
                    <li key={tool.slug}>
                      <Link
                        to={tool.route}
                        onClick={() => {
                          setDesktopSearchQuery('');
                        }}
                        onMouseEnter={() => setSelectedResult(index)}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                          index === selectedResult ? 'bg-slate-100' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 truncate">{tool.name}</span>
                            <span className="text-xs px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded flex-shrink-0">
                              {CATEGORY_LABELS[tool.category]}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{tool.description}</p>
                        </div>
                        {index === selectedResult && (
                          <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
                  Press Enter to open
                </div>
              </div>
            )}

            {desktopSearchQuery.trim() && desktopSearchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-6 text-center z-[60]">
                <p className="text-sm text-slate-500">No calculators found for "{desktopSearchQuery}"</p>
              </div>
            )}
          </div>

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

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-slate-600 hover:text-primary transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <div className="relative" ref={mobileMenuRef}>
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
      </div>
    </header>
    <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
  </>
  );
}

function Calculator({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}
