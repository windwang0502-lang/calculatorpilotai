import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { detectAI, AIDetectorResult } from '@/lib/engines';
import { generateAIInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';

export default function AIDetector() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AIDetectorResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (text.length < 50) newErrors.text = 'Text must be at least 50 characters';
    if (text.length > 10000) newErrors.text = 'Text must not exceed 10,000 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = detectAI(text);
    setResult(res);
    setInsight(generateAIInsight(res.aiProbability, res.classification));
  };

  return (
    <ToolLayout toolId="ai" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">AI Text Detector</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Content to Analyze (Min 50 chars)</label>
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setErrors(prev => { const n = { ...prev }; delete n.text; return n; }); }}
                placeholder="Paste the text you want to analyze here..."
                className={`w-full h-48 p-4 border rounded outline-none focus:ring-2 focus:ring-primary resize-none transition-all ${errors.text ? 'border-rose-500' : ''}`}
              />
              <div className="flex justify-between items-center">
                {errors.text ? <p className="text-xs text-rose-500">{errors.text}</p> : <span />}
                <span className="text-xs text-muted-foreground">Character count: {text.length}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            disabled={text.length < 50}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run Detector Analysis
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">AI Probability</span>
                <div className="text-5xl font-mono font-bold text-primary">{result.aiProbability}%</div>
              </div>
              <div className="p-6 bg-slate-50 border rounded-lg text-center flex flex-col justify-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Classification</span>
                <div className={`text-3xl font-bold ${result.classification === 'Human' ? 'text-emerald-600' : result.classification === 'AI-like' ? 'text-rose-600' : 'text-amber-600'}`}>
                  {result.classification}
                </div>
              </div>
            </div>
            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}
