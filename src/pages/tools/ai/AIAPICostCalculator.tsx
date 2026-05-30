import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type Provider = 'openai' | 'anthropic' | 'google' | 'meta' | 'mistral' | 'aws';

interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
}

const providerModels: Record<Provider, { name: string; models: Record<string, ModelPricing> }> = {
  openai: {
    name: 'OpenAI',
    models: {
      'GPT-4o': { inputPerMillion: 2.5, outputPerMillion: 10 },
      'GPT-4o Mini': { inputPerMillion: 0.15, outputPerMillion: 0.6 },
      'GPT-4.1': { inputPerMillion: 2, outputPerMillion: 8 },
      'GPT-4 Turbo': { inputPerMillion: 10, outputPerMillion: 30 },
      'GPT-3.5 Turbo': { inputPerMillion: 0.5, outputPerMillion: 1.5 },
    },
  },
  anthropic: {
    name: 'Anthropic',
    models: {
      'Claude Opus 4.7': { inputPerMillion: 15, outputPerMillion: 75 },
      'Claude Opus 4': { inputPerMillion: 15, outputPerMillion: 75 },
      'Claude Opus 4': { inputPerMillion: 3, outputPerMillion: 15 },
      'Claude Opus 4': { inputPerMillion: 0.8, outputPerMillion: 4 },
    },
  },
  google: {
    name: 'Google',
    models: {
      'Gemini 2.5 Pro': { inputPerMillion: 1.25, outputPerMillion: 5 },
      'Gemini 2.5 Flash': { inputPerMillion: 0.075, outputPerMillion: 0.3 },
      'Gemini 2.0 Flash': { inputPerMillion: 0.1, outputPerMillion: 0.4 },
      'Gemini 1.5 Pro': { inputPerMillion: 1.25, outputPerMillion: 5 },
      'Gemini 1.5 Flash': { inputPerMillion: 0.075, outputPerMillion: 0.3 },
    },
  },
  meta: {
    name: 'Meta',
    models: {
      'Llama 3.3 70B': { inputPerMillion: 0.9, outputPerMillion: 0.9 },
      'Llama 3.2 11B': { inputPerMillion: 0.2, outputPerMillion: 0.2 },
      'Llama 3.2 90B': { inputPerMillion: 0.4, outputPerMillion: 0.4 },
    },
  },
  mistral: {
    name: 'Mistral',
    models: {
      'Mistral Large': { inputPerMillion: 2, outputPerMillion: 6 },
      'Mistral Small': { inputPerMillion: 0.2, outputPerMillion: 0.6 },
    },
  },
  aws: {
    name: 'AWS Bedrock',
    models: {
      'Claude': { inputPerMillion: 3, outputPerMillion: 15 },
      'Claude 3.5 Haiku': { inputPerMillion: 0.8, outputPerMillion: 4 },
      'Titan Text Premier': { inputPerMillion: 1.25, outputPerMillion: 5 },
    },
  },
};

export default function AIAPICostCalculator() {
  const [selectedProvider, setSelectedProvider] = useState<Provider>('openai');
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [inputTokens, setInputTokens] = useState(10000);
  const [outputTokens, setOutputTokens] = useState(2000);
  const [requests, setRequests] = useState(1000);

  const provider = providerModels[selectedProvider];
  const model = provider.models[selectedModel];

  const costs = useMemo(() => {
    const inputCost = (inputTokens / 1000000) * model.inputPerMillion;
    const outputCost = (outputTokens / 1000000) * model.outputPerMillion;
    const perRequest = inputCost + outputCost;
    const totalCost = perRequest * requests;

    return {
      inputCost,
      outputCost,
      perRequest,
      totalCost,
    };
  }, [inputTokens, outputTokens, model, requests]);

  const allCosts = useMemo(() => {
    const results: { provider: string; model: string; cost: number }[] = [];
    for (const [prov, data] of Object.entries(providerModels)) {
      for (const [modelName, pricing] of Object.entries(data.models)) {
        const cost = (inputTokens / 1000000) * pricing.inputPerMillion +
                     (outputTokens / 1000000) * pricing.outputPerMillion;
        results.push({
          provider: data.name,
          model: modelName,
          cost,
        });
      }
    }
    return results.sort((a, b) => a.cost - b.cost);
  }, [inputTokens, outputTokens]);

  return (
    <ToolLayout toolId="ai-api-cost" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Compare AI API Costs Across Providers</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {(Object.entries(providerModels) as [Provider, typeof providerModels.openai][]).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedProvider(key);
                    setSelectedModel(Object.keys(data.models)[0]);
                  }}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedProvider === key
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-slate-200 hover:border-primary/50'
                  }`}
                >
                  <span className="font-semibold text-sm">{data.name}</span>
                </button>
              ))}
            </div>

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
                {Object.entries(provider.models).map(([name, pricing]) => (
                  <option key={name} value={name}>
                    {name} - ${pricing.inputPerMillion}/1M in, ${pricing.outputPerMillion}/1M out
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="input-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Input Tokens per Request
                </label>
                <input
                  id="input-tokens"
                  type="number"
                  min="0"
                  value={inputTokens}
                  onChange={(e) => setInputTokens(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
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
              </div>
              <div className="space-y-2">
                <label htmlFor="requests" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Number of Requests
                </label>
                <input
                  id="requests"
                  type="number"
                  min="1"
                  value={requests}
                  onChange={(e) => setRequests(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Per Request</span>
            <div className="text-2xl font-mono font-bold text-blue-700">
              ${costs.perRequest.toFixed(4)}
            </div>
          </div>
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Input Cost</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">
              ${costs.inputCost.toFixed(4)}
            </div>
          </div>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Output Cost</span>
            <div className="text-2xl font-mono font-bold text-amber-700">
              ${costs.outputCost.toFixed(4)}
            </div>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Total ({requests.toLocaleString()} req)</span>
            <div className="text-2xl font-mono font-bold text-purple-700">
              ${costs.totalCost.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cost Comparison Across All Providers</h3>
          <div className="space-y-2">
            {allCosts.slice(0, 10).map((item, index) => {
              const isSelected = item.provider === provider.name && item.model === selectedModel;
              return (
                <div
                  key={`${item.provider}-${item.model}`}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isSelected ? 'bg-primary/10 border border-primary' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-20">{item.provider}</span>
                    <span className={`font-semibold ${isSelected ? 'text-primary' : ''}`}>{item.model}</span>
                    {isSelected && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Selected</span>}
                  </div>
                  <span className="font-mono font-semibold">${item.cost.toFixed(4)}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Showing top 10 lowest cost options. {allCosts.length} models from {Object.keys(providerModels).length} providers compared.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cost Optimization Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Choose the Right Model</h4>
              <p className="text-sm text-muted-foreground">
                Not every task requires GPT-4o. For simple queries, smaller models like GPT-4o Mini or Claude Opus can save 10-50x in costs.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Implement Caching</h4>
              <p className="text-sm text-muted-foreground">
                Cache repeated queries to avoid reprocessing. Many providers offer significant discounts for cached content.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Use Batch Processing</h4>
              <p className="text-sm text-muted-foreground">
                Batch APIs offer 50%+ discounts. Use them for non-time-sensitive workloads to reduce costs significantly.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Optimize Prompt Length</h4>
              <p className="text-sm text-muted-foreground">
                Remove unnecessary context from prompts. Every token costs money. Be concise without losing essential information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
