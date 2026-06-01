/* ─────────────────────────────────────────────────────────────
   Sfx engine — Web Audio
   - Ducks the video soundtrack to ambient (low-pass + quieter)
     once the visual hook ends, so the cinematic bed continues
     under the rest of the ad
   - Fires layered synth SFX on each beat (ticks, whooshes,
     thump, dings, riser)
   ───────────────────────────────────────────────────────────── */

class SfxEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.videoSource = null;
    this.videoGain = null;
    this.videoFilter = null;
    this.sfxBus = null;
  }

  ensureCtx() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.7;
    this.master.connect(this.ctx.destination);

    // SFX bus (synthesized hits) routes through master with a touch of compression
    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = 0.85;
    this.sfxBus.connect(this.master);
  }

  // Attach the video element so its audio routes through Web Audio.
  // After this call, the HTMLMediaElement no longer plays audio directly —
  // only the WebAudio graph does. Safe to call once per video element.
  attachVideo(videoEl) {
    this.ensureCtx();
    if (this.videoSource) return;
    try {
      this.videoSource = this.ctx.createMediaElementSource(videoEl);
    } catch (e) {
      // already attached in a prior session — ignore
      return;
    }
    this.videoFilter = this.ctx.createBiquadFilter();
    this.videoFilter.type = 'lowpass';
    this.videoFilter.frequency.value = 22000;
    this.videoFilter.Q.value = 0.7;

    this.videoGain = this.ctx.createGain();
    this.videoGain.gain.value = 1;

    this.videoSource.connect(this.videoFilter);
    this.videoFilter.connect(this.videoGain);
    this.videoGain.connect(this.master);
  }

  // Foreground the cinematic clip (full volume, full bandwidth)
  goForeground() {
    if (!this.ctx || !this.videoFilter) return;
    const now = this.ctx.currentTime;
    this.videoFilter.frequency.cancelScheduledValues(now);
    this.videoGain.gain.cancelScheduledValues(now);
    this.videoFilter.frequency.setTargetAtTime(22000, now, 0.05);
    this.videoGain.gain.setTargetAtTime(1.0, now, 0.05);
  }

  // Muffle the clip into an ambient bed under the UI portion
  goAmbient() {
    if (!this.ctx || !this.videoFilter) return;
    const now = this.ctx.currentTime;
    this.videoFilter.frequency.cancelScheduledValues(now);
    this.videoGain.gain.cancelScheduledValues(now);
    this.videoFilter.frequency.exponentialRampToValueAtTime(700, now + 0.7);
    this.videoGain.gain.linearRampToValueAtTime(0.42, now + 0.7);
  }

  // Fade the entire ambient bed out (used at ad's end)
  bedOut(duration = 1.2) {
    if (!this.ctx || !this.videoGain) return;
    const now = this.ctx.currentTime;
    this.videoGain.gain.cancelScheduledValues(now);
    this.videoGain.gain.linearRampToValueAtTime(0.0001, now + duration);
  }

  // ── primitives ────────────────────────────────────────
  _osc({ freq, freqEnd, type = 'sine', dur = 0.15, gain = 0.2, delay = 0, filterType, filterFreq, filterEnd, q = 1 }) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd != null) osc.frequency.exponentialRampToValueAtTime(Math.max(0.01, freqEnd), t0 + dur);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    let last = osc;
    if (filterType) {
      const f = this.ctx.createBiquadFilter();
      f.type = filterType;
      f.Q.value = q;
      f.frequency.setValueAtTime(filterFreq, t0);
      if (filterEnd != null) f.frequency.exponentialRampToValueAtTime(filterEnd, t0 + dur);
      last.connect(f);
      last = f;
    }
    last.connect(env);
    env.connect(this.sfxBus);

    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  _noise({ dur = 0.25, gain = 0.2, filterType = 'bandpass', filterFreq = 1500, filterEnd, q = 0.8, delay = 0 }) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + delay;
    const len = Math.ceil(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      // shaped white noise (envelope baked in for cheap "tail")
      const e = 1 - i / len;
      data[i] = (Math.random() * 2 - 1) * e;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const f = this.ctx.createBiquadFilter();
    f.type = filterType;
    f.Q.value = q;
    f.frequency.setValueAtTime(filterFreq, t0);
    if (filterEnd != null) f.frequency.exponentialRampToValueAtTime(filterEnd, t0 + dur);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(gain, t0);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(f); f.connect(env); env.connect(this.sfxBus);
    src.start(t0);
  }

  // ── named hits ────────────────────────────────────────
  tick(freq = 1400) {
    this._osc({ freq, freqEnd: freq * 0.85, type: 'triangle', dur: 0.07, gain: 0.18 });
    this._noise({ dur: 0.04, gain: 0.06, filterType: 'highpass', filterFreq: 5000 });
  }

  keyTap() {
    this._noise({ dur: 0.05, gain: 0.10, filterType: 'bandpass', filterFreq: 3000, filterEnd: 1500, q: 1.2 });
  }

  whoosh({ pitch = 'mid' } = {}) {
    const f0 = pitch === 'high' ? 3000 : pitch === 'low' ? 1200 : 2000;
    this._noise({ dur: 0.32, gain: 0.18, filterType: 'bandpass', filterFreq: f0, filterEnd: f0 * 0.35, q: 0.6 });
  }

  swell() {
    this._osc({ freq: 200, freqEnd: 90, type: 'sine', dur: 0.45, gain: 0.25 });
    this._noise({ dur: 0.45, gain: 0.10, filterType: 'lowpass', filterFreq: 1200, filterEnd: 400 });
  }

  thump() {
    // Big bass kick: sub-sine sweep + transient click
    this._osc({ freq: 110, freqEnd: 32, type: 'sine', dur: 0.55, gain: 0.55 });
    this._noise({ dur: 0.05, gain: 0.18, filterType: 'highpass', filterFreq: 2500 });
    // a metallic ting on top
    this._osc({ freq: 1600, type: 'triangle', dur: 0.25, gain: 0.10, delay: 0.02, filterType: 'bandpass', filterFreq: 2200, q: 6 });
  }

  ding(freq = 1100) {
    this._osc({ freq, type: 'sine', dur: 0.4, gain: 0.18 });
    this._osc({ freq: freq * 2, type: 'sine', dur: 0.4, gain: 0.07 });
  }

  pop() {
    this._osc({ freq: 800, freqEnd: 1200, type: 'sine', dur: 0.08, gain: 0.18 });
  }

  riser() {
    // Cinematic riser into the logo lockup
    this._osc({ freq: 80, freqEnd: 900, type: 'sawtooth', dur: 0.8, gain: 0.18, filterType: 'lowpass', filterFreq: 600, filterEnd: 3000, q: 5 });
    this._noise({ dur: 0.8, gain: 0.12, filterType: 'bandpass', filterFreq: 400, filterEnd: 5000, q: 0.7 });
    // tail thump
    this._osc({ freq: 120, freqEnd: 40, type: 'sine', dur: 0.6, gain: 0.45, delay: 0.7 });
  }

  // Reset for restart
  reset() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.videoFilter) {
      this.videoFilter.frequency.cancelScheduledValues(now);
      this.videoFilter.frequency.setValueAtTime(22000, now);
    }
    if (this.videoGain) {
      this.videoGain.gain.cancelScheduledValues(now);
      this.videoGain.gain.setValueAtTime(1, now);
    }
  }
}

window.SfxEngine = SfxEngine;
