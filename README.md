<h1 align="center"> X Web </h1>

<div align="center">
  <p><b>Documentation portal for X Linux: landing + docs, in English and Spanish.</b></p>
  <p>
    <a href="https://equislinux.github.io/web/">Live site</a> •
    <a href="https://github.com/equislinux/wiki">Docs sources</a> •
    <a href="https://github.com/equislinux/x-repo">Package repository</a>
  </p>
</div>

<p align="center">
  <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/equislinux/web/deploy.yml?branch=main&label=deploy">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/license-GPL--3.0-blue.svg">
</p>

<hr />

## What this is

`equislinux/web` is the public documentation portal of the X Linux project:

- **Landing** — hero, the repository grid, the two packaging paths (pacman `[x]`
  and native `.xp` for `xpm`) and a docs call to action.
- **Docs** — every repository of the organization documented in a browsable
  sidebar, rendered from markdown, with a language switch (English/Spanish).

The documentation sources live in [`equislinux/wiki`](https://github.com/equislinux/wiki)
and are copied into `content/<lang>/<section>/`. Each page links back to its
source on GitHub.

## Stack

- **Next.js 16** (App Router) with fully static export.
- **Tailwind CSS 4** with a monochrome design system (black/gray in light, white/gray
  in dark) and a light/dark toggle.
- **Geist** Sans and Mono via `next/font`.
- **react-markdown** + **remark-gfm** for the docs.

## Structure

```
app/
  page.tsx                    # English landing at the root
  [lang]/page.tsx             # /en and /es landings
  [lang]/docs/page.tsx        # docs home (overview + section cards)
  [lang]/docs/[...slug]/      # one route for every docs page
components/                   # Navbar, Footer, Hero, RepoGrid, DocsShell, Markdown
content/
  en/<section>/<page>.md      # documentation sources (English)
  es/<section>/<page>.md      # documentation sources (Spanish)
lib/
  docs.ts                     # sections manifest + markdown loaders
  i18n.ts                     # UI strings (en/es)
  site.ts                     # repository list
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000/web
npm run build    # static export in ./out
```

The site uses `basePath: /web` (GitHub Pages project path), so both the dev
server and the exported assets live under `/web`.

## Adding a page

1. Add the markdown under `content/en/<section>/` and `content/es/<section>/`.
2. Register the file in `SECTIONS` in `lib/docs.ts`.
3. Push to `main`: the deploy workflow builds and publishes to GitHub Pages.
