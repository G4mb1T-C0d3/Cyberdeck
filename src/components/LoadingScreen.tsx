import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { sounds } from "../lib/sounds";

const FAKE_CODE = [
    "INITIALIZING_NEURAL_LINK...",
    "HANDSHAKE_PROTOCOL_ICE_6...",
    "DECRYPTING_DATA_STREAM...",
    "VIRTUAL_MEMORY_MAPPING...",
    "OVERRIDING_LOCAL_PERMISSIONS...",
    "SYNCING_ALT_OS_KERNEL...",
    "BYPASSING_CORPO_DRM...",
    "ALLOCATING_BUFFER_ZONES...",
    "PURGING_PREVIOUS_LOGS...",
    "ESTABLISHING_SECURE_TUNNEL...",
    "UPLOADING_DAEMON_SCRIPTS...",
    "ENCRYPTING_NEURAL_INTERFACE..."
];

export const LoadingScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [codeIndex, setCodeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + Math.random() * 8;
      });

      if (Math.random() > 0.6) {
        setCodeIndex((prev) => (prev + 1) % FAKE_CODE.length);
        sounds.playType();
      }
    }, 150);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-2">
            <h2 className="text-current text-sm font-black tracking-[0.5em] uppercase text-center animate-pulse">
                SYS_LOADING_PROTOCOL
            </h2>
            <div className="h-1 w-full bg-current/10 relative overflow-hidden">
                <motion.div 
                    className="absolute inset-y-0 left-0 bg-current shadow-[0_0_20px_var(--current-theme)]"
                    animate={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between text-[8px] font-mono opacity-50 uppercase tracking-widest">
                <span>Buffer_Overflow_Guard: Active</span>
                <span>{Math.floor(progress)}% Complete</span>
            </div>
        </div>

        <div className="bg-current/5 border border-current/20 p-6 h-64 font-mono text-[10px] space-y-1 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
            {FAKE_CODE.slice(0, 15).map((line, i) => {
                const isActive = (i + codeIndex) % FAKE_CODE.length === 0;
                return (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 1 : 0.4 }}
                        className={isActive ? "text-white" : "text-current"}
                    >
                        {`[0x${(i * 1234).toString(16)}] ${line}`}
                    </motion.div>
                );
            })}
        </div>

        <div className="text-center">
            <p className="text-[10px] text-current/40 animate-bounce">PLEASE WAIT_STAY CONNECTED</p>
        </div>
      </div>
      
      {/* Decorative glitch background elements */}
      <div className="absolute top-10 left-10 w-24 h-1 bg-current opacity-20" />
      <div className="absolute bottom-10 right-10 w-24 h-1 bg-current opacity-20" />
    </div>
  );
};
