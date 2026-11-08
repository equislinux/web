import Link from 'next/link';
import SystemOrbitStage from './three/SystemOrbitStage';
import { UI, type Lang } from '@/lib/i18n';

export default function SystemMap({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const scene = t.scene.hero;

  return (
    <section className="mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            {scene.kicker}
          </p>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {scene.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {scene.subtitle}
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {scene.body}
          </p>
          <Link
            href={`/${lang}/docs`}
            className="mt-5 inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
          >
            {t.hero.ctaDocs}
          </Link>
        </div>

        <div className="lg:col-span-8">
          <SystemOrbitStage
            variant="hero"
            kicker={scene.kicker}
            hint={scene.hint}
            center={scene.center}
            nodes={scene.nodes}
            controlsLabel={t.scene.controlsLabel}
            ariaLabel={`${scene.kicker} — ${scene.center.label}`}
            lang={lang}
            readMore={t.hero.ctaDocs}
          />
        </div>
      </div>
    </section>
  );
}
