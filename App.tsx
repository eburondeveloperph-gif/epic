
import React, { useState, useEffect, useCallback } from 'react';
import { PillarType, AIEngineConfig } from './types';
import { IntelligenceModule } from './components/IntelligenceModule';
import { SpacesModule } from './components/SpacesModule';
import { ApexModule } from './components/ApexModule';
import { getEPICInsights } from './services/gemini';

const App: React.FC = () => {
  const [activePillar, setActivePillar] = useState<PillarType>(PillarType.INTELLIGENCE);
  const [aiInsights, setAiInsights] = useState<string>("Initializing intelligence engine...");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global AI Whitelabel Configuration
  const [aiConfig, setAiConfig] = useState<AIEngineConfig>({
    brandName: "EPIC Strategy Core",
    modelName: "GENESIS-R1-ULTRA",
    provider: "Gemini-3-Pro",
    latency: "14ms",
    status: "OPTIMAL"
  });

  // DB Metadata from env context provided by user
  const DB_HOST = "aws-1-ap-south-1.pooler.supabase.co";

  const fetchInsights = useCallback(async () => {
    setLoadingInsights(true);
    const context = `Pillar: ${activePillar}. AI Whitelabel: ${aiConfig.brandName} (${aiConfig.modelName}). Analyzing system-wide resilience patterns.`;
    const insights = await getEPICInsights(context);
    setAiInsights(insights);
    setLoadingInsights(false);
  }, [activePillar, aiConfig]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const navItems = [
    { id: PillarType.INTELLIGENCE, label: 'Intelligence', icon: '🧠', color: 'blue' },
    { id: PillarType.SPACES, label: 'Spaces', icon: '🔋', color: 'amber' },
    { id: PillarType.APEX, label: 'Apex', icon: '⚡', color: 'teal' },
  ];

  const handleWhitelabelUpdate = (brand: string, model: string, provider: string) => {
    setAiConfig(prev => ({ ...prev, brandName: brand, modelName: model, provider: provider }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white overflow-hidden font-sans">
      {/* Mobile Top Navigation */}
      <div className="md:hidden glass h-16 px-6 flex items-center justify-between sticky top-0 z-50 border-b border-white/5">
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter">EPIC<span className="text-blue-500">OS</span></h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 glass rounded-xl flex flex-col items-center justify-center gap-1.5 active:scale-90 transition-transform apple-button"
        >
          <div className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>

      {/* Sidebar / Menu */}
      <aside className={`
        fixed md:relative inset-0 md:inset-auto z-40 w-full md:w-80 
        bg-black/95 md:bg-black md:glass md:border-r md:border-white/5 
        flex flex-col p-8 md:p-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 opacity-0 md:opacity-100'}
      `}>
        <div className="hidden md:block mb-12">
          <h1 className="text-3xl font-black tracking-tighter text-white">EPIC<span className="text-blue-500">OS</span></h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[9px] text-slate-500 font-black tracking-[0.3em] uppercase">Genesis v2.0</p>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4">Core Pillars</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePillar(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative apple-button ${
                activePillar === item.id 
                  ? 'bg-white/10 text-white shadow-2xl ring-1 ring-white/10' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className={`text-xl transition-all ${activePillar === item.id ? 'scale-110 grayscale-0' : 'grayscale opacity-40'}`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-tight uppercase">{item.label}</span>
              {activePillar === item.id && (
                <div className={`ml-auto w-1 h-5 rounded-full bg-${item.color}-500 shadow-[0_0_12px_rgba(255,255,255,0.3)]`} />
              )}
            </button>
          ))}
          
          <div className="pt-8">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4">AI Kernel</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { brand: "EPIC Core", model: "GEN-R1", prov: "Gemini 3 Pro" },
                { brand: "Apex Logic", model: "AL-70B", prov: "Llama 3.1" }
              ].map((engine) => (
                <button 
                  key={engine.brand}
                  onClick={() => handleWhitelabelUpdate(engine.brand, engine.model, engine.prov)}
                  className={`text-left p-3 rounded-xl glass transition-all apple-button border ${aiConfig.brandName === engine.brand ? 'border-teal-500/40 bg-teal-500/5' : 'border-white/5 opacity-50'}`}
                >
                  <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{engine.brand}</p>
                  <p className="text-[8px] font-mono text-slate-500 uppercase">{engine.model}</p>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xs font-black bg-gradient-to-br from-blue-600 to-indigo-700">JD</div>
            <div>
              <p className="text-xs font-bold">Jane Doe</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Director</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Database Node</span>
              <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono truncate bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {DB_HOST.substring(0, 18)}...
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-black relative">
        <header className="hidden md:flex h-24 border-b border-white/5 items-center justify-between px-12 shrink-0 glass sticky top-0 z-30 shadow-xl">
          <div className="flex items-center gap-4">
            <div className={`w-1 h-8 rounded-full ${
              activePillar === PillarType.INTELLIGENCE ? 'bg-blue-500' : 
              activePillar === PillarType.SPACES ? 'bg-amber-500' : 'bg-teal-500'
            }`} />
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">
                {activePillar === PillarType.INTELLIGENCE ? 'Intelligence Node' : 
                 activePillar === PillarType.SPACES ? 'Spaces OS' : 
                 'Apex Performance'}
              </h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">{aiConfig.brandName} Synthesis</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">AI Protocol</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400">{aiConfig.modelName}</span>
            </div>
            <button className="px-6 py-2.5 bg-white text-black text-xs font-black rounded-full hover:bg-slate-200 apple-button shadow-2xl transition-all">
              EXTRACT DATA
            </button>
          </div>
        </header>

        {/* Dynamic Pillar Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:p-12 space-y-12">
          {activePillar === PillarType.INTELLIGENCE && <IntelligenceModule />}
          {activePillar === PillarType.SPACES && <SpacesModule />}
          {activePillar === PillarType.APEX && <ApexModule activeEngine={aiConfig} />}

          {/* AI Strategy Bar */}
          <section className="glass rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl border-white/5">
            <div className="flex flex-col lg:flex-row items-start gap-10 relative z-10">
              <div className="w-16 h-16 rounded-[1.5rem] glass flex items-center justify-center shrink-0 shadow-2xl bg-gradient-to-br from-indigo-500/10 to-transparent">
                <span className="text-2xl">✨</span>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-3xl font-black tracking-tight text-white mb-1">{aiConfig.brandName}</h3>
                    <p className="text-slate-500 font-medium text-base italic leading-relaxed">Cross-pillar strategic synthesis processed via neural kernel.</p>
                  </div>
                  <button 
                    onClick={fetchInsights}
                    disabled={loadingInsights}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-white apple-button glass px-5 py-2.5 rounded-full border-white/10"
                  >
                    {loadingInsights ? 'CALCULATING...' : 'SYNC AI'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {loadingInsights ? (
                    <div className="space-y-4">
                      <div className="h-6 bg-white/5 rounded-2xl animate-pulse w-full" />
                      <div className="h-6 bg-white/5 rounded-2xl animate-pulse w-3/4" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {aiInsights.split('\n').filter(line => line.trim()).map((line, idx) => (
                        <div key={idx} className="flex gap-6 text-slate-300 items-center p-6 glass rounded-[1.5rem] hover:bg-white/5 transition-all duration-300 group/item border-white/5">
                          <div className="w-1 h-8 bg-indigo-500 rounded-full group-hover/item:scale-y-125 transition-transform" />
                          <p className="text-sm md:text-base font-semibold leading-relaxed tracking-tight">
                            {line.replace(/^[\*\-\s\d\.]+/, '').trim()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-20 pb-10 flex flex-col items-center gap-4 text-center opacity-40">
            <p className="text-[9px] font-black tracking-[0.5em] uppercase text-slate-600">
              EPIC-OS / GENESIS v2.0
            </p>
            <div className="text-[8px] font-mono text-slate-800 uppercase tracking-tighter">
              NODE: {DB_HOST} // STATUS: STABLE
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
