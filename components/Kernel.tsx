'use client';

import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import LayerStackStage from './three/LayerStackStage';
import { UI, type Lang } from '@/lib/i18n';

const ACCENTS = ['#5ad4e6', '#7bd88f', '#fce566', '#fd9353', '#fc618d'];
const CHANNEL_ACCENTS = ['#7bd88f', '#fce566', '#fc618d'];

export default function Kernel({ lang }: { lang: Lang }) {
  const t = UI[lang].kernel;
  const [active, setActive] = useState<number | null>(null);
  const layers = t.layers.map((layer, index) => ({
    ...layer,
    accent: ACCENTS[index % ACCENTS.length],
  }));

  return (
    <section className="x-anatomy-section mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            {t.eyebrow}
          </p>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {t.body}
          </p>
          <p className="mt-4 max-w-2xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {t.note}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/${lang}/docs/x-kernel/overview`}
              className="inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
            >
              {t.guideCta}
            </Link>
            <a
              href="https://github.com/equislinux/x-kernel"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
            >
              {t.repoCta}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 lg:col-span-6">
          {t.channels.map((channel, index) => (
            <article
              key={channel.name}
              className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: CHANNEL_ACCENTS[index],
                      boxShadow: `0 0 10px ${CHANNEL_ACCENTS[index]}66`,
                    }}
                  />
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {channel.name}
                  </h3>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                  {channel.state}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px]">
                <span className="text-zinc-900 dark:text-zinc-100">
                  {channel.version}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {channel.repo}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                {channel.desc}
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
          kicker={t.sceneKicker}
          hint={t.sceneHint}
          ariaLabel={t.title}
          idleTitle={t.idleTitle}
          idleMeta={t.idleMeta}
          idleDesc={t.idleDesc}
        />

        <div
          role="group"
          aria-label={t.layersLabel}
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
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
              <span className="x-layer-index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="x-layer-name block">{layer.name}</span>
                <span className="x-layer-desc block">{layer.desc}</span>
              </span>
            </button>
          ))}
        </div>

        <figcaption className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {t.sceneCaption}
        </figcaption>
      </figure>
    </section>
  );
}
