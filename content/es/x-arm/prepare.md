# Parches candidatos

Borradores que aterrizarían en otros repositorios de EquisLinux. Nada de esto
lo aplica el pipeline de build de x-arm; cada archivo documenta su repositorio
destino, commit base y estado. Cuando se aprueba, el parche se convierte en una
rama y un PR en ese repositorio (nunca se sube sin aprobación explícita).

| Archivo | Repo destino | Commit base | Propósito | Estado |
|---|---|---|---|---|
| `generations-aarch64.patch` | `equislinux/scripts` | `21d43e3` (main, 2026-10-28) | Hacer que el motor de generaciones funcione en aarch64: `/boot/Image(.gz)`, sin `pkgbase`, `linux-aarch64` | Borrador; suite de tests headless en verde contra el árbol parcheado |

## generations-aarch64.patch

Contenido (el comportamiento x86_64 no cambia; cada fallback está detrás de
`uname -m == aarch64` o de la existencia de archivos `Image*`, que Arch x86_64
no instala):

- `install/helpers/xkernel.sh`
  - `xkernel_known()`: añade `linux-aarch64` en aarch64 (mantiene `X_KERNEL_KNOWN`).
  - Nuevo `xkernel_pkgbase_of()`: único punto para el fallback de ALARM (no hay
    archivo `pkgbase` en `/usr/lib/modules/<rel>/`).
  - `xkernel_release_of_pkgbase` / `xkernel_installed_pkgbases` /
    `xkernel_running_pkgbase` usan el helper; restaura la protección del kernel
    en ejecución en `x kernel remove`.
- `install/helpers/xgen.sh`
  - `xgen_capture_kernel`: archiva `/boot/Image` y `/boot/Image.gz`.
  - `kernels.tsv`: sintetiza `pkgbase=linux-aarch64` (v1: un solo kernel) y
    mapea el nombre del kernel a `Image.gz`/`Image`.
  - `xgen_pick_pair`: la vía legacy empareja `Image*` con el primer
    `initramfs-*.img`.
  - `xgen_state_unchanged`: compara también `Image*`, así el chequeo de dedupe
    nunca se salta un kernel cambiado.

No cubierto (seguido como P2 en el registro de decisión
`0002-aarch64-generations-strategy`): archivado de `/boot/dtbs` para
generaciones congeladas, fixtures de test aarch64, actualizaciones de docs y
soporte U-Boot.

Validación hecha: `bash -n` en ambos helpers y la suite headless completa de
`scripts` (`test/validate.sh`, secciones de generaciones + kernel) pasan contra
el árbol parcheado dentro del [builder Docker aarch64](docker.md). La vía
aarch64 real todavía necesita una ejecución en un sistema ARM instalado
(`x gen new` en la VM).

Ver [Aceptación](acceptance.md) para los checks de release y [Build](build.md)
para el pipeline del que estos parches se mantienen deliberadamente fuera.
