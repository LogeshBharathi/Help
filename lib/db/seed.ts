import fs from "fs";
import path from "path";
import type Database from "better-sqlite3";

import { CATEGORY_CONFIG } from "@/lib/categories";
import type { ExamCategory } from "@/lib/constants";
import { NOTICE_CUTOFF_DATE } from "@/lib/constants";
import type { NoticeRecord } from "@/lib/types";

interface SeedBundle {
  category: ExamCategory;
  fullName: string;
  notices: NoticeRecord[];
  syncedAt?: string | null;
  sourceVerifiedOn?: string;
}

function upsertNotice(db: Database.Database, notice: NoticeRecord) {
  db.prepare(
    `INSERT INTO notices (
      id, source_record_id, title, date, pdf_url, category, exam_id, content_type,
      summary, auto_summary, user_primary_tag, auto_tags, pdf_text, pdf_text_preview,
      has_extracted_text, page_count, extracted_at, updated_at
    ) VALUES (
      @id, @sourceRecordId, @title, @date, @pdfUrl, @category, @examId, @contentType,
      @summary, @autoSummary, @userPrimaryTag, @autoTags, @pdfText, @pdfTextPreview,
      @hasExtractedText, @pageCount, @extractedAt, @updatedAt
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      date = excluded.date,
      pdf_url = excluded.pdf_url,
      summary = excluded.summary,
      auto_summary = excluded.auto_summary,
      user_primary_tag = excluded.user_primary_tag,
      auto_tags = excluded.auto_tags,
      pdf_text = excluded.pdf_text,
      pdf_text_preview = excluded.pdf_text_preview,
      has_extracted_text = excluded.has_extracted_text,
      page_count = excluded.page_count,
      extracted_at = excluded.extracted_at,
      updated_at = excluded.updated_at`
  ).run({
    id: notice.id,
    sourceRecordId: notice.sourceRecordId,
    title: notice.title,
    date: notice.date,
    pdfUrl: notice.pdfUrl,
    category: notice.category,
    examId: notice.examId,
    contentType: notice.contentType,
    summary: notice.summary,
    autoSummary: notice.autoSummary,
    userPrimaryTag: notice.userPrimaryTag,
    autoTags: JSON.stringify(notice.autoTags ?? []),
    pdfText: null,
    pdfTextPreview: notice.pdfTextPreview,
    hasExtractedText: notice.hasExtractedText ? 1 : 0,
    pageCount: notice.pageCount,
    extractedAt: notice.extractedAt,
    updatedAt: notice.updatedAt,
  });
}

function createPlaceholderNotices(category: ExamCategory): NoticeRecord[] {
  const config = CATEGORY_CONFIG[category];
  const now = new Date().toISOString();

  return config.examIds.slice(0, 2).map((examId, index) => ({
    id: `${category.toLowerCase()}-seed-${index}`,
    sourceRecordId: `${category.toLowerCase()}-seed-${index}`,
    title: `${config.fullName} — sample notice ${index + 1}`,
    date: new Date(Date.now() - index * 86400000 * 14).toISOString(),
    pdfUrl:
      "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/sample.pdf",
    category,
    examId,
    contentType: "notice-boards",
    summary: null,
    autoSummary:
      index === 0
        ? "Auto-generated summary placeholder for local development."
        : null,
    userPrimaryTag: index === 0 ? "Announcement" : null,
    autoTags: index === 0 ? ["Announcement"] : [],
    pdfTextPreview: null,
    hasExtractedText: false,
    pageCount: null,
    extractedAt: null,
    updatedAt: now,
  }));
}

function loadSeedBundle(category: ExamCategory): SeedBundle | null {
  const seedPath = path.join(process.cwd(), "data", `seed-${category.toLowerCase()}.json`);
  if (!fs.existsSync(seedPath)) return null;

  const raw = JSON.parse(fs.readFileSync(seedPath, "utf8")) as SeedBundle;
  return raw;
}

export function seedDatabaseIfEmpty(db: Database.Database) {
  const countRow = db.prepare("SELECT COUNT(*) as count FROM notices").get() as {
    count: number;
  };

  if (countRow.count > 0) return;

  const categories = Object.keys(CATEGORY_CONFIG) as ExamCategory[];

  for (const category of categories) {
    const bundle = loadSeedBundle(category);
    const notices = bundle?.notices?.length
      ? bundle.notices
      : createPlaceholderNotices(category);

    const filtered = notices.filter(
      (notice) => new Date(notice.date) >= NOTICE_CUTOFF_DATE
    );

    for (const notice of filtered) {
      upsertNotice(db, notice);
    }

    const pending = filtered.filter((n) => !n.hasExtractedText).length;

    db.prepare(
      `INSERT INTO sync_state (category, synced_at, source_verified_on, pending_enrichment_count)
       VALUES (@category, @syncedAt, @sourceVerifiedOn, @pendingEnrichmentCount)
       ON CONFLICT(category) DO UPDATE SET
         synced_at = excluded.synced_at,
         source_verified_on = excluded.source_verified_on,
         pending_enrichment_count = excluded.pending_enrichment_count`
    ).run({
      category,
      syncedAt: bundle?.syncedAt ?? new Date().toISOString(),
      sourceVerifiedOn: bundle?.sourceVerifiedOn ?? "2026-04-03",
      pendingEnrichmentCount: pending,
    });
  }
}
