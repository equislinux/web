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
| Escritorio (Hyprland/niri) en VM | Hyprland + shell de equisdots verificado en UTM (quickshell 0.3.2 desde ALARM); niri sin probar |
| CI | solo checks estáticos; la ISO necesita un host aarch64 |
| Secure Boot, Raspberry Pi, Asahi, ARMv7 | fuera de alcance |

### Arreglos de escritorio ARM (Hyprland)

El script compartido `scripts/tools/hyprland-install.sh` (x-scripts) está
orientado a x86_64. El overlay añade un wrapper solo para ARM
(`airootfs/usr/local/bin/x-hyprland-arm`) que el instalador invoca en su lugar;
los repositorios compartidos no se tocan:

- `quickshell` y `swayosd` vienen en `extra` de ALARM, así que el wrapper los
  instala como paquetes oficiales y nunca compila las versiones `-git` de AUR
  (yay + `quickshell-git` agota la memoria en una VM de 4 GiB). Si ya existen
  proveedores `quickshell-git`/`swayosd-git`, se detectan y respetan, así que
  el par oficial nunca entra en conflicto.
- La lista `OFFICIAL` se filtra contra las bases de datos de ALARM antes de la
  transacción (`rofi-emoji` no está en ALARM y abortaba toda la instalación);
  `pacman -Sy` corre primero porque la base de datos del live envejece y los
  mirrors eliminan versiones antiguas (404 en poppler/kirigami-addons).
- El `pacman.conf` del live y del destino activa `DisableDownloadTimeout`, y el
  mirrorlist solo lista hosts resolubles (`de.mirror` primero, geo como
  fallback; los subdominios `us.`/`ca.` ya no existen).
- El SDK de plugins de equisdots (`core/sdk/PluginHost.qml`) solo lo entrega el
  payload online de equisdots; el snapshot offline vendorizado no lo incluye,
  así que el modo online es la vía funcional del escritorio.
- Hyprland 0.57 limita `decoration.shadow.render_power` a 4 mientras que los
  ajustes de equisdots traen 5 (cada sesión muestra un banner de error de
  configuración): el wrapper lo recorta a 4.
- En una GPU virtual (virtio-gpu/virgl, p. ej. UTM/QEMU) el wrapper además
  desactiva el overlay `Floating` de equisdots (se dibuja opaco y cubre todo el
  escritorio) e instala un shim `~/.local/bin/kitty` que exporta
  `LIBGL_ALWAYS_SOFTWARE=1` (virgl solo expone GLES y kitty necesita GL de
  escritorio). Ambos ajustes se limitan a `virtio_gpu`; el hardware real
  conserva el stack original.

## Requisitos

Host de compilación: **Arch Linux ARM aarch64**, root, ~15 GiB libres. En un
MacBook eso significa una VM Arch Linux ARM en UTM (ver [Build](build.md)). El
builder Docker ejecuta el mismo pipeline dentro de un contenedor Arch Linux ARM
en cualquier host Docker (ver [Builder Docker](docker.md)).

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
docker/                 rootfs ALARM fijado y contenedor de build
prepare/                parches candidatos para repositorios upstream
docs/                   docs de build es/en y criterios de aceptación
```

## Reglas de diseño

- `x`, `x-repo` y `web` se consumen de solo lectura; las únicas escrituras van a
  `x-arm/out` (gitignored).
- El overlay se aplica sobre un checkout limpio cada vez, así el build es
  reproducible y un archivo viejo no puede colarse.
- No se commitean ISOs, `.qcow2`, `.raw` ni bundles `.utm`; van a SourceForge.
- El comportamiento x86_64 no cambia por construcción.

Ver [Build](build.md) para el flujo completo, [Builder Docker](docker.md) para
builds en contenedor, [VM](vm.md) para UTM/QEMU, [Aceptación](acceptance.md)
para los criterios de salida de una release y [Parches candidatos](prepare.md)
para los borradores dirigidos a repositorios upstream.
