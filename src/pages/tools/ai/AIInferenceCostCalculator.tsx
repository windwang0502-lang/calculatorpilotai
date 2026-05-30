import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type ModelTier = 'budget' | 'standard' | 'premium' | 'frontier';

interface InferenceConfig {
  name: string;
  inputPer1M: number;
  outputPer1M: number;
  latency: string;
  throughput: string;
}

const inferenceTiers: Record<ModelTier, InferenceConfig> = {
  budget: {
    name: 'Budget Models (GPT-3.5, Llama)',
    inputPer1M: 0.5,
    outputPer1M: 1.5,
    latency: '1-2s',
    throughput: 'High',
  },
  standard: {
    name: 'Standard Models (GPT-4o, Claude 3)',
    inputPer1M: 3,
    outputPer1M: 15,
    latency: '2-5s',
    throughput: 'Medium',
  },
  premium: {
    name: 'Premium Models (GPT-4, Claude 3.5)',
    inputPer1M: 15,
    outputPer1M: 75,
    latency: '3-10s',
    throughput: 'Low-Medium',
  },
  frontier: {
    name: 'Frontier Models (GPT-4.5, Claude Opus)',
    inputPer1M: 50,
    outputPer1M: 200,
    latency: '5-30s',
    throughput: 'Low',
  },
};

