import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getRelatedTools, getToolByRoute } from '@/data/tools';

interface RelatedToolsProps {
  currentRoute: string;
  limit?: number;
}

export default function RelatedTools({ currentRoute, limit = 4 }: RelatedToolsProps) {
  const currentTool = getToolByRoute(currentRoute);

  if (!currentTool) {
    return null;
  }

  const relatedTools = getRelatedTools(currentTool, limit);

  return (
    <section className="bg-slate-50 -mx-4 px-4 py-12 mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-slate-900">Related Calculators</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedTools.map((tool) => (
            <Link
              key={tool.slug}
              to={tool.route}
              className="group bg-white p-5 border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                    {tool.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
