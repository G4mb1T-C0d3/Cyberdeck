import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal as TerminalIcon, ShieldAlert, Zap } from 'lucide-react';
import { sounds } from '@/src/lib/sounds';

interface HackTerminalProps {
  glitch?: boolean;
}

interface TerminalLine {
  text: string;
  color: string;
}

export const HackTerminal: React.FC<HackTerminalProps> = ({ glitch }) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hackLines: (TerminalLine & { text_only?: boolean })[] = [
    { text: 'Cr4ck3d_NC_OS v7.7.7 - LOGIN_SUCCESS', color: '#39ff14' },
    { text: 'nmap -sS -O 192.168.1.104 --ICE_PROBE', color: '#00f0ff' },
    { text: 'Starting Nmap 7.92 (NC_OFFICIAL) at 2024-05-12 11:51', color: '#00f0ff' },
    { text: '[CAUTION] ICE DETECTION TRIGGERED: ARASAKA_SENTINEL_v4', color: '#fbee09' },
    { text: '[ERROR] ICE_BLOCK: ACCESS_DENIED_TO_SECTOR_7', color: '#ff003c' },
    { text: 'Bypassing Ice... Neural link stability: 64%', color: '#00f0ff' },
    { text: 'PORT     STATE SERVICE', color: '#39ff14' },
    { text: '22/tcp   open  ssh (ENCRYPTED)', color: '#39ff14' },
    { text: '80/tcp   open  http (MILITECH_PROXY)', color: '#39ff14' },
    { text: 'Device type: general purpose Cyberdeck', color: '#39ff14' },
    { text: 'Running: Cr4ck3d_NC_OS v7.7.7', color: '#fbee09' },
    { text: 'OS details: Night City Custom Kernel', color: '#fbee09' },
    { text: '', color: '#39ff14' },
    { text: 'root@Cr4ck3d_NC_OS:~# msfconsole --hidden', color: '#00f0ff' },
    { text: '[*] Starting the Metasploit Framework (NIGHT_CORP_EDITION)...', color: '#00f0ff' },
    { text: 'msf6 > search ice_breaker --severity=MAX', color: '#00f0ff' },
    { text: '[!] WARNING: HIGH_TRACE_RISK', color: '#ff003c' },
    { text: '   #  Name                                Disclosure Date  Rank    Check  Description', color: '#39ff14' },
    { text: '   -  ----                                ---------------  ----    -----  -----------', color: '#39ff14' },
    { text: '   0  exploit/multi/browser/ice_breaker  2023-01-12       excellent  Yes    ICE_BREAKER_NC', color: '#39ff14' },
    { text: '', color: '#39ff14' },
    { text: 'msf6 > use 0', color: '#00f0ff' },
    { text: '[*] Exploit running as background job 0.', color: '#00f0ff' },
    { text: '[*] Started reverse TCP handler on 192.168.1.100:4444', color: '#00f0ff' },
    { text: '[+] CRACK_NC_OS SUCCESS: SHELL_CONNECTED', color: '#39ff14' },
    { text: 'meterpreter > hashdump', color: '#00f0ff' },
    { text: 'Administrator:500:CORPO_ADMIN_HASH_SHI...', color: '#39ff14' },
    { text: 'Gambit:1001:aad3b435b51404eeaad3b435b51404ee:f7c6d6...ACCESS_GRANTED', color: '#39ff14' },
    { text: '', color: '#39ff14' },
    { text: 'root@Cr4ck3d_NC_OS:~# delta_v --force --NC_BYPASS', color: '#ff003c' }
  ];

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let timer: NodeJS.Timeout;

    const typeLine = () => {
      if (lineIdx >= hackLines.length) {
        lineIdx = 0;
        setLines([]);
      }

      const lineObj = hackLines[lineIdx];
      const text = lineObj.text;
      
      if (text.startsWith('root@') || text.startsWith('msf6') || text.startsWith('meterpreter')) {
        // Type effect for prompts
        setIsTyping(true);
        if (charIdx < text.length) {
          setLines(prev => {
            const newLines = [...prev];
            if (charIdx === 0) {
                newLines.push({ text: '', color: lineObj.color });
            }
            newLines[newLines.length - 1] = { text: text.substring(0, charIdx + 1), color: lineObj.color };
            return newLines;
          });
          charIdx++;
          timer = setTimeout(typeLine, 30 + Math.random() * 50);
          if (charIdx % 3 === 0) sounds.playType();
        } else {
          charIdx = 0;
          lineIdx++;
          setIsTyping(false);
          timer = setTimeout(typeLine, 1000);
        }
      } else {
        // Immediate display for command output
        setLines(prev => [...prev, { text, color: lineObj.color }]);
        lineIdx++;
        timer = setTimeout(typeLine, 100 + Math.random() * 200);
      }
    };

    timer = setTimeout(typeLine, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className={`flex-1 flex flex-col bg-black/80 border border-[#39ff14]/20 relative overflow-hidden font-mono text-[9px] md:text-[10px] text-[#39ff14] shadow-[inset_0_0_20px_rgba(57,255,20,0.1)] transition-all duration-75 ${glitch ? 'translate-x-[1px] brightness-125 animate-subtle-shake' : ''}`}>
      {/* Kali Header */}
      <div className="bg-[#39ff14]/10 px-2 py-1 flex items-center justify-between border-b border-[#39ff14]/20">
        <div className="flex items-center gap-2">
            <TerminalIcon size={10} />
            <span className="font-bold tracking-widest uppercase">root@Cr4ck3d_NC_OS: ~</span>
        </div>
        <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff003c]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#fbee09]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14]/50" />
        </div>
      </div>

      {/* Terminal View */}
      <div 
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto custom-scrollbar relative"
      >
        {lines.map((line, i) => (
          <div key={i} className="mb-0.5 break-all whitespace-pre-wrap" style={{ color: line?.color || '#39ff14' }}>
            {line?.text || ''}
          </div>
        ))}
        {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-1.5 h-3 bg-[#39ff14] ml-1 align-middle" />}
      </div>

      {/* Background Grid Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(57,255,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {glitch && (
        <>
            <div className="absolute inset-0 bg-noise opacity-10 z-40 noise-shaking pointer-events-none" />
        </>
      )}

      {/* Footer Status */}
      <div className="bg-black/40 px-2 py-0.5 border-t border-[#39ff14]/10 flex justify-between items-center text-[7px] font-bold opacity-60">
        <div className="flex gap-3">
            <span>PACKETS: 4882</span>
            <span>DROPPED: 0</span>
        </div>
        <div className="flex items-center gap-1">
            <ShieldAlert size={8} className="text-[#fbee09]" />
            <span>SECURE_SHELL</span>
        </div>
      </div>
    </div>
  );
};
