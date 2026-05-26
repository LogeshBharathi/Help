"use client";

import { useState } from "react";

import type { EligibilityProfile } from "@/lib/eligibility/types";
import { useEligibilityProfile } from "@/lib/hooks/useEligibilityProfile";

interface EligibilityProfileFormProps {
  onSaved?: () => void;
}

export function EligibilityProfileForm({ onSaved }: EligibilityProfileFormProps) {
  const { profile, saveProfile, clearProfile, emptyProfile } = useEligibilityProfile();
  const [form, setForm] = useState<Omit<EligibilityProfile, "updatedAt">>(() =>
    profile
      ? {
          dateOfBirth: profile.dateOfBirth,
          reservation: profile.reservation,
          education: profile.education,
          mathsPercent12: profile.mathsPercent12,
          nationality: profile.nationality,
          gender: profile.gender,
          meetsQualificationByCutoff: profile.meetsQualificationByCutoff,
          willingPhysicalPosts: profile.willingPhysicalPosts,
          hasBenchmarkDisability: profile.hasBenchmarkDisability,
        }
      : emptyProfile
  );
  const [message, setMessage] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.dateOfBirth) {
      setMessage("Date of birth is required.");
      return;
    }
    saveProfile(form);
    setMessage("Profile saved. Eligibility badges will update across exam tabs.");
    onSaved?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.5rem] border border-line bg-surface p-5 shadow-panel md:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
        Your eligibility profile
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">
        Stored locally in your browser. Used to show eligible / not eligible on each SSC exam tab.
        Age is calculated as on <strong className="text-ink">01 Aug 2026</strong> (CGL 2026 reference).
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-ink">
          Date of birth
          <input
            type="date"
            required
            value={form.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
            className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
          />
        </label>

        <label className="text-sm font-semibold text-ink">
          Reservation category
          <select
            value={form.reservation}
            onChange={(e) =>
              update("reservation", e.target.value as EligibilityProfile["reservation"])
            }
            className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
          >
            <option value="GENERAL">General</option>
            <option value="EWS">EWS</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EX_SERVICEMEN">Ex-Servicemen</option>
            <option value="PwBD_GENERAL">PwBD (General)</option>
            <option value="PwBD_OBC">PwBD (OBC)</option>
            <option value="PwBD_SC_ST">PwBD (SC/ST)</option>
          </select>
        </label>

        <label className="text-sm font-semibold text-ink sm:col-span-2">
          Highest education
          <select
            value={form.education}
            onChange={(e) =>
              update("education", e.target.value as EligibilityProfile["education"])
            }
            className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
          >
            <option value="BELOW_10TH">Below 10th</option>
            <option value="TENTH">10th / Matric pass</option>
            <option value="TWELFTH">12th pass</option>
            <option value="DIPLOMA_ENG">Diploma in Engineering</option>
            <option value="GRADUATE">Graduate (any discipline)</option>
            <option value="GRADUATE_MATHS_60_12TH">Graduate + 60% Maths in 12th</option>
            <option value="GRADUATE_STATS">Graduate with Statistics</option>
            <option value="MASTERS_HINDI_ENGLISH">Master&apos;s (Hindi/English rules)</option>
          </select>
        </label>

        <label className="text-sm font-semibold text-ink">
          12th Maths % (optional, for JSO)
          <input
            type="number"
            min={0}
            max={100}
            value={form.mathsPercent12 ?? ""}
            onChange={(e) =>
              update(
                "mathsPercent12",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
          />
        </label>

        <label className="text-sm font-semibold text-ink">
          Nationality
          <select
            value={form.nationality}
            onChange={(e) =>
              update("nationality", e.target.value as EligibilityProfile["nationality"])
            }
            className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
          >
            <option value="INDIAN">Indian citizen</option>
            <option value="NEPAL_BHUTAN">Nepal / Bhutan subject (GoI certificate)</option>
            <option value="INDIAN_ORIGIN_MIGRANT">Indian origin migrant (GoI certificate)</option>
          </select>
        </label>

        <label className="text-sm font-semibold text-ink">
          Gender
          <select
            value={form.gender}
            onChange={(e) => update("gender", e.target.value as EligibilityProfile["gender"])}
            className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
      </div>

      <div className="mt-4 space-y-3">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.meetsQualificationByCutoff}
            onChange={(e) => update("meetsQualificationByCutoff", e.target.checked)}
            className="mt-1"
          />
          I will possess the essential qualification by 01 Aug 2026
        </label>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.willingPhysicalPosts}
            onChange={(e) => update("willingPhysicalPosts", e.target.checked)}
            className="mt-1"
          />
          I am willing to meet physical / medical standards where required
        </label>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.hasBenchmarkDisability}
            onChange={(e) => update("hasBenchmarkDisability", e.target.checked)}
            className="mt-1"
          />
          I have benchmark disability (≥40%) / claiming PwBD
        </label>
      </div>

      {message ? <p className="mt-4 text-sm font-medium text-accent">{message}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-full bg-hero-deep px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-hero-mid"
        >
          Save profile
        </button>
        <button
          type="button"
          onClick={() => {
            clearProfile();
            setForm(emptyProfile);
            setMessage("Profile cleared.");
          }}
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-hero-mid/30 hover:text-ink"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
