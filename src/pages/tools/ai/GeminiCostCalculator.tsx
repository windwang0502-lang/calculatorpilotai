import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type ModelOption = {
  id: string;
  name: string;
  inputPerMillion: number;
  outputPerMillion: number;
  audioPerMinute?: number;
};

const geminiModels: ModelOption[] = [
  { id: 'claude-opus-4-7', name: 'Gemini 2.5 Pro', inputPerMillion: 1.25, outputPerMillion: 5, audioPerMinute: 0.15 },
  { id: 'claude-opus-4-7', name: 'Gemini 2.5 Flash', inputPerMillion: 0.075, outputPerMillion: 0.3, audioPerMinute: 0.15 },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', inputPerMillion: 0.1, outputPerMillion: 0.4 },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', inputPerMillion: 1.25, outputPerMillion: 5 },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', inputPerMillion: 0.075, outputPerMillion: 0.3 },
  { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B', inputPerMillion: 0.0375, outputPerMillion: 0.15 },
  { id: 'gemini-exp-1206', name: 'Gemini Experimental 1206', inputPerMillion: 1.25, outputPerMillion: 10 },
];

export default function GeminiCostCalculator() {
  const [selectedModel, setSelectedModel] = useState('claude-opus-4-7');
  const [inputTokens, setInputTokens] = useState(10000);
  const [outputTokens, setOutputTokens] = useState(2000);
  const [useBatch, setUseBatch] = useState(false);

  const model = useMemo(() => {
    return geminiModels.find(m => m.id === selectedModel) || geminiModels[0];
  }, [selectedModel]);

  const costs = useMemo(() => {
    const inputMultiplier = useBatch ? 0.5 : 1;
    const outputMultiplier = useBatch ? 0.75 : 1;

    const inputCost = (inputTokens / 1000000) * model.inputPerMillion * inputMultiplier;
    const outputCost = (outputTokens / 1000000) * model.outputPerMillion * outputMultiplier;
    const totalCost = inputCost + outputCost;

    return {
      inputCost,
      outputCost,
      totalCost,
      savings: useBatch ? (inputTokens / 1000000) * model.inputPerMillion * 0.5 : 0,
    };
  }, [inputTokens, outputTokens, model, useBatch]);

  return (
    <ToolLayout toolId="gemini-cost" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Gemini API Costs</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                API Type
              </label>
              <div className="flex gap-4">
                <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${!useBatch ? 'bg-primary/5 border-primary' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="apiType"
                    checked={!useBatch}
                    onChange={() => setUseBatch(false)}
                    className="sr-only"
                  />
                  <span className="font-semibold">Standard</span>
                  <p className="text-xs text-muted-foreground mt-1">Real-time processing</p>
                </label>
                <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${useBatch ? 'bg-primary/5 border-primary' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="apiType"
                    checked={useBatch}
                    onChange={() => setUseBatch(true)}
                    className="sr-only"
                  />
                  <span className="font-semibold">Batch</span>
                  <p className="text-xs text-muted-foreground mt-1">50% off input, 64k+ tokens</p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="model-select" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Gemini Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
              >
                {geminiModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} - ${m.inputPerMillion}/1M in, ${m.outputPerMillion}/1M out
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <button onClick={() => setInputTokens(1000000)} className="hover:text-primary underline">1M</button>
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
            </div>

            {useBatch && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-800">
                  <strong>Batch API:</strong> Input tokens at 50% off, output tokens at 75% of standard price.
                  Requires at least 64K tokens in the input. Turnaround time is approximately 1 minute.
                </p>
              </div>
            )}

            {model.audioPerMinute && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Audio Processing:</strong> ${model.audioPerMinute}/minute for audio input.
                  Also supports image and video input at token-equivalent pricing.
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
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Input Cost</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">${costs.inputCost.toFixed(4)}</div>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Total Cost</span>
            <div className="text-2xl font-mono font-bold text-purple-700">${costs.totalCost.toFixed(4)}</div>
          </div>
        </div>

        {costs.savings > 0 && (
          <div className="bg-emerald-100 border border-emerald-300 rounded-xl p-4 text-center">
            <span className="text-emerald-800 font-semibold">
              Batch API saves ${costs.savings.toFixed(4)} on input!
            </span>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">
                Input Tokens {useBatch && <span className="text-emerald-600">(50% off)</span>}
              </span>
              <div className="text-right">
                <div className="font-mono font-semibold">${costs.inputCost.toFixed(4)}</div>
                <div className="text-xs text-muted-foreground">
                  {inputTokens.toLocaleString()} × ${useBatch ? (model.inputPerMillion * 0.5) : model.inputPerMillion}/1M
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">
                Output Tokens {useBatch && <span className="text-amber-600">(25% off)</span>}
              </span>
              <div className="text-right">
                <div className="font-mono font-semibold">${costs.outputCost.toFixed(4)}</div>
                <div className="text-xs text-muted-foreground">
                  {outputTokens.toLocaleString()} × ${useBatch ? (model.outputPerMillion * 0.75) : model.outputPerMillion}/1M
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
          <h3 className="text-lg font-bold mb-4">Gemini Model Pricing</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-semibold">Model</th>
                  <th className="text-right py-3 px-3 font-semibold">Input</th>
                  <th className="text-right py-3 px-3 font-semibold">Output</th>
                  <th className="text-right py-3 px-3 font-semibold">Audio</th>
                </tr>
              </thead>
              <tbody>
                {geminiModels.map(m => (
                  <tr key={m.id} className={`border-b border-slate-100 ${m.id === selectedModel ? 'bg-primary/5' : ''}`}>
                    <td className={`py-3 px-3 ${m.id === selectedModel ? 'text-primary font-semibold' : ''}`}>
                      {m.name} {m.id === selectedModel && '(Selected)'}
                    </td>
                    <td className="text-right py-3 px-3 font-mono">${m.inputPerMillion}/1M</td>
                    <td className="text-right py-3 px-3 font-mono">${m.outputPerMillion}/1M</td>
                    <td className="text-right py-3 px-3 font-mono">{m.audioPerMinute ? `$${m.audioPerMinute}/min` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Gemini offers some of the most competitive pricing in the industry, especially for high-volume use cases.
            Batch API requires at least 64K input tokens and has ~1 minute turnaround.
          </p>
        </div>
      </section>
    </ToolLayout>
  );
}
