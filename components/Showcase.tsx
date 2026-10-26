'use client';

import { useState, type KeyboardEvent } from 'react';
import { SITE_BASE } from '@/lib/site';
import { UI, type Lang } from '@/lib/i18n';

export default function Showcase({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const [active, setActive] = useState(0);
  const img = (name: string) => `${SITE_BASE}/showcase/${name}`;

  const slides = [
    {
      kind: 'desktop' as const,
      label: t.showcase.tabs[0],
      caption: t.showcase.captionDesktop,
      light: 'desktop-light.jpg',
      dark: 'hero-desktop.jpg',
      altLight: 'X Linux desktop (light theme)',
      altDark: 'X Linux desktop (dark theme)',
    },
    {
      kind: 'image' as const,
      label: t.showcase.tabs[1],
      caption: t.showcase.captionDemo,
      file: 'demo.gif',
    },
    {
      kind: 'image' as const,
      label: t.showcase.tabs[2],
      caption: t.showcase.captionTools,
      file: 'tools.png',
    },
    {
      kind: 'image' as const,
      label: t.showcase.tabs[3],
      caption: t.showcase.captionBoot,
      file: 'boot-generations.png',
    },
    {
      kind: 'video' as const,
      label: t.showcase.tabs[4],
      caption: t.showcase.captionInstaller,
      file: 'installer-30s.mp4',
      poster: 'installer.png',
    },
    {
      kind: 'image' as const,
      label: t.showcase.tabs[5],
      caption: t.showcase.captionDeploy,
      file: 'deploy-x.png',
    },
    {
      kind: 'image' as const,
      label: t.showcase.tabs[6],
      caption: t.showcase.captionGen,
      file: 'x-gen.png',
    },
    {
      kind: 'image' as const,
      label: t.showcase.tabs[7],
      caption: t.showcase.captionReboot,
      file: 'reboot-it.png',
    },
    {
      kind: 'image' as const,
      label: t.showcase.tabs[8],
      caption: t.showcase.captionStart,
      file: 'start-x.png',
    },
    {
      kind: 'image' as const,
      label: t.showcase.tabs[9],
      caption: t.showcase.captionFirstView,
      file: 'first-view.png',
    },
    {
      kind: 'image' as const,
      label: t.showcase.tabs[10],
      caption: t.showcase.captionXDots,
      file: 'xlinux-xdots.png',
    },
  ];

  const current = slides[active];
  const select = (index: number) => {
    const next = (index + slides.length) % slides.length;
    setActive(next);
    requestAnimationFrame(() => {
      document.getElementById(`showcase-tab-${next}`)?.focus();
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      select(active + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      select(active - 1);
    }
  };

  return (
    <section className="mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t.showcase.title}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
        {t.showcase.subtitle}
      </p>

      <div className="mt-8">
        <div
          role="tablist"
          aria-label={t.showcase.title}
          onKeyDown={onKeyDown}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-zinc-200 dark:border-zinc-800"
        >
          {slides.map((slide, index) => {
            const selected = active === index;
            return (
              <button
                key={slide.label}
                id={`showcase-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="showcase-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                className={`-mb-px border-b-2 pb-2 pt-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  selected
                    ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <span className="mr-1.5 text-zinc-300 dark:text-zinc-700">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {slide.label}
              </button>
            );
          })}
        </div>

        <div
          id="showcase-panel"
          role="tabpanel"
          aria-labelledby={`showcase-tab-${active}`}
          className="mt-4"
        >
          <div
            key={active}
            className="x-showcase-slide relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900"
          >
            {current.kind === 'desktop' ? (
              <>
                <img
                  src={img(current.light)}
                  alt={current.altLight}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover object-center dark:hidden"
                />
                <img
                  src={img(current.dark)}
                  alt={current.altDark}
                  loading="eager"
                  decoding="async"
                  className="hidden h-full w-full object-cover object-center dark:block"
                />
              </>
            ) : current.kind === 'video' ? (
              <video
                src={img(current.file)}
                poster={img(current.poster)}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={current.caption}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <img
                src={img(current.file)}
                alt={current.caption}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p
              aria-live="polite"
              className="max-w-2xl text-xs leading-5 text-zinc-500 dark:text-zinc-400"
            >
              <span className="mr-2 font-mono text-zinc-400 dark:text-zinc-600">
                {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
              {current.caption}
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label={t.showcase.prev}
                onClick={() => select(active - 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
              >
                ←
              </button>
              <button
                type="button"
                aria-label={t.showcase.next}
                onClick={() => select(active + 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
