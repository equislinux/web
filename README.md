<h1 align="center"> X Web </h1>

<div align="center">
  <p><b>Arch-based, snapshot-first Linux with a script-driven installer and its own package tooling.</b></p>
  <p>Documentation portal: landing + docs, in English and Spanish.</p>
  <p>
    <a href="https://equislinux.org">Live site</a> •
    <a href="https://github.com/equislinux/wiki">Wiki mirror</a> •
    <a href="https://github.com/equislinux/x-repo">Package repository</a> •
    <a href="https://github.com/equislinux/x-arm">aarch64 build</a>
  </p>
</div>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/license-GPL--3.0-blue.svg">
</p>

<hr />

## What this is

`equislinux/web` is the public documentation portal of the X Linux project:

- **Landing** — hero with the ISO download, screenshot showcase
  (`public/showcase/`), a "Why X" feature grid, install steps, the repository
  grid, the two packaging paths (pacman `[x]` and native `.xp` for `xpm`) and a
  docs call to action.
- **Docs** — every published repository of the organization documented in a
  browsable sidebar, rendered from markdown, with a language switch
  (English/Spanish).

The documentation is compiled in `content/<lang>/<section>/`. Each page links
back to its source file in this repository. The original guides live in each
project repository; this repo keeps the published copy used by the portal.

The private `ops` repository is **not** part of the portal and its documentation
must never be copied into `content/`.

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
  download/latest/page.tsx    # stable redirect to the newest ISO
components/                   # Navbar, Footer, Hero, Downloads, Showcase,
                              # Features, Install, RepoGrid, DocsShell, Markdown
content/
  en/<section>/<page>.md      # published documentation (English)
  es/<section>/<page>.md      # published documentation (Spanish)
data/
  releases.json               # newest ISO/WSL release (stable download link)
lib/
  docs.ts                     # sections manifest + markdown loaders
  i18n.ts                     # UI strings (en/es)
  site.ts                     # repository list
public/                       # logo, showcase screenshots and video
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export in ./out
npm run preview  # serve ./out locally (npx serve)
```

## Deployment (Hostinger)

The site is served at **https://equislinux.org** as a plain static export.
`npm run build` writes everything to `out/` and there is no server-side runtime:

1. Run `npm run build`.
2. Open the Hostinger file manager (or connect over SFTP/FTP).
3. Upload the **contents** of `out/` to `public_html/` (not the `out` folder
   itself). The root of the domain must contain `index.html`, `_next/`,
   `showcase/`, etc.
4. If Hostinger caches the site, purge the cache from hPanel.

Notes:

- The site is served from the domain root, so `basePath` is disabled by
  default. If it must live in a subdirectory, build with
  `NEXT_PUBLIC_BASE_PATH=/subdir npm run build`; the same value is used for the
  public assets in `lib/site.ts`.
- `trailingSlash: true` makes every route a directory with an `index.html`, so
  Apache/LiteSpeed on Hostinger serves `/en/docs/x/` without extra rules.
- `public/.htaccess` is copied to `out/` and sets the 404 page, disables
  directory listings and adds caching/compression on Hostinger. It is a hidden
  file: enable "show hidden files" in the Hostinger file manager or copy it over
  SFTP.
- The canonical URL is set with `SITE_URL` in `lib/site.ts`
  (`https://equislinux.org`); override it with `NEXT_PUBLIC_SITE_URL` only if the
  domain changes.
- There is no GitHub Pages workflow anymore: GitHub only stores the source and
  the history of the portal. Deploys are manual uploads of `out/`.
- Hostinger only serves the website. ISOs and packages stay on SourceForge and
  the `[x]` repository respectively; `/download/latest/` is just a redirect.
- `.nojekyll` and the old `deploy.yml` were removed with the migration.

## Adding or updating a page

1. Add or edit the markdown file under `content/en/<section>/` and
   `content/es/<section>/`.
2. Register new files in the `SECTIONS` manifest in `lib/docs.ts`.
3. Add or update the corresponding repository entry in `lib/site.ts` when the
   section belongs to a repo that should appear in the landing grid.
4. Run `npm run build`, check `out/`, and upload it to Hostinger.

Every page must exist in both languages. Internal `.md` links are rewritten by
`components/Markdown.tsx` to the equivalent docs route; relative files outside
the docs tree point to the section repository on GitHub.
