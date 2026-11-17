# Manual del kernel de X

Guía práctica de los paquetes de kernel con marca X.

## Qué es

X Kernel es un downstream de recetas de empaquetado existentes, no un fork del
kernel:

- `linux-x` sigue la receta de empaquetado `linux` de Arch (stable/testing);
- `linux-x-mainline` sigue la receta `linux-mainline` de AUR.

El delta solo cambia el `pkgbase` y la descripción. El código del kernel,
`config.x86_64`, parches, checksums y la lógica de localversion quedan
upstream.

## Versiones actuales

| Canal | Paquete | Release del kernel | Repositorio de SourceForge |
|---|---|---|---|
| stable | `linux-x 7.3.4.arch1-1` | `7.3.4-arch1-1-x` | `[x-kernel]` |
| mainline | `linux-x-mainline 7.4rc1-1` | `7.4.0-rc1-1-x-mainline` | `[x-kernel-mainline]` |

## Instalar desde el ISO de X

1. Arranca el ISO 2026.11.15 y ejecuta `xinstall`.
2. Elige el backend de paquetes (`xpm` es la vía nativa; `pacman` es explícito).
3. Elige `linux-x (X stable)` o `linux-x-mainline (X mainline)`.
4. Completa la instalación, reinicia y selecciona la entrada X en el menú de
   arranque.

Los paquetes van incluidos en el ISO y firmados con la clave del proyecto. El
perfil full también instala `linux` de Arch, así que lo habitual es tener ambos
kernels con Arch como entrada por defecto. Confirma el kernel en ejecución con
`uname -r`: los releases X terminan en `-x` o `-x-mainline`.

## Repositorios de SourceForge

- stable: `https://downloads.sourceforge.net/project/equislinux/kernel/x86_64`
- mainline: `https://downloads.sourceforge.net/project/equislinux/kernel-mainline/x86_64`

Un `pacman -Sy` directo contra SourceForge choca hoy con el bug de redirección
de `.db.sig`. El ISO lo evita instalando los paquetes incluidos en local
(`xpm install <archivo>` o `pacman -U`). Los repositorios online siguen siendo
el espejo binario publicado.

## Actualizar la receta

No se hace merge de Arch/AUR. Para cada actualización upstream:

```bash
./scripts/check-upstream.sh --channel stable
./scripts/check-upstream.sh --channel mainline
./scripts/prepare-recipe.sh --channel stable
./scripts/prepare-recipe.sh --channel mainline
```

`delta/apply.py` se detiene si cambiaron las líneas esperadas del `PKGBUILD`
upstream o el mecanismo `${pkgbase#linux}`. Revisa el drift en vez de forzar el
build.

## Construir y publicar

```bash
./scripts/build.sh --channel stable
./scripts/publish.sh --channel stable --dry-run
./scripts/publish.sh --channel stable --yes

./scripts/build.sh --channel mainline
./scripts/publish.sh --channel mainline --dry-run
./scripts/publish.sh --channel mainline --yes
```

O usa el orquestador:

```bash
./scripts/release.sh --channel stable
./scripts/release.sh --channel mainline --publish --yes
```

Los builds usan `/var/lib/archbuild/x-kernel-x86_64` y escriben bajo
`out/<pkgbase>/<channel>/`. Nunca instalan ni activan el kernel en el host. La
publicación requiere `--yes`.

## Seguridad

- Los kernels X no proveen ni entran en conflicto con `linux` de Arch.
- Mantén `linux`/`linux-lts` de Arch instalado como fallback.
- Usa DKMS con el paquete `-headers` correspondiente para NVIDIA, ZFS o
  VirtualBox.
- Cuida `/boot`: X guarda copias de kernel/initramfs bajo `/boot/x/kernels` en
  un ESP de 1 GiB.
- Nunca publiques automáticamente; las claves y credenciales de SourceForge
  quedan fuera del repositorio.
