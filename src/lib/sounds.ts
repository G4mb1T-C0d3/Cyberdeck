class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    // Lazy init
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(level: number) {
    this.initCtx();
    if (this.masterGain) {
      this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, level), this.ctx!.currentTime + 0.1);
    }
  }

  playBeep(freq = 800, duration = 0.1, type: OscillatorType = "square", volume = 0.1) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playType() {
    this.playBeep(1200, 0.03, "sine", 0.05);
  }

  playError() {
    this.playBeep(300, 0.2, "sawtooth", 0.15);
    setTimeout(() => this.playBeep(200, 0.3, "sawtooth", 0.15), 50);
  }

  playGlitch() {
    const count = 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            this.playBeep(Math.random() * 3000 + 100, 0.02, i % 2 === 0 ? "square" : "sawtooth", 0.1);
        }, i * 20);
    }
  }

  // Pre-load assets queue logic can be added here if we had actual assets
}

export const sounds = new SoundManager();
