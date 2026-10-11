import Link from 'next/link';
import { UI, type Lang } from '@/lib/i18n';

export default function Install({ lang }: { lang: Lang }) {
  const t = UI[lang];

  return (
    <section className="mx-auto max-w-5xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t.install.title}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {t.install.subtitle}
      </p>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            1 · {t.install.step1Title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {t.install.step1Desc}
          </p>
          <a
            href="/download/latest/"
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t.hero.ctaDownload}
          </a>
        </article>
        <article className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            2 · {t.install.step2Title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {t.install.step2Desc}
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <code>
              {'sudo dd if=x-<version>-x86_64.iso of=/dev/sdX bs=8M conv=fsync status=progress'}
            </code>
          </pre>
        </article>
        <article className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            3 · {t.install.step3Title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {t.install.step3Desc}
          </p>
          <Link
            href={`/${lang}/docs/x/installer`}
            className="mt-4 inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
          >
            {t.install.guideCta}
          </Link>
        </article>
      </div>
    </section>
  );
}
