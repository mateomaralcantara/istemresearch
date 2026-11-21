import Link from "next/link";

export function BrandMark({ size = 20 }: { size?: number }) {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M5 19V11M10 19V6M15 19v-5M20 19V9" />
        <path d="M4 7.5 10 4l5 6 5-3.5" strokeWidth={1.6} opacity={0.75} />
      </svg>
    </span>
  );
}

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="ISTEM RESEARCH, inicio">
      <BrandMark />
      <span>
        ISTEM RESEARCH
        <small>Inteligencia · Investigación · Opinión</small>
      </span>
    </Link>
  );
}
