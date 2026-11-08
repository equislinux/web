# Overview

`xpm-aur` is the Rust **AUR helper** of the X Linux ecosystem. It queries the
AUR, resolves dependencies across the official repositories and the AUR, builds
source packages with `makepkg`, and sends every package transaction through
**xpm** instead of pacman.

It is a companion to [`xpm`](../xpm/overview-and-status.md), not a replacement
for pacman. `makepkg` still comes from the pacman package and PKGBUILDs still
run as bash; what changes is the transaction backend. xpm owns installs,
removals, upgrades and the package database, while AUR metadata lives in an
explicit sidecar state file.

## Status

The common daily workflows are implemented and tested. This is an **MVP**:
AUR signature/attestation policy, a public binary cache and further hardening of
the build sandbox are future work; clean chroot builds are available through
`--chroot`/`--no-chroot`. Review AUR PKGBUILDs before building them; AUR recipes
are untrusted executable bash.

## What it does

- Combined official + AUR search and package information (`--aur`/`--repo` to
  restrict).
- Recursive dependency resolution across official repositories and the AUR,
  including `provides`, version constraints, conflicts, replacements and split
  packages.
- Build order for AUR package bases: dependency levels build first, independent
  bases can build in parallel, and xpm installs stay sequential.
- Builds through `xpm build`; AUR checkouts and makepkg work trees live in the
  xpm-aur cache.
- Installs, removes and upgrades through xpm.
- Tracks `origin=aur`, the AUR version and the git commit in a sidecar state
  file.
- `--devel` rebuilds VCS packages when `HEAD` changes.
- `adopt` imports AUR packages installed by yay or another helper.
- `getpkgbuild` clones or updates AUR PKGBUILDs for inspection.
- Foreign/installed queries (`-Qm`) and `--nocheck`.
- yay/pacman-style command forms: `-S`, `-Syu`, `-Ss`, `-Si`, `-Rns`, `-Qm`,
  `-Sc`.

## Install

From source:

```bash
cargo build --release
sudo install -Dm755 target/release/xpm-aur /usr/local/bin/xpm-aur
```

From the signed `[x]` repository (the package is published there):

```bash
xpm install xpm-aur
```

Runtime requirements: `xpm >= 0.1.0-7`, `pacman` (for `makepkg`), `git`,
`base-devel`, `arch-install-scripts` and `systemd-nspawn` for clean chroots,
plus a normal user for building. `xpm-aur` must not run as root; it invokes the
configured sudo command for xpm transactions.

## Usage

```bash
xpm-aur search yay
xpm-aur info yay

xpm-aur install yay
xpm-aur install --print yay          # resolve and print the plan only
xpm-aur install --aur --rebuild foo-git
xpm-aur install --remove-conflicts foo-git
xpm-aur install -j 4 a b c            # build up to four bases at once

xpm-aur upgrade                      # xpm upgrade + AUR updates
xpm-aur upgrade --aur --devel        # AUR only, VCS HEAD checks

xpm-aur remove foo
xpm-aur remove -s foo                # recursive
xpm-aur remove -n foo                # purge config files

xpm-aur query
xpm-aur query --quiet
xpm-aur query --foreign              # foreign packages, xpm-aur or not
xpm-aur sync                         # refresh official DBs through xpm
xpm-aur adopt                        # import yay-installed AUR packages
xpm-aur getpkgbuild --print yay      # clone/update PKGBUILDs for inspection
xpm-aur clean --all --keep-days 30   # keep the last 30 days of cache
```

Compatibility forms are accepted as well:

```bash
xpm-aur -S foo
xpm-aur -Syu --noconfirm
xpm-aur -Ss yay
xpm-aur -Si yay
xpm-aur -Rns foo
xpm-aur -Qm
xpm-aur -Sc
```

## Commands

