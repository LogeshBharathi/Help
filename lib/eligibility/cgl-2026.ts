/**
 * CGL 2026 eligibility reference — sourced from official notice pattern (May 2026)
 * and the user's eligibility guide HTML. Verify on ssc.gov.in before applying.
 */

import type { CglKeyDates } from "@/lib/eligibility/types";

export const CGL_2026_KEY_DATES: CglKeyDates = {
  applicationOpen: "May 2026",
  lastDateApply: "22 Jun 2026 (23:00 hrs)",
  feePaymentLastDate: "23 Jun 2026",
  correctionWindow: "29 Jun – 01 Jul 2026",
  ageReferenceDate: "01 Aug 2026",
  eqReferenceDate: "01 Aug 2026",
  vacanciesApprox: "~12,256",
  feeGeneral: "₹100 (SC/ST/PwBD/Women: Nil)",
};

export const CGL_AGE_REFERENCE = new Date("2026-08-01T00:00:00.000Z");

/** Base upper age limits by post group (years). */
export const CGL_AGE_BANDS = {
  groupC: { min: 18, max: 27 },
  groupB: { min: 18, max: 30 },
  cssCbi: { min: 20, max: 30 },
  jso: { min: 18, max: 32 },
} as const;

export const CGL_CORE_ELIGIBILITY = {
  education:
    "Bachelor's degree from a recognised university (any discipline). Open/distance learning valid if UGC-approved.",
  tenth: "10th certificate required as age proof.",
  nationality: ["Indian citizen", "Nepal/Bhutan subject with GoI certificate", "Indian origin migrant with GoI certificate"],
  reservation: ["SC", "ST", "OBC", "EWS", "Ex-Servicemen", "PwBD (benchmark ≥40%)"],
  fee: {
    generalMale: "₹100",
    exempt: "SC/ST, Women (all categories), PwBD, Ex-Servicemen — Nil",
  },
};

export const CGL_POSTS = [
  {
    name: "Assistant Audit Officer",
    dept: "C&AG (Central / State Cadre)",
    pay: "Level 8 | ₹47,600+",
    tags: ["Graduate (Any)", "Age: 18–30 yrs", "Group B Gazetted"],
    notes:
      "Desirable: CA/CMA/CS/M.Com/MBA(Finance). State cadre needs regional language at Matric level.",
  },
  {
    name: "Assistant Accounts Officer",
    dept: "C&AG (State Cadre)",
    pay: "Level 8 | ₹47,600+",
    tags: ["Graduate (Any)", "Age: 18–30 yrs", "Group B Gazetted"],
    notes: "Desirable: CA/CMA/CS/M.Com/MBA(Finance). Regional language proficiency required.",
  },
  {
    name: "Junior Statistical Officer",
    dept: "MoSPI",
    pay: "Level 6 | ₹35,400+",
    tags: ["Graduate (Any)", "Age: 18–32 yrs", "Special Eligibility"],
    notes:
      "Option A: Graduation + 60% Maths at 12th. Option B: Graduation with Statistics as subject.",
  },
  {
    name: "Statistical Investigator Gr-II",
    dept: "MHA",
    pay: "Level 6 | ₹35,400+",
    tags: ["Specific Degree", "Age: 18–30 yrs"],
    notes:
      "B.Sc in Statistics/Mathematics/Economics/Demography/OR/IT/CS/Data Science/AI from recognised university.",
  },
  {
    name: "Inspector (Income Tax / Central Excise / Examiner / PO)",
    dept: "CBDT / CBIC",
    pay: "Level 7 | ₹44,900+",
    tags: ["Graduate (Any)", "Age: 18–30 yrs", "Physical Standards"],
    notes: "Physical fitness test & medical standards applicable.",
  },
  {
    name: "Sub Inspector (CBI / NIA / NCB)",
    dept: "Multiple Depts",
    pay: "Level 6–7",
    tags: ["Graduate (Any)", "Age: 18–30 / 20–30 yrs", "Physical Standards"],
    notes: "CBI: 20–30 years. NIA/NCB: 18–30 years. Physical test mandatory.",
  },
  {
    name: "Assistant Section Officer",
    dept: "CSS / IB / Railways / MEA / AFHQ / MeitY",
    pay: "Level 7 | ₹44,900+",
    tags: ["Graduate (Any)", "Age: 18–30 / 20–30 yrs", "Group B"],
    notes: "CSS, Railways, MEA, AFHQ: 20–30 yrs. IB, MeitY, others: 18–30 yrs.",
  },
  {
    name: "Auditor / Accountant",
    dept: "C&AG / CGDA / Other Depts",
    pay: "Level 5 | ₹29,200+",
    tags: ["Graduate (Any)", "Age: 18–27 yrs", "Group C"],
    notes: "",
  },
  {
    name: "Postal / Sorting Assistant, SSA/UDC, Tax Assistant",
    dept: "Dept of Posts / Central Govt / CBDT / CBIC",
    pay: "Level 4 | ₹25,500+",
    tags: ["Graduate (Any)", "Age: 18–27 yrs", "Group C"],
    notes: "",
  },
] as const;

