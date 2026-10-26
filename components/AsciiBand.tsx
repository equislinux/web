import { UI, type Lang } from '@/lib/i18n';

export default function AsciiBand({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const layers = t.desktops.layers;

  const scrollRow = (copy: number) => (
    <span key={copy} className="x-ascii-chunk">
      <span className="x-ascii-mark">X</span>
      {layers.map((layer, index) => (
        <span key={`${copy}-${index}`} className="flex items-center gap-2">
          <span className="text-zinc-600">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-zinc-100">{layer.name}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-500">{layer.desc}</span>
          {index < layers.length - 1 ? <span className="text-zinc-700">▸</span> : null}
        </span>
      ))}
      <span className="x-ascii-cursor">▌</span>
    </span>
  );

  const bootRow = (copy: number) => (
    <span key={copy} className="x-ascii-chunk">
      {layers.map((layer, index) => (
        <span key={`${copy}-${index}`} className="flex items-center gap-2">
          <span className="text-emerald-400">[ OK ]</span>
          <span className="text-zinc-500">{layer.desc}</span>
          {index < layers.length - 1 ? <span className="text-zinc-700">·</span> : null}
        </span>
      ))}
    </span>
  );

  return (
    <section className="w-full overflow-hidden border-y border-zinc-800 bg-zinc-950 py-3 text-[11px] text-zinc-400">
      <p className="sr-only">{t.desktops.layersAlt}</p>
      <div className="x-ascii-band" aria-hidden="true">
        <div className="x-ascii-track font-mono uppercase tracking-[0.14em]">
          {[0, 1].map(scrollRow)}
        </div>
        <div className="x-ascii-track x-ascii-track-reverse mt-1 font-mono text-[10px] uppercase tracking-[0.12em]">
          {[0, 1].map(bootRow)}
        </div>
      </div>
    </section>
  );
}
