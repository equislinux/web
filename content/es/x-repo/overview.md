# Resumen

`equislinux/x-repo` es el repositorio del **repositorio de paquetes de X + portal
web** del ecosistema X Linux. Tiene dos roles que conviven en el mismo repo:

1. **Repositorio binario de paquetes** — los paquetes de X y la base de datos de
   pacman se confirman bajo `public/` y se sirven tal cual en GitHub Pages como
   repositorio pacman `[x]`. El mismo árbol incluye el endpoint nativo `.xp` bajo
   `public/x/`, consumido por `xpm`.
2. **Portal web** — una página Next.js que explica el repositorio (endpoints,
   uso de pacman/xpm, paquetes y flujo de publicación) y se exporta como sitio
   estático al mismo GitHub Pages.

Los paquetes **no** se construyen en CI. Se construyen en local, se confirman en
el repo y el workflow de despliegue solo reconstruye la web y publica todo el
árbol `public/` en GitHub Pages. Ver [web-portal.md](web-portal.md) y
[publishing.md](publishing.md).

## Rol dentro de la organización equislinux

Cada repositorio tiene un rol único y claro:

| Repositorio | Rol |
|---|---|
| `equislinux/x` | La distro. Perfil ArchISO, build del ISO/instalador y branding del sistema. |
| `equislinux/x-arm` | Build overlay aarch64: ISO, repositorio `[x]/aarch64` e imágenes de VM. |
| `equislinux/scripts` | Payload de aprovisionamiento y setup de usuario. Incluye la CLI `x` y construye el paquete `x-scripts`. |
| `equislinux/xpkg` | Builder de paquetes en Rust. Produce paquetes nativos `.xp` desde recetas `XBUILD`. |
| `equislinux/xpm` | Gestor de paquetes en Rust, la contraparte nativa de pacman. |
| `equislinux/x-repo` | **Repositorio binario + portal web** (este repositorio). |
| `equislinux/wsl` / `equislinux/wsl-scripts` | Rootfs de WSL y su setup de primer arranque. |
| `equislinux/utils` | Utilidades de operador: workspace, clonado, reglas sudo y claves. |
| `equislinux/wiki` / `equislinux/web` | Espejo de documentación y portal público (equislinux.org). |

Las dos vías de empaquetado conviven y ambas están activas:

- **PKGBUILD + makepkg** — paquetes compatibles con Arch (`.pkg.tar.zst`) que
  consume pacman. Esta vía llena el repositorio `[x]` en
  `public/repo/x86_64/`.
- **XBUILD + xpkg** — paquetes nativos (`.xp`) que consume `xpm`.
  `scripts/build-xp.sh` construye y firma el conjunto y regenera el endpoint
  nativo en `public/x/x86_64/` (base de datos, `history.json`, `SHA256SUMS`).

La distro sigue instalándose desde el canal pacman `[x]`; el endpoint nativo
`.xp` es el canal de `xpm` y se regenera junto al anterior en cada release. El
build aarch64 publica su propio repositorio `[x]/aarch64` desde
`equislinux/x-arm`; este repositorio sigue siendo el canal x86_64. Ver
[repo-layout.md](repo-layout.md) para el detalle y
[web-portal.md](web-portal.md) para la web.

## Qué vive en este repositorio

| Ruta | Propósito |
|---|---|
| `packages/` | Fuentes de paquetes. `PKGBUILD` (vía pacman) y, donde exista, `XBUILD` (vía nativa) por paquete. |
| `public/` | Contenido estático servido en Pages. `public/repo/x86_64/` contiene el repositorio pacman `[x]`; `public/x/x86_64/` el endpoint nativo `.xp`; el resto son assets de la web. |
| `build-packages.sh` | Script local para construir los paquetes de pacman y regenerar la base de datos. |
| `scripts/build-xp.sh` | Script local para construir y firmar el endpoint nativo `.xp`. |
| `app/` | Fuente del portal Next.js. |
| `.github/workflows/` | CI/CD. `build.yml` construye y despliega la web en GitHub Pages. |
| `docs/` | Documentación del repositorio (este directorio y `build-x-native-workflow.md`). |

El flujo completo de paquetes y releases está en
[publishing.md](publishing.md), con los pasos específicos del ISO en
[iso-releases.md](iso-releases.md).