export const CGL_ALERTS = [
  {
    type: "orange" as const,
    title: "Final-year students may apply",
    body: "Must possess essential qualification (graduation) as on 01.08.2026. Candidature cancelled at DV if EQ not met.",
  },
  {
    type: "blue" as const,
    title: "EWS Certificate Requirement",
    body: "Income & Asset Certificate for 2025–26 required at DV. Family income ≤ ₹8 lakh; land/plot limits apply.",
  },
  {
    type: "green" as const,
    title: "PwBD Reservation",
    body: "Benchmark disabilities (≥40%) eligible for reservation and scribe. Upload disability certificate in prescribed format.",
  },
];

export const AGE_RELAXATION_ROWS = [
  { code: "01", category: "SC / ST", relaxation: "+5 years", applicable: "All posts" },
  { code: "02", category: "OBC", relaxation: "+3 years", applicable: "All posts" },
  { code: "03", category: "PwBD (General)", relaxation: "+10 years", applicable: "All posts" },
  { code: "04", category: "PwBD (OBC)", relaxation: "+13 years", applicable: "All posts" },
  { code: "05", category: "PwBD (SC/ST)", relaxation: "+15 years", applicable: "All posts" },
  { code: "06", category: "Ex-Servicemen (ESM)", relaxation: "3 yrs after deducting military service", applicable: "All posts" },
  { code: "08", category: "Defence disabled (General)", relaxation: "+3 years", applicable: "All posts" },
  { code: "09", category: "Defence disabled (SC/ST)", relaxation: "+8 years", applicable: "All posts" },
  { code: "10", category: "Central Govt employee (3+ yrs)", relaxation: "Up to 40 years", applicable: "Group C only" },
  { code: "11", category: "Central Govt employee SC/ST (3+ yrs)", relaxation: "Up to 45 years", applicable: "Group C only" },
  { code: "12", category: "Widows / divorced / separated women", relaxation: "Up to 35 years", applicable: "Group C only" },
  { code: "13", category: "Widows / divorced SC/ST women", relaxation: "Up to 40 years", applicable: "Group C only" },
];

