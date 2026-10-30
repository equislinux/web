# Entorno de compilación Docker (Arch Linux ARM, aarch64)

Contenedor de build para el pipeline de x-arm. Ejecuta el rootfs fijado de Arch
Linux ARM (`rootfs.sha`) con todas las dependencias de compilación instaladas,
así que la ISO aarch64 se puede producir en cualquier host Docker (Apple
Silicon lo ejecuta de forma nativa).

```bash
docker/fetch-rootfs.sh      # descarga y fija el rootfs ALARM (una vez)
docker/build-image.sh       # importa el rootfs y construye xlinux-arm-builder
```

Después ejecuta el pipeline normal dentro del contenedor:

```bash
docker/run.sh scripts/fetch-x.sh
docker/run.sh scripts/fetch-archiso.sh
docker/run.sh scripts/apply-overlay.sh
docker/run.sh scripts/build-repo.sh          # usuario normal (makepkg)
docker/run.sh sudo scripts/build-iso.sh      # root (mkarchiso)
```

`docker/run.sh` monta el workspace de equislinux en `/workspace`, así que
`vendor/`, `work/` y `out/` se comparten con el host. El usuario del contenedor
se remapea al propietario del workspace.

Notas:

- El contenedor es privilegiado: `mkarchiso` necesita mounts y chroots.
- `qemu-system-aarch64` no se instala a propósito; ejecuta `scripts/vm.sh` en
  el host (macOS: `brew install qemu` usa aceleración HVF).
- El tarball del rootfs ocupa ~790 MB y vive en `docker/rootfs/` (gitignored).

## Claves de firma

La firma queda fuera de git. Pon el homedir GPG en
`~/.config/equislinux/keys/gnupg` (o apunta `X_ARM_GNUPGHOME` ahí) y la clave
SSH de SourceForge en `~/.ssh`. `run.sh` monta ambos en solo lectura y el
entrypoint los copia a `/home/builder` (copia nueva en cada ejecución, evita
problemas de sockets virtiofs con gpg-agent).

Importa la clave del proyecto una vez — preferiblemente en el host con un
`GNUPGHOME` dedicado, para que la clave nunca toque la caché de build del
contenedor:

```sh
GNUPGHOME=~/.config/equislinux/keys/gnupg gpg --import x-signing.asc
GNUPGHOME=~/.config/equislinux/keys/gnupg gpg --list-secret-keys --with-colons \
  | awk -F: '/^sec/{print $5}'
```

Después firma y publica:

```sh
X_REPO_SIGN_KEY=<keyid> docker/run.sh scripts/build-repo.sh --sign
X_REPO_SIGN_KEY=<keyid> docker/run.sh scripts/publish-repo.sh --push
X_REPO_SIGN_KEY=<keyid> docker/run.sh scripts/publish-arm.sh --verify
```

Para la ISO, el repo `[x]` puede ser la URL publicada de Pages
(`docker/run.sh sudo scripts/build-iso.sh --no-repo`), o reconstruir antes el
repo local con `--sign`.

Ver [Build](build.md) para el flujo completo y [VM](vm.md) para el lanzador
QEMU y la importación en UTM/Parallels/VMware.
