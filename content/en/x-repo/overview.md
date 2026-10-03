# Overview

`xlnux/x-repo` is the **X package repository + web portal** repository of the X Linux
ecosystem. It has two roles that live side by side in the same repo:

1. **Binary package repository** — prebuilt X packages and the pacman database are
   committed under `public/` and served verbatim on GitHub Pages as the `[x]` pacman
   repository (and, under `public/x/`, as the native `.xp` endpoint used by `xpm`).
2. **Web portal** — a Next.js site (landing, download, docs, developers, contact)
   that is exported to static files and deployed to the same GitHub Pages site.

Packages are **not** built in CI. They are built locally, committed to the repo, and the
only thing the deploy workflow does is rebuild the website and publish the whole
`public/` tree to GitHub Pages. See [web-portal.md](web-portal.md) and
[publishing.md](publishing.md).

## Role within the xlnux organization

`x-repo` is one of five repositories of the **xlnux** organization. Each repo has a
single, clear role:

| Repository | Role |
|---|---|
| `xlnux/x` | The distro. ArchISO profile, ISO/installer build and system branding. |
| `xlnux/scripts` | Provisioning payload and user setup. Ships the `x` CLI and builds the `x-scripts` package. |
| `xlnux/xpkg` | Rust package builder. Produces native `.xp` packages from `XBUILD` files. |
| `xlnux/xpm` | Rust package manager, the native counterpart of pacman. |
| `xlnux/x-repo` | **Binary package repository + web portal** (this repository). |

Two packaging paths coexist in the ecosystem:

- **PKGBUILD + makepkg** — Arch-compatible packages (`.pkg.tar.zst`) consumable by
  pacman. This is the path that currently populates the `[x]` pacman repository.
- **XBUILD + xpkg** — native packages (`.xp`) consumable by `xpm`. The tooling is
  ready but the automated native workflow is **pending** (see
  `docs/build-x-native-workflow.md`).

## Current repository state

- The `[x]` pacman repository is **signed** on the `feat/signing` branch:
  packages, `x.db`/`x.files` and `SHA256SUMS` carry detached OpenPGP
  signatures, and the public keyring is published as `trustedkeys.gpg` +
  `signing.pub` (see [signing.md](signing.md)).
- `x-scripts 0.1.0-19` is the payload published and signed on that branch, and
  the same revision the ISO embeds (`x/airootfs/root/x-installer/packages/`).
- Verification is **not enforced yet**: the ISO still configures `[x]` as
  `Optional`, and embedding the keyring in the live environment and in the
  installed target is pending.
- The branch is not deployed to Pages yet; the published site still serves the
  older, unsigned repository from `main`.

## What lives in this repository

| Path | Purpose |
|---|---|
| `packages/` | Package sources. `PKGBUILD` (pacman path) and, where present, `XBUILD` (native path) per package. |
| `public/` | Static content served on Pages. `public/repo/x86_64/` holds the `[x]` pacman repository; `public/x/x86_64/` holds the native `.xp` endpoint; the rest is website assets. |
| `build-packages.sh` | Local script to build the pacman-facing packages and regenerate the repository database. |
| `app/`, `components/`, `lib/` | The Next.js web portal source. |
| `.github/workflows/` | CI/CD. `build.yml` builds and deploys the site to GitHub Pages. |
| `docs/` | Repository documentation (this directory and `build-x-native-workflow.md`). |

See [repo-layout.md](repo-layout.md) for the layout in detail and
[web-portal.md](web-portal.md) for the website.
