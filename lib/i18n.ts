export type Lang = 'en' | 'es';

export const LANGS: Lang[] = ['en', 'es'];

export function isLang(value: string): value is Lang {
  return value === 'en' || value === 'es';
}

export interface SceneNode {
  id: string;
  label: string;
  meta: string;
  desc: string;
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
  scene: {
    controlsLabel: string;
    hero: {
      kicker: string;
      title: string;
      subtitle: string;
      body: string;
      hint: string;
      center: SceneNode;
      nodes: SceneNode[];
    };
    pipeline: {
      kicker: string;
      hint: string;
      center: SceneNode;
      nodes: SceneNode[];
    };
  };
  downloads: {
    title: string;
    iso: string;
    isoArm: string;
    wsl: string;
    isoDetail: string;
    wslDetail: string;
  };
  showcase: {
    title: string;
    subtitle: string;
    tabs: string[];
    prev: string;
    next: string;
    captionDesktop: string;
    captionDemo: string;
    captionTools: string;
    captionBoot: string;
    captionInstaller: string;
    captionDeploy: string;
    captionGen: string;
    captionReboot: string;
    captionStart: string;
    captionFirstView: string;
    captionXDots: string;
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
    signedTitle: string;
    signedDesc: string;
    themesTitle: string;
    themesDesc: string;
  };
  desktops: {
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    installNote: string;
    guideCta: string;
    caption: string;
    layersAlt: string;
    hyprland: string;
    hyprlandDesc: string;
    niri: string;
    niriDesc: string;
    kde: string;
    kdeDesc: string;
    console: string;
    consoleDesc: string;
    layersLabel: string;
    sceneHint: string;
    layers: { name: string; desc: string }[];
  };
  stats: {
    layers: string;
    desktops: string;
    boot: string;
    paths: string;
  };
  foundation: {
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    cta: string;
    items: { label: string; value: string }[];
  };
  generations: {
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    cta: string;
    sceneKicker: string;
    sceneHint: string;
    sceneCurrent: string;
    sceneRollback: string;
    sceneNote: string;
    items: { id: string; label: string }[];
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
    step4Title: string;
    step4Desc: string;
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
    aurTitle: string;
    aurDescription: string;
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
        'Arch-based, snapshot-first Linux with a script-driven installer and its own package tooling — docs and downloads in one place.',
      ctaDownload: 'Download ISO',
      ctaDocs: 'Read the docs',
      ctaGithub: 'GitHub',
    },
    scene: {
      controlsLabel: 'System components',
      hero: {
        kicker: 'X / SYSTEM MAP',
        title: 'The system, in one map',
        subtitle: 'Packages, repository and delivery around one core.',
        body: 'xpm, xpm-aur, xpkg and the signed [x] repository are one graph: build native or Arch-compatible packages, pull from the AUR and install everything through the same transaction model.',
        hint: 'Drag to orbit · hover a node',
        center: {
          id: 'x',
          label: 'X Linux',
          meta: 'Arch-based · snapshot-first',
          desc: 'A snapshot-first Arch base with its own installer, package tooling and signed delivery.',
        },
        nodes: [
          {
            id: 'xpkg',
            label: 'xpkg',
            meta: 'builder',
            desc: 'Reads XBUILD or PKGBUILD recipes, builds in isolation and emits .xp packages.',
          },
          {
            id: 'xpm',
            label: 'xpm',
            meta: 'manager',
            desc: 'Native Rust package manager: SAT resolver, .xp and ALPM, signed repositories.',
          },
          {
            id: 'xpm-aur',
            label: 'xpm-aur',
            meta: 'AUR',
            desc: 'Resolves AUR dependencies, builds with makepkg and installs every transaction through xpm.',
          },
          {
            id: 'repo',
            label: '[x]',
            meta: 'signed repo',
            desc: 'Signed x86_64 and aarch64 packages, database and native .xp endpoint.',
          },
          {
            id: 'pacman',
            label: 'pacman',
            meta: 'ALPM',
            desc: 'Arch-compatible packages from [x]; the stable path used by the installer.',
          },
          {
            id: 'iso',
            label: 'ISO',
            meta: 'installer',
            desc: 'Text installer, btrfs generations, four desktop choices and signed artifacts.',
          },
        ],
      },
      pipeline: {
        kicker: 'X / PACKAGE GRAPH',
        hint: 'Drag to orbit · hover a stage',
        center: {
          id: 'packages',
          label: 'X / packages',
          meta: 'one graph · three entry points',
          desc: 'AUR, native and Arch-compatible packages converge on the same signed repository and transaction model.',
        },
        nodes: [
          {
            id: 'xpkg',
            label: 'xpkg',
            meta: 'build',
            desc: 'Turns XBUILD and PKGBUILD recipes into .xp packages; lint, sign and repo-add included.',
          },
          {
            id: 'xpm',
            label: 'xpm',
            meta: 'install',
            desc: 'Owns installs, removals, upgrades and the package database for native and ALPM packages.',
          },
          {
            id: 'xpm-aur',
            label: 'xpm-aur',
            meta: 'AUR',
            desc: 'Builds AUR packages with makepkg in clean chroots and hands the transaction to xpm.',
          },
          {
            id: 'repo',
            label: '[x]',
            meta: 'publish',
            desc: 'Signed ALPM database plus the native .xp endpoint, served from x-repo.',
          },
        ],
      },
    },
    downloads: {
      title: 'Downloads',
      iso: 'Download ISO',
      isoArm: 'Download ISO · aarch64',
      wsl: 'Download for WSL',
      isoDetail: 'Live ISO · x86_64',
      wslDetail: 'WSL rootfs',
    },
    showcase: {
      title: 'A look at X',
      subtitle:
        'Real screens from an X install — desktop, tools, boot and installer.',
      tabs: [
        'Desktop',
        'Demo',
        'Tools',
        'Boot',
        'Installer',
        'Deploy X',
        'x-gen',
        'Reboot',
        'Start X',
        'First view',
        'X × dots',
      ],
      prev: 'Previous',
      next: 'Next',
      captionDesktop: 'Hyprland desktop (equisdots) — light and dark themes.',
      captionDemo: 'Desktop demo: xtop and xfetch on Hyprland.',
      captionTools: 'xtop and xfetch — the X tools, written in Rust.',
      captionBoot:
        'Boot menu: every package transaction becomes a bootable generation.',
      captionInstaller: 'Text installer: btrfs subvolumes and keyring setup.',
      captionDeploy: 'Deploy X — the target system being provisioned.',
      captionGen: 'x-gen — bootable generations from the terminal.',
      captionReboot: 'Reboot menu — choose the generation to boot.',
      captionStart: 'Start X — SDDM login with the Hyprland session selected.',
      captionFirstView: 'First view — the X desktop after the first login.',
      captionXDots: 'X × dots — equisdots settings on X.',
    },
    features: {
      title: 'Why X',
      subtitle: 'What you get on top of a stock Arch base.',
      generationsTitle: 'Bootable generations',
      generationsDesc:
        'Every package transaction is captured as a btrfs snapshot with its own boot entry. Roll back, diff, verify, pin or export signed and encrypted bundles.',
      installerTitle: 'Script-driven installer',
      installerDesc:
        'BIOS or UEFI, GRUB or systemd-boot, LUKS, dualboot, core or full profiles, and Hyprland, niri or KDE Plasma as the desktop — all in the terminal.',
      kernelsTitle: 'Multi-kernel',
      kernelsDesc:
        'Choose linux, linux-lts or linux-zen at install time or later with x kernel install and remove, protected by guard rails.',
      toolingTitle: 'Native tooling',
      toolingDesc:
        'xpm (manager), xpm-aur (AUR helper) and xpkg (builder) drive the signed [x] repository through native .xp and ALPM packages — built in Rust.',
      wslTitle: 'Runs on WSL',
      wslDesc:
        'An importable rootfs plus a friendly first-run setup for terminal-only use on Windows.',
      signedTitle: 'Signed end to end',
      signedDesc:
        'The ISO, checksums and [x] packages are signed; the installed system trusts the embedded keyring.',
      themesTitle: 'Curated desktops',
      themesDesc:
        'Choose the equisdots Hyprland or niri stack, or KDE Plasma with X branding; the installer applies the desktop during install.',
    },
    desktops: {
      eyebrow: 'Anatomy',
      title: 'Built-in desktops',
      subtitle: 'One system, four ways to land.',
      body:
        'Hyprland and niri ship the equisdots stack; KDE Plasma gets X Dark branding. They all sit on the same Arch base, generations, signed packages and X tooling.',
      installNote:
        'Choose the desktop in the text installer. The rest of the system stays the same.',
      guideCta: 'See the desktop guide',
      caption:
        'The X layer stack — the desktop is a choice at install time, not a fork.',
      layersAlt:
        'Isometric illustration of the six X Linux layers: Arch base, X system, generations, desktop choices, shell and apps, and signed delivery.',
      hyprland: 'Hyprland',
      hyprlandDesc: 'equisdots · Lua · light/dark',
      niri: 'niri',
      niriDesc: 'equisdots · scrollable tiling',
      kde: 'KDE Plasma',
      kdeDesc: 'X Dark · Plasma 6',
      console: 'Console',
      consoleDesc: 'no desktop · minimal',
      layersLabel: 'System layers',
      sceneHint: 'Move the pointer to orbit · hover a layer',
      layers: [
        { name: 'Arch base', desc: 'kernel · systemd · pacman' },
        { name: 'X system', desc: 'installer · x-scripts · keyring' },
        { name: 'Generations', desc: 'btrfs · snapshots · rollback' },
        { name: 'Desktop', desc: 'Hyprland · niri · KDE Plasma' },
        { name: 'Shell & apps', desc: 'Quickshell · equisdots · X tools' },
        { name: 'Delivery', desc: 'signed ISO · [x] repo · branding' },
      ],
    },
    stats: {
      layers: 'system layers',
      desktops: 'desktop choices',
      boot: 'boot modes',
      paths: 'package paths',
    },
    foundation: {
      eyebrow: 'Foundation',
      title: 'Arch, without the mystery',
      subtitle: 'A familiar base, extended with intent.',
      body:
        'Kernel, systemd and pacman stay where you expect them. X adds the text installer, btrfs generations, signed packages and a desktop layer you can replace.',
      cta: 'See the project layout',
      items: [
        { label: 'Kernel', value: 'linux · linux-lts · linux-zen' },
        { label: 'Init', value: 'systemd · journald · logind' },
        { label: 'Packages', value: 'pacman · [x] · keyring' },
        { label: 'Filesystem', value: 'btrfs · subvolumes · snapshots' },
      ],
    },
    generations: {
      eyebrow: 'Generations',
      title: 'Rollback is a layer',
      subtitle: 'Every transaction leaves a bootable snapshot.',
      body:
        'x gen records packages, services, the kernel and /etc as a generation. Boot it, diff it, pin it or restore a single path.',
      cta: 'Read the generations',
      sceneKicker: 'X / GENERATIONS',
      sceneHint: 'Drag to orbit · select a generation',
      sceneCurrent: 'Current generation',
      sceneRollback: 'Rollback target',
      sceneNote:
        'Newer generations stay in /.snapshots; boot or restore with x gen.',
      items: [
        { id: '0001', label: 'first install' },
        { id: '0002', label: 'pre-update' },
        { id: '0003', label: 'kernel change' },
        { id: '0004', label: 'desktop layer' },
        { id: '0005', label: 'current' },
      ],
    },
    install: {
      title: 'Install in four steps',
      subtitle: 'From ISO to the first bootable generation — the installer runs in the terminal.',
      step1Title: 'Download the ISO',
      step1Desc:
        'Get the latest signed ISO from SourceForge — the stable link always points to the current release.',
      step2Title: 'Flash a USB drive',
      step2Desc: 'Replace /dev/sdX with your device:',
      step3Title: 'Boot and follow the installer',
      step3Desc:
        'Pick disk layout, kernel, desktop and profile; the first generation is created for you.',
      step4Title: 'Boot generation 0001',
      step4Desc:
        'Reboot into the first btrfs snapshot. Roll back, diff or pin it whenever you need.',
      guideCta: 'Read the install guide',
    },
    landing: {
      reposTitle: 'Repositories',
      reposSubtitle:
        'Every component of the X Linux project lives in the equislinux organization.',
      pathsTitle: 'Three packaging paths',
      pathsSubtitle:
        'X combines Arch-compatible packages for pacman, its own native format for xpm, and an AUR helper that routes every transaction through xpm.',
      pacmanTitle: 'pacman · [x] repository',
      pacmanDescription:
        'Arch-compatible .pkg.tar.zst packages served from x-repo. Add the [x] repository to pacman.conf and install with pacman -S.',
      nativeTitle: 'xpm · native .xp',
      nativeDescription:
        'Native packages built by xpkg from XBUILD recipes and installed with xpm. The endpoint lives under x-repo/x/x86_64.',
      aurTitle: 'xpm-aur · AUR',
      aurDescription:
        'A Rust AUR helper: resolves dependencies, builds with makepkg in clean chroots and installs or removes everything through xpm.',
      docsTitle: 'Documentation',
      docsDescription:
        'Guides for the distro, WSL, provisioning, packaging and the package repository — in English and Spanish.',
      docsCta: 'Browse documentation',
    },
    docs: {
      title: 'Documentation',
      subtitle: 'Guides for every published repository of the X Linux project.',
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
        'Linux basado en Arch y centrado en snapshots, con instalador por scripts y tooling de paquetes propio — docs y descargas en un solo lugar.',
      ctaDownload: 'Descargar ISO',
      ctaDocs: 'Leer la documentación',
      ctaGithub: 'GitHub',
    },
    scene: {
      controlsLabel: 'Componentes del sistema',
      hero: {
        kicker: 'X / MAPA DEL SISTEMA',
        title: 'El sistema, en un solo mapa',
        subtitle: 'Paquetes, repositorio y entrega alrededor de un núcleo.',
        body: 'xpm, xpm-aur, xpkg y el repositorio firmado [x] forman un solo grafo: construye paquetes nativos o compatibles con Arch, tira del AUR e instala todo con el mismo modelo de transacción.',
        hint: 'Arrastra para orbitar · pasa por un nodo',
        center: {
          id: 'x',
          label: 'X Linux',
          meta: 'base Arch · snapshots primero',
          desc: 'Una base Arch centrada en snapshots, con instalador, tooling de paquetes y entrega firmada propios.',
        },
        nodes: [
          {
            id: 'xpkg',
            label: 'xpkg',
            meta: 'builder',
            desc: 'Lee recetas XBUILD o PKGBUILD, compila aislado y produce paquetes .xp.',
          },
          {
            id: 'xpm',
            label: 'xpm',
            meta: 'gestor',
            desc: 'Gestor de paquetes en Rust: resolver SAT, .xp y ALPM, repositorios firmados.',
          },
          {
            id: 'xpm-aur',
            label: 'xpm-aur',
            meta: 'AUR',
            desc: 'Resuelve dependencias de AUR, compila con makepkg e instala cada transacción con xpm.',
          },
          {
            id: 'repo',
            label: '[x]',
            meta: 'repo firmado',
            desc: 'Paquetes x86_64 y aarch64 firmados, base de datos y endpoint nativo .xp.',
          },
          {
            id: 'pacman',
            label: 'pacman',
            meta: 'ALPM',
            desc: 'Paquetes compatibles con Arch desde [x]; la vía estable que usa el instalador.',
          },
          {
            id: 'iso',
            label: 'ISO',
            meta: 'instalador',
            desc: 'Instalador de texto, generaciones btrfs, cuatro escritorios y artefactos firmados.',
          },
        ],
      },
      pipeline: {
        kicker: 'X / GRAFO DE PAQUETES',
        hint: 'Arrastra para orbitar · pasa por una etapa',
        center: {
          id: 'packages',
          label: 'X / paquetes',
          meta: 'un grafo · tres entradas',
          desc: 'Los paquetes de AUR, nativos y compatibles con Arch confluyen en el mismo repositorio firmado y modelo de transacción.',
        },
        nodes: [
          {
            id: 'xpkg',
            label: 'xpkg',
            meta: 'build',
            desc: 'Convierte recetas XBUILD y PKGBUILD en paquetes .xp; lint, firma y repo-add incluidos.',
          },
          {
            id: 'xpm',
            label: 'xpm',
            meta: 'install',
            desc: 'Gestiona instalaciones, borrados, upgrades y la base de datos para paquetes nativos y ALPM.',
          },
          {
            id: 'xpm-aur',
            label: 'xpm-aur',
            meta: 'AUR',
            desc: 'Compila paquetes de AUR con makepkg en chroots limpios y entrega la transacción a xpm.',
          },
          {
            id: 'repo',
            label: '[x]',
            meta: 'publish',
            desc: 'Base de datos ALPM firmada más el endpoint nativo .xp, servidos desde x-repo.',
          },
        ],
      },
    },
    downloads: {
      title: 'Descargas',
      iso: 'Descargar ISO',
      isoArm: 'Descargar ISO · aarch64',
      wsl: 'Descargar para WSL',
      isoDetail: 'ISO en vivo · x86_64',
      wslDetail: 'rootfs para WSL',
    },
    showcase: {
      title: 'Así se ve X',
      subtitle:
        'Capturas reales de una instalación X — escritorio, herramientas, arranque e instalador.',
      tabs: [
        'Escritorio',
        'Demo',
        'Herramientas',
        'Arranque',
        'Instalador',
        'Despliegue X',
        'x-gen',
        'Reinicio',
        'Iniciar X',
        'Primera vista',
        'X × dots',
      ],
      prev: 'Anterior',
      next: 'Siguiente',
      captionDesktop: 'Escritorio Hyprland (equisdots) — temas claro y oscuro.',
      captionDemo: 'Demo del escritorio: xtop y xfetch sobre Hyprland.',
      captionTools: 'xtop y xfetch — las herramientas de X, escritas en Rust.',
      captionBoot:
        'Menú de arranque: cada transacción se convierte en una generación booteable.',
      captionInstaller:
        'Instalador de texto: subvolúmenes btrfs y configuración de keyring.',
      captionDeploy: 'Despliegue X — el sistema destino siendo aprovisionado.',
      captionGen: 'x-gen — generaciones arrancables desde la terminal.',
      captionReboot: 'Menú de reinicio — elige la generación que quieres arrancar.',
      captionStart: 'Inicio de X — login SDDM con la sesión Hyprland seleccionada.',
      captionFirstView: 'Primera vista — el escritorio X tras el primer inicio.',
      captionXDots: 'X × dots — ajustes de equisdots en X.',
    },
    features: {
      title: 'Por qué X',
      subtitle: 'Lo que obtienes sobre una base Arch estándar.',
      generationsTitle: 'Generaciones booteables',
      generationsDesc:
        'Cada transacción de paquetes se captura como un snapshot btrfs con su propia entrada de arranque. Rollback, diff, verify, pin y bundles firmados y cifrados.',
      installerTitle: 'Instalador por scripts',
      installerDesc:
        'BIOS o UEFI, GRUB o systemd-boot, LUKS, dualboot, perfiles core o full y Hyprland, niri o KDE Plasma como escritorio — todo en la terminal.',
      kernelsTitle: 'Multi-kernel',
      kernelsDesc:
        'Elige linux, linux-lts o linux-zen al instalar o después con x kernel install/remove, con protecciones.',
      toolingTitle: 'Tooling nativo',
      toolingDesc:
        'xpm (gestor), xpm-aur (helper de AUR) y xpkg (builder) mueven el repositorio firmado [x] con paquetes .xp nativos y ALPM — en Rust.',
      wslTitle: 'Corre en WSL',
      wslDesc:
        'Un rootfs importable y un primer arranque amigable para usar solo terminal en Windows.',
      signedTitle: 'Firma de extremo a extremo',
      signedDesc:
        'El ISO, los checksums y los paquetes de [x] están firmados; el sistema instalado confía en el keyring incluido.',
      themesTitle: 'Escritorios curados',
      themesDesc:
        'Elige el stack Hyprland o niri de equisdots, o KDE Plasma con branding X; el instalador aplica el escritorio durante la instalación.',
    },
    desktops: {
      eyebrow: 'Anatomía',
      title: 'Escritorios incluidos',
      subtitle: 'Un sistema, cuatro formas de entrar.',
      body:
        'Hyprland y niri incluyen el stack de equisdots; KDE Plasma recibe el branding X Dark. Los tres comparten la misma base Arch, generaciones, paquetes firmados y herramientas X.',
      installNote:
        'Elige el escritorio en el instalador de texto. El resto del sistema no cambia.',
      guideCta: 'Ver la guía de escritorios',
      caption:
        'El stack de capas de X — el escritorio se elige al instalar, no es un fork.',
      layersAlt:
        'Ilustración isométrica de las seis capas de X Linux: base Arch, sistema X, generaciones, escritorios, shell y apps, y entrega firmada.',
      hyprland: 'Hyprland',
      hyprlandDesc: 'equisdots · Lua · claro/oscuro',
      niri: 'niri',
      niriDesc: 'equisdots · tiling desplazable',
      kde: 'KDE Plasma',
      kdeDesc: 'X Dark · Plasma 6',
      console: 'Consola',
      consoleDesc: 'sin escritorio · mínimo',
      layersLabel: 'Capas del sistema',
      sceneHint: 'Mueve el puntero para orbitar · pasa por una capa',
      layers: [
        { name: 'Base Arch', desc: 'kernel · systemd · pacman' },
        { name: 'Sistema X', desc: 'instalador · x-scripts · keyring' },
        { name: 'Generaciones', desc: 'btrfs · snapshots · rollback' },
        { name: 'Escritorio', desc: 'Hyprland · niri · KDE Plasma' },
        { name: 'Shell y apps', desc: 'Quickshell · equisdots · herramientas X' },
        { name: 'Entrega', desc: 'ISO firmada · repo [x] · branding' },
      ],
    },
    stats: {
      layers: 'capas del sistema',
      desktops: 'escritorios',
      boot: 'modos de arranque',
      paths: 'vías de empaquetado',
    },
    foundation: {
      eyebrow: 'Fundamento',
      title: 'Arch, sin misterio',
      subtitle: 'Una base conocida, extendida con intención.',
      body:
        'Kernel, systemd y pacman siguen donde esperas. X añade el instalador de texto, generaciones btrfs, paquetes firmados y una capa de escritorio que puedes cambiar.',
      cta: 'Ver la estructura del proyecto',
      items: [
        { label: 'Kernel', value: 'linux · linux-lts · linux-zen' },
        { label: 'Init', value: 'systemd · journald · logind' },
        { label: 'Paquetes', value: 'pacman · [x] · keyring' },
        { label: 'Sistema de archivos', value: 'btrfs · subvolúmenes · snapshots' },
      ],
    },
    generations: {
      eyebrow: 'Generaciones',
      title: 'El rollback es una capa',
      subtitle: 'Cada transacción deja un snapshot arrancable.',
      body:
        'x gen registra paquetes, servicios, kernel y /etc como una generación. Arráncala, compara, fíjala o restaura una sola ruta.',
      cta: 'Leer las generaciones',
      sceneKicker: 'X / GENERACIONES',
      sceneHint: 'Arrastra para orbitar · elige una generación',
      sceneCurrent: 'Generación actual',
      sceneRollback: 'Destino de rollback',
      sceneNote:
        'Las generaciones más nuevas se quedan en /.snapshots; arranca o restaura con x gen.',
      items: [
        { id: '0001', label: 'primera instalación' },
        { id: '0002', label: 'pre-update' },
        { id: '0003', label: 'cambio de kernel' },
        { id: '0004', label: 'capa de escritorio' },
        { id: '0005', label: 'actual' },
      ],
    },
    install: {
      title: 'Instala en cuatro pasos',
      subtitle: 'Del ISO a la primera generación arrancable — el instalador corre en la terminal.',
      step1Title: 'Descarga el ISO',
      step1Desc:
        'Baja el último ISO firmado desde SourceForge — el enlace estable siempre apunta al release actual.',
      step2Title: 'Graba un USB',
      step2Desc: 'Sustituye /dev/sdX por tu dispositivo:',
      step3Title: 'Arranca y sigue el instalador',
      step3Desc:
        'Elige el esquema de disco, kernel, escritorio y perfil; la primera generación se crea sola.',
      step4Title: 'Arranca la generación 0001',
      step4Desc:
        'Reinicia en el primer snapshot btrfs. Haz rollback, diff o pin cuando lo necesites.',
      guideCta: 'Leer la guía de instalación',
    },
    landing: {
      reposTitle: 'Repositorios',
      reposSubtitle:
        'Cada componente del proyecto X Linux vive en la organización equislinux.',
      pathsTitle: 'Tres vías de empaquetado',
      pathsSubtitle:
        'X combina paquetes compatibles con Arch para pacman, su formato nativo para xpm y un helper de AUR que encamina cada transacción por xpm.',
      pacmanTitle: 'pacman · repositorio [x]',
      pacmanDescription:
        'Paquetes .pkg.tar.zst compatibles con Arch servidos desde x-repo. Agrega el repositorio [x] a pacman.conf e instala con pacman -S.',
      nativeTitle: 'xpm · .xp nativo',
      nativeDescription:
        'Paquetes nativos construidos por xpkg desde recetas XBUILD e instalados con xpm. El endpoint vive en x-repo/x/x86_64.',
      aurTitle: 'xpm-aur · AUR',
      aurDescription:
        'Helper de AUR en Rust: resuelve dependencias, compila con makepkg en chroots limpios e instala o elimina todo mediante xpm.',
      docsTitle: 'Documentación',
      docsDescription:
        'Guías de la distro, WSL, aprovisionamiento, empaquetado y el repositorio de paquetes — en inglés y español.',
      docsCta: 'Ver documentación',
    },
    docs: {
      title: 'Documentación',
      subtitle: 'Guías de todos los repositorios publicados del proyecto X Linux.',
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
