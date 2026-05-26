"use client";

import { useState } from "react";

import {
  AGE_RELAXATION_ROWS,
  CGL_2026_KEY_DATES,
  CGL_ALERTS,
  CGL_CORE_ELIGIBILITY,
  CGL_POSTS,
  EXAM_COMPARISON_ROWS,
  PHYSICAL_POSTS_CGL,
} from "@/lib/eligibility/cgl-2026";
import { cn } from "@/lib/cn";

type GuideTab = "cgl" | "comparison" | "age" | "physical";

const TABS: { id: GuideTab; label: string }[] = [
  { id: "cgl", label: "SSC CGL 2026" },
  { id: "comparison", label: "All SSC Exams — Comparison" },
  { id: "age", label: "Age Relaxation" },
  { id: "physical", label: "Physical & Medical" },
];

export function EligibilityGuide({ initialTab = "cgl" }: { initialTab?: GuideTab }) {
  const [tab, setTab] = useState<GuideTab>(initialTab);

  return (
    <div className="eligibility-guide -mx-2 sm:mx-0">
      <div className="overflow-hidden rounded-[1.5rem] border border-line bg-[#1A1A18] text-white">
        <div className="relative px-6 py-8 md:px-10">
          <span className="inline-block rounded bg-[#D95F2A] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
            Eligibility Guide
          </span>
          <h2 className="mt-3 font-serif-ui text-2xl font-semibold md:text-3xl">
            SSC Exams 2026 — Complete Eligibility Reference
          </h2>
          <p className="mt-2 text-sm text-white/55">
            Staff Selection Commission · Based on CGL 2026 official notice pattern (May 2026)
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/50">
            <span>
              <strong className="text-white/85">CGL vacancies:</strong> {CGL_2026_KEY_DATES.vacanciesApprox}
            </span>
            <span>
              <strong className="text-white/85">Apply by:</strong> {CGL_2026_KEY_DATES.lastDateApply}
            </span>
            <span>
              <strong className="text-white/85">Age cutoff:</strong> {CGL_2026_KEY_DATES.ageReferenceDate}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-0 flex overflow-x-auto border-b border-line bg-surface">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-medium transition",
              tab === item.id
                ? "border-[#D95F2A] text-[#D95F2A]"
                : "border-transparent text-muted hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "cgl" ? <CglTab /> : null}
        {tab === "comparison" ? <ComparisonTab /> : null}
        {tab === "age" ? <AgeTab /> : null}
        {tab === "physical" ? <PhysicalTab /> : null}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
      {children}
    </p>
  );
}

function CglTab() {
  return (
    <div className="space-y-8">
      <SectionTitle>Key dates</SectionTitle>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Application open", CGL_2026_KEY_DATES.applicationOpen],
          ["Last date to apply", CGL_2026_KEY_DATES.lastDateApply],
          ["Fee payment last date", CGL_2026_KEY_DATES.feePaymentLastDate],
          ["Correction window", CGL_2026_KEY_DATES.correctionWindow],
          ["Age reference date", CGL_2026_KEY_DATES.ageReferenceDate],
          ["EQ reference date", CGL_2026_KEY_DATES.eqReferenceDate],
        ].map(([label, val]) => (
          <div key={label} className="rounded-lg border border-line bg-surface px-4 py-3">
            <div className="text-[11px] text-muted">{label}</div>
            <div className="mt-1 text-sm font-medium text-ink">{val}</div>
          </div>
        ))}
      </div>

      <SectionTitle>Core eligibility — SSC CGL 2026</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard title="Education">
          <InfoRow label="Minimum" value={CGL_CORE_ELIGIBILITY.education} highlight />
          <InfoRow label="10th" value="Required (age proof)" />
          <InfoRow label="12th" value="For JSO — 60% Maths" warn />
        </InfoCard>
        <InfoCard title="Nationality">
          {CGL_CORE_ELIGIBILITY.nationality.map((n) => (
            <InfoRow key={n} label="✓" value={n} />
          ))}
        </InfoCard>
        <InfoCard title="Reservation">
          {CGL_CORE_ELIGIBILITY.reservation.map((r) => (
            <InfoRow key={r} label="✓" value={r} highlight />
          ))}
        </InfoCard>
        <InfoCard title="Application fee">
          <InfoRow label="General / OBC / EWS (Male)" value={CGL_CORE_ELIGIBILITY.fee.generalMale} />
          <InfoRow label="Exempt" value={CGL_CORE_ELIGIBILITY.fee.exempt} highlight />
        </InfoCard>
      </div>

      <SectionTitle>Post-wise eligibility</SectionTitle>
      <div className="grid gap-3 md:grid-cols-2">
        {CGL_POSTS.map((post) => (
          <div
            key={post.name}
            className="rounded-xl border border-line bg-surface p-4 transition hover:border-[#CCCAB8]"
          >
            <div className="flex justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-ink">{post.name}</div>
                <div className="mt-0.5 text-xs text-muted">{post.dept}</div>
              </div>
              <span className="shrink-0 rounded bg-[#FDF0E8] px-2 py-0.5 text-[11px] font-medium text-[#D95F2A]">
                {post.pay}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-[#EAF2FB] px-2 py-0.5 text-[11px] font-medium text-[#1B5FA5]"
                >
                  {tag}
                </span>
              ))}
            </div>
            {post.notes ? (
              <p className="mt-2 text-xs leading-relaxed text-muted">{post.notes}</p>
            ) : null}
          </div>
        ))}
      </div>

      {CGL_ALERTS.map((alert) => (
        <Alert key={alert.title} type={alert.type} title={alert.title} body={alert.body} />
      ))}
    </div>
  );
}

