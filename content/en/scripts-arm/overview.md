# scripts-arm — aarch64 delta

ARM-only companion of [`equislinux/scripts`](https://github.com/equislinux/scripts).
The upstream payload is consumed **read-only at a pinned commit**; this repo
owns the aarch64 delta and builds the package that replaces `x-scripts` on ARM
systems.

## Why a separate repo

The generations engine is x86_64-shaped: it globs `/boot/vmlinuz-*`, pairs
`initramfs-<pkgbase>.img` and reads `/usr/lib/modules/<rel>/pkgbase`. Arch Linux
ARM's `linux-aarch64` installs `/boot/Image(.gz)`, `initramfs-linux.img` and no
`pkgbase` file. Keeping the delta here means `equislinux/scripts` (and therefore
x86_64, WSL and everything else) is never modified; every ARM change is a patch
over a pinned upstream, reviewed in isolation.

## Layout

```text
vendor/scripts.sha                    pinned commit of equislinux/scripts
patch/generations-aarch64.patch       the ARM delta (Image, pkgbase fallback)
build.sh                              pin -> patch -> x-scripts-arm package
out/                                  built packages (gitignored)
```

## Build

```bash
./build.sh                      # aarch64 + makepkg, or the x-arm Docker builder
../x-arm/docker/run.sh bash -lc 'cd /workspace/scripts-arm && ./build.sh'
```

It produces `out/x-scripts-arm-<ver>-any.pkg.tar.zst`; the package identity is
derived from the upstream `packaging/PKGBUILD` and provides/conflicts/replaces
`x-scripts`. The result belongs in the `[x]/aarch64` repository published from
`equislinux/x-arm-repo`.

## The delta

- `xkernel.sh`: adds `linux-aarch64` to the known-kernel list and a single
  `xkernel_pkgbase_of()` fallback (ALARM ships no `pkgbase` file).
- `xgen.sh`: archives `/boot/Image(.gz)`, synthesizes
  `pkgbase=linux-aarch64` and accepts `Image*` in legacy pairing and dedupe.

Every fallback is conditional on `uname -m == aarch64` or on files that Arch
x86_64 does not install, so the delta is inert off-ARM.

## Sync policy

- Bump `vendor/scripts.sha` deliberately when pulling upstream changes;
  re-apply the patch and run the upstream tests on the patched tree
  (`bash test/validate.sh`) before publishing.
- The package inherits the upstream license (GPL-3.0-or-later). Publication and
  installer integration live in `equislinux/x-arm` and `equislinux/x-arm-repo`.
