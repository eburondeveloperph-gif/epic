
import React, { useState, useEffect, useRef } from 'react';

interface DeploymentSandboxProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  modelName: string;
  isDarkMode: boolean;
}

const getLogMessages = (brand: string, model: string) => [
  `Initializing ${brand} Sandbox Environment...`,
  "Authenticating with WCX CLOUD SERVER remote host...",
  `Executing: ollama pull ${model.toLowerCase().replace(/\s/g, '-')}-cloud`,
  "Provisioning cloud-only offloading logic...",
  "Allocating neural compute shaders in OLLAMA cluster...",
  "Syncing Edge DB: aws-1-ap-south-1.pooler.supabase.co",
  "Encrypting PII data with AES-256...",
  "Scaling WCX pod groups to performance tier...",
  "Optimizing OLLAMA Cloud API throughput...",
  `Applying whitelabel branding: ${brand} Identity...`,
  "Verifying organizational resilience thresholds...",
  "Hot-swapping strategy kernels...",
  "Deployment Finalized. WCX CLOUD edge nodes online."
];

export const DeploymentSandbox: React.FC<DeploymentSandboxProps> = ({ isOpen, onClose, brandName, modelName, isDarkMode }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const LOG_MESSAGES = getLogMessages(brandName, modelName);

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      setProgress(0);
      setIsComplete(false);
      
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < LOG_MESSAGES.length) {
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${LOG_MESSAGES[currentStep]}`]);
          setProgress(((currentStep + 1) / LOG_MESSAGES.length) * 100);
          currentStep++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, 600);

      return () => clearInterval(interval);
    }
  }, [isOpen, LOG_MESSAGES]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={isComplete ? onClose : undefined} />
      
      <div className={`relative w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border flex flex-col transition-all duration-500 transform ${
        isDarkMode ? 'bg-[#1C1C1E] border-white/10' : 'bg-white border-slate-200'
      }`}>
        {/* Terminal Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ml-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              WCX Node: {brandName} // {modelName}
            </span>
          </div>
          {isComplete && (
            <button onClick={onClose} className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all apple-button ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
              Close Terminal
            </button>
          )}
        </div>

        {/* Log Viewer */}
        <div 
          ref={logContainerRef}
          className={`flex-1 p-8 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[400px] scroll-smooth ${
            isDarkMode ? 'text-emerald-400/90' : 'text-emerald-700'
          }`}
        >
          {logs.map((log, i) => (
            <div key={i} className="mb-1.5 animate-in slide-in-from-left-2 duration-300">
              <span className="opacity-50 mr-2">$</span>
              {log}
            </div>
          ))}
          {!isComplete && (
            <div className="animate-pulse mt-2 flex items-center gap-2">
              <div className="w-1.5 h-3 bg-emerald-500" />
              <span className="italic opacity-50">Offloading to OLLAMA Cloud...</span>
            </div>
          )}
        </div>

        {/* Progress Bar Footer */}
        <div className={`p-8 border-t space-y-4 ${isDarkMode ? 'border-white/5 bg-black/10' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex justify-between items-end">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {isComplete ? 'WCX SYNC COMPLETE' : 'Establishing OLLAMA Cloud Link'}
              </p>
              <h4 className="text-xl font-black tracking-tighter">
                {isComplete ? 'Node Online' : `Deploying ${brandName}`}
              </h4>
            </div>
            <span className="text-sm font-mono font-bold">{Math.round(progress)}%</span>
          </div>
          
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {isComplete && (
            <p className="text-[10px] font-bold text-center text-emerald-500 uppercase tracking-widest animate-bounce pt-2">
              ✓ All {brandName} WCX edge nodes synchronized
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
