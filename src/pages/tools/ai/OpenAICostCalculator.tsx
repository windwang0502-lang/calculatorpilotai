import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type ModelOption = {
  id: string;
  name: string;
  inputPerMillion: number;
  outputPerMillion: number;
  cachedPerMillion?: number;
};

const openaiModels: ModelOption[] = [
  { id: 'gpt-4o', name: 'GPT-4o', inputPerMillion: 2.5, outputPerMillion: 10 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', inputPerMillion: 0.15, outputPerMillion: 0.6 },
  { id: 'gpt-4.1', name: 'GPT-4.1', inputPerMillion: 2, outputPerMillion: 8 },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', inputPerMillion: 10, outputPerMillion: 30 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', inputPerMillion: 0.5, outputPerMillion: 1.5 },
];

const batchModels: ModelOption[] = [
  { id: 'gpt-4o-batch', name: 'GPT-4o (Batch)', inputPerMillion: 1.25, outputPerMillion: 10 },
  { id: 'gpt-4o-mini-batch', name: 'GPT-4o Mini (Batch)', inputPerMillion: 0.075, outputPerMillion: 0.6 },
];

const embeddingModels = [
  { id: 'text-embedding-3-large', name: 'Embedding-3 Large', inputPerMillion: 0.13, dims: 3072 },
  { id: 'text-embedding-3-small', name: 'Embedding-3 Small', inputPerMillion: 0.02, dims: 1536 },
  { id: 'text-embedding-ada-002', name: 'Embedding Ada v2', inputPerMillion: 0.1, dims: 1536 },
];

