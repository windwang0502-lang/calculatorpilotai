import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, validateNumberInput } from '@/lib/utils';

interface PaceResult {
  pace: string;
  timePerKm: string;
  timePerMile: string;
  speed: number;
  raceTimes: { distance: string; time: string }[];
}

export default function RunningPaceCalculator() {
  const [distance, setDistance] = useState(10);
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [result, setResult] = useState<PaceResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (distance <= 0 || distance > 500) newErrors.distance = 'Distance must be between 0.1 and 500';
    if (hours < 0 || hours > 24) newErrors.hours = 'Hours must be 0-24';
    if (minutes < 0 || minutes > 59) newErrors.minutes = 'Minutes must be 0-59';
    if (seconds < 0 || seconds > 59) newErrors.seconds = 'Seconds must be 0-59';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTime = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const calculatePace = (dist: number, timeSecs: number, unitSystem: string) => {
    const pacePerUnit = timeSecs / dist;
    const kmInMiles = 1.60934;
    const pacePerKm = pacePerUnit;
    const pacePerMile = pacePerKm * kmInMiles;

    const raceDistances = [
      { km: 5, mi: 3.1, name: '5K' },
      { km: 10, mi: 6.2, name: '10K' },
      { km: 21.0975, mi: 13.1, name: 'Half Marathon' },
      { km: 42.195, mi: 26.2, name: 'Marathon' },
    ];

    const raceTimes = raceDistances.map(r => {
      const distInSystem = unitSystem === 'km' ? r.km : r.mi;
      const pace = unitSystem === 'km' ? pacePerKm : pacePerMile;
      const totalSecs = distInSystem * pace;
      return {
        distance: r.name,
        time: formatTime(totalSecs),
      };
    });

    return {
      pace: formatTime(pacePerUnit),
      timePerKm: formatTime(pacePerKm),
      timePerMile: formatTime(pacePerMile),
      speed: (dist * 3600) / timeSecs,
      raceTimes,
    };
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds <= 0) {
      setErrors({ ...errors, hours: 'Total time must be greater than 0' });
      return;
    }
    const res = calculatePace(distance, totalSeconds, unit);
    setResult(res);
  };

  const faqs = [
    {
      question: 'What is running pace?',
      answer: 'Running pace is the time it takes to cover one unit of distance, typically expressed as minutes per kilometer or minutes per mile. It\'s the standard way runners measure and communicate their speed. A faster pace means covering more distance in less time.'
    },
    {
      question: 'How do I convert between km and mile pace?',
      answer: 'To convert pace per mile to pace per km, multiply by 1.609. To convert pace per km to pace per mile, divide by 1.609. For example, 6:00/mile equals approximately 3:43/km (6 ÷ 1.609). Most countries use km; the US commonly uses miles.'
    },
    {
      question: 'What pace should I target for my first race?',
      answer: 'For a first 5K, start conservatively—you should finish feeling challenged but not exhausted. A good starting point is 1-2 minutes per km slower than you think you can handle. Walk breaks are fine for beginners. For marathons, pace 30-60 seconds per km slower than your 10K pace.'
    },
    {
      question: 'How do I improve my running pace?',
      answer: 'Improving pace requires: 1) Consistent easy runs to build aerobic base, 2) Tempo runs at threshold pace, 3) Interval training at VO2max pace, 4) Strides and form drills, 5) Adequate recovery and sleep. Don\'t increase mileage or intensity too quickly—build gradually over months.'
    },
    {
      question: 'What is a good pace for beginners?',
      answer: 'Beginners typically run 6:30-8:00 min/km (10:30-13:00 min/mile) or slower. That\'s perfectly fine—every runner starts somewhere. As fitness improves, pace naturally decreases. The "right" pace is one you can maintain while breathing comfortably and talking in sentences.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Running Pace Calculator',
        description: 'Calculate your running pace, speed, and estimated race times.',
        url: 'https://www.calculatorpilotai.com/tools/health/running-pace-calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.calculatorpilotai.com' },
          { '@type': 'ListItem', position: 2, name: 'Health', item: 'https://www.calculatorpilotai.com/tools/health' },
          { '@type': 'ListItem', position: 3, name: 'Running Pace Calculator', item: 'https://www.calculatorpilotai.com/tools/health/running-pace-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Calorie Burn Calculator', path: '/tools/health/calorie-burn-calculator', desc: 'Calculate calories burned running' },
    { name: 'Target Heart Rate', path: '/tools/health/target-heart-rate-calculator', desc: 'Calculate your training zones' },
    { name: 'VO2 Max Calculator', path: '/tools/health/vo2-max-calculator', desc: 'Estimate cardiovascular fitness' },
  ];

  return (
    <ToolLayout toolId="running-pace" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Running Pace</h2>
            <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
              <button onClick={() => setUnit('km')} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === 'km' ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-800'}`}>KM</button>
              <button onClick={() => setUnit('mi')} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === 'mi' ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-800'}`}>MI</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label htmlFor="rp-distance" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Distance ({unit})</label>
              <input
                id="rp-distance"
                type="number"
                min="0.1"
                max="500"
                step="0.1"
                value={distance}
                onChange={(e) => {
                  setDistance(validateNumberInput(Number(e.target.value), { min: 0.1, max: 500 }));
                  setErrors(prev => { const n = { ...prev }; delete n.distance; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.distance ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.distance && <p className="text-xs text-rose-500">{errors.distance}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="rp-hours" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hours</label>
              <input
                id="rp-hours"
                type="number"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => {
                  setHours(validateNumberInput(Number(e.target.value), { min: 0, max: 24 }));
                  setErrors(prev => { const n = { ...prev }; delete n.hours; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.hours ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.hours && <p className="text-xs text-rose-500">{errors.hours}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="rp-minutes" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Minutes</label>
              <input
                id="rp-minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => {
                  setMinutes(validateNumberInput(Number(e.target.value), { min: 0, max: 59 }));
                  setErrors(prev => { const n = { ...prev }; delete n.minutes; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.minutes ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.minutes && <p className="text-xs text-rose-500">{errors.minutes}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="rp-seconds" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Seconds</label>
              <input
                id="rp-seconds"
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => {
                  setSeconds(validateNumberInput(Number(e.target.value), { min: 0, max: 59 }));
                  setErrors(prev => { const n = { ...prev }; delete n.seconds; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.seconds ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.seconds && <p className="text-xs text-rose-500">{errors.seconds}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Pace
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Your Pace</span>
              <div className="text-5xl font-mono font-bold text-blue-600">{result.pace}</div>
              <span className="text-lg text-muted-foreground">per {unit}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Pace per KM</span>
                <div className="text-3xl font-mono font-bold">{result.timePerKm}</div>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Pace per Mile</span>
                <div className="text-3xl font-mono font-bold">{result.timePerMile}</div>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Average Speed</span>
              <div className="text-3xl font-mono font-bold">{formatNumber(result.speed, { decimals: 2 })} {unit}/hr</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Estimated Race Times</h3>
              <div className="space-y-3">
                {result.raceTimes.map((race, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <span className="font-bold">{race.distance}</span>
                    <span className="text-2xl font-mono font-bold text-blue-600">{race.time}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">These are estimates based on your current pace. Actual race performance depends on terrain, weather, and fitness.</p>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Running Pace</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Pace vs. Speed</h3>
              <p className="text-slate-700 leading-relaxed">
                Pace (min/km or min/mi) tells you how long it takes to cover a unit of distance. Speed (km/hr or mi/hr) tells you how much distance you cover in a unit of time. Runners typically use pace because it\'s more intuitive for planning race splits and training runs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Pace Zones</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Easy pace:</strong> Conversational, can hold a full sentence</li>
                <li><strong>Tempo pace:</strong> Comfortably hard, breathing heavily but controlled</li>
                <li><strong>Threshold pace:</strong> Hard but sustainable for 30-60 minutes</li>
                <li><strong>Interval pace:</strong> Very hard, used for short intense bursts</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Using This Calculator</h3>
              <p className="text-slate-700 leading-relaxed">
                Enter any distance and time to calculate your pace. This helps you plan race-day pacing, set realistic goals, and predict finish times for different distances. For example, if you ran 10K in 55 minutes, you can estimate your marathon time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p className="text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Health Calculators</h2>
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
