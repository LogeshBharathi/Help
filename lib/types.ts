import type { ExamCategory } from "@/lib/constants";

export interface NoticeRecord {
  id: string;
  sourceRecordId: string;
  title: string;
  date: string;
  pdfUrl: string;
  category: ExamCategory;
  examId: string;
  contentType: string;
  summary: string | null;
  autoSummary: string | null;
  userPrimaryTag: string | null;
  autoTags: string[];
  pdfTextPreview: string | null;
  hasExtractedText: boolean;
  pageCount: number | null;
  extractedAt: string | null;
  updatedAt: string;
}

export interface NoticeContent extends NoticeRecord {
  pdfText: string | null;
}

export interface CategoryNoticesResponse {
  category: ExamCategory;
  fullName: string;
  notices: NoticeRecord[];
  total: number;
  syncedAt: string | null;
  sourceVerifiedOn: string;
  pendingEnrichmentCount: number;
}

export interface SaveSummaryPayload {
  noticeId: string;
  summary: string;
}

export interface SaveTagPayload {
  noticeId: string;
  tag: string;
}