| Command | What it does |
|---------|--------------|
| `xpm-aur sync` | Refresh the official sync databases through `xpm sync`. |
| `xpm-aur search <query> [--by name-desc\|name\|provides]` | Search the AUR. |
| `xpm-aur info <packages>...` | Show package information (official + AUR unless restricted). |
| `xpm-aur install <packages>...` | Resolve, build and install AUR packages and their dependencies. |
| `xpm-aur upgrade` | Upgrade official packages with xpm and AUR packages with xpm-aur. |
| `xpm-aur remove <packages>... [-s] [-n]` | Remove packages through xpm (recursive / purge config). |
| `xpm-aur query [--quiet] [--foreign]` | List tracked AUR packages or all foreign packages. |
| `xpm-aur adopt` | Import AUR packages installed by yay or another helper. |
| `xpm-aur getpkgbuild <packages>... [-p]` | Clone/update AUR PKGBUILDs (`-p` prints instead of writing). |
| `xpm-aur clean [--all] [--keep-days N]` | Remove cached build trees and artifacts. |

### Global flags

| Flag | Description |
|------|-------------|
| `-v`, `--verbose` | Increase verbosity (`-v`, `-vv`). |
| `--noconfirm` (alias `--no-confirm`) | Do not ask for confirmation. |
| `--needed` | Pass `--needed` to xpm for official packages. |
| `--asdeps` | Mark requested packages as dependencies. |
| `--rebuild` | Rebuild AUR packages even when the version is unchanged. |
| `--aur` / `--repo` | Restrict resolution to AUR or official candidates. |
| `--devel` | Check VCS package `HEAD`s during upgrade. |
| `--print` | Print the transaction plan and exit before building/installing. |
| `--remove-conflicts` | Remove conflicting or replaced packages automatically. |
| `--nocheck` | Skip source package checks (`makepkg --nocheck`). |
| `--no-chroot` | Disable the clean chroot build. |
| `-j`, `--jobs N` | Maximum AUR package bases to build concurrently (`0` = auto). |
| `--config PATH` | Configuration file. |
| `--build-dir PATH` | Override the build directory. |
| `--cache-dir PATH` | Override the cache root (build, packages and sources). |
| `--state PATH` | Override the sidecar state file. |

## How a transaction runs

1. `xpm sync` refreshes the sync databases.
2. The resolver reads installed packages and official metadata, then resolves
   AUR dependencies recursively.
3. Official packages are installed by xpm as one batch.
4. AUR package bases are cloned or updated and built through `xpm build`.
   Independent bases may build concurrently; each finished base is installed
   with `xpm install` serially so transactions never overlap.
5. `xpm-aur` records the AUR base, commit, version and split outputs in
   `$XDG_STATE_HOME/xpm-aur/state.json`.

Caches live under `$XDG_CACHE_HOME/xpm-aur/` (`build/`, `packages/`,
`sources/`).

## Configuration

Optional `~/.config/xpm-aur/config.toml`:

```toml
[aur]
rpc_url = "https://aur.archlinux.org/rpc/v5"
git_url = "https://aur.archlinux.org"

[commands]
xpm = "xpm"
sudo = "sudo"          # empty disables sudo

[build]
run_checks = true
chroot = true
extra_args = []
jobs = 2               # parallel AUR bases; 0 = auto
```

Command-line flags override the file; `XPM_AUR_CONFIG`, `XPM_AUR_STATE` and
`XPM_AUR_CACHE` are also honoured.

## Safety model

- AUR PKGBUILDs are untrusted executable bash: review them before building.
- `xpm-aur` never builds as root and never calls pacman to install.
- It does not sign or publish built packages; a local signed binary repository
  is planned.
- Do not run `xpm-aur` and yay/pacman concurrently. xpm locks its own
  transaction and takes pacman's `db.lck` while mirroring, but the two tools do
  not share a lock for the whole operation.

## Relationship to the rest of X

| Component | Role |
|---|---|
| [`xpm`](../xpm/overview-and-status.md) | Owns transactions, the package database and `.xp`/ALPM packages. |
| [`xpkg`](../xpkg/01-overview-and-status.md) | Builds `.xp` packages from XBUILD or PKGBUILD recipes. |
| [`x-repo`](../x-repo/overview.md) | Serves the signed `[x]` repository and the native `.xp` endpoint. |
| [`x`](../x/index.md) | Distro, installer and generations. |

See the source repository for the full
[architecture](https://github.com/equislinux/xpm-aur/blob/main/docs/ARCHITECTURE.md)
and [compatibility](https://github.com/equislinux/xpm-aur/blob/main/docs/COMPATIBILITY.md)
notes.
