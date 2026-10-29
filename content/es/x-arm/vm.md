# Imágenes de VM en ARM (Apple Silicon, QEMU)

La capa de VM es intencionadamente fina: la ISO aarch64 es una imagen UEFI
normal, y una VM es esa ISO (o un disco instalado) con dispositivos virtio.

## Qué producen los scripts

| Archivo | Uso |
|---|---|
| `x-<version>-aarch64.iso` | live/instalador; arranca en cualquier VM aarch64 |
| `x-<version>-aarch64.qcow2` | QEMU, UTM (backend QEMU), libvirt |
| `x-<version>-aarch64.raw` | Apple Virtualization.framework (UTM "Virtualize", Parallels, VMware) |

`build-vm.sh --export` escribe los tres más un `.sha256`.

## Detalles en Apple Silicon (M4)

- Una VM en un M4 es un **guest aarch64 con UEFI + virtio**. VirtualBuddy/UTM
  (backend Apple) usan Virtualization.framework; UTM (backend QEMU) usa QEMU+HVF.
- **Sin aceleración 3D.** `virtio-gpu` es solo framebuffer; Hyprland/niri corren
  sobre llvmpipe. Desactiva blur/animaciones para una sesión usable.
- **Rosetta** (userland x86_64 dentro del guest ARM) solo existe con el backend
  Apple Virtualization y necesita binfmt + librerías x86_64. No sustituye a los
  paquetes aarch64; no lo actives por defecto.
- Las carpetas compartidas usan virtiofs. El portapapeles/drag-and-drop depende
  del backend; no hay `open-vm-tools` ni Parallels Tools para Arch Linux ARM.
- El firmware `edk2` no está empaquetado en ALARM. Usa el que trae UTM, o instala
  `edk2-armvirt` desde AUR en el host de build. En macOS, el QEMU de Homebrew
  incluye `edk2-aarch64-code.fd`.

## Importar en UTM

1. `File > New > Virtualize` (rápido, backend Apple) o `Emulate` (backend QEMU).
2. Sistema operativo: Linux. Arquitectura: aarch64.
3. Memoria: 4096 MiB o más. CPU: 4 o más.
4. Almacenamiento: borra el disco por defecto y adjunta
   `x-<version>-aarch64.qcow2` (backend QEMU) o `.raw` (backend Apple).
5. Desactiva la aceleración 3D si aparece. Arranca.

Para instalar desde cero, crea un disco vacío, adjunta la ISO como CD-ROM e
instala. El instalador escribe un sistema UEFI con GRUB (`arm64-efi`) o
systemd-boot (`BOOTAA64.EFI`).

Instalación desatendida: `scripts/vm.sh --seed-json x-install.json --iso ...`
adjunta un volumen FAT etiquetado `cidata` con el JSON; elige la entrada
"autoinstall" de GRUB (pasa `xauto=1 console=ttyAMA0`).

## QEMU (Linux aarch64 o macOS arm64)

```bash
scripts/vm.sh --iso out/iso/x-*-aarch64.iso --disk out/vm/x-aarch64.qcow2
scripts/vm.sh --boot disk                 # sistema instalado, consola serie
scripts/vm.sh --boot disk --gui           # ventana virtio-gpu
scripts/vm.sh --print                     # muestra el comando resuelto
```

La aceleración se elige sola: KVM en Linux aarch64, HVF en macOS arm64, TCG en
el resto. TCG sirve para el instalador pero es demasiado lento para escritorio.

## Construir las imágenes

```bash
scripts/build-vm.sh --create      # qcow2 vacío
scripts/build-vm.sh --install     # arranca la ISO con scripts/vm.sh
scripts/build-vm.sh --install --seed-json x-install.json   # desatendido
scripts/build-vm.sh --export      # .qcow2 + .raw + .sha256 en out/vm/
```

## Limitaciones conocidas

- Sin aceleración GPU, sin decodificación de vídeo por hardware, sin 3D.
- La consola serie es `ttyAMA0` en `virt` (no `ttyS0`).
- Los device trees no se fusionan en la imagen del kernel (`stubble` no está en
  ALARM); QEMU `virt` no los necesita.

Ver [Build](build.md) para la ISO y el repositorio, y [Aceptación](acceptance.md)
para la checklist de release.
