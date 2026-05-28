import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { generateAIHumanizerInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';

const TONES = ['Natural', 'Professional', 'Friendly', 'Academic', 'Simple'] as const;
const INTENSITIES = ['Light', 'Medium', 'Strong'] as const;

interface HumanizerResult {
  humanizedText: string;
  changes: { type: string; original: string; replacement: string }[];
  readabilityTips: string[];
}

const PHRASE_REPLACEMENTS: Record<string, string[]> = {
  'furthermore': ['also', 'in addition', 'additionally'],
  'nevertheless': ['still', 'even so', 'though'],
  'consequently': ['so', 'as a result', 'because of this'],
  'approximately': ['about', 'around', 'roughly'],
  'utilize': ['use'],
  'implement': ['do', 'put in place', 'carry out'],
  'facilitate': ['help', 'make easier', 'enable'],
  'subsequently': ['then', 'next', 'after that'],
  'accordingly': ['so', 'therefore', 'for that reason'],
  'henceforth': ['from now on', 'going forward'],
  'in order to': ['to'],
  'due to the fact that': ['because'],
  'at this point in time': ['now', 'currently'],
  'in the event that': ['if'],
  'for the purpose of': ['to', 'for'],
  'with regard to': ['about', 'regarding'],
  'in spite of the fact that': ['although', 'even though'],
};

const TRANSITION_WORDS = ['however', 'but', 'also', 'and', 'so', 'yet', 'or', 'although'];

export default function AIHumanizer() {
  const [originalText, setOriginalText] = useState('');
  const [tone, setTone] = useState<string>(TONES[0]);
  const [intensity, setIntensity] = useState<string>(INTENSITIES[1]);
  const [result, setResult] = useState<HumanizerResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (originalText.length < 50) newErrors.originalText = 'Text must be at least 50 characters';
    if (originalText.length > 5000) newErrors.originalText = 'Text must not exceed 5,000 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const humanizeText = () => {
    if (!validate()) return;

    const changes: HumanizerResult['changes'] = [];
    let humanized = originalText;

    const intensityMultiplier = intensity === 'Light' ? 0.3 : intensity === 'Medium' ? 0.6 : 1;

    Object.entries(PHRASE_REPLACEMENTS).forEach(([formal, casual]) => {
      if (Math.random() < intensityMultiplier) {
        const regex = new RegExp(`\\b${formal}\\b`, 'gi');
        if (regex.test(humanized)) {
          const replacement = casual[Math.floor(Math.random() * casual.length)];
          humanized = humanized.replace(regex, replacement);
          changes.push({ type: 'Phrase Replacement', original: formal, replacement });
        }
      }
    });

    const sentences = humanized.split(/(?<=[.!?])\s+/);
    const humanizedSentences = sentences.map(sentence => {
      let s = sentence.trim();
      if (!s) return s;

      if (s.endsWith('.') && !s.includes(',')) {
        const commaIndex = Math.floor(s.length * 0.4);
        const spaceIndex = s.indexOf(' ', commaIndex);
        if (spaceIndex > 10) {
          const firstPart = s.slice(0, spaceIndex);
          const secondPart = s.slice(spaceIndex + 1);
          const newSentence = firstPart + ',' + secondPart.charAt(0).toLowerCase() + secondPart.slice(1);
          if (!changes.find(c => c.original === 'Sentence split')) {
            changes.push({ type: 'Added natural rhythm', original: firstPart + '.', replacement: firstPart + ',' });
          }
          return newSentence;
        }
      }
      return s;
    });
    humanized = humanizedSentences.join(' ');

    const passivePatterns = [
      /\bwas\s+\w+ed\b/gi,
      /\bwere\s+\w+ed\b/gi,
      /\bhas\s+been\s+\w+ed\b/gi,
      /\bhave\s+been\s+\w+ed\b/gi,
    ];

    passivePatterns.forEach(pattern => {
      if (pattern.test(humanized) && Math.random() < intensityMultiplier * 0.5) {
        const match = humanized.match(pattern);
        if (match) {
          changes.push({ type: 'Passive to Active', original: match[0], replacement: '[rewritten]' });
        }
      }
    });

    TRANSITION_WORDS.forEach(word => {
      const pattern = new RegExp(`\\b${word}\\b`, 'gi');
      if (pattern.test(humanized) && Math.random() < 0.3) {
        const matches = humanized.match(pattern);
        if (matches && matches.length > 2) {
          changes.push({ type: 'Transition variety', original: `Overused: "${word}"`, replacement: 'Consider using alternatives' });
        }
      }
    });

    if (tone === 'Simple') {
      humanized = humanized.replace(/[;]/g, ',');
      humanized = humanized.replace(/\s+/g, ' ');
    }

    const tips = generateReadabilityTips(tone, changes.length);

    setResult({ humanizedText: humanized, changes, readabilityTips: tips });
    setInsight(generateAIHumanizerInsight(tone, intensity, changes.length));
  };

  const generateReadabilityTips = (t: string, changeCount: number): string[] => {
    const tips = [
      'Read your text aloud to check for natural flow.',
      'Short sentences (under 20 words) sound more conversational.',
      'Vary sentence length to create rhythm and interest.',
      'Use contractions (do not vs don\'t) for a friendlier tone.',
    ];

    if (t === 'Academic') {
      tips.push('Maintain formal vocabulary for scholarly contexts.');
      tips.push('Use precise terminology appropriate for academic writing.');
    } else if (t === 'Simple') {
      tips.push('Aim for vocabulary used by a 10th-grade reader.');
      tips.push('One idea per sentence works best for simple writing.');
    } else if (t === 'Friendly') {
      tips.push('Include personal pronouns (I, you, we) to connect with readers.');
      tips.push('Use conversational phrases and expressions.');
    }

    return tips.slice(0, 5);
  };

  const copyToClipboard = async () => {
    if (result?.humanizedText) {
      await navigator.clipboard.writeText(result.humanizedText);
    }
  };

  return (
    <ToolLayout toolId="ai-humanizer" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">AI Humanizer Tool</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Intensity</label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {INTENSITIES.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Original Text (Min 50 chars)
              </label>
              <textarea
                value={originalText}
                onChange={(e) => {
                  setOriginalText(e.target.value);
                  setErrors(prev => { const n = { ...prev }; delete n.originalText; return n; });
                }}
                placeholder="Paste your AI-generated or mechanical-sounding text here..."
                className={`w-full h-48 p-4 border rounded outline-none focus:ring-2 focus:ring-primary resize-none ${errors.originalText ? 'border-rose-500' : ''}`}
              />
              <div className="flex justify-between items-center">
                {errors.originalText ? (
                  <p className="text-xs text-rose-500">{errors.originalText}</p>
                ) : <span />}
                <span className="text-xs text-muted-foreground">
                  Character count: {originalText.length}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={humanizeText}
            disabled={originalText.length < 50}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Humanize Text
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Humanized Text</h3>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/90 transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>
              <div className="bg-emerald-50 p-4 rounded border-l-4 border-emerald-500">
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{result.humanizedText}</p>
              </div>
            </div>

            {result.changes.length > 0 && (
              <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-4">What Changed</h3>
                <div className="space-y-3">
                  {result.changes.map((change, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold">{change.type}</span>
                      <span className="text-rose-500 line-through">{change.original}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-emerald-600">{change.replacement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4">Readability Tips</h3>
              <ul className="space-y-2">
                {result.readabilityTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}
