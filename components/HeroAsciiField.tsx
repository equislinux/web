'use client';

import { useEffect, useRef } from 'react';

const LAYERS =
  'ARCH BASE  //  X SYSTEM  //  GENERATIONS  //  DESKTOP  //  SHELL & APPS  //  DELIVERY  //  ';
const GLYPHS = '+  /  \\  ·  ─  |  0  1  { }  [ ]  < >  x  /  \\  ·  '.repeat(3);

export default function HeroAsciiField() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const section = field?.closest('.x-hero') as HTMLElement | null;
    if (!field || !section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const move = (event: PointerEvent) => {
      if (reduced.matches) return;
      const rect = section.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      section.style.setProperty('--hero-px', nx.toFixed(3));
      section.style.setProperty('--hero-py', ny.toFixed(3));
      section.style.setProperty('--hero-mx', `${(nx + 0.5) * 100}%`);
      section.style.setProperty('--hero-my', `${(ny + 0.5) * 100}%`);
    };

    const reset = () => {
      section.style.setProperty('--hero-px', '0');
      section.style.setProperty('--hero-py', '0');
      section.style.setProperty('--hero-mx', '50%');
      section.style.setProperty('--hero-my', '42%');
    };

    section.addEventListener('pointermove', move);
    section.addEventListener('pointerleave', reset);
    return () => {
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <div ref={fieldRef} aria-hidden="true" className="x-hero-field">
      <div className="x-hero-field-parallax">
        <div className="x-hero-field-drift">
          {Array.from({ length: 30 }).map((_, index) => (
            <p key={`layers-${index}`} className="x-hero-field-layers">
              {LAYERS.repeat(3)}
            </p>
          ))}
        </div>
        <div className="x-hero-field-drift x-hero-field-drift-reverse">
          {Array.from({ length: 18 }).map((_, index) => (
            <p key={`glyphs-${index}`} className="x-hero-field-glyphs">
              {GLYPHS.repeat(2)}
            </p>
          ))}
        </div>
      </div>
      <div className="x-hero-field-glow" />
    </div>
  );
}
