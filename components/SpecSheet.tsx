import Link from 'next/link';
import { UI, type Lang } from '@/lib/i18n';

export default function SpecSheet({ lang }: { lang: Lang }) {
  const t = UI[lang];

  return (
    <section className="mx-auto max-w-5xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            {t.specs.eyebrow}
          </p>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.specs.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.specs.subtitle}
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {t.specs.body}
          </p>
          <Link
            href={`/${lang}/docs/x/project-layout`}
            className="mt-5 inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
          >
            {t.specs.cta}
          </Link>
        </div>

        <dl className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <span>X / SYSTEM</span>
            <span className="text-zinc-400 dark:text-zinc-600">INSPECTABLE</span>
          </div>
          {t.specs.items.map((item, index) => (
            <div
              key={item.label}
              className="grid grid-cols-[5.5rem_1fr] gap-4 border-t border-zinc-200 px-4 py-3 transition-colors first:border-t-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
            >
              <dt className="font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-zinc-500 dark:text-zinc-500">
                {String(index + 1).padStart(2, '0')} / {item.label}
              </dt>
              <dd className="font-mono text-[11px] leading-5 text-zinc-700 dark:text-zinc-300">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
