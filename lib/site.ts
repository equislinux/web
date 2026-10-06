import type { Lang } from './i18n';

export const GITHUB_ORG = 'https://github.com/equislinux';

export interface RepoInfo {
  name: string;
  href: string;
  description: Record<Lang, string>;
}

export const REPOS: RepoInfo[] = [
  {
    name: 'equislinux/x',
    href: `${GITHUB_ORG}/x`,
    description: {
      en: 'Arch-based distro: archiso profile, text installer and ISO build.',
      es: 'Distro basada en Arch: perfil archiso, instalador de texto y build del ISO.',
    },
  },
  {
    name: 'equislinux/wsl',
    href: `${GITHUB_ORG}/wsl`,
    description: {
      en: 'X Linux for WSL: importable rootfs and WSL configuration.',
      es: 'X Linux para WSL: rootfs importable y configuración de WSL.',
    },
  },
  {
    name: 'equislinux/wsl-scripts',
    href: `${GITHUB_ORG}/wsl-scripts`,
    description: {
      en: 'Friendly WSL user setup and provisioning.',
      es: 'Setup de usuario para WSL, simple y directo.',
    },
  },
  {
    name: 'equislinux/scripts',
    href: `${GITHUB_ORG}/scripts`,
    description: {
      en: 'Provisioning payload and CLI (x): phases, dotfiles, themes, migrations.',
      es: 'Payload de aprovisionamiento y CLI (x): fases, dotfiles, temas, migraciones.',
    },
  },
  {
    name: 'equislinux/xpm',
    href: `${GITHUB_ORG}/xpm`,
    description: {
      en: 'Rust package manager for x repositories (ALPM format).',
      es: 'Gestor de paquetes en Rust para repos x (formato ALPM).',
    },
  },
  {
    name: 'equislinux/xpkg',
    href: `${GITHUB_ORG}/xpkg`,
    description: {
      en: 'Rust package builder: XBUILD recipes to ALPM-compatible archives.',
      es: 'Builder de paquetes en Rust: recetas XBUILD a archivos compatibles con ALPM.',
    },
  },
  {
    name: 'equislinux/x-repo',
    href: `${GITHUB_ORG}/x-repo`,
    description: {
      en: 'Binary package repository ([x]) and package portal.',
      es: 'Repositorio binario de paquetes ([x]) y portal de paquetes.',
    },
  },
  {
    name: 'equislinux/wiki',
    href: `${GITHUB_ORG}/wiki`,
    description: {
      en: 'Documentation sources for every repository (English/Spanish).',
      es: 'Fuentes de documentación de todos los repos (inglés/español).',
    },
  },
  {
    name: 'equislinux/web',
    href: `${GITHUB_ORG}/web`,
    description: {
      en: 'This documentation portal: landing and browsable docs.',
      es: 'Este portal de documentación: landing y docs navegables.',
    },
  },
];
