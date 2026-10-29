# Documentación de X Linux

**X Linux** es una distribución basada en Arch y centrada en snapshots, con
instalador por scripts y tooling de paquetes propio: generaciones btrfs
arrancables, soporte multi-kernel, repositorio firmado `[x]` y endpoint nativo
`.xp`.

Este sitio reúne la documentación de todos los repositorios publicados de la
organización `equislinux` en inglés y español. Usa la barra lateral para navegar
por componente o empieza por los temas de abajo.

## Qué vas a encontrar

- **X Linux** — la distro: build del ISO, instalador, generaciones y pruebas en VM.
- **x-arm** — build overlay para aarch64, ISO, repositorio e imágenes de VM.
- **X para WSL** — rootfs importable y configuración de WSL.
- **Scripts de WSL** — setup de usuario para WSL, simple y directo.
- **Scripts y CLI** — payload de aprovisionamiento y el comando `x`.
- **xpm** — gestor de paquetes en Rust.
- **xpkg** — builder de paquetes en Rust.
- **x-repo** — repositorio binario de paquetes, publicación de releases y portal.
- **utils** — herramientas de operador: workspace, clonado, reglas sudo y claves de firma.
- **web** — este portal de documentación.

## Repositorios

| Repositorio | Rol |
|---|---|
| [`equislinux/x`](https://github.com/equislinux/x) | Distribución: perfil archiso, instalador de texto y build del ISO. |
| [`equislinux/x-arm`](https://github.com/equislinux/x-arm) | Build overlay aarch64: ISO, repositorio `[x]/aarch64` e imágenes de VM. |
| [`equislinux/wsl`](https://github.com/equislinux/wsl) | X Linux para WSL: rootfs importable y configuración. |
| [`equislinux/wsl-scripts`](https://github.com/equislinux/wsl-scripts) | Setup de usuario para WSL. |
| [`equislinux/scripts`](https://github.com/equislinux/scripts) | Payload de aprovisionamiento y CLI (`x`). |
| [`equislinux/xpm`](https://github.com/equislinux/xpm) | Gestor de paquetes nativo (formato ALPM). |
| [`equislinux/xpkg`](https://github.com/equislinux/xpkg) | Builder nativo de paquetes (recetas `XBUILD`). |
| [`equislinux/x-repo`](https://github.com/equislinux/x-repo) | Repositorio binario (`[x]`), releases y portal de paquetes. |
| [`equislinux/utils`](https://github.com/equislinux/utils) | Utilidades de operador: workspace, clonado, reglas sudo y claves. |
| [`equislinux/wiki`](https://github.com/equislinux/wiki) | Espejo de documentación (inglés/español). |
| [`equislinux/web`](https://github.com/equislinux/web) | Este portal: landing y docs navegables. |

> La documentación publicada se compila en este repositorio bajo
> `content/<lang>/<section>/`; las guías originales viven en cada repositorio
> del proyecto. Cada página existe en inglés y español; usa el conmutador de
> idioma de la barra superior. El repositorio privado `ops` no se publica aquí.
