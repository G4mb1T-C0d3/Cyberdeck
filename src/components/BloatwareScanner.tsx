import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, ShieldAlert, CheckCircle2, XCircle, Info, Settings2, Play, Trash2 } from "lucide-react";
import { BloatwareItem, ScanProfile, TerminalMessage } from "@/src/types";
import { sounds } from "@/src/lib/sounds";

interface BloatwareScannerProps {
  onAddMessage: (text: string, type?: TerminalMessage["type"]) => void;
  onCompanionMessage: (msg: string) => void;
  onComplete: () => void;
  glitch?: boolean;
}

const BLOATWARE_DATABASE: BloatwareItem[] = [
  { id: "1", name: "McAfee_Security_Trial", publisher: "McAfee LLC", impact: "high", reason: "Excessive background resource consumption and persistent popups.", size: "450 MB", isPUP: true },
  { id: "2", name: "Candy_Crush_Saga_Stub", publisher: "King/Microsoft", impact: "low", reason: "Pre-installed promotional package with no user utility.", size: "12 MB", isPUP: true },
  { id: "3", name: "OEM_Support_Assistant", publisher: "Hardware Vendor", impact: "medium", reason: "Constant telemetry collection and unnecessary driver overhead.", size: "280 MB", isPUP: true },
  { id: "4", name: "Xbox_Game_Bar_Overlay", publisher: "Microsoft", impact: "low", reason: "System-level hook causing frame drops in legacy apps.", size: "85 MB", isPUP: false },
  { id: "5", name: "OneDrive_AutoSync", publisher: "Microsoft", impact: "medium", reason: "Aggressive cloud-syncing and explorer shell injection.", size: "150 MB", isPUP: false },
  { id: "6", name: "Disney+_Web_Stub", publisher: "Promotional", impact: "low", reason: "Unused application placeholder targeting registry keys.", size: "5 MB", isPUP: true },
  { id: "7", name: "Norton_360_Vault", publisher: "Gen Digital", impact: "high", reason: "Kernel-level driver instability and scan-locking.", size: "520 MB", isPUP: true }
];

