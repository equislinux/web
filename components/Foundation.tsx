'use client';

import Link from 'next/link';
import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { UI, type Lang } from '@/lib/i18n';

export default function Foundation({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const sceneRef = useRef<HTMLDivElement>(null);

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const scene = sceneRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    scene.style.setProperty('--cube-fx', `${(nx * 10).toFixed(2)}deg`);
    scene.style.setProperty('--cube-fy', `${(-ny * 8).toFixed(2)}deg`);
  };

  const reset = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.style.setProperty('--cube-fx', '0deg');
    scene.style.setProperty('--cube-fy', '0deg');
  };

  return (
    <section className="mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            {t.foundation.eyebrow}
          </p>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.foundation.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.foundation.subtitle}
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {t.foundation.body}
          </p>
          <Link
            href={`/${lang}/docs/x/project-layout`}
            className="mt-5 inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
          >
            {t.foundation.cta}
          </Link>
        </div>

        <div
          ref={sceneRef}
          className="x-foundation-scene lg:col-span-7"
          onPointerMove={move}
          onPointerLeave={reset}
          role="img"
          aria-label={t.foundation.title}
        >
          <div className="x-foundation-cube">
            <div className="x-foundation-face x-foundation-back" />
            <div className="x-foundation-face x-foundation-left" />
            <div className="x-foundation-face x-foundation-bottom" />
            <div className="x-foundation-face x-foundation-right">
              <span className="x-foundation-kicker">kernel</span>
              <span className="x-foundation-kicker">systemd</span>
              <span className="x-foundation-kicker">pacman</span>
              <span className="x-foundation-kicker">btrfs</span>
            </div>
            <div className="x-foundation-face x-foundation-top">
              <span className="x-foundation-kicker">x86_64 / rolling</span>
            </div>
            <div className="x-foundation-face x-foundation-front">
              <span className="x-foundation-kicker">X / BASE</span>
              <span className="x-foundation-mark">X</span>
              <span className="x-foundation-kicker">arch linux</span>
            </div>
          </div>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 border-y border-zinc-200 dark:border-zinc-800 lg:grid-cols-4">
        {t.foundation.items.map((item, index) => (
          <div
            key={item.label}
            className={`border-zinc-200 px-4 py-4 dark:border-zinc-800 ${
              index < 2 ? 'border-b lg:border-b-0' : ''
            } ${index % 2 === 1 ? 'border-l' : ''} ${index === 0 ? '' : 'lg:border-l'}`}
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-500">
              {String(index + 1).padStart(2, '0')} / {item.label}
            </dt>
            <dd className="mt-1 font-mono text-[11px] leading-5 text-zinc-700 dark:text-zinc-300">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
