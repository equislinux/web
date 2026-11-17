# X Kernel

**X Kernel** ships X-branded downstream kernels. It is not a fork of the Linux
source tree: `linux-x` builds from Arch's **packaging recipe** for the stable and
testing channels, and `linux-x-mainline` builds from the AUR `linux-mainline`
recipe. Only the package base and description change.

Status: **published as source and binaries; not the default.** Stable
`linux-x 7.3.4.arch1-1` and mainline `linux-x-mainline 7.4rc1-1` are built,
signed and published to SourceForge. The 2026.11.15 X ISO bundles both, and the
installer can select them. Arch `linux`, `linux-lts` and `linux-zen` remain the
default supported kernels.

## Channels

| Channel | Upstream | X package | Repository | Current |
|---|---|---|---|---|
| `stable` | Arch `core/linux` | `linux-x` | `[x-kernel]` | 7.3.4.arch1-1 |
| `testing` | Arch `core-testing/linux` | `linux-x` | local preview | 7.3.4.arch1-2 |
| `mainline` | AUR `linux-mainline` | `linux-x-mainline` | `[x-kernel-mainline]` | 7.4rc1-1 |

`arch1` is Arch's patch revision; the `-x` and `-x-mainline` suffixes are the X
markers added by the upstream localversion logic. Stable and mainline live in
separate repositories so publishing one never removes the other.

## What it does

- Fetches the upstream Arch packaging tag (stable/testing) or the AUR
  `linux-mainline` HEAD (mainline).
- Applies a minimal delta: `pkgbase` and `pkgdesc`. Sources, `config.x86_64`,
  patches, checksums and split-package functions stay as upstream provides them.
- Builds the kernel, headers and docs packages in a clean `makechrootpkg`
  chroot.
- Signs the packages and the variant database with the project key.
- Publishes binaries to SourceForge FRS because a kernel package exceeds the
  100 MB GitHub Pages limit. Stable and mainline have separate directories.
- CI is a watcher only. Builds and publication are manual.

X kernels do not provide or conflict with Arch `linux`, so they can coexist;
Arch remains the fallback entry.

## Repository

- Source and guides: <https://github.com/equislinux/x-kernel>
- License: GPL-3.0-or-later for the scripts. Kernel recipes follow Arch/AUR
  packaging and upstream Linux licenses.
- Design and delta: [design](design.md)
- Build and install guide: [manual](manual.md)
- Publication details: [publishing](publishing.md)
- Validation: [testing](testing.md)
