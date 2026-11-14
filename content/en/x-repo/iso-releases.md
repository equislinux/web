# Publishing a live ISO

`scripts/publish-iso.sh` publishes a built ISO to SourceForge and updates the
web release index in one step:

1. resolves the newest `x/out/x-*.iso` (or `--iso PATH`);
2. computes the SHA-256 and gpg detached signatures (project key via
   `../../keys/env.sh` / `X_REPO_SIGN_KEY`);
3. renders `README.md` from `scripts/iso-README.template.md`;
4. uploads with rsync to
   `xscriptor@frs.sourceforge.net:/home/frs/project/equislinux/iso` and removes
   the previous `x-*.iso` versions;
5. updates `web/data/releases.json` (`releases[0]`).

Then rebuild the portal and upload it to Hostinger (`npm run build` in `web/`
and copy `out/` to `public_html/`). Hostinger only serves the page: the ISO
itself stays on SourceForge. The stable portal URL redirects to the newest
release: <https://equislinux.org/download/latest/>.

```bash
source ../../keys/env.sh       # GNUPGHOME + X_REPO_SIGN_KEY
scripts/publish-iso.sh         # upload + link update
scripts/publish-iso.sh --verify # additionally waits and hashes the public download
```

Options: `--iso PATH`, `--web-dir DIR`, `--dry-run`, `--no-upload`,
`--verify`. Environment: `SF_USER` (default `xscriptor`), `SF_KEY`
(`~/.ssh/id_ed25519_sourceforge`), `SF_PATH` (default
`/home/frs/project/equislinux/iso`), `X_ISO_DATE`.

The SourceForge account needs the SSH key registered and write access to the
`equislinux` project. Signing material stays in the workspace `keys/` directory
and `~/.ssh` — never inside any git repository.
