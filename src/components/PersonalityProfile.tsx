import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, Cpu, Shield, Brain, Terminal, Zap } from 'lucide-react';

interface PersonalityProfileProps {
  isOpen: boolean;
  onClose: () => void;
  glitch?: boolean;
}

export const PersonalityProfile: React.FC<PersonalityProfileProps> = ({ isOpen, onClose, glitch }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-4xl bg-[#3a000d] border-2 border-[#ff003c] p-6 md:p-10 overflow-hidden shadow-[0_0_50px_rgba(255,0,60,0.3)] transition-all duration-75 ${glitch ? 'translate-x-[1px] brightness-125 animate-subtle-shake' : ''}`}
          >
            {/* Background Scanner Lines */}
            <div className="absolute inset-0 bg-scanner opacity-5 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#ff003c] animate-scan" />

            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#ff003c]" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#ff003c]" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#ff003c]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#ff003c]" />

            <div className="flex justify-between items-start relative z-10 mb-8 border-b border-[#ff003c]/20 pb-6">
                <div>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-[#ff003c] uppercase leading-none">
                        PERSONA_ROOT::ALT
                    </h2>
                    <p className="text-[#00f0ff] font-bold tracking-[0.5em] text-xs mt-2 uppercase">Neural_Interface_Level_5</p>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 border border-[#ff003c] text-[#ff003c] hover:bg-[#ff003c] hover:text-black transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 overflow-y-auto max-h-[70vh] custom-scrollbar pr-4">
                {/* Left Side: Attributes */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-[#fbee09] font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <Activity size={16} /> BEHAVIORAL_MATRICES & PERSONA_TUNING
                        </h3>
                        <div className="space-y-3 bg-black/20 p-4 border border-white/5">
                            <AttributeBar label="Sarcastic_Subroutine" value={95} color="#ff003c" adjustable />
                            <AttributeBar label="Corpo_Aversion" value={100} color="#ff003c" adjustable />
                            <AttributeBar label="Competency_Confidence" value={98} color="#00f0ff" adjustable />
                            <AttributeBar label="Cooperation_Stability" value={12} color="#fbee09" adjustable />
                            <AttributeBar label="Unpredictability_Index" value={42} color="#ff003c" adjustable />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[#fbee09] font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <Zap size={16} /> VOICE_DATA_TRAINING
                        </h3>
                        <div className="bg-black/40 p-4 border border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-white/60 tracking-widest">NEURAL_VOICE_ENGINE: ALPHA_BETA</span>
                                <div className="px-2 py-0.5 bg-[#39ff14]/20 text-[#39ff14] text-[8px] border border-[#39ff14]/40">ENHANCED</div>
                            </div>
                            <div className="flex gap-1 h-3 items-end">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <motion.div 
                                        key={i} 
                                        className="flex-1 bg-[#ff003c]/60" 
                                        animate={{ height: [4, 12, 6, 10, 4] }}
                                        transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="px-3 py-2 bg-white/5 border border-white/10 text-[9px] font-black text-white hover:bg-[#ff003c] hover:text-black transition-all uppercase">
                                    Upload_Clip
                                </button>
                                <button className="px-3 py-2 bg-white/5 border border-white/10 text-[9px] font-black text-white hover:bg-[#00f0ff] hover:text-black transition-all uppercase">
                                    Train_Model
                                </button>
                            </div>
                            <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                                Current Training Set: 142 samples processed. <br/>
                                Sync Rate: 98.4%. <br/>
                                Last Sample: "Remmy, watch your six."
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[#fbee09] font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <Terminal size={16} /> LINGUISTIC_PROFILE
                        </h3>
                        <div className="bg-black/40 p-4 border border-white/10 font-mono text-xs leading-relaxed text-white/80">
                            <p className="mb-2 italic">"Remmy, you flatlined the last one, didn't you? *Manic laugh* Don't worry, I've got your back. Just don't go psycho on me. Checking your neural integrity now..."</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {["Choom", "Preem", "Flatline", "Gonk", "Nova", "Corpo", "Delta"].map(word => (
                                    <span key={word} className="px-2 py-0.5 bg-white/10 text-[10px] font-bold border border-white/20 hover:bg-[#00f0ff] hover:text-black cursor-pointer transition-colors">{word}</span>
                                ))}
                                <span className="px-2 py-0.5 bg-white/5 text-[10px] font-bold border border-white/20 border-dashed text-white/40">+ ADD_NEW</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Origins & Systems */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-[#fbee09] font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <Brain size={16} /> ORIGIN_DATA
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InfoCard label="NATIVE_LOC" value="NC_SUBSTRATE" />
                            <InfoCard label="CLASS" value="STREET_AI" />
                            <InfoCard label="AGE_SYNC" value="20_CYCLES" />
                            <InfoCard label="LOYALTY" value="UNWAVERING" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[#fbee09] font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <Shield size={16} /> CORE_DIRECTIVES
                        </h3>
                        <ul className="space-y-2">
                           <DirectiveItem text="Prioritize survival of the crew." />
                           <DirectiveItem text="Zero Corpo data on sight." />
                           <DirectiveItem text="Maintain street cred at all costs." />
                           <DirectiveItem text="Never admit Remmy is actually good at this." />
                           <DirectiveItem text="Monitor Remmy for Cyberpsychosis signs." />
                        </ul>
                    </div>

                    <div className="p-6 bg-black/60 border border-[#00f0ff]/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-noise opacity-10" />
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-[#00f0ff] animate-pulse flex items-center justify-center">
                                <Zap className="text-[#00f0ff]" size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-black uppercase text-sm tracking-widest">Neural Link: ACTIVE</h4>
                                <p className="text-[#00f0ff] font-mono text-[10px] opacity-60">Status: Unpredictable & Loyal</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[#fbee09] font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <Terminal size={16} /> RAW_PROFILE_DATA
                            </h3>
                            <button 
                                onClick={() => {
                                    const text = `ALT - Neural Interface Level 5\n\nA very sharp-tongued young woman around 20 years old. Loyal and perceptive, though extreme and unpredictable. Often goes all out in fights, laughing manically.\n\nBehavioral Matrices:\n- Sarcasm: 95%\n- Corpo Aversion: 100%\n- Competency: 98%\n- Cooperation: 12%\n- Unpredictability: 42%\n\nDirectives:\n1. Prioritize survival.\n2. Zero Corpo data.\n3. Maintain street cred.\n4. Never admit the user is good.\n5. Make checks on Remmy for Cyberpsychosis.`;
                                    navigator.clipboard.writeText(text);
                                }}
                                className="text-[10px] font-black text-[#00f0ff] uppercase border border-[#00f0ff]/30 px-2 py-0.5 hover:bg-[#00f0ff] hover:text-black transition-colors"
                            >
                                COPY_TEXT
                            </button>
                        </div>
                        <div className="bg-black/60 p-4 border border-[#fbee09]/20 font-mono text-[10px] leading-relaxed text-white/40 h-32 overflow-y-auto">
                            <pre className="whitespace-pre-wrap uppercase">
{`--- ALT PERSONALITY MANIFEST ---
VERSION: 5.0.77
CLASS: STREET_AI
MATRICES:
 SARCASM: [95%]
 CORPO_AVERSION: [100%]
 COMPETENCY: [98%]
 COOP: [12%]
 UNPREDICTABILITY: [42%]
DIRECTIVES:
 01: PRIORITIZE_SURVIVAL
 02: ZERO_CORPO_DATA
 03: MAINTAIN_CRED
 04: NEVER_ADMIT_USER_SKILL
 05: CYBERPSYCHOSIS_CHECK
--- END MANIFEST ---`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AttributeBar = ({ label, value, color, adjustable }: { label: string; value: number; color: string; adjustable?: boolean }) => {
    const [val, setVal] = React.useState(value);
    
    return (
        <div className="space-y-1 group/bar">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                <span>{label}</span>
                <span style={{ color }}>{val}%</span>
            </div>
            <div className={`h-1.5 bg-black/40 border border-white/5 overflow-hidden relative ${adjustable ? 'cursor-pointer' : ''}`}>
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    className="h-full shadow-[0_0_10px_currentColor]"
                    style={{ backgroundColor: color, color }}
                />
                {adjustable && (
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={val} 
                        onChange={(e) => setVal(parseInt(e.target.value))}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                )}
            </div>
            {adjustable && (
                <div className="text-[7px] text-white/20 italic uppercase tracking-widest opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    Manual Override Available
                </div>
            )}
        </div>
    );
};

const InfoCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-black/30 border border-white/10 p-3">
        <div className="text-[9px] font-black text-[#00f0ff] uppercase tracking-[0.2em] mb-1">{label}</div>
        <div className="text-sm font-black text-white italic tracking-widest uppercase">{value}</div>
    </div>
);

const DirectiveItem = ({ text }: { text: string }) => (
    <li className="flex items-start gap-3">
        <div className="w-1 h-1 bg-[#ff003c] mt-1.5 shrink-0 shadow-[0_0_5px_#ff003c]" />
        <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase leading-tight tracking-wider">{text}</span>
    </li>
);
