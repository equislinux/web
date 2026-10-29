# Restaurar claves desde el backup offline

El backup offline contiene dos archivos independientes:

| Archivo | Contenido |
|---|---|
| `keys-*.tar.gz` | keyring GPG del proyecto (`keys/gnupg`), `signing.pub`, `trustedkeys.gpg`, `revoke.asc`, `env.sh`, `README.md` |
| `ssh-sourceforge-*.tar.gz` | `~/.ssh/id_ed25519_sourceforge` y `.pub` |

Cada archivo tiene un `.sha256`. Los tars preservan permisos Unix; una copia
plana de directorio en exFAT no.

## Script (recomendado)

`bin/equislinux-restore` es standalone y puede ejecutarse desde el repositorio o
desde una copia en el disco de backup. Es **dry-run por defecto**:

```bash
# Previsualizar
./bin/equislinux-restore \
  --backup-dir /run/media/x/PortableSSD/equislinux-backup-2026-10-17 \
  --workspace "$HOME/repos/equislinux"

# Restaurar
./bin/equislinux-restore \
  --backup-dir /run/media/x/PortableSSD/equislinux-backup-2026-10-17 \
  --workspace "$HOME/repos/equislinux" \
  --apply
```

Si haces `cd` al directorio de backup, `--backup-dir` es opcional:

```bash
cd /run/media/x/PortableSSD/equislinux-backup-2026-10-17
./tools/equislinux-restore --workspace "$HOME/repos/equislinux" --apply
```

El workspace debe existir y llamarse `equislinux`. El script:

1. verifica los `.sha256` y los archivos tar;
2. se niega a sobrescribir destinos existentes salvo con `--force`;
3. restaura el keyring con permisos `0700`/`0600`/`0644`;
4. reescribe `GNUPGHOME` en `keys/env.sh` al workspace actual, conservando
   `X_REPO_SIGN_KEY`;
5. instala la clave privada de SourceForge como `0600` y la pública como `0644`;
6. ejecuta un conteo de claves secretas y una verificación `ssh-keygen -y`.

Opciones útiles:

- `--ssh-dir DIR` — restaurar la clave SSH en otro sitio que `~/.ssh`.
- `--no-keys` / `--no-ssh` — restaurar solo una parte.
- `--force` — mover `keys/` existente a `keys.pre-restore.<timestamp>` y una
  clave SourceForge existente a `~/.ssh/pre-restore.<timestamp>/`.
- `--skip-checksum` — solo si falta un `.sha256`.
- `--no-rewrite-env` — mantener la ruta antigua de `GNUPGHOME`.

Ejecútalo como tu usuario normal, no como root. Si restauras como root, la
propiedad y `HOME` serán incorrectos.

## Restauración manual

Si prefieres hacerlo a mano:

```bash
BACKUP=/run/media/x/PortableSSD/equislinux-backup-2026-10-17
WS="$HOME/repos/equislinux"

# Verificar ambos archivos
(cd "$BACKUP" && sha256sum -c keys-2026-10-17.tar.gz.sha256)
(cd "$BACKUP" && sha256sum -c ssh-sourceforge-2026-10-17.tar.gz.sha256)

# Keyring (el workspace debe existir)
mkdir -p "$WS"
tar -C "$WS" -xpf "$BACKUP/keys-2026-10-17.tar.gz"
chmod 700 "$WS/keys" "$WS/keys/gnupg"
chmod 600 "$WS/keys/env.sh" "$WS/keys/revoke.asc"

# El env.sh del backup apunta al workspace antiguo.
# Edita su línea GNUPGHOME a:
#   export GNUPGHOME="$WS/keys/gnupg"

# Clave SourceForge
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
tar -C "$HOME" -xpf "$BACKUP/ssh-sourceforge-2026-10-17.tar.gz"
chmod 600 "$HOME/.ssh/id_ed25519_sourceforge"
chmod 644 "$HOME/.ssh/id_ed25519_sourceforge.pub"
```

## Después de restaurar

```bash
# Cargar la ruta de la clave de firma
source "$HOME/repos/equislinux/keys/env.sh"

# Comprobar que el keyring es legible (conteo, no material de clave)
GNUPGHOME="$HOME/repos/equislinux/keys/gnupg" gpg --list-secret-keys

# Comprobar que la clave SSH carga
ssh-keygen -y -f "$HOME/.ssh/id_ed25519_sourceforge" >/dev/null

# Instalar las reglas sudo nuevas
"$HOME/repos/equislinux/utils/bin/equislinux-sudo" --apply

# GitHub no forma parte de este backup; reautentica si hace falta
gh auth login
```

No commitees `keys/`, `env.sh`, `revoke.asc` ni `~/.ssh` en ningún repositorio.
Si el disco de backup sale de tu home, cífralo o mantén los archivos cifrados.

## Inventario

- Copia del directorio `keys/` y `keys-2026-10-17.tar.gz` — material GPG del proyecto.
- `ssh-sourceforge-2026-10-17.tar.gz` — clave SSH de SourceForge.
- Ambos `.sha256` verificados al escribirlos.
- No hay clave SSH de GitHub ni clave GPG personal en este backup.
