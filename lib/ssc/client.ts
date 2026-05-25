import { CATEGORY_CONFIG } from "@/lib/categories";
import type { ExamCategory } from "@/lib/constants";
import { NOTICE_CUTOFF_DATE } from "@/lib/constants";
import type { NoticeRecord } from "@/lib/types";

/**
 * Inferred SSC API integration layer.
 *
 * The production deployment pulled official notice-board PDFs from ssc.gov.in,
 * filtered to records with attachments from 2024-01-01 onward, and normalized
 * them into SQLite. This mock client documents the expected contract and can be
 * replaced with live fetches when SSC credentials/network access are available.
 */

const SSC_API_BASE = process.env.SSC_API_BASE_URL ?? "https://ssc.gov.in/api";

interface RawSscNotice {
  id: string;
  title: string;
  publishedAt: string;
  pdfUrl?: string;
  examId: string;
}

// Simple in-memory cache with pacing — mirrors "retries, pacing, and in-memory caching".
const responseCache = new Map<string, { expiresAt: number; payload: RawSscNotice[] }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchExamNotices(examId: string): Promise<RawSscNotice[]> {
  const cacheKey = `exam:${examId}`;
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  // Assumption: production called an authenticated notice-board endpoint per examId.
  // We return an empty list locally so SQLite seed data remains the primary source.
  if (process.env.SSC_SYNC_ENABLED !== "true") {
    return [];
  }

  try {
    const response = await fetch(
      `${SSC_API_BASE}/notice-boards?examId=${encodeURIComponent(examId)}`,
      { next: { revalidate: 0 } }
    );

    if (!response.ok) {
      throw new Error(`SSC API responded with ${response.status}`);
    }

    const payload = (await response.json()) as { data?: RawSscNotice[] };
    const notices = payload.data ?? [];
    responseCache.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      payload: notices,
    });
    return notices;
  } catch {
    return [];
  }
}

function normalizeNotice(
  raw: RawSscNotice,
  category: ExamCategory
): NoticeRecord | null {
  if (!raw.pdfUrl) return null;

  const published = new Date(raw.publishedAt);
  if (published < NOTICE_CUTOFF_DATE) return null;

  const now = new Date().toISOString();

  return {
    id: raw.id,
    sourceRecordId: raw.id,
    title: raw.title,
    date: published.toISOString(),
    pdfUrl: raw.pdfUrl,
    category,
    examId: raw.examId,
    contentType: "notice-boards",
    summary: null,
    autoSummary: null,
    userPrimaryTag: null,
    autoTags: [],
    pdfTextPreview: null,
    hasExtractedText: false,
    pageCount: null,
    extractedAt: null,
    updatedAt: now,
  };
}

export async function syncCategoryFromSsc(
  category: ExamCategory
): Promise<NoticeRecord[]> {
  const config = CATEGORY_CONFIG[category];
  const merged: NoticeRecord[] = [];

  for (const examId of config.examIds) {
    const rawNotices = await fetchExamNotices(examId);
    for (const raw of rawNotices) {
      const normalized = normalizeNotice({ ...raw, examId }, category);
      if (normalized) merged.push(normalized);
    }

    // Pacing between examId calls (inferred from operational notes).
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  return merged;
}
