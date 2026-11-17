import * as THREE from 'three';

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

export function createLabelTexture(
  text: string,
  dark: boolean,
  accent?: string
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const font = `600 ${12 * dpr}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  const label = text.toUpperCase();
  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) return null;
  measure.font = font;
  const padding = 10 * dpr;
  const barWidth = 3 * dpr;
  const textWidth = measure.measureText(label).width;
  const width = Math.ceil(textWidth + padding * 2 + barWidth);
  const height = Math.ceil(26 * dpr);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.font = font;
  context.textAlign = 'left';
  context.textBaseline = 'middle';

  roundedRect(
    context,
    0.5 * dpr,
    0.5 * dpr,
    width - dpr,
    height - dpr,
    3 * dpr
  );
  context.fillStyle = dark ? 'rgba(20, 17, 14, 0.92)' : 'rgba(242, 237, 226, 0.95)';
  context.fill();
  context.strokeStyle = dark
    ? 'rgba(176, 138, 84, 0.42)'
    : 'rgba(143, 111, 63, 0.5)';
  context.lineWidth = dpr;
  context.stroke();

  context.fillStyle = accent ?? '#a63b2a';
  context.fillRect(0.5 * dpr, 4 * dpr, barWidth, height - 8 * dpr);

  context.fillStyle = dark ? '#e7dfcf' : '#1c1a17';
  context.fillText(label, padding + barWidth, height / 2 + 0.5 * dpr);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}
