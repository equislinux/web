# Diseño del X Kernel

`linux-x` y `linux-x-mainline` son paquetes downstream, no forks del kernel.
El delta es deliberadamente pequeño: la receta upstream mantiene el control de
las fuentes, la configuración, los parches y los checksums.

## Canales y deltas

### stable / testing — empaquetado de Arch

- `pkgbase=linux` → `pkgbase=linux-x`.
- `pkgdesc='Linux'` → `pkgdesc='Linux X'`.
- Nada más cambia: mismo `config.x86_64`, fuentes, parches, checksums y
  funciones de paquetes divididos que el tag de empaquetado de Arch.

El PKGBUILD de Arch usa `${pkgbase#linux}` para `localversion.20-pkgname`, así
que `linux-x` genera una release terminada en `-x` (por ejemplo
`7.3.4-arch1-1-x`). `stable` y `testing` comparten el nombre de paquete y el
repositorio `[x-kernel]`; solo stable se publica.

### mainline — AUR linux-mainline

- `pkgbase=linux-mainline` → `pkgbase=linux-x-mainline`.
- `pkgdesc="Linux Mainline"` → `pkgdesc="Linux X Mainline"`.
- Nada más cambia: misma fuente git mainline, `config.x86_64` y funciones de
  paquetes divididos que la receta de AUR.

La misma lógica de localversion genera una release terminada en `-x-mainline`.
Mainline usa una familia de paquetes y un repositorio `[x-kernel-mainline]`
separados, así que publicar stable no puede borrar los archivos de mainline.

## Nombres de paquete

- stable / testing: `linux-x`, `linux-x-headers`, `linux-x-docs`.
- mainline: `linux-x-mainline`, `linux-x-mainline-headers`,
  `linux-x-mainline-docs`.

Ninguno provee ni entra en conflicto con `linux` de Arch. Conviven y Arch sigue
siendo el kernel de fallback.

## initramfs y arranque

`mkinitcpio` genera `/etc/mkinitcpio.d/<pkgbase>.preset` y el par
`/boot/vmlinuz-<pkgbase>` + `/boot/initramfs-<pkgbase>.img` desde
`usr/lib/modules/<release>/pkgbase`. Ninguno de los kernels X incluye un preset
personalizado.

## Controladores

Los drivers y el firmware in-tree siguen `config.x86_64` y son idénticos a
Arch. Los módulos out-of-tree necesitan DKMS y el paquete `-headers`
correspondiente. Los paquetes NVIDIA precompilados de Arch apuntan a `linux` y
no coinciden con ninguno de los kernels X.

## Build

`makechrootpkg` se ejecuta contra `/var/lib/archbuild/x-kernel-x86_64`, con
`PKGDEST`, `SRCDEST` y `LOGDEST` dentro del repositorio. La salida está aislada
por paquete y canal: `out/<pkgbase>/<channel>/`. No se usa
`pkgctl build --repo` porque un repositorio propio no tiene buildtool de
devtools.

## CI watcher

El único workflow es `.github/workflows/kernel-watch.yml`. Comprueba los tres
canales con `git`, `curl` y `jq`, y escribe una tabla de versiones en el resumen
del workflow. Nunca compila, firma, publica ni toca SourceForge. Los builds y la
publicación son manuales, y las claves de firma, `keys/env.sh`, `config.env` y
la clave SSH de SourceForge nunca entran en la CI.

## Actualizaciones

No se hace merge de Arch/AUR. Se obtiene la nueva receta upstream y se reaplica
el delta mínimo. `delta/apply.py` aborta si cambiaron las líneas esperadas del
`PKGBUILD` o el mecanismo `${pkgbase#linux}`; revisa el drift en vez de forzar
el build.
