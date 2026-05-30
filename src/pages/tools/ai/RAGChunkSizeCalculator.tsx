import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type ChunkingStrategy = 'fixed' | 'semantic' | 'recursive';

interface ChunkConfig {
  name: string;
  description: string;
  overlap: number;
}

const strategies: Record<ChunkingStrategy, ChunkConfig> = {
  fixed: {
    name: 'Fixed Size',
    description: 'Split by character or token count',
    overlap: 10,
  },
  semantic: {
    name: 'Semantic / Paragraph',
    description: 'Split by natural paragraphs',
    overlap: 20,
  },
  recursive: {
    name: 'Recursive Character',
    description: 'Split by multiple delimiters',
    overlap: 15,
  },
};

export default function RAGChunkSizeCalculator() {
  const [documentSize, setDocumentSize] = useState(50000);
  const [strategy, setStrategy] = useState<ChunkingStrategy>('semantic');
  const [chunkSize, setChunkSize] = useState(1000);
  const [overlapPercent, setOverlapPercent] = useState(10);
  const [queryLength, setQueryLength] = useState(200);

  const analysis = useMemo(() => {
    const overlapTokens = Math.ceil(chunkSize * (overlapPercent / 100));
    const effectiveChunkSize = chunkSize + overlapTokens;

    let chunks: number;
    let overlapPerChunk: number;

    switch (strategy) {
      case 'fixed':
        chunks = Math.ceil(documentSize / chunkSize);
        overlapPerChunk = overlapTokens;
        break;
      case 'semantic':
        chunks = Math.ceil(documentSize / (chunkSize * 0.6));
        overlapPerChunk = Math.ceil(chunkSize * 0.2);
        break;
      case 'recursive':
        chunks = Math.ceil(documentSize / (chunkSize * 0.8));
        overlapPerChunk = Math.ceil(chunkSize * 0.15);
        break;
      default:
        chunks = Math.ceil(documentSize / chunkSize);
        overlapPerChunk = overlapTokens;
    }

    const queryChunksRetrieved = Math.ceil(queryLength / effectiveChunkSize) + 1;
    const contextPercent = (queryChunksRetrieved * effectiveChunkSize / 128000) * 100;

    return {
      chunks,
      overlapTokens,
      effectiveChunkSize,
      queryChunksRetrieved,
      contextPercent,
      avgChunkSize: Math.ceil(documentSize / chunks),
    };
  }, [documentSize, strategy, chunkSize, overlapPercent, queryLength]);

  const qualityScores = useMemo(() => [
    {
      name: 'Too Small',
      range: '<500 tokens',
      pros: 'Precise retrieval, better for specific facts',
      cons: 'Lost context, more chunks to process',
      score: 5,
    },
    {
      name: 'Small (500-800)',
      range: '500-800 tokens',
      pros: 'Good balance of precision and context',
      cons: 'May miss paragraph-level meaning',
      score: 9,
    },
    {
      name: 'Medium (800-1500)',
      range: '800-1500 tokens',
      pros: 'Good overall context retention',
      cons: 'May include irrelevant information',
      score: 8,
    },
    {
      name: 'Large (1500-2000)',
      range: '1500-2000 tokens',
      pros: 'Strong context, fewer API calls',
      cons: 'Lower precision, may dilute key info',
      score: 6,
    },
    {
      name: 'Too Large',
      range: '>2000 tokens',
      pros: 'Maximum context',
      cons: 'Poor precision, wastes context window',
      score: 3,
    },
  ], []);

  const recommendedSize = useMemo(() => {
    if (analysis.avgChunkSize < 500) return 'small';
    if (analysis.avgChunkSize < 1000) return 'medium';
    if (analysis.avgChunkSize < 2000) return 'large';
    return 'toLarge';
  }, [analysis.avgChunkSize]);

  return (
    <ToolLayout toolId="rag-chunk-size" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">RAG Chunk Size Calculator</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="doc-size" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Document Size (tokens)
              </label>
              <input
                id="doc-size"
                type="number"
                min="100"
                value={documentSize}
                onChange={(e) => setDocumentSize(Math.max(100, parseInt(e.target.value) || 100))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
              <div className="flex gap-2 text-xs text-muted-foreground">
                <button onClick={() => setDocumentSize(5000)} className="hover:text-primary underline">5K</button>
                <button onClick={() => setDocumentSize(50000)} className="hover:text-primary underline">50K</button>
                <button onClick={() => setDocumentSize(100000)} className="hover:text-primary underline">100K</button>
                <button onClick={() => setDocumentSize(500000)} className="hover:text-primary underline">500K</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Chunking Strategy
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(Object.entries(strategies) as [ChunkingStrategy, ChunkConfig][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setStrategy(key)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      strategy === key ? 'bg-primary/5 border-primary' : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold">{cfg.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{cfg.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="chunk-size" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Target Chunk Size (tokens)
                </label>
                <input
                  id="chunk-size"
                  type="number"
                  min="100"
                  max="10000"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Math.min(10000, Math.max(100, parseInt(e.target.value) || 100)))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="overlap" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Overlap Percentage
                </label>
                <input
                  id="overlap"
                  type="number"
                  min="0"
                  max="50"
                  value={overlapPercent}
                  onChange={(e) => setOverlapPercent(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="query" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Query/Context Size (tokens)
              </label>
              <input
                id="query"
                type="number"
                min="50"
                value={queryLength}
                onChange={(e) => setQueryLength(Math.max(50, parseInt(e.target.value) || 50))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Total Chunks</span>
            <div className="text-3xl font-mono font-bold text-blue-700">{analysis.chunks}</div>
          </div>
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Avg Chunk Size</span>
            <div className="text-3xl font-mono font-bold text-emerald-700">{analysis.avgChunkSize}</div>
          </div>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Overlap/Chunk</span>
            <div className="text-3xl font-mono font-bold text-amber-700">{analysis.overlapTokens}</div>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Chunks in Query</span>
            <div className="text-3xl font-mono font-bold text-purple-700">{analysis.queryChunksRetrieved}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Chunk Size Quality Guide</h3>
          <div className="space-y-3">
            {qualityScores.map((item) => {
              const isRecommended = item.name.toLowerCase().includes(
                recommendedSize === 'small' ? 'small (500-800)' :
                recommendedSize === 'medium' ? 'medium' :
                recommendedSize === 'large' ? 'large' : 'too large'
              );
              return (
                <div
                  key={item.name}
                  className={`p-4 rounded-lg border ${
                    isRecommended ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.name}</span>
                      {isRecommended && (
                        <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{item.range}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-emerald-600 font-medium">Pros:</span>
                      <p className="text-muted-foreground">{item.pros}</p>
                    </div>
                    <div>
                      <span className="text-red-600 font-medium">Cons:</span>
                      <p className="text-muted-foreground">{item.cons}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">RAG Chunking Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Optimal Size Range</h4>
              <p className="text-sm text-muted-foreground">
                500-1500 tokens is the sweet spot for most RAG applications. Smaller chunks for fact retrieval,
                larger for comprehensive understanding.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Overlap Strategy</h4>
              <p className="text-sm text-muted-foreground">
                10-20% overlap ensures context continuity between chunks. Critical for content split mid-sentence or mid-paragraph.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Context Window Budget</h4>
              <p className="text-sm text-muted-foreground">
                Reserve 30-50% of context for the system prompt and retrieved chunks. Query should use remaining 50-70%.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Hybrid Retrieval</h4>
              <p className="text-sm text-muted-foreground">
                Combine dense (semantic) and sparse (keyword) retrieval for better precision. Use reranking to improve chunk selection.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
