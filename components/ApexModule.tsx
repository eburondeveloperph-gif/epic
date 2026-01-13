
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { generateApexData } from '../services/mockData';
import { ApexMetrics, AIEngineConfig } from '../types';

interface ApexModuleProps {
  activeEngine: AIEngineConfig;
}

export const ApexModule: React.FC<ApexModuleProps> = ({ activeEngine }) => {
  const [execData, setExecData] = useState<ApexMetrics[]>(generateApexData());

  useEffect(() => {
    const interval = setInterval(() => {
      setExecData(generateApexData());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 animate-in zoom-in-95 duration-700 ease-out">
      {/* Whitelabeled AI Engine Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] relative overflow-hidden group border-white/5">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-all">
            <span className="text-6xl">🧠</span>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-teal-500/20 to-blue-500/20 glass flex items-center justify-center border border-white/10 shadow-2xl shrink-0">
               <div className="w-8 h-8 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Active Neural Core</p>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{activeEngine.brandName}</h3>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="px-3 py-1 glass rounded-full text-[9px] font-mono font-bold text-teal-400 border-teal-500/20">MODEL: {activeEngine.modelName}</span>
                <span className="px-3 py-1 glass rounded-full text-[9px] font-mono font-bold text-slate-400 border-white/10">PROVIDER: {activeEngine.provider}</span>
                <span className="flex items-center gap-2 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  {activeEngine.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] flex flex-col justify-center border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Process Latency</p>
          <p className="text-4xl font-black text-white tracking-tighter font-mono">{activeEngine.latency}</p>
          <div className="mt-4 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
             <div className="h-full bg-teal-500 w-[85%] shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
          </div>
        </div>
      </div>

      {/* Executive Bio-Sync Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {execData.map((exec, idx) => (
          <div key={idx} className="glass p-8 rounded-[3rem] shadow-2xl flex flex-col border-white/5 group hover:bg-white/[0.02] transition-all duration-500">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Node Protocol</h4>
                <p className="text-2xl font-black tracking-tight">{exec.userId}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                exec.status === 'Peak' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_12px_rgba(20,184,166,0.2)]' :
                exec.status === 'Optimizing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {exec.status}
              </div>
            </div>

            <div className="flex-1 min-h-[280px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                  { subject: 'HRV', A: exec.hrv, fullMark: 100 },
                  { subject: 'Sleep', A: exec.sleepScore, fullMark: 100 },
                  { subject: 'Ready', A: exec.readinessScore, fullMark: 100 },
                  { subject: 'Output', A: exec.businessOutput, fullMark: 100 },
                  { subject: 'Stability', A: 85, fullMark: 100 },
                ]}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name={exec.userId} 
                    dataKey="A" 
                    stroke="#14b8a6" 
                    strokeWidth={3}
                    fill="#14b8a6" 
                    fillOpacity={0.4} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1c1e', border: 'none', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                 <span className="text-6xl">⚡</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="glass bg-white/[0.02] p-4 rounded-[1.5rem] border-white/5">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Readiness</p>
                <p className="text-2xl font-black text-teal-400 font-mono tracking-tighter">{exec.readinessScore}</p>
              </div>
              <div className="glass bg-white/[0.02] p-4 rounded-[1.5rem] border-white/5">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">HRV Sync</p>
                <p className="text-2xl font-black text-slate-200 font-mono tracking-tighter">{exec.hrv}</p>
              </div>
            </div>
            
            <button className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">
              Secure Bio-Sync Tunnel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
