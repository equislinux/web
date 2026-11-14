'use client';

import Link from 'next/link';
import { useState } from 'react';
import GenerationStackStage from './three/GenerationStackStage';
import { UI, type Lang } from '@/lib/i18n';

export default function Generations({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const items = t.generations.items;
  const [active, setActive] = useState<number | null>(null);
  const currentIndex = items.length - 1;

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
          <GenerationStackStage
            items={items}
            active={active}
            onActive={setActive}
            kicker={t.generations.sceneKicker}
            hint={t.generations.sceneHint}
            ariaLabel={t.generations.title}
            idleTitle={t.generations.title}
            idleMeta={t.generations.eyebrow}
            idleDesc={t.generations.subtitle}
            currentLabel={t.generations.sceneCurrent}
            rollbackLabel={t.generations.sceneRollback}
            note={t.generations.sceneNote}
            docsHref={`/${lang}/docs/scripts/generations`}
            docsLabel={t.generations.cta}
          />

          <div
            role="group"
            aria-label={t.generations.title}
            className="mt-3 grid grid-cols-3 gap-2 min-[480px]:grid-cols-5"
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={active === index}
                data-active={active === index}
                className={`border-t pt-2 text-left transition-colors ${
                  index === currentIndex
                    ? 'border-cyan-500/70 dark:border-cyan-400/70'
                    : 'border-zinc-200 dark:border-zinc-800'
                } ${
                  active === index
                    ? 'text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-500 dark:text-zinc-500'
                }`}
                onClick={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
              >
                <p className="font-mono text-[10px] tracking-[0.1em]">{item.id}</p>
                <p className="mt-0.5 text-[10px] leading-4">{item.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
