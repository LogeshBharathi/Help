import type { ExamCategory } from "@/lib/constants";

/** Exams we can evaluate against (includes aliases used in comparison table). */
export type EligibilityExamKey =
  | "CGL"
  | "CHSL"
  | "MTS"
  | "HAVALDAR"
  | "CPO"
  | "GD_CONSTABLE"
  | "JE"
  | "STENO"
  | "JHT"
  | "DEPARTMENTAL";

export type ReservationCategory =
  | "GENERAL"
  | "EWS"
  | "OBC"
  | "SC"
  | "ST"
  | "EX_SERVICEMEN"
  | "PwBD_GENERAL"
  | "PwBD_OBC"
  | "PwBD_SC_ST";

export type EducationLevel =
  | "BELOW_10TH"
  | "TENTH"
  | "TWELFTH"
  | "DIPLOMA_ENG"
  | "GRADUATE"
  | "GRADUATE_STATS"
  | "GRADUATE_MATHS_60_12TH"
  | "MASTERS_HINDI_ENGLISH";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type Nationality = "INDIAN" | "NEPAL_BHUTAN" | "INDIAN_ORIGIN_MIGRANT";

export interface EligibilityProfile {
  /** ISO date YYYY-MM-DD */
  dateOfBirth: string;
  reservation: ReservationCategory;
  education: EducationLevel;
  /** 12th Maths percentage (for CGL JSO path). */
  mathsPercent12?: number;
  nationality: Nationality;
  gender: Gender;
  /** Will possess EQ by 01 Aug 2026 */
  meetsQualificationByCutoff: boolean;
  /** Self-declared fitness for physical-standard posts */
  willingPhysicalPosts: boolean;
  /** Benchmark disability ≥40% */
  hasBenchmarkDisability: boolean;
  updatedAt: string;
}

export type EligibilityStatus = "eligible" | "ineligible" | "partial" | "unknown";

export interface EligibilityCheckResult {
  examKey: EligibilityExamKey;
  examLabel: string;
  status: EligibilityStatus;
  summary: string;
  reasons: string[];
  /** Linked app tab when applicable */
  category?: ExamCategory;
}

export interface CglKeyDates {
  applicationOpen: string;
  lastDateApply: string;
  feePaymentLastDate: string;
  correctionWindow: string;
  ageReferenceDate: string;
  eqReferenceDate: string;
  vacanciesApprox: string;
  feeGeneral: string;
}
