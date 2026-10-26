'use client';

import Link from 'next/link';
import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { UI, type Lang } from '@/lib/i18n';

const ACCENTS = ['#7bd88f', '#5ad4e6', '#fce566', '#fd9353', '#fc618d', '#948ae3'];

export default function DesktopLayers({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const [active, setActive] = useState<number | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const layers = t.desktops.layers.map((layer, index) => ({
    ...layer,
    accent: ACCENTS[index],
  }));
  const desktops = [
    { label: t.desktops.hyprland, desc: t.desktops.hyprlandDesc, accent: '#fc618d' },
    { label: t.desktops.niri, desc: t.desktops.niriDesc, accent: '#5ad4e6' },
    { label: t.desktops.kde, desc: t.desktops.kdeDesc, accent: '#948ae3' },
    { label: t.desktops.console, desc: t.desktops.consoleDesc, accent: '#a1a1aa' },
  ];

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const scene = sceneRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    scene.style.setProperty('--tilt-x', `${(-ny * 6).toFixed(2)}deg`);
    scene.style.setProperty('--tilt-y', `${(nx * 8).toFixed(2)}deg`);
    scene.style.setProperty('--mx', `${(nx + 0.5) * 100}%`);
    scene.style.setProperty('--my', `${(ny + 0.5) * 100}%`);
  };

  const resetScene = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.style.setProperty('--tilt-x', '0deg');
    scene.style.setProperty('--tilt-y', '0deg');
    scene.style.setProperty('--mx', '50%');
    scene.style.setProperty('--my', '42%');
  };

  return (
    <section className="x-anatomy-section mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            {t.desktops.eyebrow}
          </p>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.desktops.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.desktops.subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {t.desktops.body}
          </p>
          <p className="mt-4 max-w-2xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {t.desktops.installNote}
          </p>
          <Link
            href={`/${lang}/docs/x/installer`}
            className="mt-5 inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
          >
            {t.desktops.guideCta}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:col-span-5">
          {desktops.map((desktop) => (
            <article
              key={desktop.label}
              className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: desktop.accent,
                    boxShadow: `0 0 10px ${desktop.accent}66`,
                  }}
                />
                <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {desktop.label}
                </h3>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                {desktop.desc}
              </p>
            </article>
          ))}
        </div>
      </div>

      <figure className="mt-8">
        <div
          ref={sceneRef}
          role="img"
          aria-label={t.desktops.layersAlt}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetScene}
          className="x-anatomy min-h-[560px] border border-zinc-200 dark:border-zinc-800"
        >
          <div className="x-anatomy-glow" />
          <p className="x-anatomy-meta absolute left-4 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.18em]">
            X / LAYER MAP
          </p>
          <p className="x-anatomy-meta absolute right-4 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.18em]">
            {active === null
              ? '06 / 06'
              : `${String(active + 1).padStart(2, '0')} / 06`}
          </p>
          <div className="x-anatomy-stage">
            <div className="x-anatomy-orbit">
              <div className="x-anatomy-stack">
                {layers.map((layer, index) => (
                  <div
                    key={layer.name}
                    aria-hidden="true"
                    data-active={active === index}
                    className="x-anatomy-layer"
                    style={{ '--i': index, '--accent': layer.accent } as CSSProperties}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 z-10 max-w-[50%] text-right">
            <p className="x-anatomy-meta font-mono text-[10px] uppercase tracking-[0.14em]">
              {active === null ? t.desktops.sceneHint : layers[active].name}
            </p>
            {active !== null ? (
              <p className="x-anatomy-meta mt-1 text-[10px] leading-4">{layers[active].desc}</p>
            ) : null}
          </div>
        </div>

        <div
          role="group"
          aria-label={t.desktops.layersLabel}
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
        >
          {layers.map((layer, index) => (
            <button
              key={layer.name}
              type="button"
              data-active={active === index}
              aria-pressed={active === index}
              className="x-layer-tile"
              style={{ '--accent': layer.accent } as CSSProperties}
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="x-layer-index">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <span className="x-layer-name block">{layer.name}</span>
                <span className="x-layer-desc block">{layer.desc}</span>
              </span>
            </button>
          ))}
        </div>

        <figcaption className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {t.desktops.caption}
        </figcaption>
      </figure>
    </section>
  );
}
