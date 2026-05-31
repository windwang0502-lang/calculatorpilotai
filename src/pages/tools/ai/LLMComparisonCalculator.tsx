import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, formatCurrency, validateNumberInput } from '@/lib/utils';

interface LLMModel {
  id: string;
  name: string;
  provider: string;
  inputCost: number; // per 1M tokens
  outputCost: number; // per 1M tokens
  contextWindow: number;
  supportsFunctions: boolean;
  supportsVision: boolean;
}

const LLM_MODELS: LLMModel[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', inputCost: 5, outputCost: 15, contextWindow: 128000, supportsFunctions: true, supportsVision: true },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', inputCost: 0.15, outputCost: 0.60, contextWindow: 128000, supportsFunctions: true, supportsVision: true },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', inputCost: 10, outputCost: 30, contextWindow: 128000, supportsFunctions: true, supportsVision: true },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', inputCost: 0.5, outputCost: 1.5, contextWindow: 16385, supportsFunctions: true, supportsVision: false },
  { id: 'claude-3-5-sonnet', name: 'Claude', provider: 'Anthropic', inputCost: 3, outputCost: 15, contextWindow: 200000, supportsFunctions: true, supportsVision: true },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', inputCost: 0.80, outputCost: 4, contextWindow: 200000, supportsFunctions: true, supportsVision: true },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', inputCost: 15, outputCost: 75, contextWindow: 200000, supportsFunctions: true, supportsVision: true },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', inputCost: 1.25, outputCost: 5, contextWindow: 2000000, supportsFunctions: true, supportsVision: true },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', inputCost: 0.075, outputCost: 0.30, contextWindow: 1000000, supportsFunctions: true, supportsVision: true },
  { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta', inputCost: 0, outputCost: 0, contextWindow: 8192, supportsFunctions: false, supportsVision: false },
];

