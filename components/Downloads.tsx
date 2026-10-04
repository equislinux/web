import { UI, type Lang } from '@/lib/i18n';
import releases from '@/data/releases.json';

interface Asset {
  name: string;
  url: string;
  size?: number;
  sha256?: string;
  sig?: string;
  checksums?: string;
}

interface Release {
  version: string;
  date: string;
  iso: Asset;
  wsl?: Pick<Asset, 'name' | 'url'>;
}

const DATA = releases as { schema: number; releases: Release[] };

function formatSize(bytes?: number): string {
  if (!bytes || !Number.isFinite(bytes) || bytes <= 0) {
    return '';
  }
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) {
    return `${gb.toFixed(2)} GB`;
  }
  return `${Math.round(bytes / 1024 ** 2)} MB`;
}

export default function Downloads({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const release = DATA.releases[0];

  if (!release) {
    return null;
  }

  const { iso, wsl } = release;
  const isoMeta = [iso.name, formatSize(iso.size)].filter(Boolean).join(' · ');

  const items = [
    {
      key: 'iso',
      label: t.downloads.iso,
      href: iso.url,
      meta: isoMeta,
      primary: true,
    },
    ...(wsl
      ? [
          {
            key: 'wsl',
            label: t.downloads.wsl,
            href: wsl.url,
            meta: wsl.name,
            primary: false,
          },
        ]
      : []),
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16">
      <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
        {t.downloads.title}
      </p>
      <div className="mx-auto mt-5 grid max-w-2xl gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const primary = item.primary;
          return (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={
                primary
                  ? 'group flex items-center justify-between gap-4 rounded-xl border border-zinc-900 bg-zinc-900 p-4 text-white transition-colors hover:bg-zinc-700 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200'
                  : 'group flex items-center justify-between gap-4 rounded-xl border border-zinc-200 p-4 text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/40'
              }
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium">{item.label}</span>
                <span
                  className={
                    primary
                      ? 'mt-0.5 block truncate font-mono text-[11px] text-zinc-300 dark:text-zinc-600'
                      : 'mt-0.5 block truncate font-mono text-[11px] text-zinc-500 dark:text-zinc-400'
                  }
                >
                  {item.meta}
                </span>
              </span>
              <svg
                className={
                  primary
                    ? 'h-4 w-4 shrink-0 transition-transform group-hover:translate-y-0.5'
                    : 'h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-y-0.5 dark:text-zinc-500'
                }
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
              </svg>
            </a>
          );
        })}
      </div>
      {iso.sha256 && (
        <p className="mt-4 text-center font-mono text-[10px] text-zinc-400 dark:text-zinc-600">
          SHA-256 {iso.sha256.slice(0, 16)}…{' '}
          {iso.checksums && (
            <a
              href={iso.checksums}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-400"
            >
              SHA256SUMS
            </a>
          )}
          {iso.sig && (
            <>
              {' · '}
              <a
                href={iso.sig}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-400"
              >
                .sig
              </a>
            </>
          )}
        </p>
      )}
    </section>
  );
}
