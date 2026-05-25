import type { ExamCategory } from "@/lib/constants";
import { COVERAGE_MODE_LABELS } from "@/lib/constants";

export type CoverageMode = keyof typeof COVERAGE_MODE_LABELS;

export interface OfficialReference {
  shortLabel: string;
  fullLabel: string;
  note?: string;
}

export interface CategoryConfig {
  shortName: ExamCategory;
  fullName: string;
  description: string;
  examIds: string[];
  coverageMode: CoverageMode;
  coverageNote?: string;
  officialReferences: OfficialReference[];
}

/**
 * Tab configuration recovered from production bundle (module 2625).
 * examIds are live SSC API identifiers used during category sync.
 */
export const CATEGORY_CONFIG: Record<ExamCategory, CategoryConfig> = {
  CGL: {
    shortName: "CGL",
    fullName: "Combined Graduate Level",
    description:
      "Graduate-level recruitment notices, corrigenda, answer keys, and schedules.",
    examIds: ["xsd91hjkshdk92xk", "twoxxhjkshdcgl25", "w2sxxhjkshdcgl26"],
    coverageMode: "direct",
    officialReferences: [
      {
        shortLabel: "CGL",
        fullLabel: "Combined Graduate Level Examination",
      },
    ],
  },
  CHSL: {
    shortName: "CHSL",
    fullName: "Combined Higher Secondary Level",
    description:
      "10+2 level notices, result write-ups, and official exam updates.",
    examIds: ["s40d16nackd16h0", "s40d16naqchsl25", "s40d16naqchsl26"],
    coverageMode: "direct",
    officialReferences: [
      {
        shortLabel: "CHSL",
        fullLabel: "Combined Higher Secondary (10+2) Level Examination",
      },
    ],
  },
  MTS: {
    shortName: "MTS",
    fullName: "Multi Tasking Staff",
    description:
      "MTS and Havaldar notices published on the official SSC notice board.",
    examIds: ["wzeujzxj8ts5z9n", "gh67ytxj8tmts25", "gh67ytxj8tmts26"],
    coverageMode: "direct",
    officialReferences: [
      {
        shortLabel: "MTS",
        fullLabel: "Multi-Tasking (Non-Technical) Staff Examination",
      },
    ],
  },
  STENO: {
    shortName: "STENO",
    fullName: "Stenographer Grade C and D",
    description:
      "Stenographer notifications, final keys, marks, and result notices.",
    examIds: ["59g9y0svo3zgwiu", "59g9y0svsteno25", "steno0svofmeb26"],
    coverageMode: "direct",
    officialReferences: [
      {
        shortLabel: "STENO",
        fullLabel: "Stenographers' Grade 'C' & 'D' Examination",
      },
    ],
  },
  JE: {
    shortName: "JE",
    fullName: "Junior Engineer",
    description:
      "Junior Engineer exam notices, city slips, answer keys, and paper schedules.",
    examIds: ["g21irqg6pmtxbag", "bxtirqg6pmwje25", "bxtirqg6pmwje26"],
    coverageMode: "direct",
    officialReferences: [
      {
        shortLabel: "JE",
        fullLabel:
          "Junior Engineers (Civil, Mechanical, Electrical, Quantity Surveying & Contracts) Examination",
        note: "The live SSC API currently exposes the JE stream under Civil, Mechanical, and Electrical variants, but this tab is aligned to the broader founder taxonomy.",
      },
    ],
  },
  CAPF: {
    shortName: "CAPF",
    fullName: "SI in Delhi Police, CAPFs and ASI in CISF",
    description:
      "Sub-inspector and assistant sub-inspector notices, answer keys, and result updates.",
    examIds: ["f2tt2k1tpp3qpb5", "j2k7sgab6eu9sh6c", "j2k7sgab6sicpo26"],
    coverageMode: "direct",
    officialReferences: [
      {
        shortLabel: "SI CAPF",
        fullLabel:
          "Sub Inspectors in Delhi Police, CAPFs & Assistant Sub Inspectors in CISF Examination",
      },
    ],
  },
  Others: {
    shortName: "Others",
    fullName: "Grouped SSC Exam Streams",
    description:
      "Translator, Selection Post, Constable GD, Delhi Police, and other grouped SSC notice streams.",
    examIds: [
      "yafd7c3qloz8ixl",
      "q7sw4cqpvyitarc",
      "ctgd1yln49o2026",
      "dfgt1yln4ctgd27",
      "nri55c0igl5cs45",
      "nri55c0igljht25",
      "nri55c0igljht26",
      "1bv75ftehwsjy1f",
      "rhq74fte5xsjy25",
      "rhq74fte5xrhq26",
      "ooqnwrr4dyev3hw",
      "dpce00ab6eu9si1c",
      "dphct0ab6eutvfq0",
      "dpcdsgab6eu9sh6c",
      "dphcm0ab6eutguzu",
      "ieia2iialhilrwc",
    ],
    coverageMode: "grouped",
    coverageNote:
      "This is an extraction-first grouped tab. These streams can be split into dedicated tabs later without changing the SSC source integration.",
    officialReferences: [
      {
        shortLabel: "JHT / SHT / HP",
        fullLabel:
          "Junior Hindi Translator, Senior Hindi Translator and Hindi Pradhyapak Examination",
      },
      {
        shortLabel: "JT (CSOLS)",
        fullLabel:
          "Junior Translator (Central Secretariat Official Language Service) Examination",
        note: "The live SSC 2026 exam list does not expose a separate CSOLS examId, so translator-related notices currently roll up under the translator/JHT feed.",
      },
      {
        shortLabel: "Selection Post",
        fullLabel:
          "Selection Post Examination - isolated posts in Ministries/Departments",
      },
      {
        shortLabel: "Constable (GD)",
        fullLabel:
          "Constable (GD) in CAPFs, NIA & SSF and Rifleman (GD) in Assam Rifles Examination",
        note: "Current SSC cycles may also include closely related SSF and Sepoy in NCB variants in this grouped feed.",
      },
      {
        shortLabel: "Delhi Police",
        fullLabel:
          "Constable (Executive) - Male & Female in Delhi Police Examination as per MOU",
        note: "SSC also exposes related Delhi Police driver and head constable notice feeds, and they currently remain grouped here.",
      },
    ],
  },
  Departmental: {
    shortName: "Departmental",
    fullName: "Departmental Examinations",
    description:
      "Departmental competitive examinations and limited departmental notices.",
    examIds: ["q5zvwlkwna3s17u", "steno6g4v08vldc"],
    coverageMode: "internal",
    coverageNote:
      "Your founder marked departmental competitive examinations as outside the primary public coverage scope. This mapping is kept for internal reference.",
    officialReferences: [
      {
        shortLabel: "Departmental",
        fullLabel: "Departmental competitive examinations",
      },
    ],
  },
};

export function isExamCategory(value: string): value is ExamCategory {
  return value in CATEGORY_CONFIG;
}

export function getCategoryConfig(category: ExamCategory): CategoryConfig {
  return CATEGORY_CONFIG[category];
}
