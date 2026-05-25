import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-[2rem] border border-line bg-surface px-6 py-16 text-center shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Not Found</p>
      <h1 className="mt-4 font-serif-ui text-4xl font-semibold text-ink">
        That exam category does not exist.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted">
        Choose one of the configured SSC categories to browse official notices and PDFs.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-hero-deep px-5 py-3 text-sm font-semibold text-white transition hover:bg-hero-mid"
      >
        Back to home
      </Link>
    </div>
  );
}
