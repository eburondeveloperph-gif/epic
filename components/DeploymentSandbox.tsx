
import React, { useState, useEffect, useRef } from 'react';

interface DeploymentSandboxProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  modelName: string;
  isDarkMode: boolean;
}

const getLogMessages = (brand: string, model: string) => [
  "root@srv909561:~# uname -a",
  "Linux srv909561 6.8.0-90-generic #90-Ubuntu SMP Wed Jan 14 00:04:48 UTC 2026 x86_64",
  "root@srv909561:~# epic-os --version",
  "EPIC-OS / GENESIS v2.1.0-STABLE",
  "root@srv909561:~# docker ps",
  "CONTAINER ID   IMAGE                 COMMAND                  STATUS          NAMES",
  "a8f7c6e5d4b3   wcx-neural-fabric:2.1 \"/usr/bin/apex-core\"     Up 14 minutes   apex_engine_01",
  `Initialising ${brand} [${model}] on Ubuntu 24.04.3 LTS...`,
  "Node IP: 168.231.78.113 | Network: Secure VPN established",
  "System Load: 0.0 | Memory: 9% | Disk: 8.2% of 192.69GB",
  `Executing: core-sync pull-kernel ${model.toLowerCase().replace(/\s/g, '_')}`,
  "Synchronizing shards across cluster: 2a02:4780:f:3ac6::1",
  "Allocating thinking-buffer for Sovereign deep reasoning...",
  "Applying AES-256 PII encryption to executive health data...",
  "Syncing TimeScaleDB: aws-1-ap-south-1.pooler.supabase.co",
  "Scaling WCX edge nodes to root@srv909561 endpoint...",
  "Deployment Finalized. Apex Core is active at 168.231.78.113"
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
      }, 450);

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
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" onClick={isComplete ? onClose : undefined} />
      
      <div className={`relative w-full max-w-4xl rounded-[1.5rem] overflow-hidden shadow-2xl border flex flex-col transition-all duration-500 transform ${
        isDarkMode ? 'bg-[#000000] border-white/20' : 'bg-white border-slate-300'
      }`}>
        {/* Terminal Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ml-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              root@srv909561: ~ (168.231.78.113)
            </span>
          </div>
          {isComplete && (
            <button onClick={onClose} className={`text-[10px] font-black uppercase tracking-widest px-6 py-1.5 rounded-full transition-all apple-button ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
              Exit Node
            </button>
          )}
        </div>

        {/* Log Viewer */}
        <div 
          ref={logContainerRef}
          className={`flex-1 p-8 font-mono text-[12px] leading-relaxed overflow-y-auto h-[500px] scroll-smooth ${
            isDarkMode ? 'text-emerald-400/90' : 'text-emerald-800'
          }`}
        >
          {logs.map((log, i) => (
            <div key={i} className="mb-1 animate-in slide-in-from-left-1 duration-200">
              {log.startsWith('root@') ? (
                <span className="text-blue-400 font-bold">{log}</span>
              ) : log.includes('Executing:') ? (
                <span className="text-amber-400">{log}</span>
              ) : log.includes('Finalized') || log.includes('active') ? (
                <span className="text-emerald-500 font-black">{log}</span>
              ) : log}
            </div>
          ))}
          {!isComplete && (
            <div className="animate-pulse mt-4 flex items-center gap-2">
              <div className="w-2.5 h-5 bg-emerald-500" />
              <span className="italic opacity-60">Synchronizing private nodes...</span>
            </div>
          )}
        </div>

        {/* Progress Bar Footer */}
        <div className={`p-8 border-t space-y-4 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex justify-between items-end">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {isComplete ? 'NODE_STATUS: SECURE' : 'Provisioning Private Cluster'}
              </p>
              <h4 className="text-xl font-black tracking-tighter">
                {isComplete ? 'Infrastructure Active' : `Connecting ${brandName}`}
              </h4>
            </div>
            <span className="text-lg font-mono font-bold">{Math.round(progress)}%</span>
          </div>
          
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
