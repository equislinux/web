import SystemOrbitStage from './three/SystemOrbitStage';
import { UI, type Lang } from '@/lib/i18n';

export default function PackageChannels({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const scene = t.scene.pipeline;
  const channels = [
    {
      key: 'pacman',
      title: t.landing.pacmanTitle,
      desc: t.landing.pacmanDescription,
      code: '[x]\nServer = https://equislinux.github.io/x-repo/repo/x86_64',
      mark: '[x]',
      sub: 'pacman',
      accent: '#5ad4e6',
    },
    {
      key: 'xpm',
      title: t.landing.nativeTitle,
      desc: t.landing.nativeDescription,
      code: '[[repo]]\nserver = ["https://equislinux.github.io/x-repo/x/$arch"]',
      mark: '.xp',
      sub: 'xpm',
      accent: '#948ae3',
    },
    {
      key: 'xpm-aur',
      title: t.landing.aurTitle,
      desc: t.landing.aurDescription,
      code: 'xpm-aur install <pkg>\nxpm-aur upgrade --aur --devel',
      mark: 'AUR',
      sub: 'xpm-aur',
      accent: '#fc618d',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t.landing.pathsTitle}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
        {t.landing.pathsSubtitle}
      </p>

      <div className="mt-8">
        <SystemOrbitStage
          variant="pipeline"
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

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {channels.map((channel) => (
          <article
            key={channel.key}
            className="min-w-0 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className="font-mono text-xs font-medium tracking-[0.12em] text-zinc-900 dark:text-zinc-100"
                style={{ color: channel.accent }}
              >
                {channel.mark}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                {channel.sub}
              </span>
            </div>
            <h3 className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {channel.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {channel.desc}
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <code>{channel.code}</code>
            </pre>
          </article>
        ))}
      </div>
    </section>
  );
}
