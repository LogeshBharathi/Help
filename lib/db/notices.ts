import type { ExamCategory } from "@/lib/constants";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { getDb } from "@/lib/db/client";
import type {
  CategoryNoticesResponse,
  NoticeContent,
  NoticeRecord,
} from "@/lib/types";

interface NoticeRow {
  id: string;
  source_record_id: string;
  title: string;
  date: string;
  pdf_url: string;
  category: string;
  exam_id: string;
  content_type: string;
  summary: string | null;
  auto_summary: string | null;
  user_primary_tag: string | null;
  auto_tags: string;
  pdf_text: string | null;
  pdf_text_preview: string | null;
  has_extracted_text: number;
  page_count: number | null;
  extracted_at: string | null;
  updated_at: string;
}

function mapRow(row: NoticeRow): NoticeRecord {
  return {
    id: row.id,
    sourceRecordId: row.source_record_id,
    title: row.title,
    date: row.date,
    pdfUrl: row.pdf_url,
    category: row.category as ExamCategory,
    examId: row.exam_id,
    contentType: row.content_type,
    summary: row.summary,
    autoSummary: row.auto_summary,
    userPrimaryTag: row.user_primary_tag,
    autoTags: JSON.parse(row.auto_tags || "[]") as string[],
    pdfTextPreview: row.pdf_text_preview,
    hasExtractedText: Boolean(row.has_extracted_text),
    pageCount: row.page_count,
    extractedAt: row.extracted_at,
    updatedAt: row.updated_at,
  };
}

export function listNoticesByCategory(
  category: ExamCategory
): CategoryNoticesResponse {
  const db = getDb();
  const config = CATEGORY_CONFIG[category];

  const rows = db
    .prepare(
      `SELECT * FROM notices
       WHERE category = ?
       ORDER BY date DESC`
    )
    .all(category) as NoticeRow[];

  const sync = db
    .prepare(`SELECT * FROM sync_state WHERE category = ?`)
    .get(category) as
    | {
        synced_at: string | null;
        source_verified_on: string;
        pending_enrichment_count: number;
      }
    | undefined;

  const notices = rows.map(mapRow);

  return {
    category,
    fullName: config.fullName,
    notices,
    total: notices.length,
    syncedAt: sync?.synced_at ?? null,
    sourceVerifiedOn: sync?.source_verified_on ?? "2026-04-03",
    pendingEnrichmentCount: sync?.pending_enrichment_count ?? 0,
  };
}

export function getNoticeById(id: string): NoticeContent | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM notices WHERE id = ?`).get(id) as
    | NoticeRow
    | undefined;

  if (!row) return null;

  return {
    ...mapRow(row),
    pdfText: row.pdf_text,
  };
}

export function saveManualSummary(noticeId: string, summary: string): NoticeRecord | null {
  const db = getDb();
  const existing = getNoticeById(noticeId);
  if (!existing) return null;

  const updatedAt = new Date().toISOString();
  db.prepare(
    `UPDATE notices SET summary = ?, updated_at = ? WHERE id = ?`
  ).run(summary, updatedAt, noticeId);

  return getNoticeById(noticeId);
}

export function saveUserPrimaryTag(noticeId: string, tag: string): NoticeRecord | null {
  const db = getDb();
  const existing = getNoticeById(noticeId);
  if (!existing) return null;

  const updatedAt = new Date().toISOString();
  db.prepare(
    `UPDATE notices SET user_primary_tag = ?, updated_at = ? WHERE id = ?`
  ).run(tag, updatedAt, noticeId);

  return getNoticeById(noticeId);
}

export function upsertNotices(notices: NoticeRecord[], category: ExamCategory) {
  const db = getDb();

  const insert = db.prepare(
    `INSERT INTO notices (
      id, source_record_id, title, date, pdf_url, category, exam_id, content_type,
      summary, auto_summary, user_primary_tag, auto_tags, pdf_text_preview,
      has_extracted_text, page_count, extracted_at, updated_at
    ) VALUES (
      @id, @sourceRecordId, @title, @date, @pdfUrl, @category, @examId, @contentType,
      @summary, @autoSummary, @userPrimaryTag, @autoTags, @pdfTextPreview,
      @hasExtractedText, @pageCount, @extractedAt, @updatedAt
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      date = excluded.date,
      pdf_url = excluded.pdf_url,
      exam_id = excluded.exam_id,
      auto_summary = COALESCE(notices.auto_summary, excluded.auto_summary),
      auto_tags = excluded.auto_tags,
      pdf_text_preview = excluded.pdf_text_preview,
      has_extracted_text = excluded.has_extracted_text,
      page_count = excluded.page_count,
      extracted_at = excluded.extracted_at,
      updated_at = excluded.updated_at`
  );

  const tx = db.transaction((batch: NoticeRecord[]) => {
    for (const notice of batch) {
      insert.run({
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
        pdfTextPreview: notice.pdfTextPreview,
        hasExtractedText: notice.hasExtractedText ? 1 : 0,
        pageCount: notice.pageCount,
        extractedAt: notice.extractedAt,
        updatedAt: notice.updatedAt,
      });
    }
  });

  tx(notices);

  const pending = notices.filter((n) => !n.hasExtractedText).length;
  db.prepare(
    `INSERT INTO sync_state (category, synced_at, source_verified_on, pending_enrichment_count)
     VALUES (@category, @syncedAt, @sourceVerifiedOn, @pendingEnrichmentCount)
     ON CONFLICT(category) DO UPDATE SET
       synced_at = excluded.synced_at,
       source_verified_on = excluded.source_verified_on,
       pending_enrichment_count = excluded.pending_enrichment_count`
  ).run({
    category,
    syncedAt: new Date().toISOString(),
    sourceVerifiedOn: new Date().toISOString().slice(0, 10),
    pendingEnrichmentCount: pending,
  });
}
