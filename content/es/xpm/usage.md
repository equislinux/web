# xpm — Uso

Referencia de uso completa del binario `xpm`, basada en `crates/xpm/src/cli.rs`,
`crates/xpm/src/main.rs` y el README del proyecto.

---

## Flags globales

Estas flags las acepta cualquier subcomando.

| Flag | Corta | Valor | Descripción |
|------|-------|-------|-------------|
| `--config` | `-c` | `PATH` | Ruta del archivo de configuración (por defecto `/etc/xpm.conf`) |
| `--verbose` | `-v` | contador | Aumenta la verbosidad (`-v`, `-vv`, `-vvv`) |
| `--no-confirm` | | | Omite los prompts de confirmación (alias `--noconfirm`) |
| `--root` | `-r` | `PATH` | Directorio raíz de instalación alternativo |
| `--sysroot` | | `PATH` | Opera sobre un sistema invitado montado (root, base de datos y caché) |
| `--dbpath` | `-b` | `PATH` | Directorio de base de datos alternativo |
| `--cachedir` | | `PATH` | Directorio de caché alternativo |
| `--no-color` | | | Desactiva la salida con color |
| `--no-pacman-mirror` | | | No refleja las transacciones en la base local de pacman |
| `--shell-integration` | | | Activa shims en `~/.local/bin` y edits de rc para instalaciones sin root |
| `--no-shell-integration` | | | Desactiva la integración de shell (por defecto) |
| `--scriptlets` | | `MODE` | Política de scriptlets: `auto`, `skip` o `require` |
| `--noscriptlet` | | | Alias de `--scriptlets skip` |

La CLI está definida con `clap` y exige un subcomando (`arg_required_else_help = true`).

## Comandos

### `sync` — Sincronizar bases de datos de paquetes

Alias: `Sy`. Descarga los archivos de base de datos `.db` (y `.files` best-effort) más recientes
de cada repositorio configurado y los parsea en bases de datos de sync locales.

```bash
xpm sync [OPTIONS]
xpm Sy [OPTIONS]
```

| Flag | Corta | Descripción |
|------|-------|-------------|
| `--force` | `-f` | Fuerza un refresh completo aunque las bases de datos parezcan al día |

Nota de implementación: `cmd_sync` en `main.rs` lanza workers de sync por repositorio en chunks
paralelos, prueba cada mirror configurado con reintentos, informa qué mirror respondió y luego
parsea los `.db` / `.files` descargados para poder mostrar el recuento local de paquetes. Los
fallos de sync remoto se avisan sin abortar toda la ejecución.

### `install` — Instalar paquetes

Alias: `S`. Instala uno o más paquetes por nombre desde las bases de datos sincronizadas.

```bash
xpm install <PACKAGES>... [OPTIONS]
xpm S <PACKAGES>... [OPTIONS]
```

| Flag | Corta | Descripción |
|------|-------|-------------|
| `--download-only` | `-w` | Solo descarga los paquetes, sin instalarlos |
| `--as-deps` | | Marca el paquete como instalado como dependencia |
| `--as-explicit` | | Marca el paquete como instalado explícitamente |
| `--no-optional` | | Omite las dependencias opcionales |
| `--needed` | | Omite paquetes ya instalados en la misma versión |
| `--print` | `-p` | Imprime los paquetes resueltos sin descargar ni instalar |
| `--overwrite` | | Sobrescribe archivos en conflicto que casen con `PATTERN` (repetible, `!` niega) |
| `--ignoregroup` | | Ignora paquetes de `GROUP` (repetible) |
| `--assume-installed` | | Asume `PKG=VER` instalado para resolver dependencias (repetible) |

Comportamiento (de `main.rs`): se cargan todas las bases sincronizadas configuradas y los
requisitos pedidos (`nombre` o `nombre=versión`) se resuelven con el solver SAT, que elige
candidatos, respeta `depends`/`conflicts` y los `provides` sin versión, y devuelve el cierre en
orden de dependencias. Cada paquete se descarga al directorio de caché, se comprueba contra un
`.sig` remoto según el `sig_level` efectivo y contra el `sha256sum` cuando la entrada lo incluye,
y luego se commitea como operaciones de instalación sobre un `Transaction` (los pedidos quedan
explícitos; las dependencias arrastradas, como deps; `--as-deps`/`--as-explicit` lo sobrescriben).
Con `--download-only` la ejecución se detiene tras descargar. En caso contrario xpm pide
confirmación (salvo `--no-confirm`) y la transacción extrae los archivos y registra cada paquete
en la base de datos local.

