import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

export default function TokenToWordCalculator() {
  const [tokenCount, setTokenCount] = useState(1000);
  const [modelType, setModelType] = useState<'gpt' | 'claude' | 'gemini'>('gpt');
  const [textType, setTextType] = useState<'general' | 'code' | 'technical'>('general');

  const results = useMemo(() => {
    const ratios = {
      gpt: { general: 0.75, code: 0.6, technical: 0.7 },
      claude: { general: 0.8, code: 0.65, technical: 0.75 },
      gemini: { general: 0.7, code: 0.55, technical: 0.65 },
    };
    const ratio = ratios[modelType][textType];
    const words = Math.floor(tokenCount * ratio);
    const characters = words * 5;

    return {
      words,
      characters,
      ratio,
    };
  }, [tokenCount, modelType, textType]);

  return (
    <ToolLayout toolId="token-to-word" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Convert Tokens to Words</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="token-count" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Number of Tokens
              </label>
              <input
                id="token-count"
                type="number"
                min="1"
                max="1000000"
                value={tokenCount}
                onChange={(e) => setTokenCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-lg"
              />
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <button
                  onClick={() => setTokenCount(100)}
                  className="hover:text-primary underline"
                >
                  100 tokens
                </button>
                <button
                  onClick={() => setTokenCount(1000)}
                  className="hover:text-primary underline"
                >
                  1K tokens
                </button>
                <button
                  onClick={() => setTokenCount(10000)}
                  className="hover:text-primary underline"
                >
                  10K tokens
                </button>
                <button
                  onClick={() => setTokenCount(100000)}
                  className="hover:text-primary underline"
                >
                  100K tokens
                </button>
                <button
                  onClick={() => setTokenCount(1000000)}
                  className="hover:text-primary underline"
                >
                  1M tokens
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
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Token Count</span>
            <div className="text-2xl font-mono font-bold text-blue-700">
              {tokenCount.toLocaleString()}
            </div>
            <span className="text-xs text-blue-600 mt-1 block">tokens</span>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Word Estimate</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">
              {results.words.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-600 mt-1 block">words</span>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Characters</span>
            <div className="text-2xl font-mono font-bold text-amber-700">
              {results.characters.toLocaleString()}
            </div>
            <span className="text-xs text-amber-600 mt-1 block">chars</span>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Avg Words/Token</span>
            <div className="text-2xl font-mono font-bold text-purple-700">
              {results.ratio.toFixed(2)}
            </div>
            <span className="text-xs text-purple-600 mt-1 block">ratio</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Token to Word Comparison by Model</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold">Model</th>
                  <th className="text-right py-3 px-4 font-semibold">Words (General)</th>
                  <th className="text-right py-3 px-4 font-semibold">Words (Code)</th>
                  <th className="text-right py-3 px-4 font-semibold">Words (Technical)</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { model: 'GPT Models', type: 'gpt' },
                  { model: 'Claude Models', type: 'claude' },
                  { model: 'Gemini Models', type: 'gemini' },
                ] as const).map((row) => {
                  const ratios = {
                    gpt: { general: 0.75, code: 0.6, technical: 0.7 },
                    claude: { general: 0.8, code: 0.65, technical: 0.75 },
                    gemini: { general: 0.7, code: 0.55, technical: 0.65 },
                  };
                  return (
                    <tr key={row.type} className={`border-b border-slate-100 ${row.type === modelType ? 'bg-primary/5' : ''}`}>
                      <td className={`py-3 px-4 font-medium ${row.type === modelType ? 'text-primary' : ''}`}>
                        {row.model} {row.type === modelType && '(Selected)'}
                      </td>
                      <td className="text-right py-3 px-4 font-mono">
                        {Math.floor(tokenCount * ratios[row.type].general).toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4 font-mono">
                        {Math.floor(tokenCount * ratios[row.type].code).toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4 font-mono">
                        {Math.floor(tokenCount * ratios[row.type].technical).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Understanding Token-to-Word Conversion</h3>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Token-to-word conversion is an approximation because tokens don't map perfectly to words.
              A token can be a partial word, a complete word, or multiple words depending on the model's tokenizer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <h4 className="font-semibold text-foreground mb-2">General Text</h4>
                <p className="text-sm">~0.65-0.80 words per token. Common English words tokenize efficiently.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <h4 className="font-semibold text-foreground mb-2">Code</h4>
                <p className="text-sm">~0.55-0.65 words per token. Symbols and special characters increase token count.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <h4 className="font-semibold text-foreground mb-2">Technical</h4>
                <p className="text-sm">~0.65-0.75 words per token. Long technical terms may use multiple tokens.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
