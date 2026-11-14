# Publishing X Kernel

The kernel repositories are separate from `[x]` because a kernel package is
larger than GitHub Pages' 100 MB per-file limit.

## Repositories

| Channel | Package | Repository | FRS directory |
|---|---|---|---|
| stable | `linux-x` | `[x-kernel]` | `kernel/x86_64/` |
| testing | `linux-x` | not published | — |
| mainline | `linux-x-mainline` | `[x-kernel-mainline]` | `kernel-mainline/x86_64/` |

Stable and mainline are isolated: publishing one cannot remove the other's
packages, database or README. Testing is a local preview and is never published
by the scripts.

## Flow

```bash
./scripts/build.sh --channel stable
./scripts/publish.sh --channel stable --dry-run
./scripts/publish.sh --channel stable --yes
```

`publish.sh`:

1. copies the current package set into `repo/<arch>/`;
2. creates a signed `<repo>.db`/`<repo>.files` with `repo-add`;
3. signs `SHA256SUMS`, exports `signing.pub`/`trustedkeys.gpg`;
4. uploads with `rsync` over SSH to `frs.sourceforge.net`;
5. removes old package files for the same package family from the remote
   directory;
6. downloads every public file and compares bytes with the local repo.

## Client configuration

```ini
[x-kernel]
SigLevel = Required
Server = https://downloads.sourceforge.net/project/equislinux/kernel/x86_64

[x-kernel-mainline]
SigLevel = Required
Server = https://downloads.sourceforge.net/project/equislinux/kernel-mainline/x86_64
```

A direct pacman sync currently fails because pacman appends `.sig` to the
redirected URL query string (`GPGME error: No data`). The ISO installer bundles
the signed packages and installs them locally. The stanzas above are the
intended configuration once the small database is mirrored on a non-redirecting
host.

Published on 2026-11-13:

- stable `linux-x 7.3.4.arch1-1` and mainline `linux-x-mainline 7.4rc1-1`;
- packages, headers, docs, signatures, databases and `SHA256SUMS`;
- public-byte verification completed by re-downloading every uploaded file.

## Safety

- The SourceForge SSH key and signing key are never stored in the repository.
- Publication requires `--yes`; never run it from CI.
- CI is watcher-only. Monthly builds and publication are manual.
- Never delete `[x]`, ISOs, web metadata or Arch kernels from SourceForge.