export default function LLMComparisonCalculator() {
  const [inputTokens, setInputTokens] = useState(10000);
  const [outputTokens, setOutputTokens] = useState(2000);
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4o', 'claude-3-5-sonnet', 'gemini-1.5-pro']);

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    } else if (selectedModels.length < 3) {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const calculateCost = (model: LLMModel, input: number, output: number) => {
    const inputCost = (input / 1000000) * model.inputCost;
    const outputCost = (output / 1000000) * model.outputCost;
    return { inputCost, outputCost, total: inputCost + outputCost };
  };

  const selectedModelData = LLM_MODELS.filter(m => selectedModels.includes(m.id));

  const faqs = [
    {
      question: 'How accurate are these cost estimates?',
      answer: 'These estimates are based on published pricing from each provider. Actual costs may vary based on usage volume discounts, prompt caching, batching, and any promotional pricing. For production estimates, consult the provider\'s official pricing pages.'
    },
    {
      question: 'What affects LLM API costs?',
      answer: 'Three main factors determine API costs: input token count (your prompts), output token count (model responses), and the model\'s per-token pricing. Longer conversations accumulate costs as they include conversation history in each request.'
    },
    {
      question: 'What are tokens?',
      answer: 'Tokens are the basic units of text that LLMs process. One token is roughly 4 characters or 0.75 words in English. A typical email might be 300-500 tokens. Most APIs charge separately for input and output tokens at different rates.'
    },
    {
      question: 'Should I always choose the cheapest model?',
      answer: 'Not necessarily. While cost matters, consider task complexity, required capabilities (vision, function calling), context window needs, and latency requirements. For simple tasks, smaller models often perform comparably. For complex reasoning, larger models may be more cost-effective overall due to fewer errors.'
    },
    {
      question: 'What is context window?',
      answer: 'The context window is the maximum number of tokens (input + output) a model can process in a single request. Larger contexts allow for longer documents, more conversation history, and complex multi-part tasks. Gemini 1.5 Pro offers up to 2M tokens, while older models may be limited to 8K-32K.'
    },
    {
      question: 'How can I reduce LLM costs?',
      answer: 'Strategies include: Use smaller models for simple tasks, implement prompt caching for repeated contexts, optimize prompts to be concise without losing effectiveness, use lower temperature for consistent outputs, batch requests when possible, and consider fine-tuned smaller models for specific use cases.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'LLM Comparison Calculator',
        description: 'Compare costs, capabilities, and context windows across major LLM providers including OpenAI, Anthropic Claude, and Google Gemini.',
        url: 'https://www.calculatorpilotai.com/tools/ai/llm-comparison-calculator',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      }
    ]
  };

  const relatedTools = [
    { name: 'Token Calculator', path: '/tools/ai/token-calculator', desc: 'Calculate tokens from text' },
    { name: 'API Cost Calculator', path: '/tools/ai/api-cost-calculator', desc: 'Estimate API usage costs' },
    { name: 'Context Window Calculator', path: '/tools/ai/context-window-calculator', desc: 'Calculate context usage' },
  ];

  return (
    <ToolLayout toolId="llm-comparison" category="ai">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">LLM Comparison Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label htmlFor="input-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Input Tokens</label>
              <input
                id="input-tokens"
                type="number"
                min="0"
                step="100"
                value={inputTokens}
                onChange={(e) => setInputTokens(validateNumberInput(e.target.value, { min: 0 }))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg"
              />
              <p className="text-xs text-slate-500">~{Math.round(inputTokens / 0.75)} words</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="output-tokens" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Output Tokens</label>
              <input
                id="output-tokens"
                type="number"
                min="0"
                step="100"
                value={outputTokens}
                onChange={(e) => setOutputTokens(validateNumberInput(e.target.value, { min: 0 }))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg"
              />
              <p className="text-xs text-slate-500">~{Math.round(outputTokens / 0.75)} words</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Select Models (up to 3)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LLM_MODELS.map(model => {
                const isSelected = selectedModels.includes(model.id);
                const isDisabled = !isSelected && selectedModels.length >= 3;
                return (
                  <button
                    key={model.id}
                    onClick={() => toggleModel(model.id)}
                    disabled={isDisabled}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : isDisabled
                        ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{model.name}</span>
                        <span className="text-sm text-slate-500 ml-2">({model.provider})</span>
                      </div>
                      {isSelected && (
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-slate-500">
                      <span>In: ${model.inputCost}/1M</span>
                      <span>Out: ${model.outputCost}/1M</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {selectedModelData.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border border-primary/20 rounded-xl">
              <h3 className="text-lg font-bold mb-4">Cost Comparison</h3>
              <div className="space-y-3">
                {selectedModelData.map(model => {
                  const costs = calculateCost(model, inputTokens, outputTokens);
                  const cheapest = Math.min(...selectedModelData.map(m => calculateCost(m, inputTokens, outputTokens).total));
                  const isCheapest = costs.total === cheapest;
                  return (
                    <div
                      key={model.id}
                      className={`p-4 rounded-lg ${isCheapest ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-white border border-slate-200'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold">{model.name}</span>
                          {isCheapest && <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-200 px-2 py-0.5 rounded">LOWEST COST</span>}
                        </div>
                        <span className="font-mono font-bold text-xl">{formatCurrency(costs.total)}</span>
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-slate-500">
                        <span>Input: {formatCurrency(costs.inputCost)}</span>
                        <span>Output: {formatCurrency(costs.outputCost)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Model Capabilities</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 font-semibold">Model</th>
                      <th className="text-right py-3 px-2 font-semibold">Context Window</th>
                      <th className="text-right py-3 px-2 font-semibold">Functions</th>
                      <th className="text-right py-3 px-2 font-semibold">Vision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedModelData.map(model => (
                      <tr key={model.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 px-2 font-medium">{model.name}</td>
                        <td className="py-3 px-2 text-right font-mono">
                          {model.contextWindow >= 1000000
                            ? `${(model.contextWindow / 1000000).toFixed(0)}M`
                            : `${(model.contextWindow / 1000).toFixed(0)}K`}
                        </td>
                        <td className="py-3 px-2 text-right">
                          {model.supportsFunctions ? (
                            <span className="text-emerald-600">Yes</span>
                          ) : (
                            <span className="text-slate-400">No</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right">
                          {model.supportsVision ? (
                            <span className="text-emerald-600">Yes</span>
                          ) : (
                            <span className="text-slate-400">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Break-even Analysis</h3>
              <div className="space-y-4">
                {selectedModelData.map((model, idx) => {
                  if (idx === 0) return null;
                  const primary = selectedModelData[0];
                  const primaryCost = calculateCost(primary, inputTokens, outputTokens);
                  const currentCost = calculateCost(model, inputTokens, outputTokens);
                  const diff = currentCost.total - primaryCost.total;
                  const percentDiff = primaryCost.total > 0 ? (diff / primaryCost.total) * 100 : 0;

                  return (
                    <div key={model.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="text-slate-600">
                        {model.name} vs {primary.name}
                      </span>
                      <span className={`font-mono font-semibold ${diff > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {diff > 0 ? '+' : ''}{formatCurrency(diff)} ({percentDiff.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding LLM Pricing</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Token-based Pricing</h3>
              <p className="text-slate-700 leading-relaxed">
                Most LLM APIs charge based on the number of tokens processed. Input tokens (your prompts) and output tokens (model responses) are priced separately, typically at different rates. Output tokens are usually more expensive because they require more computation to generate.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Cost Comparison by Model</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between"><span>Most Expensive:</span><span className="font-bold">Claude 3 Opus, GPT-4 Turbo</span></div>
                <div className="flex justify-between"><span>Mid-tier:</span><span className="font-bold">Claude, GPT-4o, Gemini 1.5 Pro</span></div>
                <div className="flex justify-between"><span>Most Affordable:</span><span className="font-bold">Gemini 1.5 Flash, GPT-4o Mini, Claude 3.5 Haiku</span></div>
                <div className="flex justify-between"><span>Free Options:</span><span className="font-bold">Llama 3 70B (self-hosted)</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Choosing the Right Model</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Simple tasks:</strong> Use smaller, cheaper models (GPT-4o Mini, Claude 3.5 Haiku)</li>
                <li><strong>Complex reasoning:</strong> Use frontier models (Claude, GPT-4o)</li>
                <li><strong>Long contexts:</strong> Choose models with large windows (Gemini 1.5 Pro, Claude 3.5)</li>
                <li><strong>Vision capabilities:</strong> Ensure the model supports image input</li>
                <li><strong>Function calling:</strong> Required for agentic applications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p className="text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related AI Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool, index) => (
              <Link key={index} to={tool.path} className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-slate-400 text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
