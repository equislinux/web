import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { GITHUB_ORG } from '@/lib/site';
import { UI, type Lang } from '@/lib/i18n';

export default function Navbar({ lang, path }: { lang: Lang; path: string }) {
  const t = UI[lang];
  const other: Lang = lang === 'en' ? 'es' : 'en';

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href={`/${lang}`}
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          X Linux
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href={`/${lang}`}
            className="rounded-md px-3 py-1.5 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t.nav.home}
          </Link>
          <Link
            href={`/${lang}/docs`}
            className="rounded-md px-3 py-1.5 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t.nav.docs}
          </Link>
          <a
            href={GITHUB_ORG}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-md px-3 py-1.5 text-zinc-500 transition-colors hover:text-zinc-900 sm:block dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t.nav.github}
          </a>
          <span className="mx-2 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <ThemeToggle />
          <Link
            href={`/${other}${path}`}
            aria-label={t.nav.language}
            className="rounded-md px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {other}
          </Link>
        </nav>
      </div>
    </header>
  );
}
