import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import Hero from './Hero';
import Downloads from './Downloads';
import Showcase from './Showcase';
import AsciiBand from './AsciiBand';
import Foundation from './Foundation';
import DesktopLayers from './DesktopLayers';
import Generations from './Generations';
import Features from './Features';
import StatsStrip from './StatsStrip';
import Install from './Install';
import RepoGrid from './RepoGrid';
import PackageChannels from './PackageChannels';
import { UI, type Lang } from '@/lib/i18n';

export default function Landing({ lang }: { lang: Lang }) {
  const t = UI[lang];

  return (
    <>
      <Navbar lang={lang} path="" />
      <main className="flex-1">
        <Hero lang={lang} />
        <Downloads lang={lang} />
        <Showcase lang={lang} />
        <AsciiBand lang={lang} />
        <Foundation lang={lang} />
        <DesktopLayers lang={lang} />
        <Generations lang={lang} />
        <Features lang={lang} />
        <StatsStrip lang={lang} />
        <Install lang={lang} />
        <RepoGrid lang={lang} />

        <PackageChannels lang={lang} />

        <section className="mx-auto max-w-6xl border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
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
