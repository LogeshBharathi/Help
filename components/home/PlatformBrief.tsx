export function PlatformBrief() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-[1.8rem] border border-line bg-surface px-6 py-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Platform Brief
        </p>
        <h2 className="mt-3 font-serif-ui text-3xl font-semibold text-ink">
          Centralized notice intelligence for serious exam tracking.
        </h2>
        <div className="mt-5 grid gap-4 text-sm leading-7 text-muted md:grid-cols-2">
          <p>
            Official PDFs are pulled from the verified SSC API and stored in a normalized
            local database so the app can stay responsive after the first sync.
          </p>
          <p>
            Category pages include date filters, fast client-side search, bookmarks, and
            a manual summary workflow that stays editable for each notice. They also
            auto-generate summary text and notice tags from the official PDFs.
          </p>
          <p>
            Current tabs now expose their founder-level exam references so grouped streams
            are visible and easier to reclassify later.
          </p>
        </div>
      </div>

      <div className="rounded-[1.8rem] border border-line bg-surface px-6 py-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Operational Notes
        </p>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
          <li>Only notices with attached PDFs are stored.</li>
          <li>Records are filtered from 01 January 2024 onward.</li>
          <li>Category sync uses retries, pacing, and in-memory response caching.</li>
          <li>Bookmarks are local. Manual and auto summaries persist in SQLite.</li>
        </ul>
      </div>
    </section>
  );
}
