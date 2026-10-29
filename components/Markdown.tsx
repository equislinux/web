import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Lang } from '@/lib/i18n';

const CROSS_SECTIONS = new Set([
  'web',
  'x',
  'x-arm',
  'wsl',
  'wsl-scripts',
  'scripts',
  'xpm',
  'xpkg',
  'x-repo',
  'utils',
]);

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
  const suffix = hash ? `#${hash}` : '';

  if (!target.endsWith('.md')) {
    // Relative links to files outside the docs (config examples, source files)
    // point to the section repository on GitHub.
    if (target.startsWith('../../')) {
      return {
        href: `https://github.com/equislinux/${section}/blob/main/${target.replace(
          /^\.\.\/\.\.\//,
          ''
        )}`,
        external: true,
      };
    }
    return { href, external: false };
  }

  const noExt = target.replace(/\.md$/, '');

  // Language switcher links (../es/index.md, ../en/building.md) stay inside
  // the portal.
  const languageLink = noExt.match(/^\.\.\/(en|es)\/(.+)$/);
  if (languageLink) {
    const slug =
      languageLink[2] === 'index'
        ? section
        : `${section}/${languageLink[2]}`;
    return {
      href: `/${languageLink[1]}/docs/${slug}${suffix}`,
      external: false,
    };
  }

  // Cross-section links (../x/installer.md) resolve to the docs route.
  const crossSection = noExt.match(/^\.\.\/([^/]+)\/(.+)$/);
  if (crossSection && CROSS_SECTIONS.has(crossSection[1])) {
    const slug =
      crossSection[2] === 'index'
        ? crossSection[1]
        : `${crossSection[1]}/${crossSection[2]}`;
    return { href: `/${lang}/docs/${slug}${suffix}`, external: false };
  }

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
