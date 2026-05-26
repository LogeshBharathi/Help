export function SiteHeader() {
  return (
    <header className="border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            SSC Notice Intelligence Platform
          </p>
          <p className="mt-1 text-sm text-muted">
            Official SSC notices, organized like a focused content library.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/eligibility"
            className="inline-flex items-center gap-2 rounded-full border border-[#D95F2A]/30 bg-[#FDF0E8] px-4 py-2 text-sm font-semibold text-[#D95F2A] transition hover:border-[#D95F2A]/50"
            title="Eligibility checker"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            Eligibility
          </a>
          <a
            href="https://ssc.gov.in"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-hero-mid/30"
          >
            Visit SSC
          </a>
        </div>
      </div>
    </header>
  );
}
