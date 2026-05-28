import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { generatePromptInsight, PromptGeneratorResult, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';

const TASK_TYPES = ['Writing', 'Coding', 'Marketing', 'SEO', 'Business', 'Learning'] as const;
const TONES = ['Professional', 'Casual', 'Friendly', 'Authoritative', 'Conversational', 'Academic'];
const OUTPUT_FORMATS = ['Paragraph', 'Bulleted List', 'Numbered List', 'Table', 'Q&A Format', 'Outline'];

export default function PromptGenerator() {
  const [taskType, setTaskType] = useState<string>(TASK_TYPES[0]);
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState<string>(TONES[0]);
  const [outputFormat, setOutputFormat] = useState<string>(OUTPUT_FORMATS[0]);
  const [requirements, setRequirements] = useState('');
  const [result, setResult] = useState<PromptGeneratorResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    return topic.length >= 3;
  };

  const generatePrompt = () => {
    if (!validate()) return;

    const prompt = buildPrompt();
    const structure = explainStructure(taskType, tone, outputFormat);

    setResult({ prompt, structure });
    setInsight(generatePromptInsight(taskType, topic));
    setCopied(false);
  };

  const buildPrompt = () => {
    let prompt = '';

    prompt += `You are a${taskType === 'SEO' ? 'n SEO' : taskType === 'AI' ? 'n AI' : ''} ${taskType.toLowerCase()} expert. `;
    prompt += `Help me ${getAction(taskType)} about "${topic}". `;

    if (audience) {
      prompt += `The target audience is ${audience}. `;
    }

    prompt += `Use a ${tone.toLowerCase()} tone. `;
    prompt += `Format the output as ${outputFormat.toLowerCase()}. `;

    if (requirements) {
      prompt += `Additional requirements: ${requirements}. `;
    }

    prompt += 'Provide clear, actionable, and well-structured content.';

    return prompt;
  };

  const getAction = (type: string) => {
    const actions: Record<string, string> = {
      Writing: 'create content',
      Coding: 'write code',
      Marketing: 'develop a marketing strategy',
      SEO: 'optimize content for search engines',
      Business: 'provide business analysis',
      Learning: 'explain and teach',
    };
    return actions[type] || 'help with';
  };

  const explainStructure = (type: string, t: string, format: string) => {
    return `This prompt follows the ${type} Expert Framework with ${t} tone, formatted as ${format.toLowerCase()}. Key elements: Role definition, clear task, audience context, tone specification, format instruction, and quality criteria.`;
  };

  const copyToClipboard = async () => {
    if (result?.prompt) {
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout toolId="prompt-generator" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Create Your AI Prompt</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Task Type</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {TASK_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {TONES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Topic or Subject</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., content marketing strategy for small businesses"
                className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., entrepreneurs, college students, marketing managers"
                className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Output Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                {OUTPUT_FORMATS.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Extra Requirements (Optional)</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Any specific requirements, constraints, or additional context..."
                className="w-full h-24 p-4 border rounded outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
          <button
            onClick={generatePrompt}
            disabled={!validate()}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Prompt
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Generated Prompt</h3>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/90 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
              <div className="bg-slate-50 p-4 rounded border-l-4 border-primary">
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{result.prompt}</p>
              </div>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4">Prompt Structure Explanation</h3>
              <p className="text-slate-600 leading-relaxed">{result.structure}</p>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}
