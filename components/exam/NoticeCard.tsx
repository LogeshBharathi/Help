import type { NoticeRecord } from "@/lib/types";
import { formatNoticeDate, isRecentNotice } from "@/lib/format";
import { cn } from "@/lib/cn";

interface NoticeCardProps {
  notice: NoticeRecord;
  bookmarked: boolean;
  onToggleBookmark: (noticeId: string) => void;
  onOpenSummary: (notice: NoticeRecord) => void;
  onOpenContent: (notice: NoticeRecord) => void;
  onOpenTagging: (notice: NoticeRecord) => void;
}

export function NoticeCard({
  notice,
  bookmarked,
  onToggleBookmark,
  onOpenSummary,
  onOpenContent,
  onOpenTagging,
}: NoticeCardProps) {
  const summaryText = notice.summary ?? notice.autoSummary;
  const summaryLabel = notice.summary
    ? "Manual Summary"
    : notice.autoSummary
      ? "Extracted Summary"
      : null;

  const tags = notice.userPrimaryTag
    ? [notice.userPrimaryTag, ...notice.autoTags.filter((tag) => tag !== notice.userPrimaryTag)]
    : notice.autoTags;

  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-line bg-surface px-5 py-5 shadow-panel">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-hero-mid/15 bg-hero-deep px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
              {formatNoticeDate(notice.date)}
            </span>
            {isRecentNotice(notice.date) ? (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                New
              </span>
            ) : null}
          </div>

          <h3 className="max-w-4xl font-serif-ui text-xl font-semibold leading-snug text-ink">
            {notice.title}
          </h3>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="rounded-full border border-line px-3 py-1">
              Source record: {notice.sourceRecordId}
            </span>
            <span className="rounded-full border border-line px-3 py-1">
              Exam id: {notice.examId}
            </span>
          </div>

          {tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={`${notice.id}-${tag}`}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                    notice.userPrimaryTag && index === 0
                      ? "bg-hero-deep text-white"
                      : "border border-hero-mid/15 bg-[#eef5fb] text-hero-deep"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap gap-3 lg:max-w-[15rem] lg:justify-end">
          <button
            type="button"
            onClick={() => onOpenContent(notice)}
            className="rounded-full border border-hero-mid/20 bg-surface-soft px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-hero-mid/40"
          >
            View PDF
          </button>
          <a
            href={notice.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-hero-deep px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-hero-mid"
          >
            Download PDF
          </a>
          <button
            type="button"
            onClick={() => onOpenSummary(notice)}
            className="rounded-full border border-hero-mid/20 bg-surface-soft px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-hero-mid/40"
          >
            {notice.summary ? "Edit Summary" : "Add Manual Summary"}
          </button>
          <button
            type="button"
            onClick={() => onOpenTagging(notice)}
            className="rounded-full border border-hero-mid/20 bg-surface-soft px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-hero-mid/40"
          >
            {notice.userPrimaryTag ? "Edit Type" : "Set Type"}
          </button>
          <button
            type="button"
            onClick={() => onToggleBookmark(notice.id)}
            className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-hero-mid/30 hover:text-ink"
          >
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
      </div>

      {summaryText ? (
        <div className="mt-5 rounded-[1.2rem] border border-line bg-surface-soft p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              {summaryLabel}
            </p>
            {notice.extractedAt && !notice.summary ? (
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Extracted {formatNoticeDate(notice.extractedAt)}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-7 text-ink">{summaryText}</p>
        </div>
      ) : null}
    </article>
  );
}
