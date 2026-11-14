import type { NextConfig } from "next";

// The portal is a fully static export: `npm run build` writes `out/` and that
// directory is uploaded as-is to Hostinger (public_html). The site is served
// from the domain root, so there is no basePath by default. If it ever needs to
// live in a subdirectory, build with NEXT_PUBLIC_BASE_PATH=/subdir.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
