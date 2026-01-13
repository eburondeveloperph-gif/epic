
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { generateAttritionData } from '../services/mockData';
import { AttritionRisk } from '../types';

interface IntelligenceModuleProps {
  isDarkMode?: boolean;
}

export const IntelligenceModule: React.FC<IntelligenceModuleProps> = ({ isDarkMode = true }) => {
  const [data, setData] = useState<AttritionRisk[]>(generateAttritionData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateAttritionData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const cardClasses = isDarkMode 
    ? "glass border-white/5" 
    : "bg-white border-[#D2D2D7] shadow-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-1">Burnout Radar</h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Predictive attrition and organizational fatigue modeling.</p>
        </div>
        <div className={`px-4 py-2 rounded-2xl border ${isDarkMode ? 'glass border-white/5' : 'bg-white border-[#D2D2D7]'}`}>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Model: Attrition Engine 2.4</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-8 rounded-[2rem] shadow-xl border ${cardClasses}`}>
          <h3 className={`text-lg font-bold mb-8 ${isDarkMode ? 'text-white/90' : 'text-[#1D1D1F]'}`}>Attrition Risk Profile</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} vertical={false} />
                <XAxis dataKey="department" stroke={isDarkMode ? "#475569" : "#86868B"} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis domain={[0, 1]} stroke={isDarkMode ? "#475569" : "#86868B"} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1c1c1e' : '#FFFFFF', 
                    border: isDarkMode ? 'none' : '1px solid #D2D2D7', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
                  }}
                  itemStyle={{ color: isDarkMode ? '#FFF' : '#1D1D1F' }}
                />
                <Bar dataKey="score" fill={isDarkMode ? "#3b82f6" : "#0071E3"} radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-8 rounded-[2rem] shadow-xl border ${cardClasses}`}>
          <h3 className={`text-lg font-bold mb-8 ${isDarkMode ? 'text-white/90' : 'text-[#1D1D1F]'}`}>Fatigue Volatility (Forecast)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} vertical={false} />
                <XAxis dataKey="department" stroke={isDarkMode ? "#475569" : "#86868B"} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis stroke={isDarkMode ? "#475569" : "#86868B"} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1c1c1e' : '#FFFFFF', 
                    border: isDarkMode ? 'none' : '1px solid #D2D2D7', 
                    borderRadius: '16px' 
                  }}
                />
                <Line type="monotone" dataKey="fatigueIndex" stroke={isDarkMode ? "#ef4444" : "#FF3B30"} strokeWidth={4} dot={{ r: 6, fill: isDarkMode ? '#ef4444' : '#FF3B30', strokeWidth: 3, stroke: isDarkMode ? '#000' : '#FFF' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={`p-8 rounded-[2rem] shadow-xl border ${cardClasses}`}>
        <h3 className={`text-lg font-bold mb-8 ${isDarkMode ? 'text-white/90' : 'text-[#1D1D1F]'}`}>Live Risk Ticker</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-widest border-b ${isDarkMode ? 'text-slate-500 border-white/5' : 'text-slate-400 border-[#D2D2D7]'}`}>
                <th className="pb-6 px-4">Entity</th>
                <th className="pb-6 px-4">Risk Magnitude</th>
                <th className="pb-6 px-4">Fatigue</th>
                <th className="pb-6 px-4">Velocity</th>
                <th className="pb-6 px-4">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-[#D2D2D7]'}`}>
              {data.map((item, idx) => (
                <tr key={idx} className={`group transition-all duration-300 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
                  <td className={`py-6 px-4 font-black text-sm ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>{item.department}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-24 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                        <div 
                          className={`h-full transition-all duration-1000 ${item.score > 0.7 ? 'bg-red-500' : item.score > 0.4 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                          style={{ width: `${item.score * 100}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{(item.score * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className={`py-6 px-4 font-mono text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.fatigueIndex}</td>
                  <td className="py-6 px-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                      item.trend === 'up' 
                        ? (isDarkMode ? 'text-red-400 bg-red-400/10' : 'text-red-600 bg-red-50') 
                        : (isDarkMode ? 'text-emerald-400 bg-emerald-400/10' : 'text-emerald-600 bg-emerald-50')
                    }`}>
                      {item.trend}
                    </span>
                  </td>
                  <td className="py-6 px-4">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`} />
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
