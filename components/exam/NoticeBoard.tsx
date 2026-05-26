"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { EligibilityBadge } from "@/components/eligibility/EligibilityBadge";
import { ExamCoverageModal } from "@/components/ExamCoverageModal";
import { evaluateCategory } from "@/lib/eligibility/evaluate";
import { useEligibilityProfile } from "@/lib/hooks/useEligibilityProfile";
import { NoticeCard } from "@/components/exam/NoticeCard";
import { NoticeContentModal } from "@/components/exam/NoticeContentModal";
import { NoticeSkeletonList } from "@/components/exam/NoticeSkeleton";
import { SummaryModal } from "@/components/exam/SummaryModal";
import { TagModal } from "@/components/exam/TagModal";
import { CATEGORY_CONFIG } from "@/lib/categories";
import {
  COVERAGE_MODE_LABELS,
  NOTICE_TYPES,
  NOTICES_PAGE_SIZE,
  type ExamCategory,
} from "@/lib/constants";
import { formatNoticeDate, yearOptions } from "@/lib/format";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { MONTH_OPTIONS } from "@/lib/months";
import type { CategoryNoticesResponse, NoticeRecord } from "@/lib/types";

interface NoticeBoardProps {
  category: ExamCategory;
}

async function fetchNotices(url: string): Promise<CategoryNoticesResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Unable to load notices right now.");
  }
  return response.json();
}

