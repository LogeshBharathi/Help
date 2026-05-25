import { NextRequest, NextResponse } from "next/server";

import { isExamCategory } from "@/lib/categories";
import { listNoticesByCategory, upsertNotices } from "@/lib/db/notices";
import { syncCategoryFromSsc } from "@/lib/ssc/client";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  if (!category || !isExamCategory(category)) {
    return NextResponse.json(
      { error: "A valid category query parameter is required." },
      { status: 400 }
    );
  }

  const shouldSync = request.nextUrl.searchParams.get("sync") === "1";

  if (shouldSync) {
    const synced = await syncCategoryFromSsc(category);
    if (synced.length > 0) {
      upsertNotices(synced, category);
    }
  }

  const payload = listNoticesByCategory(category);
  return NextResponse.json(payload);
}
