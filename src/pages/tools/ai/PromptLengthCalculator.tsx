import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

export default function PromptLengthCalculator() {
  const [inputText, setInputText] = useState('');
  const [targetLength, setTargetLength] = useState<number | null>(null);

  const stats = useMemo(() => {
    const text = inputText || '';
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s/g, '').length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphCount = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const lineCount = text.split('\n').length;

    const avgWordLength = wordCount > 0 ? (charNoSpaces / wordCount).toFixed(1) : '0';
    const avgSentenceLength = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : '0';

    const gptTokens = Math.ceil(charCount / 4);
    const claudeTokens = Math.ceil(charCount / 3.75);
    const geminiTokens = Math.ceil(charCount / 4.2);

    return {
      charCount,
      charNoSpaces,
      wordCount,
      sentenceCount,
      paragraphCount,
      lineCount,
      avgWordLength,
      avgSentenceLength,
      gptTokens,
      claudeTokens,
      geminiTokens,
    };
  }, [inputText]);

  const handleSetTarget = (type: string) => {
    const targets: Record<string, number> = {
      'short': 500,
      'medium': 2000,
      'long': 8000,
      'xl': 32000,
    };
    setTargetLength(targets[type] || null);
  };

  return (
    <ToolLayout toolId="prompt-length" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Analyze Prompt Length</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="prompt-input" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Enter Your Prompt or Text
              </label>
              <textarea
                id="prompt-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-sm min-h-[200px] resize-y"
                placeholder="Paste or type your prompt here to analyze its length..."
              />
            </div>

            {targetLength !== null && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Progress to {targetLength.toLocaleString()} chars</span>
                  <span className="text-sm font-mono text-primary">
                    {Math.min(100, Math.round((stats.charCount / targetLength) * 100))}%
                  </span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.min(100, (stats.charCount / targetLength) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{stats.charCount.toLocaleString()} chars</span>
                  <span>{targetLength.toLocaleString()} chars</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2">Quick targets:</span>
              {[
                { label: 'Short (500)', value: 'short' },
                { label: 'Medium (2K)', value: 'medium' },
                { label: 'Long (8K)', value: 'long' },
                { label: 'XL (32K)', value: 'xl' },
              ].map((btn) => {
                const targets: Record<string, number> = { short: 500, medium: 2000, long: 8000, xl: 32000 };
                const targetVal = targets[btn.value] || 0;
                return (
                <button
                  key={btn.value}
                  onClick={() => handleSetTarget(btn.value)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    targetLength === targetVal
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-muted-foreground border-slate-200 hover:border-primary'
                  }`}
                >
                  {btn.label}
                </button>
                );
              })}
              {targetLength && (
                <button
                  onClick={() => setTargetLength(null)}
                  className="px-3 py-1 text-sm rounded-full border border-slate-200 hover:border-red-300 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">Characters</span>
            <div className="text-xl font-mono font-bold text-blue-700">{stats.charCount.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Words</span>
            <div className="text-xl font-mono font-bold text-emerald-700">{stats.wordCount.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">Sentences</span>
            <div className="text-xl font-mono font-bold text-amber-700">{stats.sentenceCount.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">Paragraphs</span>
            <div className="text-xl font-mono font-bold text-purple-700">{stats.paragraphCount.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Token Estimates by Model</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="font-semibold">GPT Models</span>
              </div>
              <div className="text-2xl font-mono font-bold text-emerald-600">
                ~{stats.gptTokens.toLocaleString()}
              </div>
              <span className="text-xs text-muted-foreground">tokens (4 chars/token)</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="font-semibold">Claude Models</span>
              </div>
              <div className="text-2xl font-mono font-bold text-amber-600">
                ~{stats.claudeTokens.toLocaleString()}
              </div>
              <span className="text-xs text-muted-foreground">tokens (3.75 chars/token)</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-semibold">Gemini Models</span>
              </div>
              <div className="text-2xl font-mono font-bold text-blue-600">
                ~{stats.geminiTokens.toLocaleString()}
              </div>
              <span className="text-xs text-muted-foreground">tokens (4.2 chars/token)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Writing Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-foreground">{stats.avgWordLength}</div>
              <div className="text-xs text-muted-foreground mt-1">Avg word length</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-foreground">{stats.avgSentenceLength}</div>
              <div className="text-xs text-muted-foreground mt-1">Words per sentence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-foreground">{stats.charNoSpaces.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Characters (no spaces)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-foreground">{stats.lineCount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Lines</div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-3 text-amber-900">Context Window Considerations</h3>
          <div className="space-y-3 text-amber-800">
            <p>Different AI models have different context window limits:</p>
            <ul className="space-y-1 text-sm">
              <li><strong>GPT-4o:</strong> 128K tokens</li>
              <li><strong>Claude:</strong> 200K tokens</li>
              <li><strong>Gemini 1.5 Pro:</strong> 1M tokens</li>
            </ul>
            <p className="text-sm">
              For prompts, aim to use less than 50% of context for instructions to leave room for responses.
            </p>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
