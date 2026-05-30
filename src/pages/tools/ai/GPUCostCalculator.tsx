import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';

type Provider = 'aws' | 'gcp' | 'azure' | 'Lambda Labs' | 'Vast.ai';
type GPUModel = 'A100-80GB' | 'A100-40GB' | 'H100' | 'H100-SXM' | 'H200' | 'A6000' | 'RTX-4090';

interface GPUConfig {
  name: string;
  vram: number;
  fp32: number;
  tensorCore: number;
  hourlyRate: number;
  spotDiscount: number;
}

const gpuOptions: Record<GPUModel, GPUConfig> = {
  'A100-80GB': { name: 'NVIDIA A100 80GB', vram: 80, fp32: 19.5, tensorCore: 312, hourlyRate: 1.5, spotDiscount: 0.6 },
  'A100-40GB': { name: 'NVIDIA A100 40GB', vram: 40, fp32: 19.5, tensorCore: 312, hourlyRate: 1.1, spotDiscount: 0.6 },
  'H100': { name: 'NVIDIA H100 SXM', vram: 80, fp32: 51, tensorCore: 989, hourlyRate: 2.5, spotDiscount: 0.5 },
  'H100-SXM': { name: 'NVIDIA H100 SXM 80GB', vram: 80, fp32: 51, tensorCore: 989, hourlyRate: 2.5, spotDiscount: 0.5 },
  'H200': { name: 'NVIDIA H200', vram: 141, fp32: 51, tensorCore: 989, hourlyRate: 3.5, spotDiscount: 0.5 },
  'A6000': { name: 'NVIDIA RTX A6000', vram: 48, fp32: 31.2, tensorCore: 165, hourlyRate: 0.8, spotDiscount: 0.7 },
  'RTX-4090': { name: 'NVIDIA RTX 4090', vram: 24, fp32: 82.6, tensorCore: 330, hourlyRate: 0.5, spotDiscount: 0.7 },
};

