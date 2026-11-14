# x-arm-repo — [x]/aarch64 repository

Static pacman repository for X Linux on aarch64, served by GitHub Pages from
this repository's `repo/aarch64/` directory.

## Client configuration

```ini
[x]
SigLevel = Required
Server = https://equislinux.github.io/x-arm-repo/repo/aarch64
```

The signing key (`signing.pub`, `trustedkeys.gpg`) ships next to the database.

## Contents

- `x.db` / `x.files` and their compressed copies, signed with the project key.
- Built packages (for example `x-release`, `x-wallpapers`, `x-dev`,
  `xfetch-bin`, `xtop-git` and `opencode-bin`), each with a detached `.sig`.
- `SHA256SUMS` and `SHA256SUMS.sig`.

The repository is produced by the aarch64 build pipeline in `equislinux/x-arm`
and consumed by the ARM ISO and installed systems. x86_64 keeps using
`equislinux/x-repo`.
