import type { CSSProperties } from 'react';
import { UI, type Lang } from '@/lib/i18n';

export default function PackageChannels({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const channels = [
    {
      key: 'pacman',
      title: t.landing.pacmanTitle,
      desc: t.landing.pacmanDescription,
      code: '[x]\nServer = https://equislinux.github.io/x-repo/repo/x86_64',
      mark: '[x]',
      sub: 'pacman',
      side: 'signed',
      top: 'x86_64',
      accent: '#5ad4e6',
    },
    {
      key: 'xpm',
      title: t.landing.nativeTitle,
      desc: t.landing.nativeDescription,
      code: '[[repo]]\nserver = ["https://equislinux.github.io/x-repo/x/$arch"]',
      mark: '.xp',
      sub: 'xpm',
      side: 'native',
      top: 'x86_64',
      accent: '#948ae3',
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

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {channels.map((channel) => (
          <article
            key={channel.key}
            className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <div
              className="x-pkg-scene"
              style={{ '--pkg-accent': channel.accent } as CSSProperties}
            >
              <div className="x-pkg-cube">
                <div className="x-pkg-face x-pkg-back" />
                <div className="x-pkg-face x-pkg-left" />
                <div className="x-pkg-face x-pkg-bottom" />
                <div className="x-pkg-face x-pkg-right">
                  <span className="x-pkg-tag">{channel.side}</span>
                </div>
                <div className="x-pkg-face x-pkg-top">
                  <span className="x-pkg-tag">{channel.top}</span>
                </div>
                <div className="x-pkg-face x-pkg-front">
                  <span className="x-pkg-mark">{channel.mark}</span>
                  <span className="x-pkg-sub">{channel.sub}</span>
                </div>
              </div>
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
