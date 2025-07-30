import { useCallback, useRef } from 'react';

// Audio context for managing sound effects
class AudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      document.addEventListener('click', this.initAudio, { once: true });
      document.addEventListener('keydown', this.initAudio, { once: true });
    }
  }

  private initAudio = () => {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.generateSounds();
    }
  };

  private generateSounds() {
    if (!this.audioContext) return;

    // Generate scroll sound (small click for SP investment changes)
    const scrollBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.08, this.audioContext.sampleRate);
    const scrollData = scrollBuffer.getChannelData(0);
    for (let i = 0; i < scrollData.length; i++) {
      const t = i / this.audioContext.sampleRate;
      scrollData[i] = Math.sin(2 * Math.PI * 500 * t) * Math.exp(-t * 25) * 0.12;
    }
    this.sounds.set('scroll', scrollBuffer);

    // Generate click sound (gentle pop)
    const clickBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.15, this.audioContext.sampleRate);
    const clickData = clickBuffer.getChannelData(0);
    for (let i = 0; i < clickData.length; i++) {
      const t = i / this.audioContext.sampleRate;
      clickData[i] = Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 15) * 0.15;
    }
    this.sounds.set('click', clickBuffer);

    // Generate success sound (positive chime)
    const successBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.3, this.audioContext.sampleRate);
    const successData = successBuffer.getChannelData(0);
    for (let i = 0; i < successData.length; i++) {
      const t = i / this.audioContext.sampleRate;
      const frequency = 523 + (t * 200); // Rising tone
      successData[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 8) * 0.12;
    }
    this.sounds.set('success', successBuffer);

    // Generate error sound (low tone)
    const errorBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.2, this.audioContext.sampleRate);
    const errorData = errorBuffer.getChannelData(0);
    for (let i = 0; i < errorData.length; i++) {
      const t = i / this.audioContext.sampleRate;
      errorData[i] = Math.sin(2 * Math.PI * 300 * t) * Math.exp(-t * 10) * 0.1;
    }
    this.sounds.set('error', errorBuffer);
  }

  public playSound(soundName: string, volume: number = 0.3) {
    if (!this.enabled || !this.audioContext || !this.sounds.has(soundName)) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.sounds.get(soundName)!;
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled() {
    return this.enabled;
  }
}

const audioManager = new AudioManager();

export function useAudio() {
  const playScroll = useCallback(() => audioManager.playSound('scroll', 0.25), []);
  const playClick = useCallback(() => audioManager.playSound('click', 0.3), []);
  const playSuccess = useCallback(() => audioManager.playSound('success', 0.25), []);
  const playError = useCallback(() => audioManager.playSound('error', 0.2), []);

  const setEnabled = useCallback((enabled: boolean) => {
    audioManager.setEnabled(enabled);
    // Store preference in localStorage
    localStorage.setItem('audio-enabled', enabled.toString());
  }, []);

  const isEnabled = useCallback(() => {
    // Check localStorage preference
    const stored = localStorage.getItem('audio-enabled');
    if (stored !== null) {
      const enabled = stored === 'true';
      audioManager.setEnabled(enabled);
      return enabled;
    }
    return audioManager.isEnabled();
  }, []);

  return {
    playScroll,
    playClick,
    playSuccess,
    playError,
    setEnabled,
    isEnabled
  };
}