import Link from "next/link";

export function EligibilityEntryCard() {
  return (
    <Link
      href="/eligibility"
      className="group flex items-center gap-5 overflow-hidden rounded-[1.8rem] border border-[#D95F2A]/25 bg-gradient-to-br from-[#FDF0E8] via-surface to-surface p-6 shadow-panel transition hover:border-[#D95F2A]/45"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D95F2A] text-white shadow-[0_12px_30px_rgba(217,95,42,0.35)] transition group-hover:scale-105">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D95F2A]">
          Eligibility checker
        </p>
        <h2 className="mt-1 font-serif-ui text-xl font-semibold text-ink">
          Check if you qualify for SSC exams
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Save your profile once — see eligible / not eligible on every exam tab. CGL 2026 May
          update included.
        </p>
      </div>
      <span className="hidden shrink-0 font-semibold text-[#D95F2A] sm:inline">Open →</span>
    </Link>
  );
}