### `remove` — Eliminar paquetes

Alias: `R`. Elimina paquetes instalados usando el manifest de archivos registrado en la base de
datos local.

```bash
xpm remove <PACKAGES>... [OPTIONS]
xpm R <PACKAGES>... [OPTIONS]
```

| Flag | Corta | Descripción |
|------|-------|-------------|
| `--recursive` | `-s` | Elimina también las dependencias no necesarias |
| `--no-deps` | `-d` | Omite las comprobaciones de dependencias |
| `--nosave` | `-n` | Elimina también los archivos de configuración (purga) |
| `--cascade` | | Elimina también los paquetes que dependen de los objetivos (`pacman -Rc`) |
| `--unneeded` | `-u` | Mantiene los objetivos que aún requiere otro paquete |

El paquete debe estar registrado en la base de datos local (si no, xpm informa de que no está
instalado). Se pide confirmación salvo `--no-confirm`.

### `upgrade` — Actualización del sistema

Alias: `Su`. Actualiza todos los paquetes instalados a las versiones más recientes disponibles.

```bash
xpm upgrade [OPTIONS]
xpm Su [OPTIONS]
```

| Flag | Corta | Descripción |
|------|-------|-------------|
| `--force` | | Fuerza la reinstalación de paquetes ya al día |
| `--ignore` | | Omite paquetes concretos (repetible, `--ignore <PKG>`) |
| `--print` | `-p` | Imprime el plan de upgrade sin descargar ni instalar |
| `--download-only` | `-w` | Descarga los paquetes sin commitear el upgrade |
| `--overwrite` | | Sobrescribe archivos en conflicto que casen con `PATTERN` (repetible) |
| `--ignoregroup` | | Ignora upgrades de paquetes de `GROUP` (repetible) |
| `--assume-installed` | | Asume `PKG=VER` instalado para resolver dependencias (repetible) |

`upgrade` refresca siempre primero las bases de datos (equivalente a `pacman -Syu`) y luego
resuelve el cierre transitivo de los paquetes con versión más nueva, de modo que las dependencias
nuevas o que ahora se requieren se instalan en la misma pasada. Los paquetes actualizados
conservan su razón de instalación; las dependencias arrastradas se registran como deps. Sin
paquetes instalados informa de que no hay nada que hacer.

### `query` — Consultar la base de datos local

Alias: `Q`. Lista los paquetes instalados desde la base de datos local.

```bash
xpm query [FILTER] [OPTIONS]
xpm Q [FILTER] [OPTIONS]
```

| Argumento / Flag | Corta | Descripción |
|------------------|-------|-------------|
| `FILTER` | | Nombre de paquete (exacto por defecto; subcadena con `--search`) |
| `--format` | | Formato de salida: `plain` (por defecto) o `tsv` |
| `--explicit` | `-e` | Solo paquetes instalados explícitamente |
| `--deps` | `-d` | Solo paquetes instalados como dependencias |
| `--search` | | Trata `FILTER` como subcadena en vez de nombre exacto |
| `--quiet` | `-q` | Imprime solo nombres de paquete |
| `--owner` | | Busca el paquete instalado que posee `PATH` |
| `--foreign` | `-m` | Paquetes que no están en ninguna base sync configurada |
| `--native` | `-n` | Paquetes presentes en alguna base sync configurada |
| `--file` | | Consulta un archivo de paquete en vez de la base local |
| `--changelog` | | Muestra el changelog guardado de un paquete instalado |
| `--unrequired` | | Paquetes que ningún otro paquete instalado requiere directamente |
| `--orphans` | `-t` | Paquetes huérfanos (ya no requeridos) |
| `--upgrades` | `-u` | Paquetes con actualizaciones disponibles |

Nota de implementación: implementado contra las bases local y sync (filtro por nombre más
`--explicit`, `--deps` y `--upgrades`). `--orphans` lista paquetes de dependencia que ningún
paquete explícito requiere, usando las aristas `depends`/`provides` registradas al instalar;
las entradas legacy sin registro se omiten.

### `search` — Buscar paquetes

Alias: `Ss`. Busca paquetes por nombre, descripción o provides.

```bash
xpm search <QUERY> [OPTIONS]
xpm Ss <QUERY> [OPTIONS]
```

| Flag | Corta | Descripción |
|------|-------|-------------|
| `--local` | `-l` | Busca en la base de datos local en lugar de en las de sync |

Nota de implementación: implementado como match case-insensitive sobre nombre, descripción y
provides; `--local` matchea nombres de paquetes instalados.

### `info` — Información de paquete

