export type Lang = 'en' | 'es';

export const LANGS: Lang[] = ['en', 'es'];

export function isLang(value: string): value is Lang {
  return value === 'en' || value === 'es';
}

export interface UIStrings {
  nav: {
    home: string;
    docs: string;
    github: string;
    language: string;
  };
  hero: {
    title: string;
    tagline: string;
    ctaDownload: string;
    ctaDocs: string;
    ctaGithub: string;
  };
  downloads: {
    title: string;
    iso: string;
    wsl: string;
    isoDetail: string;
    wslDetail: string;
  };
  showcase: {
    title: string;
    subtitle: string;
    captionDesktop: string;
    captionDemo: string;
    captionTools: string;
    captionBoot: string;
    captionInstaller: string;
  };
  features: {
    title: string;
    subtitle: string;
    generationsTitle: string;
    generationsDesc: string;
    installerTitle: string;
    installerDesc: string;
    kernelsTitle: string;
    kernelsDesc: string;
    toolingTitle: string;
    toolingDesc: string;
    wslTitle: string;
    wslDesc: string;
    themesTitle: string;
    themesDesc: string;
  };
  install: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    guideCta: string;
  };
  landing: {
    reposTitle: string;
    reposSubtitle: string;
    pathsTitle: string;
    pathsSubtitle: string;
    pacmanTitle: string;
    pacmanDescription: string;
    nativeTitle: string;
    nativeDescription: string;
    docsTitle: string;
    docsDescription: string;
    docsCta: string;
  };
  docs: {
    title: string;
    subtitle: string;
    overview: string;
    pages: string;
    edit: string;
    menu: string;
  };
  footer: {
    tagline: string;
    license: string;
  };
}

