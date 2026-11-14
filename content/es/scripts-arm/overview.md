# scripts-arm — delta aarch64

Compañero ARM-only de [`equislinux/scripts`](https://github.com/equislinux/scripts).
El payload upstream se consume **solo lectura en un commit fijado**; este repo
posee el delta aarch64 y construye el paquete que reemplaza `x-scripts` en
sistemas ARM.

## Por qué un repo separado

El motor de generaciones tiene forma x86_64: busca `/boot/vmlinuz-*`, empareja
`initramfs-<pkgbase>.img` y lee `/usr/lib/modules/<rel>/pkgbase`. `linux-aarch64`
de Arch Linux ARM instala `/boot/Image(.gz)`, `initramfs-linux.img` y no tiene
archivo `pkgbase`. Mantener el delta aquí implica que `equislinux/scripts` (y
por tanto x86_64, WSL y todo lo demás) nunca se modifica; cada cambio ARM es un
parche sobre un upstream fijado, revisado de forma aislada.

## Estructura

```text
vendor/scripts.sha                    commit fijado de equislinux/scripts
patch/generations-aarch64.patch       delta ARM (Image, fallback de pkgbase)
build.sh                              pin -> parche -> paquete x-scripts-arm
out/                                  paquetes construidos (gitignored)
```

## Build

```bash
./build.sh                      # aarch64 + makepkg, o el builder Docker de x-arm
../x-arm/docker/run.sh bash -lc 'cd /workspace/scripts-arm && ./build.sh'
```

Produce `out/x-scripts-arm-<ver>-any.pkg.tar.zst`; la identidad del paquete se
deriva del `packaging/PKGBUILD` upstream y provee/conflicta/reemplaza a
`x-scripts`. El resultado pertenece al repositorio `[x]/aarch64` publicado desde
`equislinux/x-arm-repo`.

## El delta

- `xkernel.sh`: añade `linux-aarch64` a la lista de kernels conocidos y un
  fallback de `xkernel_pkgbase_of()` (ALARM no trae archivo `pkgbase`).
- `xgen.sh`: archiva `/boot/Image(.gz)`, sintetiza `pkgbase=linux-aarch64` y
  acepta `Image*` en el emparejamiento legacy y el dedupe.

Cada fallback es condicional a `uname -m == aarch64` o a archivos que Arch
x86_64 no instala, así que el delta es inerte fuera de ARM.

## Política de sincronización

- Bumpea `vendor/scripts.sha` de forma deliberada al traer cambios upstream;
  reaplica el parche y ejecuta los tests upstream sobre el árbol parcheado
  (`bash test/validate.sh`) antes de publicar.
- El paquete hereda la licencia upstream (GPL-3.0-or-later). La publicación e
  integración con el instalador viven en `equislinux/x-arm` y
  `equislinux/x-arm-repo`.
