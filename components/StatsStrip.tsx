import { UI, type Lang } from '@/lib/i18n';

export default function StatsStrip({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const items = [
    { value: '06', label: t.stats.layers },
    { value: '04', label: t.stats.desktops },
    { value: '02', label: t.stats.boot },
    { value: '01', label: t.stats.repo },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-2 border-y border-zinc-200 dark:border-zinc-800 sm:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`border-zinc-200 px-4 py-6 dark:border-zinc-800 ${
              index < 2 ? 'border-b sm:border-b-0' : ''
            } ${index % 2 === 1 ? 'border-l' : ''} ${index === 0 ? '' : 'sm:border-l'}`}
          >
            <p className="font-mono text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
              {item.value}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