export default function GPUCostCalculator() {
  const [gpuModel, setGpuModel] = useState<GPUModel>('H100');
  const [numGpus, setNumGpus] = useState(8);
  const [hoursPerDay, setHoursPerDay] = useState(24);
  const [daysPerMonth, setDaysPerMonth] = useState(30);
  const [useSpot, setUseSpot] = useState(false);
  const [trainingHours, setTrainingHours] = useState(1000);

  const gpu = gpuOptions[gpuModel];

  const costs = useMemo(() => {
    const baseRate = gpu.hourlyRate * (useSpot ? (1 - gpu.spotDiscount) : 1);
    const hourlyTotal = baseRate * numGpus;
    const hoursPerMonth = hoursPerDay * daysPerMonth;
    const monthlyCost = hourlyTotal * hoursPerMonth;

    const trainingDays = trainingHours / hoursPerDay;
    const trainingCost = hourlyTotal * trainingHours;

    const memoryGB = gpu.vram * numGpus;
    const bandwidthGBps = numGpus * 900;

    return {
      baseRate,
      hourlyTotal,
      hoursPerMonth,
      monthlyCost,
      trainingDays,
      trainingCost,
      memoryGB,
      bandwidthGBps,
    };
  }, [gpu, numGpus, hoursPerDay, daysPerMonth, useSpot, trainingHours]);

  return (
    <ToolLayout toolId="gpu-cost" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate GPU Infrastructure Costs</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="gpu-model" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  GPU Model
                </label>
                <select
                  id="gpu-model"
                  value={gpuModel}
                  onChange={(e) => setGpuModel(e.target.value as GPUModel)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                >
                  {Object.entries(gpuOptions).map(([key, gpu]) => (
                    <option key={key} value={key}>
                      {gpu.name} - ${gpu.hourlyRate}/hr
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="num-gpus" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Number of GPUs
                </label>
                <input
                  id="num-gpus"
                  type="number"
                  min="1"
                  max="1024"
                  value={numGpus}
                  onChange={(e) => setNumGpus(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="hours-day" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Hours per Day
                </label>
                <input
                  id="hours-day"
                  type="number"
                  min="1"
                  max="24"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Math.min(24, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="days-month" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Days per Month
                </label>
                <input
                  id="days-month"
                  type="number"
                  min="1"
                  max="31"
                  value={daysPerMonth}
                  onChange={(e) => setDaysPerMonth(Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="training-hours" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Training Run Hours
                </label>
                <input
                  id="training-hours"
                  type="number"
                  min="1"
                  value={trainingHours}
                  onChange={(e) => setTrainingHours(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSpot}
                  onChange={(e) => setUseSpot(e.target.checked)}
                  className="w-5 h-5 text-primary rounded"
                />
                <span className="font-semibold">Use Spot/Preemptible Instances</span>
              </label>
              {useSpot && (
                <span className="text-sm text-emerald-600">
                  Save up to {Math.round(gpu.spotDiscount * 100)}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Hourly Rate</span>
            <div className="text-2xl font-mono font-bold text-blue-700">${costs.hourlyTotal.toFixed(2)}</div>
          </div>
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Monthly Cost</span>
            <div className="text-2xl font-mono font-bold text-emerald-700">${costs.monthlyCost.toFixed(0)}</div>
          </div>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Training Cost</span>
            <div className="text-2xl font-mono font-bold text-amber-700">${costs.trainingCost.toFixed(2)}</div>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Total VRAM</span>
            <div className="text-2xl font-mono font-bold text-purple-700">{costs.memoryGB}GB</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">GPU Specifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <div className="text-2xl font-mono font-bold text-foreground">{gpu.vram}GB</div>
              <div className="text-xs text-muted-foreground">VRAM</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <div className="text-2xl font-mono font-bold text-foreground">{gpu.fp32} TFLOPS</div>
              <div className="text-xs text-muted-foreground">FP32</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <div className="text-2xl font-mono font-bold text-foreground">{gpu.tensorCore} TFLOPS</div>
              <div className="text-xs text-muted-foreground">Tensor Core</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <div className="text-2xl font-mono font-bold text-foreground">{useSpot ? (gpu.hourlyRate * (1 - gpu.spotDiscount)).toFixed(2) : gpu.hourlyRate}/hr</div>
              <div className="text-xs text-muted-foreground">{useSpot ? 'Spot Rate' : 'On-Demand'}</div>
            </div>
          </div>

          <h4 className="font-semibold mb-3">Cost Comparison</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-semibold">GPU</th>
                  <th className="text-right py-3 px-3 font-semibold">VRAM</th>
                  <th className="text-right py-3 px-3 font-semibold">On-Demand</th>
                  <th className="text-right py-3 px-3 font-semibold">Spot</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(gpuOptions).map(([key, g]) => (
                  <tr key={key} className={`border-b border-slate-100 ${key === gpuModel ? 'bg-primary/5' : ''}`}>
                    <td className={`py-3 px-3 ${key === gpuModel ? 'text-primary font-semibold' : ''}`}>
                      {g.name} {key === gpuModel && '(Selected)'}
                    </td>
                    <td className="text-right py-3 px-3 font-mono">{g.vram}GB</td>
                    <td className="text-right py-3 px-3 font-mono">${g.hourlyRate}</td>
                    <td className="text-right py-3 px-3 font-mono">${(g.hourlyRate * (1 - g.spotDiscount)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">GPU Selection Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2 text-blue-700">Training</h4>
              <p className="text-sm text-muted-foreground">
                H100/H200 for large models, A100-80GB for memory-intensive training. Consider NVLink for multi-GPU.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2 text-emerald-700">Inference</h4>
              <p className="text-sm text-muted-foreground">
                A100 or H100 for production. RTX 4090/A6000 for development and testing.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold mb-2 text-amber-700">Cost Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Use spot instances for fault-tolerant workloads. Batch requests to maximize GPU utilization.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
