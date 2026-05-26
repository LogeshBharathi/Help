import { cn } from "@/lib/cn";
import type { EligibilityStatus } from "@/lib/eligibility/types";

const STYLES: Record<EligibilityStatus, string> = {
  eligible: "border-green-200 bg-green-50 text-green-800",
  ineligible: "border-red-200 bg-red-50 text-red-800",
  partial: "border-amber-200 bg-amber-50 text-amber-900",
  unknown: "border-line bg-surface-soft text-muted",
};

const LABELS: Record<EligibilityStatus, string> = {
  eligible: "Eligible",
  ineligible: "Not eligible",
  partial: "Review",
  unknown: "Check",
};

interface EligibilityBadgeProps {
  status: EligibilityStatus;
  compact?: boolean;
  className?: string;
}

export function EligibilityBadge({ status, compact, className }: EligibilityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        STYLES[status],
        className
      )}
    >
      {status === "eligible" ? (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : status === "ineligible" ? (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      ) : null}
      {compact ? LABELS[status].charAt(0) : LABELS[status]}
    </span>
  );
}
