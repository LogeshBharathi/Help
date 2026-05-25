import { NextRequest, NextResponse } from "next/server";

import { NOTICE_TYPES } from "@/lib/constants";
import { saveUserPrimaryTag } from "@/lib/db/notices";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { noticeId?: string; tag?: string };
  const noticeId = body.noticeId?.trim();
  const tag = body.tag?.trim();

  if (!noticeId || !tag) {
    return NextResponse.json(
      { error: "Notice id and tag are required." },
      { status: 400 }
    );
  }

  if (!NOTICE_TYPES.includes(tag as (typeof NOTICE_TYPES)[number])) {
    return NextResponse.json({ error: "Invalid notice type tag." }, { status: 400 });
  }

  const updated = saveUserPrimaryTag(noticeId, tag);
  if (!updated) {
    return NextResponse.json({ error: "Notice not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: updated.id,
    userPrimaryTag: updated.userPrimaryTag,
    updatedAt: updated.updatedAt,
  });
}
