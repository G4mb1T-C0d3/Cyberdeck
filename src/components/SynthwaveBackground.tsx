import React from "react";
import { motion } from "motion/react";

export function SynthwaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#070707]">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(75,0,130,0.4)_0%,transparent_70%)]" />
      
      {/* Animated Tracking Lines (V-Scanlines) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(0,240,255,0.1)_2px,rgba(0,240,255,0.1)_3px)]" />
        <motion.div 
            className="absolute inset-x-0 h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(0,240,255,1)]"
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Retro Sun (Large) */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden blur-[1px]">
        <div 
          className="w-full h-full"
          style={{
            background: 'linear-gradient(to bottom, #fbee09 0%, #ff1dce 50%, #7e00ff 100%)',
          }}
        />
        {/* Horizontal Gaps in Sun */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_8px,rgba(7,7,7,1)_10px,rgba(7,7,7,1)_12px)] opacity-60" />
      </div>

      {/* City Skyline Silhouette */}
      <div className="absolute bottom-0 w-full h-1/2 z-20 pointer-events-none">
        <svg viewBox="0 0 1000 500" className="w-full h-full preserve-3d" preserveAspectRatio="none">
            <defs>
                <linearGradient id="city-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#070707" />
                </linearGradient>
            </defs>
            {/* Buildings */}
            <path 
                d="M0,500 L0,450 L50,450 L70,300 L120,300 L140,400 L180,400 L200,100 L250,100 L270,350 L320,350 L350,50 L450,50 L480,400 L520,400 L550,150 L650,150 L680,420 L720,420 L750,80 L850,80 L880,450 L950,450 L1000,400 L1000,500 Z" 
                fill="url(#city-grad)" 
            />
            {/* Neon Outlines for Buildings */}
            <path 
                d="M50,450 L70,300 L120,300 L140,400 M200,100 L250,100 L270,350 M350,50 L450,50 L480,400 M550,150 L650,150 L680,420 M750,80 L850,80 L880,450" 
                stroke="#ff1dce" 
                strokeWidth="1.5" 
                fill="none" 
                opacity="0.3"
            />
            {/* Windows (Random dots) */}
            {[...Array(50)].map((_, i) => (
                <rect 
                    key={i} 
                    x={Math.random() * 1000} 
                    y={300 + Math.random() * 150} 
                    width="2" 
                    height="2" 
                    fill={Math.random() > 0.5 ? "#00f0ff" : "#fbee09"} 
                    opacity={Math.random() * 0.5} 
                />
            ))}
        </svg>
      </div>

      {/* Grid Floor */}
      <div className="absolute bottom-0 w-full h-[30%] perspective-[600px] z-10">
        <motion.div 
          className="w-full h-full origin-top"
          style={{ 
            rotateX: "70deg",
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 29, 206, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
          animate={{ backgroundPositionY: ["0px", "40px"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Glitch Overlay (Static-like) */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none z-30" />
      
      {/* Horizontal Glitch Slices */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-40 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
      >
        <div className="absolute top-[20%] w-full h-[10px] bg-cyan-400/10 blur-sm" />
        <div className="absolute top-[60%] w-full h-[2px] bg-pink-500/20" />
      </motion.div>
    </div>
  );
}
