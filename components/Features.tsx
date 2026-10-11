import { UI, type Lang } from '@/lib/i18n';

export default function Features({ lang }: { lang: Lang }) {
  const t = UI[lang];

  const items = [
    { title: t.features.generationsTitle, desc: t.features.generationsDesc },
    { title: t.features.installerTitle, desc: t.features.installerDesc },
    { title: t.features.kernelsTitle, desc: t.features.kernelsDesc },
    { title: t.features.toolingTitle, desc: t.features.toolingDesc },
    { title: t.features.wslTitle, desc: t.features.wslDesc },
    { title: t.features.themesTitle, desc: t.features.themesDesc },
  ];

  return (
    <section className="mx-auto max-w-5xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t.features.title}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {t.features.subtitle}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((feature) => (
          <article
            key={feature.title}
            className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
          >
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {feature.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
