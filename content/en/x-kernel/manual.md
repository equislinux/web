# X Kernel manual

Practical guide for the X-branded kernel packages.

## What it is

X Kernel is a downstream of existing packaging recipes, not a kernel fork:

- `linux-x` follows Arch's `linux` packaging recipe (stable/testing);
- `linux-x-mainline` follows the AUR `linux-mainline` recipe.

The delta only changes the package base and description. The kernel source,
`config.x86_64`, patches, checksums and localversion logic stay upstream.

## Current versions

| Channel | Package | Kernel release | SourceForge repository |
|---|---|---|---|
| stable | `linux-x 7.3.4.arch1-1` | `7.3.4-arch1-1-x` | `[x-kernel]` |
| mainline | `linux-x-mainline 7.4rc1-1` | `7.4.0-rc1-1-x-mainline` | `[x-kernel-mainline]` |

## Installing from the X ISO

1. Boot the 2026.11.15 ISO and run `xinstall`.
2. Choose the package backend (`xpm` is the native path; `pacman` is explicit).
3. Choose `linux-x (X stable)` or `linux-x-mainline (X mainline)`.
4. Complete the install, reboot and select the X entry in the boot menu.

The packages are bundled in the ISO and signed by the project key. The full
profile also installs Arch `linux`, so the usual result is both kernels with
Arch as the default entry. Confirm the running kernel with `uname -r`: X
releases end in `-x` or `-x-mainline`.

## SourceForge repositories

- stable: `https://downloads.sourceforge.net/project/equislinux/kernel/x86_64`
- mainline: `https://downloads.sourceforge.net/project/equislinux/kernel-mainline/x86_64`

Direct `pacman -Sy` against SourceForge currently hits a `.db.sig` redirect bug.
The ISO avoids it by installing the bundled packages locally (`xpm install
<file>` or `pacman -U`). The online repositories remain the published binary
mirror.

## Updating the recipe

No Arch/AUR merge is performed. For each upstream update:

```bash
./scripts/check-upstream.sh --channel stable
./scripts/check-upstream.sh --channel mainline
./scripts/prepare-recipe.sh --channel stable
./scripts/prepare-recipe.sh --channel mainline
```

`delta/apply.py` stops if the expected upstream `PKGBUILD` lines or the
`${pkgbase#linux}` localversion mechanism changed. Review the drift instead of
forcing the build.

## Building and publishing

```bash
./scripts/build.sh --channel stable
./scripts/publish.sh --channel stable --dry-run
./scripts/publish.sh --channel stable --yes

./scripts/build.sh --channel mainline
./scripts/publish.sh --channel mainline --dry-run
./scripts/publish.sh --channel mainline --yes
```

Or use the orchestrator:

```bash
./scripts/release.sh --channel stable
./scripts/release.sh --channel mainline --publish --yes
```

Builds use `/var/lib/archbuild/x-kernel-x86_64` and write under
`out/<pkgbase>/<channel>/`. They never install or activate the kernel on the
host. Publication requires `--yes`.

## Safety

- The X kernels do not provide or conflict with Arch `linux`.
- Keep Arch `linux`/`linux-lts` installed as fallback.
- Use DKMS with the matching `-headers` package for NVIDIA, ZFS or VirtualBox.
- Keep `/boot` in mind: X stores kernel/initramfs copies under
  `/boot/x/kernels` on a 1 GiB ESP.
- Never publish automatically; keys and SourceForge credentials stay outside
  the repository.
