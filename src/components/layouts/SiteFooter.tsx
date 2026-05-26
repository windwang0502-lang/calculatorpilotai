import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-slate-900">Tools</h4>
            <div className="space-y-2">
              <Link to="/tools/finance/mortgage-calculator" className="block text-sm text-slate-500 hover:text-primary transition-colors">Mortgage Calculator</Link>
              <Link to="/tools/health/bmi-calorie-calculator" className="block text-sm text-slate-500 hover:text-primary transition-colors">BMI Calculator</Link>
              <Link to="/tools/time/age-calculator" className="block text-sm text-slate-500 hover:text-primary transition-colors">Age Calculator</Link>
              <Link to="/tools/ai/ai-detector" className="block text-sm text-slate-500 hover:text-primary transition-colors">AI Detector</Link>
              <Link to="/tools/shipping/dim-weight-calculator" className="block text-sm text-slate-500 hover:text-primary transition-colors">Shipping Calculator</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-slate-900">Categories</h4>
            <div className="space-y-2">
              <Link to="/tools/finance" className="block text-sm text-slate-500 hover:text-primary transition-colors">Finance</Link>
              <Link to="/tools/health" className="block text-sm text-slate-500 hover:text-primary transition-colors">Health</Link>
              <Link to="/tools/time" className="block text-sm text-slate-500 hover:text-primary transition-colors">Time</Link>
              <Link to="/tools/ai" className="block text-sm text-slate-500 hover:text-primary transition-colors">AI</Link>
              <Link to="/tools/shipping" className="block text-sm text-slate-500 hover:text-primary transition-colors">Shipping</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-slate-900">Resources</h4>
            <div className="space-y-2">
              <Link to="/guides" className="block text-sm text-slate-500 hover:text-primary transition-colors">Guides</Link>
              <Link to="/compare" className="block text-sm text-slate-500 hover:text-primary transition-colors">Compare</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-slate-900">Company</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-slate-500 hover:text-primary transition-colors">About Us</Link>
              <Link to="/contact" className="block text-sm text-slate-500 hover:text-primary transition-colors">Contact</Link>
              <Link to="/privacy-policy" className="block text-sm text-slate-500 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="block text-sm text-slate-500 hover:text-primary transition-colors">Terms of Use</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-slate-900">CalcWise AI</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Free AI-powered calculators and online tools for finance, health, shipping, and productivity. Built for speed, precision, and performance.
            </p>
          </div>
        </div>
        <div className="border-t pt-6 text-center">
          <p className="text-slate-400 text-sm font-medium">© 2026 CalcWise AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
