# Estructura del repositorio

## Nivel superior

```
app/                  Fuente del portal Next.js (App Router)
components/           Componentes React usados por el portal
lib/                  Helpers de cliente (diccionario i18n)
packages/             Fuentes de paquetes y artefactos de build
public/               Contenido estático servido en GitHub Pages
  repo/x86_64/        Repositorio [x] de pacman (db + tarballs .pkg.tar.zst)
  x/x86_64/           Endpoint nativo (.xp) usado por xpm
  images/, fonts/     Assets de la web
build-packages.sh     Script local de build + repo-add
docs/                 Documentación
.github/workflows/    Workflows de CI/CD
```

## packages/

Un directorio por paquete. Cada uno puede contener un `PKGBUILD`, un `XBUILD`, o
ambos, además de los archivos propios del paquete.

- `PKGBUILD` — descriptor de fuente compatible con Arch. Se construye con `makepkg` y
  produce un `.pkg.tar.zst` para el repositorio de **pacman**.
- `XBUILD` — descriptor nativo para la vía **xpkg/xpm**, produce un paquete `.xp`.
  Lo construye y publica `scripts/build-xp.sh` (ver `docs/build-x-native-workflow.md`).

El README señala que mientras `PKGBUILD` se mantiene para el tooling legacy de Arch,
`XBUILD` es la vía nativa para `xpkg`/`xpm`.

### Paquetes construibles (PKGBUILD)

- **`x-release`** — identidad y branding de X Linux (PKGBUILD `1.0-8`). Incluye la
  plantilla `os-release`, defaults de GRUB, logo de distribución, fondos y la
  herramienta `x-release-apply`, además de hooks de pacman (`99-x-os-release.hook`,
  `99-x-grub.hook`) que reaplican el branding tras actualizaciones de
  `filesystem`/`grub`.
- **`x-dev`** — paquete de entorno de desarrollo (PKGBUILD `1.0-2`). Instala
  `/usr/bin/x-dev-env` y helpers bajo `/usr/share/x-dev/` (aliases de shell, scripts
  de setup de NVIDIA/QEMU/Node). Depende de `zsh git base-devel curl wget`.
  `install=x-dev.install` ejecuta la lógica post-instalación.

Hoy solo estos dos se construyen desde su `PKGBUILD` con `build-packages.sh`.

### x-scripts: artefacto importado, sin fuente aquí

`x-scripts` **no** se construye en este repositorio. Su `PKGBUILD` vive en el repo
hermano `equislinux/scripts` bajo `scripts/packaging/` y empaqueta todo el payload de
aprovisionamiento (fases, CLI `x`, configs). El tarball resultante se construye allí y
se **importa** a este repo, commiteado bajo `public/repo/x86_64/` (actualmente
`x-scripts-0.1.0-19-any.pkg.tar.zst`).

- No existe un directorio de fuente `packages/x-scripts/` aquí.
- El artefacto publicado y el `PKGBUILD` de `scripts/packaging/` están alineados en
  `0.1.0-19` (la revisión del payload multi-kernel). `build-packages.sh` importa el
  build hermano automáticamente; vuelve a ejecutarlo al republicar el payload.

### Solo recetas

`packages/*/` guarda recetas de build (`PKGBUILD`, `XBUILD` y auxiliares); los
binarios viven solo en los repositorios generados (`public/repo/x86_64` para pacman,
`public/x/x86_64` para xpm).

## public/repo/x86_64/ — el repositorio [x] de pacman

Este directorio es el repositorio orientado a pacman. Archivos presentes:

| Archivo | Rol |
|---|---|
| `x.db`, `x.db.tar.gz` | Base de datos de paquetes (`x.db` es la copia sin comprimir de `x.db.tar.gz`). |
| `x.db.sig`, `x.db.tar.gz.sig` | Firma OpenPGP detached de la base de datos (builds firmados). |
| `x.files`, `x.files.tar.gz` | Base de datos de listas de archivos para `pacman -F`. |
| `x.files.sig`, `x.files.tar.gz.sig` | Firma detached de la base de listas de archivos (builds firmados). |
| `*.pkg.tar.zst` | Los paquetes: `x-release-1.0-8`, `x-dev-1.0-2`, `x-scripts-0.1.0-19`, `xpm-0.1.0-3`. |
| `*.pkg.tar.zst.sig` | Firma OpenPGP detached junto a cada paquete (builds firmados). |
| `SHA256SUMS` | Checksums de todos los archivos del directorio. |
| `SHA256SUMS.sig` | Firma detached de `SHA256SUMS` (builds firmados). |
| `signing.pub`, `trustedkeys.gpg` | Clave pública del proyecto y keyring GPG que importan los consumidores para verificar el repositorio (`signing.pub` es la clave armada; `trustedkeys.gpg` el keyring binario). |