export default function AIInferenceCostCalculator() {
  const [tier, setTier] = useState<ModelTier>('standard');
  const [requestsPerDay, setRequestsPerDay] = useState(10000);
  const [avgInputTokens, setAvgInputTokens] = useState(500);
  const [avgOutputTokens, setAvgOutputTokens] = useState(200);
  const [useOptimization, setUseOptimization] = useState(false);
  const [batchSize, setBatchSize] = useState(1);

  const config = inferenceTiers[tier];

  const costs = useMemo(() => {
    const inputCostPerRequest = (avgInputTokens / 1000000) * config.inputPer1M;
    const outputCostPerRequest = (avgOutputTokens / 1000000) * config.outputPer1M;
    const baseCostPerRequest = inputCostPerRequest + outputCostPerRequest;

    let optimizationMultiplier = 1;
    if (useOptimization) {
      if (batchSize > 1) optimizationMultiplier *= 0.7;
      optimizationMultiplier *= 0.85;
    }

    const optimizedCostPerRequest = baseCostPerRequest * optimizationMultiplier;
    const requestsPerMonth = requestsPerDay * 30;
    const monthlyCost = optimizedCostPerRequest * requestsPerMonth;
    const yearlyCost = monthlyCost * 12;

    return {
      inputCostPerRequest,
      outputCostPerRequest,
      baseCostPerRequest,
      optimizedCostPerRequest,
      requestsPerMonth,
      monthlyCost,
      yearlyCost,
      savings: (baseCostPerRequest - optimizedCostPerRequest) * requestsPerMonth * 12,
    };
  }, [tier, requestsPerDay, avgInputTokens, avgOutputTokens, useOptimization, batchSize, config]);

  const scaleEstimate = useMemo(() => {
    const scenarios = [
      { scale: 'Startup', reqPerDay: 1000, tier: 'budget' as ModelTier },
      { scale: 'SMB', reqPerDay: 10000, tier: 'standard' as ModelTier },
      { scale: 'Growth', reqPerDay: 100000, tier: 'standard' as ModelTier },
      { scale: 'Enterprise', reqPerDay: 1000000, tier: 'premium' as ModelTier },
    ];

    return scenarios.map(s => {
      const cfg = inferenceTiers[s.tier];
      const costPerReq = (avgInputTokens / 1000000) * cfg.inputPer1M + (avgOutputTokens / 1000000) * cfg.outputPer1M;
      return {
        ...s,
        monthlyCost: costPerReq * s.reqPerDay * 30,
      };
    });
  }, [avgInputTokens, avgOutputTokens]);

  return (
    <ToolLayout toolId="ai-inference-cost" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate AI Inference Costs</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Model Tier
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(Object.entries(inferenceTiers) as [ModelTier, InferenceConfig][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setTier(key)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      tier === key ? 'bg-primary/5 border-primary' : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold">{cfg.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      ${cfg.inputPer1M}/1M in · ${cfg.outputPer1M}/1M out · {cfg.latency} latency
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="requests" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Requests per Day
                </label>
                <input
                  id="requests"
                  type="number"
                  min="1"
                  value={requestsPerDay}
                  onChange={(e) => setRequestsPerDay(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <button onClick={() => setRequestsPerDay(100)} className="hover:text-primary underline">100</button>
                  <button onClick={() => setRequestsPerDay(1000)} className="hover:text-primary underline">1K</button>
                  <button onClick={() => setRequestsPerDay(10000)} className="hover:text-primary underline">10K</button>
                  <button onClick={() => setRequestsPerDay(100000)} className="hover:text-primary underline">100K</button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="batch" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Batch Size
                </label>
                <input
                  id="batch"
                  type="number"
                  min="1"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="input-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Avg Input Tokens
                </label>
                <input
                  id="input-tokens"
                  type="number"
                  min="1"
                  value={avgInputTokens}
                  onChange={(e) => setAvgInputTokens(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="output-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Avg Output Tokens
                </label>
                <input
                  id="output-tokens"
                  type="number"
                  min="1"
                  value={avgOutputTokens}
                  onChange={(e) => setAvgOutputTokens(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useOptimization}
                  onChange={(e) => setUseOptimization(e.target.checked)}
                  className="w-5 h-5 text-primary rounded"
                />
                <span className="font-semibold">Use Cost Optimizations</span>
              </label>
              {useOptimization && (
                <span className="text-sm text-emerald-600">
                  Save ~35% with batching + caching
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Cost/Request</span>
            <div className="text-2xl font-mono font-bold text-blue-700">${costs.baseCostPerRequest.toFixed(4)}</div>
          </div>
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Monthly Cost</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">${costs.monthlyCost.toFixed(0)}</div>
          </div>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Yearly Cost</span>
            <div className="text-2xl font-mono font-bold text-amber-700">${costs.yearlyCost.toFixed(0)}</div>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Requests/Month</span>
            <div className="text-2xl font-mono font-bold text-purple-700">{(costs.requestsPerMonth / 1000).toFixed(0)}K</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Input Cost</span>
              <span className="font-mono font-semibold">${costs.inputCostPerRequest.toFixed(4)}/req</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Output Cost</span>
              <span className="font-mono font-semibold">${costs.outputCostPerRequest.toFixed(4)}/req</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Total per Request</span>
              <span className="font-mono font-semibold">${costs.baseCostPerRequest.toFixed(4)}</span>
            </div>
            {useOptimization && (
              <div className="flex justify-between items-center py-3 border-b border-slate-100 text-emerald-600">
                <span>Optimization Savings (35%)</span>
                <span className="font-mono font-semibold">-${costs.savings.toFixed(0)}/yr</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 bg-primary/5 -mx-6 px-6 rounded-lg">
              <span className="font-bold text-lg">Yearly Cost</span>
              <span className="text-2xl font-mono font-bold text-primary">${costs.yearlyCost.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Scale Estimates (Standard Tier)</h3>
          <div className="space-y-3">
            {scaleEstimate.map(s => (
              <div key={s.scale} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                <div>
                  <span className="font-semibold">{s.scale}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {s.reqPerDay.toLocaleString()} req/day
                  </span>
                </div>
                <span className="font-mono">${s.monthlyCost.toFixed(0)}/mo</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Inference Cost Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Batch Processing</h4>
              <p className="text-sm text-muted-foreground">
                Group multiple requests together. Can reduce costs by 30-50% for non-real-time applications.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Response Caching</h4>
              <p className="text-sm text-muted-foreground">
                Cache repeated queries. Average cache hit rate of 20-30% can reduce costs significantly.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Model Selection</h4>
              <p className="text-sm text-muted-foreground">
                Use smaller models for simpler tasks. Not every query needs GPT-4 class capability.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Prompt Compression</h4>
              <p className="text-sm text-muted-foreground">
                Reduce input tokens without losing meaning. Can save 10-30% on input costs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