Alias: `Si`. Muestra información detallada de un paquete.

```bash
xpm info <PACKAGE> [OPTIONS]
xpm Si <PACKAGE> [OPTIONS]
```

| Flag | Corta | Descripción |
|------|-------|-------------|
| `--local` | `-l` | Consulta la base de datos local en lugar de las de sync |

Nota de implementación: implementado; combina la entrada instalada con la entrada sync de mayor
prioridad, y `--local` limita la salida a la base instalada.

### `files` — Listar archivos de un paquete

Alias: `Ql`. Lista todos los archivos que pertenecen a un paquete instalado.

```bash
xpm files <PACKAGE>
xpm Ql <PACKAGE>
```

Nota de implementación: implementado; lee el manifiesto `files` registrado al instalar (vacío
para instalaciones legacy).

### `history`, `rollback`, `diff` — Journal y generaciones

- `xpm history [--json]` — transacciones registradas, la más nueva primero. Las terminadas
  enlazan la generación que produjeron (`gen:NNNN`, si el directorio de estado es legible).
- `xpm rollback [--last | --journal <ID>] [--dry-run]` — reaplica la inversa de una transacción
  exitosa usando la caché de paquetes; aborta antes de tocar nada si falta un paquete viejo.
- `xpm diff <GENERATION> [--json]` — compara los paquetes instalados contra el `packages.tsv`
  de una generación (`current` resuelve el id por defecto).

Los archivos de configuración declarados con `backup` en `.PKGINFO` siguen la semántica de
pacman: `.pacnew` al instalar/actualizar y `.pacsave` al eliminar (se desactiva con `--nosave`).
Los hooks estilo pacman de `/usr/share/libalpm/hooks` y `/etc/pacman.d/hooks` corren alrededor de
cada transacción.

### `repo` — Gestión de repositorios

Gestiona los repositorios añadidos por el usuario (temporales). Los predefinidos vienen de
`/etc/xpm.conf`; los añadidos por el usuario se guardan como archivos TOML bajo `/etc/xpm.d/`.

```bash
xpm repo list                 # repositorios predefinidos + añadidos por el usuario
xpm repo add <NAME> <URL>     # añade un repositorio temporal
xpm repo remove <NAME>        # elimina un repositorio añadido por el usuario
```

Ejemplos (del help integrado):

```bash
xpm repo add chaotic-aur https://cdn-mirror.chaotic.cx/$repo/$arch
xpm repo add my-repo https://username.github.io/my-repo/$arch
xpm repo add local file:///srv/packages/$arch
```

`repo add` se niega a sobrescribir una entrada existente del mismo nombre. Tras añadir un
repositorio, ejecuta `xpm sync` para traer su base de datos.

### `build` — Construir un paquete fuente con makepkg

Construye un directorio `PKGBUILD`/`XBUILD` con `makepkg` y recoge los paquetes
resultantes. Es el backend que usa `xpm-aur` para los paquetes de AUR.

```bash
xpm build [DIR] [OPTIONS]
xpm build path/to/pkg --pkgdest ./out --clean --install
xpm build . --chroot --json build.json -- --nocheck
```

| Flag / Argumento | Descripción |
|------------------|-------------|
| `DIR` | Directorio con `PKGBUILD` (por defecto: `.`) |
| `--pkgdest PATH` | Directorio de salida (por defecto: `<DIR>/.xpm-packages`) |
| `--srcdest PATH` | Caché de fuentes de makepkg |
| `--builddir PATH` | Directorio de build de makepkg |
| `--nocheck` | Omite la función `check()` |
| `--clean` | Elimina paquetes existentes de `--pkgdest` antes de construir |
| `--chroot` | Construye en un chroot limpio de devtools (requiere `devtools` y sudo) |
| `--chroot-dir PATH` | Directorio root/copia del chroot (por defecto `/var/lib/archbuild/xpm-aur`) |
| `--install` | Instala los paquetes construidos con xpm tras un build correcto |
| `--as-deps` / `--as-explicit` | Razón de instalación para `--install` |
| `--preinstall PKG` | Instala un paquete local en el chroot limpio (repetible) |
| `--json PATH` | Escribe el resultado del build como JSON |
| `-- <args>` | Argumentos extra pasados a `makepkg` |

### Otros comandos