function ComparisonTab() {
  return (
    <div className="space-y-6">
      <Alert
        type="blue"
        title="Verify on ssc.gov.in"
        body="CGL 2026 from official notice; other exams from recent patterns. Always confirm before applying."
      />
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[900px] border-collapse text-xs">
          <thead>
            <tr className="bg-[#F5F4F0] text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
              <th className="p-3">Exam</th>
              <th className="p-3">10th</th>
              <th className="p-3">12th</th>
              <th className="p-3">Graduation</th>
              <th className="p-3">Age</th>
              <th className="p-3">Physical</th>
              <th className="p-3">PwBD</th>
              <th className="p-3">EWS</th>
            </tr>
          </thead>
          <tbody>
            {EXAM_COMPARISON_ROWS.map((row) => (
              <tr key={row.exam} className="border-t border-line hover:bg-[#FAFAF5]">
                <td className="p-3">
                  <div className="font-semibold text-ink">{row.exam}</div>
                  <div className="text-[11px] text-muted">{row.full}</div>
                </td>
                <td className="p-3 text-muted">{row.tenth}</td>
                <td className="p-3 text-muted">{row.twelfth}</td>
                <td className="p-3 text-muted">{row.graduation}</td>
                <td className="p-3 font-medium text-ink">{row.age}</td>
                <td className="p-3 text-muted">{row.physical}</td>
                <td className="p-3">{row.pwbd}</td>
                <td className="p-3">{row.ews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AgeTab() {
  return (
    <div className="space-y-6">
      <SectionTitle>Age relaxation (CGL 2026) — reference 01 Aug 2026</SectionTitle>
      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F5F4F0] text-left text-[11px] font-semibold uppercase text-muted">
              <th className="p-3">Code</th>
              <th className="p-3">Category</th>
              <th className="p-3">Relaxation</th>
              <th className="p-3">Applicable</th>
            </tr>
          </thead>
          <tbody>
            {AGE_RELAXATION_ROWS.map((row) => (
              <tr key={row.code} className="border-t border-line">
                <td className="p-3 font-semibold">{row.code}</td>
                <td className="p-3">{row.category}</td>
                <td className="p-3">{row.relaxation}</td>
                <td className="p-3 text-muted">{row.applicable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Alert
        type="orange"
        title="ESM age calculation"
        body="Subtract military service years from actual age; resulting age must be within 3 years of upper limit."
      />
    </div>
  );
}

function PhysicalTab() {
  return (
    <div className="space-y-6">
      <Alert
        type="orange"
        title="Important"
        body="Physical tests are conducted by User Departments AFTER final selection. Failing means candidature is not shifted to another post."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {PHYSICAL_POSTS_CGL.map((post) => (
          <div key={post.name} className="rounded-xl border border-line bg-surface p-4">
            <div className="flex justify-between gap-2">
              <div className="text-sm font-medium text-ink">{post.name}</div>
              <span className="rounded bg-[#FBEAEA] px-2 py-0.5 text-[11px] font-medium text-[#B83535]">
                Physical
              </span>
            </div>
            <div className="mt-1 text-xs text-muted">{post.dept}</div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{post.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{title}</div>
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
  warn,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="flex justify-between gap-2 border-b border-line py-1.5 text-sm last:border-0">
      <span className="text-muted">{label}</span>
      <span
        className={cn(
          "max-w-[65%] text-right font-medium",
          highlight && "text-[#2B7A47]",
          warn && "text-[#D95F2A]",
          !highlight && !warn && "text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function Alert({
  type,
  title,
  body,
}: {
  type: "orange" | "blue" | "green";
  title: string;
  body: string;
}) {
  const styles = {
    orange: "border-l-[#D95F2A] bg-[#FDF0E8]",
    blue: "border-l-[#1B5FA5] bg-[#EAF2FB]",
    green: "border-l-[#2B7A47] bg-[#EAF5EF]",
  };
  return (
    <div className={cn("rounded-lg border-l-[3px] px-4 py-3 text-sm leading-relaxed", styles[type])}>
      <span className="font-semibold text-ink">{title}</span>
      <p className="mt-1 text-muted">{body}</p>
    </div>
  );
}
