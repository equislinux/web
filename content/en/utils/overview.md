# utils — operator tools

`equislinux/utils` contains operator utilities for the EquisLinux production
workspace. They are **not** runtime components of the distribution: they help
maintainers locate the workspace, clone every repository, grant the narrow sudo
permissions needed by release/validation scripts, and generate or restore the
repository signing key.

## Workspace contract

The utilities expect one directory named `equislinux` containing every
repository at the same level:

```
.../equislinux/
├── x/
├── scripts/
├── xpm/
├── xpkg/
├── x-repo/
├── web/
├── wiki/
├── wsl/
├── wsl-scripts/
├── x-arm/
├── utils/        <- this repository
├── ops/          <- private operations notes (not required here)
└── keys/         <- signing material, never tracked
```

The parent of the workspace is not fixed: `~/Documents/repos/equislinux`,
`~/Documents/equislinux`, `~/repos/equislinux`, `~/src/equislinux` and
`~/equislinux` are all valid.

Discovery order:

1. `--workspace PATH` (where supported)
2. `X_WORKSPACE`
3. `~/.config/equislinux/workspace` (single path)
4. the parent directory of this repository (normal case)
5. common locations under `$HOME`

A `.equislinux-workspace` marker at the workspace root makes detection
unambiguous. There is intentionally no `.env`: it is working-directory
dependent and easy to commit by accident.

## Commands

```bash
# Print the detected workspace, or pin it explicitly
./bin/equislinux-workspace
./bin/equislinux-workspace --init /path/to/equislinux
./bin/equislinux-workspace --set-default

# Clone or refresh every repository in the organization
./bin/equislinux-clone --dest ~/repos/equislinux

# Show the sudo rules that would be installed (no changes)
./bin/equislinux-sudo --dry-run

# Install them (asks for your sudo password)
./bin/equislinux-sudo --apply

# Inspect or remove them
sudo ./bin/equislinux-sudo status
sudo ./bin/equislinux-sudo remove

# Plan a signing key, then generate it outside any git worktree
./bin/equislinux-keygen --dry-run
./bin/equislinux-keygen                 # passphrase-protected (default)

# Restore the keyring and SourceForge key from the offline backup
./bin/equislinux-restore --backup-dir /media/backup --workspace ~/repos/equislinux --apply
```

The full guides are the pages in this section:

- [Workspace layout](workspace-layout.md) — discovery, marker and moving the workspace.
- [Cloning the workspace](cloning.md) — `equislinux-clone`, private repos and branches.
- [Sudo rules](sudo.md) — the allowlist and safety model.
- [Signing key generator](keygen.md) — create and rotate the `[x]` key.
- [Restoring keys](restore.md) — restore the offline backup.

## Design notes

- `gh` must be installed and authenticated for `equislinux-clone`; the scripts
  never read or store tokens.
- Sudo rules resolve absolute paths at runtime; re-apply them after moving the
  workspace.
- Signing material lives in `<workspace>/keys` (mode `0700`), never inside a git
  worktree.
