import { SITE_BASE } from '@/lib/site';
import { UI, type Lang } from '@/lib/i18n';

export default function Showcase({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const img = (name: string) => `${SITE_BASE}/showcase/${name}`;
  const frame =
    'group relative aspect-[16/10] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900';

  const shots = [
    {
      file: 'demo.gif',
      caption: t.showcase.captionDemo,
      index: '02',
      className: 'md:col-span-2',
    },
    {
      file: 'tools.png',
      caption: t.showcase.captionTools,
      index: '03',
      className: 'md:col-span-2',
    },
    {
      file: 'boot-generations.png',
      caption: t.showcase.captionBoot,
      index: '04',
      className: 'md:col-span-3',
    },
    {
      file: 'installer.png',
      caption: t.showcase.captionInstaller,
      index: '05',
      className: 'md:col-span-3',
    },
  ];

  return (
    <section className="mx-auto max-w-5xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t.showcase.title}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
        {t.showcase.subtitle}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 md:auto-rows-[200px] md:grid-cols-6">
        <figure className={`${frame} md:col-span-4 md:row-span-2 md:aspect-auto`}>
          <img
            src={img('desktop-light.jpg')}
            alt="X Linux desktop (light theme)"
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03] dark:hidden"
          />
          <img
            src={img('hero-desktop.jpg')}
            alt="X Linux desktop (dark theme)"
            className="hidden h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03] dark:block"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-xs leading-5 text-white">
            <span>{t.showcase.captionDesktop}</span>
            <span className="font-mono text-[10px] text-white/60">01</span>
          </figcaption>
        </figure>

        {shots.map((shot) => (
          <figure
            key={shot.file}
            className={`${frame} ${shot.className} md:aspect-auto`}
          >
            <img
              src={img(shot.file)}
              alt={shot.caption}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-xs leading-5 text-white">
              <span>{shot.caption}</span>
              <span className="font-mono text-[10px] text-white/60">{shot.index}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
