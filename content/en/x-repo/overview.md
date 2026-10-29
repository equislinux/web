# Overview

`equislinux/x-repo` is the **X package repository + web portal** repository of
the X Linux ecosystem. It has two roles that live side by side in the same repo:

1. **Binary package repository** — prebuilt X packages and the pacman database
   are committed under `public/` and served verbatim on GitHub Pages as the `[x]`
   pacman repository. The same tree also carries the native `.xp` endpoint under
   `public/x/`, consumed by `xpm`.
2. **Web portal** — a Next.js page that explains the repository (endpoints,
   pacman/xpm usage, packages and publishing flow) and is exported as a static
   site to the same GitHub Pages site.

Packages are **not** built in CI. They are built locally, committed to the repo,
and the deploy workflow only rebuilds the website and publishes the whole
`public/` tree to GitHub Pages. See [web-portal.md](web-portal.md) and
[publishing.md](publishing.md).

## Role within the equislinux organization

Each repository has a single, clear role:

| Repository | Role |
|---|---|
| `equislinux/x` | The distro. ArchISO profile, ISO/installer build and system branding. |
| `equislinux/x-arm` | aarch64 overlay build: ISO, `[x]/aarch64` repository and VM images. |
| `equislinux/scripts` | Provisioning payload and user setup. Ships the `x` CLI and builds the `x-scripts` package. |
| `equislinux/xpkg` | Rust package builder. Produces native `.xp` packages from `XBUILD` files. |
| `equislinux/xpm` | Rust package manager, the native counterpart of pacman. |
| `equislinux/x-repo` | **Binary package repository + web portal** (this repository). |
| `equislinux/wsl` / `equislinux/wsl-scripts` | WSL rootfs and its first-run setup. |
| `equislinux/utils` | Operator utilities: workspace, clone, sudo rules and signing keys. |
| `equislinux/wiki` / `equislinux/web` | Documentation mirror and the public portal (equislinux.org). |

Two packaging paths coexist and are both live:

- **PKGBUILD + makepkg** — Arch-compatible packages (`.pkg.tar.zst`) consumable
  by pacman. This path populates the `[x]` pacman repository under
  `public/repo/x86_64/`.
- **XBUILD + xpkg** — native packages (`.xp`) consumable by `xpm`. `scripts/build-xp.sh`
  builds and signs the set, then regenerates the native endpoint under
  `public/x/x86_64/` (database, `history.json`, `SHA256SUMS`).

The distro still installs from the pacman `[x]` channel; the native `.xp`
endpoint is the xpm-facing channel and is regenerated alongside it on release.
The aarch64 build publishes its own `[x]/aarch64` repository from
`equislinux/x-arm`; this repository remains the x86_64 channel.
See [repo-layout.md](repo-layout.md) for the layout in detail and
[web-portal.md](web-portal.md) for the website.

## What lives in this repository

| Path | Purpose |
|---|---|
| `packages/` | Package sources. `PKGBUILD` (pacman path) and, where present, `XBUILD` (native path) per package. |
| `public/` | Static content served on Pages. `public/repo/x86_64/` holds the `[x]` pacman repository; `public/x/x86_64/` holds the native `.xp` endpoint; the rest is website assets. |
| `build-packages.sh` | Local script to build the pacman-facing packages and regenerate the repository database. |
| `scripts/build-xp.sh` | Local script to build and sign the native `.xp` endpoint. |
| `app/` | The Next.js portal source. |
| `.github/workflows/` | CI/CD. `build.yml` builds and deploys the site to GitHub Pages. |
| `docs/` | Repository documentation (this directory and `build-x-native-workflow.md`). |

The full package and release flow is documented in
[publishing.md](publishing.md), with the ISO-specific steps in
[iso-releases.md](iso-releases.md).
