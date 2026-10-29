# web — documentation portal

`equislinux/web` is the documentation portal of the X Linux project. It
aggregates the published documentation of the organization and presents it with
a landing page and a browsable docs section, in English and Spanish.

The documentation is compiled under `content/<lang>/<section>/` in this
repository. The original guides live in each project repository; `web` keeps the
published copy. The private `ops` repository is intentionally excluded.

## Landing

The landing (`/en`, `/es`) gathers the downloads (ISO and the WSL rootfs), a
screenshot showcase, the "Why X" feature grid and an install guide in four
steps — all in the same monochrome design system as the docs. Screenshots live
only in `public/showcase/`.

## Stack

- **Next.js** (App Router) with a fully static export.
- **Tailwind CSS 4** with a monochrome design system: black and gray scales in the
  light theme, white and gray scales in the dark theme.
- **Geist** Sans and Mono, with a light/dark toggle.
- **react-markdown** + **remark-gfm** to render the markdown under `content/`.

## Adding or updating a page

1. Add or edit the markdown file under `content/en/<section>/` and
   `content/es/<section>/`.
2. Register new files in the `SECTIONS` manifest in `lib/docs.ts`.
3. Add the repository to `lib/site.ts` if it should appear in the landing grid.

## Build and deployment

`npm run build` produces a static export in `out/`. The site is served at
`https://equislinux.org` and hosted on Hostinger: upload the **contents** of
`out/` to `public_html/` so the domain root contains `index.html`, `_next/`, `showcase/`, etc. There is no server runtime and
no GitHub Pages workflow. Hostinger only serves the page: ISOs stay on
SourceForge and `/download/latest/` redirects there.

The export runs from the domain root; `basePath` is empty by default. Set
`NEXT_PUBLIC_BASE_PATH` at build time only if the portal is hosted under a
subdirectory (the same value feeds `lib/site.ts`). `trailingSlash: true` makes
every route a directory with an `index.html`, which Apache/LiteSpeed serves
without extra configuration.
