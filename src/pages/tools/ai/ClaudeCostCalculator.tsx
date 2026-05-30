import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type ModelOption = {
  id: string;
  name: string;
  inputPerMillion: number;
  outputPerMillion: number;
  cacheRead?: number;
};

const claudeModels: ModelOption[] = [
  { id: 'claude-opus-4-7', name: 'Claude Opus 4.7', inputPerMillion: 15, outputPerMillion: 75, cacheRead: 1.5 },
  { id: 'claude-opus-4', name: 'Claude Opus 4', inputPerMillion: 15, outputPerMillion: 75, cacheRead: 1.5 },
  { id: 'claude-opus-4-7', name: 'Claude Opus 4.6', inputPerMillion: 3, outputPerMillion: 15, cacheRead: 0.3 },
  { id: 'claude-sonnet-4', name: 'Claude Opus 4', inputPerMillion: 3, outputPerMillion: 15, cacheRead: 0.3 },
  { id: 'claude-haiku-4', name: 'Claude Opus 4', inputPerMillion: 0.8, outputPerMillion: 4, cacheRead: 0.08 },
  { id: 'claude-opus-4-7', name: 'Claude', inputPerMillion: 3, outputPerMillion: 15, cacheRead: 0.3 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', inputPerMillion: 15, outputPerMillion: 75 },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', inputPerMillion: 0.25, outputPerMillion: 1.25 },
];

