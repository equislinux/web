import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import Hero from './Hero';
import Downloads from './Downloads';
import RepoGrid from './RepoGrid';
import { UI, type Lang } from '@/lib/i18n';

export default function Landing({ lang }: { lang: Lang }) {
  const t = UI[lang];

  return (
    <>
      <Navbar lang={lang} path="" />
      <main className="flex-1">
        <Hero lang={lang} />
        <Downloads lang={lang} />
        <RepoGrid lang={lang} />

        <section className="mx-auto max-w-5xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.landing.pathsTitle}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t.landing.pathsSubtitle}
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {t.landing.pacmanTitle}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {t.landing.pacmanDescription}
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <code>{`[x]\nServer = https://equislinux.github.io/x-repo/repo/x86_64`}</code>
              </pre>
            </article>
            <article className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {t.landing.nativeTitle}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {t.landing.nativeDescription}
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <code>{`[[repo]]\nserver = ["https://equislinux.github.io/x-repo/x/$arch"]`}</code>
              </pre>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-5xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
          <div className="rounded-2xl border border-zinc-200 p-10 text-center dark:border-zinc-800">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t.landing.docsTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {t.landing.docsDescription}
            </p>
            <Link
              href={`/${lang}/docs`}
              className="mt-6 inline-flex h-10 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {t.landing.docsCta}
            </Link>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