export const UI: Record<Lang, UIStrings> = {
  en: {
    nav: {
      home: 'Home',
      docs: 'Docs',
      github: 'GitHub',
      language: 'Language',
    },
    hero: {
      title: 'Documentation & tools',
      tagline:
        'A minimal Arch-based distribution, its tooling and its documentation — all in one place.',
      ctaDownload: 'Download ISO',
      ctaDocs: 'Read the docs',
      ctaGithub: 'GitHub',
    },
    downloads: {
      title: 'Downloads',
      iso: 'Download ISO',
      wsl: 'Download for WSL',
      isoDetail: 'Live ISO · x86_64',
      wslDetail: 'WSL rootfs',
    },
    showcase: {
      title: 'A look at X',
      subtitle:
        'Screenshots from a running install — desktop, tools and the boot menu.',
      captionDesktop: 'Hyprland desktop (equisdots) — light and dark themes.',
      captionDemo: 'Desktop demo: xtop and xfetch on Hyprland.',
      captionTools: 'xtop and xfetch — the X tools, written in Rust.',
      captionBoot:
        'Boot menu: every package transaction becomes a bootable generation.',
      captionInstaller: 'Text installer: btrfs subvolumes and keyring setup.',
    },
    features: {
      title: 'Why X',
      subtitle: 'What you get on top of a stock Arch base.',
      generationsTitle: 'Bootable generations',
      generationsDesc:
        'Every package transaction is captured as a btrfs snapshot with its own boot entry. Roll back, diff, verify, pin or export signed and encrypted bundles.',
      installerTitle: 'Script-driven installer',
      installerDesc:
        'BIOS or UEFI, GRUB or systemd-boot, LUKS, dualboot, and core or full (Hyprland) profiles — all in the terminal.',
      kernelsTitle: 'Multi-kernel',
      kernelsDesc:
        'Choose linux, linux-lts or linux-zen at install time or later with x kernel install and remove, protected by guard rails.',
      toolingTitle: 'Native tooling',
      toolingDesc:
        'xpm (package manager) and xpkg (builder) drive the signed [x] repository through a native .xp endpoint — built in Rust.',
      wslTitle: 'Runs on WSL',
      wslDesc:
        'An importable rootfs plus a friendly first-run setup for terminal-only use on Windows.',
      themesTitle: 'Curated desktop',
      themesDesc:
        'The equisdots Hyprland setup with light and dark themes, applied by the provisioning payload.',
    },
    install: {
      title: 'Install in three steps',
      subtitle: 'From ISO to first boot — the installer runs in the terminal.',
      step1Title: 'Download the ISO',
      step1Desc:
        'Get the latest signed ISO from SourceForge — the stable link always points to the current release.',
      step2Title: 'Flash a USB drive',
      step2Desc: 'Replace /dev/sdX with your device:',
      step3Title: 'Boot and follow the installer',
      step3Desc:
        'Pick disk layout, kernel and profile; the first generation is created for you.',
      guideCta: 'Read the install guide',
    },
    landing: {
      reposTitle: 'Repositories',
      reposSubtitle:
        'Every component of the X Linux project lives in the equislinux organization.',
      pathsTitle: 'Two packaging paths',
      pathsSubtitle:
        'X uses Arch-compatible packages for pacman and its own native format for xpm.',
      pacmanTitle: 'pacman · [x] repository',
      pacmanDescription:
        'Arch-compatible .pkg.tar.zst packages served from x-repo. Add the [x] repository to pacman.conf and install with pacman -S.',
      nativeTitle: 'xpm · native .xp',
      nativeDescription:
        'Native packages built by xpkg from XBUILD recipes and installed with xpm. The endpoint lives under x-repo/x/x86_64.',
      docsTitle: 'Documentation',
      docsDescription:
        'Guides for the distro, WSL, provisioning, packaging and the package repository — in English and Spanish.',
      docsCta: 'Browse documentation',
    },
    docs: {
      title: 'Documentation',
      subtitle: 'Guides for every repository of the X Linux project.',
      overview: 'Overview',
      pages: 'pages',
      edit: 'Edit this page on GitHub',
      menu: 'Documentation menu',
    },
    footer: {
      tagline: 'X Linux — minimal, powerful, yours.',
      license: 'GPL-3.0 · Built with Next.js',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      docs: 'Docs',
      github: 'GitHub',
      language: 'Idioma',
    },
    hero: {
      title: 'Documentación y herramientas',
      tagline:
        'Una distribución minimalista basada en Arch, su tooling y su documentación — todo en un solo lugar.',
      ctaDownload: 'Descargar ISO',
      ctaDocs: 'Leer la documentación',
      ctaGithub: 'GitHub',
    },
    downloads: {
      title: 'Descargas',
      iso: 'Descargar ISO',
      wsl: 'Descargar para WSL',
      isoDetail: 'ISO en vivo · x86_64',
      wslDetail: 'rootfs para WSL',
    },
    showcase: {
      title: 'Así se ve X',
      subtitle:
        'Capturas de un sistema real — escritorio, herramientas y menú de arranque.',
      captionDesktop: 'Escritorio Hyprland (equisdots) — temas claro y oscuro.',
      captionDemo: 'Demo del escritorio: xtop y xfetch sobre Hyprland.',
      captionTools: 'xtop y xfetch — las herramientas de X, escritas en Rust.',
      captionBoot:
        'Menú de arranque: cada transacción se convierte en una generación booteable.',
      captionInstaller:
        'Instalador de texto: subvolúmenes btrfs y configuración de keyring.',
    },
    features: {
      title: 'Por qué X',
      subtitle: 'Lo que obtienes sobre una base Arch estándar.',
      generationsTitle: 'Generaciones booteables',
      generationsDesc:
        'Cada transacción de paquetes se captura como un snapshot btrfs con su propia entrada de arranque. Rollback, diff, verify, pin y bundles firmados y cifrados.',
      installerTitle: 'Instalador por scripts',
      installerDesc:
        'BIOS o UEFI, GRUB o systemd-boot, LUKS, dualboot y perfiles core o full (Hyprland) — todo en la terminal.',
      kernelsTitle: 'Multi-kernel',
      kernelsDesc:
        'Elige linux, linux-lts o linux-zen al instalar o después con x kernel install/remove, con protecciones.',
      toolingTitle: 'Tooling nativo',
      toolingDesc:
        'xpm (gestor de paquetes) y xpkg (builder) mueven el repositorio firmado [x] a través de un endpoint .xp nativo — en Rust.',
      wslTitle: 'Corre en WSL',
      wslDesc:
        'Un rootfs importable y un primer arranque amigable para usar solo terminal en Windows.',
      themesTitle: 'Escritorio curado',
      themesDesc:
        'La configuración Hyprland de equisdots con temas claro y oscuro, aplicada por el payload de aprovisionamiento.',
    },
    install: {
      title: 'Instala en tres pasos',
      subtitle: 'Del ISO al primer arranque — el instalador corre en la terminal.',
      step1Title: 'Descarga el ISO',
      step1Desc:
        'Baja el último ISO firmado desde SourceForge — el enlace estable siempre apunta al release actual.',
      step2Title: 'Graba un USB',
      step2Desc: 'Sustituye /dev/sdX por tu dispositivo:',
      step3Title: 'Arranca y sigue el instalador',
      step3Desc:
        'Elige el esquema de disco, kernel y perfil; la primera generación se crea sola.',
      guideCta: 'Leer la guía de instalación',
    },
    landing: {
      reposTitle: 'Repositorios',
      reposSubtitle:
        'Cada componente del proyecto X Linux vive en la organización equislinux.',
      pathsTitle: 'Dos vías de empaquetado',
      pathsSubtitle:
        'X usa paquetes compatibles con Arch para pacman y su propio formato nativo para xpm.',
      pacmanTitle: 'pacman · repositorio [x]',
      pacmanDescription:
        'Paquetes .pkg.tar.zst compatibles con Arch servidos desde x-repo. Agrega el repositorio [x] a pacman.conf e instala con pacman -S.',
      nativeTitle: 'xpm · .xp nativo',
      nativeDescription:
        'Paquetes nativos construidos por xpkg desde recetas XBUILD e instalados con xpm. El endpoint vive en x-repo/x/x86_64.',
      docsTitle: 'Documentación',
      docsDescription:
        'Guías de la distro, WSL, aprovisionamiento, empaquetado y el repositorio de paquetes — en inglés y español.',
      docsCta: 'Ver documentación',
    },
    docs: {
      title: 'Documentación',
      subtitle: 'Guías de todos los repositorios del proyecto X Linux.',
      overview: 'Resumen',
      pages: 'páginas',
      edit: 'Editar esta página en GitHub',
      menu: 'Menú de documentación',
    },
    footer: {
      tagline: 'X Linux — minimal, powerful, yours.',
      license: 'GPL-3.0 · Hecho con Next.js',
    },
  },
};
