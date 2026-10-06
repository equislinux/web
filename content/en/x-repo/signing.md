# Repository Signing

The `[x]` pacman repository can be published with OpenPGP signatures so that
consumers can verify every package, the pacman databases and the checksum
file before trusting them. Signing is optional and controlled by a single
environment variable, `X_REPO_SIGN_KEY`; this page is the operational runbook
behind [publishing.md](publishing.md).

Current state (October 2026):

- The signed repository lives on the `feat/signing` branch: packages,
  `x.db`/`x.files` and `SHA256SUMS` have detached `.sig` files, and the public
  keyring is published alongside them.
- `x-scripts 0.1.0-19` is the signed payload of that branch, and the revision
  the ISO embeds.
- The ISO still configures `[x]` as `Optional`, so verification is **not
  enforced yet** (see [ISO/target integration](#isotarget-integration-pending)).

## 0. Key setup (one-time, offline)

Generate the project key and export its fingerprint:

```bash
gpg --full-generate-key                 # RSA 4096 or ed25519
KEYID="$(gpg --list-keys --with-colons <mail> | awk -F: '/^fpr/{print $10; exit}')"
export X_REPO_SIGN_KEY="$KEYID"
```

- Keep the secret key on an offline medium or a hardware token; only the
  public part is published.
- The key has **no expiry** by design: revocation is manual, so create the
  revocation certificate immediately and store it separately:

  ```bash
  gpg --gen-revoke "$KEYID" > revoke.asc
  ```

  Losing the key *without* `revoke.asc` is the only really messy scenario.

## 1. Sign and publish

With `X_REPO_SIGN_KEY` exported, `build-packages.sh` does the signing during
the normal local build:

```bash
X_REPO_SIGN_KEY="$KEYID" ./build-packages.sh              # build + sign + index
X_REPO_SIGN_KEY="$KEYID" ./build-packages.sh --index-only # re-index/sign only
```

The script:

1. signs every tarball in the repository directory: locally built ones were
   already signed by `makepkg --sign --key "$X_REPO_SIGN_KEY"`, and the
   imported `x-scripts` tarball is signed with `gpg --detach-sign`, producing
   `*.pkg.tar.zst.sig`;
2. runs `repo-add -s -k "$X_REPO_SIGN_KEY"`, so `x.db`/`x.files` are signed,
   and mirrors `x.db.sig`/`x.files.sig` from the `.tar.gz` signatures;
3. signs `SHA256SUMS`, producing `SHA256SUMS.sig`;
4. exports `trustedkeys.gpg` and `signing.pub` into `public/repo/x86_64/`.

Without `X_REPO_SIGN_KEY` the repository is published **unsigned** and the
script prints a warning. Review, commit and deploy as described in
[publishing.md](publishing.md). See [repo-layout.md](repo-layout.md) for the
resulting files.

## 2. Consumer side

Configure pacman in `/etc/pacman.conf`:

```ini
[x]
SigLevel = Required DatabaseOptional
Server = https://equislinux.github.io/x-repo/repo/x86_64
```

`Required DatabaseOptional` verifies package signatures and the signed
database while still tolerating an unsigned local database.

Bootstrap the keyring **before** switching to `Required`:

```bash
sudo pacman-key --init
sudo pacman-key --add signing.pub
sudo pacman-key --lsign-key "$KEYID"
```

For the native `xpm` endpoint, place the binary keyring at
`/etc/xpm/gnupg/trustedkeys.gpg` and set `sig_level = "required"`.

## 3. ISO/target integration (pending)

The `[x]` block currently ships `Optional TrustAll` in the ISO, which is why
the published signatures do not require consumer action yet. The pending work
is the distribution path for the keyring:

- embed `signing.pub`/`trustedkeys.gpg` in `airootfs` (live environment) and
  in the installed target;
- ship an updatable `x-keyring` package so key changes can reach installed
  systems;
- only then change the ISO and installer `[x]` block to `Required`.

## 4. Rotation and key change

Signatures are published while `[x]` remains `Optional` during development,
so a key change breaks nobody yet. The procedure, planned or emergency:

1. **Planned change**: generate the new key, **cross-sign** it with the old
   one (proves continuity to clients that trust the old key), publish both in
   `trustedkeys.gpg`, re-sign the databases/packages with the new key and keep
   the old key in the keyring for at least one release cycle.
2. **Compromise**: publish the old key's `revoke.asc`, publish the new key,
   re-sign everything and distribute the updated keyring as in (1). Consumers
   on `Optional` are unaffected; consumers on `Required` need the keyring
   update before the first new-key package.
3. **Lost (not compromised)**: same as a planned change; old signatures stay
   valid, but no new updates can be signed until the new key is distributed.
4. **Hygiene**: never delete old package signatures before clients have the
   new key, and announce the fingerprint change in the changelog.
