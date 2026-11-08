# Resumen

`xpm-aur` es el **helper de AUR** en Rust del ecosistema X Linux. Consulta el
AUR, resuelve dependencias entre los repositorios oficiales y el AUR, compila
paquetes fuente con `makepkg` y envía cada transacción de paquetes a **xpm** en
lugar de pacman.

Es un compañero de [`xpm`](../xpm/overview-and-status.md), no un reemplazo de
pacman. `makepkg` sigue viniendo del paquete pacman y los PKGBUILD se ejecutan
como bash; lo que cambia es el backend de transacciones. xpm posee las
instalaciones, eliminaciones, upgrades y la base de datos, mientras que los
metadatos de AUR viven en un fichero de estado explícito.

## Estado

Los flujos diarios comunes están implementados y probados. Es un **MVP**: los
builds nativos en chroot limpio, la política de firmas/attestation de AUR y una
caché binaria pública son trabajo futuro. Revisa los PKGBUILD de AUR antes de
compilarlos; las recetas de AUR son bash ejecutable no confiable.

## Qué hace

- Búsqueda e información combinadas de repositorios oficiales + AUR
  (`--aur`/`--repo` para restringir).
- Resolución recursiva de dependencias entre repos oficiales y AUR, incluidos
  `provides`, restricciones de versión, conflictos, reemplazos y paquetes
  divididos.
- Orden de build por package base de AUR: las dependencias se compilan primero,
  las bases independientes pueden compilar en paralelo y las instalaciones de
  xpm siguen siendo secuenciales.
- Builds mediante `xpm build`; los checkouts de AUR y los árboles de makepkg
  viven en la caché de xpm-aur.
- Instala, elimina y actualiza mediante xpm.
- Registra `origin=aur`, la versión de AUR y el commit de git en un fichero de
  estado.
- `--devel` reconstruye paquetes VCS cuando cambia `HEAD`.
- `adopt` importa paquetes de AUR instalados por yay u otro helper.
- `getpkgbuild` clona o actualiza PKGBUILD de AUR para inspección.
- Consultas de paquetes extranjeros/instalados (`-Qm`) y `--nocheck`.
- Formas compatibles con yay/pacman: `-S`, `-Syu`, `-Ss`, `-Si`, `-Rns`, `-Qm`,
  `-Sc`.

## Instalación

Desde fuente:

```bash
cargo build --release
sudo install -Dm755 target/release/xpm-aur /usr/local/bin/xpm-aur
```

Desde el repositorio firmado `[x]` (el paquete está publicado allí):

```bash
xpm install xpm-aur
```

Requisitos en ejecución: `xpm >= 0.1.0-7`, `pacman` (para `makepkg`), `git`,
`base-devel`, `arch-install-scripts` y `systemd-nspawn` para chroots limpios,
además de un usuario normal para compilar. `xpm-aur` no debe ejecutarse como
root; invoca el comando sudo configurado para las transacciones de xpm.

## Uso

```bash
xpm-aur search yay
xpm-aur info yay

xpm-aur install yay
xpm-aur install --print yay          # solo resuelve e imprime el plan
xpm-aur install --aur --rebuild foo-git
xpm-aur install --remove-conflicts foo-git
xpm-aur install -j 4 a b c            # compila hasta cuatro bases a la vez

xpm-aur upgrade                      # xpm upgrade + actualizaciones de AUR
xpm-aur upgrade --aur --devel        # solo AUR, comprueba HEAD de VCS

xpm-aur remove foo
xpm-aur remove -s foo                # recursivo
xpm-aur remove -n foo                # purga ficheros de configuración

xpm-aur query
xpm-aur query --quiet
xpm-aur adopt                        # importa paquetes de AUR instalados por yay
xpm-aur clean --all
```

También acepta formas de compatibilidad:

```bash
xpm-aur -S foo
xpm-aur -Syu --noconfirm
xpm-aur -Ss yay
xpm-aur -Si yay
xpm-aur -Rns foo
xpm-aur -Qm
xpm-aur -Sc
```

## Cómo corre una transacción

1. `xpm sync` refresca las bases de datos de sincronización.
2. El resolver lee los paquetes instalados y los metadatos oficiales, y resuelve
   las dependencias de AUR de forma recursiva.
3. Los paquetes oficiales se instalan con xpm en un solo lote.
4. Las package bases de AUR se clonan o actualizan y se compilan con
   `xpm build`. Las bases independientes pueden compilar en paralelo; cada base
   terminada se instala con `xpm install` de forma secuencial para que las
   transacciones nunca se solapen.
5. `xpm-aur` registra la base de AUR, el commit, la versión y las salidas
   divididas en `$XDG_STATE_HOME/xpm-aur/state.json`.

Las cachés viven bajo `$XDG_CACHE_HOME/xpm-aur/` (`build/`, `packages/`,
`sources/`).

## Configuración

`~/.config/xpm-aur/config.toml` opcional:

```toml
[aur]
rpc_url = "https://aur.archlinux.org/rpc/v5"
git_url = "https://aur.archlinux.org"

[commands]
xpm = "xpm"
sudo = "sudo"          # vacío desactiva sudo

[build]
run_checks = true
chroot = true
extra_args = []
jobs = 2               # bases de AUR en paralelo; 0 = auto
```

Los flags de línea de comandos sobrescriben el fichero; también se respetan
`XPM_AUR_CONFIG`, `XPM_AUR_STATE` y `XPM_AUR_CACHE`.

## Modelo de seguridad

- Los PKGBUILD de AUR son bash ejecutable no confiable: revísalos antes de
  compilar.
- `xpm-aur` nunca compila como root ni llama a pacman para instalar.
- No firma ni publica los paquetes construidos; un repositorio binario local
  firmado está planificado.
- No ejecutes `xpm-aur` y yay/pacman a la vez. xpm bloquea su propia transacción
  y toma el `db.lck` de pacman mientras refleja, pero ambas herramientas no
  comparten un bloqueo durante toda la operación.

## Relación con el resto de X

| Componente | Rol |
|---|---|
| [`xpm`](../xpm/overview-and-status.md) | Posee transacciones, la base de datos y paquetes `.xp`/ALPM. |
| [`xpkg`](../xpkg/01-overview-and-status.md) | Construye paquetes `.xp` desde recetas XBUILD o PKGBUILD. |
| [`x-repo`](../x-repo/overview.md) | Sirve el repositorio firmado `[x]` y el endpoint nativo `.xp`. |
| [`x`](../x/index.md) | Distro, instalador y generaciones. |

Consulta el repositorio fuente para las notas completas de
[arquitectura](https://github.com/equislinux/xpm-aur/blob/main/docs/ARCHITECTURE.md)
y [compatibilidad](https://github.com/equislinux/xpm-aur/blob/main/docs/COMPATIBILITY.md).
