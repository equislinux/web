# web — portal de documentación

`equislinux/web` es el portal de documentación del proyecto X Linux. Reúne la
documentación publicada de la organización y la presenta con una landing y una
sección de docs navegable, en inglés y español.

La documentación se compila en `content/<lang>/<section>/` de este repositorio.
Las guías originales viven en cada repositorio del proyecto; `web` mantiene la
copia publicada. El repositorio privado `ops` queda excluido a propósito.

## Landing

La landing (`/en`, `/es`) reúne las descargas (ISO y rootfs de WSL), una galería
de capturas, la parrilla "Por qué X" y una guía de instalación en cuatro pasos —
todo con el mismo sistema de diseño monocromo que los docs. Las capturas viven
solo en `public/showcase/`.

## Stack

- **Next.js** (App Router) con export totalmente estático.
- **Tailwind CSS 4** con un sistema de diseño monocromo: escala de negros y
  grises en el tema claro, blancos y grises en el oscuro.
- **Geist** Sans y Mono, con conmutador claro/oscuro.
- **react-markdown** + **remark-gfm** para renderizar el markdown de `content/`.

## Añadir o actualizar una página

1. Añade o edita el markdown en `content/en/<section>/` y
   `content/es/<section>/`.
2. Registra los archivos nuevos en el manifiesto `SECTIONS` de `lib/docs.ts`.
3. Añade el repositorio a `lib/site.ts` si debe aparecer en la parrilla de la
   landing.

## Build y despliegue

`npm run build` genera un export estático en `out/`. El sitio se sirve en
`https://equislinux.org` y se aloja en Hostinger: sube el **contenido** de
`out/` a `public_html/` para que la raíz del dominio contenga `index.html`, `_next/`, `showcase/`, etc. No hay runtime de
servidor ni workflow de GitHub Pages. Hostinger solo sirve la página: los ISOs
siguen en SourceForge y `/download/latest/` redirige allí.

El export se sirve desde la raíz del dominio; `basePath` está vacío por defecto.
Define `NEXT_PUBLIC_BASE_PATH` al compilar solo si el portal vive en un
subdirectorio (el mismo valor alimenta `lib/site.ts`). `trailingSlash: true`
hace que cada ruta sea un directorio con `index.html`, que Apache/LiteSpeed
sirve sin configuración extra.
