import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Trash2, ShieldAlert, Cpu, Home, Palette, Zap, ArrowDown, Database, Scan, Info, AlertTriangle, Volume2 } from "lucide-react";
import { ToolType, TerminalMessage, ColorScheme, ScanProfile } from "./types";
import { Companion } from "./components/Companion";
import { Terminal } from "./components/Terminal";
import { BloatwareScanner } from "./components/BloatwareScanner";
import { LoadingScreen } from "./components/LoadingScreen";
import { SynthwaveBackground } from "./components/SynthwaveBackground";
import { NetInfo } from "./components/NetInfo";
import { PersonalityProfile } from "./components/PersonalityProfile";
import { HackTerminal } from "./components/HackTerminal";
import { DaemonPopup } from "./components/DaemonPopup";
import { sounds } from "./lib/sounds";
import { altVoice, VOICE_PROFILES } from "./lib/voice";
import { getCompanionResponse } from "./services/geminiService";
import { IDLE_COMMENTS } from "./constants/idleComments";

const COLOR_SCHEME: ColorScheme[] = [
  { name: "Arasaka Red", color: "#ff003c" },
  { name: "Militech Blue", color: "#00f0ff" },
  { name: "2077 Yellow", color: "#fbee09" },
  { name: "Night City Green", color: "#39ff14" },
];

