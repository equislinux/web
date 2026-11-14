# Testing X Kernel

Static checks are not a boot test.

## Build checks

`scripts/build.sh` signs the packages and runs `verify-package.sh`:

- `pkgname`/`pkgbase` are the expected variant names;
- the kernel release ends in `-x` (stable/testing) or `-x-mainline`
  (mainline);
- `vmlinuz` and `pkgbase` are present in the module directory;
- the headers package contains `build/Makefile`;
- package signatures verify.

## QEMU

Boot a disposable X/Arch test system with the built package, then check:

- `uname -r` ends in `-x` or `-x-mainline`;
- `mkinitcpio -P` produces the expected `initramfs-<pkgbase>.img`;
- a module loads and `dkms status` shows the kernel;
- the previous Arch kernel entry still boots.

Do not replace the host's kernel or `/boot` entries from an automated test.

## Laptop

1. Live USB with a test ISO carrying the X kernel; test WiFi, GPU, audio,
   touchpad, suspend/resume and external displays without touching the disk.
2. Only after that, install it alongside Arch `linux` and keep the previous
   generation/entry and a live USB available.
3. If NVIDIA/DKMS fails, boot Arch `linux` and remove the X kernel; do not
   force the new kernel as default.

Mainline is a moving line (currently 7.4rc1). Treat it as experimental: test it
in QEMU or a live USB separately from stable, and do not publish it as the
default kernel.

## Acceptance

A publication is not approved until the QEMU test passes and the user accepts
the live USB result. Real hardware testing remains manual.
