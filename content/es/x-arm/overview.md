# x-arm — X Linux para aarch64

`equislinux/x-arm` es el **build overlay aarch64** de X Linux. Consume
[`equislinux/x`](https://github.com/equislinux/x) fijado a un commit, aplica el
delta de `overlay/` y ejecuta archiso para producir:

- una ISO en vivo solo UEFI (`x-<version>-aarch64.iso`) para hardware real y VMs;
- un repositorio pacman `[x]/aarch64`;
- imágenes de VM para Apple Silicon (UTM/Parallels/VMware) y hosts `virt`.

Nada en este repositorio modifica `x`, `x-repo` ni `web`. El perfil x86_64 queda
intacto: es un árbol separado a propósito, para que un cambio ARM nunca se
mezcle en `main` por accidente.

## Estado

Es la primera iteración funcional. Mapa de paridad honesto:

| Área | Estado |
|---|---|
| Perfil archiso (UEFI/GRUB, arm64-efi) | hecho |
| `packages.aarch64` contra Arch Linux ARM | hecho |
| Pipeline (fetch → overlay → repo → ISO) | hecho |
| Repo `[x]/aarch64` (x-release, x-wallpapers, x-dev, xfetch, xtop) | hecho |
| Lanzador QEMU `virt` y export de imágenes de VM | hecho |
| Paridad del instalador (`x-installer`) | parche incluido, falta probar en hardware |
| `xgen`/`xkernel` (`Image`, sin `pkgbase`) | **pendiente** (el instalador degrada con aviso) |
| Escritorio (Hyprland/niri) en VM | funciona con render software, sin 3D |
| CI | solo checks estáticos; la ISO necesita un host aarch64 |
| Secure Boot, Raspberry Pi, Asahi, ARMv7 | fuera de alcance |

## Requisitos

Host de compilación: **Arch Linux ARM aarch64**, root, ~15 GiB libres. En un
MacBook eso significa una VM Arch Linux ARM en UTM (ver [Build](build.md)).

```bash
pacman -S --needed base-devel git grub squashfs-tools libisoburn libarchive \
  dosfstools mtools erofs-utils mkinitcpio-archiso systemd-ukify \
  arch-install-scripts rsync qemu-img qemu-system-aarch64 jq gnupg
```

`archiso` no está empaquetado en ALARM; `scripts/fetch-archiso.sh` clona upstream
archiso, que ya soporta aarch64 (`grub_target=arm64-efi`, `BOOTAA64.EFI`).

## Inicio rápido

```bash
# 1. resolver entradas
scripts/fetch-x.sh
scripts/fetch-archiso.sh

# 2. aplicar el overlay sobre el checkout fijado de x
scripts/apply-overlay.sh

# 3. construir el repo [x]/aarch64 (usuario normal) y después la ISO (root)
X_REPO_SIGN_KEY=... scripts/build-repo.sh --sign
sudo scripts/build-iso.sh

# 4. arrancar en local (QEMU) o instalar en un disco de VM
scripts/vm.sh --iso out/iso/x-*-aarch64.iso --disk out/vm/x-aarch64.qcow2
```

`build-iso.sh --no-repo` usa la URL publicada de `[x]/aarch64` en vez del repo
local (solo válido después de una release).

## Layout

```
vendor/x.sha            commit fijado de equislinux/x
vendor/archiso.sha      commit fijado de archlinux/archiso
overlay/                delta solo ARM
  profiledef.sh
  packages.aarch64
  pacman.aarch64.conf.in
  airootfs/             overrides del sistema en vivo (pacman, keyring, presets)
  grub/                 config GRUB para /boot/Image
  patches/              parches aplicados a vendor/x
  packages/             overrides aarch64 de paquetes [x]
scripts/                fetch, overlay, build, VM, publish
vm/                     notas UTM/QEMU y helpers de bundle
docs/                   docs de build es/en y criterios de aceptación
```

## Reglas de diseño

- `x`, `x-repo` y `web` se consumen de solo lectura; las únicas escrituras van a
  `x-arm/out` (gitignored).
- El overlay se aplica sobre un checkout limpio cada vez, así el build es
  reproducible y un archivo viejo no puede colarse.
- No se commitean ISOs, `.qcow2`, `.raw` ni bundles `.utm`; van a SourceForge.
- El comportamiento x86_64 no cambia por construcción.

Ver [Build](build.md) para el flujo completo, [VM](vm.md) para UTM/QEMU y
[Aceptación](acceptance.md) para los criterios de salida de una release.
