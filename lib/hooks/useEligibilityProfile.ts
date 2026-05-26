"use client";

import { useCallback, useEffect, useState } from "react";

import type { EligibilityProfile } from "@/lib/eligibility/types";

export const ELIGIBILITY_PROFILE_STORAGE_KEY = "ssc-eligibility-profile.v1";

const EMPTY_PROFILE: Omit<EligibilityProfile, "updatedAt"> = {
  dateOfBirth: "",
  reservation: "GENERAL",
  education: "GRADUATE",
  mathsPercent12: undefined,
  nationality: "INDIAN",
  gender: "MALE",
  meetsQualificationByCutoff: true,
  willingPhysicalPosts: false,
  hasBenchmarkDisability: false,
};

export function useEligibilityProfile() {
  const [profile, setProfile] = useState<EligibilityProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ELIGIBILITY_PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as EligibilityProfile;
        if (parsed.dateOfBirth) setProfile(parsed);
      }
    } catch {
      setProfile(null);
    } finally {
      setReady(true);
    }
  }, []);

  const saveProfile = useCallback((next: Omit<EligibilityProfile, "updatedAt">) => {
    const withMeta: EligibilityProfile = {
      ...next,
      updatedAt: new Date().toISOString(),
    };
    setProfile(withMeta);
    window.localStorage.setItem(
      ELIGIBILITY_PROFILE_STORAGE_KEY,
      JSON.stringify(withMeta)
    );
    return withMeta;
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    window.localStorage.removeItem(ELIGIBILITY_PROFILE_STORAGE_KEY);
  }, []);

  return {
    profile,
    ready,
    saveProfile,
    clearProfile,
    emptyProfile: EMPTY_PROFILE,
    hasProfile: Boolean(profile?.dateOfBirth),
  };
}