export default function OpenAICostCalculator() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [inputTokens, setInputTokens] = useState(10000);
  const [outputTokens, setOutputTokens] = useState(2000);
  const [useBatch, setUseBatch] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);

  const model = useMemo(() => {
    const allModels = [...openaiModels, ...batchModels];
    return allModels.find(m => m.id === selectedModel) || openaiModels[0];
  }, [selectedModel, useBatch]);

  const costs = useMemo(() => {
    const inputCost = (inputTokens / 1000000) * model.inputPerMillion;
    const outputCost = (outputTokens / 1000000) * model.outputPerMillion;
    const totalCost = inputCost + outputCost;

    return {
      inputCost,
      outputCost,
      totalCost,
      per1KInput: (inputTokens / 1000) * (model.inputPerMillion / 1000),
      per1KOutput: (outputTokens / 1000) * (model.outputPerMillion / 1000),
    };
  }, [inputTokens, outputTokens, model]);

  const embeddingCost = useMemo(() => {
    if (!isEmbedding) return null;
    const model = embeddingModels.find(m => m.id === selectedModel);
    if (!model) return null;
    return {
      cost: (inputTokens / 1000000) * model.inputPerMillion,
      per1K: (inputTokens / 1000) * (model.inputPerMillion / 1000),
    };
  }, [isEmbedding, selectedModel, inputTokens]);

  return (
    <ToolLayout toolId="openai-cost" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate OpenAI API Costs</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Use Case
              </label>
              <div className="flex gap-4">
                <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${!isEmbedding ? 'bg-primary/5 border-primary' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="useCase"
                    checked={!isEmbedding}
                    onChange={() => setIsEmbedding(false)}
                    className="sr-only"
                  />
                  <span className="font-semibold">Chat Completions</span>
                  <p className="text-xs text-muted-foreground mt-1">GPT-4o, GPT-4.1, GPT-3.5</p>
                </label>
                <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${isEmbedding ? 'bg-primary/5 border-primary' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="useCase"
                    checked={isEmbedding}
                    onChange={() => setIsEmbedding(true)}
                    className="sr-only"
                  />
                  <span className="font-semibold">Embeddings</span>
                  <p className="text-xs text-muted-foreground mt-1">text-embedding-3</p>
                </label>
              </div>
            </div>

            {!isEmbedding && (
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
                    <span className="font-semibold">Standard API</span>
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
                    <span className="font-semibold">Batch API</span>
                    <p className="text-xs text-muted-foreground mt-1">50% off input, 24hr turnaround</p>
                  </label>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="model-select" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
              >
                {!isEmbedding && !useBatch && openaiModels.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
                {!isEmbedding && useBatch && batchModels.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
                {isEmbedding && embeddingModels.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {!isEmbedding && (
              <>
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
                      Output Tokens (Est.)
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
                      <button onClick={() => setOutputTokens(50000)} className="hover:text-primary underline">50K</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isEmbedding && (
              <div className="space-y-2">
                <label htmlFor="chars" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Characters to Embed
                </label>
                <input
                  id="chars"
                  type="number"
                  min="0"
                  value={inputTokens}
                  onChange={(e) => setInputTokens(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground">~{Math.ceil(inputTokens / 4)} tokens (at 4 chars/token)</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
              {isEmbedding ? 'Characters' : 'Input Tokens'}
            </span>
            <div className="text-2xl font-mono font-bold text-blue-700">
              {inputTokens.toLocaleString()}
            </div>
          </div>
          {!isEmbedding && (
            <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl text-center">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Output Tokens</span>
              <div className="text-2xl font-mono font-bold text-amber-700">
                {outputTokens.toLocaleString()}
              </div>
            </div>
          )}
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Input Cost</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">
              ${isEmbedding ? embeddingCost?.cost.toFixed(6) : costs.inputCost.toFixed(4)}
            </div>
          </div>
          {!isEmbedding && (
            <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl text-center">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Total Cost</span>
              <div className="text-2xl font-mono font-bold text-purple-700">
                ${costs.totalCost.toFixed(4)}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            {!isEmbedding && (
              <>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-muted-foreground">Input Cost</span>
                  <div className="text-right">
                    <div className="font-mono font-semibold">${costs.inputCost.toFixed(4)}</div>
                    <div className="text-xs text-muted-foreground">
                      {inputTokens.toLocaleString()} × ${model.inputPerMillion}/1M
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-muted-foreground">Output Cost</span>
                  <div className="text-right">
                    <div className="font-mono font-semibold">${costs.outputCost.toFixed(4)}</div>
                    <div className="text-xs text-muted-foreground">
                      {outputTokens.toLocaleString()} × ${model.outputPerMillion}/1M
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-between items-center py-3 bg-primary/5 -mx-6 px-6 rounded-lg">
              <span className="font-bold text-lg">Total Cost</span>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-primary">
                  ${isEmbedding ? embeddingCost?.cost.toFixed(6) : costs.totalCost.toFixed(4)}
                </div>
                {isEmbedding && <div className="text-xs text-muted-foreground">${embeddingModels.find(m => m.id === selectedModel)?.inputPerMillion}/1M tokens</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">OpenAI Pricing Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-semibold">Model</th>
                  <th className="text-right py-3 px-3 font-semibold">Input</th>
                  <th className="text-right py-3 px-3 font-semibold">Output</th>
                </tr>
              </thead>
              <tbody>
                {openaiModels.map(m => (
                  <tr key={m.id} className={`border-b border-slate-100 ${m.id === selectedModel && !useBatch ? 'bg-primary/5' : ''}`}>
                    <td className={`py-3 px-3 ${m.id === selectedModel && !useBatch ? 'text-primary font-semibold' : ''}`}>
                      {m.name} {m.id === selectedModel && !useBatch && '(Selected)'}
                    </td>
                    <td className="text-right py-3 px-3 font-mono">${m.inputPerMillion}/1M</td>
                    <td className="text-right py-3 px-3 font-mono">${m.outputPerMillion}/1M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Prices shown are for standard API. Batch API offers 50% discount on input tokens with 24-hour turnaround.
          </p>
        </div>
      </section>
    </ToolLayout>
  );
}
