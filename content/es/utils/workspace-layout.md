# Layout y descubrimiento del workspace

EquisLinux no es un monorepo: cada componente es su propio repositorio git y
todos son hermanos dentro de un directorio llamado `equislinux`.

```
<parent>/equislinux/
├── .equislinux-workspace   # marcador, no trackeado por ningún repositorio
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
├── utils/
├── ops/
└── keys/                   # material de firma, nunca trackeado
```

`<parent>` es variable. Los ejemplos soportados son:

- `~/Documents/repos/equislinux`
- `~/Documents/equislinux`
- `~/repos/equislinux`
- `~/src/equislinux`
- `~/equislinux`

## Orden de descubrimiento

`lib/common.sh` resuelve el workspace en este orden:

1. `--workspace PATH` (comandos que lo aceptan)
2. `X_WORKSPACE`
3. la primera línea no comentada de
   `${XDG_CONFIG_HOME:-~/.config}/equislinux/workspace`
4. el padre del repositorio `utils` (el caso normal)
5. las ubicaciones comunes de la lista

Una ruta explícita que no existe, o que no parece un workspace EquisLinux, es un
error duro. Las ubicaciones de fallback solo se prueban cuando no hay ruta
explícita configurada.

Para fijar el workspace en una máquina nueva:

```bash
./bin/equislinux-workspace --init /path/to/equislinux
./bin/equislinux-workspace --set-default
```

`--init` crea el marcador. `--set-default` escribe el archivo de configuración,
útil cuando `utils` se clona fuera del workspace o se enlaza en otro sitio.

## ¿Por qué no un `.env`?

Un `.env` se resuelve relativo al directorio actual, hay que sourcearlo en cada
shell y es fácil commitearlo por accidente. Estas utilidades se invocan desde
directorios distintos (incluidos scripts de release); un archivo de
configuración de usuario más un marcador de workspace es determinista y no
depende del `cwd` del llamante.

Si prefieres variables de entorno, exporta `X_WORKSPACE` en el perfil del shell.
No commitees un `.env` con rutas de máquina en ningún repositorio.

## Mover el workspace

El padre puede cambiar sin editar las utilidades: los scripts resuelven rutas en
tiempo de ejecución. Después de mover el workspace, vuelve a ejecutar la utilidad
de sudo para regenerar las rutas absolutas de `/etc/sudoers.d/equislinux`:

```bash
./bin/equislinux-sudo --apply
```

El material de claves vive en `<workspace>/keys`; si mueves el workspace, mueve
ese directorio con él (o actualiza `X_KEYS_DIR`). `keys/env.sh` contiene un
`GNUPGHOME` absoluto, así que regenéralo solo ejecutando el generador de claves,
o edítalo deliberadamente después de un movimiento.

## Symlinks

Los scripts resuelven symlinks con `readlink -f`, así que un enlace como
`~/bin/equislinux-sudo -> <workspace>/utils/bin/equislinux-sudo` sigue
descubriendo el workspace correcto.
