import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Lang } from '@/lib/i18n';

function mapHref(
  href: string,
  lang: Lang,
  section: string
): { href: string; external: boolean } {
  if (href.startsWith('#')) {
    return { href, external: false };
  }
  if (href.startsWith('http') || href.startsWith('mailto:')) {
    return { href, external: true };
  }

  const [target, hash] = href.split('#');
  if (!target.endsWith('.md')) {
    return { href, external: false };
  }

  const suffix = hash ? `#${hash}` : '';
  const noExt = target.replace(/\.md$/, '');

  if (noExt.startsWith('../../')) {
    return {
      href: `https://github.com/equislinux/${section}/blob/main/${noExt.replace(
        /^\.\.\/\.\.\//,
        ''
      )}.md${suffix}`,
      external: true,
    };
  }
  if (noExt.startsWith('../')) {
    return {
      href: `https://github.com/equislinux/${section}/blob/main/docs/${noExt.replace(
        /^\.\.\//,
        ''
      )}.md${suffix}`,
      external: true,
    };
  }

  const bare = noExt.replace(/^\.\//, '');
  const slug = bare === 'index' ? section : `${section}/${bare}`;

  return {
    href: `/${lang}/docs/${slug}${suffix}`,
    external: false,
  };
}

export default function Markdown({
  markdown,
  lang,
  section,
}: {
  markdown: string;
  lang: Lang;
  section: string;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          const mapped = mapHref(href ?? '', lang, section);
          if (mapped.external) {
            return (
              <a href={mapped.href} target="_blank" rel="noreferrer">
                {children}
              </a>
            );
          }
          return <Link href={mapped.href}>{children}</Link>;
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
