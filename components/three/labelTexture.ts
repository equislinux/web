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
  const font = `600 ${13 * dpr}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  const label = text.toUpperCase();
  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) return null;
  measure.font = font;
  const padding = 9 * dpr;
  const width = Math.ceil(measure.measureText(label).width + padding * 2);
  const height = Math.ceil(24 * dpr);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.font = font;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  roundedRect(context, 0.5 * dpr, 0.5 * dpr, width - dpr, height - dpr, height / 2);
  context.fillStyle = dark ? 'rgba(9, 9, 11, 0.84)' : 'rgba(250, 250, 250, 0.9)';
  context.fill();
  context.strokeStyle = accent ?? (dark ? 'rgba(244, 244, 245, 0.24)' : 'rgba(24, 24, 27, 0.16)');
  context.lineWidth = dpr;
  context.stroke();
  context.fillStyle = dark ? '#f4f4f5' : '#18181b';
  context.fillText(label, width / 2, height / 2 + 0.5 * dpr);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}
