# Publicar X Kernel

Los repositorios de kernel son independientes de `[x]` porque un paquete de
kernel supera el límite de 100 MB por archivo de GitHub Pages.

## Repositorios

| Canal | Paquete | Repositorio | Directorio FRS |
|---|---|---|---|
| stable | `linux-x` | `[x-kernel]` | `kernel/x86_64/` |
| testing | `linux-x` | no se publica | — |
| mainline | `linux-x-mainline` | `[x-kernel-mainline]` | `kernel-mainline/x86_64/` |

Stable y mainline están aislados: publicar uno no puede borrar paquetes, base
de datos ni README del otro. Testing es un preview local y los scripts nunca lo
publican.

## Flujo

```bash
./scripts/build.sh --channel stable
./scripts/publish.sh --channel stable --dry-run
./scripts/publish.sh --channel stable --yes
```

`publish.sh`:

1. copia el conjunto actual de paquetes a `repo/<arch>/`;
2. crea `<repo>.db`/`<repo>.files` firmados con `repo-add`;
3. firma `SHA256SUMS` y exporta `signing.pub`/`trustedkeys.gpg`;
4. sube por `rsync` sobre SSH a `frs.sourceforge.net`;
5. borra del directorio remoto los paquetes viejos de la misma familia;
6. descarga cada archivo público y compara los bytes con el repo local.

## Configuración del cliente

```ini
[x-kernel]
SigLevel = Required
Server = https://downloads.sourceforge.net/project/equislinux/kernel/x86_64

[x-kernel-mainline]
SigLevel = Required
Server = https://downloads.sourceforge.net/project/equislinux/kernel-mainline/x86_64
```

Un sync directo de pacman falla hoy porque pacman añade `.sig` a la query de la
URL redirigida (`GPGME error: No data`). El instalador del ISO lleva los
paquetes firmados y los instala en local. Los stanzas de arriba son la
configuración prevista cuando la base de datos pequeña se espeje en un host sin
redirección.

Publicado el 2026-11-13:

- stable `linux-x 7.3.4.arch1-1` y mainline `linux-x-mainline 7.4rc1-1`;
- paquetes, headers, docs, firmas, bases de datos y `SHA256SUMS`;
- verificación de bytes públicos descargando de nuevo cada archivo subido.

## Seguridad

- La clave SSH de SourceForge y la clave de firma nunca se guardan en el repo.
- La publicación requiere `--yes`; nunca la ejecutes desde CI.
- La CI es solo un watcher. Los builds y la publicación mensual son manuales.
- Nunca borres `[x]`, ISOs, metadatos web ni kernels de Arch de SourceForge.
