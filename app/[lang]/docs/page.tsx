import Link from 'next/link';
import { notFound } from 'next/navigation';
import DocsShell from '@/components/DocsShell';
import Markdown from '@/components/Markdown';
import { getOverview, getSections } from '@/lib/docs';
import { LANGS, UI, isLang } from '@/lib/i18n';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const title = lang === 'es' ? 'X Linux — Documentación' : 'X Linux — Documentation';
  return { title };
}

export default async function DocsHome({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const t = UI[lang];
  const sections = getSections(lang);
  const overview = getOverview(lang);

  return (
    <DocsShell lang={lang} path="/docs" sections={sections} activeSlug="">
      <Markdown markdown={overview} lang={lang} section="overview" />
      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`/${lang}/docs/${section.pages[0].slug}`}
            className="group rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/40"
          >
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {section.title[lang]}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {section.pages.length} {t.docs.pages}
            </p>
          </Link>
        ))}
      </div>
    </DocsShell>
  );
}
