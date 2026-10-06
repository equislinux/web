# Documentación de X Linux

**X Linux** es una distribución minimalista basada en Arch, construida a partir de
los repositorios oficiales de Arch, con un instalador de texto guiado por scripts,
branding propio y una capa de aprovisionamiento.

Este sitio reúne la documentación de todos los repositorios de la organización
`equislinux` en inglés y español. Usa la barra lateral para navegar por componente, o
empieza por los temas de abajo.

## Qué vas a encontrar

- **X Linux** — la distribución: build del ISO, instalador y pruebas en VM.
- **X para WSL** — rootfs importable y configuración de WSL.
- **Scripts de WSL** — el setup de usuario amigable para WSL.
- **Scripts y CLI** — el payload de aprovisionamiento y el comando `x`.
- **xpm** — el gestor de paquetes en Rust.
- **xpkg** — el builder de paquetes en Rust.
- **x-repo** — el repositorio binario de paquetes y el portal de paquetes.
- **web** — este portal de documentación.

## Repositorios

| Repositorio | Rol |
|---|---|
| [`equislinux/x`](https://github.com/equislinux/x) | Distribución: perfil archiso, instalador de texto, build del ISO. |
| [`equislinux/wsl`](https://github.com/equislinux/wsl) | X Linux para WSL: rootfs importable y configuración. |
| [`equislinux/wsl-scripts`](https://github.com/equislinux/wsl-scripts) | Setup de usuario para WSL. |
| [`equislinux/scripts`](https://github.com/equislinux/scripts) | Payload de aprovisionamiento y CLI (`x`). |
| [`equislinux/xpm`](https://github.com/equislinux/xpm) | Gestor de paquetes nativo (formato ALPM). |
| [`equislinux/xpkg`](https://github.com/equislinux/xpkg) | Builder de paquetes nativo (recetas `XBUILD`). |
| [`equislinux/x-repo`](https://github.com/equislinux/x-repo) | Repositorio binario de paquetes (`[x]`) y portal de paquetes. |
| [`equislinux/wiki`](https://github.com/equislinux/wiki) | Fuentes de documentación de este sitio. |
| [`equislinux/web`](https://github.com/equislinux/web) | Este portal: landing y docs navegables. |

> La documentación se mantiene en [`equislinux/wiki`](https://github.com/equislinux/wiki) y se
> renderiza aquí. Cada página existe en inglés y español; usa el selector de idioma
> en la barra superior.
