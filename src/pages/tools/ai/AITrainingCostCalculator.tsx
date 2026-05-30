import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type ModelScale = 'small' | 'medium' | 'large' | 'xlarge';

interface TrainingConfig {
  name: string;
  params: string;
  gpuHours: number;
  gpuType: string;
  datasetSize: string;
  epochs: number;
  energyKwh: number;
}

const trainingConfigs: Record<ModelScale, TrainingConfig> = {
  small: {
    name: 'Small Model (e.g., Llama 3.2 1B)',
    params: '1B parameters',
    gpuHours: 5000,
    gpuType: 'A100-40GB',
    datasetSize: '10B tokens',
    epochs: 3,
    energyKwh: 50,
  },
  medium: {
    name: 'Medium Model (e.g., Llama 3.1 8B)',
    params: '8B parameters',
    gpuHours: 150000,
    gpuType: 'H100',
    datasetSize: '15T tokens',
    epochs: 2,
    energyKwh: 800,
  },
  large: {
    name: 'Large Model (e.g., Llama 3.1 70B)',
    params: '70B parameters',
    gpuHours: 3000000,
    gpuType: 'H100',
    datasetSize: '15T tokens',
    epochs: 2,
    energyKwh: 15000,
  },
  xlarge: {
    name: 'Frontier Model (e.g., GPT-4 class)',
    params: '1T+ parameters',
    gpuHours: 50000000,
    gpuType: 'H100',
    datasetSize: '10T+ tokens',
    epochs: 1,
    energyKwh: 250000,
  },
};

const gpuHourlyRates: Record<string, number> = {
  'A100-40GB': 1.1,
  'A100-80GB': 1.5,
  'H100': 2.5,
  'H200': 3.5,
};

