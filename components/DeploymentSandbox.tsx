
import React, { useState, useEffect, useRef } from 'react';

interface DeploymentSandboxProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  modelName: string;
  isDarkMode: boolean;
}

const getLogMessages = (brand: string, model: string) => [
  "root@srv909561:~# epic --version",
  "EPIC Secure Kernel v2.1.0-WCX",
  "root@srv909561:~# systemctl status wcx-neural-fabric",
  "● wcx-neural-fabric.service - Apex Pro Neural Link",
  "   Loaded: loaded (/lib/systemd/system/wcx-neural-fabric.service; enabled)",
  "   Active: active (running) since Wed 2026-01-14 00:04:48 UTC",
  `Initialising ${brand} environment on Ubuntu Secure Base...`,
  "IPv4: 168.231.78.113 | Security: Private Gateway Active",
  "System Load: 0.0 | Resource Usage: Optimized",
  `Executing: core-sync pull ${model.toLowerCase().replace(/\s/g, '-')}-kernel`,
  "Offloading strategy logic to Private Secure Cluster...",
  "Allocating thinking tokens for deep reasoning synthesis...",
  "Syncing Resilience DB: aws-1-ap-south-1.pooler.supabase.co",
  "Applying AES-256 Executive Encryption...",
  "Scaling WCX pod groups across private edge nodes...",
  "Deployment Finalized. WCX NODE is now online at 168.231.78.113"
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
          setLogs(prev => [...prev, LOG_MESSAGES[currentStep]]);
          setProgress(((currentStep + 1) / LOG_MESSAGES.length) * 100);
          currentStep++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, 500);

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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={isComplete ? onClose : undefined} />
      
      <div className={`relative w-full max-w-3xl rounded-[1.5rem] overflow-hidden shadow-2xl border flex flex-col transition-all duration-500 transform ${
        isDarkMode ? 'bg-[#000000] border-white/20' : 'bg-white border-slate-300'
      }`}>
        {/* Terminal Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ml-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              root@srv909561: ~ (Secure_Gateway_1)
            </span>
          </div>
          {isComplete && (
            <button onClick={onClose} className={`text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full transition-all apple-button ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
              Close
            </button>
          )}
        </div>

        {/* Log Viewer */}
        <div 
          ref={logContainerRef}
          className={`flex-1 p-6 font-mono text-[11px] leading-relaxed overflow-y-auto h-[450px] scroll-smooth ${
            isDarkMode ? 'text-emerald-400/90' : 'text-emerald-800'
          }`}
        >
          {logs.map((log, i) => (
            <div key={i} className="mb-1 animate-in slide-in-from-left-1 duration-200">
              {log.startsWith('root@') ? (
                <span className="text-blue-400 font-bold">{log}</span>
              ) : log.includes('Executing:') ? (
                <span className="text-amber-400">{log}</span>
              ) : log.includes('✓') || log.includes('Finalized') ? (
                <span className="text-emerald-500 font-black">{log}</span>
              ) : log}
            </div>
          ))}
          {!isComplete && (
            <div className="animate-pulse mt-2 flex items-center gap-2">
              <div className="w-2 h-4 bg-emerald-500" />
              <span className="italic opacity-50">Syncing secure nodes...</span>
            </div>
          )}
        </div>

        {/* Progress Bar Footer */}
        <div className={`p-6 border-t space-y-4 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex justify-between items-end">
            <div>
              <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {isComplete ? 'NODE_SYNC: SECURE' : 'Establishing Secure Private Interface'}
              </p>
              <h4 className="text-lg font-black tracking-tighter">
                {isComplete ? 'Private Core Ready' : `Synchronizing ${brandName}`}
              </h4>
            </div>
            <span className="text-sm font-mono font-bold">{Math.round(progress)}%</span>
          </div>
          
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
