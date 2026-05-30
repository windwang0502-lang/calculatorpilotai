import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type ModelProvider = 'openai' | 'anthropic' | 'google' | 'meta' | 'mistral';

interface ModelContextInfo {
  provider: string;
  model: string;
  contextWindow: number;
  pricing: { input: number; output: number };
}

const contextWindows: ModelContextInfo[] = [
  { provider: 'OpenAI', model: 'GPT-4o', contextWindow: 128000, pricing: { input: 2.5, output: 10 } },
  { provider: 'OpenAI', model: 'GPT-4o Mini', contextWindow: 128000, pricing: { input: 0.15, output: 0.6 } },
  { provider: 'OpenAI', model: 'GPT-4.1', contextWindow: 128000, pricing: { input: 2, output: 8 } },
  { provider: 'OpenAI', model: 'GPT-4 Turbo', contextWindow: 128000, pricing: { input: 10, output: 30 } },
  { provider: 'Anthropic', model: 'Claude Opus 4', contextWindow: 200000, pricing: { input: 15, output: 75 } },
  { provider: 'Anthropic', model: 'Claude Opus 4', contextWindow: 200000, pricing: { input: 3, output: 15 } },
  { provider: 'Anthropic', model: 'Claude Opus 4', contextWindow: 200000, pricing: { input: 3, output: 15 } },
  { provider: 'Anthropic', model: 'Claude 3.5 Sonnet', contextWindow: 200000, pricing: { input: 3, output: 15 } },
  { provider: 'Google', model: 'Gemini 1.5 Pro', contextWindow: 1000000, pricing: { input: 1.25, output: 5 } },
  { provider: 'Google', model: 'Gemini 1.5 Flash', contextWindow: 1000000, pricing: { input: 0.075, output: 0.3 } },
  { provider: 'Google', model: 'Gemini 2.0 Flash', contextWindow: 1000000, pricing: { input: 0.1, output: 0.4 } },
  { provider: 'Meta', model: 'Llama 3.3 70B', contextWindow: 128000, pricing: { input: 0.9, output: 0.9 } },
  { provider: 'Mistral', model: 'Mistral Large', contextWindow: 128000, pricing: { input: 2, output: 6 } },
];