export const BloatwareScanner: React.FC<BloatwareScannerProps> = ({ onAddMessage, onCompanionMessage, onComplete, glitch }) => {
  const [stage, setStage] = useState<"profile" | "scanning" | "review" | "purging" | "done">("profile");
  const [profile, setProfile] = useState<ScanProfile>("minimalist");
  const [foundItems, setFoundItems] = useState<BloatwareItem[]>([]);
  const [purgedIds, setPurgedIds] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [purgeProgress, setPurgeProgress] = useState(0);
  const [safeMode, setSafeMode] = useState(true);

  const startScan = () => {
    setStage("scanning");
    sounds.playBeep(800, 0.1);
    onAddMessage(`Advanced scan initiated with profile: ${profile.toUpperCase()}`);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        setScanProgress(100);
        clearInterval(interval);
        finishScan();
      } else {
        setScanProgress(progress);
        if (Math.random() > 0.7) {
          const sectors = ["REGISTRY_KEYS", "SYSTEM32_STUBS", "PROGRAM_DATA_CACHE", "USER_APPDATA_ROAMING", "STARTUP_ENTRIES"];
          const sector = sectors[Math.floor(Math.random() * sectors.length)];
          onAddMessage(`Scanning Bit-Sector: ${sector}... [OK]`);
        }
      }
    }, 300);
  };

  const finishScan = () => {
    // Advanced algorithm logic: different profiles find different items
    const results = BLOATWARE_DATABASE.filter(() => Math.random() > (profile === "gaming" ? 0.2 : 0.5));
    setFoundItems(results);
    setSelectedItems(results.map(i => i.id));
    setStage("review");
    onAddMessage(`Scan complete. Found ${results.length} Corpo daemons.`);
    onCompanionMessage(`Look at all this junk, Remmy. Did you download the entire Arasaka trash bin or what?`);
  };

  const handleRemove = () => {
    if (selectedItems.length === 0) return;
    
    setStage("purging");
    setPurgeProgress(0);
    sounds.playBeep(400, 0.2);
    
    if (safeMode) {
      onAddMessage("NEURAL_SAFETY_INITIATED: CREATING_SYSTEM_RESTORE_POINT...", "system");
    }
    
    onAddMessage(`Commencing safe removal of ${selectedItems.length} items...`);
    
    selectedItems.forEach((id, i) => {
      const item = BLOATWARE_DATABASE.find(b => b.id === id);
      setTimeout(() => {
        setPurgedIds(prev => [...prev, id]);
        setPurgeProgress(((i + 1) / selectedItems.length) * 100);
        onAddMessage(`SHREDDING: ${item?.name}... [OK]`);
        
        if (i === selectedItems.length - 1) {
          setTimeout(() => {
            setStage("done");
            onAddMessage(`BLOATWARE_SCRUB: FINALIZED.`, "system");
            onCompanionMessage(`Clean as a whistle. Or at least as clean as your dusty deck is gonna get, Remmy.`);
            setTimeout(onComplete, 2000);
          }, 1000);
        }
      }, (i + 1) * 800);
    });
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    sounds.playBeep(1200, 0.05);
  };

  return (
    <div className={`flex-1 p-3 sm:p-6 bg-black/60 border border-current/20 flex flex-col gap-4 sm:gap-6 overflow-y-auto transition-all duration-75 ${glitch ? 'translate-x-1 skew-x-1 brightness-125' : ''}`}>
      <AnimatePresence mode="wait">
        {stage === "profile" && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center justify-center gap-8"
          >
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center">
                <span className="text-[#00f0ff] opacity-50 text-[10px] tracking-[0.4em] mb-1">SCAN_PARAMETER_DEFINITION::</span>
                <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase flex items-center justify-center gap-3">
                  <Settings2 className="text-current" size={24} /> 
                  <span className="text-current shadow-[0_0_10px_var(--current-theme)]">CONFIG_PROFILE</span>
                </h2>
              </div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                Define detection sensitivity for the heuristic neural-scanner. Aggressive profiles consume more RAM but find hidden daemons.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-md">
              {(["minimalist", "workstation", "gaming"] as ScanProfile[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setProfile(p)}
                  className={`group relative h-16 transition-all flex items-center px-6 overflow-hidden ${profile === p ? "bg-current text-black shadow-[0_0_20px_var(--current-theme)]" : "bg-black/40 border border-current/20 hover:border-current/50"}`}
                >
                   {/* Left accent bar */}
                   <div className={`absolute left-0 inset-y-0 w-1 ${profile === p ? "bg-black" : "bg-current opacity-30 group-hover:opacity-100"}`} />
                   
                   {/* Decorative skewed background for active */}
                   {profile === p && (
                     <div className="absolute inset-0 bg-white/10 skew-x-[-20deg] translate-x-1/2 pointer-events-none" />
                   )}
                   
                   <div className="flex-1 flex flex-col items-start relative z-10">
                     <span className={`font-black italic tracking-tighter text-lg uppercase ${profile === p ? "text-black" : "text-white"}`}>{p}</span>
                     <span className={`text-[9px] font-bold uppercase tracking-widest ${profile === p ? "text-black/60" : "text-white/30"}`}>
                       {p === 'gaming' ? 'MAX_SENSITIVITY // NEURAL_OVERLOAD' : p === 'workstation' ? 'BALANCED_DAEMON_DETECTION' : 'CRITICAL_VULNERABILITIES_ONLY'}
                     </span>
                   </div>

                   <div className={`shrink-0 flex items-center justify-center w-10 h-10 border-2 transition-all ${profile === p ? "border-black bg-black/10" : "border-current/20 group-hover:border-current"}`}>
                      <Shield className={profile === p ? "text-black" : "text-current"} size={20} />
                   </div>
                </button>
              ))}
            </div>

            <button 
              onClick={startScan}
              className="group relative mt-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-current opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
              <div className="relative px-12 py-3 bg-current text-black font-black italic text-lg uppercase tracking-tighter skew-x-[-15deg] group-hover:scale-105 transition-transform flex items-center gap-3">
                <Play size={20} fill="currentColor" className="skew-x-[15deg]" /> 
                <span className="skew-x-[15deg]">INITIATE_SCAN</span>
              </div>
            </button>
          </motion.div>
        )}

        {stage === "scanning" && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-6"
          >
            <div className="relative w-48 h-48">
               <motion.div 
                  className="absolute inset-0 border-4 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               />
               <div className="absolute inset-0 flex items-center justify-center text-3xl font-black">
                  {Math.floor(scanProgress)}%
               </div>
            </div>
            <div className="text-sm font-mono animate-pulse uppercase tracking-[0.2em]">
              Scanning bit-clusters...
            </div>
          </motion.div>
        )}

        {(stage === "review" || stage === "purging") && (
          <motion.div 
            key="review"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="flex justify-between items-end border-b border-current pb-2">
               <div className="space-y-1">
                 <h3 className="text-xl font-bold uppercase tracking-tight">
                    {stage === "purging" ? "PURGING_IN_PROGRESS" : "Detection_Results"}
                 </h3>
                 <p className="text-[10px] opacity-50">HEURISTIC_ALGO: VER 9.4 | HITS: {foundItems.length}</p>
               </div>
               
               {stage === "review" && (
                <div className="flex items-center gap-4 px-4 bg-black/40 border border-current/20 mr-auto ml-4 h-10 group cursor-pointer" onClick={() => setSafeMode(!safeMode)}>
                  <div className={`w-3 h-3 border-2 ${safeMode ? 'bg-[#00f0ff] border-[#00f0ff] shadow-[0_0_5px_#00f0ff]' : 'border-current/30'}`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${safeMode ? 'text-[#00f0ff]' : 'text-white/40'}`}>
                    Safe_Removal_Mode: {safeMode ? 'ON' : 'OFF'}
                  </span>
                </div>
               )}

               {stage === "review" ? (
                 <button 
                   onClick={handleRemove}
                   disabled={selectedItems.length === 0}
                   className="px-6 py-2 bg-current text-black font-bold text-xs uppercase disabled:opacity-30 disabled:grayscale transition-all flex items-center gap-2"
                 >
                   <Trash2 size={14} /> PURGE_SELECTED ({selectedItems.length})
                 </button>
               ) : (
                 <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-current animate-pulse italic">DELETING... {Math.floor(purgeProgress)}%</span>
                    <div className="w-48 h-1 bg-current/10 overflow-hidden">
                        <motion.div 
                            className="h-full bg-current"
                            initial={{ width: 0 }}
                            animate={{ width: `${purgeProgress}%` }}
                        />
                    </div>
                 </div>
               )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide py-2">
              <motion.div
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {foundItems.map((item, index) => !purgedIds.includes(item.id) && (
                  <motion.div 
                    key={item.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, x: -20, filter: "blur(10px)" },
                      show: { opacity: 1, x: 0, filter: "blur(0px)" }
                    }}
                    exit={{ opacity: 0, scale: 0.9, x: -50, filter: "blur(10px)" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onClick={() => stage === "review" && toggleItem(item.id)}
                    className={`group relative p-3 sm:p-4 border overflow-hidden transition-all flex items-center gap-3 sm:gap-4 ${stage === "purging" ? "pointer-events-none opacity-50" : "cursor-pointer"} ${selectedItems.includes(item.id) ? 'border-current bg-current/10' : 'border-current/20 hover:border-current/50 bg-black/40'}`}
                  >
                    {/* Background Scanline Reflection */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-current/5 to-transparent pointer-events-none z-0"
                      animate={{ 
                        translateY: ["-100%", "200%"]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: index * 0.2
                      }}
                    />

                    {/* Glowing Accent */}
                    {selectedItems.includes(item.id) && (
                      <div className="absolute inset-0 shadow-[inset_0_0_15px_var(--current-theme)] opacity-30 pointer-events-none" />
                    )}

                    <div className={`relative z-10 p-2 rounded-sm border ${item.impact === 'high' ? 'bg-red-500/10 border-red-500/50 text-red-500' : item.impact === 'medium' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-green-500/10 border-green-500/50 text-green-500'}`}>
                      <ShieldAlert size={24} className={selectedItems.includes(item.id) ? "animate-pulse" : ""} />
                    </div>
                    
                    <div className="relative z-10 flex-1 min-w-0">
                      <div className="flex items-center gap-2 overflow-hidden">
                         <span className="font-black uppercase tracking-tight text-xs sm:text-sm truncate">{item.name}</span>
                         <span className="text-[8px] font-bold opacity-40 px-1 border border-current/30 rounded-xs shrink-0">{item.publisher}</span>
                      </div>
                      <p className="text-[10px] opacity-60 mt-1 font-medium leading-tight line-clamp-2 sm:line-clamp-1">{item.reason}</p>
                    </div>

                    <div className="relative z-10 text-right shrink-0">
                      <div className="text-[10px] font-mono opacity-80">{item.size}</div>
                      <div className={`text-[9px] font-black uppercase mt-0.5 ${item.impact === 'high' ? 'text-red-500' : 'text-yellow-500'}`}>
                        LVL: {item.impact}
                      </div>
                    </div>

                    {stage === "review" && (
                      <div className={`relative z-10 w-6 h-6 border transition-colors flex items-center justify-center ${selectedItems.includes(item.id) ? 'bg-current text-black' : 'border-current/30 group-hover:border-current bg-black/50'}`}>
                        {selectedItems.includes(item.id) ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <div className="w-1 h-1 bg-current opacity-30" />
                        )}
                      </div>
                    )}

                    {/* Left edge status line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.impact === 'high' ? 'bg-red-600' : item.impact === 'medium' ? 'bg-yellow-600' : 'bg-green-600'}`} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <div className="text-[9px] text-red-500 font-bold animate-pulse uppercase">
              {stage === "purging" ? "DANGER: NEURAL_SHREDDING_ACTIVE // DO_NOT_DISCONNECT" : "WARNING: REMOVAL IS REVERSIBLE VIA SYSTEM_CORE ROLLBACK (NEXT 24H)"}
            </div>
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div 
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4"
          >
            <CheckCircle2 size={80} className="text-current shadow-[0_0_20px_var(--current-theme)]" />
            <h2 className="text-2xl font-black uppercase tracking-[0.3em]">System_Sanitized</h2>
            <p className="text-xs opacity-50">ICE layers reinforced. Deck is running cool.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
