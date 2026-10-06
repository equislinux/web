# web — portal de documentación

`equislinux/web` es el portal de documentación del proyecto X Linux. Reúne la
documentación de todos los repositorios (con origen en `equislinux/wiki`) y la presenta
con una landing y una sección de docs navegable, en inglés y español.

## Stack

- **Next.js** (App Router) con export estático a GitHub Pages.
- **Tailwind CSS 4** con un sistema de diseño monocromo: escalas de negro y grises
  en el tema claro, escalas de blanco y grises en el tema oscuro.
- **Geist** Sans y Mono, con toggle claro/oscuro.
- **react-markdown** + **remark-gfm** para renderizar el markdown de `content/`.

## Añadir o actualizar una página

1. Añade o edita el markdown en `content/en/<seccion>/` y `content/es/<seccion>/`.
2. Registra los archivos nuevos en el manifiesto `SECTIONS` de `lib/docs.ts`.
3. Haz push a `main`; el workflow de deploy publica el sitio.

## Despliegue

`.github/workflows/deploy.yml` ejecuta `npm ci && npm run build` y despliega el
export estático (`out/`) en GitHub Pages. El sitio se sirve bajo el base path `/web`
en `https://equislinux.github.io/web/`.