export default function ContextWindowCalculator() {
  const [inputTokens, setInputTokens] = useState(50000);
  const [selectedModel, setSelectedModel] = useState(4);

  const model = contextWindows[selectedModel];

  const analysis = useMemo(() => {
    const percentUsed = (inputTokens / model.contextWindow) * 100;
    const remainingTokens = model.contextWindow - inputTokens;
    const remainingPercent = 100 - percentUsed;

    const inputCost = (inputTokens / 1000000) * model.pricing.input;
    const outputCostEstimate = (remainingTokens / 1000000) * model.pricing.output;

    const pages = (inputTokens / 750).toFixed(1);
    const pagesRemaining = (remainingTokens / 750).toFixed(1);

    return {
      percentUsed: percentUsed.toFixed(1),
      remainingTokens,
      remainingPercent: remainingPercent.toFixed(1),
      inputCost,
      outputCostEstimate,
      pages,
      pagesRemaining,
      isNearLimit: percentUsed > 80,
      isOverLimit: inputTokens > model.contextWindow,
    };
  }, [inputTokens, model]);

  const documentTypes = useMemo(() => [
    { name: 'Short Email', tokens: 500 },
    { name: 'Blog Post', tokens: 2000 },
    { name: 'Short Story', tokens: 10000 },
    { name: 'Research Paper', tokens: 30000 },
    { name: 'Novel Chapter', tokens: 50000 },
    { name: 'Full Novel', tokens: 250000 },
    { name: 'Codebase (1K lines)', tokens: 15000 },
    { name: 'Legal Document', tokens: 100000 },
  ], []);

  return (
    <ToolLayout toolId="context-window" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Context Window Calculator</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="model-select" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Select Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(parseInt(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
              >
                {contextWindows.map((m, idx) => (
                  <option key={`${m.provider}-${m.model}`} value={idx}>
                    {m.provider} {m.model} - {(m.contextWindow / 1000).toLocaleString()}K context
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="input-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Input Tokens
              </label>
              <input
                id="input-tokens"
                type="number"
                min="0"
                max={model.contextWindow * 2}
                value={inputTokens}
                onChange={(e) => setInputTokens(Math.max(0, parseInt(e.target.value) || 0))}
                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-lg ${
                  analysis.isOverLimit ? 'border-red-500 bg-red-50' : ''
                }`}
              />
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <button onClick={() => setInputTokens(1000)} className="hover:text-primary underline">1K</button>
                <button onClick={() => setInputTokens(10000)} className="hover:text-primary underline">10K</button>
                <button onClick={() => setInputTokens(50000)} className="hover:text-primary underline">50K</button>
                <button onClick={() => setInputTokens(100000)} className="hover:text-primary underline">100K</button>
                <button onClick={() => setInputTokens(500000)} className="hover:text-primary underline">500K</button>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 ${analysis.isOverLimit ? 'bg-red-50 border border-red-200' : 'bg-white border border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Context Window Usage</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              analysis.isOverLimit ? 'bg-red-100 text-red-700' :
              analysis.isNearLimit ? 'bg-amber-100 text-amber-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {analysis.isOverLimit ? 'Over Limit!' :
               analysis.isNearLimit ? 'Near Limit' : 'Within Context'}
            </span>
          </div>

          <div className="h-8 bg-slate-200 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-500 ${
                analysis.isOverLimit ? 'bg-red-500' :
                analysis.isNearLimit ? 'bg-amber-500' :
                'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, analysis.percentUsed)}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground mb-6">
            <span>0 ({inputTokens.toLocaleString()} used)</span>
            <span>100% ({model.contextWindow.toLocaleString()} max)</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-mono font-bold ${analysis.isOverLimit ? 'text-red-600' : 'text-foreground'}`}>
                {analysis.percentUsed}%
              </div>
              <div className="text-xs text-muted-foreground">Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-emerald-600">
                {Math.max(0, analysis.remainingTokens).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-blue-600">{analysis.pages}</div>
              <div className="text-xs text-muted-foreground">Pages (~750 words)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-amber-600">
                ~{analysis.remainingPages} pages
              </div>
              <div className="text-xs text-muted-foreground">Pages Remaining</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Context Window Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-semibold">Model</th>
                  <th className="text-right py-3 px-3 font-semibold">Context</th>
                  <th className="text-right py-3 px-3 font-semibold">Tokens</th>
                  <th className="text-right py-3 px-3 font-semibold">Pages</th>
                </tr>
              </thead>
              <tbody>
                {contextWindows.map((m, idx) => {
                  const isSelected = idx === selectedModel;
                  return (
                    <tr key={`${m.provider}-${m.model}`} className={`border-b border-slate-100 ${isSelected ? 'bg-primary/5' : ''}`}>
                      <td className={`py-3 px-3 ${isSelected ? 'text-primary font-semibold' : ''}`}>
                        {m.provider} {m.model}
                      </td>
                      <td className="text-right py-3 px-3 font-mono">
                        {(m.contextWindow / 1000).toLocaleString()}K
                      </td>
                      <td className="text-right py-3 px-3 font-mono">
                        {m.contextWindow.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-3 font-mono">
                        {(m.contextWindow / 750).toFixed(0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Document Sizes in Context</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documentTypes.map((doc) => {
              const percent = (doc.tokens / model.contextWindow) * 100;
              const fits = doc.tokens <= model.contextWindow;
              return (
                <div key={doc.name} className={`p-4 rounded-lg border ${fits ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{doc.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${fits ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {fits ? 'Fits' : 'Too Large'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${fits ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {doc.tokens.toLocaleString()} tokens ({percent.toFixed(1)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Context Window Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Reserve Space for Output</h4>
              <p className="text-sm text-muted-foreground">
                Leave 20-30% of context for the model's response. If you need 50K tokens output, plan for 100K+ input.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Chunk Long Documents</h4>
              <p className="text-sm text-muted-foreground">
                For documents exceeding context, use semantic chunking. Process chapters or sections separately with overlap.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
