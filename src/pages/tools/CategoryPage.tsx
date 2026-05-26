import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CategoryPage() {
  const { category } = useParams();
  
  const allTools = [
    { title: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', cat: 'finance' },
    { title: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', cat: 'health' },
    { title: 'Age Calculator', path: '/tools/time/age-calculator', cat: 'time' },
    { title: 'AI Detector', path: '/tools/ai/ai-detector', cat: 'ai' },
    { title: 'Shipping DIM Weight', path: '/tools/shipping/dim-weight-calculator', cat: 'shipping' },
  ];

  const tools = allTools.filter(t => t.cat === category);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Link to="/" className="text-sm font-bold text-primary uppercase tracking-widest mb-4 inline-block">← Back to Home</Link>
      <h1 className="text-5xl font-black tracking-tighter mb-8 uppercase">{category} TOOLS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.length > 0 ? tools.map((tool, i) => (
          <Link key={i} to={tool.path} className="block group p-8 border rounded-lg hover:border-primary transition-all">
            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{tool.title}</h2>
            <p className="text-muted-foreground mt-2">Access our professional {tool.title.toLowerCase()} with AI insights.</p>
          </Link>
        )) : (
          <p className="text-muted-foreground">No tools found in this category.</p>
        )}
      </div>
    </div>
  );
}
