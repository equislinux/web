# Criterios de aceptación

Una release es publicable cuando todos los puntos están verificados en un host
aarch64 limpio.

## Entradas

- [ ] `vendor/x.sha` y `vendor/archiso.sha` fijan commits, no ramas.
- [ ] `scripts/fetch-x.sh` y `scripts/fetch-archiso.sh` funcionan desde un clon limpio.
- [ ] `scripts/apply-overlay.sh --check` pasa (todos los checks en verde).
- [ ] `git -C vendor/x status --porcelain` muestra solo los archivos esperados del overlay.

## Repositorio `[x]/aarch64`

- [ ] `scripts/build-repo.sh` produce `x.db` y un paquete por entrada por defecto.
- [ ] Test tipo `pacman -Sy --config /dev/null`: el índice de `repo-add` lista todos los paquetes.
- [ ] Cada paquete tiene `arch=aarch64` o `arch=any` (`pacman -Qi` o `bsdtar -xOf`).
- [ ] `x-release` instala `os-release` con `ID=x` y sin "Arch" en campos visibles.
- [ ] Con `--sign`, `gpg --verify` pasa para `x.db`, paquetes y `SHA256SUMS`.

## ISO

- [ ] `sudo scripts/build-iso.sh` termina con exit 0.
- [ ] La ISO contiene `EFI/BOOT/BOOTAA64.EFI`, `arch/boot/aarch64/Image` y
      `arch/boot/aarch64/initramfs-linux.img`.
- [ ] No hay `vmlinuz-linux`, ni arranque syslinux, ni `BOOTX64.EFI` en la ISO.
- [ ] `grub.cfg` y `loopback.cfg` apuntan a `/Image` e `initramfs-linux.img`.
- [ ] `x-<version>-aarch64.iso.sha256` coincide con un `sha256sum` fresco.

## Arranque (QEMU `virt`, edk2-aarch64)

- [ ] Aparece el menú GRUB por serie/GUI; la entrada por defecto arranca.
- [ ] El sistema en vivo llega al login.
- [ ] La consola serie es `ttyAMA0`; la entrada autoinstall pasa `xauto=1`.
- [ ] `pacman -Sy` funciona contra ALARM; `[x]` es de confianza tras `x-keyring.service`.
- [ ] `xinstall` arranca y el configurador ofrece `linux-aarch64`.

## Instalación

- [ ] La instalación wipe en un disco limpio termina (ESP + subvolúmenes btrfs).
- [ ] El sistema instalado arranca con GRUB `arm64-efi` (y con systemd-boot si se prueba).
- [ ] `/etc/pacman.conf` del destino contiene `[x]` apuntando a `.../aarch64`.
- [ ] El keyring del destino tiene `archlinuxarm` poblado y la clave X firmada.
- [ ] `uname -m` es `aarch64`; `pacman -Q linux-aarch64` funciona.
- [ ] La vía dualboot no toca una ESP existente ni entradas EFI ajenas.

## Entregables de VM

- [ ] `build-vm.sh --export` produce `.qcow2`, `.raw` y `.sha256`.
- [ ] El `.qcow2` arranca en UTM (backend QEMU) y el `.raw` en UTM (backend Apple).
- [ ] La sesión de escritorio (si se instala) arranca; blur/animaciones desactivados en docs.
- [ ] No se afirma aceleración 3D ni decodificación de vídeo por hardware en ningún sitio.

## Publicación

- [ ] `publish-arm.sh --dry-run` muestra la versión, tamaño y hash correctos.
- [ ] Los archivos subidos son `x-<version>-aarch64.iso`, `.sig`, `SHA256SUMS(.sig)`.
- [ ] `web/data/releases-arm.json` es JSON válido y no altera el índice x86_64
      (se añade con la primera release ARM).
- [ ] `publish-arm.sh --verify` descarga y coincide con el SHA-256.

## Regresiones

- [ ] `equislinux/x` main no se toca (`git -C ../x status` limpio).
- [ ] El build x86_64 no se ve afectado (ningún archivo compartido modificado).
- [ ] No se commitea ninguna ISO, qcow2, raw ni `.utm.zip` en ningún repositorio.
