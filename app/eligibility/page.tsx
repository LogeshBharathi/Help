import type { Metadata } from "next";

import { EligibilityGuide } from "@/components/eligibility/EligibilityGuide";
import { EligibilityProfileForm } from "@/components/eligibility/EligibilityProfileForm";
import { EligibilityResultsGrid } from "@/components/eligibility/EligibilityResultsGrid";

export const metadata: Metadata = {
  title: "Eligibility Checker | SSC Notice Intelligence Platform",
  description:
    "SSC CGL 2026 and all-exam eligibility reference with personalised eligible / not eligible checks.",
};

export default function EligibilityPage() {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
          SSC Eligibility
        </p>
        <h1 className="mt-2 font-serif-ui text-4xl font-semibold text-ink">
          Eligibility checker
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
          Save your details once. The app stores them locally and shows whether you likely qualify
          for each SSC exam when you browse notice tabs. Reference content is based on the CGL 2026
          official notice (May 2026) — always verify on{" "}
          <a
            href="https://ssc.gov.in"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-accent hover:text-accent-strong"
          >
            ssc.gov.in
          </a>{" "}
          before applying.
        </p>
      </div>

      <EligibilityProfileForm />

      <section>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Your results — all exams
        </p>
        <EligibilityResultsGrid />
      </section>

      <EligibilityGuide />
    </div>
  );
}
