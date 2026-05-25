import { ExamCoverageModal } from "@/components/ExamCoverageModal";
import { EXAM_CATEGORIES } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2.3rem] border border-white/20 bg-gradient-to-br from-hero-deep via-hero-mid to-[#31597d] px-6 py-10 text-white shadow-[0_30px_90px_rgba(9,26,48,0.22)] md:px-10 md:py-14">
      <div className="absolute -left-12 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.2fr,0.9fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
            Verified Government Source
          </p>
          <h1 className="mt-4 font-serif-ui text-5xl font-semibold leading-[1.05] md:text-6xl">
            Official SSC notices, organized for daily tracking.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/80">
            Browse official SSC PDFs by exam category, filter notices by time, keep
            your own AI summaries under each record, and stay anchored to the source
            website instead of scattered unofficial uploads.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ExamCoverageModal triggerLabel="View current tab coverage" />
            <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
              Extraction-first tab model
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/65">Categories</p>
            <p className="mt-3 text-3xl font-semibold">{EXAM_CATEGORIES.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/65">Source</p>
            <p className="mt-3 text-xl font-semibold">ssc.gov.in</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/65">Summaries</p>
            <p className="mt-3 text-xl font-semibold">SQLite-backed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
