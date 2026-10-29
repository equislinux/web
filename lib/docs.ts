import fs from 'node:fs';
import path from 'node:path';
import { LANGS, type Lang } from './i18n';

export interface DocPage {
  file: string;
  slug: string;
  title: string;
}

export interface DocSection {
  id: string;
  title: Record<Lang, string>;
  pages: DocPage[];
}

interface SectionManifest {
  id: string;
  title: Record<Lang, string>;
  files: string[];
}

const SECTIONS: SectionManifest[] = [
  {
    id: 'web',
    title: { en: 'web — this portal', es: 'web — este portal' },
    files: ['overview'],
  },
  {
    id: 'x',
    title: { en: 'X Linux (distro)', es: 'X Linux (distro)' },
    files: ['index', 'building', 'installer', 'vm-testing', 'project-layout', 'generations'],
  },
  {
    id: 'x-arm',
    title: { en: 'x-arm — aarch64', es: 'x-arm — aarch64' },
    files: ['overview', 'build', 'vm', 'acceptance'],
  },
  {
    id: 'wsl',
    title: { en: 'X for WSL', es: 'X para WSL' },
    files: ['architecture', 'import'],
  },
  {
    id: 'wsl-scripts',
    title: { en: 'WSL scripts', es: 'Scripts de WSL' },
    files: ['usage', 'configuration', 'architecture'],
  },
  {
    id: 'scripts',
    title: { en: 'Scripts and CLI', es: 'Scripts y CLI' },
    files: ['overview', 'provisioning', 'generations', 'cli', 'hyprland', 'niri', 'layout', 'packaging'],
  },
  {
    id: 'xpm',
    title: { en: 'xpm — package manager', es: 'xpm — gestor de paquetes' },
    files: ['overview-and-status', 'usage', 'architecture', 'future-integration'],
  },
  {
    id: 'xpkg',
    title: { en: 'xpkg — package builder', es: 'xpkg — builder de paquetes' },
    files: ['01-overview-and-status', '02-usage', '03-architecture', '04-future-integration'],
  },
  {
    id: 'x-repo',
    title: { en: 'x-repo — package repository', es: 'x-repo — repositorio de paquetes' },
    files: ['overview', 'repo-layout', 'publishing', 'signing', 'web-portal', 'iso-releases'],
  },
  {
    id: 'utils',
    title: { en: 'utils — operator tools', es: 'utils — herramientas de operador' },
    files: ['overview', 'workspace-layout', 'cloning', 'sudo', 'keygen', 'restore'],
  },
];

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readMarkdown(...segments: string[]): string {
  return fs.readFileSync(path.join(CONTENT_DIR, ...segments), 'utf8');
}

function firstHeading(markdown: string, fallback: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function pageSlug(sectionId: string, file: string): string {
  return file === 'index' ? sectionId : `${sectionId}/${file}`;
}

export function getSections(lang: Lang): DocSection[] {
  return SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    pages: section.files.map((file) => {
      const markdown = readMarkdown(lang, section.id, `${file}.md`);
      return {
        file,
        slug: pageSlug(section.id, file),
        title: firstHeading(markdown, file),
      };
    }),
  }));
}

export function getOverview(lang: Lang): string {
  return readMarkdown(lang, 'overview.md');
}

export function getAllSlugs(): string[] {
  return SECTIONS.flatMap((section) =>
    section.files.map((file) => pageSlug(section.id, file))
  );
}

export function getPage(
  lang: Lang,
  slug: string[]
): { title: string; markdown: string; section: string; file: string } | null {
  const [section, fileParam] = slug;
  const file = fileParam ?? 'index';
  const entry = SECTIONS.find((candidate) => candidate.id === section);
  if (!entry || !entry.files.includes(file)) {
    return null;
  }
  const markdown = readMarkdown(lang, section, `${file}.md`);
  return { title: firstHeading(markdown, file), markdown, section, file };
}

export function getSectionTitle(sectionId: string, lang: Lang): string {
  const section = SECTIONS.find((candidate) => candidate.id === sectionId);
  return section ? section.title[lang] : sectionId;
}

export function getSourceUrl(
  lang: Lang,
  sectionId: string,
  file: string
): string {
  return `https://github.com/equislinux/web/blob/main/content/${lang}/${sectionId}/${file}.md`;
}

export function getStaticParams(): { lang: Lang; slug: string[] }[] {
  return LANGS.flatMap((lang) =>
    getAllSlugs().map((slug) => ({ lang, slug: slug.split('/') }))
  );
}
