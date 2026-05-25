const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatNoticeDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

export function isRecentNotice(isoDate: string, days = 10): boolean {
  const timestamp = new Date(isoDate).getTime();
  if (!Number.isFinite(timestamp)) return false;
  return Date.now() - timestamp <= days * 24 * 60 * 60 * 1000;
}

export function yearOptions(startYear = 2024): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear; year >= startYear; year -= 1) {
    years.push(year);
  }
  return years;
}
