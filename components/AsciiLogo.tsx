import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ASCII_X = readFileSync(
  join(process.cwd(), 'public/logos/equisdots-ascii-shadow.txt'),
  'utf8',
).trimEnd();

export default function AsciiLogo({ className }: { className?: string }) {
  return (
    <pre
      aria-hidden="true"
      className={`ascii-mark m-0 select-none text-[10px] text-zinc-900 sm:text-[11px] md:text-xs dark:text-zinc-50 ${className ?? ''}`}
    >
      {ASCII_X}
    </pre>
  );
}