export default function App() {
  const [screen, setScreen] = useState<"home" | "loading" | "tool">("home");
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const [pendingTool, setPendingTool] = useState<ToolType | null>(null);
  const [isToolReady, setIsToolReady] = useState(false);
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [companionMsg, setCompanionMsg] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isALTThinking, setIsALTThinking] = useState(false);
  const [themeColor, setThemeColor] = useState(COLOR_SCHEME[0].color);
  const [stats, setStats] = useState({ cpu: 45, ram: 62, disk: 89, net: 12 });
  const [glitch, setGlitch] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [usedComments, setUsedComments] = useState<Record<number, number>>({});
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PROFILES[0].id);
  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = useState(false);
  const [showDaemonPopup, setShowDaemonPopup] = useState(false);

  useEffect(() => {
    altVoice.setVoice(selectedVoice);
  }, [selectedVoice]);

  const clearMessages = () => {
    setMessages([]);
    sounds.playBeep(400, 0.05);
  };

  const getValidComment = () => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    // Filter out comments used in the last hour
    const availableIndices = IDLE_COMMENTS.map((_, i) => i)
      .filter(i => !usedComments[i] || (now - usedComments[i] > oneHour));
      
    if (availableIndices.length === 0) return null;
    
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setUsedComments(prev => ({ ...prev, [randomIndex]: now }));
    
    let comment = IDLE_COMMENTS[randomIndex];
    
    // Resolve dynamic placeholders
    if (comment.includes("{{TIME}}")) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      comment = comment.replace("{{TIME}}", timeStr);
    }
    if (comment.includes("{{DATE}}")) {
      const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      comment = comment.replace("{{DATE}}", dateStr);
    }
    
    return comment;
  };

  const [glitchTextIdx, setGlitchTextIdx] = useState(0);
  const [glitchColorIdx, setGlitchColorIdx] = useState(0);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const glitchTexts = ["G4mb1T HaX", "Burn Corpo Shit!", "Sys_Integrity: Low", "SYSTEM_HIJACKED", "NIGHT_CITY_NULL"];
  const glitchColors = ["#fbee09", "#FF1DCE", "#ff003c", "#00f0ff", "#39FF14"];

  useEffect(() => {
    const interval = setInterval(() => {
        if (glitchTextIdx === 0 && Math.random() > 0.85) {
            const nextIdx = Math.floor(Math.random() * (glitchTexts.length - 1)) + 1;
            setGlitchTextIdx(nextIdx);
            
            // Map specific texts to specific colors if needed
            if (nextIdx === 2) { // Sys_Integrity: Low
                setGlitchColorIdx(2); // Arasaka Red
            } else {
                setGlitchColorIdx(Math.floor(Math.random() * glitchColors.length));
            }
            
            let stayTime = 300;
            if (nextIdx === 1) stayTime = 2200; // Burn Corpo Shit!
            if (nextIdx === 2) stayTime = 1000; // Sys_Integrity: Low
            
            setTimeout(() => {
                setGlitchTextIdx(0);
                setGlitchColorIdx(0);
            }, stayTime);
        }

        // Random popup trigger
        if (!showDaemonPopup && Math.random() > 0.995) {
            setShowDaemonPopup(true);
            sounds.playBeep(400, 0.1);
        }
    }, 1000);
    return () => clearInterval(interval);
  }, [glitchTextIdx, showDaemonPopup]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'f') {
            // Only toggle if not typing in an input
            if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                setIsQuickMenuOpen(prev => !prev);
                sounds.playBeep(600, 0.05);
            }
        }
        if (e.key === 'Escape') {
            setIsQuickMenuOpen(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const addMessage = (text: string, type: TerminalMessage["type"] = "system", origin: TerminalMessage["origin"] = "system") => {
    const newMessage: TerminalMessage = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      type,
      origin,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev.slice(-50), newMessage]);
  };

  const [ram, setRam] = useState(0);
  const [maxRam, setMaxRam] = useState(16);

  useEffect(() => {
    // Initial system detection
    const systemMemory = (navigator as any).deviceMemory || 8;
    const capacity = Math.min(64, Math.max(8, Math.floor(systemMemory * 4)));
    setMaxRam(capacity);

    const updateRamUsage = () => {
      const perf = (window.performance as any).memory;
      if (perf) {
        // Map actual browser heap usage to Cyberdeck slots
        const usageRatio = perf.usedJSHeapSize / perf.totalJSHeapSize;
        // Invert for Cyberdeck feel: "Total" is max, "Current" is what's left
        const usedSlots = Math.floor(usageRatio * capacity);
        setRam(capacity - usedSlots);
      } else {
        // Fallback for browsers without performance.memory
        setRam(prev => {
            const target = capacity * 0.75;
            if (prev === 0) return Math.floor(target);
            return Math.min(capacity, Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1)));
        });
      }
    };

    updateRamUsage();
    const ramInterval = setInterval(updateRamUsage, 2000);
    
    // System-wide glitch interval
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitch(true);
        // sounds.playGlitch(); // Removed as requested
        setTimeout(() => setGlitch(false), 150 + Math.random() * 200);
      }
    }, 4000);
    
    addMessage(`HARDWARE_LINK_ESTABLISHED: ${systemMemory}GB_DETECTED.`);
    addMessage("MONITORING_NEURAL_HEAP_USAGE...");
    addMessage("SYSTEM SCANNER v2.077 INITIALIZED.");
    addMessage("Targeting: MAULER_GANG_MEMBER.");
    
    // Alt's initial greeting
    setTimeout(() => {
        const greeting = "What's up choom, ya need somethin?";
        setCompanionMsg(greeting);
        addMessage(greeting, "companion", "system");
        setTimeout(() => setCompanionMsg(""), 4000);
    }, 1000);
    
    const interval = setInterval(() => {
      setStats(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
        ram: Math.min(100, Math.max(0, prev.ram + (Math.random() * 4 - 2))),
        disk: prev.disk,
        net: Math.min(100, Math.max(0, prev.net + (Math.random() * 20 - 10))),
      }));
    }, 2000);

    // Randomized comments
    const commentInterval = setInterval(() => {
        if (Math.random() > 0.7 && !isALTThinking && !companionMsg) {
            const randomComment = getValidComment();
            if (randomComment) {
                setCompanionMsg(randomComment);
                // Only add to terminal if it's short enough to not "expand" the sidebar
                // Threshold: 150 chars
                if (randomComment.length <= 150) {
                    addMessage(randomComment, "companion", "idle");
                }
                
                // Clear the bubble after some time
                setTimeout(() => setCompanionMsg(""), 5000 + randomComment.length * 50);
            }
        }
    }, 15000);

    return () => {
        clearInterval(ramInterval);
        clearInterval(glitchInterval);
        clearInterval(interval);
        clearInterval(commentInterval);
    };
  }, []);

  const handleToolSelect = (tool: ToolType) => {
    setPendingTool(tool);
    setScreen("loading");
    sounds.playBeep(600, 0.1);
  };

  const finalizeToolActivation = async () => {
    if (!pendingTool) return;
    const tool = pendingTool;
    
    // Reset tool ready state
    setIsToolReady(false);
    
    // Simulate RAM cost (only subtract if we have enough real free ram/heap headroom)
    const costs: Record<string, number> = {
      [ToolType.BLOATWARE]: 8,
      [ToolType.CLEANUP]: 4,
      [ToolType.REGISTRY]: 6,
      [ToolType.MONITOR]: 2
    };
    
    const cost = costs[tool] || 0;
    if (ram < cost) {
       addMessage("INSUFFICIENT_HEAP_SPACE. BUFFER_OVERFLOW_PREVENTED.", "system");
       setScreen("home");
       return;
    }

    addMessage(`CONSUMING_NEURAL_RESOURCES: -${cost}u`);
    setActiveTool(tool);
    setScreen("tool");
    setPendingTool(null);

    addMessage(`Initializing sequence: ${tool.toUpperCase()}...`);
    const response = await getCompanionResponse(`Starting ${tool}`, `User selected ${tool} tool. Ask for confirmation before starting action.`);
    setCompanionMsg(response);
    addMessage(response, "companion", "system");
  };

  const startToolAction = () => {
    if (!activeTool) return;
    setIsToolReady(true);
    addMessage("AUTHORIZATION_GRANTED. EXECUTING_PROTOCOL...", "system");
    
    if (activeTool !== ToolType.BLOATWARE) {
      simulateToolAction(activeTool);
    }
  };

  const simulateToolAction = (tool: ToolType) => {
    let steps = [];
    switch (tool) {
      case ToolType.CLEANUP:
        steps = ["Analyzing junk sectors...", "Found 2.4GB in temp/ice", "Purging cache clusters...", "Defragmenting virtual logic..."];
        break;
      case ToolType.REGISTRY:
        steps = ["Accessing system registry hives...", "Found 43 corrupted entries", "Re-linking orphans...", "Registry integrity restored."];
        break;
      case ToolType.MONITOR:
        steps = ["Syncing performance metrics...", "Real-time monitoring active."];
        break;
      default:
        steps = ["Unknown operation sequence."];
    }

    steps.forEach((step, i) => {
      setTimeout(() => {
        addMessage(step);
        if (i === steps.length - 1) {
          addMessage(`${tool.toUpperCase()} COMPLETE.`, "system");
        }
      }, (i + 1) * 1500);
    });
  };

  const goHome = () => {
    setActiveTool(null);
    setScreen("home");
    setPendingTool(null);
    sounds.playBeep(400, 0.05);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isALTThinking) return;

    const msg = userInput.trim();
    setUserInput("");
    addMessage(msg, "user", "chat");
    
    setIsALTThinking(true);
    setCompanionMsg("Analyzing input...");
    
    const context = activeTool ? `User is using ${activeTool} tool.` : "User is idling on home screen.";
    const response = await getCompanionResponse(msg, context);
    
    setCompanionMsg(response);
    if (response.length <= 150) {
        addMessage(response, "companion", "chat");
    } else {
        // If too long, just provide audio (already handled by Companion's useEffect/altVoice)
        // We might want to notify user or just let the terminal stay as is
    }
    setIsALTThinking(false);
    
    // Clear balloon after finish
    setTimeout(() => setCompanionMsg(""), 6000 + response.length * 50);
  };

  return (
    <div 
      className={`h-screen w-full flex flex-col relative overflow-hidden select-none transition-all duration-75 ${glitch ? 'animate-subtle-shake brightness-[108%] grayscale-[10%]' : ''}`}
      style={{ "--current-theme": themeColor } as any}
    >
      <div className="global-scanline" />
      
      {screen === "loading" && <LoadingScreen onFinish={finalizeToolActivation} />}
      
      {/* Header (Minimal for scanner feel) */}
      <header className="h-16 md:h-20 border-b-2 border-[#ff003c]/30 flex items-center justify-between px-4 md:px-10 z-20 bg-[#3a000d]/95 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4 md:gap-10 grow basis-0">
          <button 
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="flex sm:hidden w-8 h-8 items-center justify-center border border-[#ff003c] text-[#ff003c] active:bg-[#ff003c] active:text-black"
          >
            <Activity size={16} />
          </button>
          <div className="flex flex-col">
            <h1 className="hidden sm:block text-[10px] md:text-sm font-black text-white/40 tracking-[0.5em] uppercase">Cyberdeck_V_4.0</h1>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ff003c] rounded-full animate-pulse" />
                <span className="text-sm md:text-xl font-bold text-[#ff003c] tracking-widest uppercase italic">QUICKHACKS:</span>
            </div>
          </div>
        </div>

        {/* Centered RAM Bar - Integrated Housing */}
        <div className="flex flex-col items-center gap-1.5 px-6 max-w-[200px] md:max-w-md lg:max-w-xl grow basis-0 relative">
            <div className="absolute inset-0 border-x border-white/5 pointer-events-none" />
            <div className="flex items-center gap-4 text-[7px] md:text-[9px] font-black tracking-[0.3em] text-[#00f0ff] uppercase whitespace-nowrap">
                <span className="opacity-40">[</span> NEURAL_INTEGRITY: {ram}/{maxRam} <span className="opacity-40">]</span>
            </div>
            <div className="flex gap-[1px] md:gap-0.5 w-full justify-center overflow-hidden h-2.5 md:h-4 bg-black/40 border border-white/5 p-[1px]">
                {Array.from({ length: maxRam }).map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        className={`flex-1 skew-x-[-15deg] transition-colors duration-300 ${i < ram ? 'bg-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.4)]' : 'bg-white/5'}`}
                    />
                ))}
            </div>
            <div className="text-[6px] md:text-[8px] font-black text-[#ff003c]/60 absolute -bottom-4 animate-pulse uppercase tracking-[0.4em]">Buffer_Shield_Active</div>
        </div>

        <div className="flex items-center gap-3 md:gap-6 justify-end grow basis-0">
            <div className="relative">
                <button 
                  onClick={() => setIsVoiceMenuOpen(!isVoiceMenuOpen)}
                  className={`p-2 border border-white/20 transition-all hover:bg-white/10 ${isVoiceMenuOpen ? 'bg-white/20' : ''}`}
                  title="Voice Settings"
                >
                    <Volume2 size={16} className="text-[#00f0ff]" />
                </button>
                <AnimatePresence>
                    {isVoiceMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-black border-2 border-[#00f0ff] p-2 z-50 shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                        >
                            <div className="text-[9px] font-black text-[#00f0ff] mb-2 px-1 border-b border-[#00f0ff]/20 pb-1 uppercase tracking-widest">
                                VOICE_SIGNATURES
                            </div>
                            <div className="flex flex-col gap-1">
                                {VOICE_PROFILES.map((profile) => (
                                    <button
                                        key={profile.id}
                                        onClick={() => {
                                            setSelectedVoice(profile.id);
                                            setIsVoiceMenuOpen(false);
                                            sounds.playBeep(600, 0.05);
                                        }}
                                        className={`text-left px-2 py-1.5 transition-colors flex flex-col group ${selectedVoice === profile.id ? 'bg-[#00f0ff] text-black' : 'hover:bg-white/10 text-white'}`}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-tighter">{profile.name}</span>
                                        <span className={`text-[7px] font-bold uppercase opacity-60 ${selectedVoice === profile.id ? 'text-black' : 'text-white/60'}`}>{profile.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex gap-1">
                {COLOR_SCHEME.map((scheme) => (
                    <button
                        key={scheme.name}
                        onClick={() => setThemeColor(scheme.color)}
                        className={`w-6 md:w-8 h-2 rounded-none skew-x-[-30deg] border border-white/20 transition-all hover:bg-white focus:outline-none ${themeColor === scheme.color ? 'bg-white shadow-[0_0_10px_white]' : ''}`}
                        style={{ borderColor: scheme.color }}
                    />
                ))}
            </div>
            <div className="hidden lg:block text-[10px] text-white/30 font-black uppercase tracking-widest">NC_4884_0252_5584</div>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="flex-1 flex overflow-hidden z-10">
        
        {/* LEFT SIDEBAR: QUICKHACKS */}
        <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`${showMobileSidebar ? 'flex absolute inset-0 z-50 w-full' : 'hidden sm:flex'} w-64 md:w-72 lg:w-80 xl:w-[450px] p-4 md:p-6 lg:p-8 flex-col gap-2 md:gap-3 overflow-hidden relative z-20 bg-[#3a000d]/95 backdrop-blur-md border-r border-[#ff003c]/20 custom-scrollbar shrink-0`}
        >
            {showMobileSidebar && (
                <button 
                  onClick={() => setShowMobileSidebar(false)}
                  className="sm:hidden self-end p-2 text-[#ff003c] font-black uppercase text-[10px] tracking-widest border border-[#ff003c] mb-4"
                >
                    [ CLOSE_X ]
                </button>
            )}
            <QuickhackItem 
                label="BLOATREAPER" 
                cost={8}
                status="READY"
                active={activeTool === ToolType.BLOATWARE}
                onClick={() => { handleToolSelect(ToolType.BLOATWARE); setShowMobileSidebar(false); }}
                color="#00f0ff"
                desc="Zero Corpo spyware"
            />
            <QuickhackItem 
                label="ICE_BREAKER" 
                cost={4}
                status={ram < 4 ? "BLOCKED" : "READY"}
                active={activeTool === ToolType.CLEANUP}
                onClick={() => { if(ram >= 4) { handleToolSelect(ToolType.CLEANUP); setShowMobileSidebar(false); } }}
                color="#00f0ff"
                desc="Bypass security logs"
            />
            <QuickhackItem 
                label="REG_WRENCH" 
                cost={6}
                status={ram < 6 ? "BLOCKED" : "READY"}
                active={activeTool === ToolType.REGISTRY}
                onClick={() => { if(ram >= 6) { handleToolSelect(ToolType.REGISTRY); setShowMobileSidebar(false); } }}
                color="#ff003c"
                desc="Fix neural paths"
            />
            <QuickhackItem 
                label="SYSMON_PRO" 
                cost={2}
                status="READY"
                active={activeTool === ToolType.MONITOR}
                onClick={() => { handleToolSelect(ToolType.MONITOR); setShowMobileSidebar(false); }}
                color="#00f0ff"
            />
            <div className="mt-8 border-t border-white/10 pt-4 flex-1 flex flex-col min-h-0">
                <div className="text-[10px] font-black text-[#39ff14] mb-2 tracking-widest">LOCAL_HACK_ENGINE</div>
                <HackTerminal glitch={glitch} />
            </div>

            <div className="mt-4 shrink-0">
                <button 
                  onClick={goHome}
                  className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
                >
                    <Home size={14} /> [ ESC ] RETURN_TO_HOME
                </button>
            </div>
        </motion.div>

        {/* CENTER AREA (SCANNER VIEW) */}
        <div className="flex-1 flex flex-col relative overflow-hidden border-x border-white/5 bg-black">
            <SynthwaveBackground />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                {/* Scanner rects & elements - Only visible when NOT home */}
                {screen !== "home" && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative w-full h-full"
                    >
                        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 border border-[#ff003c]/20 rounded-none transform rotate-45" />
                        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 border border-[#00f0ff]/20 rounded-none transform -rotate-12" />
                        
                        {/* Target cursor */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-2 border-white/20 relative">
                                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#ff003c]" />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#ff003c]" />
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-white/40">LOCKED_ON: MAULER</span>
                        </div>

                        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center">
                            <div className="text-[#00f0ff] font-black text-xs tracking-[0.5em] mb-1">NETWORK_SECURITY_BREACHED!</div>
                            <div className="bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] px-8 py-1 font-bold italic skew-x-[-15deg]">
                                RAM_USAGE_REDUCED_BY_6
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {screen === "home" && (
                    <motion.div
                        key="home"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center z-50"
                    >
                        <div className={`z-50 flex flex-col items-center gap-6 p-8 md:p-12 bg-black/50 backdrop-blur-xl border-2 border-[#ff1dce] text-center relative overflow-hidden transition-all duration-75 shadow-[0_0_50px_rgba(255,29,206,0.3)] ${glitch ? 'translate-x-[2px] brightness-125 animate-screen-shake' : ''}`}>
                            {/* Inner Synthwave Background for the box */}
                            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,29,206,0.2)_0%,transparent_70%)]" />
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,240,255,0.05)_3px,rgba(0,240,255,0.05)_4px)]" />
                            </div>
                            
                            {/* Decorative Corner Borders */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00f0ff] z-10" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00f0ff] z-10" />
                            
                            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-[#ff003c] uppercase shadow-[0_0_15px_#ff003c] leading-none mb-2 relative overflow-hidden">
                                <span className="text-[#00f0ff] opacity-50 not-italic block text-xs tracking-[0.5em] mb-3">SYSTEM_CONNECTED::</span>
                                <span 
                                    className={`${glitch ? "glitch-text glitch-jitter animate-screen-shake stutter-active" : "glitch-text"} inline-block`} 
                                    data-text="G4mb1Ts_Nova_Cyberdeck"
                                    style={{
                                        color: glitch ? glitchColors[glitchColorIdx] : "#ff003c",
                                        transform: glitch ? `translate(${Math.random() * 20 - 10}px, ${Math.random() * 10 - 5}px) skewX(${Math.random() * 20 - 10}deg)` : 'none',
                                        filter: glitch ? `hue-rotate(${Math.random() * 360}deg) brightness(1.5)` : 'none'
                                    }}
                                >
                                    G4mb1Ts_Nova_Cyberdeck
                                </span>
                            </h2>
                            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#ff003c]/40 to-transparent" />
                            
                            <div className="space-y-4">
                                <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white leading-tight">
                                    NEURAL_PATHWAYS: <span className="text-[#00f0ff] italic uppercase underline decoration-[#fbee09] decoration-2 underline-offset-4">SYNCHRONIZED</span>
                                </h3>
                                <p className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.3em] text-center max-w-sm leading-relaxed">
                                    Initializing Arasaka-grade ICE protection. <br/>
                                    Unauthorized access will result in immediate neurological termination.
                                </p>
                            </div>

                            <div className="flex gap-4 mt-2">
                                <div className="px-4 py-1 border border-[#00f0ff]/30 text-[#00f0ff] text-[10px] font-black uppercase tracking-widest bg-[#00f0ff]/5">
                                    V_4.0.77
                                </div>
                                <div className="px-4 py-1 border border-[#ff003c]/30 text-[#ff003c] text-[10px] font-black uppercase tracking-widest bg-[#ff003c]/5">
                                    SECURE_PROTOCOL
                                </div>
                            </div>

                            <p className="text-[9px] font-black text-[#fbee09] uppercase tracking-[0.6em] animate-pulse mt-4 bg-black/40 px-6 py-2 border border-white/5">
                                STATUS: AWAITING_BIO_METRIC_COMMAND
                            </p>
                        </div>
                    </motion.div>
                )}
                {/* TOOL STATUS OVERLAY HUD */}
                {activeTool && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-6 py-2 bg-black/80 backdrop-blur-md border border-[#00f0ff]/20 pointer-events-none"
                    >
                        <div className="w-2 h-2 bg-[#00f0ff] animate-ping rounded-full" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-[#00f0ff] tracking-widest uppercase opacity-60">ACTIVE_MODULE</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-white uppercase italic">{activeTool}</span>
                                <div className="h-2 w-[1px] bg-white/20" />
                                <span className="text-[9px] font-bold text-[#fbee09] uppercase">{
                                    activeTool === ToolType.BLOATWARE ? "NEURAL_PURGE_ENGAGED" :
                                    activeTool === ToolType.CLEANUP ? "SYS_BREAKER_ACTIVE" :
                                    activeTool === ToolType.REGISTRY ? "NEURAL_REPAIR_v3" : "REALTIME_DIAGNOSTICS"
                                }</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                {screen === "tool" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 p-4 md:p-8 flex flex-col gap-4 relative z-10 overflow-hidden"
                    >
                         <div className="flex-1 flex flex-col border border-white/10 bg-black/40 backdrop-blur-md p-4 md:p-6 overflow-hidden">
                            {!isToolReady ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#3a000d]/10 overflow-y-auto">
                                    <h3 className="text-3xl md:text-4xl font-black text-[#ff003c] italic skew-x-[-15deg] mb-2 uppercase tracking-tighter">
                                        AUTHORIZATION_PENDING
                                    </h3>
                                    <p className="text-white/40 font-bold uppercase tracking-widest text-center max-w-sm mb-8 md:mb-12">
                                        ALT is waiting for your command to jack in. Any damage to neural pathways is your responsibility.
                                    </p>
                                    
                                    <button 
                                        onClick={startToolAction}
                                        className="relative group p-[2px] bg-[#ff003c] overflow-hidden"
                                    >
                                        <div className="bg-[#ff003c] px-10 py-3 md:px-12 md:py-4 flex items-center gap-4 group-hover:bg-black transition-colors">
                                            <Zap size={24} className="text-black group-hover:text-[#fbee09]" />
                                            <span className="text-xl md:text-2xl font-black text-black group-hover:text-[#fbee09] italic uppercase tracking-tighter">EXECUTE_DAEMON</span>
                                        </div>
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                                    </button>
                                </div>
                            ) : (
                                activeTool === ToolType.BLOATWARE ? (
                                    <BloatwareScanner 
                                        onAddMessage={addMessage}
                                        onCompanionMessage={setCompanionMsg}
                                        onComplete={() => {}}
                                        glitch={glitch}
                                    />
                                ) : (
                                    <div className="flex-1 flex flex-col items-start p-2 md:p-4 overflow-hidden">
                                        <h3 className="text-3xl md:text-4xl font-black text-[#00f0ff] italic skew-x-[-10deg] mb-4 md:mb-8 uppercase tracking-tighter shrink-0">
                                            EXECUTING::{activeTool}
                                        </h3>
                                        <div className="w-full flex-1 border-t border-white/10 pt-4 flex flex-col min-h-0">
                                            <Terminal messages={messages} glitch={glitch} onClear={clearMessages} />
                                        </div>
                                    </div>
                                )
                            )}
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* RIGHT SIDEBAR: DATA PANEL */}
        <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`hidden md:flex w-72 lg:w-80 xl:w-[400px] bg-[#3a000d]/90 border-l-2 border-[#ff003c] flex-col relative z-20 shrink-0 transition-transform duration-75 ${glitch ? 'translate-x-1 skew-y-1' : ''}`}
        >
            <div className="flex-1 flex flex-col p-4 md:p-6 gap-4 min-h-0">
                <div className="flex justify-between items-center text-[#00f0ff] font-black tracking-[0.5em] text-[10px] shrink-0">
                    <span>DATA</span>
                    <span>HACKING [ Z ]</span>
                </div>

                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    <div className="bg-black/20 p-2 border border-white/5 shrink-0">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-[9px] text-[#ff003c] font-black uppercase tracking-widest">ALT <span className="text-[#39FF14]">//Online</span></h3>
                            <button 
                                onClick={() => setIsProfileOpen(true)}
                                className="text-[8px] font-black text-[#00f0ff] hover:underline cursor-pointer"
                            >
                                [ INSPECT_PERSONA ]
                            </button>
                        </div>
                        <div className="h-48 border border-white/10 bg-black/40 relative">
                             <div className="absolute top-0 left-0 bg-[#00f0ff] text-black text-[7px] px-1 font-bold z-30">ALT_v5</div>
                             <Companion 
                                message={companionMsg} 
                                isThinking={isALTThinking} 
                                glitch={glitch} 
                                audioOnly={true}
                             />
                        </div>

                        <form onSubmit={handleChat} className="mt-3 relative group">
                            <div className="absolute -inset-[1px] bg-[#00f0ff] opacity-20 group-focus-within:opacity-50 transition-opacity" />
                            <div className="relative bg-black border border-white/10 flex items-center h-8">
                                <div className="w-6 h-full bg-[#00f0ff]/10 flex items-center justify-center border-r border-white/10 text-[#00f0ff]">
                                    <span className="text-[8px] font-black">{">"}</span>
                                </div>
                                <input 
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="DIRECT_LINK..."
                                    autoComplete="off"
                                    className="flex-1 bg-transparent border-none outline-none px-2 text-[9px] font-black text-[#00f0ff] uppercase placeholder:text-white/20"
                                    disabled={isALTThinking}
                                />
                                {isALTThinking && (
                                    <div className="px-2">
                                        <div className="w-1.5 h-1.5 bg-[#00f0ff] animate-ping rounded-full" />
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="bg-black/20 p-3 border border-white/5 flex-1 flex flex-col overflow-hidden min-h-[150px]">
                        <div className="flex justify-between items-center mb-1 shrink-0">
                            <h3 className="text-[9px] text-[#00f0ff] font-black uppercase tracking-widest">ALT_STREAMS</h3>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-[#00f0ff] animate-ping" />
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 mt-1">
                            <Terminal 
                                messages={messages.filter(m => m.origin === "chat" && m.type === "companion")} 
                                glitch={glitch} 
                                onClear={clearMessages}
                            />
                        </div>
                    </div>
                </div>
            </div>

             <div className="mt-auto px-10 py-8 flex justify-center items-center border-t border-white/10 bg-black/20 relative overflow-hidden group min-h-[140px]">
                 {/* Jailbreak scanlines & grain effect */}
                 <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute inset-x-0 h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] bg-[length:100%_4px,3px_100%] animate-pulse" />
                    <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
                 </div>
                 
                 <div className="relative w-full flex justify-center items-center">
                        <div className={`text-xl md:text-2xl lg:text-3xl font-black italic tracking-tighter uppercase transition-all duration-75 text-center ${glitch || glitchTextIdx !== 0 ? "glitch-text" : ""}`}
                        data-text={glitchTexts[glitchTextIdx]}
                        style={{ 
                            color: (glitch || glitchTextIdx !== 0) ? glitchColors[glitchColorIdx] : "#fbee09",
                            transform: (glitch || glitchTextIdx !== 0) ? `translate(${Math.random() * 20 - 10}px, ${Math.random() * 10 - 5}px) skewX(${Math.random() * 20 - 10}deg)` : 'none'
                        }}
                    >
                        {glitchTexts[glitchTextIdx]}
                    </div>
                    <div className="absolute -inset-x-6 -inset-y-3 border-2 border-current opacity-20 skew-x-[-15deg] pointer-events-none" 
                         style={{ color: (glitch || glitchTextIdx !== 0) ? glitchColors[glitchColorIdx] : "#fbee09" }}
                    />
                 </div>
            </div>
        </motion.div>
      </main>

      {/* Footer: Scanner Controls */}
      <footer className="h-12 md:h-14 border-t-2 border-[#00f0ff]/30 flex items-center justify-between px-4 md:px-10 z-10 bg-[#3a000d]/95 font-black text-[10px] md:text-xs tracking-widest text-[#00f0ff] italic shrink-0 relative">
         <div className="flex gap-4 md:gap-8">
            <button 
                onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
                className="flex items-center gap-2 hover:text-white transition-colors"
            >
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[#00f0ff] text-black text-[8px] md:text-[10px] flex items-center justify-center not-italic">F</div> QUICK ACTIONS
            </button>
            <span className="hidden sm:flex items-center gap-2 text-white/40"><div className="w-3 h-3 md:w-4 md:h-4 bg-white/20 text-white text-[8px] md:text-[10px] flex items-center justify-center not-italic">1</div> <div className="w-3 h-3 md:w-4 md:h-4 bg-white/20 text-white text-[8px] md:text-[10px] flex items-center justify-center not-italic">3</div> TARGET</span>
         </div>

         {/* Quick Actions Submenu */}
         <AnimatePresence>
            {isQuickMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-4 md:left-10 mb-2 w-64 bg-black border-2 border-[#00f0ff] p-2 flex flex-col gap-1 z-50 shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                >
                    <div className="text-[10px] font-black text-[#00f0ff] mb-2 px-1 border-b border-[#00f0ff]/20 pb-1 flex justify-between">
                        <span>QUICK_ACTION_PROTOCOL</span>
                        <span className="animate-pulse">ONLINE</span>
                    </div>
                    <button 
                        className="text-left px-2 py-1.5 hover:bg-[#00f0ff] hover:text-black transition-colors flex justify-between items-center group"
                        onClick={() => { setIsQuickMenuOpen(false); addMessage("DAEMON_UPLOAD: SHORT_CIRCUIT"); sounds.playBeep(800, 0.05); }}
                    >
                        <span>SHORT_CIRCUIT</span>
                        <Zap size={10} className="opacity-0 group-hover:opacity-100" />
                    </button>
                    <button 
                        className="text-left px-2 py-1.5 hover:bg-[#00f0ff] hover:text-black transition-colors flex justify-between items-center group"
                        onClick={() => { setIsQuickMenuOpen(false); addMessage("DAEMON_UPLOAD: OPTICS_RESTART"); sounds.playBeep(800, 0.05); }}
                    >
                        <span>REBOOT_OPTICS</span>
                        <Scan size={10} className="opacity-0 group-hover:opacity-100" />
                    </button>
                    <button 
                        className="text-left px-2 py-1.5 hover:bg-[#00f0ff] hover:text-black transition-colors flex justify-between items-center group text-[#ff003c] hover:text-black"
                        onClick={() => { setIsQuickMenuOpen(false); addMessage("DAEMON_UPLOAD: SYSTEM_RESET"); sounds.playBeep(400, 0.1); }}
                    >
                        <span>SYSTEM_RESET</span>
                        <AlertTriangle size={10} className="opacity-0 group-hover:opacity-100" />
                    </button>
                    <div className="mt-2 text-[8px] opacity-30 text-center uppercase tracking-[0.2em]">Press [F] to Close</div>
                </motion.div>
            )}
         </AnimatePresence>
         <div className="flex gap-4 md:gap-8">
            <span className="flex items-center gap-2"><div className="w-3 h-3 md:w-4 md:h-4 border border-[#00f0ff] flex items-center justify-center not-italic"><Zap size={8} /></div> TAGGING</span>
            <span className="hidden sm:flex items-center gap-2 text-white/40"><div className="w-3 h-3 md:w-4 md:h-4 bg-white/20 text-white text-[8px] md:text-[10px] flex items-center justify-center not-italic">H</div> HELP</span>
         </div>
      </footer>

      <PersonalityProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        glitch={glitch}
      />

      <AnimatePresence>
        {showDaemonPopup && <DaemonPopup onClose={() => setShowDaemonPopup(false)} />}
      </AnimatePresence>
    </div>
  );
}

function QuickhackItem({ label, cost, status, active, onClick, color, desc }: { label: string, cost: number, status: string, active: boolean, onClick: () => void, color: string, desc?: string }) {
    return (
        <button 
            onClick={onClick}
            className={`group flex items-center h-12 px-4 transition-all relative ${active ? 'bg-[#00f0ff] text-black shadow-[0_0_20px_#00f0ff]' : 'bg-black/60 text-white/60 hover:bg-white/5'}`}
        >
            <div className={`absolute left-0 inset-y-0 w-1 ${active ? 'bg-black' : (status === 'BLOCKED' ? 'bg-[#ff003c]' : 'bg-[#00f0ff]')}`} />
            <div className="flex-1 flex flex-col items-start leading-none text-left">
                <span className={`text-sm font-black italic tracking-tighter uppercase ${active ? 'text-black' : (status === 'BLOCKED' ? 'text-[#ff003c]' : 'text-white')}`}>{label}</span>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[8px] font-black uppercase px-1 border ${active ? 'bg-black text-[#00f0ff] border-black' : (status === 'BLOCKED' ? 'text-[#ff003c] border-[#ff003c]' : 'text-[#00f0ff] border-[#00f0ff]')}`}>
                        {status}
                    </span>
                    {desc && <span className={`text-[7px] font-bold uppercase tracking-widest ${active ? 'text-black/60' : 'text-white/30'}`}>{desc}</span>}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className={`flex flex-col items-center leading-none italic ${active ? 'text-black' : 'text-[#00f0ff]'}`}>
                    <ArrowDown size={10} className="mb-0.5" />
                    <span className="text-xl font-bold">{cost}</span>
                </div>
                <div className={`w-8 h-8 flex items-center justify-center border-2 border-current rounded-none ${active ? 'text-black border-black' : 'text-white/20'}`}>
                    <Database size={18} />
                </div>
            </div>
            {status === "BLOCKED" && !active && (
                <div className="absolute inset-0 bg-[#ff003c]/10 pointer-events-none" />
            )}
        </button>
    );
}

function StatLine({ label, val }: { label: string, val: number }) {
  return (
    <div className="flex justify-between items-center text-current">
        <span>{label}_LOAD</span>
        <div className="w-32 h-1 bg-current/20 relative">
            <motion.div 
                className="absolute inset-y-0 left-0 bg-current shadow-[0_0_5px_currentColor]" 
                animate={{ width: `${val}%` }}
            />
        </div>
    </div>
  );
}
