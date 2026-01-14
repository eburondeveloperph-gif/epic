
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { generateApexData } from '../services/mockData';
import { ApexMetrics, AIEngineConfig } from '../types';

interface ApexModuleProps {
  activeEngine: AIEngineConfig;
  isDarkMode?: boolean;
}

export const ApexModule: React.FC<ApexModuleProps> = ({ activeEngine, isDarkMode = true }) => {
  const [execData, setExecData] = useState<ApexMetrics[]>(generateApexData());
  const [neuralPulse, setNeuralPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setExecData(generateApexData());
    }, 10000);
    
    const pulseInterval = setInterval(() => {
      setNeuralPulse(p => (p + 1) % 100);
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(pulseInterval);
    };
  }, []);

  const cardClasses = isDarkMode 
    ? "glass border-white/5" 
    : "bg-white border-[#D2D2D7] shadow-sm";

  return (
    <div className="space-y-10 animate-in zoom-in-95 duration-700 ease-out">
      {/* Dynamic Whitelabel Engine Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-10 rounded-[3rem] relative overflow-hidden group border transition-all ${cardClasses}`}>
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at ${neuralPulse}% 50%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)`,
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center border shadow-2xl shrink-0 transition-all ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-teal-200'}`}>
               <div className="relative">
                 <div className={`w-12 h-12 rounded-full border-4 border-t-transparent animate-spin ${isDarkMode ? 'border-teal-400' : 'border-teal-600'}`} />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full animate-ping ${isDarkMode ? 'bg-teal-400' : 'bg-teal-600'}`} />
                 </div>
               </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-teal-500/80' : 'text-teal-600'}`}>Secure Node Established</span>
                <div className={`w-1 h-1 rounded-full animate-pulse ${isDarkMode ? 'bg-teal-500' : 'bg-teal-600'}`} />
              </div>
              <h3 className={`text-4xl font-black tracking-tighter uppercase leading-none ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>
                {activeEngine.brandName}
              </h3>
              <p className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Neural Backbone: <span className={isDarkMode ? 'text-white' : 'text-black'}>{activeEngine.provider}</span>
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Fabric ID</span>
                  <span className={`text-[10px] font-mono font-bold ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>{activeEngine.modelName.replace(/\s/g, '_')}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Mode</span>
                  <span className="text-[10px] font-black uppercase text-emerald-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    {activeEngine.modelName.includes('v3') ? 'Sovereign Insight' : 'Core Processing'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latency Performance Meter */}
        <div className={`p-10 rounded-[3rem] flex flex-col justify-center relative overflow-hidden border transition-all ${cardClasses}`}>
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="text-6xl font-black">APEX</span>
          </div>
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Offload Latency</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-5xl font-black tracking-tighter font-mono ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>{activeEngine.latency}</p>
            <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>ms</span>
          </div>
          <div className={`mt-6 w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
             <div 
               className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-1000" 
               style={{ width: activeEngine.modelName.includes('v3') ? '35%' : '95%' }} 
             />
          </div>
          <p className={`text-[9px] font-bold uppercase tracking-widest mt-4 ${isDarkMode ? 'text-emerald-500/60' : 'text-emerald-600'}`}>
            Optimized by EPIC Private Fabric
          </p>
        </div>
      </div>

      {/* Executive Bio-Sync Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {execData.map((exec, idx) => (
          <div key={idx} className={`p-8 rounded-[3rem] shadow-2xl flex flex-col group transition-all duration-500 border ${cardClasses} ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:border-teal-300'}`}>
            <div className="flex justify-between items-start mb-10">
              <div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Executive Identity</h4>
                <p className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>{exec.userId}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                exec.status === 'Peak' ? 'bg-teal-500/10 text-teal-500 border-teal-500/20' :
                exec.status === 'Optimizing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                'bg-red-500/10 text-red-500 border-red-500/20'
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
                  <PolarGrid stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? '#475569' : '#86868B', fontSize: 10, fontWeight: 900 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name={exec.userId} 
                    dataKey="A" 
                    stroke={isDarkMode ? "#14b8a6" : "#059669"} 
                    strokeWidth={3}
                    fill={isDarkMode ? "#14b8a6" : "#059669"} 
                    fillOpacity={0.4} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1c1c1e' : '#FFFFFF', 
                      border: 'none', 
                      borderRadius: '16px', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
                 <span className="text-6xl text-teal-500">APEX</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className={`p-5 rounded-[1.5rem] border group-hover:scale-105 transition-transform ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Readiness</p>
                <p className={`text-2xl font-black font-mono tracking-tighter ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>{exec.readinessScore}</p>
              </div>
              <div className={`p-5 rounded-[1.5rem] border group-hover:scale-105 transition-transform delay-75 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>HRV Sync</p>
                <p className={`text-2xl font-black font-mono tracking-tighter ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{exec.hrv}</p>
              </div>
            </div>
            
            <button className={`mt-8 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 border group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/5 text-teal-400' : 'bg-black text-white hover:bg-gray-800 border-black'}`}>
              Establish Secure Sync
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
