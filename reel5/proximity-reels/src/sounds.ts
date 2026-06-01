const SAMPLE_RATE = 44100;

function encodeWav(samples: Float32Array): string {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return "data:audio/wav;base64," + btoa(binary);
}

export function softTick(): string {
  const len = Math.floor(SAMPLE_RATE * 0.04);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 120);
    samples[i] = (Math.random() * 2 - 1) * env * 0.3;
  }
  return encodeWav(samples);
}

export function click(): string {
  const len = Math.floor(SAMPLE_RATE * 0.06);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 80);
    const tone = Math.sin(2 * Math.PI * 800 * t) * 0.2;
    const noise = (Math.random() * 2 - 1) * 0.15;
    samples[i] = (tone + noise) * env;
  }
  return encodeWav(samples);
}

export function whoosh(): string {
  const len = Math.floor(SAMPLE_RATE * 0.25);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.sin(Math.PI * t / 0.25) * 0.25;
    const freq = 200 + 2000 * (t / 0.25);
    const osc = Math.sin(2 * Math.PI * freq * t);
    const noise = (Math.random() * 2 - 1);
    samples[i] = (noise * 0.7 + osc * 0.3) * env;
  }
  return encodeWav(samples);
}

export function ding(): string {
  const len = Math.floor(SAMPLE_RATE * 0.4);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 8);
    const tone1 = Math.sin(2 * Math.PI * 1200 * t) * 0.3;
    const tone2 = Math.sin(2 * Math.PI * 1800 * t) * 0.15;
    samples[i] = (tone1 + tone2) * env;
  }
  return encodeWav(samples);
}

export function thud(): string {
  const len = Math.floor(SAMPLE_RATE * 0.12);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 40);
    const freq = 120 - 80 * (t / 0.12);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.5;
  }
  return encodeWav(samples);
}

export function reveal(): string {
  const len = Math.floor(SAMPLE_RATE * 0.35);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 5) * 0.3;
    const freq = 600 + 400 * (t / 0.35);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env;
  }
  return encodeWav(samples);
}

export function pop(): string {
  const len = Math.floor(SAMPLE_RATE * 0.08);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 60);
    const freq = 500 + 300 * Math.exp(-t * 30);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.35;
  }
  return encodeWav(samples);
}
