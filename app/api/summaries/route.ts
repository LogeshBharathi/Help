import { NextRequest, NextResponse } from "next/server";

import { saveManualSummary } from "@/lib/db/notices";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    noticeId?: string;
    summary?: string;
  };

  const noticeId = body.noticeId?.trim();
  const summary = body.summary?.trim();

  if (!noticeId || !summary || summary.length < 10) {
    return NextResponse.json(
      { error: "Notice id and a summary of at least 10 characters are required." },
      { status: 400 }
    );
  }

  const updated = saveManualSummary(noticeId, summary);
  if (!updated) {
    return NextResponse.json({ error: "Notice not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: updated.id,
    summary: updated.summary,
    updatedAt: updated.updatedAt,
  });
}
