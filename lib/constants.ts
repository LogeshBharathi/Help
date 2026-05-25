/** Exam tab slugs — order preserved from recovered RSC payload. */
export const EXAM_CATEGORIES = [
  "CGL",
  "CHSL",
  "MTS",
  "STENO",
  "JE",
  "CAPF",
  "Others",
  "Departmental",
] as const;

export type ExamCategory = (typeof EXAM_CATEGORIES)[number];

/** Notice type tags used for client-side filtering (from chunk 8566). */
export const NOTICE_TYPES = [
  "Announcement",
  "Admit Card",
  "Document Verification (DV)",
  "Exam Notification",
  "Answer Key",
  "Result",
  "Center Confirmation",
  "Vacancy Details",
  "Corrigendum",
  "Preference Form",
  "Marks Update",
] as const;

export type NoticeType = (typeof NOTICE_TYPES)[number];

export const BOOKMARKS_STORAGE_KEY = "ssc-notice-bookmarks.v1";

/** Only notices on or after this date are stored (operational note from homepage). */
export const NOTICE_CUTOFF_DATE = new Date("2024-01-01T00:00:00.000Z");

export const NOTICES_PAGE_SIZE = 12;

export const COVERAGE_MODE_LABELS = {
  direct: "Direct tab",
  grouped: "Grouped tab",
  internal: "Internal reference",
} as const;
