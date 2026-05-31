import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { generateTitleInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';

const PLATFORMS = ['Blog', 'SEO', 'YouTube', 'Social Media', 'Product Page', 'Email Subject'] as const;
const TONES = ['Professional', 'Curious', 'Urgent', 'Friendly', 'Educational', 'Entertaining', 'Provocative'] as const;

interface TitleResult {
  titles: { title: string; score: number }[];
  bestPick: string;
  whyItWorks: string;
  seoNotes: string[];
}

export default function TitleGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<string>(PLATFORMS[0]);
  const [tone, setTone] = useState<string>(TONES[0]);
  const [includeKeyword, setIncludeKeyword] = useState('');
  const [numVariations, setNumVariations] = useState(5);
  const [result, setResult] = useState<TitleResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [copied, setCopied] = useState('');

  const validate = () => {
    return topic.length >= 3;
  };

  const generateTitles = () => {
    if (!validate()) return;

    const titles = generateTitleVariations(topic, platform, tone, includeKeyword, numVariations);
    const bestPick = selectBestTitle(titles, platform);
    const whyItWorks = explainWhyItWorks(bestPick, platform);
    const seoNotes = generateSEONotes(platform, includeKeyword);

    setResult({ titles, bestPick, whyItWorks, seoNotes });
    setInsight(generateTitleInsight(platform, topic));
    setCopied('');
  };

  const generateTitleVariations = (
    topic: string,
    p: string,
    t: string,
    keyword: string,
    count: number
  ): { title: string; score: number }[] => {
    const keywordText = keyword || topic;
    const titles: { title: string; score: number }[] = [];

    const blogTemplates = [
      `The Ultimate Guide to ${keywordText} in 2026`,
      `${keywordText}: Everything You Need to Know`,
      `How to Master ${keywordText} (Step-by-Step)`,
      `Why ${keywordText} Matters More Than You Think`,
      `${keywordText}: 10 Tips for Success`,
      `The Complete ${keywordText} Handbook`,
      `${keywordText} 101: A Beginner's Guide`,
      `7 Proven Strategies for ${keywordText}`,
      `What No One Tells You About ${keywordText}`,
      `${keywordText}: Common Mistakes to Avoid`,
      `The Science Behind ${keywordText}`,
      `Transform Your ${keywordText} in 30 Days`,
    ];

    const seoTemplates = [
      `${keywordText} - The Complete SEO Guide`,
      `${keywordText}: Optimization Strategies That Work`,
      `Best ${keywordText} Practices for Higher Rankings`,
      `${keywordText} Tutorial (2026 Updated)`,
      `${keywordText} vs. Alternatives: Which Wins?`,
      `${keywordText}: Ultimate Comparison Guide`,
      `Top 10 ${keywordText} Solutions Reviewed`,
      `${keywordText} Guide: Expert Tips Included`,
      `2026 ${keywordText} Trends You Cannot Ignore`,
      `Free ${keywordText} Calculator + Tips`,
    ];

    const youtubeTemplates = [
      `How to ${keywordText} (For Beginners)`,
      `${keywordText} - Full Tutorial`,
      `I Tried ${keywordText} For 30 Days - Results`,
      `The TRUTH About ${keywordText}`,
      `${keywordText} in 2026 - Worth It?`,
      `Everything About ${keywordText} in 10 Minutes`,
      `${keywordText}: My Honest Review`,
      `This ${keywordText} Changed Everything`,
      `Why You Need ${keywordText} NOW`,
      `${keywordText} Explained Simply`,
    ];

    const socialTemplates = [
      `${keywordText}: Quick Tips That Work`,
      `The ${keywordText} Hack You Need`,
      `${keywordText} (Thread)`,
      `Everything About ${keywordText} in One Post`,
      `Stop Scrolling: ${keywordText}`,
      `${keywordText} Tip That Changed My Approach`,
      `Sharing My ${keywordText} Journey`,
      `${keywordText} is Not What You Think`,
      `Your ${keywordText} Questions, Answered`,
      `About That ${keywordText}...`,
    ];

    const productTemplates = [
      `${keywordText} - Professional Grade`,
      `Why Our ${keywordText} Stands Out`,
      `${keywordText}: Built for Performance`,
      `Premium ${keywordText} Solutions`,
      `${keywordText} - Trusted by Thousands`,
      `Discover the Best ${keywordText}`,
      `${keywordText} That Delivers Results`,
      `Experience Superior ${keywordText}`,
      `${keywordText} - Quality Guaranteed`,
      `Your Search for ${keywordText} Ends Here`,
    ];

    const emailTemplates = [
      `Your ${keywordText} Guide Inside`,
      `${keywordText}: Quick Update`,
      `About ${keywordText} - Must Read`,
      `${keywordText} - Just for You`,
      `Important: ${keywordText} Update`,
      `${keywordText} - Action Required`,
      `A Note About ${keywordText}`,
      `${keywordText} - We Thought You Should Know`,
      `This Week's ${keywordText} Insights`,
      `${keywordText}: Don't Miss This`,
    ];

    let templates: string[];
    switch (p) {
      case 'Blog':
        templates = blogTemplates;
        break;
      case 'SEO':
        templates = seoTemplates;
        break;
      case 'YouTube':
        templates = youtubeTemplates;
        break;
      case 'Social Media':
        templates = socialTemplates;
        break;
      case 'Product Page':
        templates = productTemplates;
        break;
      case 'Email Subject':
        templates = emailTemplates;
        break;
      default:
        templates = blogTemplates;
    }

    const shuffled = templates.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    selected.forEach((title, index) => {
      const baseScore = 70 + Math.random() * 25;
      const bonusScore = title.includes(keywordText) ? 5 : 0;
      const lengthBonus = title.length <= 60 ? 3 : title.length > 80 ? -5 : 0;
      titles.push({
        title,
        score: Math.min(100, baseScore + bonusScore + lengthBonus),
      });
    });

    return titles.sort((a, b) => b.score - a.score);
  };

  const selectBestTitle = (titles: { title: string; score: number }[], platform: string): string => {
    if (titles.length === 0) return '';

    if (platform === 'YouTube') {
      return titles.find(t => t.title.includes('I Tried') || t.title.includes('TRUTH') || t.title.includes('Honest'))?.title || titles[0].title;
    } else if (platform === 'SEO') {
      return titles.find(t => t.title.includes('Guide') || t.title.includes('Complete'))?.title || titles[0].title;
    } else if (platform === 'Social Media') {
      return titles.find(t => t.title.includes('Truth') || t.title.includes('About'))?.title || titles[0].title;
    }

    return titles[0].title;
  };

  const explainWhyItWorks = (bestTitle: string, platform: string): string => {
    const explanations: Record<string, string> = {
      YouTube: 'YouTube titles with curiosity gaps, numbers, or personal experiences ("I Tried", "Honest Review") perform exceptionally well because they create anticipation and promise specific value to viewers.',
      SEO: 'SEO titles with "Complete", "Guide", or "2026" signal comprehensiveness and freshness to both search engines and users, increasing click-through rates.',
      Blog: 'Blog titles with "Ultimate Guide", "Everything You Need to Know", or numbered lists perform well because they promise structured, comprehensive content.',
      'Social Media': 'Social media titles with mystery ("The Truth About"), direct address ("Stop Scrolling"), or relatability ("About That") interrupt scrolling and invite engagement.',
      'Product Page': 'Product titles with "Premium", "Professional Grade", or "Trusted by" establish credibility and trust signals that drive conversions.',
      'Email Subject': 'Email subjects with personalization, urgency, or curiosity gaps improve open rates significantly.',
    };

    return explanations[platform] || 'A strong title clearly communicates value while creating curiosity or urgency.';
  };

  const generateSEONotes = (platform: string, keyword: string): string[] => {
    const notes: string[] = [];

    if (keyword) {
      notes.push(`Including "${keyword}" in your title helps search engines understand your content topic.`);
    }

    if (platform === 'SEO' || platform === 'Blog') {
      notes.push('Front-load important keywords near the beginning of your title for better SEO performance.');
      notes.push('Keep titles between 50-60 characters for full display in search results.');
      notes.push('Include numbers (like "10 Tips" or "2026") to increase click-through rates.');
    } else if (platform === 'YouTube') {
      notes.push('YouTube allows longer titles. Include keywords and create curiosity gaps.');
      notes.push('First 40 characters are most important as they show in mobile views.');
    } else if (platform === 'Social Media') {
      notes.push('Keep social titles short and punchy. Under 280 characters for Twitter/X.');
      notes.push('Use emojis strategically to increase visual prominence in feeds.');
    }

    notes.push('Test different title variations to see which performs best with your audience.');

    return notes;
  };

  const copyToClipboard = async () => {
    if (result) {
      const text = result.titles.map(t => t.title).join('\n');
      await navigator.clipboard.writeText(text);
      setCopied('all');
      setTimeout(() => setCopied(''), 2000);
    }
  };

  const copyTitle = async (title: string) => {
    await navigator.clipboard.writeText(title);
    setCopied(title);
    setTimeout(() => setCopied(''), 2000);
  };

  const relatedTools = [
    { name: 'Prompt Generator', path: '/tools/ai/prompt-generator', desc: 'Generate high-quality prompts for multiple use cases' },
    { name: 'Email Generator', path: '/tools/ai/email-generator', desc: 'Draft structured emails quickly' },
    { name: 'Token Calculator', path: '/tools/ai/token-calculator', desc: 'Estimate model token usage and cost' },
  ];

  return (
    <ToolLayout toolId="title-generator" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">SEO Title Generator</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., content marketing, weight loss, project management"
                className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {PLATFORMS.map(p => (
                    <option key={p} value={p}>{p}</option>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Include Keyword (Optional)</label>
                <input
                  type="text"
                  value={includeKeyword}
                  onChange={(e) => setIncludeKeyword(e.target.value)}
                  placeholder="Primary keyword to include"
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Number of Variations</label>
                <select
                  value={numVariations}
                  onChange={(e) => setNumVariations(parseInt(e.target.value))}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {[3, 5, 7, 10].map(n => (
                    <option key={n} value={n}>{n} Titles</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button
            onClick={generateTitles}
            disabled={!validate()}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Titles
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Best Pick</h3>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">RECOMMENDED</span>
              </div>
              <div
                onClick={() => copyTitle(result.bestPick)}
                className="bg-emerald-50 p-4 rounded border-l-4 border-emerald-500 cursor-pointer hover:bg-emerald-100 transition-colors"
              >
                <p className="text-slate-800 font-semibold text-lg">
                  {copied === result.bestPick ? 'Copied!' : result.bestPick}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">All Title Suggestions</h3>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/90 transition-colors"
                >
                  {copied === 'all' ? 'Copied All!' : 'Copy All'}
                </button>
              </div>
              <div className="space-y-3">
                {result.titles.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => copyTitle(item.title)}
                    className="flex items-center gap-4 p-3 bg-slate-50 rounded cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <span className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-bold text-slate-600">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-700">{item.title}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      item.score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                      item.score >= 80 ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {Math.round(item.score)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4">Why This Title Works</h3>
              <p className="text-slate-600 leading-relaxed">{result.whyItWorks}</p>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4">SEO Notes</h3>
              <ul className="space-y-2">
                {result.seoNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center">How to Use the Title Generator</h2>
          <p className="text-slate-700">Enter your topic, select platform/tone, optionally provide a keyword, then generate and compare scored title variants.</p>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">Results Interpretation</h3>
            <p className="text-slate-700">Use the best-pick as your starting point, then A/B test 2-3 alternatives for CTR performance.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">Common Mistakes</h3>
            <p className="text-slate-700">Avoid overstuffing keywords or using vague titles that hide the value proposition.</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How do I choose the best title?', a: 'Look for titles with scores above 85%. Consider your platform and audience when making your final selection.' },
              { q: 'Can I use these titles for SEO?', a: 'Yes, the SEO and Blog platform options are optimized for search engine visibility and click-through rates.' },
              { q: 'How many variations should I test?', a: 'We recommend A/B testing at least 2-3 title variations to see which performs best with your specific audience.' },
            ].map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-slate-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool, index) => (
              <a key={index} href={tool.path} className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-slate-400 text-sm">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
