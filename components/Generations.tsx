'use client';

import Link from 'next/link';
import { useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { UI, type Lang } from '@/lib/i18n';

export default function Generations({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const sceneRef = useRef<HTMLDivElement>(null);
  const items = t.generations.items;

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const scene = sceneRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    scene.style.setProperty('--gen-fx', `${(nx * 8).toFixed(2)}deg`);
    scene.style.setProperty('--gen-fy', `${(-ny * 5).toFixed(2)}deg`);
  };

  const reset = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.style.setProperty('--gen-fx', '0deg');
    scene.style.setProperty('--gen-fy', '0deg');
  };

  return (
    <section className="mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            {t.generations.eyebrow}
          </p>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.generations.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.generations.subtitle}
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {t.generations.body}
          </p>
          <Link
            href={`/${lang}/docs/scripts/generations`}
            className="mt-5 inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
          >
            {t.generations.cta}
          </Link>
        </div>

        <div className="lg:col-span-7">
          <div
            ref={sceneRef}
            className="x-gen-scene"
            onPointerMove={move}
            onPointerLeave={reset}
            role="img"
            aria-label={t.generations.title}
          >
            <div className="x-gen-stack">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="x-gen-card"
                  data-current={index === items.length - 1}
                  style={{ '--i': index } as CSSProperties}
                >
                  <span className="x-gen-index">{item.id}</span>
                  <span className="x-gen-line" />
                </div>
              ))}
            </div>
            <span className="x-gen-meta absolute left-4 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.16em]">
              generation stack
            </span>
            <span className="x-gen-meta absolute right-4 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.16em]">
              {String(items.length).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`border-t pt-2 ${
                  index === items.length - 1
                    ? 'border-cyan-500/70 dark:border-cyan-400/70'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <p className="font-mono text-[10px] tracking-[0.1em] text-zinc-900 dark:text-zinc-100">
                  {item.id}
                </p>
                <p className="mt-0.5 text-[10px] leading-4 text-zinc-500 dark:text-zinc-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
