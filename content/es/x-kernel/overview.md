# Kernel de X

**X Kernel** publica kernels downstream con marca X. No es un fork del árbol
de fuentes de Linux: `linux-x` se construye desde la **receta de empaquetado**
de Arch para los canales stable y testing, y `linux-x-mainline` desde la receta
`linux-mainline` de AUR. Solo cambian el `pkgbase` y la descripción.

Estado: **publicado como fuente y binarios; no es el kernel por defecto**.
`linux-x 7.3.4.arch1-1` (stable) y `linux-x-mainline 7.4rc1-1` (mainline) están
construidos, firmados y publicados en SourceForge. El ISO 2026.11.14 incluye
ambos y el instalador permite seleccionarlos. Los kernels `linux`, `linux-lts`
y `linux-zen` de Arch siguen siendo los soportados por defecto.

## Canales

| Canal | Upstream | Paquete X | Repositorio | Actual |
|---|---|---|---|---|
| `stable` | Arch `core/linux` | `linux-x` | `[x-kernel]` | 7.3.4.arch1-1 |
| `testing` | Arch `core-testing/linux` | `linux-x` | preview local | 7.3.4.arch1-2 |
| `mainline` | AUR `linux-mainline` | `linux-x-mainline` | `[x-kernel-mainline]` | 7.4rc1-1 |

`arch1` es la revisión de parches de Arch; los sufijos `-x` y `-x-mainline` son
las marcas de X que añade la lógica de localversion upstream. Stable y mainline
viven en repositorios separados, así publicar uno nunca borra el otro.

## Qué hace

- Obtiene el tag de empaquetado de Arch (stable/testing) o el HEAD de AUR
  `linux-mainline` (mainline).
- Aplica un delta mínimo: `pkgbase` y `pkgdesc`. Fuentes, `config.x86_64`,
  parches, checksums y funciones de paquetes divididos quedan como los provee
  upstream.
- Construye los paquetes kernel, headers y docs en un chroot limpio de
  `makechrootpkg`.
- Firma los paquetes y la base de datos de la variante con la clave del
  proyecto.
- Publica los binarios en SourceForge FRS porque un paquete de kernel supera el
  límite de 100 MB por archivo de GitHub Pages. Stable y mainline tienen
  directorios separados.
- La CI es solo un watcher. Las compilaciones y la publicación son manuales.

Los kernels X no proveen ni entran en conflicto con `linux` de Arch, así que
pueden convivir; Arch sigue siendo la entrada de fallback.

## Repositorio

- Fuentes y guías: <https://github.com/equislinux/x-kernel>
- Licencia: GPL-3.0-or-later para los scripts. Las recetas de kernel siguen el
  empaquetado de Arch/AUR y las licencias upstream de Linux.
- Guía de build e instalación: [manual](manual.md)
- Detalles de publicación: [publicación](publishing.md)
- Validación: [pruebas](testing.md)
