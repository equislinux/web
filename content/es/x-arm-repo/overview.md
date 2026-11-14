# x-arm-repo — repositorio [x]/aarch64

Repositorio pacman estático para X Linux en aarch64, servido por GitHub Pages
desde el directorio `repo/aarch64/` de este repositorio.

## Configuración del cliente

```ini
[x]
SigLevel = Required
Server = https://equislinux.github.io/x-arm-repo/repo/aarch64
```

La clave de firma (`signing.pub`, `trustedkeys.gpg`) viaja junto a la base de
datos.

## Contenido

- `x.db` / `x.files` y sus copias comprimidas, firmadas con la clave del
  proyecto.
- Paquetes construidos (por ejemplo `x-release`, `x-wallpapers`, `x-dev`,
  `xfetch-bin`, `xtop-git` y `opencode-bin`), cada uno con su `.sig` detached.
- `SHA256SUMS` y `SHA256SUMS.sig`.

El repositorio lo produce el pipeline de build aarch64 de `equislinux/x-arm` y
lo consumen el ISO ARM y los sistemas instalados. x86_64 sigue usando
`equislinux/x-repo`.
