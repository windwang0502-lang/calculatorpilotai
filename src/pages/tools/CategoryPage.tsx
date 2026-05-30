import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryById } from '@/data/tools';

export default function CategoryPage() {
  const { category } = useParams();
  const categoryData = category ? getCategoryById(category as any) : null;

  if (!categoryData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Category not found</h1>
        <Link to="/tools" className="text-primary hover:underline">Browse all tools</Link>
      </div>
    );
  }

  const Icon = categoryData.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Link to="/" className="text-sm font-bold text-primary uppercase tracking-widest mb-4 inline-block">← Back to Home</Link>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter">{categoryData.name.toUpperCase()} TOOLS</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryData.tools.map((tool) => (
          <Link
            key={tool.slug}
            to={tool.route}
            className="block group p-8 border rounded-lg hover:border-primary transition-all"
          >
            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors mb-2">{tool.name}</h2>
            <p className="text-muted-foreground mt-2">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
