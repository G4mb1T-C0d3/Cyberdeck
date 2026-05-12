import React, { useEffect, useRef } from "react";
import { TerminalMessage } from "@/src/types";
import { motion, AnimatePresence } from "motion/react";
import { sounds } from "@/src/lib/sounds";

interface TerminalProps {
  messages: TerminalMessage[];
  glitch?: boolean;
  onClear?: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ messages, glitch, onClear }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      sounds.playType();
    }
  }, [messages]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    sounds.playBeep(1000, 0.05);
  };

  return (
    <div 
      className={`flex-1 flex flex-col bg-black/40 border border-current/20 relative transition-transform duration-75 ${glitch ? 'translate-x-[1px] grayscale brightness-[125%] animate-subtle-shake' : ''} h-full overflow-hidden`}
    >
      {glitch && (
        <>
          <div className="absolute inset-0 bg-noise opacity-30 z-40 noise-shaking pointer-events-none" />
          <div className="scanline-rolling" />
          <div className="absolute inset-0 bg-current/10 pointer-events-none z-30 animate-pulse" />
        </>
      )}
      <div className="absolute top-0 left-0 right-0 h-6 bg-current/10 flex items-center px-4 justify-between border-b border-current/20 z-20">
        <span className={`text-[8px] font-black tracking-widest text-[#39FF14] uppercase italic ${glitch ? 'animate-subtle-shake' : ''}`}>NEURAL_TERMINAL::SECURE_STREAM</span>
        <div className="flex gap-2 items-center">
            {onClear && (
                <button 
                  onClick={onClear}
                  className="text-[8px] font-black text-current hover:bg-current hover:text-black px-1 border border-current/20 mr-2 transition-colors"
                >
                    CLEAR_X
                </button>
            )}
            <div className="w-1.5 h-1.5 bg-current animate-pulse" />
            <div className="w-1.5 h-1.5 bg-current/40" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-3 md:p-4 font-mono text-[9px] md:text-xs overflow-y-auto scroll-smooth pt-8 custom-scrollbar flex flex-col"
      >
        {glitch && (
          <div className="absolute inset-0 bg-current/5 pointer-events-none z-10 animate-pulse" />
        )}
        <div className="space-y-4 flex flex-col items-center">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group flex flex-col gap-1 relative w-full max-w-md items-center text-center"
              >
                <div className="flex items-center gap-2 justify-center w-full">
                  <span className="opacity-30 text-[7px]">[{msg.timestamp.toLocaleTimeString()}]</span>
                  <span className={`text-[8px] font-black uppercase ${
                    msg.type === "system" ? "text-current" : 
                    msg.type === "error" ? "text-red-500" :
                    msg.type === "companion" ? "text-green-400" : "text-[#00f0ff]"
                  }`}>
                    {msg.type === "system" ? "SYSTEM_SYS" : msg.type.toUpperCase()}
                  </span>
                </div>
                
                <div className={`p-2 bg-black/20 border-x-2 ${
                  msg.type === "system" ? "border-current/40" : 
                  msg.type === "error" ? "border-red-500/40" :
                  msg.type === "companion" ? "border-green-400/40 italic" : "border-[#00f0ff]/40"
                } text-white/90 break-words w-full`}>
                  {msg.text}
                </div>
                
                <button 
                  onClick={() => copyToClipboard(msg.text)}
                  className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-[7px] border border-current/30 px-1 hover:bg-current hover:text-black bg-black"
                >
                  COPY
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
