
import { GoogleGenAI, Modality } from "@google/genai";

export const VOICE_PROFILES = [
  { id: 'alt-classic', name: 'Alt (Classic)', desc: 'Sharp, street-smart netrunner' },
  { id: 'ghost', name: 'Digital Ghost', desc: 'Ethereal, melodic spirit' },
  { id: 'vixen', name: 'Vixen', desc: 'Playful, teasing, and dangerous' },
  { id: 'punk', name: 'Street Punk', desc: 'Fast, raw, and aggressive' },
  { id: 'oracle', name: 'Net Oracle', desc: 'Calm, cold, and calculating' },
];

/**
 * Advanced Voice Engine for ALT
 * Uses Gemini 3.1 Pro for high-quality TTS with rate limit protection
 * Falls back to Web Speech API when limits are reached or API fails
 */
class VoiceEngine {
  private currentVoiceProfile: string = 'alt-classic';
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private ai: GoogleGenAI | null = null;
  
  // Rate limiting state
  private rpmCounter: number[] = [];
  private tpmCounter: { time: number, tokens: number }[] = [];
  private rpdCounter: number[] = [];
  
  // Limits (Safe baseline for free tier)
  private readonly MAX_RPM = 2; // Requests per minute
  private readonly MAX_TPM = 30000; // Tokens per minute
  private readonly MAX_RPD = 50; // Requests per day

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis;
      const loadVoices = () => {
        this.voices = this.synth?.getVoices() || [];
      };
      loadVoices();
      if (this.synth?.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = loadVoices;
      }
      
      // Initialize Gemini
      if (process.env.GEMINI_API_KEY) {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      }
    }
  }

  setVoice(voiceId: string) {
    this.currentVoiceProfile = voiceId;
  }

  private checkRateLimits(text: string): boolean {
    const now = Date.now();
    const tokenEstimate = text.length / 4; // Very rough estimate

    // Cleanup counters
    this.rpmCounter = this.rpmCounter.filter(t => now - t < 60000);
    this.tpmCounter = this.tpmCounter.filter(t => now - t.time < 60000);
    this.rpdCounter = this.rpdCounter.filter(t => now - t < 86400000);

    const currentRPM = this.rpmCounter.length;
    const currentTPM = this.tpmCounter.reduce((acc, t) => acc + t.tokens, 0);
    const currentRPD = this.rpdCounter.length;

    if (currentRPM >= this.MAX_RPM || 
        currentTPM + tokenEstimate >= this.MAX_TPM || 
        currentRPD >= this.MAX_RPD) {
      console.warn("ALT_VOICE: Gemini rate limit reached or near. Falling back to neural buffer (Native TTS).");
      return false;
    }

    return true;
  }

  private recordGeminiRequest(text: string) {
    const now = Date.now();
    const tokenEstimate = text.length / 4;
    this.rpmCounter.push(now);
    this.tpmCounter.push({ time: now, tokens: tokenEstimate });
    this.rpdCounter.push(now);
  }

  private getBestNativeVoice(profile: string): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) this.voices = this.synth?.getVoices() || [];
    const enVoices = this.voices.filter(v => v.lang.startsWith('en'));
    
    switch (profile) {
      case 'ghost':
        return enVoices.find(v => /google|natural/i.test(v.name) && /female/i.test(v.name)) || 
               enVoices.find(v => /victoria|serena/i.test(v.name)) || null;
      case 'oracle':
        return enVoices.find(v => /microsoft/i.test(v.name) && /zira/i.test(v.name)) || 
               enVoices.find(v => /moira/i.test(v.name)) || null;
      default:
        // Alt-matching voices: Samantha, Anna, or anything young and sharp
        return enVoices.find(v => /google/i.test(v.name) && /female/i.test(v.name)) ||
               enVoices.find(v => /female/i.test(v.name)) || 
               enVoices[0] || null;
    }
  }

  private nativeSpeak(text: string) {
    if (!this.synth || !text) return;
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = this.getBestNativeVoice(this.currentVoiceProfile);
    if (selectedVoice) utterance.voice = selectedVoice;

    // Alt's profile characterization for native TTS
    switch (this.currentVoiceProfile) {
      case 'ghost': utterance.pitch = 0.8; utterance.rate = 0.85; break;
      case 'punk': utterance.pitch = 1.3; utterance.rate = 1.3; break;
      case 'oracle': utterance.pitch = 1.0; utterance.rate = 1.0; break;
      case 'vixen': utterance.pitch = 1.4; utterance.rate = 1.2; break;
      default: utterance.pitch = 1.25; utterance.rate = 1.15;
    }
    
    this.synth.speak(utterance);
  }

  private activeSource: AudioBufferSourceNode | null = null;
  private audioCtx: AudioContext | null = null;

  async speak(text: string) {
    if (!text) return;

    // Stop all current speech
    if (this.synth) this.synth.cancel();
    if (this.activeSource) {
      try { this.activeSource.stop(); } catch(e) {}
      this.activeSource = null;
    }

    // Try Gemini TTS first if available and within limits
    if (this.ai && this.checkRateLimits(text)) {
      try {
        const response = await this.ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: [{ parts: [{ text: `Say with a sharp, netrunner edge: ${text}` }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' }, // Matches Alt's personality
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          this.recordGeminiRequest(text);
          this.playGeminiAudio(base64Audio);
          return;
        }
      } catch (error) {
        console.error("ALT_VOICE: Gemini TTS failed. Engaging legacy native interface.", error);
      }
    }

    // Fallback to Native TTS
    this.nativeSpeak(text);
  }

  private playGeminiAudio(base64Data: string) {
    const audioContent = atob(base64Data);
    const buffer = new Uint8Array(audioContent.length);
    for (let i = 0; i < audioContent.length; i++) {
        buffer[i] = audioContent.charCodeAt(i);
    }
    
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const float32Data = new Float32Array(buffer.length / 2);
    const view = new DataView(buffer.buffer);
    for (let i = 0; i < float32Data.length; i++) {
        float32Data[i] = view.getInt16(i * 2, true) / 32768.0;
    }

    const audioBuffer = this.audioCtx.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);
    
    const source = this.audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioCtx.destination);
    source.start(0);
    this.activeSource = source;
  }
}

export const altVoice = new VoiceEngine();

