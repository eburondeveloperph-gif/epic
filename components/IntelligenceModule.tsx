
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { generateAttritionData } from '../services/mockData';
import { AttritionRisk } from '../types';

export const IntelligenceModule: React.FC = () => {
  const [data, setData] = useState<AttritionRisk[]>(generateAttritionData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateAttritionData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-1">Burnout Radar</h2>
          <p className="text-slate-400 text-sm">Predictive attrition and organizational fatigue modeling.</p>
        </div>
        <div className="glass px-4 py-2 rounded-2xl">
          <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">Model: Attrition Engine 2.4</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2rem] shadow-xl">
          <h3 className="text-lg font-bold mb-8 text-white/90">Attrition Risk Profile</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="department" stroke="#475569" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis domain={[0, 1]} stroke="#475569" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#1c1c1e', border: 'none', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] shadow-xl">
          <h3 className="text-lg font-bold mb-8 text-white/90">Fatigue Volatility (Forecast)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="department" stroke="#475569" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis stroke="#475569" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1e', border: 'none', borderRadius: '16px' }}
                />
                <Line type="monotone" dataKey="fatigueIndex" stroke="#ef4444" strokeWidth={4} dot={{ r: 6, fill: '#ef4444', strokeWidth: 3, stroke: '#000' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[2rem] shadow-xl">
        <h3 className="text-lg font-bold mb-8 text-white/90">Live Risk Ticker</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="pb-6 px-4">Entity</th>
                <th className="pb-6 px-4">Risk Magnitude</th>
                <th className="pb-6 px-4">Fatigue</th>
                <th className="pb-6 px-4">Velocity</th>
                <th className="pb-6 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((item, idx) => (
                <tr key={idx} className="group hover:bg-white/5 transition-all duration-300">
                  <td className="py-6 px-4 font-black text-sm">{item.department}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${item.score > 0.7 ? 'bg-red-500' : item.score > 0.4 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                          style={{ width: `${item.score * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold">{(item.score * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-6 px-4 font-mono text-xs">{item.fatigueIndex}</td>
                  <td className="py-6 px-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                      item.trend === 'up' ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'
                    }`}>
                      {item.trend}
                    </span>
                  </td>
                  <td className="py-6 px-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