export function NoticeBoard({ category }: NoticeBoardProps) {
  const config = CATEGORY_CONFIG[category];

  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const [summaryNotice, setSummaryNotice] = useState<NoticeRecord | null>(null);
  const [contentNotice, setContentNotice] = useState<NoticeRecord | null>(null);
  const [tagNotice, setTagNotice] = useState<NoticeRecord | null>(null);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { profile, hasProfile } = useEligibilityProfile();
  const eligibility = evaluateCategory(profile, category);

  const deferredSearch = useDeferredValue(searchInput);
  const debouncedFilters = useDebouncedValue(
    JSON.stringify({
      selectedYear,
      selectedMonth,
      selectedType,
      search: deferredSearch.trim().toLowerCase(),
    })
  );

  const { data, error, isLoading, mutate } = useSWR(
    `/api/notices?category=${category}`,
    fetchNotices,
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );

  const filters = JSON.parse(debouncedFilters) as {
    selectedYear: string;
    selectedMonth: string;
    selectedType: string;
    search: string;
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  const filteredNotices = useMemo(() => {
    const notices = data?.notices ?? [];

    return notices.filter((notice) => {
      const published = new Date(notice.date);
      const tags = notice.userPrimaryTag
        ? [
            notice.userPrimaryTag,
            ...notice.autoTags.filter((tag) => tag !== notice.userPrimaryTag),
          ]
        : notice.autoTags;

      const yearMatch =
        filters.selectedYear === "all" ||
        String(published.getFullYear()) === filters.selectedYear;
      const monthMatch =
        filters.selectedMonth === "all" ||
        String(published.getMonth()) === filters.selectedMonth;
      const typeMatch =
        filters.selectedType === "all" || tags.includes(filters.selectedType);
      const searchMatch =
        !filters.search ||
        notice.title.toLowerCase().includes(filters.search) ||
        notice.examId.toLowerCase().includes(filters.search);

      return yearMatch && monthMatch && typeMatch && searchMatch;
    });
  }, [data?.notices, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / NOTICES_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * NOTICES_PAGE_SIZE,
    currentPage * NOTICES_PAGE_SIZE
  );

  return (
    <>
      {hasProfile ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-line bg-surface px-4 py-3 shadow-panel">
          <p className="text-sm text-muted">
            <span className="font-semibold text-ink">Your eligibility:</span> {eligibility.summary}
          </p>
          <div className="flex items-center gap-3">
            <EligibilityBadge status={eligibility.status} />
            <Link
              href={`/exam/${category}?view=eligibility`}
              className="text-xs font-semibold text-accent hover:text-accent-strong"
            >
              Full details
            </Link>
          </div>
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-hero-deep via-hero-mid to-[#31597d] px-6 py-8 text-white shadow-[0_30px_80px_rgba(9,26,48,0.24)] md:px-8">
        <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              Official SSC Notice Feed
            </p>
            <h1 className="mt-3 font-serif-ui text-4xl font-semibold leading-tight md:text-5xl">
              {config.fullName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
              Browse official PDFs, save manual summaries, and track notices against the
              verified SSC source trail. This tab also shows how it maps back to your
              founder&apos;s official exam tree.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <ExamCoverageModal category={category} triggerLabel="View tab coverage" />
              <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                {COVERAGE_MODE_LABELS[config.coverageMode]}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.3rem] border border-white/15 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/65">Category</p>
              <p className="mt-2 text-lg font-semibold">{category}</p>
            </div>
            <div className="rounded-[1.3rem] border border-white/15 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/65">Synced</p>
              <p className="mt-2 text-lg font-semibold">
                {data?.syncedAt ? formatNoticeDate(data.syncedAt) : "Pending"}
              </p>
            </div>
            <div className="rounded-[1.3rem] border border-white/15 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/65">Verified On</p>
              <p className="mt-2 text-lg font-semibold">
                {data?.sourceVerifiedOn ?? "2026-04-03"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[1.8rem] border border-line bg-surface p-5 shadow-panel md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Official Exam Mapping
            </p>
            <h2 className="mt-2 font-serif-ui text-2xl font-semibold text-ink">
              This tab currently covers {config.officialReferences.length} official exam
              {config.officialReferences.length === 1 ? "" : "s"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              We are keeping the extraction logic stable first. Direct tabs stay one-to-one,
              and grouped tabs remain bundled until you finalize the long-term tagging model.
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-dashed border-line bg-surface-soft px-4 py-3 text-sm leading-6 text-muted lg:max-w-sm">
            {config.coverageNote ??
              "This tab maps directly to the SSC exam family shown below."}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {config.officialReferences.map((reference) => (
            <div
              key={`${category}-${reference.shortLabel}`}
              className="rounded-[1.3rem] border border-line bg-white px-4 py-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                {reference.shortLabel}
              </p>
              <h3 className="mt-2 text-base font-semibold leading-7 text-ink">
                {reference.fullLabel}
              </h3>
              {reference.note ? (
                <p className="mt-2 text-sm leading-6 text-muted">{reference.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[1.8rem] border border-line bg-surface p-5 shadow-panel md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Filters and Search
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Filters are applied client-side with a debounced update for fast browsing.
              Notices now cover the period from 01 Jan 2024 through{" "}
              {data?.sourceVerifiedOn ?? "2026-04-03"}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void mutate()}
            className="rounded-full border border-hero-mid/20 bg-surface-soft px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-hero-mid/40"
          >
            Refresh Notices
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr,0.75fr,0.75fr,0.9fr]">
          <label className="text-sm font-semibold text-ink">
            Search title or exam id
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search notices, result write-ups, corrigenda..."
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
            />
          </label>

          <label className="text-sm font-semibold text-ink">
            Year
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
            >
              <option value="all">All years</option>
              {yearOptions().map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold text-ink">
            Month
            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
            >
              {MONTH_OPTIONS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold text-ink">
            Type
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
            >
              <option value="all">All types</option>
              {NOTICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Notice Archive
            </p>
            <h2 className="mt-2 font-serif-ui text-2xl font-semibold text-ink">
              {filteredNotices.length} notice{filteredNotices.length === 1 ? "" : "s"} available
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Extracted summaries and tags are generated from the official PDF text and stored
              locally for faster reloads.
            </p>
            {data?.pendingEnrichmentCount ? (
              <p className="mt-2 text-sm font-medium text-accent">
                Document extraction is still running for {data.pendingEnrichmentCount} notice
                {data.pendingEnrichmentCount === 1 ? "" : "s"}.
              </p>
            ) : null}
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-accent transition hover:text-accent-strong"
          >
            Back to categories
          </Link>
        </div>

        {isLoading ? <NoticeSkeletonList /> : null}

        {error ? (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-red-900">
            <p className="text-sm font-semibold uppercase tracking-[0.22em]">Error</p>
            <p className="mt-3 text-sm leading-6">{error.message}</p>
            <button
              type="button"
              onClick={() => void mutate()}
              className="mt-5 rounded-full bg-red-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </div>
        ) : null}

        {!isLoading && !error && filteredNotices.length === 0 ? (
          <div className="rounded-[1.8rem] border border-dashed border-line bg-surface-soft px-6 py-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">
              Empty State
            </p>
            <h3 className="mt-4 font-serif-ui text-3xl font-semibold text-ink">No notices found</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">
              Try another year, change the month, or clear the search term to see more official
              SSC notices.
            </p>
          </div>
        ) : null}

        {!isLoading && !error && paginatedNotices.length > 0 ? (
          <div className="space-y-4">
            {paginatedNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                bookmarked={isBookmarked(notice.id)}
                onToggleBookmark={toggleBookmark}
                onOpenSummary={setSummaryNotice}
                onOpenContent={setContentNotice}
                onOpenTagging={setTagNotice}
              />
            ))}
          </div>
        ) : null}

        {!isLoading && !error && filteredNotices.length > NOTICES_PAGE_SIZE ? (
          <div className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-line bg-surface p-4 shadow-panel sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage <= 1}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-hero-mid/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={currentPage >= totalPages}
                className="rounded-full bg-hero-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-hero-mid disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <SummaryModal
        notice={summaryNotice}
        onClose={() => setSummaryNotice(null)}
        onSaved={() => void mutate()}
      />
      <TagModal
        notice={tagNotice}
        onClose={() => setTagNotice(null)}
        onSaved={() => void mutate()}
      />
      <NoticeContentModal notice={contentNotice} onClose={() => setContentNotice(null)} />
    </>
  );
}