Los clientes configuran el repositorio en `pacman.conf` como:

```
[x]
Server = https://equislinux.github.io/x-repo/repo/x86_64
```

### Cómo se actualiza la base de datos (repo-add)

La base de datos nunca se edita a mano. `build-packages.sh` la regenera con
`repo-add`:

```bash
cd public/repo/x86_64
rm -f x.db x.files x.db.tar.gz x.files.tar.gz x.db.tar.gz.old x.files.tar.gz.old
repo-add -R x.db.tar.gz *.pkg.tar.zst
rm -f x.db x.files
cp x.db.tar.gz x.db
cp x.files.tar.gz x.files
sha256sum * > SHA256SUMS
```

- `repo-add` crea `x.db.tar.gz` y `x.files.tar.gz` a partir de los `.pkg.tar.zst`.
- La base se reconstruye desde cero a partir de los tarballs presentes en el
  directorio, así que también se eliminan entradas de paquetes que ya no existen.
- `x.db`/`x.files` son copias planas de los `.tar.gz` para que pacman pueda leerlos
  directamente.
- Por defecto la base se regenera sin firmar. Cuando `X_REPO_SIGN_KEY` está
  exportada, `build-packages.sh` llama a `repo-add -s -k`, firma `SHA256SUMS` y
  (re)exporta `trustedkeys.gpg` + `signing.pub`; el estado firmado vive hoy en la
  rama `feat/signing` (ver [signing.md](signing.md)).
- `SHA256SUMS` se regenera a partir de todos los archivos del directorio y se firma
  como `SHA256SUMS.sig` cuando la firma está activa.
- Las firmas por paquete (`*.pkg.tar.zst.sig`) las produce `makepkg --sign` y se
  conservan junto a su tarball.

## public/x/x86_64/ — endpoint nativo .xp

Endpoint complementario para `xpm`. Contiene paquetes `.xp` (`xpkg`, `xpm`,
`x-release`, `x-dev`, `xfetch-bin`, `xtop-git`, `opencode-bin`, `x-scripts`), su
propia base de datos (`x.db.tar.gz`, `x.files.tar.gz` + copias `x.db`/`x.files`),
firmas por archivo, `history.json`, `signing.pub`/`trustedkeys.gpg` y un
`SHA256SUMS`. Se regenera con `scripts/build-xp.sh` y se despliega con el mismo
workflow de Pages. Se sirve en `https://equislinux.github.io/x-repo/x/x86_64/`. La URL de
repositorio documentada para `xpm` es `https://equislinux.github.io/x-repo/x/$arch`.

## build-packages.sh

Script local (se ejecuta desde la raíz del repo; requiere un entorno tipo Arch con
`makepkg` y `repo-add`). El script:

1. Construye en su sitio los paquetes PKGBUILD configurados
   (`build_pkgbuild x-release`, `build_pkgbuild x-dev`) con `makepkg -cf --noconfirm`.
   El helper `build_xbuild` para la vía nativa existe pero está comentado.
2. Copia todos los `packages/*/*.pkg.tar.zst` a `public/repo/x86_64/` y elimina el
   artefacto de build después.
3. Regenera la base de datos de pacman y `SHA256SUMS` como se muestra arriba.
4. Imprime el recordatorio final:

```
Commit public/repo/x86_64/ and push, then run the deploy workflow.
```

Para añadir un paquete PKGBUILD nuevo al flujo, añade su directorio a las llamadas
`build_pkgbuild`. Los paquetes construidos externamente (como `x-scripts`) se importan
automáticamente desde `../scripts/packaging/`; también puedes dejar un `.pkg.tar.zst`
directamente en `public/repo/x86_64/` antes de ejecutar
`./build-packages.sh --index-only`.
