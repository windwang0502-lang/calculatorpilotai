import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { searchTools, SearchableTool } from '@/data/toolSearchData';
import { ToolCategory } from '@/data/tools';
import { trackSearch, trackToolClick } from '@/lib/analytics';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  finance: 'Finance',
  health: 'Health',
  ai: 'AI',
  shipping: 'Shipping',
  time: 'Time',
};

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchableTool[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchTools(query, 8);
      setResults(searchResults);
      setSelectedIndex(0);
      trackSearch(query, searchResults.length);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          trackToolClick(results[selectedIndex].slug, 'search');
          navigate(results[selectedIndex].route);
          onClose();
          setQuery('');
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        setQuery('');
        break;
    }
  }, [results, selectedIndex, navigate, onClose]);

  const handleResultClick = (tool: SearchableTool) => {
    trackToolClick(tool.slug, 'search');
    navigate(tool.route);
    onClose();
    setQuery('');
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
          setQuery('');
        }
      }}
    >
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search calculators..."
              className="flex-1 text-lg outline-none placeholder:text-slate-400"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          {query.trim() && (
            <div className="max-h-[400px] overflow-y-auto">
              {results.length > 0 ? (
                <ul className="py-2">
                  {results.map((tool, index) => (
                    <li key={tool.slug}>
                      <button
                        onClick={() => handleResultClick(tool)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                          index === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-900 truncate">
                              {highlightMatch(tool.name, query)}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full flex-shrink-0">
                              {CATEGORY_LABELS[tool.category]}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {highlightMatch(tool.description, query)}
                          </p>
                        </div>
                        {index === selectedIndex && (
                          <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <p className="text-sm">No calculators found for "{query}"</p>
                  <p className="text-xs mt-1">Try searching for a different term</p>
                </div>
              )}
            </div>
          )}

          {/* Footer hint */}
          {query.trim() && results.length > 0 && (
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono">↓</kbd>
                <span className="ml-1">navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono">Enter</kbd>
                <span className="ml-1">open</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
