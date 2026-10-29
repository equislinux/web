# X Linux documentation

**X Linux** is an Arch-based, snapshot-first distribution with a script-driven
installer and its own package tooling: bootable btrfs generations, multi-kernel
support, a signed `[x]` repository and a native `.xp` endpoint.

This site collects the documentation of every published repository of the
`equislinux` organization in English and Spanish. Use the sidebar to browse by
component, or start with the topics below.

## What you will find

- **X Linux** — the distribution: ISO build, installer, generations and VM testing.
- **x-arm** — the aarch64 overlay build, ISO, repository and VM images.
- **X for WSL** — importable rootfs and WSL configuration.
- **WSL scripts** — the friendly WSL user setup.
- **Scripts and CLI** — the provisioning payload and the `x` command.
- **xpm** — the Rust package manager.
- **xpkg** — the Rust package builder.
- **x-repo** — the binary package repository, release publishing and the package portal.
- **utils** — operator tools: workspace discovery, clone, sudo rules and signing keys.
- **web** — this documentation portal.

## Repositories

| Repository | Role |
|---|---|
| [`equislinux/x`](https://github.com/equislinux/x) | Distribution: archiso profile, text installer, ISO build. |
| [`equislinux/x-arm`](https://github.com/equislinux/x-arm) | aarch64 overlay build: ISO, `[x]/aarch64` repository and VM images. |
| [`equislinux/wsl`](https://github.com/equislinux/wsl) | X Linux for WSL: importable rootfs and configuration. |
| [`equislinux/wsl-scripts`](https://github.com/equislinux/wsl-scripts) | Friendly WSL user setup. |
| [`equislinux/scripts`](https://github.com/equislinux/scripts) | Provisioning payload and CLI (`x`). |
| [`equislinux/xpm`](https://github.com/equislinux/xpm) | Native package manager (ALPM format). |
| [`equislinux/xpkg`](https://github.com/equislinux/xpkg) | Native package builder (`XBUILD` recipes). |
| [`equislinux/x-repo`](https://github.com/equislinux/x-repo) | Binary package repository (`[x]`), releases and package portal. |
| [`equislinux/utils`](https://github.com/equislinux/utils) | Operator utilities: workspace, clone, sudo rules and signing keys. |
| [`equislinux/wiki`](https://github.com/equislinux/wiki) | Documentation mirror (English/Spanish). |
| [`equislinux/web`](https://github.com/equislinux/web) | This portal: landing and browsable docs. |

> The published documentation is compiled in this repository under
> `content/<lang>/<section>/`; the original guides live in each project
> repository. Every page exists in English and Spanish; use the language switch
> in the top bar. The private `ops` repository is not published here.