export default function AITrainingCostCalculator() {
  const [modelScale, setModelScale] = useState<ModelScale>('medium');
  const [customGpuHours, setCustomGpuHours] = useState<number | null>(null);
  const [customGpuRate, setCustomGpuRate] = useState<number>(2.5);
  const [electricityRate, setElectricityRate] = useState(0.12);
  const [co2PerKwh, setCo2PerKwh] = useState(0.5);
  const [overheadFactor, setOverheadFactor] = useState(1.3);

  const config = trainingConfigs[modelScale];
  const gpuHours = customGpuHours ?? config.gpuHours;
  const gpuRate = customGpuRate || gpuHourlyRates[config.gpuType] || 2.5;

  const costs = useMemo(() => {
    const computeCost = gpuHours * gpuRate;
    const electricityCost = (config.energyKwh * electricityRate) * overheadFactor;
    const coolingCost = electricityCost * 0.4;
    const engineeringDays = Math.ceil(gpuHours / 24);
    const engineeringCost = engineeringDays * 5000;
    const dataCost = 50000;
    const totalCost = computeCost + electricityCost + coolingCost + engineeringCost + dataCost;

    const co2Kg = (config.energyKwh * co2PerKwh) * overheadFactor;
    const co2Tons = co2Kg / 1000;

    return {
      computeCost,
      electricityCost,
      coolingCost,
      engineeringCost,
      engineeringDays,
      dataCost,
      totalCost,
      co2Kg,
      co2Tons,
      gpuHours,
    };
  }, [gpuHours, gpuRate, config, electricityRate, co2PerKwh, overheadFactor]);

  return (
    <ToolLayout toolId="ai-training-cost" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Estimate AI Training Costs</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Model Scale
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(Object.entries(trainingConfigs) as [ModelScale, TrainingConfig][]).map(([scale, cfg]) => (
                  <button
                    key={scale}
                    onClick={() => {
                      setModelScale(scale);
                      setCustomGpuHours(null);
                    }}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      modelScale === scale ? 'bg-primary/5 border-primary' : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold">{cfg.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {cfg.params} · ~{cfg.gpuHours.toLocaleString()} GPU-hours
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="gpu-hours" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  GPU Hours (or leave auto)
                </label>
                <input
                  id="gpu-hours"
                  type="number"
                  min="1"
                  value={customGpuHours ?? config.gpuHours}
                  onChange={(e) => setCustomGpuHours(parseInt(e.target.value) || null)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground">
                  Reference: {config.gpuType} at ${gpuHourlyRates[config.gpuType] || 2.5}/hr
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="gpu-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  GPU Hourly Rate ($)
                </label>
                <input
                  id="gpu-rate"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={customGpuRate}
                  onChange={(e) => setCustomGpuRate(parseFloat(e.target.value) || 2.5)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="elec-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Electricity Rate ($/kWh)
                </label>
                <input
                  id="elec-rate"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(parseFloat(e.target.value) || 0.12)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="co2" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  CO2 per kWh (kg)
                </label>
                <input
                  id="co2"
                  type="number"
                  min="0"
                  step="0.01"
                  value={co2PerKwh}
                  onChange={(e) => setCo2PerKwh(parseFloat(e.target.value) || 0.5)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="overhead" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  PUE/Overhead Factor
                </label>
                <input
                  id="overhead"
                  type="number"
                  min="1"
                  step="0.1"
                  value={overheadFactor}
                  onChange={(e) => setOverheadFactor(parseFloat(e.target.value) || 1.3)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">GPU Hours</span>
            <div className="text-2xl font-mono font-bold text-blue-700">{costs.gpuHours.toLocaleString()}</div>
          </div>
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Compute Cost</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">${costs.computeCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Engineering</span>
            <div className="text-2xl font-mono font-bold text-amber-700">${costs.engineeringCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Total Cost</span>
            <div className="text-2xl font-mono font-bold text-purple-700">${costs.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">GPU Compute ({costs.gpuHours.toLocaleString()} hrs × ${gpuRate}/hr)</span>
              <span className="font-mono font-semibold">${costs.computeCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Electricity ({config.energyKwh} kWh × {overheadFactor}x)</span>
              <span className="font-mono font-semibold">${costs.electricityCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Cooling (~40% of electricity)</span>
              <span className="font-mono font-semibold">${costs.coolingCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Engineering ({costs.engineeringDays} days)</span>
              <span className="font-mono font-semibold">${costs.engineeringCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-muted-foreground">Data & Infrastructure</span>
              <span className="font-mono font-semibold">${costs.dataCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary/5 -mx-6 px-6 rounded-lg">
              <span className="font-bold text-lg">Estimated Total</span>
              <span className="text-2xl font-mono font-bold text-primary">${costs.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-3 text-emerald-800">Environmental Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-emerald-200 text-center">
              <div className="text-3xl font-mono font-bold text-emerald-700">{costs.co2Kg.toLocaleString()} kg</div>
              <div className="text-sm text-emerald-600 mt-1">CO2 emissions</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-emerald-200 text-center">
              <div className="text-3xl font-mono font-bold text-emerald-700">{costs.co2Tons.toFixed(1)} tons</div>
              <div className="text-sm text-emerald-600 mt-1">Carbon equivalent</div>
            </div>
          </div>
          <p className="text-sm text-emerald-700 mt-4">
            For comparison, the average car emits about 4.6 metric tons of CO2 per year.
            Training a large model can emit as much carbon as 5 cars over their lifetime.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Real-World Training Costs</h3>
          <div className="space-y-3">
            {[
              { model: 'GPT-3 (175B)', year: 2020, estimate: '$4-12M' },
              { model: 'LLaMA 3.1 (8B)', year: 2024, estimate: '$500K-2M' },
              { model: 'LLaMA 3.1 (70B)', year: 2024, estimate: '$5-10M' },
              { model: 'GPT-4 class', year: 2023, estimate: '$50-100M+' },
            ].map((item) => (
              <div key={item.model} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                <div>
                  <span className="font-semibold">{item.model}</span>
                  <span className="text-sm text-muted-foreground ml-2">({item.year})</span>
                </div>
                <span className="font-mono">{item.estimate}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
