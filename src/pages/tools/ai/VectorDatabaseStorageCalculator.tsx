import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type VectorDB = 'pinecone' | 'weaviate' | 'chroma' | 'milvus' | 'qdrant' | 'pgvector';

interface VectorDBConfig {
  name: string;
  storageGB: number;
  retrievalGB: number;
  baseCost: number;
  minCost: number;
}

const vectorDBs: Record<VectorDB, VectorDBConfig> = {
  pinecone: {
    name: 'Pinecone',
    storageGB: 0.096,
    retrievalGB: 0.006,
    baseCost: 70,
    minCost: 70,
  },
  weaviate: {
    name: 'Weaviate Cloud',
    storageGB: 0.125,
    retrievalGB: 0.025,
    baseCost: 25,
    minCost: 25,
  },
  chroma: {
    name: 'Chroma (Self-hosted)',
    storageGB: 0.025,
    retrievalGB: 0,
    baseCost: 0,
    minCost: 0,
  },
  milvus: {
    name: 'Milvus (Self-hosted)',
    storageGB: 0.025,
    retrievalGB: 0,
    baseCost: 0,
    minCost: 0,
  },
  qdrant: {
    name: 'Qdrant Cloud',
    storageGB: 0.12,
    retrievalGB: 0.015,
    baseCost: 25,
    minCost: 25,
  },
  pgvector: {
    name: 'PostgreSQL + pgvector',
    storageGB: 0.023,
    retrievalGB: 0,
    baseCost: 0,
    minCost: 0,
  },
};

