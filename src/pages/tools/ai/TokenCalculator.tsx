import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';

type ModelId = 'gpt-4o' | 'gpt-4.1' | 'claude-opus-4' | 'claude-opus-4-7';

interface ModelPricing {
  name: string;
  inputCostPerMillion: number;
  outputCostPerMillion: number;
  color: string;
}

interface TokenResult {
  estimatedTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

const models: Record<ModelId, ModelPricing> = {
  'gpt-4o': {
    name: 'GPT-4o',
    inputCostPerMillion: 2.5,
    outputCostPerMillion: 10,
    color: '#10b981',
  },
  'gpt-4.1': {
    name: 'GPT-4.1',
    inputCostPerMillion: 2,
    outputCostPerMillion: 8,
    color: '#3b82f6',
  },
  'claude-opus-4': {
    name: 'Claude Opus 4',
    inputCostPerMillion: 3,
    outputCostPerMillion: 15,
    color: '#f59e0b',
  },
  'claude-opus-4-7': {
    name: 'Claude Opus 4.7',
    inputCostPerMillion: 15,
    outputCostPerMillion: 75,
    color: '#8b5cf6',
  },
};

function calculateTokens(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }
  const charCount = text.length;
  return Math.ceil(charCount / 4);
}

function calculateCosts(
  text: string,
  modelId: ModelId,
  outputTokensRatio: number = 0.3
): TokenResult {
  const model = models[modelId];
  const estimatedTokens = calculateTokens(text);

  const inputTokens = Math.ceil(estimatedTokens * (1 - outputTokensRatio));
  const outputTokens = Math.ceil(estimatedTokens * outputTokensRatio);

  const inputCost = (inputTokens / 1000000) * model.inputCostPerMillion;
  const outputCost = (outputTokens / 1000000) * model.outputCostPerMillion;

  return {
    estimatedTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

export default function TokenCalculator() {
  const [inputText, setInputText] = useState('Enter your text here to estimate tokens and calculate costs...');
  const [selectedModel, setSelectedModel] = useState<ModelId>('gpt-4o');
  const [outputTokensRatio, setOutputTokensRatio] = useState(30);

  const result = useMemo(() => {
    return calculateCosts(inputText, selectedModel, outputTokensRatio / 100);
  }, [inputText, selectedModel, outputTokensRatio]);

  const chartData = useMemo(() => {
    const inputTokens = Math.ceil(result.estimatedTokens * (1 - outputTokensRatio / 100));
    const outputTokens = Math.ceil(result.estimatedTokens * (outputTokensRatio / 100));

    return [
      { name: 'Input Tokens', value: inputTokens, color: models[selectedModel].color },
      { name: 'Output Tokens (Est.)', value: outputTokens, color: '#94a3b8' },
    ];
  }, [result, selectedModel, outputTokensRatio]);

  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <ToolLayout toolId="token" category="ai">
      <section className="space-y-8">
        {/* Calculator Input Section */}
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Token Usage and Costs</h2>

          <div className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-2">
              <label htmlFor="tc-model" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Select AI Model
              </label>
              <select
                id="tc-model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as ModelId)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="gpt-4o">GPT-4o - $2.50/1M input, $10/1M output</option>
                <option value="gpt-4.1">GPT-4.1 - $2/1M input, $8/1M output</option>
                <option value="claude-opus-4">Claude Opus 4 - $3/1M input, $15/1M output</option>
                <option value="claude-opus-4-7">Claude Opus 4.7 - $15/1M input, $75/1M output</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Model pricing per 1 million tokens
              </p>
            </div>

            {/* Text Input */}
            <div className="space-y-2">
              <label htmlFor="tc-text" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Input Text
              </label>
              <textarea
                id="tc-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-sm min-h-[200px] resize-y"
                placeholder="Enter or paste your text here to estimate tokens..."
              />
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>{charCount.toLocaleString()} characters</span>
                <span>{wordCount.toLocaleString()} words</span>
                <span>~{result.estimatedTokens.toLocaleString()} tokens</span>
              </div>
            </div>

            {/* Output Token Ratio */}
            <div className="space-y-2">
              <label htmlFor="tc-ratio" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Estimated Output Ratio: {outputTokensRatio}%
              </label>
              <input
                id="tc-ratio"
                type="range"
                min="10"
                max="50"
                value={outputTokensRatio}
                onChange={(e) => setOutputTokensRatio(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-xs text-muted-foreground">
                Adjust based on expected response length (10-50% of input is typical)
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 md:p-5 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Estimated Tokens</span>
              <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-slate-700 tabular-nums leading-tight">
                {result.estimatedTokens.toLocaleString()}
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">tokens</span>
            </div>
            <div className="p-4 md:p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Input Cost</span>
              <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-blue-700 tabular-nums leading-tight">
                ${result.inputCost.toFixed(6)}
              </div>
              <span className="text-xs text-blue-600 mt-1 block">USD</span>
            </div>
            <div className="p-4 md:p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Output Cost</span>
              <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-amber-700 tabular-nums leading-tight">
                ${result.outputCost.toFixed(6)}
              </div>
              <span className="text-xs text-amber-600 mt-1 block">USD</span>
            </div>
            <div className="p-4 md:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl text-center">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Total Cost</span>
              <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-emerald-700 tabular-nums leading-tight">
                {result.totalCost < 0.01 ? `$${result.totalCost.toFixed(6)}` : `$${result.totalCost.toFixed(4)}`}
              </div>
              <span className="text-xs text-emerald-600 mt-1 block">USD</span>
            </div>
          </div>

          {/* Token Breakdown Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
            <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
              <div className="text-center min-w-[100px]">
                <div className="text-base md:text-lg font-mono font-bold text-slate-500 truncate max-w-full">
                  {Math.ceil(result.estimatedTokens * (1 - outputTokensRatio / 100)).toLocaleString()}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Input Tokens</div>
              </div>
              <div className="text-slate-300 hidden sm:block">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="text-center min-w-[100px]">
                <div className="text-base md:text-lg font-mono font-bold text-slate-500 truncate max-w-full">
                  ${result.inputCost.toFixed(6)}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Input Cost</div>
              </div>
              <div className="text-slate-300 hidden sm:block">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-center min-w-[100px]">
                <div className="text-base md:text-lg font-mono font-bold text-slate-500 truncate max-w-full">
                  +${result.outputCost.toFixed(6)}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Output Cost</div>
              </div>
              <div className="text-slate-300 hidden sm:block">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="text-center min-w-[120px]">
                <div className="text-xl md:text-2xl font-mono font-bold text-primary truncate max-w-full">
                  ${result.totalCost.toFixed(6)}
                </div>
                <div className="text-xs md:text-sm text-primary mt-1 font-semibold">Total Cost</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Using {models[selectedModel].name} pricing: ${models[selectedModel].inputCostPerMillion}/1M input, ${models[selectedModel].outputCostPerMillion}/1M output
            </p>
          </div>

          {/* Token Breakdown Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4">Token Breakdown Chart</h3>
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString()}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend
                    formatter={(value) => <span className="text-sm text-slate-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-lg font-mono font-bold" style={{ color: models[selectedModel].color }}>
                  {Math.ceil(result.estimatedTokens * (1 - outputTokensRatio / 100)).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Input Tokens</div>
                <div className="text-sm font-mono text-muted-foreground mt-1">
                  ${result.inputCost.toFixed(6)}
                </div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-lg font-mono font-bold text-slate-400">
                  {Math.ceil(result.estimatedTokens * (outputTokensRatio / 100)).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Output Tokens (Est.)</div>
                <div className="text-sm font-mono text-muted-foreground mt-1">
                  ${result.outputCost.toFixed(6)}
                </div>
              </div>
            </div>
          </div>

          {/* Cost Comparison Across Models */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4">Cost Comparison Across Models</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-muted-foreground uppercase tracking-wider text-xs">
                    <th className="text-left py-3 px-2 md:px-3 font-semibold">Model</th>
                    <th className="text-right py-3 px-2 md:px-3 font-semibold">Input Cost</th>
                    <th className="text-right py-3 px-2 md:px-3 font-semibold">Output Cost</th>
                    <th className="text-right py-3 px-2 md:px-3 font-semibold">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(models) as ModelId[]).map((modelId) => {
                    const modelResult = calculateCosts(inputText, modelId, outputTokensRatio / 100);
                    const isSelected = modelId === selectedModel;
                    return (
                      <tr
                        key={modelId}
                        className={`border-b border-slate-100 last:border-0 ${isSelected ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
                      >
                        <td className={`py-3 px-2 md:px-3 font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {models[modelId].name}
                          {isSelected && <span className="ml-2 text-xs">(Selected)</span>}
                        </td>
                        <td className="text-right py-3 px-2 md:px-3 font-mono tabular-nums">
                          ${modelResult.inputCost.toFixed(6)}
                        </td>
                        <td className="text-right py-3 px-2 md:px-3 font-mono tabular-nums">
                          ${modelResult.outputCost.toFixed(6)}
                        </td>
                        <td className={`text-right py-3 px-2 md:px-3 font-mono tabular-nums font-semibold ${isSelected ? 'text-primary' : 'text-emerald-600'}`}>
                          ${modelResult.totalCost.toFixed(6)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Reference */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4">Current Model Pricing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(models) as ModelId[]).map((modelId) => (
                <div
                  key={modelId}
                  className={`p-4 rounded-lg border ${
                    selectedModel === modelId
                      ? 'bg-white border-primary shadow-sm'
                      : 'bg-white/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: models[modelId].color }}
                    />
                    <span className="font-semibold text-sm">{models[modelId].name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Input:</span>
                      <span className="font-mono">${models[modelId].inputCostPerMillion}/1M tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Output:</span>
                      <span className="font-mono">${models[modelId].outputCostPerMillion}/1M tokens</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
