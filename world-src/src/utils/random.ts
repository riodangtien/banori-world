export function random(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const damp = (a: number, b: number, dt: number, speed = 3) => a + (b - a) * (1 - Math.exp(-speed * dt));
