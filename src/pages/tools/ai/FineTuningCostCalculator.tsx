import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type Provider = 'openai' | 'anthropic' | 'cohere' | 'google';

interface FineTuningConfig {
  provider: string;
  name: string;
  trainingCostPer1K: number;
  inputCostPer1M: number;
  outputCostPer1M: number;
  minTokens?: number;
  maxTokens?: number;
}

const fineTuningOptions: FineTuningConfig[] = [
  {
    provider: 'OpenAI',
    name: 'GPT-3.5 Turbo Fine-tuned',
    trainingCostPer1K: 0.008,
    inputCostPer1M: 3,
    outputCostPer1M: 6,
    minTokens: 500,
    maxTokens: 4096,
  },
  {
    provider: 'OpenAI',
    name: 'GPT-4o Mini Fine-tuned',
    trainingCostPer1K: 1.25,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
    minTokens: 500,
    maxTokens: 32768,
  },
  {
    provider: 'Anthropic',
    name: 'Claude Fine-tuning (Beta)',
    trainingCostPer1K: 25,
    inputCostPer1M: 3,
    outputCostPer1M: 15,
    minTokens: 1000,
    maxTokens: 8192,
  },
  {
    provider: 'Cohere',
    name: 'Command R+ Fine-tuned',
    trainingCostPer1K: 1,
    inputCostPer1M: 3,
    outputCostPer1M: 15,
    minTokens: 256,
    maxTokens: 4096,
  },
  {
    provider: 'Google',
    name: 'Gemini Fine-tuning',
    trainingCostPer1K: 0.5,
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.3,
    minTokens: 500,
    maxTokens: 32768,
  },
];

export default function FineTuningCostCalculator() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [trainingTokens, setTrainingTokens] = useState(100000);
  const [epochs, setEpochs] = useState(3);
  const [monthlyRequests, setMonthlyRequests] = useState(10000);
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState(500);
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState(200);

  const option = fineTuningOptions[selectedOption];

  const costs = useMemo(() => {
    const totalTrainingTokens = trainingTokens * epochs;
    const trainingCost = (totalTrainingTokens / 1000) * option.trainingCostPer1K;
    const trainingHours = totalTrainingTokens / 1000000;

    const monthlyInferenceInput = (monthlyRequests * inputTokensPerRequest) / 1000000;
    const monthlyInferenceOutput = (monthlyRequests * outputTokensPerRequest) / 1000000;
    const monthlyInferenceCost =
      (monthlyInferenceInput * option.inputCostPer1M) +
      (monthlyInferenceOutput * option.outputCostPer1M);

    return {
      totalTrainingTokens,
      trainingCost,
      trainingHours,
      monthlyInferenceCost,
      costPerRequest: monthlyInferenceCost / monthlyRequests,
      monthlyTotal: trainingCost + monthlyInferenceCost,
    };
  }, [trainingTokens, epochs, monthlyRequests, inputTokensPerRequest, outputTokensPerRequest, option]);

  return (
    <ToolLayout toolId="fine-tuning-cost" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Fine-Tuning Costs</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Select Model
              </label>
              <div className="space-y-2">
                {fineTuningOptions.map((opt, idx) => (
                  <label
                    key={`${opt.provider}-${opt.name}`}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === idx ? 'bg-primary/5 border-primary' : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="model"
                        checked={selectedOption === idx}
                        onChange={() => setSelectedOption(idx)}
                        className="sr-only"
                      />
                      <div>
                        <div className="font-semibold">{opt.name}</div>
                        <div className="text-sm text-muted-foreground">{opt.provider}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-mono">${opt.trainingCostPer1K}/1K tokens</div>
                      <div className="text-xs text-muted-foreground">training</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="training-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Training Tokens
                </label>
                <input
                  id="training-tokens"
                  type="number"
                  min="100"
                  value={trainingTokens}
                  onChange={(e) => setTrainingTokens(Math.max(100, parseInt(e.target.value) || 100))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground">
                  ~{Math.ceil(trainingTokens / 500)} examples at ~500 tokens/example
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="epochs" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Training Epochs
                </label>
                <input
                  id="epochs"
                  type="number"
                  min="1"
                  max="10"
                  value={epochs}
                  onChange={(e) => setEpochs(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground">
                  More epochs = better quality but higher cost
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Inference Usage (Monthly)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="monthly-requests" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Monthly Requests
                  </label>
                  <input
                    id="monthly-requests"
                    type="number"
                    min="1"
                    value={monthlyRequests}
                    onChange={(e) => setMonthlyRequests(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="input-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Input Tokens/Request
                  </label>
                  <input
                    id="input-tokens"
                    type="number"
                    min="1"
                    value={inputTokensPerRequest}
                    onChange={(e) => setInputTokensPerRequest(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="output-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Output Tokens/Request
                  </label>
                  <input
                    id="output-tokens"
                    type="number"
                    min="1"
                    value={outputTokensPerRequest}
                    onChange={(e) => setOutputTokensPerRequest(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Total Training Tokens</span>
            <div className="text-2xl font-mono font-bold text-blue-700">{costs.totalTrainingTokens.toLocaleString()}</div>
          </div>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Training Cost</span>
            <div className="text-2xl font-mono font-bold text-amber-700">${costs.trainingCost.toFixed(2)}</div>
          </div>
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Monthly Inference</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">${costs.monthlyInferenceCost.toFixed(2)}</div>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Cost/Request</span>
            <div className="text-2xl font-mono font-bold text-purple-700">${costs.costPerRequest.toFixed(4)}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Training Cost</span>
              <div className="text-right">
                <div className="font-mono font-semibold">${costs.trainingCost.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {costs.totalTrainingTokens.toLocaleString()} tokens × ${option.trainingCostPer1K}/1K × {epochs} epochs
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Monthly Inference</span>
              <div className="text-right">
                <div className="font-mono font-semibold">${costs.monthlyInferenceCost.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {(monthlyRequests * inputTokensPerRequest / 1000000).toFixed(2)}M input + {(monthlyRequests * outputTokensPerRequest / 1000000).toFixed(2)}M output
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary/5 -mx-6 px-6 rounded-lg">
              <span className="font-bold text-lg">Total (First Month)</span>
              <div className="text-2xl font-mono font-bold text-primary">
                ${costs.monthlyTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">When is Fine-Tuning Worth It?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2 text-emerald-700">Good Candidates</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>High-volume, repetitive tasks</li>
                <li>Consistent format/structure needed</li>
                <li>Domain-specific terminology</li>
                <li>10K+ monthly API calls</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2 text-amber-700">Consider First</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Prompt engineering with base models</li>
                <li>RAG for knowledge retrieval</li>
                <li>Few-shot examples in prompts</li>
                <li>Lower volume applications</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Fine-tuning typically makes sense when you have consistent, high-volume use cases that can justify the training investment.
            A fine-tuned model can reduce inference costs by 50-90% compared to large base models.
          </p>
        </div>
      </section>
    </ToolLayout>
  );
}
