import { UI, type Lang } from '@/lib/i18n';

export default function Features({ lang }: { lang: Lang }) {
  const t = UI[lang];

  const items = [
    { title: t.features.generationsTitle, desc: t.features.generationsDesc },
    { title: t.features.installerTitle, desc: t.features.installerDesc },
    { title: t.features.kernelsTitle, desc: t.features.kernelsDesc },
    { title: t.features.toolingTitle, desc: t.features.toolingDesc },
    { title: t.features.wslTitle, desc: t.features.wslDesc },
    { title: t.features.signedTitle, desc: t.features.signedDesc },
  ];

  return (
    <section className="mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t.features.title}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {t.features.subtitle}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((feature, index) => (
          <article
            key={feature.title}
            className="rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {feature.title}
              </h3>
              <span className="font-mono text-[10px] tracking-[0.12em] text-zinc-300 dark:text-zinc-700">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {feature.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
