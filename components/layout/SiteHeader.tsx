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
        <a
          href="https://ssc.gov.in"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-hero-mid/30"
        >
          Visit SSC
        </a>
      </div>
    </header>
  );
}
