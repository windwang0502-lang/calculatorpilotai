import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { generateImagePromptInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';

const STYLES = ['Realistic', 'Anime', '3D Render', 'Product Photo', 'Illustration', 'Cinematic', 'Oil Painting', 'Digital Art', 'Watercolor', 'Pixel Art'] as const;
const LIGHTING = ['Natural', 'Golden Hour', 'Studio', 'Dramatic', 'Soft', 'Neon', 'Rim Light', 'Backlit', 'Overcast', 'Blue Hour'] as const;
const CAMERA_ANGLES = ['Eye Level', 'Low Angle', 'High Angle', 'Bird Eye', 'Worm Eye', 'Dutch Angle', 'Close-up', 'Wide Shot', 'Medium Shot', 'Portrait'] as const;
const ASPECT_RATIOS = ['1:1 (Square)', '16:9 (Landscape)', '9:16 (Portrait)', '4:3 (Standard)', '21:9 (Cinematic)', '3:2 (Photo)'] as const;

interface ImagePromptResult {
  prompt: string;
  negativePrompt: string;
  tips: string[];
}

export default function ImagePromptGenerator() {
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState<string>(STYLES[0]);
  const [scene, setScene] = useState('');
  const [lighting, setLighting] = useState<string>(LIGHTING[0]);
  const [cameraAngle, setCameraAngle] = useState<string>(CAMERA_ANGLES[0]);
  const [aspectRatio, setAspectRatio] = useState<string>(ASPECT_RATIOS[1]);
  const [extraDetails, setExtraDetails] = useState('');
  const [result, setResult] = useState<ImagePromptResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [copied, setCopied] = useState('');

  const validate = () => {
    return subject.length >= 3;
  };

  const generatePrompt = () => {
    if (!validate()) return;

    const prompt = buildImagePrompt();
    const negativePrompt = buildNegativePrompt();
    const tips = generatePromptTips(style, lighting);

    setResult({ prompt, negativePrompt, tips });
    setInsight(generateImagePromptInsight(style, subject));
    setCopied('');
  };

  const buildImagePrompt = () => {
    let parts: string[] = [];

    parts.push(subject);

    if (scene) {
      parts.push(`in ${scene}`);
    }

    parts.push(`style: ${style.toLowerCase()}`);
    parts.push(`lighting: ${lighting.toLowerCase()}`);
    parts.push(`camera angle: ${cameraAngle.toLowerCase()}`);
    parts.push(`aspect ratio: ${aspectRatio.split(' ')[0]}`);

    if (extraDetails) {
      parts.push(`details: ${extraDetails}`);
    }

    parts.push('high quality', 'detailed', 'professional');

    return parts.join(', ');
  };

  const buildNegativePrompt = () => {
    let negative = 'blurry, low quality, distorted, deformed, bad anatomy, watermark, text, signature, username, logo, cropped, out of frame,';
    negative += ' extra fingers, mutated hands, poorly drawn hands, poorly drawn face,';
    negative += ' disfigured, bad art, beginner, amateur, oversaturated, underexposed,';
    negative += 'jpeg artifacts, lowres, ugly, obscene, vulgar';

    if (style === 'Anime') {
      negative += ', realistic proportions, photo-realistic, 3D render';
    } else if (style === 'Realistic') {
      negative += ', anime style, cartoon, illustration, painting';
    } else if (style === '3D Render') {
      negative += ', photograph, realistic, 2D, hand-drawn';
    }

    return negative;
  };

  const generatePromptTips = (s: string, l: string): string[] => {
    const tips = [
      'Start with a clear subject description for best results.',
      'Include lighting conditions as they dramatically affect the mood.',
      'Camera angle sets the emotional tone of your image.',
      'Use specific details rather than vague descriptions.',
    ];

    if (s === 'Anime') {
      tips.push('Anime style works well with vibrant colors and expressive poses.');
      tips.push('Add character details like hair color, eye style, and clothing.');
    } else if (s === 'Cinematic') {
      tips.push('Cinematic prompts benefit from specific mood and atmosphere descriptions.');
      tips.push('Consider adding film grain or color grading references.');
    } else if (s === 'Product Photo') {
      tips.push('Product photos should include background and lighting specifics.');
      tips.push('Add material descriptions like "glossy surface" or "matte finish".');
    }

    if (l === 'Golden Hour') {
      tips.push('Golden Hour creates warm, nostalgic feeling with orange tones.');
    } else if (l === 'Neon') {
      tips.push('Neon lighting works great for cyberpunk and urban themes.');
    }

    return tips.slice(0, 5);
  };

  const copyToClipboard = async (type: 'prompt' | 'negative') => {
    if (result) {
      const text = type === 'prompt' ? result.prompt : result.negativePrompt;
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    }
  };

  return (
    <ToolLayout toolId="image-prompt-generator" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">AI Image Prompt Generator</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., a young woman with flowing red hair, a majestic mountain landscape"
                className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {STYLES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Lighting</label>
                <select
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {LIGHTING.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Scene/Setting</label>
                <input
                  type="text"
                  value={scene}
                  onChange={(e) => setScene(e.target.value)}
                  placeholder="e.g., misty forest, modern studio, busy city street"
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Camera Angle</label>
                <select
                  value={cameraAngle}
                  onChange={(e) => setCameraAngle(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {CAMERA_ANGLES.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                {ASPECT_RATIOS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Extra Details (Optional)</label>
              <textarea
                value={extraDetails}
                onChange={(e) => setExtraDetails(e.target.value)}
                placeholder="e.g., vintage clothing, dramatic clouds, reflections on water, golden hour glow"
                className="w-full h-24 p-4 border rounded outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
          <button
            onClick={generatePrompt}
            disabled={!validate()}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Image Prompt
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Image Prompt</h3>
                <button
                  onClick={() => copyToClipboard('prompt')}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/90 transition-colors"
                >
                  {copied === 'prompt' ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
              <div className="bg-slate-50 p-4 rounded border-l-4 border-primary">
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{result.prompt}</p>
              </div>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Negative Prompt</h3>
                <button
                  onClick={() => copyToClipboard('negative')}
                  className="px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded hover:bg-slate-500 transition-colors"
                >
                  {copied === 'negative' ? 'Copied!' : 'Copy Negative'}
                </button>
              </div>
              <div className="bg-rose-50 p-4 rounded border-l-4 border-rose-400">
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">{result.negativePrompt}</p>
              </div>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4">Prompt Tips</h3>
              <ul className="space-y-2">
                {result.tips.map((tip, idx) => (
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
