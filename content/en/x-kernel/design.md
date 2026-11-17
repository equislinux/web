# X Kernel design

`linux-x` and `linux-x-mainline` are downstream packages, not kernel forks.
The delta is deliberately small: the upstream recipe keeps control of the
kernel source, configuration, patches and checksums.

## Channels and deltas

### stable / testing — Arch packaging

- `pkgbase=linux` → `pkgbase=linux-x`.
- `pkgdesc='Linux'` → `pkgdesc='Linux X'`.
- Nothing else changes: same `config.x86_64`, sources, patches, checksums and
  split-package functions as the Arch packaging tag.

The Arch PKGBUILD uses `${pkgbase#linux}` for `localversion.20-pkgname`, so
`linux-x` produces a release ending in `-x` (for example
`7.3.4-arch1-1-x`). `stable` and `testing` share the package name and the
`[x-kernel]` repository; only stable is published.

### mainline — AUR linux-mainline

- `pkgbase=linux-mainline` → `pkgbase=linux-x-mainline`.
- `pkgdesc="Linux Mainline"` → `pkgdesc="Linux X Mainline"`.
- Nothing else changes: same mainline git source, `config.x86_64` and
  split-package functions as the AUR recipe.

The same localversion logic produces a release ending in `-x-mainline`.
Mainline uses a separate package family and the `[x-kernel-mainline]`
repository, so a stable publish cannot remove mainline files.

## Package names

- stable / testing: `linux-x`, `linux-x-headers`, `linux-x-docs`.
- mainline: `linux-x-mainline`, `linux-x-mainline-headers`,
  `linux-x-mainline-docs`.

Neither package provides or conflicts with Arch `linux`. They coexist and Arch
remains the fallback kernel.

## initramfs and boot

`mkinitcpio` generates `/etc/mkinitcpio.d/<pkgbase>.preset` and the
`/boot/vmlinuz-<pkgbase>` + `/boot/initramfs-<pkgbase>.img` pair from
`usr/lib/modules/<release>/pkgbase`. Neither X kernel ships a custom preset.

## Drivers

In-tree drivers and firmware follow `config.x86_64` and are identical to Arch.
Out-of-tree modules need DKMS and the matching `-headers` package. Prebuilt
Arch NVIDIA packages target `linux` and do not match either X kernel.

## Build

`makechrootpkg` runs against `/var/lib/archbuild/x-kernel-x86_64`, with
`PKGDEST`, `SRCDEST` and `LOGDEST` under the repository. Output is isolated per
package and channel: `out/<pkgbase>/<channel>/`. `pkgctl build --repo` is not
used because a custom repository has no devtools buildtool.

## CI watcher

The only workflow is `.github/workflows/kernel-watch.yml`. It checks the three
channels with `git`, `curl` and `jq`, and writes a version table to the workflow
summary. It never builds, signs, publishes or touches SourceForge. Builds and
publication are manual, and signing keys, `keys/env.sh`, `config.env` and the
SourceForge SSH key never enter CI.

## Updates

No Arch/AUR merge is performed. The new upstream recipe is fetched and the
minimal delta is reapplied. `delta/apply.py` aborts if the expected `PKGBUILD`
lines or the `${pkgbase#linux}` localversion mechanism changed; review the
drift instead of forcing the build.
