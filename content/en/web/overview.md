# web — documentation portal

`equislinux/web` is the documentation portal of the X Linux project. It aggregates the
documentation of every repository (sourced from `equislinux/wiki`) and presents it with a
landing page and a browsable docs section, in English and Spanish.

## Stack

- **Next.js** (App Router) with static export to GitHub Pages.
- **Tailwind CSS 4** with a monochrome design system: black and gray scales in the
  light theme, white and gray scales in the dark theme.
- **Geist** Sans and Mono, with a light/dark toggle.
- **react-markdown** + **remark-gfm** to render the markdown under `content/`.

## Adding or updating a page

1. Add or edit the markdown file under `content/en/<section>/` and
   `content/es/<section>/`.
2. Register new files in the `SECTIONS` manifest in `lib/docs.ts`.
3. Push to `main`; the deploy workflow publishes the site.

## Deployment

`.github/workflows/deploy.yml` runs `npm ci && npm run build` and deploys the static
export (`out/`) to GitHub Pages. The site is served under the `/web` base path at
`https://equislinux.github.io/web/`.
