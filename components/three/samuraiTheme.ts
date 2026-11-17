export const SAMURAI_ACCENTS = [
  '#a3814f',
  '#3e5573',
  '#a63b2a',
  '#8c8272',
  '#7d4c39',
  '#5f5a51',
] as const;

const SAMURAI_ACCENTS_DARK = [
  '#c2a06a',
  '#7f97b8',
  '#c4503a',
  '#b8ad99',
  '#b07a5e',
  '#8a847a',
] as const;

export type SamuraiAccent = (typeof SAMURAI_ACCENTS)[number];

export function samuraiAccent(index: number, dark = false): string {
  const source = dark ? SAMURAI_ACCENTS_DARK : SAMURAI_ACCENTS;
  return source[index % source.length];
}

export function samuraiPalette(dark: boolean) {
  return {
    ink: dark ? '#33465f' : '#26364d',
    inkAlt: dark ? '#263548' : '#2e3f59',
    inkDeep: dark ? '#121924' : '#1a2433',
    sheen: dark ? '#3f5470' : '#3a4f70',
    ring: dark ? '#6b83a3' : '#3e5573',
    brass: dark ? '#c2a06a' : '#8f6f3f',
    shu: dark ? '#c4503a' : '#a63b2a',
    bone: dark ? '#e7dfcf' : '#c9c0ae',
    ai: dark ? '#7f97b8' : '#3e5573',
    text: dark ? '#e7dfcf' : '#1c1a17',
    muted: dark ? '#8a8272' : '#6f6a5f',
    line: dark ? 'rgba(231,223,207,0.16)' : 'rgba(28,26,23,0.16)',
    silk: dark ? '#9a8f7b' : '#7a6a55',
  };
}
