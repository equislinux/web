import releases from '@/data/releases.json';

export const dynamic = 'force-static';

// Stable entry point: always redirects to the ISO of the newest release listed
// in data/releases.json, so published links never need to change (the publish
// script only updates the JSON and the site redeploys).
export default function LatestDownload() {
  const data = releases as {
    releases?: { iso?: { url?: string; name?: string } }[];
  };
  const current = data.releases?.[0]?.iso;
  const url = current?.url ?? '/';

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
        X Linux
      </p>
      <h1 className="text-2xl font-semibold">Download the latest ISO</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Redirecting to{current?.name ? ` ${current.name}` : ' the download'}…
      </p>
      <a className="underline" href={url}>
        Continue to the download
      </a>
      <script
        dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(url)});` }}
      />
    </main>
  );
}
