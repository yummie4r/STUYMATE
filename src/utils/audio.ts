// Web Audio API Synthesizer for UI sound feedback and Ambient Study Generator

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientNodes: {
    sourceNode?: AudioNode;
    gainNode?: GainNode;
    intervalId?: number;
    cleanup?: () => void;
  } | null = null;
  public soundEnabled: boolean = true;
  public ambientPlaying: string | null = null;

  private getContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playPop() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio not supported or blocked
    }
  }

  public playSuccess() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  public playError() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore
    }
  }

  public playAlarmChime() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const sequence = [
        { freq: 587.33, start: 0.0 }, // D5
        { freq: 739.99, start: 0.2 }, // F#5
        { freq: 880.00, start: 0.4 }, // A5
        { freq: 1174.66, start: 0.7 }, // D6
        { freq: 880.00, start: 1.1 },
        { freq: 1174.66, start: 1.4 }
      ];

      sequence.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.freq, now + item.start);

        gain.gain.setValueAtTime(0.2, now + item.start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + item.start + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + item.start);
        osc.stop(now + item.start + 0.6);
      });
    } catch {
      // Ignore
    }
  }

  // Ambient sound player (pure synthesized generators)
  public stopAmbient() {
    if (this.ambientNodes) {
      if (this.ambientNodes.cleanup) {
        this.ambientNodes.cleanup();
      }
      this.ambientNodes = null;
    }
    this.ambientPlaying = null;
  }

  public playAmbient(type: 'rain' | 'lofi' | 'whitenoise' | 'clock') {
    this.stopAmbient();
    const ctx = this.getContext();
    if (!ctx) return;

    this.ambientPlaying = type;

    if (type === 'whitenoise' || type === 'rain') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink/Brownian noise for rain
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else {
          // White noise
          data[i] = white * 0.2;
        }
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'rain' ? 800 : 1000;

      const gain = ctx.createGain();
      gain.gain.value = 0.06;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      this.ambientNodes = {
        cleanup: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch {
            // Ignore
          }
        }
      };
    } else if (type === 'lofi') {
      // Gentle warm binaural drone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.value = 130.81; // C3
      osc2.type = 'sine';
      osc2.frequency.value = 196.00; // G3
      osc3.type = 'triangle';
      osc3.frequency.value = 261.63; // C4

      gain.gain.value = 0.05;

      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();

      this.ambientNodes = {
        cleanup: () => {
          try {
            osc1.stop();
            osc2.stop();
            osc3.stop();
            gain.disconnect();
          } catch {
            // Ignore
          }
        }
      };
    } else if (type === 'clock') {
      // Gentle rhythmic tick
      const interval = window.setInterval(() => {
        if (!this.ambientPlaying) return;
        try {
          const tickOsc = ctx.createOscillator();
          const tickGain = ctx.createGain();
          tickOsc.type = 'sine';
          tickOsc.frequency.setValueAtTime(1200, ctx.currentTime);
          tickGain.gain.setValueAtTime(0.03, ctx.currentTime);
          tickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
          tickOsc.connect(tickGain);
          tickGain.connect(ctx.destination);
          tickOsc.start();
          tickOsc.stop(ctx.currentTime + 0.03);
        } catch {
          // Ignore
        }
      }, 1000);

      this.ambientNodes = {
        cleanup: () => {
          clearInterval(interval);
        }
      };
    }
  }
}

export const soundFx = new SoundManager();
