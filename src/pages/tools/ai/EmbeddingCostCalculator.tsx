import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type Provider = 'openai' | 'cohere' | 'google' | 'aws' | 'azure';

interface EmbeddingModel {
  id: string;
  name: string;
  pricePerMillion: number;
  dimensions: number;
  normalized?: boolean;
}

const embeddingModels: EmbeddingModel[] = [
  { id: 'text-embedding-3-large', name: 'OpenAI Embedding-3 Large', pricePerMillion: 0.13, dimensions: 3072, normalized: true },
  { id: 'text-embedding-3-small', name: 'OpenAI Embedding-3 Small', pricePerMillion: 0.02, dimensions: 1536, normalized: true },
  { id: 'text-embedding-ada-002', name: 'OpenAI Ada v2', pricePerMillion: 0.1, dimensions: 1536 },
  { id: 'embed-english-v3', name: 'Cohere Embed v3 (English)', pricePerMillion: 0.1, dimensions: 1024, normalized: true },
  { id: 'embed-multilingual-v3', name: 'Cohere Embed v3 (Multilingual)', pricePerMillion: 0.1, dimensions: 1024, normalized: true },
  { id: 'gemini-text-embedding', name: 'Google Gemini Embedding', pricePerMillion: 0.1, dimensions: 768 },
  { id: 'titan-embed', name: 'AWS Titan Embedding', pricePerMillion: 0.1, dimensions: 1536, normalized: true },
  { id: 'azure-embedding', name: 'Azure OpenAI Embeddings', pricePerMillion: 0.1, dimensions: 1536 },
];

