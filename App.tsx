
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PillarType, AIEngineConfig } from './types';
import { IntelligenceModule } from './components/IntelligenceModule';
import { SpacesModule } from './components/SpacesModule';
import { ApexModule } from './components/ApexModule';
import { DeploymentSandbox } from './components/DeploymentSandbox';
import { getEPICInsights } from './services/gemini';

const App: React.FC = () => {
  const [activePillar, setActivePillar] = useState<PillarType>(PillarType.INTELLIGENCE);
  const [aiInsights, setAiInsights] = useState<string>("Initializing neural link to WCX CLOUD SERVER...");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  const loadingRef = useRef(false);

  // Whitelabeled AI Configuration: Apex Pro (WCX CLOUD SERVER / OLLAMA cloud engine)
  const [aiConfig, setAiConfig] = useState<AIEngineConfig>({
    brandName: "Apex Pro",
    modelName: "Apex v1 (Gemini 3 Pro)",
    provider: "WCX CLOUD SERVER",
    latency: "12ms",
    status: "OPTIMAL"
  });

  const DB_HOST = "aws-1-ap-south-1.pooler.supabase.co";

  const fetchInsights = useCallback(async () => {
    if (loadingRef.current || cooldown > 0) return;
    
    loadingRef.current = true;
    setLoadingInsights(true);
    
    const context = `Pillar: ${activePillar}. Engine: ${aiConfig.brandName} (${aiConfig.modelName}). System Health: ${aiConfig.status}. Infrastructure: WCX CLOUD SERVER / OLLAMA Cloud.`;
    const insights = await getEPICInsights(context);
    
    setAiInsights(insights || "No data synthesized.");
    setLoadingInsights(false);
    loadingRef.current = false;

    // Trigger cooldown if quota error detected
    if (insights.includes('QUOTA EXHAUSTED')) {
      setCooldown(30);
    }
  }, [activePillar, aiConfig, cooldown]);

  useEffect(() => {
    fetchInsights();
  }, [activePillar]);

  // Cooldown timer logic
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const navItems = [
    { id: PillarType.INTELLIGENCE, label: 'Intelligence', icon: '🧠', color: 'blue' },
    { id: PillarType.SPACES, label: 'Spaces', icon: '🔋', color: 'amber' },
    { id: PillarType.APEX, label: 'Apex', icon: '⚡', color: 'teal' },
  ];

  const handleWhitelabelUpdate = (brand: string, model: string, provider: string) => {
    setAiConfig(prev => ({ 
      ...prev, 
      brandName: brand, 
      modelName: model, 
      provider: provider,
      latency: `${Math.floor(Math.random() * 5) + 8}ms` 
    }));
  };

  const themeClasses = isDarkMode ? "bg-black text-white" : "bg-[#F5F5F7] text-[#1D1D1F]";
  const cardClasses = isDarkMode 
    ? "glass border-white/5 shadow-2xl" 
    : "bg-white/80 backdrop-blur-xl border-[#D2D2D7] shadow-lg shadow-black/5";

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-700 overflow-hidden font-sans ${themeClasses}`}>
      
      {/* Sandbox Terminal Overlay */}
      <DeploymentSandbox 
        isOpen={isDeploying} 
        onClose={() => setIsDeploying(false)} 
        brandName={aiConfig.brandName}
        modelName={aiConfig.modelName}
        isDarkMode={isDarkMode}
      />

      {/* Mobile Top Navigation */}
      <div className={`md:hidden h-16 px-6 flex items-center justify-between sticky top-0 z-50 border-b ${isDarkMode ? 'border-white/5 bg-black/50 backdrop-blur-lg' : 'border-[#D2D2D7] bg-white/50 backdrop-blur-lg'}`}>
        <h1 className="text-xl font-black tracking-tighter">EPIC<span className="text-blue-500">OS</span></h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-9 h-9 flex items-center justify-center rounded-xl glass active:scale-90 transition-transform">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-9 h-9 flex flex-col items-center justify-center gap-1 glass rounded-xl">
            <div className={`w-4 h-0.5 transition-all ${isDarkMode ? 'bg-white' : 'bg-black'} ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-4 h-0.5 transition-all ${isDarkMode ? 'bg-white' : 'bg-black'} ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-4 h-0.5 transition-all ${isDarkMode ? 'bg-white' : 'bg-black'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-0 md:inset-auto z-40 w-full md:w-80 
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        flex flex-col p-8 md:p-10 border-r
        ${isDarkMode ? 'bg-black/95 md:bg-black glass border-white/5' : 'bg-white/95 md:bg-[#F5F5F7] border-[#D2D2D7] shadow-xl'}
        ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 opacity-0 md:opacity-100'}
      `}>
        <div className="hidden md:block mb-12">
          <h1 className="text-3xl font-black tracking-tighter">EPIC<span className="text-blue-500">OS</span></h1>
          <p className={`text-[9px] font-black tracking-[0.3em] uppercase mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Kernel: {aiConfig.brandName}</p>
        </div>

        <nav className="flex-1 space-y-4">
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>System Pillars</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActivePillar(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all apple-button ${
                activePillar === item.id 
                  ? (isDarkMode ? 'bg-white/10 text-white shadow-2xl' : 'bg-white text-[#1D1D1F] shadow-lg border border-[#D2D2D7]')
                  : (isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5')
              }`}
            >
              <span className={`text-xl transition-all ${activePillar === item.id ? 'scale-110 grayscale-0' : 'grayscale opacity-40'}`}>{item.icon}</span>
              <span className="font-bold text-sm tracking-tight uppercase">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-10">
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Apex Neural Select</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { brand: "Apex Pro", model: "Apex v1 (Gemini 3 Pro)", prov: "WCX CLOUD SERVER" },
                { brand: "Apex Pro", model: "Apex v2 (Gemini 3 Pro)", prov: "WCX CLOUD SERVER" },
                { brand: "Apex Pro", model: "Apex v3 (Gemini 3 Pro)", prov: "WCX CLOUD SERVER" }
              ].map((engine) => (
                <button 
                  key={engine.model}
                  onClick={() => handleWhitelabelUpdate(engine.brand, engine.model, engine.prov)}
                  className={`text-left p-3 rounded-xl transition-all border ${aiConfig.modelName === engine.model ? (isDarkMode ? 'border-teal-500/40 bg-teal-500/5' : 'border-teal-500/60 bg-teal-50') : (isDarkMode ? 'border-white/5 opacity-50' : 'border-[#D2D2D7] opacity-60')}`}
                >
                  <p className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>{engine.brand}</p>
                  <p className="text-[8px] font-mono uppercase text-slate-500">{engine.model}</p>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">JD</div>
            <div>
              <p className="text-xs font-bold">Jane Doe</p>
              <p className={`text-[9px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Resilience Director</p>
            </div>
          </div>
          <div className={`p-2 rounded-lg border text-[9px] font-mono ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-black/5 border-[#D2D2D7] text-slate-600'}`}>
            DB: {DB_HOST.substring(0, 16)}...
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        <header className={`hidden md:flex h-24 border-b items-center justify-between px-12 sticky top-0 z-30 transition-all ${isDarkMode ? 'bg-black/40 backdrop-blur-xl border-white/5' : 'bg-white/40 backdrop-blur-xl border-[#D2D2D7]'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-1 h-6 rounded-full ${activePillar === PillarType.INTELLIGENCE ? 'bg-blue-500' : activePillar === PillarType.SPACES ? 'bg-amber-500' : 'bg-teal-500'}`} />
            <h2 className="text-xl font-black uppercase tracking-tight">{activePillar} OS</h2>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className="text-right">
              <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Active Kernel</p>
              <p className="text-[10px] font-mono font-bold text-emerald-400">{aiConfig.brandName} ({aiConfig.modelName})</p>
            </div>
            <button 
              onClick={() => setIsDeploying(true)}
              className={`px-6 py-2.5 text-xs font-black rounded-full apple-button shadow-2xl ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              DEPLOY WCX CLOUD
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 md:p-12 space-y-12">
          {activePillar === PillarType.INTELLIGENCE && <IntelligenceModule isDarkMode={isDarkMode} />}
          {activePillar === PillarType.SPACES && <SpacesModule isDarkMode={isDarkMode} />}
          {activePillar === PillarType.APEX && <ApexModule activeEngine={aiConfig} isDarkMode={isDarkMode} />}

          {/* AI Strategy Insights */}
          <section className={`rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden transition-all duration-1000 ${cardClasses}`}>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-1">{aiConfig.brandName} Synthesis</h3>
                  <p className={`font-medium text-sm italic ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Resilience modeling via OLLAMA cloud engine on WCX nodes.</p>
                </div>
                <button 
                  onClick={fetchInsights} 
                  disabled={loadingInsights || cooldown > 0} 
                  className={`text-[10px] font-black uppercase tracking-widest apple-button px-5 py-2.5 rounded-full border transition-all ${
                    loadingInsights || cooldown > 0
                      ? (isDarkMode ? 'border-white/20 text-slate-500' : 'border-slate-200 text-slate-400') 
                      : (isDarkMode ? 'bg-white text-black border-white hover:scale-105' : 'bg-black text-white border-black hover:scale-105')
                  }`}
                >
                  {loadingInsights ? 'SYNTHESIZING...' : cooldown > 0 ? `COOLING DOWN (${cooldown}s)` : 'RE-SYNC APEX'}
                </button>
              </div>
              <div className="space-y-3">
                {aiInsights.split('\n').filter(l => l.trim()).map((line, idx) => {
                  const isError = line.includes('QUOTA') || line.includes('EXHAUSTED') || line.includes('exhausted');
                  return (
                    <div key={idx} className={`flex gap-4 items-center p-5 rounded-2xl border transition-all ${
                      isError 
                        ? (isDarkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200')
                        : (isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-[#D2D2D7] hover:border-indigo-300 shadow-sm')
                    }`}>
                      <div className={`w-1 h-6 rounded-full shrink-0 ${isError ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <p className={`text-sm font-semibold leading-relaxed ${
                        isError 
                          ? (isDarkMode ? 'text-red-400' : 'text-red-700') 
                          : (isDarkMode ? 'text-slate-300' : 'text-[#1D1D1F]')
                      }`}>{line.replace(/^[\*\-\s\d\.]+/, '').trim()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <footer className="pt-10 pb-10 flex flex-col items-center gap-4 text-center opacity-30">
            <p className="text-[9px] font-black tracking-[0.4em] uppercase">{aiConfig.brandName} // WCX CLOUD SERVER // OLLAMA ENGINE INFRASTRUCTURE</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
