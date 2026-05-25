export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Built against the official SSC API and tuned for fast notice browsing.</p>
        <p>SQLite summaries and local bookmarks are enabled by default.</p>
      </div>
    </footer>
  );
}