export default function EmbeddingCostCalculator() {
  const [selectedModel, setSelectedModel] = useState('text-embedding-3-large');
  const [textLength, setTextLength] = useState(1000);
  const [numTexts, setNumTexts] = useState(1000);
  const [retrievalFrequency, setRetrievalFrequency] = useState(10);

  const model = embeddingModels.find(m => m.id === selectedModel) || embeddingModels[0];

  const costs = useMemo(() => {
    const tokens = Math.ceil(textLength / 4);
    const tokensPerMillion = tokens / 1000000;
    const costPerText = tokensPerMillion * model.pricePerMillion;
    const initialCost = costPerText * numTexts;

    const vectorSize = model.normalized ? 1536 : model.dimensions;
    const bytesPerVector = vectorSize * 4;
    const storageGB = (bytesPerVector * numTexts) / (1024 * 1024 * 1024);
    const storageCostMonthly = storageGB * 0.25;
    const retrievalCostMonthly = initialCost * retrievalFrequency;

    return {
      tokens,
      costPerText,
      initialCost,
      vectorSize,
      storageGB,
      storageCostMonthly,
      retrievalCostMonthly,
      totalMonthly: storageCostMonthly + retrievalCostMonthly,
    };
  }, [textLength, numTexts, model, retrievalFrequency]);

  const allModelsSorted = useMemo(() => {
    return [...embeddingModels].sort((a, b) => a.pricePerMillion - b.pricePerMillion);
  }, []);

  return (
    <ToolLayout toolId="embedding-cost" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Embedding Costs</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="model-select" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Embedding Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
              >
                {allModelsSorted.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} - ${m.pricePerMillion}/1M ({m.dimensions} dims)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="text-length" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Characters per Text
                </label>
                <input
                  id="text-length"
                  type="number"
                  min="1"
                  value={textLength}
                  onChange={(e) => setTextLength(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <button onClick={() => setTextLength(500)} className="hover:text-primary underline">500</button>
                  <button onClick={() => setTextLength(1000)} className="hover:text-primary underline">1K</button>
                  <button onClick={() => setTextLength(5000)} className="hover:text-primary underline">5K</button>
                  <button onClick={() => setTextLength(10000)} className="hover:text-primary underline">10K</button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="num-texts" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Number of Texts
                </label>
                <input
                  id="num-texts"
                  type="number"
                  min="1"
                  value={numTexts}
                  onChange={(e) => setNumTexts(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <button onClick={() => setNumTexts(100)} className="hover:text-primary underline">100</button>
                  <button onClick={() => setNumTexts(1000)} className="hover:text-primary underline">1K</button>
                  <button onClick={() => setNumTexts(10000)} className="hover:text-primary underline">10K</button>
                  <button onClick={() => setNumTexts(100000)} className="hover:text-primary underline">100K</button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="retrieval-freq" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Avg Retrieval/Text/Month
                </label>
                <input
                  id="retrieval-freq"
                  type="number"
                  min="0"
                  value={retrievalFrequency}
                  onChange={(e) => setRetrievalFrequency(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Tokens/Text</span>
            <div className="text-2xl font-mono font-bold text-blue-700">{costs.tokens.toLocaleString()}</div>
          </div>
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Cost/Text</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">${costs.costPerText.toFixed(6)}</div>
          </div>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Initial Ingest</span>
            <div className="text-2xl font-mono font-bold text-amber-700">${costs.initialCost.toFixed(2)}</div>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Monthly Total</span>
            <div className="text-2xl font-mono font-bold text-purple-700">${costs.totalMonthly.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Text Embedding Ingestion</span>
              <div className="text-right">
                <div className="font-mono font-semibold">${costs.initialCost.toFixed(4)}</div>
                <div className="text-xs text-muted-foreground">
                  {numTexts.toLocaleString()} texts × ${costs.costPerText.toFixed(6)}/text
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Vector Storage</span>
              <div className="text-right">
                <div className="font-mono font-semibold">${costs.storageCostMonthly.toFixed(4)}/mo</div>
                <div className="text-xs text-muted-foreground">
                  {costs.storageGB.toFixed(4)} GB at $0.25/GB/mo
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Monthly Retrieval</span>
              <div className="text-right">
                <div className="font-mono font-semibold">${costs.retrievalCostMonthly.toFixed(2)}/mo</div>
                <div className="text-xs text-muted-foreground">
                  {numTexts.toLocaleString()} × {retrievalFrequency} lookups
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary/5 -mx-6 px-6 rounded-lg">
              <span className="font-bold text-lg">Total Monthly Cost</span>
              <div className="text-2xl font-mono font-bold text-primary">${costs.totalMonthly.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Vector Size by Model</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-semibold">Model</th>
                  <th className="text-right py-3 px-3 font-semibold">Dimensions</th>
                  <th className="text-right py-3 px-3 font-semibold">Vector Size</th>
                  <th className="text-right py-3 px-3 font-semibold">Price/1M</th>
                </tr>
              </thead>
              <tbody>
                {allModelsSorted.map(m => {
                  const isSelected = m.id === selectedModel;
                  return (
                    <tr key={m.id} className={`border-b border-slate-100 ${isSelected ? 'bg-primary/5' : ''}`}>
                      <td className={`py-3 px-3 ${isSelected ? 'text-primary font-semibold' : ''}`}>
                        {m.name} {isSelected && '(Selected)'}
                      </td>
                      <td className="text-right py-3 px-3 font-mono">{m.dimensions}</td>
                      <td className="text-right py-3 px-3 font-mono">{(m.normalized ? 1536 : m.dimensions) * 4} bytes</td>
                      <td className="text-right py-3 px-3 font-mono">${m.pricePerMillion}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Embedding Cost Factors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Text Length</h4>
              <p className="text-sm text-muted-foreground">
                Longer texts require more tokens. Average is ~4 characters per token. Embedding pricing is per 1M tokens.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Vector Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Higher dimensions capture more nuance but cost more to store. 1536 is standard; 3072 offers more precision.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Retrieval Volume</h4>
              <p className="text-sm text-muted-foreground">
                Each similarity search costs the same as ingestion. High-volume applications should optimize query frequency.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