export const EXAM_COMPARISON_ROWS = [
  {
    exam: "CGL",
    full: "Combined Graduate Level",
    tenth: "As age proof",
    twelfth: "For JSO — 60% Maths",
    graduation: "Mandatory (any)",
    specialization: "JSO, Stat Inv, AAO desirable",
    age: "18–27 / 18–30 / 20–30 / 18–32",
    physical: "Selective posts",
    pwbd: "Yes",
    ews: "Yes",
  },
  {
    exam: "CHSL",
    full: "Combined Higher Secondary Level",
    tenth: "As age proof",
    twelfth: "Mandatory",
    graduation: "Not required",
    specialization: "LDC/JSA/SA — 10+2; DEO — Science+Maths preferred",
    age: "18–27",
    physical: "Generally no",
    pwbd: "Yes",
    ews: "Yes",
  },
  {
    exam: "MTS",
    full: "Multi Tasking Staff",
    tenth: "Mandatory",
    twelfth: "Not required",
    graduation: "Not required",
    specialization: "10th pass",
    age: "18–25",
    physical: "No",
    pwbd: "Yes",
    ews: "Yes",
  },
  {
    exam: "Havaldar",
    full: "Havaldar in CBIC & CBN",
    tenth: "Mandatory",
    twelfth: "Not required",
    graduation: "Not required",
    specialization: "None",
    age: "18–27",
    physical: "PET required",
    pwbd: "OH only",
    ews: "Yes",
  },
  {
    exam: "CPO",
    full: "Central Police Organisations",
    tenth: "As age proof",
    twelfth: "—",
    graduation: "Mandatory",
    specialization: "SI CAPF / ASI CISF",
    age: "20–25",
    physical: "Mandatory",
    pwbd: "Not eligible",
    ews: "Yes",
  },
  {
    exam: "GD Constable",
    full: "GD in CAPFs / NIA / SSF",
    tenth: "Mandatory",
    twelfth: "Not required",
    graduation: "Not required",
    specialization: "10th pass",
    age: "18–23",
    physical: "Strict standards",
    pwbd: "Not eligible",
    ews: "Yes",
  },
  {
    exam: "JE",
    full: "Junior Engineer",
    tenth: "Yes",
    twelfth: "Part of diploma track",
    graduation: "Diploma/Degree in Engineering",
    specialization: "Civil/Electrical/Mechanical/QS&C",
    age: "18–32",
    physical: "No",
    pwbd: "Yes",
    ews: "Yes",
  },
  {
    exam: "Stenographer",
    full: "Grade C & D",
    tenth: "As age proof",
    twelfth: "Mandatory",
    graduation: "Not required",
    specialization: "Skill test 80/100 wpm",
    age: "18–27 / 18–30",
    physical: "No",
    pwbd: "Yes",
    ews: "Yes",
  },
  {
    exam: "JHT",
    full: "Junior Hindi Translator",
    tenth: "Yes",
    twelfth: "—",
    graduation: "Master's required",
    specialization: "Hindi/English master's rules",
    age: "18–30",
    physical: "No",
    pwbd: "Yes",
    ews: "Yes",
  },
] as const;

export const PHYSICAL_POSTS_CGL = [
  {
    name: "Inspector (Central Excise / Examiner / Preventive Officer)",
    dept: "CBIC",
    details:
      "Height: M 157.5 cm / F 152 cm. Chest M: 81/86 cm. Vision 6/6 or 6/9. Walking, cycling, running.",
  },
  {
    name: "Inspector / Sub-Inspector",
    dept: "CBN – Ministry of Finance",
    details:
      "Height: M 167.5 cm / F 152.5 cm. Chest M: 81/86 cm. Vision 6/6. Medical fitness for field duties.",
  },
  {
    name: "Sub-Inspector / Junior Intelligence Officer",
    dept: "NCB – MHA",
    details: "Physical standards per User Department. Fit for law enforcement work.",
  },
  {
    name: "Sub Inspector",
    dept: "CBI",
    details: "Height M 165 / F 150 cm. Chest M 76/81 cm. Vision 6/6 one eye, 6/9 other.",
  },
  {
    name: "Sub Inspector",
    dept: "NIA",
    details: "Field-level fitness per NIA standards at time of test.",
  },
  {
    name: "UDC / SSA and Other Posts",
    dept: "BRO",
    details: "Male candidates only. Physical standards per Army norms for field postings.",
  },
] as const;
