# Probar X Kernel

Las comprobaciones estáticas no son una prueba de arranque.

## Comprobaciones de build

`scripts/build.sh` firma los paquetes y ejecuta `verify-package.sh`:

- `pkgname`/`pkgbase` son los nombres de variante esperados;
- el release del kernel termina en `-x` (stable/testing) o `-x-mainline`
  (mainline);
- `vmlinuz` y `pkgbase` están en el directorio de módulos;
- el paquete de headers contiene `build/Makefile`;
- las firmas de los paquetes verifican.

## QEMU

Arranca un sistema X/Arch desechable con el paquete construido y comprueba:

- `uname -r` termina en `-x` o `-x-mainline`;
- `mkinitcpio -P` produce el `initramfs-<pkgbase>.img` esperado;
- un módulo carga y `dkms status` muestra el kernel;
- la entrada del kernel anterior de Arch sigue arrancando.

No reemplaces el kernel del host ni las entradas de `/boot` desde un test
automático.

## Portátil

1. USB en vivo con un ISO de prueba que lleve el kernel X; prueba WiFi, GPU,
   audio, touchpad, suspensión/reanudación y pantallas externas sin tocar el
   disco.
2. Solo después, instálalo junto a `linux` de Arch y conserva la
   generación/entrada anterior y un USB en vivo disponibles.
3. Si NVIDIA/DKMS falla, arranca `linux` de Arch y elimina el kernel X; no
   fuerces el kernel nuevo como predeterminado.

Mainline es una línea en movimiento (ahora 7.4rc1). Trátalo como experimental:
pruébalo en QEMU o USB en vivo por separado de stable y no lo publiques como
kernel por defecto.

## Aceptación

Una publicación no se aprueba hasta que pasa la prueba en QEMU y el usuario
acepta el resultado en hardware real. Las pruebas en hardware siguen siendo
manuales.
