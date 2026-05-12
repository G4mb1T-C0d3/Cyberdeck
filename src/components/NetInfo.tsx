import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Globe, Wifi, Shield, Zap } from "lucide-react";

export function NetInfo() {
  const [signal, setSignal] = useState(85);
  const [packetLoss, setPacketLoss] = useState(0.2);
  const [latency, setLatency] = useState(14);
  const [traffic, setTraffic] = useState<number[]>(Array.from({ length: 20 }, () => Math.random() * 100));

  useEffect(() => {
    const interval = setInterval(() => {
      setSignal(prev => Math.min(100, Math.max(70, prev + (Math.random() * 4 - 2))));
      setPacketLoss(prev => Math.max(0, Math.min(2, prev + (Math.random() * 0.2 - 0.1))));
      setLatency(prev => Math.max(8, Math.min(45, prev + (Math.random() * 4 - 2))));
      setTraffic(prev => [...prev.slice(1), Math.random() * 100]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] text-[#00f0ff] font-black uppercase tracking-widest flex items-center gap-2">
          <Globe size={11} /> NET_INF_v8
        </h3>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-[#00f0ff] animate-ping" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[8px] font-bold text-white/40 uppercase">
            <span>Signal</span>
            <span className="text-[#00f0ff]">{Math.floor(signal)}%</span>
          </div>
          <div className="h-0.5 bg-white/5 overflow-hidden">
            <motion.div 
              className="h-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"
              animate={{ width: `${signal}%` }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[8px] font-bold text-white/40 uppercase">
            <span>Ploss</span>
            <span className={packetLoss > 1 ? "text-red-500" : "text-[#00f0ff]"}>{packetLoss.toFixed(1)}%</span>
          </div>
          <div className="h-0.5 bg-white/5 overflow-hidden">
            <motion.div 
              className={`h-full ${packetLoss > 1 ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"}`}
              animate={{ width: `${(packetLoss / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-2 bg-black/40 border-l border-[#00f0ff] space-y-1">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Wifi size={10} className="text-[#00f0ff]" />
                <span className="text-[8px] font-black text-white/80 uppercase">Latency</span>
            </div>
            <span className="text-[9px] font-mono text-[#00f0ff]">{Math.floor(latency)}ms</span>
        </div>
        
        <div className="flex items-end gap-[1px] h-6 pt-1">
          {traffic.map((val, i) => (
            <motion.div 
              key={i}
              className="flex-1 bg-[#00f0ff]/40"
              animate={{ height: `${val}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
         <div className="flex-1 border border-white/5 p-1 flex items-center justify-between">
            <Shield size={9} className="text-green-500" />
            <span className="text-[7px] font-black text-green-500 uppercase">ICE</span>
         </div>
         <div className="flex-1 border border-white/5 p-1 flex items-center justify-between">
            <Zap size={9} className="text-yellow-500" />
            <span className="text-[7px] font-black text-yellow-500 uppercase">FREQ</span>
         </div>
      </div>
    </div>
  );
}
