import { REPOS } from '@/lib/site';
import { UI, type Lang } from '@/lib/i18n';

export default function RepoGrid({ lang }: { lang: Lang }) {
  const t = UI[lang];

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t.landing.reposTitle}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {t.landing.reposSubtitle}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {REPOS.map((repo) => (
          <a
            key={repo.name}
            href={repo.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start justify-between gap-4 rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/40"
          >
            <div>
              <p className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {repo.name}
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {repo.description[lang]}
              </p>
            </div>
            <svg
              className="mt-1 h-4 w-4 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}