export default function VectorDatabaseStorageCalculator() {
  const [selectedDB, setSelectedDB] = useState<VectorDB>('pinecone');
  const [numVectors, setNumVectors] = useState(1000000);
  const [dimensions, setDimensions] = useState(1536);
  const [monthlyQueries, setMonthlyQueries] = useState(10000000);
  const [replicationFactor, setReplicationFactor] = useState(1);
  const [useCloud, setUseCloud] = useState(true);

  const db = vectorDBs[selectedDB];

  const storage = useMemo(() => {
    const bytesPerVector = dimensions * 4;
    const rawBytes = (bytesPerVector * numVectors * replicationFactor);
    const withIndex = rawBytes * 1.5;
    const storageGB = withIndex / (1024 * 1024 * 1024);
    const storageTB = storageGB / 1024;

    return {
      rawBytes,
      withIndex,
      storageGB,
      storageTB,
      bytesPerVector,
    };
  }, [numVectors, dimensions, replicationFactor]);

  const costs = useMemo(() => {
    const storageMonthly = storage.storageGB * db.storageGB;
    const retrievalMonthly = useCloud ? (monthlyQueries / 1000000) * db.retrievalGB : 0;
    const totalMonthly = Math.max(db.minCost, db.baseCost + storageMonthly + retrievalMonthly);

    return {
      storageMonthly,
      retrievalMonthly,
      totalMonthly,
      storageAnnual: storageMonthly * 12,
      retrievalAnnual: retrievalMonthly * 12,
      totalAnnual: totalMonthly * 12,
    };
  }, [storage, db, monthlyQueries, useCloud]);

  const allDBCosts = useMemo(() => {
    return (Object.entries(vectorDBs) as [VectorDB, VectorDBConfig][]).map(([key, cfg]) => {
      const storageMonthly = storage.storageGB * cfg.storageGB;
      const retrievalMonthly = useCloud && cfg.retrievalGB > 0 ? (monthlyQueries / 1000000) * cfg.retrievalGB : 0;
      const totalMonthly = Math.max(cfg.minCost, cfg.baseCost + storageMonthly + retrievalMonthly);

      return {
        id: key,
        name: cfg.name,
        totalMonthly,
        storageMonthly,
        retrievalMonthly,
        isManaged: cfg.baseCost > 0,
      };
    }).sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [storage, monthlyQueries, useCloud]);

  return (
    <ToolLayout toolId="vector-storage" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Vector Database Storage Calculator</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Vector Database
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(Object.entries(vectorDBs) as [VectorDB, VectorDBConfig][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedDB(key);
                      setUseCloud(cfg.baseCost > 0);
                    }}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedDB === key ? 'bg-primary/5 border-primary' : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{cfg.name}</div>
                    {cfg.baseCost > 0 ? (
                      <div className="text-xs text-emerald-600">Managed</div>
                    ) : (
                      <div className="text-xs text-slate-500">Self-hosted</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="num-vectors" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Number of Vectors
                </label>
                <input
                  id="num-vectors"
                  type="number"
                  min="1"
                  value={numVectors}
                  onChange={(e) => setNumVectors(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <button onClick={() => setNumVectors(10000)} className="hover:text-primary underline">10K</button>
                  <button onClick={() => setNumVectors(100000)} className="hover:text-primary underline">100K</button>
                  <button onClick={() => setNumVectors(1000000)} className="hover:text-primary underline">1M</button>
                  <button onClick={() => setNumVectors(10000000)} className="hover:text-primary underline">10M</button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="dimensions" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Embedding Dimensions
                </label>
                <input
                  id="dimensions"
                  type="number"
                  min="64"
                  max="4096"
                  value={dimensions}
                  onChange={(e) => setDimensions(Math.min(4096, Math.max(64, parseInt(e.target.value) || 1536)))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="queries" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Monthly Queries
                </label>
                <input
                  id="queries"
                  type="number"
                  min="0"
                  value={monthlyQueries}
                  onChange={(e) => setMonthlyQueries(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="replication" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Replication Factor
                </label>
                <input
                  id="replication"
                  type="number"
                  min="1"
                  max="5"
                  value={replicationFactor}
                  onChange={(e) => setReplicationFactor(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground">Higher = more redundancy, more storage</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCloud}
                  onChange={(e) => setUseCloud(e.target.checked)}
                  className="w-5 h-5 text-primary rounded"
                  disabled={db.baseCost === 0}
                />
                <span className="font-semibold">Include Cloud Costs</span>
              </label>
              {db.baseCost === 0 && (
                <span className="text-sm text-muted-foreground">
                  (Self-hosted - compute costs not included)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Total Storage</span>
            <div className="text-2xl font-mono font-bold text-blue-700">{storage.storageGB.toFixed(2)} GB</div>
          </div>
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Vectors</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">{(numVectors / 1000000).toFixed(1)}M</div>
          </div>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Monthly Storage</span>
            <div className="text-2xl font-mono font-bold text-amber-700">${costs.storageMonthly.toFixed(2)}</div>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Total Monthly</span>
            <div className="text-2xl font-mono font-bold text-purple-700">${costs.totalMonthly.toFixed(0)}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cost Breakdown ({db.name})</h3>
          <div className="space-y-4">
            {db.baseCost > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-muted-foreground">Base Cost</span>
                <span className="font-mono font-semibold">${db.baseCost}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">
                Storage ({storage.storageGB.toFixed(2)} GB × ${db.storageGB}/GB)
              </span>
              <span className="font-mono font-semibold">${costs.storageMonthly.toFixed(2)}</span>
            </div>
            {db.retrievalGB > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-muted-foreground">
                  Retrieval ({(monthlyQueries / 1000000).toFixed(1)}M queries × ${db.retrievalGB})
                </span>
                <span className="font-mono font-semibold">${costs.retrievalMonthly.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 bg-primary/5 -mx-6 px-6 rounded-lg">
              <span className="font-bold text-lg">Total Monthly</span>
              <span className="text-2xl font-mono font-bold text-primary">${costs.totalMonthly.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Provider Comparison</h3>
          <div className="space-y-2">
            {allDBCosts.slice(0, 6).map((dbCost, idx) => (
              <div
                key={dbCost.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  dbCost.id === selectedDB ? 'bg-primary/10 border border-primary' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-6">{idx + 1}</span>
                  <div>
                    <span className={`font-semibold ${dbCost.id === selectedDB ? 'text-primary' : ''}`}>
                      {dbCost.name}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      Storage: ${dbCost.storageMonthly.toFixed(2)} · Retrieval: ${dbCost.retrievalMonthly.toFixed(2)}
                    </div>
                  </div>
                </div>
                <span className="font-mono font-bold">${dbCost.totalMonthly.toFixed(0)}/mo</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Vector Storage Factors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Higher dimensions capture more nuance. 1536 is standard; 3072 for fine-grained similarity.
                Storage grows linearly with dimensions.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Index Overhead</h4>
              <p className="text-sm text-muted-foreground">
                Vector indices (HNSW, IVF) add 30-50% storage overhead for fast retrieval.
                Self-hosted databases may need 2x raw vector size.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2">Replication</h4>
              <p className="text-sm text-muted-foreground">
                Production systems typically use 2-3x replication for HA.
                This multiplies storage but improves read performance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
