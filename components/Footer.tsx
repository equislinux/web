import { GITHUB_ORG } from '@/lib/site';
import { UI, type Lang } from '@/lib/i18n';

export default function Footer({ lang }: { lang: Lang }) {
  const t = UI[lang];

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-10 text-sm text-zinc-500 sm:flex-row dark:text-zinc-500">
        <p>{t.footer.tagline}</p>
        <p>
          <a
            href={GITHUB_ORG}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            github.com/equislinux
          </a>
          <span className="mx-2">·</span>
          {t.footer.license}
        </p>
      </div>
    </footer>
  );
}
