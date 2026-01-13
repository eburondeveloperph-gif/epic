
import React, { useState, useEffect, useCallback } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { generateEnergyData } from '../services/mockData';
import { EnergyMetrics } from '../types';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-4 rounded-2xl min-w-[220px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Telemetry</span>
          <span className="text-[10px] font-bold text-white font-mono">{label}</span>
        </div>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-xs font-semibold text-slate-300">{entry.name}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-white font-mono">
                  {entry.value.toFixed(2)}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">kW</span>
              </div>
            </div>
          ))}
          
          <div className="pt-3 mt-1 border-t border-white/5 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Stability Index</span>
              <span className="text-[10px] text-emerald-400 font-black">99.4%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
               <div className="bg-emerald-500 h-full w-[99.4%]" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const SpacesModule: React.FC = () => {
  const [metrics, setMetrics] = useState<EnergyMetrics>(generateEnergyData());
  const [history, setHistory] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateData = useCallback(() => {
    const newData = generateEnergyData();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setMetrics(newData);
    setHistory(prev => [...prev.slice(-24), { 
      time: timeStr, 
      Grid: newData.gridUsage, 
      Solar: newData.solarUsage 
    }]);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    updateData();
    // Brief delay for visual feedback
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    // Populate some initial points for a fuller chart
    const initialPoints = Array.from({ length: 20 }).map((_, i) => {
      const d = new Date();
      d.setSeconds(d.getSeconds() - (20 - i) * 3);
      const m = generateEnergyData();
      return {
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        Grid: m.gridUsage,
        Solar: m.solarUsage
      };
    });
    setHistory(initialPoints);

    const interval = setInterval(updateData, 3000);
    return () => clearInterval(interval);
  }, [updateData]);

  const pieData = [
    { name: 'Grid', value: metrics.gridUsage },
    { name: 'Solar', value: metrics.solarUsage }
  ];
  const COLORS = ['#475569', '#FBBF24'];

  return (
    <div className="space-y-6 md:space-y-10 animate-in slide-in-from-bottom-8 duration-700 ease-out">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-blue-400 animate-ping' : 'bg-amber-500 animate-pulse'}`} />
             <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isRefreshing ? 'text-blue-400' : 'text-amber-500'}`}>
                {isRefreshing ? 'Synchronizing Node...' : 'Live Environment Monitor'}
             </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">Energy OS</h2>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-md">
            Advanced solar harvesting and grid stability metrics for Equilibrium Partners hubs.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="apple-button glass px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className={`text-sm transition-transform duration-500 ${isRefreshing ? 'rotate-180' : ''}`}>🔄</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Manual Refresh</span>
          </button>

          <div className="glass px-5 py-3 rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Efficiency</p>
              <p className="text-sm font-bold text-emerald-400">98.2%</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Savings</p>
              <p className="text-sm font-bold text-white">+{metrics.savingsPerHour.toFixed(2)}/h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Storage', value: `${metrics.batteryLevel}%`, sub: 'Li-Ion Normal', color: 'text-emerald-400', icon: '🔋' },
          { label: 'Harvest', value: `${metrics.solarUsage.toFixed(1)}`, sub: 'Peak kW', color: 'text-amber-400', icon: '☀️' },
          { label: 'Air CO2', value: `${metrics.co2Level.toFixed(0)}`, sub: 'PPM Density', color: metrics.co2Level > 800 ? 'text-red-400' : 'text-blue-400', icon: '🌬️' },
          { label: 'Luminosity', value: `${metrics.lux.toFixed(0)}`, sub: 'Lux Sync', color: 'text-indigo-400', icon: '💡' }
        ].map((stat, idx) => (
          <div key={idx} className="glass p-6 rounded-[2rem] relative overflow-hidden group active:scale-95 transition-all duration-300">
            <span className="absolute top-4 right-6 text-xl opacity-30 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl md:text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
            <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Load Area Chart */}
        <div className="lg:col-span-2 glass p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
               <h3 className="text-xl font-bold tracking-tight text-white">Load Balancing</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time source distribution</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Solar</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="Grid" 
                  stackId="1" 
                  stroke="#475569" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorGrid)" 
                  animationDuration={1000}
                />
                <Area 
                  type="monotone" 
                  dataKey="Solar" 
                  stackId="1" 
                  stroke="#FBBF24" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorSolar)" 
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Mix Donut */}
        <div className="glass p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center text-center">
          <div className="w-full text-left mb-6">
             <h3 className="text-xl font-bold text-white">Current Mix</h3>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Source weighting</p>
          </div>
          
          <div className="h-[250px] w-full relative group">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={75} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="hover:opacity-80 transition-opacity outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1c1c1e', border: 'none', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Solar</span>
              <span className="text-4xl font-black text-amber-400 tracking-tighter">
                {((metrics.solarUsage / (metrics.solarUsage + metrics.gridUsage)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="mt-10 space-y-3 w-full">
            <div className="glass bg-white/[0.02] p-4 rounded-2xl flex justify-between items-center hover:bg-white/5 transition-colors">
              <span className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Grid
              </span>
              <span className="font-mono text-sm font-black text-white">{metrics.gridUsage.toFixed(1)} kW</span>
            </div>
            <div className="glass bg-white/[0.02] p-4 rounded-2xl flex justify-between items-center hover:bg-white/5 transition-colors">
              <span className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" /> Solar
              </span>
              <span className="font-mono text-sm font-black text-amber-400">{metrics.solarUsage.toFixed(1)} kW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
