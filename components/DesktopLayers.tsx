'use client';

import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import LayerStackStage from './three/LayerStackStage';
import { UI, type Lang } from '@/lib/i18n';

const ACCENTS = ['#7bd88f', '#5ad4e6', '#fce566', '#fd9353', '#fc618d', '#948ae3'];

export default function DesktopLayers({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const [active, setActive] = useState<number | null>(null);
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
        <LayerStackStage
          layers={layers}
          active={active}
          onActive={setActive}
          kicker="X / LAYER MAP"
          hint={t.desktops.sceneHint}
          ariaLabel={t.desktops.layersAlt}
          idleTitle="X Linux"
          idleMeta={t.desktops.eyebrow}
          idleDesc={t.desktops.caption}
        />

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
