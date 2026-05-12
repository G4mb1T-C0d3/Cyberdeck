import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sounds } from "@/src/lib/sounds";
import { altVoice } from "@/src/lib/voice";

export const Companion: React.FC<{ message?: string; isThinking?: boolean; glitch?: boolean, audioOnly?: boolean }> = ({ message, isThinking, glitch, audioOnly }) => {
  useEffect(() => {
    if (message) {
      altVoice.speak(message);
    }
  }, [message]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
      <div className="relative flex-1 flex items-center justify-center w-full min-h-[140px]">
        <div className={`relative w-full h-full transition-all duration-75 flex items-center justify-center ${glitch ? "animate-subtle-shake brightness-150" : ""}`}>
          
          <div className="relative w-full h-full flex items-center justify-center bg-black/40 min-h-[220px] rounded-lg border border-white/5 shadow-inner">
            
            {/* Synthwave Background: Moving Grid Floor */}
            <div className="absolute inset-0 z-0">
               {/* Sky Gradient */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,29,206,0.15)_0%,transparent_70%)]" />
               
               {/* Animated Tracking Lines (Scanlines) */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,240,255,0.1)_3px,rgba(0,240,255,0.1)_4px)] animate-[global-scanline_10s_linear_infinite]" />
               </div>

               {/* Grid Floor */}
               <div 
                 className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,29,206,0.3)_100%)]"
                 style={{
                   backgroundImage: `linear-gradient(rgba(255, 29, 206, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 29, 206, 0.2) 1px, transparent 1px)`,
                   backgroundSize: '30px 30px',
                   perspective: '600px',
                   transform: 'rotateX(70deg) translateY(0%)',
                   animation: 'grid-scroll 1.5s linear infinite'
                 }}
               />
            </div>

            {/* Retro Sun with Scanlines */}
            <motion.div 
               animate={{ 
                 scale: (message || isThinking) ? [1, 1.05, 1] : 1,
               }}
               transition={{ duration: 0.5, repeat: Infinity }}
               className="absolute top-12 z-10 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex flex-col items-center justify-center opacity-80"
               style={{
                 background: 'linear-gradient(to bottom, #fbee09 0%, #ff1dce 100%)',
                 boxShadow: '0 0 40px rgba(251, 238, 9, 0.4), 0 0 80px rgba(255, 29, 206, 0.2)'
               }}
            >
              {/* Horizontal Gaps in Sun */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_6px,rgba(0,0,0,0.5)_7px,rgba(0,0,0,0.5)_8px)]" />
            </motion.div>

            {/* ALT Avatar: Holographic Netrunner Silhouette */}
            <div className="relative z-30 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              {/* Alt's speech bubbles (Comic Style) */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, rotate: -5, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, rotate: 2, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.9 }}
                    className="absolute right-[105%] top-0 z-[100] w-56 md:w-72"
                  >
                    <div className="relative bg-black/90 backdrop-blur-md border-2 border-[#ff1dce] p-4 text-[#00f0ff] font-black italic tracking-tighter shadow-[0_0_20px_rgba(255,29,206,0.2)]">
                      <p className="text-xs md:text-sm leading-tight uppercase font-sans">{message}</p>
                      {/* Bubble Tail */}
                      <div className="absolute top-10 -right-3 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[15px] border-l-[#ff1dce]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  filter: (message || isThinking) ? ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] : 'brightness(1)'
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                {/* SVG Hologram Avatar */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="holo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#ff1dce" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#fbee09" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Cyber-Face Elements */}
                  <g className={glitch ? "animate-pulse" : ""} filter="url(#glow)">
                    {/* Cyber Eyes */}
                    <circle cx="85" cy="85" r="4" fill="#00f0ff">
                      <animate attributeName="opacity" values="0.4;1;0.4" dur="0.1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="115" cy="85" r="4" fill="#ff1dce">
                      <animate attributeName="opacity" values="1;0.4;1" dur="0.15s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Animated Mouth (Digital Oscilloscope Style) */}
                    <motion.path
                      d={ (message || isThinking) 
                        ? "M 80 115 Q 100 135 120 115" 
                        : "M 80 115 L 100 115 L 120 115"
                      }
                      animate={ (message || isThinking) ? {
                        d: [
                          "M 80 115 Q 100 145 120 115",
                          "M 80 115 Q 100 85 120 115",
                          "M 80 115 Q 100 125 120 115",
                          "M 80 115 Q 100 105 120 115"
                        ],
                        strokeWidth: [2, 4, 3, 2]
                      } : {
                        d: "M 80 115 L 120 115",
                        strokeWidth: 2
                      }}
                      transition={{ 
                        duration: 0.1, 
                        repeat: Infinity, 
                        ease: "linear"
                      }}
                      stroke="url(#holo-grad)"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Secondary Mouth Line for Glitch Effect */}
                    {(message || isThinking) && (
                      <motion.path
                        d="M 85 110 Q 100 130 115 110"
                        animate={{
                          opacity: [0, 0.8, 0],
                          x: [-2, 2, -2],
                          y: [-1, 1, -1]
                        }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                        stroke="#00f0ff"
                        strokeWidth="1"
                        fill="none"
                      />
                    )}
                  </g>
                </svg>

                {/* Glitch Slices */}
                {(glitch || message) && (
                  <motion.div 
                    animate={{ 
                      x: [-10, 10, -5, 0],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ duration: 0.1, repeat: 10 }}
                    className="absolute inset-0 bg-cyan-400/20 mix-blend-overlay clip-path-polygon-[0%_20%,100%_20%,100%_22%,0%_22%]"
                  />
                )}
              </motion.div>
            </div>

            {/* Neon Mountains Overlay (Simplified wireframe) */}
            <div className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none opacity-20">
                <svg viewBox="0 0 200 100" className="w-full h-1/2 stroke-[#00f0ff] fill-none stroke-[0.5]">
                    <motion.path 
                      animate={{
                        d: (message || isThinking) 
                        ? "M0,100 L40,60 L70,80 L100,20 L130,70 L160,50 L200,100"
                        : "M0,100 L40,70 L70,85 L100,30 L130,80 L160,60 L200,100"
                      }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    />
                </svg>
            </div>

            {/* Glitch Overlays */}
            {glitch && (
               <>
                 <div className="absolute inset-0 bg-[#ff003c]/20 mix-blend-screen pointer-events-none z-30" />
                 <motion.div 
                   animate={{ x: [-5, 5, -2, 0], opacity: [0.3, 0.1, 0.5, 0] }}
                   transition={{ duration: 0.1, repeat: Infinity }}
                   className="absolute inset-0 bg-[#00f0ff]/20 pointer-events-none z-30"
                 />
                 <div className="absolute inset-0 border-4 border-[#ff003c]/30 animate-pulse z-40" />
               </>
            )}

            {/* Status Indicator */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-1 z-50">
               <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">SIGNAL_STRENGTH</span>
                  <div className="flex gap-0.5">
                     {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`w-1 h-3 ${i <= 3 ? (glitch ? 'bg-red-500' : 'bg-[#00f0ff]') : 'bg-white/10'}`} />
                     ))}
                  </div>
               </div>
               <div className={`text-[9px] font-black tracking-tighter ${message ? 'text-[#39ff14]' : 'text-white/20'} uppercase`}>
                  {message ? 'TRANS_ENCODING' : 'IDLE_MONITOR'}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
