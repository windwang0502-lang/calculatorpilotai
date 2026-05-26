import { Link } from 'react-router-dom';

export default function SiteHeader() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900">
          CALC<span className="text-primary">WISE</span> AI
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-widest text-slate-600">
          <Link to="/tools/finance" className="hover:text-primary transition-colors">Finance</Link>
          <Link to="/tools/health" className="hover:text-primary transition-colors">Health</Link>
          <Link to="/tools/time" className="hover:text-primary transition-colors">Time</Link>
          <Link to="/tools/ai" className="hover:text-primary transition-colors">AI</Link>
          <Link to="/tools/shipping" className="hover:text-primary transition-colors">Shipping</Link>
          <Link to="/guides" className="hover:text-primary transition-colors">Guides</Link>
          <Link to="/compare" className="hover:text-primary transition-colors">Compare</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
        </nav>
        <nav className="flex md:hidden gap-4 text-sm font-bold uppercase tracking-widest text-slate-600">
          <Link to="/guides" className="hover:text-primary transition-colors">Guides</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
        </nav>
      </div>
    </header>
  );
}
