import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meeting } from "@/lib/db/schema";
import { meetingPdfFilename } from "@/lib/meetings";
import { renderMeetingPdf } from "@/lib/pdf/meeting-pdf";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (session?.user.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { id } = await params;
  const [found] = await db.select().from(meeting).where(eq(meeting.id, id));
  if (!found) return new NextResponse("Toplantı bulunamadı.", { status: 404 });

  const pdf = await renderMeetingPdf(found);
  const filename = meetingPdfFilename(found);
  const disposition = new URL(request.url).searchParams.has("download") ? "attachment" : "inline";

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
