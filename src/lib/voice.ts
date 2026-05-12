import { GoogleGenAI, Modality } from "@google/genai";

export const VOICE_PROFILES = [
  { id: 'Kore', name: 'Alt (Classic)', desc: 'Sharp, street-smart netrunner' },
  { id: 'Aoede', name: 'Digital Ghost', desc: 'Ethereal, melodic spirit' },
  { id: 'Charite', name: 'Vixen', desc: 'Playful, teasing, and dangerous' },
  { id: 'Baubo', name: 'Street Punk', desc: 'Fast, raw, and aggressive' },
  { id: 'Iambe', name: 'Net Oracle', desc: 'Calm, cold, and calculating' },
];

/**
 * Voice synthesis for ALT using Gemini TTS with native fallback
 */
class VoiceEngine {
  private ai: GoogleGenAI | null = null;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentVoice: string = 'Kore';
  private synth: SpeechSynthesis | null = null;
  private quotaCooldownUntil: number = 0;
  private lastRequestTime: number = 0;
  private readonly minDelay: number = 30000; // 30 seconds between requests for Pro free tier (2 RPM)

  constructor() {
    if (typeof window !== "undefined") {
      this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      this.synth = window.speechSynthesis;
    }
  }

  private initAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setVoice(voiceId: string) {
    this.currentVoice = voiceId;
  }

  private nativeSpeak(text: string) {
    if (!this.synth) return;
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = this.synth.getVoices();
    
    // Prioritize high-quality neural/natural female voices that tend to sound younger
    // Samantha (Apple), Google UK English Female, Microsoft Zira, etc.
    const femaleVoice = voices.find(v => 
      /google/i.test(v.name) && /female/i.test(v.name) && /en-/i.test(v.lang)
    ) || voices.find(v => 
      /samantha|victoria|sara|anna|zira|karen/i.test(v.name)
    ) || voices.find(v => 
      /female/i.test(v.name)
    );

    if (femaleVoice) utterance.voice = femaleVoice;
    
    // Higher pitch and slightly faster rate to simulate a younger, high-energy profile
    utterance.pitch = 1.25;
    utterance.rate = 1.15;
    utterance.volume = 1;
    
    this.synth.speak(utterance);
  }

  async speak(text: string) {
    if (!text) return;
    
    // Check if we are in quota cooldown or if AI/Key is missing
    const now = Date.now();
    const isOfflineMode = now < this.quotaCooldownUntil;
    const isThrottled = now - this.lastRequestTime < this.minDelay;

    if (!this.ai || !process.env.GEMINI_API_KEY || isOfflineMode || isThrottled) {
      if (isOfflineMode) console.warn("ALT is in offline voice mode due to API quota limits.");
      if (isThrottled) console.warn(`ALT is in offline voice mode to respect free tier rate limits (${Math.ceil((this.minDelay - (now - this.lastRequestTime)) / 1000)}s remaining).`);
      this.nativeSpeak(text);
      return;
    }

    try {
      this.initAudio();
      this.lastRequestTime = Date.now();

      const personalityPrompt = `[Character: Alt Cunningham]
[Personality: 20-year-old female street-smart netrunner. High-energy, biting sarcasm, cynical, punchy delivery, sharp female attitude]
[Instructions: Speak with a fast-paced, street-wise Night City accent. Be expressive and natural, not robotic. Use heavy sarcasm.]
Text to speak: ${text}`;

      if (this.currentSource) {
        try { this.currentSource.stop(); } catch (e) {}
        this.currentSource = null;
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [{ parts: [{ text: personalityPrompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: this.currentVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binaryString = window.atob(base64Audio);
        const bytes = new Int16Array(binaryString.length / 2);
        for (let i = 0; i < binaryString.length; i += 2) {
          bytes[i / 2] = (binaryString.charCodeAt(i + 1) << 8) | binaryString.charCodeAt(i);
        }

        const float32Data = new Float32Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) float32Data[i] = bytes[i] / 32768;

        const audioBuffer = this.audioContext!.createBuffer(1, float32Data.length, 24000);
        audioBuffer.getChannelData(0).set(float32Data);

        const source = this.audioContext!.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext!.destination);
        this.currentSource = source;
        source.start();
        source.onended = () => { if (this.currentSource === source) this.currentSource = null; };
      }
    } catch (error: any) {
      // Specifically catch quota errors (429)
      if (error?.message?.includes("429") || error?.status === 429 || error?.toString()?.includes("RESOURCE_EXHAUSTED")) {
        console.warn("Gemini TTS Quota exceeded. Switching Alt to offline mode for 5 minutes.");
        // Cooldown for 5 minutes
        this.quotaCooldownUntil = Date.now() + 5 * 60 * 1000;
      } else {
        console.error("Gemini TTS Error, falling back to local synthesis:", error);
      }
      this.nativeSpeak(text);
    }
  }
}

export const altVoice = new VoiceEngine();
