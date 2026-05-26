import type { ExamCategory } from "@/lib/constants";
import { CGL_AGE_REFERENCE } from "@/lib/eligibility/cgl-2026";
import type {
  EligibilityCheckResult,
  EligibilityExamKey,
  EligibilityProfile,
  EligibilityStatus,
  ReservationCategory,
} from "@/lib/eligibility/types";

const CATEGORY_TO_EXAM: Partial<Record<ExamCategory, EligibilityExamKey>> = {
  CGL: "CGL",
  CHSL: "CHSL",
  MTS: "MTS",
  STENO: "STENO",
  JE: "JE",
  CAPF: "CPO",
  Departmental: "DEPARTMENTAL",
};

interface ExamRule {
  key: EligibilityExamKey;
  label: string;
  category?: ExamCategory;
  minEducation: EligibilityProfile["education"][];
  minAge: number;
  baseMaxAge: number;
  requiresGraduation: boolean;
  requiresTwelfth: boolean;
  requiresTenth: boolean;
  physicalMandatory: boolean;
  pwbdAllowed: boolean;
  /** Extra check for CGL JSO etc. */
  customCheck?: (profile: EligibilityProfile, age: number, maxAge: number) => string[];
}

function ageOnReference(dobIso: string, reference = CGL_AGE_REFERENCE): number | null {
  const dob = new Date(dobIso);
  if (!Number.isFinite(dob.getTime())) return null;
  let age = reference.getFullYear() - dob.getFullYear();
  const monthDiff = reference.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

function relaxationYears(reservation: ReservationCategory): number {
  switch (reservation) {
    case "SC":
    case "ST":
      return 5;
    case "OBC":
      return 3;
    case "PwBD_GENERAL":
      return 10;
    case "PwBD_OBC":
      return 13;
    case "PwBD_SC_ST":
      return 15;
  case "EX_SERVICEMEN":
      return 3;
    default:
      return 0;
  }
}

function maxAgeForReservation(baseMax: number, reservation: ReservationCategory): number {
  return baseMax + relaxationYears(reservation);
}

function educationRank(level: EligibilityProfile["education"]): number {
  const order: Record<EligibilityProfile["education"], number> = {
    BELOW_10TH: 0,
    TENTH: 1,
    TWELFTH: 2,
    DIPLOMA_ENG: 3,
    GRADUATE: 4,
    GRADUATE_MATHS_60_12TH: 5,
    GRADUATE_STATS: 5,
    MASTERS_HINDI_ENGLISH: 6,
  };
  return order[level] ?? 0;
}

function meetsEducation(
  profile: EligibilityProfile,
  allowed: EligibilityProfile["education"][]
): boolean {
  const userRank = educationRank(profile.education);
  const minRequired = Math.min(...allowed.map((level) => educationRank(level)));
  return userRank >= minRequired;
}

const EXAM_RULES: ExamRule[] = [
  {
    key: "CGL",
    label: "SSC CGL",
    category: "CGL",
    minEducation: ["GRADUATE", "GRADUATE_STATS", "GRADUATE_MATHS_60_12TH", "MASTERS_HINDI_ENGLISH"],
    minAge: 18,
    baseMaxAge: 30,
    requiresGraduation: true,
    requiresTwelfth: false,
    requiresTenth: true,
    physicalMandatory: false,
    pwbdAllowed: true,
    customCheck: (profile, age, maxAge) => {
      const notes: string[] = [];
      if (age < 18 || age > maxAge) {
        notes.push(`Age ${age} must generally fall within 18–${maxAge} for most Group B posts (JSO up to 32 with relaxation).`);
      }
      if (
        profile.education === "GRADUATE_MATHS_60_12TH" ||
        (profile.mathsPercent12 ?? 0) >= 60
      ) {
        notes.push("May qualify for JSO (60% Maths at 12th or Statistics at degree).");
      }
      if (profile.education === "GRADUATE_STATS") {
        notes.push("May qualify for JSO / Statistical Investigator specialised posts.");
      }
      if (!profile.meetsQualificationByCutoff) {
        notes.push("Must hold graduation by 01 Aug 2026 (EQ reference date).");
      }
      return notes;
    },
  },
  {
    key: "CHSL",
    label: "SSC CHSL",
    category: "CHSL",
    minEducation: ["TWELFTH", "GRADUATE", "GRADUATE_STATS", "GRADUATE_MATHS_60_12TH", "MASTERS_HINDI_ENGLISH", "DIPLOMA_ENG"],
    minAge: 18,
    baseMaxAge: 27,
    requiresGraduation: false,
    requiresTwelfth: true,
    requiresTenth: true,
    physicalMandatory: false,
    pwbdAllowed: true,
  },
  {
    key: "MTS",
    label: "SSC MTS",
    category: "MTS",
    minEducation: ["TENTH", "TWELFTH", "DIPLOMA_ENG", "GRADUATE", "GRADUATE_STATS", "GRADUATE_MATHS_60_12TH", "MASTERS_HINDI_ENGLISH"],
    minAge: 18,
    baseMaxAge: 25,
    requiresGraduation: false,
    requiresTwelfth: false,
    requiresTenth: true,
    physicalMandatory: false,
    pwbdAllowed: true,
  },
  {
    key: "HAVALDAR",
    label: "SSC Havaldar",
    category: "MTS",
    minEducation: ["TENTH", "TWELFTH", "GRADUATE"],
    minAge: 18,
    baseMaxAge: 27,
    requiresGraduation: false,
    requiresTwelfth: false,
    requiresTenth: true,
    physicalMandatory: true,
    pwbdAllowed: false,
  },
  {
    key: "CPO",
    label: "SSC CPO (CAPF)",
    category: "CAPF",
    minEducation: ["GRADUATE", "GRADUATE_STATS", "GRADUATE_MATHS_60_12TH", "MASTERS_HINDI_ENGLISH"],
    minAge: 20,
    baseMaxAge: 25,
    requiresGraduation: true,
    requiresTwelfth: false,
    requiresTenth: true,
    physicalMandatory: true,
    pwbdAllowed: false,
  },
  {
    key: "GD_CONSTABLE",
    label: "SSC GD Constable",
    minEducation: ["TENTH", "TWELFTH", "GRADUATE"],
    minAge: 18,
    baseMaxAge: 23,
    requiresGraduation: false,
    requiresTwelfth: false,
    requiresTenth: true,
    physicalMandatory: true,
    pwbdAllowed: false,
  },
  {
    key: "JE",
    label: "SSC Junior Engineer",
    category: "JE",
    minEducation: ["DIPLOMA_ENG", "GRADUATE", "GRADUATE_STATS"],
    minAge: 18,
    baseMaxAge: 32,
    requiresGraduation: false,
    requiresTwelfth: false,
    requiresTenth: true,
    physicalMandatory: false,
    pwbdAllowed: true,
  },
  {
    key: "STENO",
    label: "SSC Stenographer",
    category: "STENO",
    minEducation: ["TWELFTH", "GRADUATE", "GRADUATE_STATS", "GRADUATE_MATHS_60_12TH", "MASTERS_HINDI_ENGLISH"],
    minAge: 18,
    baseMaxAge: 30,
    requiresGraduation: false,
    requiresTwelfth: true,
    requiresTenth: true,
    physicalMandatory: false,
    pwbdAllowed: true,
  },
  {
    key: "JHT",
    label: "SSC JHT / Translator",
    minEducation: ["MASTERS_HINDI_ENGLISH"],
    minAge: 18,
    baseMaxAge: 30,
    requiresGraduation: true,
    requiresTwelfth: false,
    requiresTenth: true,
    physicalMandatory: false,
    pwbdAllowed: true,
  },
  {
    key: "DEPARTMENTAL",
    label: "Departmental Exams",
    category: "Departmental",
    minEducation: ["TENTH", "TWELFTH", "GRADUATE"],
    minAge: 18,
    baseMaxAge: 30,
    requiresGraduation: false,
    requiresTwelfth: false,
    requiresTenth: false,
    physicalMandatory: false,
    pwbdAllowed: true,
  },
];

function buildResult(
  rule: ExamRule,
  status: EligibilityStatus,
  summary: string,
  reasons: string[]
): EligibilityCheckResult {
  return {
    examKey: rule.key,
    examLabel: rule.label,
    status,
    summary,
    reasons,
    category: rule.category,
  };
}

export function evaluateExam(
  profile: EligibilityProfile | null,
  examKey: EligibilityExamKey
): EligibilityCheckResult {
  const rule = EXAM_RULES.find((item) => item.key === examKey);
  if (!rule) {
    return {
      examKey,
      examLabel: examKey,
      status: "unknown",
      summary: "No rules configured.",
      reasons: [],
    };
  }

  if (!profile) {
    return buildResult(
      rule,
      "unknown",
      "Save your profile to check eligibility.",
      ["Open the eligibility checker and enter your details."]
    );
  }

  const reasons: string[] = [];
  const age = ageOnReference(profile.dateOfBirth);

  if (age === null) {
    return buildResult(rule, "unknown", "Invalid date of birth.", ["Enter a valid date of birth."]);
  }

  const maxAge = maxAgeForReservation(rule.baseMaxAge, profile.reservation);

  if (
    profile.nationality !== "INDIAN" &&
    profile.nationality !== "NEPAL_BHUTAN" &&
    profile.nationality !== "INDIAN_ORIGIN_MIGRANT"
  ) {
    reasons.push("Nationality must be Indian or eligible with GoI certificate.");
  }

  if (!meetsEducation(profile, rule.minEducation)) {
    if (rule.requiresGraduation) {
      reasons.push("Graduation (bachelor's degree) is required.");
    } else if (rule.requiresTwelfth) {
      reasons.push("12th pass (or higher) is required.");
    } else if (rule.requiresTenth) {
      reasons.push("10th pass (Matric) is required.");
    } else {
      reasons.push("Education level does not meet minimum requirement.");
    }
  }

  if (age < rule.minAge) {
    reasons.push(`Minimum age is ${rule.minAge} years (as on 01 Aug 2026). You are ${age}.`);
  }

  if (age > maxAge) {
    reasons.push(
      `Upper age limit is ${maxAge} years for your category (base ${rule.baseMaxAge} + relaxation). You are ${age}.`
    );
  }

  if (rule.requiresGraduation && !profile.meetsQualificationByCutoff) {
    reasons.push("You must possess essential qualification by 01 Aug 2026.");
  }

  if (!rule.pwbdAllowed && profile.hasBenchmarkDisability) {
    reasons.push("PwBD candidates are not eligible for this exam (per notified pattern).");
  }

  if (rule.physicalMandatory && !profile.willingPhysicalPosts) {
    reasons.push("Physical standards test is mandatory — confirm willingness in your profile.");
  }

  if (rule.key === "CGL" && profile.reservation === "EWS") {
    reasons.push("EWS: Income & Asset certificate for 2025–26 required at Document Verification.");
  }

  const customNotes = rule.customCheck?.(profile, age, maxAge) ?? [];
  const blocking = reasons.filter(
    (r) =>
      !r.startsWith("May qualify") &&
      !r.startsWith("EWS:")
  );

  if (customNotes.length) {
    reasons.push(...customNotes);
  }

  if (blocking.length === 0) {
    return buildResult(
      rule,
      "eligible",
      `Likely eligible (age ${age}, within ${rule.minAge}–${maxAge}).`,
      reasons.length ? reasons : ["Meets core education, age, and nationality checks."]
    );
  }

  const hasOnlyWarnings = blocking.length === 0;
  if (hasOnlyWarnings) {
    return buildResult(rule, "partial", "Review post-specific requirements.", reasons);
  }

  return buildResult(rule, "ineligible", "Does not meet core eligibility.", blocking);
}

export function evaluateCategory(
  profile: EligibilityProfile | null,
  category: ExamCategory
): EligibilityCheckResult {
  const examKey = CATEGORY_TO_EXAM[category];
  if (!examKey) {
    if (category === "Others") {
      return {
        examKey: "GD_CONSTABLE",
        examLabel: "Grouped SSC streams",
        status: profile ? "partial" : "unknown",
        summary: profile
          ? "Check individual exams in the group (JHT, Selection Post, GD, Delhi Police, etc.)."
          : "Save profile first.",
        reasons: ["Others tab bundles multiple exams — see comparison table."],
        category: "Others",
      };
    }
    return {
      examKey: "CGL",
      examLabel: category,
      status: "unknown",
      summary: "No automated check for this tab.",
      reasons: [],
      category,
    };
  }
  return evaluateExam(profile, examKey);
}

export function evaluateAllExams(profile: EligibilityProfile | null): EligibilityCheckResult[] {
  const keys = EXAM_RULES.map((rule) => rule.key);
  return keys.map((key) => evaluateExam(profile, key));
}

export function getExamKeyForCategory(category: ExamCategory): EligibilityExamKey | null {
  return CATEGORY_TO_EXAM[category] ?? null;
}
