import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

export default function WordToTokenCalculator() {
  const [wordCount, setWordCount] = useState(1000);
  const [modelType, setModelType] = useState<'gpt' | 'claude' | 'gemini'>('gpt');
  const [textType, setTextType] = useState<'general' | 'code' | 'technical'>('general');

  const results = useMemo(() => {
    const ratios = {
      gpt: { general: 0.75, code: 0.6, technical: 0.7 },
      claude: { general: 0.8, code: 0.65, technical: 0.75 },
      gemini: { general: 0.7, code: 0.55, technical: 0.65 },
    };
    const ratio = ratios[modelType][textType];
    const tokens = Math.ceil(wordCount / ratio);
    const characters = wordCount * 5;

    return {
      tokens,
      characters,
      ratio,
    };
  }, [wordCount, modelType, textType]);

  return (
    <ToolLayout toolId="word-to-token" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Convert Words to Tokens</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="word-count" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Number of Words
              </label>
              <input
                id="word-count"
                type="number"
                min="1"
                max="100000"
                value={wordCount}
                onChange={(e) => setWordCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-lg"
              />
              <div className="flex gap-4 text-sm text-muted-foreground">
                <button
                  onClick={() => setWordCount(100)}
                  className="hover:text-primary underline"
                >
                  100 words
                </button>
                <button
                  onClick={() => setWordCount(500)}
                  className="hover:text-primary underline"
                >
                  500 words
                </button>
                <button
                  onClick={() => setWordCount(1000)}
                  className="hover:text-primary underline"
                >
                  1000 words
                </button>
                <button
                  onClick={() => setWordCount(5000)}
                  className="hover:text-primary underline"
                >
                  5000 words
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  AI Model
                </label>
                <div className="space-y-2">
                  {(['gpt', 'claude', 'gemini'] as const).map((model) => (
                    <label key={model} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="radio"
                        name="model"
                        value={model}
                        checked={modelType === model}
                        onChange={(e) => setModelType(e.target.value as typeof modelType)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-medium capitalize">
                        {model === 'gpt' ? 'GPT (OpenAI)' : model === 'claude' ? 'Claude (Anthropic)' : 'Gemini (Google)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Text Type
                </label>
                <div className="space-y-2">
                  {([
                    { value: 'general', label: 'General Text', desc: 'Blog posts, emails, articles' },
                    { value: 'code', label: 'Code / Programming', desc: 'Source code, technical docs' },
                    { value: 'technical', label: 'Technical / Scientific', desc: 'Research papers, docs' },
                  ] as const).map((type) => (
                    <label key={type.value} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="radio"
                        name="textType"
                        value={type.value}
                        checked={textType === type.value}
                        onChange={(e) => setTextType(e.target.value as typeof textType)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <span className="font-medium">{type.label}</span>
                        <p className="text-xs text-muted-foreground">{type.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Word Count</span>
            <div className="text-2xl font-mono font-bold text-blue-700">
              {wordCount.toLocaleString()}
            </div>
            <span className="text-xs text-blue-600 mt-1 block">words</span>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Token Estimate</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">
              {results.tokens.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-600 mt-1 block">tokens</span>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Characters</span>
            <div className="text-2xl font-mono font-bold text-amber-700">
              {results.characters.toLocaleString()}
            </div>
            <span className="text-xs text-amber-600 mt-1 block">chars</span>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Words/Token</span>
            <div className="text-2xl font-mono font-bold text-purple-700">
              {results.ratio.toFixed(2)}
            </div>
            <span className="text-xs text-purple-600 mt-1 block">ratio</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Token Estimate by Model</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['gpt', 'claude', 'gemini'] as const).map((model) => {
              const ratios = {
                gpt: { general: 0.75, code: 0.6, technical: 0.7 },
                claude: { general: 0.8, code: 0.65, technical: 0.75 },
                gemini: { general: 0.7, code: 0.55, technical: 0.65 },
              };
              const tokens = Math.ceil(wordCount / ratios[model][textType]);
              const isSelected = model === modelType;

              return (
                <div
                  key={model}
                  className={`p-4 rounded-lg border ${isSelected ? 'bg-primary/5 border-primary' : 'bg-slate-50 border-slate-200'}`}
                >
                  <div className="text-sm font-semibold text-muted-foreground mb-1">
                    {model === 'gpt' ? 'GPT Models' : model === 'claude' ? 'Claude Models' : 'Gemini Models'}
                  </div>
                  <div className={`text-xl font-mono font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    ~{tokens.toLocaleString()} tokens
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">How Token Estimation Works</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-4">
              Different AI models use different tokenization schemes. The word-to-token ratio varies based on:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>Text content:</strong> Common words tokenize efficiently; rare words may require multiple tokens</li>
              <li><strong>Code:</strong> Programming languages often have longer tokens due to symbols and syntax</li>
              <li><strong>Technical content:</strong> Scientific terms and formulas may tokenize differently</li>
              <li><strong>Model family:</strong> GPT, Claude, and Gemini use different tokenizers</li>
            </ul>
            <div className="bg-white rounded-lg p-4 mt-4 border border-slate-200">
              <code className="text-sm font-mono">
                Tokens = ceil(Words / Word-to-Token Ratio)
              </code>
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