| Comando | Qué hace |
|---------|----------|
| `xpm bootstrap [PACKAGES]...` | Arranca un root vacío con xpm (filesystem + bash y luego `base-devel` por defecto). |
| `xpm import-pacman [--from PATH] [--force]` | Importa paquetes instalados desde la base local de pacman. |
| `xpm sync-pacman-db [--pacman-db PATH]` | Reescribe la base local de pacman desde la base de xpm. |
| `xpm check [--full] [PACKAGES]...` (alias `Qk`) | Verifica archivos instalados; `--full` también comprueba hashes, modos y symlinks de `.MTREE`. |
| `xpm mark (--as-deps\|--as-explicit) <PACKAGES>...` (alias `D`) | Cambia la razón de instalación de paquetes instalados. |
| `xpm deptest <DEP>...` (alias `T`) | Prueba especificaciones de dependencia contra los paquetes instalados. |
| `xpm groups [GROUP] [--local] [--names] [-q]` | Lista grupos de paquetes (sync o locales). |
| `xpm list [REPO] [-q]` | Lista paquetes disponibles en los repos sync (forma `-Sl`). |
| `xpm clean [--all]` | Elimina archivos de paquetes cacheados (formas `-Sc`/`-Scc`). |
| `xpm file-db [-y] [-l] [-q] [--repo REPO] [TARGETS]...` | Consulta las bases `.files` de sync (forma `-F`). |

### `usage` — Ayuda integrada

Muestra ayuda de uso detallada para toda la herramienta o para un tema/comando.

```bash
xpm usage                    # visión general
xpm usage commands           # lista todos los comandos
xpm usage config             # formato del archivo de configuración
xpm usage repos              # gestión de repositorios
xpm usage <command>          # ayuda de un comando concreto (sync, install, remove, upgrade, ...)
```

`xpm <command> --help` también funciona vía clap.

## Aliases estilo pacman

| Alias | Se asigna a | Equivalente en pacman |
|-------|-------------|-----------------------|
| `Sy` | `sync` | `pacman -Sy` |
| `S` | `install` | `pacman -S` |
| `R` | `remove` | `pacman -R` |
| `Su` | `upgrade` | `pacman -Su` |
| `Q` | `query` | `pacman -Q` |
| `Ss` | `search` | `pacman -Ss` |
| `Si` | `info` | `pacman -Si` |
| `Ql` | `files` | `pacman -Ql` |
| `Qk` | `check` | `pacman -Qk` |
| `D` | `mark` | `pacman -D` |
| `T` | `deptest` | `pacman -T` |

## Flujo de trabajo típico

```bash
xpm sync                       # refresca las bases de datos de paquetes
xpm install <package>          # instala un paquete
xpm upgrade                    # actualiza los paquetes instalados (hace sync primero)
xpm query                      # lista los paquetes instalados
xpm remove <package>           # elimina un paquete
```

El uso no interactivo (scripts) necesita `--no-confirm`. Para experimentos aislados/sin root usa
`--config`, `--root`, `--dbpath` y `--cachedir` apuntando a directorios temporales; cuando la
raíz de instalación no es `/`, xpm activa la integración de shell y crea shims de comandos en
`~/.local/bin` (con líneas de export de PATH en `~/.bashrc` y `~/.zshrc`).

## Variables de entorno y códigos de salida

`RUST_LOG` se respeta a través del `EnvFilter` de `tracing-subscriber` para controlar la
verbosidad de los logs. `docs/CLI.md` documenta además `XPM_CONFIG`, `XPM_CACHE_DIR`,
`XPM_HOOKS_DIR`, `XPM_ALPM_HOOKS_DIRS`, `X_GEN_STATE` y `NO_COLOR`.

`docs/CLI.md` documenta una matriz de códigos de salida (0 éxito, 1 error general, 2 error de
uso, hasta 7 base de datos bloqueada). Nota: esa matriz es intención documentada más que un
contrato impuesto en el código actual; en la práctica clap reporta errores de uso, `anyhow`
reporta fallos en runtime y el resto de códigos documentados aún no los emite `main.rs`.
Verifícalo contra el código antes de depender de un código concreto.

## Referencias

- Referencia CLI existente: [`../CLI.md`](../CLI.md)
- Objetivos de fetch y layout de mirrors: [`../FETCH_TARGETS.md`](../FETCH_TARGETS.md)
- Guía rápida de install/upgrade: [`../INSTALL_AND_UPGRADE.md`](../INSTALL_AND_UPGRADE.md)
- Configuración de ejemplo: [`../../etc/xpm.conf.example`](../../etc/xpm.conf.example)
- Definición de comandos: [`../../crates/xpm/src/cli.rs`](../../crates/xpm/src/cli.rs),
  despacho: [`../../crates/xpm/src/main.rs`](../../crates/xpm/src/main.rs)
