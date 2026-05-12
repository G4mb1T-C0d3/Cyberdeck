import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Zap, X, Terminal as TerminalIcon, AlertTriangle } from 'lucide-react';
import { sounds } from '@/src/lib/sounds';

interface DaemonPopupProps {
  onClose: () => void;
}

const CORPORATIONS = ["Arasaka", "Militech", "Kang Tao", "Night Corp", "Zetatech", "Biotechnica"];

export const DaemonPopup: React.FC<DaemonPopupProps> = ({ onClose }) => {
  const [step, setStep] = useState<'alert' | 'hacking' | 'complete'>('alert');
  const [attacker] = useState(CORPORATIONS[Math.floor(Math.random() * CORPORATIONS.length)]);
  const [lines, setLines] = useState<{ text: string, color: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hackLines = [
    { text: '>> INITIALIZING REVERSE_SHELL_LINK...', color: '#00f0ff' },
    { text: `>> TARGET_DETECTED: ${attacker.toUpperCase()}_INTERNAL_SERVER`, color: '#fbee09' },
    { text: '>> BYPASSING FIREWALL... [DONE]', color: '#39ff14' },
    { text: '>> EXPLOITING CVE-2077-8894...', color: '#39ff14' },
    { text: '>> UPLOADING VIRUS: Cr4ck3d_NC_OS_DAEMON', color: '#ff003c' },
    { text: '>> SEIZING DATA CLUSTERS...', color: '#00f0ff' },
    { text: '>> DECRYPTING PII_DATA...', color: '#fbee09' },
    { text: '>> NC_OS_KERNEL_HIJACKED!', color: '#39ff14' },
    { text: '>> DISCONNECTING TO EVADE TRACE...', color: '#ff003c' },
    { text: '>> HACK COMPLETE. COUNTER_MEASURES_DEPLOYED.', color: '#39ff14' },
  ];

  useEffect(() => {
    if (step === 'complete') {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  useEffect(() => {
    if (step === 'hacking') {
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < hackLines.length) {
          setLines(prev => [...prev, hackLines[idx]]);
          idx++;
          sounds.playType();
        } else {
          clearInterval(interval);
          setTimeout(() => setStep('complete'), 1000);
        }
      }, 400);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-black border-2 border-[#ff003c] shadow-[0_0_50px_rgba(255,0,60,0.4)] overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-[#ff003c] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-black font-black uppercase text-xs tracking-widest">
            <ShieldAlert size={16} />
            <span>EXTERNAL_DAEMON_ALERT</span>
          </div>
          <button onClick={onClose} className="text-black hover:scale-110 transition-transform">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {step === 'alert' ? (
            <>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#ff003c]/20 flex items-center justify-center animate-pulse border border-[#ff003c]/40">
                  <AlertTriangle size={32} className="text-[#ff003c]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">UNAUTHORIZED_ACCESS_ATTEMPT</h3>
                  <p className="text-[#ff003c] text-[10px] font-bold uppercase tracking-[0.2em]">Agent: {attacker} Cyber-Ops</p>
                </div>
                <p className="text-white/60 text-xs leading-relaxed">
                  An external daemon is attempting to breach your neural buffer. Identity traced to <span className="text-[#00f0ff]">{attacker}</span> server nodes. 
                  Recommended action: Immediate counter-hack.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={onClose}
                  className="py-3 border border-white/20 text-white/40 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-colors"
                >
                  [ DENY_ACCESS ]
                </button>
                <button 
                  onClick={() => { setStep('hacking'); sounds.playBeep(800, 0.1); }}
                  className="py-3 bg-[#ff003c] text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#ff003c]/80 transition-colors flex items-center justify-center gap-2"
                >
                  <Zap size={14} />
                  <span>REVERSE_SHELL</span>
                </button>
              </div>
            </>
          ) : step === 'hacking' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black text-[#00f0ff] uppercase tracking-widest border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <TerminalIcon size={14} />
                  <span>NC_OS_SHELL::v5.0</span>
                </div>
                <span className="animate-pulse">EXECUTING...</span>
              </div>
              <div 
                ref={scrollRef}
                className="h-48 bg-black/60 border border-white/5 p-4 font-mono text-[10px] overflow-y-auto custom-scrollbar flex flex-col gap-1"
              >
                {lines.map((l, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: l.color }}
                  >
                    {l.text}
                  </motion.div>
                ))}
              </div>
              <div className="h-1 w-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, ease: "linear" }}
                  className="h-full bg-[#39ff14]"
                />
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center gap-6 py-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#39ff14]/20 flex items-center justify-center border-2 border-[#39ff14] shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                >
                  <Zap size={32} className="text-[#39ff14]" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">COUNTER_HACK_COMPLETE</h3>
                <p className="text-[#39ff14] text-[10px] font-bold uppercase tracking-[0.3em]">System Integrity: 100%</p>
                <div className="text-white/40 text-[9px] uppercase font-mono mt-4">
                  Connection with {attacker} server severed. <br/>
                  Reverse shell trace deleted.
                </div>
              </div>
              <button 
                onClick={onClose}
                className="mt-4 px-8 py-2 bg-[#39ff14]/10 border border-[#39ff14] text-[#39ff14] font-black uppercase text-[10px] tracking-widest hover:bg-[#39ff14] hover:text-black transition-all"
              >
                [ RETURN_TO_NET ]
              </button>
            </motion.div>
          )}
        </div>
        
        {/* Subtle Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </motion.div>
    </div>
  );
};