export default function ClaudeCostCalculator() {
  const [selectedModel, setSelectedModel] = useState('claude-opus-4-7');
  const [inputTokens, setInputTokens] = useState(10000);
  const [outputTokens, setOutputTokens] = useState(2000);
  const [cachedTokens, setCachedTokens] = useState(0);

  const model = useMemo(() => {
    return claudeModels.find(m => m.id === selectedModel) || claudeModels[0];
  }, [selectedModel]);

  const costs = useMemo(() => {
    const inputCost = (inputTokens / 1000000) * model.inputPerMillion;
    const outputCost = (outputTokens / 1000000) * model.outputPerMillion;

    let cacheCost = 0;
    if (model.cacheRead && cachedTokens > 0) {
      cacheCost = (cachedTokens / 1000000) * model.cacheRead;
    }

    const totalCost = inputCost + outputCost + cacheCost;

    return {
      inputCost,
      outputCost,
      cacheCost,
      totalCost,
    };
  }, [inputTokens, outputTokens, cachedTokens, model]);

  const effectiveInputCost = useMemo(() => {
    if (!model.cacheRead || cachedTokens === 0) return costs.inputCost;
    const uncachedTokens = Math.max(0, inputTokens - cachedTokens);
    const uncachedCost = (uncachedCost / 1000000) * model.inputPerMillion;
    const cachedCost = (cachedTokens / 1000000) * model.cacheRead;
    return uncachedCost + cachedCost;
  }, [inputTokens, cachedTokens, model, costs.inputCost]);

  return (
    <ToolLayout toolId="claude-cost" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Claude API Costs</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="model-select" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Claude Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
              >
                {claudeModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} - ${m.inputPerMillion}/1M in, ${m.outputPerMillion}/1M out
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="input-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Input Tokens
                </label>
                <input
                  id="input-tokens"
                  type="number"
                  min="0"
                  value={inputTokens}
                  onChange={(e) => setInputTokens(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <button onClick={() => setInputTokens(1000)} className="hover:text-primary underline">1K</button>
                  <button onClick={() => setInputTokens(10000)} className="hover:text-primary underline">10K</button>
                  <button onClick={() => setInputTokens(100000)} className="hover:text-primary underline">100K</button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="output-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Output Tokens
                </label>
                <input
                  id="output-tokens"
                  type="number"
                  min="0"
                  value={outputTokens}
                  onChange={(e) => setOutputTokens(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <button onClick={() => setOutputTokens(500)} className="hover:text-primary underline">500</button>
                  <button onClick={() => setOutputTokens(2000)} className="hover:text-primary underline">2K</button>
                  <button onClick={() => setOutputTokens(10000)} className="hover:text-primary underline">10K</button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="cached-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Cached Tokens
                </label>
                <input
                  id="cached-tokens"
                  type="number"
                  min="0"
                  max={inputTokens}
                  value={cachedTokens}
                  onChange={(e) => setCachedTokens(Math.min(inputTokens, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground">
                  {model.cacheRead ? `Cache read: $${model.cacheRead}/1M` : 'No caching available'}
                </p>
              </div>
            </div>

            {model.cacheRead && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-800 font-semibold">Extended Thinking / Caching</span>
                </div>
                <p className="text-sm text-amber-700">
                  With Extended Thinking, thinking tokens cost ${(model.outputPerMillion / 10).toFixed(2)}/1M.
                  With caching, repeated context costs only ${model.cacheRead}/1M (vs ${model.inputPerMillion}/1M for new input).
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Input Tokens</span>
            <div className="text-2xl font-mono font-bold text-blue-700">{inputTokens.toLocaleString()}</div>
          </div>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Output Tokens</span>
            <div className="text-2xl font-mono font-bold text-amber-700">{outputTokens.toLocaleString()}</div>
          </div>
          {model.cacheRead && (
            <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-center">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Cached Tokens</span>
              <div className="text-2xl font-mono font-bold text-purple-700">{cachedTokens.toLocaleString()}</div>
            </div>
          )}
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Total Cost</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">${costs.totalCost.toFixed(4)}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">
                Input Tokens {cachedTokens > 0 && `(${inputTokens - cachedTokens} new + ${cachedTokens} cached)`}
              </span>
              <div className="text-right">
                <div className="font-mono font-semibold">${costs.inputCost.toFixed(4)}</div>
                <div className="text-xs text-muted-foreground">
                  {inputTokens.toLocaleString()} × ${model.inputPerMillion}/1M
                </div>
              </div>
            </div>
            {costs.cacheCost > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-muted-foreground">Cache Read Discount</span>
                <div className="text-right">
                  <div className="font-mono font-semibold text-purple-600">-${costs.cacheCost.toFixed(4)}</div>
                  <div className="text-xs text-muted-foreground">
                    {cachedTokens.toLocaleString()} × ${model.cacheRead}/1M (vs ${model.inputPerMillion})
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Output Tokens</span>
              <div className="text-right">
                <div className="font-mono font-semibold">${costs.outputCost.toFixed(4)}</div>
                <div className="text-xs text-muted-foreground">
                  {outputTokens.toLocaleString()} × ${model.outputPerMillion}/1M
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary/5 -mx-6 px-6 rounded-lg">
              <span className="font-bold text-lg">Total Cost</span>
              <div className="text-2xl font-mono font-bold text-primary">${costs.totalCost.toFixed(4)}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Claude Model Pricing</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-semibold">Model</th>
                  <th className="text-right py-3 px-3 font-semibold">Input</th>
                  <th className="text-right py-3 px-3 font-semibold">Output</th>
                  <th className="text-right py-3 px-3 font-semibold">Cache Read</th>
                </tr>
              </thead>
              <tbody>
                {claudeModels.map(m => (
                  <tr key={m.id} className={`border-b border-slate-100 ${m.id === selectedModel ? 'bg-primary/5' : ''}`}>
                    <td className={`py-3 px-3 ${m.id === selectedModel ? 'text-primary font-semibold' : ''}`}>
                      {m.name} {m.id === selectedModel && '(Selected)'}
                    </td>
                    <td className="text-right py-3 px-3 font-mono">${m.inputPerMillion}/1M</td>
                    <td className="text-right py-3 px-3 font-mono">${m.outputPerMillion}/1M</td>
                    <td className="text-right py-3 px-3 font-mono">{m.cacheRead ? `$${m.cacheRead}/1M` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Cache read pricing applies when the model reads from cached context. New tokens are always charged at input rate.
          </p>
        </div>
      </section>
    </ToolLayout>
  );
}
