import { SITE_BASE } from '@/lib/site';
import { UI, type Lang } from '@/lib/i18n';

export default function Showcase({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const img = (name: string) => `${SITE_BASE}/showcase/${name}`;

  const shots = [
    { file: 'demo.gif', caption: t.showcase.captionDemo },
    { file: 'tools.png', caption: t.showcase.captionTools },
    { file: 'boot-generations.png', caption: t.showcase.captionBoot },
    { file: 'installer.png', caption: t.showcase.captionInstaller },
  ];

  return (
    <section className="mx-auto max-w-5xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t.showcase.title}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {t.showcase.subtitle}
      </p>

      <figure className="mt-8">
        <img
          src={img('desktop-light.jpg')}
          alt="X Linux desktop (light theme)"
          className="block w-full rounded-xl border border-zinc-200 dark:hidden dark:border-zinc-800"
        />
        <img
          src={img('hero-desktop.jpg')}
          alt="X Linux desktop (dark theme)"
          className="hidden w-full rounded-xl border border-zinc-200 dark:block dark:border-zinc-800"
        />
        <figcaption className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {t.showcase.captionDesktop}
        </figcaption>
      </figure>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {shots.map((shot) => (
          <figure key={shot.file}>
            <img
              src={img(shot.file)}
              alt={shot.caption}
              loading="lazy"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800"
            />
            <figcaption className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
