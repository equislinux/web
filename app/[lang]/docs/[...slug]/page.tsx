import Link from 'next/link';
import { notFound } from 'next/navigation';
import DocsShell from '@/components/DocsShell';
import Markdown from '@/components/Markdown';
import {
  getPage,
  getSectionTitle,
  getSections,
  getStaticParams,
  getSourceUrl,
} from '@/lib/docs';
import { UI, isLang } from '@/lib/i18n';

export function generateStaticParams() {
  return getStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) {
    return {};
  }
  const page = getPage(lang, slug);
  return { title: page ? `${page.title} · X Linux` : 'X Linux' };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();

  const page = getPage(lang, slug);
  if (!page) notFound();

  const t = UI[lang];
  const sections = getSections(lang);

  return (
    <DocsShell
      lang={lang}
      path={`/docs/${slug.join('/')}`}
      sections={sections}
      activeSlug={slug.join('/')}
    >
      <p className="mb-8 text-xs text-zinc-400 dark:text-zinc-500">
        <Link
          href={`/${lang}/docs`}
          className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {t.docs.overview}
        </Link>
        <span className="mx-2">/</span>
        {getSectionTitle(page.section, lang)}
      </p>
      <Markdown markdown={page.markdown} lang={lang} section={page.section} />
      <p className="mt-12 border-t border-zinc-200 pt-6 text-sm dark:border-zinc-800">
        <a
          href={getSourceUrl(lang, page.section, page.file)}
          target="_blank"
          rel="noreferrer"
          className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {t.docs.edit}
        </a>
      </p>
    </DocsShell>
  );
}
