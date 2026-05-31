import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { getPopularTools, Tool, ToolCategory } from '@/data/tools';

interface PopularToolsProps {
  limit?: number;
  excludeSlug?: string;
  title?: string;
  showViewAll?: boolean;
  variant?: 'grid' | 'list';
}

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  finance: 'Finance',
  health: 'Health',
  ai: 'AI',
  shipping: 'Shipping',
  time: 'Time',
};

export default function PopularTools({
  limit = 4,
  excludeSlug,
  title = 'Popular Calculators',
  showViewAll = true,
  variant = 'list',
}: PopularToolsProps) {
  const popularTools = getPopularTools()
    .filter(tool => tool.slug !== excludeSlug)
    .slice(0, limit);

  if (popularTools.length === 0) {
    return null;
  }

  return (
    <div className="p-6 bg-slate-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        {title}
      </h2>
      <div className={variant === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
        {popularTools.map((tool) => (
          <Link
            key={tool.slug}
            to={tool.route}
            className={`block bg-white/10 hover:bg-white/20 rounded-lg transition-colors ${
              variant === 'grid' ? 'p-3' : 'p-3'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <span className="font-medium text-sm text-white/90 block truncate">{tool.name}</span>
                <span className="text-xs text-white/50">{CATEGORY_LABELS[tool.category]}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 flex-shrink-0 ml-2" />
            </div>
          </Link>
        ))}
      </div>
      {showViewAll && (
        <Link
          to="/popular-calculators"
          className="flex items-center justify-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors font-semibold"
        >
          View All Popular <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

interface CompactPopularToolsProps {
  limit?: number;
  excludeSlug?: string;
}

export function CompactPopularTools({ limit = 4, excludeSlug }: CompactPopularToolsProps) {
  const popularTools = getPopularTools()
    .filter(tool => tool.slug !== excludeSlug)
    .slice(0, limit);

  if (popularTools.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {popularTools.map((tool) => (
        <Link
          key={tool.slug}
          to={tool.route}
          className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg transition-colors group"
        >
          <span className="text-sm text-slate-700 group-hover:text-primary transition-colors">
            {tool.name}
          </span>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {CATEGORY_LABELS[tool.category]}
          </span>
        </Link>
      ))}
    </div>
  );
}

interface InlinePopularToolsProps {
  limit?: number;
  excludeSlug?: string;
}

export function InlinePopularTools({ limit = 6, excludeSlug }: InlinePopularToolsProps) {
  const popularTools = getPopularTools()
    .filter(tool => tool.slug !== excludeSlug)
    .slice(0, limit);

  if (popularTools.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {popularTools.map((tool) => (
        <Link
          key={tool.slug}
          to={tool.route}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-primary hover:text-white text-slate-700 rounded-full text-sm transition-colors"
        >
          <span>{tool.name}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      ))}
    </div>
  );
}
