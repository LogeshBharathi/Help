import { NextRequest, NextResponse } from "next/server";

import { getNoticeById } from "@/lib/db/notices";

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const notice = getNoticeById(id);

  if (!notice) {
    return NextResponse.json({ error: "Notice not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: notice.id,
    title: notice.title,
    pdfUrl: notice.pdfUrl,
    summary: notice.summary,
    autoSummary: notice.autoSummary,
    userPrimaryTag: notice.userPrimaryTag,
    autoTags: notice.autoTags,
    pdfText: notice.pdfText,
    extractedAt: notice.extractedAt,
    pageCount: notice.pageCount,
  });
}
