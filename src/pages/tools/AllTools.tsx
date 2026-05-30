import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import {
  CreditCard,
  Heart,
  Clock,
  Bot,
  Truck,
  ArrowRight,
} from 'lucide-react';

const allTools = [
  {
    category: 'Finance',
    path: '/tools/finance',
    icon: CreditCard,
    tools: [
      { title: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator' },
      { title: 'Loan Calculator', path: '/tools/finance/loan-calculator' },
      { title: 'APR Calculator', path: '/tools/finance/apr-calculator' },
      { title: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator' },
      { title: 'Refinance Calculator', path: '/tools/finance/refinance-calculator' },
      { title: 'Interest Calculator', path: '/tools/finance/interest-calculator' },
      { title: 'Debt Payoff Calculator', path: '/tools/finance/debt-payoff-calculator' },
    ],
  },
  {
    category: 'Health',
    path: '/tools/health',
    icon: Heart,
    tools: [
      { title: 'BMI & Calorie Calculator', path: '/tools/health/bmi-calorie-calculator' },
      { title: 'Calorie Calculator', path: '/tools/health/calorie-calculator' },
      { title: 'BMR Calculator', path: '/tools/health/bmr-calculator' },
      { title: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator' },
      { title: 'Protein Calculator', path: '/tools/health/protein-calculator' },
      { title: 'Ideal Weight Calculator', path: '/tools/health/ideal-weight-calculator' },
      { title: 'Water Intake Calculator', path: '/tools/health/water-intake-calculator' },
    ],
  },
  {
    category: 'Time',
    path: '/tools/time',
    icon: Clock,
    tools: [
      { title: 'Age Calculator', path: '/tools/time/age-calculator' },
      { title: 'Date Difference Calculator', path: '/tools/time/date-difference-calculator' },
      { title: 'Business Days Calculator', path: '/tools/time/business-days-calculator' },
      { title: 'Countdown Calculator', path: '/tools/time/countdown-calculator' },
      { title: 'Time Duration Calculator', path: '/tools/time/time-duration-calculator' },
      { title: 'Age At Date Calculator', path: '/tools/time/age-at-date-calculator' },
      { title: 'Work Hours Calculator', path: '/tools/time/work-hours-calculator' },
    ],
  },
  {
    category: 'AI',
    path: '/tools/ai',
    icon: Bot,
    tools: [
      { title: 'AI Text Detector', path: '/tools/ai/ai-detector' },
      { title: 'Prompt Generator', path: '/tools/ai/prompt-generator' },
      { title: 'AI Humanizer', path: '/tools/ai/ai-humanizer' },
      { title: 'Image Prompt Generator', path: '/tools/ai/image-prompt-generator' },
      { title: 'Email Generator', path: '/tools/ai/email-generator' },
      { title: 'Title Generator', path: '/tools/ai/title-generator' },
      { title: 'Token Calculator', path: '/tools/ai/token-calculator' },
    ],
  },
  {
    category: 'Shipping',
    path: '/tools/shipping',
    icon: Truck,
    tools: [
      { title: 'DIM Weight Calculator', path: '/tools/shipping/dim-weight-calculator' },
      { title: 'Freight Class Calculator', path: '/tools/shipping/freight-class-calculator' },
      { title: 'Shipping Cost Estimator', path: '/tools/shipping/shipping-cost-estimator' },
      { title: 'Shipping Cost Calculator', path: '/tools/shipping/shipping-cost-calculator' },
      { title: 'Package Volume Calculator', path: '/tools/shipping/package-volume-calculator' },
      { title: 'Chargeable Weight Calculator', path: '/tools/shipping/chargeable-weight-calculator' },
      { title: 'Pallet Calculator', path: '/tools/shipping/pallet-calculator' },
      { title: 'FedEx DIM Weight Calculator', path: '/tools/shipping/fedex-dim-weight-calculator' },
      { title: 'UPS DIM Weight Calculator', path: '/tools/shipping/ups-dim-weight-calculator' },
      { title: 'Shipping Volume Calculator', path: '/tools/shipping/shipping-volume-calculator' },
      { title: 'Oversize Charge Calculator', path: '/tools/shipping/oversize-charge-calculator' },
      { title: 'Freight Class Estimator', path: '/tools/shipping/freight-class-estimator' },
      { title: 'Freight Density Calculator', path: '/tools/shipping/freight-density-calculator' },
      { title: 'Package Cubic Feet Calculator', path: '/tools/shipping/package-cubic-feet-calculator' },
      { title: 'DIM Divisor Calculator', path: '/tools/shipping/dim-divisor-calculator' },
      { title: 'Shipment Cost Estimator', path: '/tools/shipping/shipment-cost-estimator' },
    ],
  },
];

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
            {allTools.map((cat) => (
              <Link
                key={cat.category}
                to={cat.path}
                className="group bg-white p-6 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <cat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{cat.category} Tools</h3>
                <p className="text-xs text-slate-500 mt-1">{cat.tools.length} tools</p>
              </Link>
            ))}
          </div>

          {/* Tools by Category */}
          {allTools.map((cat) => (
            <section key={cat.category} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <cat.icon className="w-5 h-5 text-primary" />
                  </div>
                  {cat.category} Tools
                </h2>
                <Link to={cat.path} className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.tools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="group bg-white p-5 border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {tool.title}
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
